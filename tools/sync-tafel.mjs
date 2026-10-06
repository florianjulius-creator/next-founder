// Writes the vakgebieden of everyone at the table into both F design files.
// The tags are derived from each person's public one-liner (hoofie.nl, the who's who of Deel II).
// The line `const VAK = {...};` lands directly after the `const TAFEL = [...]` array; rerunning replaces it.
// Usage: node tools/sync-tafel.mjs
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const FILES = ['design/F-Bento.dc.html', 'design/F-Makers.dc.html'];

const VAK = {
  'barbara-van-erp': ['Media', 'Abonnementen', 'Doelgroep 50+'],
  'bas-blokhuis': ['Software', 'Zorg', 'Impact'],
  'emilie-oostenbroek': ['Groei', 'Klantervaring', 'Fintech'],
  'florian-julius': ['AI', 'Webontwikkeling', 'MKB'],
  'hugo-hemmen': ['Teams op afstand', 'Tech-werving', 'Opschalen'],
  'jeroen-derwort': ['Games', 'Community', 'Branche'],
  'joachim-de-boer': ['E-commerce', 'Retail', 'Opschalen'],
  'lenneke-van-ingen': ['Talent', 'Casting', 'Serieel ondernemen'],
  'lisa-wals': ['Design', 'Merken', 'Verzamelobjecten'],
  'marco-nobel': ['Vastgoed', 'Investeren', 'Muziek'],
  'marleen-evertsz': ['Fintech', 'Handel', 'Serieel ondernemen'],
  'mike-van-klaveren': ['E-commerce', 'Groothandel', 'Opschalen'],
  'nick-velten': ['Exit', 'Investeren', 'DTC-merken'],
  'niels-verwij': ['E-commerce', 'Bootstrappen', 'Opschalen'],
  'pepijn-meddens': ['Fintech', 'Betalen', 'Venture building'],
  'stefan-witkamp': ['Hardware', 'Smart home', 'Exit'],
  'timothy-scheek': ['Hardware', 'Exit', 'Beveiliging'],
  'alex-butter': ['Techniek', 'Fintech'],
  'giorgio-orsucci': ['Product', 'Systeemontwerp', 'AI'],
  'sander-belaen': ['Apps', 'Gezondheid', 'Indie'],
  'wouter-van-den-hoven': ['Techniek', 'AI', 'Food en landbouw'],
  'ruben-maas': ['Techniek', 'Reizen', 'AI'],
  'guido-schmitz': ['Apps', 'HR-tech', 'Frontlinie'],
  'martin-deumens': ['Merk', 'Design'],
  'gwen': ['Merk', 'Digitaal ontwerp'],
};

const line = '    const VAK = ' + JSON.stringify(VAK).replace(/,"/g, ', "').replace(/":/g, '": ').replace(/","/g, '", "') + ';';

for (const rel of FILES) {
  const file = path.join(root, rel);
  const src = fs.readFileSync(file, 'utf8');
  const start = src.indexOf('    const TAFEL = [\n');
  if (start < 0) throw new Error(`${rel}: anchor "const TAFEL = [" not found`);
  const close = src.indexOf('\n    ];\n', start);
  if (close < 0) throw new Error(`${rel}: end of the TAFEL array ("    ];") not found`);
  const after = close + '\n    ];\n'.length;

  // Every id in TAFEL needs tags, and every tag set must belong to someone at the table.
  const ids = [...src.slice(start, after).matchAll(/"id": "([^"]+)"/g)].map((m) => m[1]);
  const missing = ids.filter((id) => !VAK[id]);
  const extra = Object.keys(VAK).filter((id) => !ids.includes(id));
  if (missing.length || extra.length) throw new Error(`${rel}: VAK and TAFEL differ (missing: ${missing.join(', ') || '-'}; extra: ${extra.join(', ') || '-'})`);

  const rest = src.slice(after);
  const old = rest.match(/^    const VAK = .*;\n/);
  const next = src.slice(0, after) + line + '\n' + (old ? rest.slice(old[0].length) : rest);
  if (next !== src) fs.writeFileSync(file, next);
  console.log(`${rel}: ${next === src ? 'already up to date' : old ? 'VAK replaced' : 'VAK inserted'} (${ids.length} people)`);
}
