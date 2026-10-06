#!/usr/bin/env python3
"""Adds two money questions to "Wat jij biedt" on the makers page: what the maker invests and the
minimum the new founder brings in. Shown in the live preview tile and the confirmation. Refuses to run twice."""
import pathlib, sys
p = pathlib.Path(__file__).resolve().parent.parent / 'design' / 'F-Makers.dc.html'
t = p.read_text()
if 'const INZET =' in t: sys.exit('already applied')
CHIPS = lambda lst, key, lab: f'''            <div style="display: flex; flex-direction: column; gap: 10px">
              <span id="l-{key}" style="font-size: 15px; font-weight: 500">{lab}</span>
              <div role="group" aria-labelledby="l-{key}" style="display: flex; flex-wrap: wrap; gap: 8px">
                <sc-for list="{{{{{lst}}}}}" as="k" hint-placeholder-count="4">
                  <button type="button" class="nm-keuze" onClick="{{{{k.kies}}}}" aria-pressed="{{{{k.aan}}}}" style="appearance: none; margin: 0; min-height: 44px; padding: 0 16px; border-radius: 999px; border: 1px solid {{{{k.rand}}}}; background: {{{{k.bg}}}}; color: {{{{k.fg}}}}; font: inherit; font-size: 16px; font-weight: 500; font-variant-numeric: tabular-nums; cursor: pointer">{{{{k.label}}}}</button>
                </sc-for>
              </div>
            </div>
'''
BLOCK = '''          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr)); gap: 16px 24px; padding-top: 16px; border-top: 1px solid #E2E2DE">
''' + CHIPS('inzetKeuze', 'inzet', 'Wat investeer je zelf in het idee?') + CHIPS('minKeuze', 'mininleg', 'Minimale inleg van de nieuwe founder') + '''          </div>
          <p style="margin: 0; font-size: 14px; line-height: 1.45; color: #4A4A50">Bedragen gaan als investering de BV in, niet naar jou persoonlijk. De minimale inleg zie je terug in de etalage.</p>
'''
REPS = [
 # template: after the hours/intros grid, inside the fieldset
 ('''              </div>
            </div>
          </div>
        </fieldset>

        <div style="display: grid; grid-template-columns: minmax(0, 420px); gap: 24px">''',
  '''              </div>
            </div>
          </div>
''' + BLOCK + '''        </fieldset>

        <div style="display: grid; grid-template-columns: minmax(0, 420px); gap: 24px">'''),
 # preview tile line under the support line
 ('''<span>{{pSteun}}</span>''', '''<span>{{pSteun}}</span>'''),
 # state
 ("    const intros = st.intros ?? [];\n",
  "    const intros = st.intros ?? [];\n    const inzet = st.inzet ?? -1;\n    const minInleg = st.minInleg ?? -1;\n"),
 # options + validation
 ("    const INTRO = ['Klanten', 'Partners', 'Investeerders'];\n",
  "    const INTRO = ['Klanten', 'Partners', 'Investeerders'];\n"
  "    const INZET = ['Alleen tijd', 'Tot € 5.000', '€ 5.000 tot € 25.000', 'Meer dan € 25.000'];\n"
  "    const MININLEG = ['Geen', '€ 2.500', '€ 5.000', '€ 10.000', '€ 25.000'];\n"
  "    const inzetKeuze = INZET.map((label, i) => ({ label: label, aan: inzet === i, ...pil(inzet === i), kies: () => this.setState({ inzet: i }) }));\n"
  "    const minKeuze = MININLEG.map((label, i) => ({ label: label, aan: minInleg === i, ...pil(minInleg === i), kies: () => this.setState({ minInleg: i }) }));\n"),
 ("    if (!akkoord) fouten.push(",
  "    if (inzet < 0) fouten.push('Kies wat je zelf in het idee investeert.');\n    if (minInleg < 0) fouten.push('Kies de minimale inleg van de nieuwe founder.');\n    if (!akkoord) fouten.push("),
 # render values
 ("      urenKeuze: urenKeuze,\n",
  "      urenKeuze: urenKeuze,\n      inzetKeuze: inzetKeuze,\n      minKeuze: minKeuze,\n"
  "      pGeld: 'Inzet maker: ' + (inzet >= 0 ? INZET[inzet].toLowerCase() : 'nog kiezen') + ' · minimale inleg: ' + (minInleg >= 0 ? MININLEG[minInleg].toLowerCase() : 'nog kiezen'),\n"
  "      geldKlaar: (inzet >= 0 && minInleg >= 0) ? 'Je investeert zelf ' + INZET[inzet].toLowerCase() + ' en vraagt een inleg van ' + (minInleg === 0 ? 'nul euro' : 'minimaal ' + MININLEG[minInleg]) + '.' : '',\n"),
 # reset
 ("bew: [true, false, false, false, false], uren: 4, intros: [] })",
  "bew: [true, false, false, false, false], uren: 4, intros: [], inzet: -1, minInleg: -1 })"),
 # confirmation text
 ("Je aanmelding is binnen. {{makersKlaar}} ", "Je aanmelding is binnen. {{makersKlaar}} {{geldKlaar}} "),
]
for a, b in REPS:
    n = t.count(a)
    if n != 1: sys.exit(f'anchor found {n}x: {a[:80]!r}')
    t = t.replace(a, b)
# preview: add a money line right after the support line element
anchor = '<span>{{pSteun}}</span></p>'
if t.count(anchor) != 1:
    # support line may end differently; locate its closing tag
    i = t.index('<span>{{pSteun}}</span>'); j = t.index('\n', i)
    line = t[t.rfind('\n', 0, i) + 1:j]
    t = t[:j] + '\n' + line.replace('{{pSteun}}', '{{pGeld}}').replace('<circle cx="12" cy="12" r="8.5"></circle><path d="M12 7.5V12l3 2"></path>', '<path d="M4 7h16v10H4zM4 11h16M8 15h3"></path>') + t[j:]
else:
    i = t.index(anchor) + len(anchor)
    line = t[t.rfind('\n', 0, t.index(anchor)) + 1:i]
    t = t[:i] + '\n' + line.replace('{{pSteun}}', '{{pGeld}}') + t[i:]
p.write_text(t)
print('money questions added')
