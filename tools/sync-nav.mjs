// Writes the same main menu into every page, so no page can lose menu items.
// Each page keeps its own button at the end of the menu (the link with class nf-navcta).
// On phones every item stays visible: the menu wraps to its own rows under the logo.
// Rerunning is safe: the <nav aria-label="Hoofdmenu"> block and the marked CSS block are replaced.
// Usage: node tools/sync-nav.mjs
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const HOME = 'F-Bento.dc.html';
const PAGES = ['F-Bento.dc.html', 'F-Makers.dc.html', 'F-TV.dc.html', 'F-Aanmelden.dc.html'];

// page: the file the item belongs to; hash: the section on that page.
const ITEMS = [
  { label: 'De tafel', page: HOME, hash: '#tafel' },
  { label: 'Ventures', page: HOME, hash: '#etalage' },
  { label: 'Bewijsroute', page: HOME, hash: '#route' },
  { label: 'Op tv', page: 'F-TV.dc.html' },
  { label: 'Voor makers', page: 'F-Makers.dc.html' },
];

const LINK = 'padding: 11px 14px; color: #101012; text-decoration: none';
const CURRENT = 'padding: 11px 14px; color: #101012; text-decoration: underline; text-decoration-thickness: 2px';

const CSS = '/* sync-nav */@media (max-width:640px){.nf-nav{width:100%;gap:2px 0!important}.nf-nav>a{padding:10px 9px!important}.nf-nav>.nf-navcta{margin:6px 0 0!important;flex-basis:100%;justify-content:center}}/* /sync-nav */';
const CSS_RE = /\/\* sync-nav \*\/.*?\/\* \/sync-nav \*\//;

function item(it, page) {
  if (it.page === page && !it.hash) {
    return `      <a href="#top" aria-current="page" style="${CURRENT}">${it.label}</a>`;
  }
  const href = it.page === page ? it.hash : it.page + (it.hash || '');
  return `      <a href="${href}" class="nf-navlink" style="${LINK}">${it.label}</a>`;
}

for (const page of PAGES) {
  const rel = 'design/' + page;
  const file = path.join(root, rel);
  const src = fs.readFileSync(file, 'utf8');

  const navs = src.match(/    <nav aria-label="Hoofdmenu"[\s\S]*?<\/nav>/g) || [];
  if (navs.length !== 1) throw new Error(`${rel}: expected 1 main menu, found ${navs.length}`);
  const ctas = navs[0].match(/      <a [^\n]*margin-left: 8px[^\n]*<\/a>/g) || [];
  if (ctas.length !== 1) throw new Error(`${rel}: expected 1 menu button, found ${ctas.length}`);
  const cta = ctas[0].includes('nf-navcta') ? ctas[0] : ctas[0].replace('<a ', '<a class="nf-navcta" ');

  const nav = [
    '    <nav aria-label="Hoofdmenu" class="nf-nav" style="display: flex; flex-wrap: wrap; align-items: center; gap: 4px; font-size: 16px">',
    ...ITEMS.map((it) => item(it, page)),
    cta,
    '    </nav>',
  ].join('\n');

  let next = src.replace(navs[0], nav);
  // The old phone rule hid most items; drop it wherever it still exists.
  next = next.replace('@media (max-width:640px){.nf-navtekst{display:none}}\n', '').replace('.nf-navtekst{display:none}', '');
  if (CSS_RE.test(next)) next = next.replace(CSS_RE, CSS);
  else {
    const at = next.indexOf('</style>');
    if (at < 0) throw new Error(`${rel}: no </style> to put the menu CSS in`);
    next = next.slice(0, at) + CSS + '\n' + next.slice(at);
  }
  if (next.includes('nf-navtekst')) throw new Error(`${rel}: nf-navtekst still used somewhere`);

  if (next !== src) fs.writeFileSync(file, next);
  console.log(`${rel}: ${next === src ? 'already up to date' : 'menu written'} (${ITEMS.length} items)`);
}
