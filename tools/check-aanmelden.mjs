// Walks the candidate sign-up flow (/aanmelden/) in a real browser like a visitor: choose an idea, read the deal,
// prepare the pitch, record at Socialjuice, finish. Also checks the hash pre-selection, closed ventures,
// error messages, focus after each step, going back, and that no step scrolls sideways.
// Usage: node tools/build.mjs && node tools/check-aanmelden.mjs   (screenshots land in shots/)
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { chromium } from 'playwright';
import { parseDc, makeComponent, renderBody } from '../site/dc.js';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const pub = path.join(root, 'public');
const shots = path.join(root, 'shots');
fs.mkdirSync(shots, { recursive: true });

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.jpg': 'image/jpeg' };
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

async function open(hash, width) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
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
  await page.goto(base + '/aanmelden/' + hash, { waitUntil: 'networkidle' });
  await page.waitForSelector('html[data-dc="ready"]', { timeout: 5000 }).catch(() => problems.push('runtime never became ready'));
  return { page, problems };
}

// The canvas board height ($preview.height and canvas.json) must match the page in its default state.
async function previewHeight(page) {
  const fonts = await page.evaluate(async () => { await document.fonts.ready; return document.fonts.check('300 40px "Funnel Display"'); });
  if (!fonts) return console.log('SKIP F-Aanmelden.dc.html: preview height (web fonts did not load, height would be off)');
  const want = Math.ceil((await page.evaluate(() => document.documentElement.scrollHeight)) / 10) * 10;
  const props = +fs.readFileSync(path.join(root, 'design/F-Aanmelden.dc.html'), 'utf8').match(/"\$preview":\{"width":1440,"height":(\d+)\}/)[1];
  const board = JSON.parse(fs.readFileSync(path.join(root, 'design/canvas.json'), 'utf8')).boards['F-Aanmelden.dc.html'];
  ok('F-Aanmelden.dc.html: preview height matches the page at 1440px', props === want && board && board.h === want, `(page ${want}, $preview ${props}, canvas.json ${board && board.h})`);
}

const heading = (page) => page.locator('#stap-kop').innerText();
const focusedId = (page) => page.evaluate(() => document.activeElement && document.activeElement.id);
const noSideways = (page) => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth);
const alertText = async (page) => (await page.locator('[role="alert"]').count()) ? (await page.locator('[role="alert"]').innerText()).trim() : '';
const click = async (page, name) => { await page.getByRole('button', { name, exact: true }).click(); await page.waitForTimeout(60); };

