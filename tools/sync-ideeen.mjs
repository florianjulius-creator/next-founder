// Copies the ventures and the candidate route from the home page (F-Bento) into the sign-up page (F-Aanmelden),
// so the sign-up flow never offers a venture, status, colour or deal that the shop window no longer shows.
// It renders F-Bento in its default state (candidate view, equity model) and writes the block between
// "// sync-ideeen: begin" and "// sync-ideeen: einde". Rerunning is safe.
// Usage: node tools/sync-ideeen.mjs           write the block
//        node tools/sync-ideeen.mjs --check   fail when the block is out of date (used by npm run check)
import fs from 'node:fs';
import path from 'node:path';
import { parseDc, makeComponent } from '../site/dc.js';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const HOME = path.join(root, 'design/F-Bento.dc.html');
const TARGET = path.join(root, 'design/F-Aanmelden.dc.html');
const BEGIN = '    // sync-ideeen: begin\n';
const END = '    // sync-ideeen: einde\n';

const { props, code } = parseDc(fs.readFileSync(HOME, 'utf8'));
const vals = makeComponent(new Function('DCLogic', code + '\nreturn Component;'), props, () => {}).renderVals();

// Same slug rule as the dossier link in F-Bento ('F-Aanmelden.dc.html#' + slug).
const slug = (s) => s.toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const ideeen = vals.tegels.map((t) => ({
  slug: slug(t.naam), naam: t.naam, werknaam: t.werknaam, zin: t.zin, niveau: t.niveau, zoekt: t.zoekt,
  status: t.status, statusLabel: t.statusLabel, voorbeeld: t.voorbeeld, inleg: t.inleg, dealNa: t.dealNa,
  bg: t.bg, fg: t.fg, sub: t.sub, tone: t.tone,
  founder: { naam: t.founder.naam, voornaam: t.founder.voornaam, foto: t.founder.foto, label: t.founder.heeftLabel ? t.founder.label : '' },
}));
const route = vals.stappen.map((s) => ({ dag: s.dag, titel: s.een.titel, tekst: s.een.tekst }));

if (new Set(ideeen.map((x) => x.slug)).size !== ideeen.length) throw new Error('two ventures share a slug');

const block = BEGIN
  + '    const IDEEEN = ' + JSON.stringify(ideeen) + ';\n'
  + '    const ROUTE = ' + JSON.stringify(route) + ';\n'
  + END;

const src = fs.readFileSync(TARGET, 'utf8');
const a = src.indexOf(BEGIN);
const b = src.indexOf(END);
if (a < 0 || b < a) throw new Error('design/F-Aanmelden.dc.html: sync-ideeen markers not found');
const next = src.slice(0, a) + block + src.slice(b + END.length);

if (process.argv.includes('--check')) {
  if (next !== src) {
    console.log('FAIL design/F-Aanmelden.dc.html is out of date with F-Bento: run node tools/sync-ideeen.mjs');
    process.exit(1);
  }
  console.log(`PASS design/F-Aanmelden.dc.html matches F-Bento (${ideeen.length} ventures, ${route.length} route steps)`);
} else {
  if (next !== src) fs.writeFileSync(TARGET, next);
  console.log(`design/F-Aanmelden.dc.html: ${next === src ? 'already up to date' : 'ventures written'} (${ideeen.length} ventures, ${route.length} route steps)`);
}
