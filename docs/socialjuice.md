# Aanmelden via Socialjuice

Kandidaten melden zich voor een idee aan op `/aanmelden/` (bron: `design/F-Aanmelden.dc.html`).
De site zelf bewaart niets. De echte inzending, met video, naam en e-mail, gaat via een ophaalformulier
van Socialjuice, het videoplatform van Sander Belaen.

De vier stappen op de site:

1. **Kies je idee.** Alleen ventures die open staan en geen voorbeeld zijn. Een link als
   `/aanmelden/#exit-buddy` kiest het idee alvast (de dossierknop "Instappen bij …" op de home doet dat).
2. **Wat je aangaat.** Niveau, wie de makers zoeken, inleg, de deal en de route, plus wie de video ziet.
   De kandidaat vinkt dit aan vóór er iets wordt opgenomen.
3. **Bereid je pitch voor.** Drie vaste vragen, tips en vier mock-ups van het formulier.
4. **Neem op bij Socialjuice.** De knop opent het formulier in een nieuw tabblad.

## Wat Sander inricht

- Een ruimte "Next Founder" met het logo, taal Nederlands.
- Eén ophaalformulier "Pitch het terug": een video van maximaal twee minuten, opnemen of uploaden.
- De drie vragen in beeld: *Welk probleem lost het op?*, *Waarom ben jij de juiste?*, *Waarom nu?*
- Velden: naam, e-mail, **Voor welk idee?** (verplicht) en *Mag je video ook naar de tv-redactie?*
  (ja of nee, standaard nee).
- Video's niet publiceren: geen widget en geen wall. Alleen de makers en het team van House of Founders kijken.
- Bedankscherm: "Dank je. Je pitch is binnen."

## Link invullen

Zet de link van het formulier in `design/F-Aanmelden.dc.html`:

```js
const SOCIALJUICE = 'https://collect.socialjuice.io/p/<ruimte>/<formulier>';
```

Zolang de waarde leeg is, toont stap 4 "Formulier volgt" en blijft de knop dicht. Draai daarna
`npm run check`; die test ook de stand met een ingevulde link. Zet hem live met `npm run deploy`.

## Nog open

- Kan Socialjuice het idee via de link vooraf invullen (URL-parameter of verborgen veld)? Dan kan het veld
  "Voor welk idee?" weg en vult de site het zelf in.
- Kan publiceren voor dit formulier helemaal uit?
- Hoe lang blijft een video staan, en wie verwijdert hem op verzoek? Op de site staan daarvoor
  `[E-MAIL]` en `[DAGEN]`.
- Wie kijkt de video's, en binnen hoeveel dagen? Dat bepaalt `[DAGEN]` in de bevestiging.
- Verwerkersovereenkomst met Socialjuice (die hebben een DPA).

De ventures op de aanmeldpagina komen uit de home. Pas ze daar aan en draai `node tools/sync-ideeen.mjs`.
`npm run check` faalt als de twee uit elkaar lopen.