for (const width of [1440, 390]) {
  const tag = `@${width}`;
  const { page, problems } = await open('', width);

  ok(`hydration leaves the pre-render untouched ${tag}`, (await page.evaluate(() => window.__mut)) === 0);
  if (width === 1440) await previewHeight(page);
  ok(`starts on step 1 ${tag}`, (await heading(page)) === 'Kies je idee.');
  const openIds = await page.$$eval('.na-ideeen button', (bs) => bs.map((b) => b.id));
  ok(`7 open ideas to choose from ${tag}`, openIds.length === 7, openIds.join(', '));
  const closed = await page.$$eval('.na-dicht button', (bs) => bs.map((b) => b.id + (b.disabled ? '' : ' (enabled!)')));
  ok(`examples and closed ventures cannot be chosen ${tag}`, JSON.stringify(closed) === JSON.stringify(['tafel-12', 'kluscheck', 'restpartij']), closed.join(', '));
  if (width === 390) {
    ok(`phone: compact progress bar instead of the step list ${tag}`,
      (await page.locator('.na-mobiel').isVisible()) && !(await page.locator('.na-stappen').isVisible()));
  }
  ok(`step 1 no sideways scroll ${tag}`, await noSideways(page));
  await page.locator('#flow').screenshot({ path: path.join(shots, `aanmelden-1-${width}.png`) });

  await click(page, 'Verder');
  ok(`continuing without an idea explains why ${tag}`, (await alertText(page)) === 'Kies eerst een idee.', await alertText(page));

  // Keyboard: focus the Exit Buddy tile and press Space.
  await page.locator('#exit-buddy').focus();
  await page.keyboard.press('Space');
  await page.waitForTimeout(60);
  ok(`choosing an idea with the keyboard ${tag}`, (await page.locator('#exit-buddy').getAttribute('aria-pressed')) === 'true');
  ok(`error disappears once an idea is chosen ${tag}`, (await alertText(page)) === '');
  ok(`side card shows the chosen idea ${tag}`, (await page.locator('aside').innerText()).includes('Exit Buddy'));
  ok(`side card keeps the example label for an illustrative founder ${tag}`, (await page.locator('aside').innerText()).includes('Voorbeeldkoppeling'));

  await click(page, 'Verder met Exit Buddy');
  ok(`step 2 shows the deal ${tag}`, (await heading(page)) === 'Wat je aangaat.' && (await page.locator('dl').innerText()).includes('Commerciële CEO'));
  ok(`focus moves to the new step heading ${tag}`, (await focusedId(page)) === 'stap-kop');
  ok(`route starts with the pitch on day 0 ${tag}`, (await page.locator('.na-stap ol li').first().innerText()).includes('Pitch het terug'));
  await click(page, 'Naar je pitch');
  ok(`step 2 needs the agreement ${tag}`, (await alertText(page)).startsWith('Vink aan dat je weet'), await alertText(page));
  await page.getByRole('checkbox', { name: /Ik weet wat ik aanga/ }).click();
  ok(`agreement checkbox ticks ${tag}`, (await page.getByRole('checkbox', { name: /Ik weet wat ik aanga/ }).getAttribute('aria-checked')) === 'true');
  ok(`step 2 no sideways scroll ${tag}`, await noSideways(page));
  await page.locator('#flow').screenshot({ path: path.join(shots, `aanmelden-2-${width}.png`) });

  await click(page, 'Naar je pitch');
  ok(`step 3 prepares the pitch ${tag}`, (await heading(page)) === 'Bereid je pitch voor.');
  ok(`the first question names the idea ${tag}`, (await page.locator('.na-vragen').innerText()).includes('Welk probleem lost Exit Buddy op?'));
  const mocks = await page.$$eval('.na-tel[role="img"]', (els) => els.map((e) => e.getAttribute('aria-label')));
  ok(`four Socialjuice mock screens, each described ${tag}`, mocks.length === 4 && mocks.every((l) => l.startsWith('Voorbeeldscherm')), String(mocks.length));
  ok(`mock screens are not clickable ${tag}`, (await page.locator('.na-tel button, .na-tel a, .na-tel input').count()) === 0);
  ok(`step 3 no sideways scroll ${tag}`, await noSideways(page));
  await page.locator('#flow').screenshot({ path: path.join(shots, `aanmelden-3-${width}.png`) });

  // Back via the step list (desktop) or the Terug button (phone) keeps the choice.
  if (width === 1440) await page.getByRole('button', { name: /^Kies je idee/ }).click();
  else { await click(page, 'Terug'); await click(page, 'Terug'); }
  await page.waitForTimeout(60);
  ok(`going back keeps the chosen idea ${tag}`, (await heading(page)) === 'Kies je idee.' && (await page.locator('#exit-buddy').getAttribute('aria-pressed')) === 'true');
  // Switching idea voids the agreement made for the previous one.
  await page.locator('#biedmeester').click();
  await click(page, 'Verder met Biedmeester');
  ok(`another idea resets the agreement ${tag}`, (await page.getByRole('checkbox', { name: /Ik weet wat ik aanga/ }).getAttribute('aria-checked')) === 'false');
  await page.getByRole('checkbox', { name: /Ik weet wat ik aanga/ }).click();
  await click(page, 'Naar je pitch');
  await click(page, 'Ik ben klaar om op te nemen');

  ok(`step 4 records at Socialjuice ${tag}`, (await heading(page)) === 'Neem op bij Socialjuice.');
  ok(`without a form link the button stays closed ${tag}`, await page.getByRole('button', { name: 'Formulier volgt' }).isDisabled());
  ok(`no placeholder link leaks into the page ${tag}`, (await page.locator('a[href*="["], a[href=""]').count()) === 0);
  ok(`tells which idea to fill in ${tag}`, (await page.locator('.na-stap [data-tone="donker"]').innerText()).includes('Biedmeester'));
  await click(page, 'Afronden');
  ok(`finishing needs the video confirmation ${tag}`, (await alertText(page)) === 'Vink aan dat je video bij Socialjuice staat.', await alertText(page));
  await page.getByRole('checkbox', { name: /Mijn video staat bij Socialjuice/ }).click();
  ok(`step 4 no sideways scroll ${tag}`, await noSideways(page));
  await page.locator('#flow').screenshot({ path: path.join(shots, `aanmelden-4-${width}.png`) });
  await click(page, 'Afronden');
  const done = await page.locator('[role="status"]').innerText();
  ok(`confirmation names the idea and the real founder ${tag}`, done.includes('Je pitch voor Biedmeester ligt bij de makers.') && done.includes('dan kijkt Florian hem'), done.slice(0, 160));
  ok(`focus moves to the confirmation heading ${tag}`, (await focusedId(page)) === 'stap-kop');
  ok(`confirmation no sideways scroll ${tag}`, await noSideways(page));
  await page.locator('#flow').screenshot({ path: path.join(shots, `aanmelden-klaar-${width}.png`) });
  await click(page, 'Meld je voor een ander idee aan');
  ok(`starting over clears the choice ${tag}`, (await heading(page)) === 'Kies je idee.' && (await page.locator('.na-ideeen [aria-pressed="true"]').count()) === 0);

  ok(`no errors, failed requests or 404s ${tag}`, problems.length === 0, problems.join(' | '));
  await page.close();
}

