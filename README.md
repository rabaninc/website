# Raban — Website

Die oeffentliche Website von **Raban** (raban.ai). Next.js, statisch, deployt auf Vercel.

**Stand: Grundgeruest.** Struktur, Gestaltung und Navigation stehen; die Texte sind
noch leer und tragen sichtbare Marker. Vor einem Livegang muss

```
grep -rn "<Placeholder" app
```

leer zurueckkommen, und Impressum wie Datenschutz muessen ausgefuellt sein.

## Entwickeln

```bash
npm install
npm run dev
```

Die Arbeitsregeln stehen in [AGENTS.md](AGENTS.md), die Gestaltungssprache in
[.claude/rules/design.md](.claude/rules/design.md) — dort zuerst nachlesen, bevor hier Farben, Abstaende oder
Typografie angefasst werden.

## Seiten

| Pfad | Inhalt |
| --- | --- |
| `/` | Startseite |
| `/product` | wie Raban arbeitet |
| `/about` | wer dahintersteht |
| `/contact` | Kontakt |
| `/legal` | Impressum (§ 5 DDG) |
| `/privacy` | Datenschutzerklaerung |
