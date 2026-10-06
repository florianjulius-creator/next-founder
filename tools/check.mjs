// Opens the built site in a real browser and clicks through it like a visitor.
// Usage: npm run check   (builds first; screenshots land in shots/)
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const pub = path.join(root, 'public');
const shots = path.join(root, 'shots');
fs.mkdirSync(shots, { recursive: true });

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp' };
const server = http.createServer((req, res) => {
  let p = path.join(pub, decodeURIComponent(req.url.split(/[?#]/)[0]));
  if (p.endsWith('/')) p += 'index.html';
  if (!p.startsWith(pub) || !fs.existsSync(p)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
}).listen(0);
const base = `http://localhost:${server.address().port}`;

let failed = 0;
const ok = (name, pass, detail = '') => { console.log(`${pass ? 'PASS' : 'FAIL'} ${name}${pass ? '' : ' ' + detail}`); if (!pass) failed++; };

const browser = await chromium.launch();

async function open(route, width) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
  // Count DOM changes inside <body> made after parsing ends, i.e. by the runtime's first render.
  await page.addInitScript(() => {
    window.__mut = -1;
    new MutationObserver((recs) => {
      if (window.__mut >= 0) window.__mut += recs.filter((r) => document.body && document.body.contains(r.target)).length;
    }).observe(document, { subtree: true, childList: true, attributes: true, characterData: true });
    document.addEventListener('readystatechange', () => { if (document.readyState === 'interactive') window.__mut = 0; });
  });
  const problems = [];
  page.on('pageerror', (e) => problems.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') problems.push('console: ' + m.text()); });
  page.on('response', (r) => { if (r.url().startsWith(base) && r.status() >= 400) problems.push(`${r.status()} ${r.url()}`); });
  await page.goto(base + route, { waitUntil: 'networkidle' });
  await page.waitForSelector('html[data-dc="ready"]', { timeout: 5000 }).catch(() => problems.push('runtime never became ready'));
  return { page, problems };
}

// The canvas board height ($preview.height and canvas.json) must match the page in its default state.
const canvas = JSON.parse(fs.readFileSync(path.join(root, 'design/canvas.json'), 'utf8'));
async function previewHeight(page, file) {
  const fonts = await page.evaluate(async () => { await document.fonts.ready; return document.fonts.check('300 40px "Funnel Display"'); });
  if (!fonts) return console.log(`SKIP ${file}: preview height (web fonts did not load, height would be off)`);
  const want = Math.ceil((await page.evaluate(() => document.documentElement.scrollHeight)) / 10) * 10;
  const props = +fs.readFileSync(path.join(root, 'design', file), 'utf8').match(/"\$preview":\{"width":1440,"height":(\d+)\}/)[1];
  ok(`${file}: preview height matches the page at 1440px`, props === want && canvas.boards[file].h === want, `(page ${want}, $preview ${props}, canvas.json ${canvas.boards[file].h})`);
}

// Home: venture switch, filter, follow
{
  const { page, problems } = await open('/', 1440);
  const mut = await page.evaluate(() => window.__mut);
  ok('home: hydration leaves the pre-render untouched', mut === 0, `(${mut} DOM changes)`);
  await previewHeight(page, 'F-Bento.dc.html');
  ok('home: nav links to the table', (await page.locator('header a[href="#tafel"]').count()) === 1 && (await page.locator('section#tafel').count()) === 1);
  ok('home: the route has six steps', (await page.locator('#route button[aria-controls^="stap-"]').count()) === 6);

  // Vraag de tafel: default query, typing (diacritics ignored), chips, empty state
  const vraagKaarten = () => page.locator('#vraag ul > li').count();
  ok('home: Vraag de tafel starts with e-commerce', (await page.getByText('3 mensen aan tafel weten van e-commerce.').count()) === 1 && (await vraagKaarten()) === 3);
  await page.locator('#f-zoek').fill('Fintéch');
  ok('home: Vraag de tafel matches without diacritics', (await page.getByText('4 mensen aan tafel weten van fintéch.').count()) === 1 && (await vraagKaarten()) === 4);
  await page.locator('#f-zoek').fill('xyz');
  ok('home: Vraag de tafel shows the empty state', (await page.getByText("Niemand aan tafel met 'xyz'. Probeer een ander vakgebied.").count()) === 1 && (await vraagKaarten()) === 0);
  await page.locator('#vraag button', { hasText: 'Hardware' }).click();
  ok('home: Vraag de tafel chip sets the query', (await page.locator('#f-zoek').inputValue()) === 'Hardware' && (await vraagKaarten()) === 2);

  // Verdienmodel: the toggle swaps the deal section and the dossier
  await page.locator('#deal button', { hasText: 'Eenmalige fee' }).click();
  const deal = await page.locator('#deal').innerText();
  ok('home: fee model swaps the deal text', /Je wordt eigenaar van alle aandelen\./.test(deal) && /Platformfee/.test(deal) && !/80 tot 90%/.test(deal)
    && /Eigenaar van alle aandelen/.test(await page.locator('#dossier').innerText()));
  await page.locator('#deal button', { hasText: 'Belang' }).click();
  ok('home: belang model restores the deal text', /80 tot 90%/.test(await page.locator('#deal').innerText()));

  // Makers per venture: Florian on his own ventures, placeholders elsewhere
  await page.locator('a.nf-tile', { hasText: 'Biedmeester' }).click();
  const bm = await page.locator('#dossier').innerText();
  ok('home: Biedmeester dossier shows its maker', /Florian Julius/.test(bm) && /Begeleidt nu 0 van max \[MAX\] ventures/.test(bm) && /Ingebracht door Florian/.test(bm));
  await page.locator('a.nf-tile').nth(2).click();
  ok('home: clicking a tile opens its dossier', /Whoop Dog/.test(await page.locator('#dossier').innerText()));
  await page.locator('#etalage button', { hasText: 'Sleutelklaar' }).first().click();
  const shown = await page.locator('#etalage button[aria-label^="Volg "]').count();
  ok('home: Sleutelklaar filter shows 3 ventures', shown === 3, `(saw ${shown})`);
  await page.locator('#etalage button[aria-label^="Volg "]').first().click();
  ok('home: follow updates the count line', (await page.getByText('Je volgt 1 venture.').count()) === 1);
  const koffie = page.locator('#dossier button', { hasText: 'Plan koffie met de maker' });
  await koffie.click();
  ok('home: koffie button shows the confirmation', (await page.getByText('Je koffieverzoek voor Whoop Dog staat klaar.', { exact: false }).count()) === 1 && (await koffie.count()) === 0);
  await page.locator('a.nf-tile', { hasText: 'Kluscheck' }).click();
  ok('home: no koffie button on a full venture', (await koffie.count()) === 0 && /\[NAMEN MAKERS\]\. Hier komen de makers/.test(await page.locator('#dossier').innerText()));
  ok('home: no errors or missing files', problems.length === 0, problems.join(' | '));
  await page.screenshot({ path: path.join(shots, 'home-desktop.png'), fullPage: true });
  await page.close();
}

// Makers: typing keeps focus, validation, submit
{
  const { page, problems } = await open('/makers/', 1440);
  await previewHeight(page, 'F-Makers.dc.html');
  ok('makers: the promise has six steps', (await page.locator('#belofte li').count()) === 6);
  await page.locator('button.nm-gezicht', { hasText: 'Florian Julius' }).click();
  ok('makers: person card shows trackrecord and profile link', (await page.getByText('Maker van Biedmeester en Vaste Prik.').count()) === 1
    && /Florian%20Julius/.test(await page.getByRole('link', { name: 'Profiel aanpassen of verwijderen' }).getAttribute('href')));
  await page.locator('#aanmelden button', { hasText: '8 uur' }).click();
  await page.locator('#aanmelden button[role="checkbox"]', { hasText: 'Investeerders' }).click();
  await page.locator('#aanmelden button[role="checkbox"]', { hasText: 'Klanten' }).click();
  ok('makers: Wat jij biedt updates the preview', (await page.getByText("Steun: 8 uur per maand, intro's bij klanten en investeerders").count()) === 1);
  await page.locator('button[type="submit"]').click();
  ok('makers: empty submit marks the name field invalid', (await page.locator('#f-naam').getAttribute('aria-invalid')) === 'true');
  await page.locator('#f-naam').click();
  await page.keyboard.type('Testventure', { delay: 20 });
  ok('makers: typing keeps focus and every letter', (await page.evaluate(() => document.activeElement.id)) === 'f-naam'
    && (await page.locator('#f-naam').inputValue()) === 'Testventure');
  ok('makers: live preview shows the name', (await page.getByText('Testventure').count()) > 0);
  await page.locator('#f-mail').fill('test@voorbeeld.nl');
  await page.locator('button.nm-maker').first().click();
  await page.locator('button[role="checkbox"]:not(.nm-maker)').last().click();
  await page.locator('button[type="submit"]').click();
  ok('makers: complete form shows the confirmation', (await page.getByText('Testventure staat als concept klaar.').count()) === 1);
  await page.locator('button', { hasText: 'Nog een venture aanmelden' }).click();
  ok('makers: a new form resets the support menu', (await page.getByText('Steun: 4 uur per maand', { exact: true }).count()) === 1);
  await page.locator('button', { hasText: 'Eenmalige fee' }).click();
  ok('makers: fee model swaps the return and level text', (await page.getByText('Betaald voor je steun').count()) === 1
    && (await page.getByText('Een eigen belang').count()) === 0 && /Platformfee \[BEDRAG\] bij overdracht\./.test(await page.locator('#aanmelden').innerText()));
  ok('makers: no errors or missing files', problems.length === 0, problems.join(' | '));
  await page.screenshot({ path: path.join(shots, 'makers-desktop.png'), fullPage: true });
  await page.close();
}

// Phone width: no sideways scroll
for (const route of ['/', '/makers/']) {
  const { page } = await open(route, 390);
  const sw = await page.evaluate(() => document.documentElement.scrollWidth);
  ok(`${route} at 390px: no horizontal scroll`, sw <= 390, `(scrollWidth ${sw})`);
  await page.screenshot({ path: path.join(shots, `${route === '/' ? 'home' : 'makers'}-mobile.png`), fullPage: true });
  await page.close();
}

await browser.close();
server.close();
console.log(failed ? `${failed} failed` : 'all passed');
process.exit(failed ? 1 : 0);
