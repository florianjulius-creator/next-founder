# Next Founder

Ontwerp en website van Next Founder, een idee uit House of Founders Deel II (Marokko, oktober 2026).
Ventures uit het Huis die blijven liggen komen in een etalage. Een kandidaat krijgt dertig dagen
om zich te bewijzen, daarna stemmen de makers of de venture wordt overgedragen.

- Website: https://next-founder.trx-machine.workers.dev
- Productbeschrijving, toon en doelgroep: [PRODUCT.md](PRODUCT.md)
- Ventures, niveaus en bewijsroute: [VENTURES.md](VENTURES.md)

## Wat staat waar

| Map | Inhoud |
|---|---|
| `design/` | De ontwerpbestanden, precies zoals ze op het Claude Design-canvas staan. Dit is de bron. |
| `assets/` | Portretten, omslagen en cursors. `blob-map.json` koppelt de canvasadressen (`/_blob/<id>`) aan deze bestanden. |
| `site/` | De browsercode die een ontwerp klikbaar maakt (`dc.js`, `runtime.js`) plus morphdom en het favicon. |
| `tools/` | `build.mjs` maakt de website in `public/`, `check.mjs` test hem in een echte browser. |

De website bestaat uit vier pagina's: `/` komt uit `design/F-Bento.dc.html`, `/makers/` uit
`design/F-Makers.dc.html`, `/tv/` uit `design/F-TV.dc.html` en `/aanmelden/` uit `design/F-Aanmelden.dc.html`. De andere bestanden in `design/` zijn eerdere richtingen (A tot en met E, G)
en het stijlbord. Die staan niet op de site.

## Lokaal draaien

```bash
npm install
npm run dev          # bouwt en start de site op http://localhost:8787
```

Testen (de eerste keer ook `npx playwright install chromium`):

```bash
npm run check        # bouwt, klikt de site door en zet screenshots in shots/
```

## Een ontwerp aanpassen

Een `.dc.html`-bestand heeft drie delen:

1. `<helmet>`: fonts en CSS.
2. De opmaak, met `{{gaten}}` voor waarden, `<sc-for list="{{lijst}}" as="x">` voor herhaling en
   `<sc-if value="{{voorwaarde}}">` voor iets wat soms wel en soms niet zichtbaar is.
   Een knop krijgt gedrag via `onClick="{{functie}}"`; formuliervelden via `onChange`.
3. Een `class Component extends DCLogic` met `renderVals()`. Die levert alle waarden en functies voor de
   gaten. Toestand gaat via `this.state` en `this.setState({...})`.

Het hoofdmenu is op elke pagina hetzelfde en komt uit `tools/sync-nav.mjs`. Pas een menu-item daar aan
en draai `node tools/sync-nav.mjs`; `tools/check-nav.mjs` faalt als een pagina een item verliest of verbergt.

Linken naar een andere pagina doe je met de canvasnaam (`F-Makers.dc.html`), ook in data in de code.
De build maakt er de route van; `tools/check-links.mjs` faalt als een link nergens uitkomt.

Het tv-format staat beschreven in [docs/tv-format.md](docs/tv-format.md), de formatbijbel voor zenders en producenten.

Kandidaten melden zich aan via Socialjuice. Hoe dat werkt en wat er nog ingericht moet worden: [docs/socialjuice.md](docs/socialjuice.md).

Werkwijze: pas het bestand in `design/` aan, draai `npm run check` en open een pull request.
Florian zet wijzigingen terug op het canvas en zet de site live.

Nieuwe afbeeldingen zet je in `assets/` en verwijs je aan als `/assets/<map>/<bestand>`. Op de site werkt
dat meteen. Op het canvas pas nadat de afbeelding daar ook is geüpload.

## Live zetten

```bash
npm run deploy       # bouwt en zet public/ op Cloudflare (Workers static assets)
```

Dit vraagt toegang tot het Cloudflare-account van Florian.

## Goed om te weten

- Teksten tussen blokhaken, zoals `[NAMEN MAKERS]` en `[VERGOEDING]`, zijn nog niet ingevuld.
  Ventures met het label Voorbeeld zijn verzonnen.
- De portretten en profielen in "Aan tafel in Deel II" komen van hoofie.nl, de who's who van Deel II
  (samengesteld door Wouter van den Hoven, met opt-out). Wil iemand eraf, haal die persoon dan uit de lijst
  `TAFEL` in beide F-bestanden en uit `assets/portretten/`.
- De site vraagt zoekmachines om niet te indexeren (`noindex`), omdat het nog een ontwerp is.
- De referentiebeelden van het bord "Vijf stijlen uit Mobbin" staan niet in deze repo; ze zijn van derden.
  Het bord linkt naar de bron op Mobbin.
