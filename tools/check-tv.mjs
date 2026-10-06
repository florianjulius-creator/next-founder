// Opens the built /tv/ page in a real browser and votes in the demo poll like a visitor.
// Usage: node tools/build.mjs && node tools/check-tv.mjs   (screenshots land in shots/)
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { chromium } from 'playwright';

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

// Desktop: hydration, nav, poll
{
  const { page, problems } = await open('/tv/', 1440);
  const mut = await page.evaluate(() => window.__mut);
  ok('tv: hydration leaves the pre-render untouched', mut === 0, `(${mut} DOM changes)`);
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  console.log(`tv: page height at 1440px in the default state: ${height}px`);
  await page.screenshot({ path: path.join(shots, 'tv-desktop.png'), fullPage: true });

  const nav = page.locator('header nav');
  ok('tv: nav links to Ventures, Voor makers and Meld je aan', (await nav.locator('a[href="/"]').count()) === 1
    && (await nav.locator('a[href="/makers/"]').count()) === 1 && (await nav.locator('a[href="#casting"]').count()) === 1);
  ok('tv: Op tv is the current page', (await nav.locator('a[aria-current="page"]').innerText()).trim() === 'Op tv');

  const dank = 'Je stem is geteld. In de uitzending kiest Sanne zelf.';
  ok('tv: three vote buttons before voting', (await page.locator('button', { hasText: /^Stem op / }).count()) === 3);
  await page.locator('button', { hasText: 'Stem op Yara' }).click();
  const pcts = await page.locator('#demo li span', { hasText: /^\d+%$/ }).allInnerTexts();
  ok('tv: voting shows three percentages', pcts.length === 3, `(saw ${JSON.stringify(pcts)})`);
  ok('tv: Yara leads with 52% after the vote', pcts[0] === '52%', `(saw ${pcts[0]})`);
  ok('tv: the visitor\'s choice is marked', (await page.getByText('Jouw stem').count()) === 1);
  ok('tv: voting shows the thank-you line', (await page.getByText(dank).count()) === 1);
  await page.locator('button', { hasText: 'Stem opnieuw' }).click();
  ok('tv: Stem opnieuw resets the poll', (await page.locator('button', { hasText: /^Stem op / }).count()) === 3
    && (await page.getByText(dank).count()) === 0);
  ok('tv: no errors or missing files', problems.length === 0, problems.join(' | '));
  await page.close();
}

// Phone width: no sideways scroll
{
  const { page, problems } = await open('/tv/', 390);
  const sw = await page.evaluate(() => document.documentElement.scrollWidth);
  ok('tv at 390px: no horizontal scroll', sw <= 390, `(scrollWidth ${sw})`);
  ok('tv at 390px: no errors or missing files', problems.length === 0, problems.join(' | '));
  await page.screenshot({ path: path.join(shots, 'tv-mobile.png'), fullPage: true });
  await page.close();
}

await browser.close();
server.close();
console.log(failed ? `${failed} failed` : 'all passed');
process.exit(failed ? 1 : 0);
