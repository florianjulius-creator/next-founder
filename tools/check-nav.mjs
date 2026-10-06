// Checks that every page shows the full main menu at desktop, tablet and phone width,
// that each menu link lands on a page and section that exist, and takes a screenshot of each header.
// Usage: node tools/build.mjs && node tools/check-nav.mjs   (screenshots land in shots/)
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

const ITEMS = ['De tafel', 'Ventures', 'Bewijsroute', 'Op tv', 'Voor makers'];
const PAGES = { '/': 'home', '/makers/': 'makers', '/tv/': 'tv' };
const browser = await chromium.launch();

for (const [route, name] of Object.entries(PAGES)) {
  for (const width of [1440, 768, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    await page.goto(base + route, { waitUntil: 'networkidle' });
    const menu = await page.$$eval('nav[aria-label="Hoofdmenu"] > a', (as) => as.map((a) => {
      const r = a.getBoundingClientRect();
      const s = getComputedStyle(a);
      return { text: a.textContent.trim(), href: a.getAttribute('href'), cta: a.classList.contains('nf-navcta'),
        visible: r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && r.right <= innerWidth + 1 };
    }));
    const items = menu.filter((m) => !m.cta);
    ok(`${name} @${width}: menu items in order`, JSON.stringify(items.map((m) => m.text)) === JSON.stringify(ITEMS), items.map((m) => m.text).join(', '));
    const hidden = menu.filter((m) => !m.visible).map((m) => m.text);
    ok(`${name} @${width}: every menu item and the button visible`, hidden.length === 0 && menu.some((m) => m.cta), 'hidden: ' + hidden.join(', '));
    ok(`${name} @${width}: no sideways scroll`, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    if (width !== 768) await page.locator('header').screenshot({ path: path.join(shots, `nav-${name}-${width}.png`) });

    if (width === 1440) {
      for (const m of menu) {
        const target = new URL(m.href, base + route);
        const res = await fetch(target.origin + target.pathname);
        let found = res.ok;
        if (found && target.hash) {
          const html = await res.text();
          found = html.includes(`id="${target.hash.slice(1)}"`);
        }
        ok(`${name}: "${m.text}" goes to ${target.pathname}${target.hash}`, found);
      }
    }
    await page.close();
  }
}

await browser.close();
server.close();
console.log(failed ? `${failed} check(s) failed` : 'all menu checks passed');
process.exit(failed ? 1 : 0);
