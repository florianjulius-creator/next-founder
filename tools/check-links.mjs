// Checks that no canvas file name (F-Makers.dc.html) survives in the built site, and that every
// internal link on every page, after hydration, lands on a page that exists and on an anchor that exists there.
// Usage: node tools/build.mjs && node tools/check-links.mjs
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const pub = path.join(root, 'public');

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

const PAGES = { '/': 'index.html', '/makers/': 'makers/index.html', '/tv/': 'tv/index.html', '/aanmelden/': 'aanmelden/index.html' };

// 1. Static: the build must have turned every canvas file name into a route, also inside component data.
for (const [route, file] of Object.entries(PAGES)) {
  const left = fs.readFileSync(path.join(pub, file), 'utf8').match(/[\w-]+\.dc\.html/g) || [];
  ok(`${route}: no canvas file names left in the built page`, left.length === 0, [...new Set(left)].join(', '));
}

// 2. Rendered: every same-site link resolves to a 200 page, and its #anchor exists on that page.
const browser = await chromium.launch();
const ids = {};
async function anchorsOf(pathname) {
  if (!ids[pathname]) {
    const p = await browser.newPage();
    await p.goto(base + pathname, { waitUntil: 'networkidle' });
    ids[pathname] = new Set(await p.$$eval('[id]', (els) => els.map((e) => e.id)));
    await p.close();
  }
  return ids[pathname];
}
for (const route of Object.keys(PAGES)) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(base + route, { waitUntil: 'networkidle' });
  const hrefs = [...new Set(await page.$$eval('a[href]', (as) => as.map((a) => a.getAttribute('href'))))];
  const bad = [];
  for (const href of hrefs) {
    const u = new URL(href, base + route);
    if (u.origin !== base) continue;
    const r = await fetch(u.origin + u.pathname);
    if (r.status !== 200) { bad.push(`${href} (${r.status})`); continue; }
    if (u.hash && !(await anchorsOf(u.pathname)).has(decodeURIComponent(u.hash.slice(1)))) bad.push(`${href} (no ${u.hash})`);
  }
  ok(`${route}: all ${hrefs.length} internal links land on a page and anchor that exist`, bad.length === 0, bad.join(', '));
  await page.close();
}

await browser.close();
server.close();
console.log(failed ? `${failed} failed` : 'all passed');
process.exit(failed ? 1 : 0);
