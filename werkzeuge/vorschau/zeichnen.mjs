// Zeichnet die Linkvorschau von raban.ai (og:image, 1200 × 630) als Karte: Salbei, „Raban" oben links,
// das Zeichen oben rechts, darunter der Leitsatz des Heros, je Sprache ein Bild nach `public/vorschau/`. Inter statt SF,
// weil SF nur für Apple-Oberflächen lizenziert ist. Aufruf: siehe README.md.

import { mkdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import { homedir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const HIER = dirname(fileURLToPath(import.meta.url))
const APP = resolve(process.env.RABAN_APP_FRONTEND ?? join(homedir(), 'raban/app/frontend'))
const ZIEL = resolve(HIER, '../../public/vorschau')

const { chromium } = createRequire(join(APP, 'package.json'))('playwright')

// Der Leitsatz genau wie im Hero (app/(public)/copy.ts), in denselben drei Zeilen, Englisch in
// Großschreibung wie dort per CSS.
const LEITSATZ = {
  de: 'Behält Wissen\nwenn Leute\ngehen.',
  en: 'Keeps knowledge\nwhen people\nleave.',
}

const karte = (sprache) => `<!doctype html>
<html lang="${sprache}">
<head>
<meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=block">
<style>
  * { margin: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px; padding: 76px 84px;
    background: #ABBAB9; color: #1E1E1E;
    font-family: Inter, sans-serif;
    display: flex; flex-direction: column; justify-content: space-between;
  }
  /* „Raban" im Gewicht der Navbar (440, app/components/link-style.tsx), der Leitsatz wie der Hero:
     570, Zeilenabstand 0,86, Laufweite -0,035em (app/(public)/page.tsx). */
  .marke { display: flex; align-items: center; justify-content: space-between; font-size: 52px; font-weight: 440; letter-spacing: -0.02em; }
  .marke svg { width: 64px; height: 64px; }
  h1 {
    font-size: 116px; font-weight: 570; line-height: 0.86; letter-spacing: -0.035em;
    white-space: pre-line;
  }
  h1:lang(en) { text-transform: capitalize; }
</style>
</head>
<body>
  <div class="marke">
    Raban
    <svg viewBox="0 0 100 100"><rect width="100" height="100" rx="24" fill="#000"/><circle cx="72" cy="72" r="9.5" fill="#fff"/></svg>
  </div>
  <h1>${LEITSATZ[sprache]}</h1>
</body>
</html>`

mkdirSync(ZIEL, { recursive: true })
const browser = await chromium.launch()
const seite = await browser.newPage({ viewport: { width: 1200, height: 630 } })
for (const sprache of Object.keys(LEITSATZ)) {
  await seite.setContent(karte(sprache), { waitUntil: 'networkidle' })
  await seite.evaluate(() => document.fonts.ready)
  await seite.screenshot({ path: join(ZIEL, `${sprache}.png`) })
  console.log(`public/vorschau/${sprache}.png`)
}
await browser.close()
