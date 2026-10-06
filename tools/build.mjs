// Builds the website in public/ from the canvas files in design/.
// Each page is pre-rendered in its default state and made interactive by site/runtime.js.
// Usage: node tools/build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { parseDc, makeComponent, renderBody } from '../site/dc.js';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const out = path.join(root, 'public');

// Pages on the site. Links between canvas boards (href="F-Makers.dc.html") become these routes.
const PAGES = [
  { src: 'F-Bento.dc.html', file: 'index.html', route: '/', title: 'Next Founder',
    description: 'Ventures uit het Huis zoeken hun volgende founder.' },
  { src: 'F-Makers.dc.html', file: 'makers/index.html', route: '/makers/', title: 'Voor makers · Next Founder',
    description: 'Lever je venture aan bij Next Founder en kies mee wie hem overneemt.' },
];

// Canvas assets live at /_blob/<id>; locally they are named files in assets/.
const blobMap = JSON.parse(fs.readFileSync(path.join(root, 'assets/blob-map.json'), 'utf8'));
const routes = Object.fromEntries(PAGES.map((p) => [p.src, p.route]));

function localize(html, src) {
  html = html.replace(/\/_blob\/([0-9a-f]{32})/g, (_, id) => {
    if (!blobMap[id]) throw new Error(`${src}: asset ${id} has no entry in assets/blob-map.json`);
    return '/assets/' + blobMap[id];
  });
  return html.replace(/href="([\w-]+\.dc\.html)(#[^"]*)?"/g, (m, file, hash = '') => {
    if (!routes[file]) throw new Error(`${src}: links to ${file}, which is not a page in PAGES`);
    return `href="${routes[file]}${hash}"`;
  });
}

const json = (v) => JSON.stringify(v).replace(/</g, '\\u003c');

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

for (const page of PAGES) {
  const src = localize(fs.readFileSync(path.join(root, 'design', page.src), 'utf8'), page.src);
  const { helmet, tpl, props, code } = parseDc(src);
  if (/<\/script/i.test(code)) throw new Error(`${page.src}: component code contains </script>`);
  const factory = new Function('DCLogic', code + '\nreturn Component;');
  const body = renderBody(tpl, makeComponent(factory, props, () => {}).renderVals());
  const html = `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${page.title}</title>
<meta name="description" content="${page.description}">
<meta name="robots" content="noindex">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
${helmet.trim()}
<script>window.__dcFactory = function (DCLogic) {${code}
return Component;
};</script>
<script type="application/json" id="dc-tpl">${json(tpl)}</script>
<script type="application/json" id="dc-props">${json(props)}</script>
<script type="module" src="/runtime.js"></script>
</head>
<body>${body}</body></html>`;
  const dest = path.join(out, page.file);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, html);
  console.log(`built ${page.route} from design/${page.src}`);
}

for (const f of ['runtime.js', 'dc.js', 'morphdom.js', 'favicon.svg']) fs.copyFileSync(path.join(root, 'site', f), path.join(out, f));
fs.cpSync(path.join(root, 'assets'), path.join(out, 'assets'), { recursive: true, filter: (p) => !p.endsWith('blob-map.json') });
console.log('public/ ready');
