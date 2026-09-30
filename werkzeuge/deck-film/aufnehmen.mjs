// Filmt das Pitch-Deck auf /about (app/components/pitch/slide-stack.tsx): lädt die Seite in
// Chromium ohne Fenster (echte Animationsbilder), scrollt zu genauen Deck-Positionen, lässt das
// Nachgleiten ausklingen und legt die Bilder als Kontaktbogen je Bildschirmgröße ab — dazu einen
// Bewegungsstreifen, aufgenommen, während ein echtes Mausrad von Folie 4 zu 5 dreht. Aufruf: siehe
// README.md.
//
// Die Deck-Position t (in Folien, 0 … n−1) liest das Skript aus der Seite: auf der Desktop-Bühne
// (`data-deck-track`, ab 1024px) liegt t linear auf der Scrollstrecke; auf dem Handy treiben die
// Texte (`data-deck-text`) das Deck, jeder Text landet unter dem Deck-Fenster (`data-deck-window`)
// — TURN und UNDER wie in slide-stack.tsx.

import { mkdirSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { homedir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const HIER = dirname(fileURLToPath(import.meta.url))
const APP = resolve(process.env.RABAN_APP_FRONTEND ?? join(homedir(), 'raban/app/frontend'))
const { chromium } = createRequire(join(APP, 'package.json'))('playwright')

const [basis = 'http://localhost:3000', ziel = join(HIER, 'bilder'), name = 'deck'] = process.argv.slice(2)
mkdirSync(ziel, { recursive: true })

const T = (process.env.FILM_T ?? '0,1,2,3,4,4.15,4.3,4.45,4.6,4.75,4.9,5,8').split(',').map(Number)
const GROESSEN = {
  desktop: { viewport: { width: 1440, height: 900 }, massstab: 0.5, spalten: 3 },
  laptop: { viewport: { width: 1280, height: 720 }, massstab: 0.5, spalten: 3 },
  handy: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, massstab: 0.5, spalten: 7 },
  'handy-klein': { viewport: { width: 375, height: 667 }, isMobile: true, hasTouch: true, massstab: 0.5, spalten: 7 },
}
const WELCHE = (process.env.FILM_GROESSEN ?? 'desktop,handy').split(',')
const TURN = 0.3
const UNDER = 16

const warte = (ms) => new Promise((r) => setTimeout(r, ms))

// Scrollt so, dass das Deck bei t steht; sagt, ob die Seite überhaupt ein Deck zeigt.
async function zuT(page, t) {
  return page.evaluate(
    ({ t, TURN, UNDER }) => {
      const track = document.querySelector('[data-deck-track]')
      if (!track || track.offsetParent === null) return null
      const n = Number(track.getAttribute('data-deck-track'))
      if (matchMedia('(min-width: 1024px)').matches) {
        const oben = track.getBoundingClientRect().top + scrollY
        const strecke = track.offsetHeight - innerHeight
        scrollTo({ top: oben + (strecke * t) / (n - 1), behavior: 'instant' })
        return { n, buehne: 'desktop' }
      }
      // Handy: zweimal, weil das Deck-Fenster erst beim Scrollen festklebt.
      const texte = [...document.querySelectorAll('[data-deck-text]')]
      const fenster = document.querySelector('[data-deck-window]')
      for (let mal = 0; mal < 2; mal++) {
        const k = Math.floor(t + 1e-9)
        const f = t - k
        if (f < 1e-6 && k === 0) {
          scrollTo({ top: 0, behavior: 'instant' })
          break
        }
        const ruhe = fenster.getBoundingClientRect().bottom + UNDER
        const drehung = innerHeight * TURN
        const text = f < 1e-6 ? texte[k] : texte[k + 1]
        const soll = f < 1e-6 ? ruhe - 8 : ruhe + drehung * (1 - f)
        scrollTo({ top: Math.max(0, scrollY + text.getBoundingClientRect().top - soll), behavior: 'instant' })
      }
      return { n, buehne: 'handy' }
    },
    { t, TURN, UNDER },
  )
}

async function bogen(browser, bilder, spalten, titel, datei) {
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } })
  const zellen = bilder
    .map(
      (b) =>
        `<figure><img src="data:image/png;base64,${b.png.toString('base64')}"><figcaption>${b.text}</figcaption></figure>`,
    )
    .join('')
  await page.setContent(`<!doctype html><html><body style="margin:0;padding:16px;background:#222;font:14px/1.3 ui-monospace,monospace;color:#eee">
    <div style="margin:0 0 12px">${titel}</div>
    <div style="display:grid;grid-template-columns:repeat(${spalten},max-content);gap:12px">${zellen}</div>
    <style>figure{margin:0}img{display:block;outline:1px solid #555}figcaption{padding:4px 0}</style>
  </body></html>`)
  await page.screenshot({ path: datei, fullPage: true })
  await page.close()
}

