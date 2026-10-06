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

// Home: venture switch, filter, follow
{
  const { page, problems } = await open('/', 1440);
  const mut = await page.evaluate(() => window.__mut);
  ok('home: hydration leaves the pre-render untouched', mut === 0, `(${mut} DOM changes)`);
  await page.locator('a.nf-tile').nth(2).click();
  ok('home: clicking a tile opens its dossier', /Whoop Dog/.test(await page.locator('#dossier').innerText()));
  await page.locator('#etalage button', { hasText: 'Sleutelklaar' }).first().click();
  const shown = await page.locator('#etalage button[aria-label^="Volg "]').count();
  ok('home: Sleutelklaar filter shows 3 ventures', shown === 3, `(saw ${shown})`);
  await page.locator('#etalage button[aria-label^="Volg "]').first().click();
  ok('home: follow updates the count line', (await page.getByText('Je volgt 1 venture.').count()) === 1);
  ok('home: no errors or missing files', problems.length === 0, problems.join(' | '));
  await page.screenshot({ path: path.join(shots, 'home-desktop.png'), fullPage: true });
  await page.close();
}

// Makers: typing keeps focus, validation, submit
{
  const { page, problems } = await open('/makers/', 1440);
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