// A link from a dossier pre-selects the idea; a link to a closed venture says why it cannot be chosen.
{
  const { page, problems } = await open('#biedmeester', 1440);
  await page.waitForTimeout(100);
  ok('#biedmeester pre-selects Biedmeester', (await page.locator('#biedmeester').getAttribute('aria-pressed')) === 'true');
  await page.close();
  const b = await open('#kluscheck', 1440);
  await b.page.waitForTimeout(100);
  ok('#kluscheck explains it is not open and selects nothing',
    (await b.page.locator('p[role="status"]').innerText()).startsWith('Kluscheck staat niet open')
      && (await b.page.locator('.na-ideeen [aria-pressed="true"]').count()) === 0);
  ok('hash pages load without errors', problems.length === 0 && b.problems.length === 0, problems.concat(b.problems).join(' | '));
  await b.page.close();
}

// The way in: a dossier button on the home page and the candidate card on /tv/.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  const href = await page.locator('a', { hasText: /^Instappen bij / }).first().getAttribute('href');
  ok('home dossier "Instappen bij …" links to the sign-up with the idea', /^\/aanmelden\/#[a-z0-9-]+$/.test(href || ''), href);
  await page.goto(base + '/tv/', { waitUntil: 'networkidle' });
  ok('tv candidate card links to the sign-up', (await page.locator('a[href="/aanmelden/"]', { hasText: 'Meld je aan voor een idee' }).count()) === 1);
  await page.close();
}

// With a form link configured, step 4 opens it in a new tab (rendered in Node with a test link).
{
  const src = fs.readFileSync(path.join(root, 'design/F-Aanmelden.dc.html'), 'utf8').replace("const SOCIALJUICE = '';", "const SOCIALJUICE = 'https://collect.socialjuice.io/p/test/pitch';");
  const { tpl, props, code } = parseDc(src);
  const comp = makeComponent(new Function('DCLogic', code + '\nreturn Component;'), props, () => {});
  comp.state = { stap: 3, idee: 0, akkoord: true };
  const html = renderBody(tpl, comp.renderVals());
  ok('with a form link, step 4 opens it in a new tab', /<a href="https:\/\/collect\.socialjuice\.io\/p\/test\/pitch" target="_blank" rel="noopener"/.test(html) && !html.includes('Formulier volgt'));
}

await browser.close();
server.close();
console.log(failed ? `${failed} failed` : 'all passed');
process.exit(failed ? 1 : 0);
