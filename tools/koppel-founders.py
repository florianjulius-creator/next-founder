#!/usr/bin/env python3
"""Shows the founder behind each idea on the home page (tile, etalage card, dossier).
Edit KOPPEL to change who is shown; voorbeeld=True puts the label "Voorbeeldkoppeling" next to the name.
Idempotent: refuses to run twice (looks for the FOUNDERS marker)."""
import pathlib, sys
p = pathlib.Path(__file__).resolve().parent.parent / 'design' / 'F-Bento.dc.html'
t = p.read_text()
if 'const KOPPEL =' in t: sys.exit('already applied')

DATA = """    // Wie staat achter elk idee. voorbeeld: true = illustratieve koppeling tot de echte founder bekend is.
    const SANNE = { id: 'sanne-de-wit', naam: 'Sanne de Wit', voornaam: 'Sanne', groep: 'Founder', bedrijf: 'Kluscheck', plaats: 'Utrecht', zin: 'Bouwde drie jaar aan Kluscheck, elke avond na haar werk. Haar vader was aannemer.', foto: '/_blob/42296ccd21f2a4b55b0dfb671171b8dd' };
    const MENSEN = TAFEL.concat([SANNE]);
    VAK['sanne-de-wit'] = ['Bouw', 'Vergunningen', 'Product'];
    const KOPPEL = {
      'Exit Buddy': { id: 'nick-velten', voorbeeld: true },
      'APK Opa': { id: 'mike-van-klaveren', voorbeeld: true },
      'Whoop Dog': { id: 'sander-belaen', voorbeeld: true },
      'Eitje': { id: 'emilie-oostenbroek', voorbeeld: true },
      'Zonde': { id: 'stefan-witkamp', voorbeeld: true },
      'Biedmeester': { id: 'florian-julius', voorbeeld: false },
      'Vaste Prik': { id: 'florian-julius', voorbeeld: false },
      'Tafel 12': { id: 'lenneke-van-ingen', voorbeeld: true },
      'Kluscheck': { id: 'sanne-de-wit', voorbeeld: false, tvDemo: true },
      'Restpartij': { id: 'niels-verwij', voorbeeld: true }
    };
    V.forEach((v) => { const k = KOPPEL[v.naam]; if (k) { v.makerIds = [k.id]; v.koppelVoorbeeld = k.voorbeeld; v.tvDemo = !!k.tvDemo; } });
"""
REPS = [
 # data: after the venture list
 ("    const labels = ['Team', 'Product', 'Klant', 'BV', 'IP-akte'];\n",
  DATA + "    const labels = ['Team', 'Product', 'Klant', 'BV', 'IP-akte'];\n"),
 # maker cards look people up in MENSEN (includes Sanne)
 ("makerKaarten: (v.makerIds || []).map((id) => TAFEL.find((t) => t.id === id))",
  "makerKaarten: (v.makerIds || []).map((id) => MENSEN.find((t) => t.id === id))"),
 ("          naam: t.naam,\n          foto: t.foto,\n          vak: (VAK[t.id] || []).map((x) => ({ t: x })),",
  "          naam: t.naam,\n          foto: t.foto,\n          rol: v.koppelVoorbeeld ? 'Founder · voorbeeldkoppeling' : v.tvDemo ? 'Founder · uit de tv-demo' : 'Founder',\n          vak: (VAK[t.id] || []).map((x) => ({ t: x })),"),
 # row: founder summary for tile, card and dossier
 ("        heeftMakers: (v.makerIds || []).length > 0,\n",
  "        heeftMakers: (v.makerIds || []).length > 0,\n        founder: (() => { const f = MENSEN.find((t) => t.id === (v.makerIds || [])[0]) || { naam: '[FOUNDER]', voornaam: '[FOUNDER]', foto: '' }; return { naam: f.naam, voornaam: f.voornaam, foto: f.foto, label: v.koppelVoorbeeld ? 'Voorbeeldkoppeling' : v.tvDemo ? 'Uit de tv-demo' : '', heeftLabel: !!(v.koppelVoorbeeld || v.tvDemo) }; })(),\n"),
 # template: maker card role
 ("""<span style="font-size: 14px; color: {{d.sub}}">Maker</span></span>""",
  """<span style="font-size: 14px; color: {{d.sub}}">{{m.rol}}</span></span>"""),
 # template: bento tile founder chip above level line
 ("""            <span>{{t.niveau}} · {{t.statusLabel}}</span>""",
  """            <span class="nf-fdr" style="flex-basis: 100%; display: flex; align-items: center; gap: 8px; margin-bottom: 2px"><img src="{{t.founder.foto}}" alt="" width="28" height="28" style="flex: none; width: 28px; height: 28px; border-radius: 999px; object-fit: cover; display: block; box-shadow: 0 0 0 2px {{t.bg}}, 0 0 0 3px {{t.fg}}"><span style="font-size: 14px; font-weight: 600">{{t.founder.naam}}</span></span>
            <span>{{t.niveau}} · {{t.statusLabel}}</span>"""),
 # template: dossier header founder line
 ("""{{d.naam}}</h2>
        <p style="margin: 0; font-size: clamp(19px, 1.8vw, 24px); line-height: 1.35; color: {{d.sub}}; max-width: 40ch; overflow-wrap: break-word">{{d.zin}}</p>""",
  """{{d.naam}}</h2>
        <p style="margin: 0; font-size: clamp(19px, 1.8vw, 24px); line-height: 1.35; color: {{d.sub}}; max-width: 40ch; overflow-wrap: break-word">{{d.zin}}</p>
        <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 12px 16px; margin-top: 6px">
          <img src="{{d.founder.foto}}" alt="" width="56" height="56" style="flex: none; width: 56px; height: 56px; border-radius: 999px; object-fit: cover; display: block; box-shadow: 0 0 0 3px {{d.bg}}, 0 0 0 4.5px {{d.fg}}">
          <span style="display: flex; flex-direction: column; gap: 2px"><span style="font-size: 14px; color: {{d.sub}}">Het idee van</span><span style="font-size: 20px; font-weight: 600; line-height: 1.2">{{d.founder.naam}}</span></span>
          <sc-if value="{{d.founder.heeftLabel}}" hint-placeholder-val="{{true}}"><span style="padding: 2px 10px; border-radius: 999px; border: 1px solid {{d.fg}}; font-size: 13px; font-weight: 500">{{d.founder.label}}</span></sc-if>
        </div>"""),
 # template: etalage card founder line under the one-liner
 ("""            <p style="margin: 0; font-size: 15px; line-height: 1.4; color: #5C5C62">Zoekt <span style="color: #101012; font-weight: 500">{{e.zoekt}}</span></p>""",
  """            <p style="margin: 0; display: flex; align-items: center; gap: 10px; font-size: 15px; line-height: 1.3"><img src="{{e.founder.foto}}" alt="" width="36" height="36" style="flex: none; width: 36px; height: 36px; border-radius: 999px; object-fit: cover; display: block; background: #EEEEE9"><span style="display: flex; flex-direction: column"><span style="color: #5C5C62; font-size: 13px">Het idee van</span><span style="font-weight: 600">{{e.founder.naam}}</span></span><sc-if value="{{e.founder.heeftLabel}}" hint-placeholder-val="{{false}}"><span style="margin-left: auto; padding: 2px 8px; border-radius: 999px; border: 1px solid #C9C9C4; font-size: 12px; font-weight: 500; color: #4A4A50">{{e.founder.label}}</span></sc-if></p>
            <p style="margin: 0; font-size: 15px; line-height: 1.4; color: #5C5C62">Zoekt <span style="color: #101012; font-weight: 500">{{e.zoekt}}</span></p>"""),
]
for a, b in REPS:
    n = t.count(a)
    if n != 1: sys.exit(f'anchor found {n}x: {a[:70]!r}')
    t = t.replace(a, b)
p.write_text(t)
print('founders shown on tiles, cards and dossier')