async function kleiner(browser, png, viewport, massstab) {
  const page = await browser.newPage({
    viewport: { width: Math.round(viewport.width * massstab), height: Math.round(viewport.height * massstab) },
  })
  await page.setContent(
    `<body style="margin:0"><img style="width:100%;display:block" src="data:image/png;base64,${png.toString('base64')}"></body>`,
  )
  const aus = await page.screenshot()
  await page.close()
  return aus
}

const browser = await chromium.launch()
try {
  for (const groesse of WELCHE) {
    const { massstab, spalten, ...kontext } = GROESSEN[groesse]
    const ctx = await browser.newContext({ ...kontext, reducedMotion: 'no-preference' })
    const page = await ctx.newPage()
    await page.goto(`${basis}/about`, { waitUntil: 'networkidle' })
    await warte(800)
    const probe = await zuT(page, 0)
    if (!probe) {
      console.log(`[${groesse}] kein Deck zu sehen (reduzierte Bewegung?)`)
      await ctx.close()
      continue
    }
    // Einmal durch, damit alle Bilder geladen sind.
    for (let t = 0; t <= probe.n - 1; t += 1) {
      await zuT(page, t)
      await warte(120)
    }
    const bilder = []
    for (const t of T) {
      await zuT(page, t)
      await warte(900)
      const png = await page.screenshot({ scale: 'css' })
      bilder.push({ png: await kleiner(browser, png, kontext.viewport, massstab), text: `t=${t}` })
      writeFileSync(join(ziel, `${name}-${groesse}-t${t}.png`), png)
    }
    await bogen(browser, bilder, spalten, `${name} · ${groesse} · Ruhelagen`, join(ziel, `${name}-${groesse}-bogen.png`))

    // Bewegung: ein echtes Mausrad von Folie 4 zu 5, Bilder unterwegs.
    await zuT(page, 3)
    await warte(900)
    const strecke = await page.evaluate(
      ({ TURN }) => {
        const track = document.querySelector('[data-deck-track]')
        if (matchMedia('(min-width: 1024px)').matches) {
          return (track.offsetHeight - innerHeight) / (Number(track.getAttribute('data-deck-track')) - 1)
        }
        // Handy: von hier bis Text 5 gelandet ist.
        const texte = [...document.querySelectorAll('[data-deck-text]')]
        const fenster = document.querySelector('[data-deck-window]')
        return texte[4].getBoundingClientRect().top - fenster.getBoundingClientRect().bottom - 16 + innerHeight * TURN * 0.3
      },
      { TURN },
    )
    const schritte = 8
    const bewegung = []
    await page.mouse.move(kontext.viewport.width / 2, kontext.viewport.height / 2)
    const t0 = Date.now()
    for (let i = 0; i < schritte; i++) {
      await page.mouse.wheel(0, strecke / schritte)
      await warte(40)
      const png = await page.screenshot({ scale: 'css' })
      bewegung.push({ png: await kleiner(browser, png, kontext.viewport, massstab), text: `+${Date.now() - t0}ms` })
    }
    for (let i = 0; i < 6; i++) {
      await warte(90)
      const png = await page.screenshot({ scale: 'css' })
      bewegung.push({ png: await kleiner(browser, png, kontext.viewport, massstab), text: `+${Date.now() - t0}ms` })
    }
    await bogen(browser, bewegung, spalten, `${name} · ${groesse} · Mausrad 4→5`, join(ziel, `${name}-${groesse}-bewegung.png`))
    await ctx.close()
  }
} finally {
  await browser.close()
}
console.log(`Bögen in ${resolve(ziel)}`)
