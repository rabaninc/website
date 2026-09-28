// Nimmt die vier Bilder der Raban-App für raban.ai auf: die echte Oberfläche (Vite, Testmodus) gegen die
// Attrappe aus dem App-Repo, die Inhalte aus `daten.mjs` über `page.route`. Aufruf: siehe README.md.

import { spawn } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import { homedir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as D from './daten.mjs'

const HIER = dirname(fileURLToPath(import.meta.url))
const APP = resolve(process.env.RABAN_APP_FRONTEND ?? join(homedir(), 'raban/app/frontend'))
const ZIEL = resolve(process.env.RABAN_BILDER_ZIEL ?? join(HIER, '../../public/app'))
const ATTRAPPE_PORT = process.env.RABAN_ATTRAPPE_PORT ?? '8876'
const VITE_PORT = process.env.RABAN_VITE_PORT ?? '4283'
const BASIS = `http://127.0.0.1:${VITE_PORT}`
const NUR = (process.env.NUR ?? '').split(',').filter(Boolean)

const { chromium } = createRequire(join(APP, 'package.json'))('playwright')

// ---- Server --------------------------------------------------------------------------------------

async function erreichbar(url) {
  try {
    return (await fetch(url)).ok
  } catch {
    return false
  }
}

async function warteAuf(url, sekunden = 60) {
  for (let i = 0; i < sekunden * 4; i += 1) {
    if (await erreichbar(url)) return
    await new Promise((r) => setTimeout(r, 250))
  }
  throw new Error(`${url} antwortet nicht`)
}

const gestartet = []

function starte(befehl, argumente, umgebung) {
  const kind = spawn(befehl, argumente, { cwd: APP, env: { ...process.env, ...umgebung }, stdio: 'ignore', detached: true })
  gestartet.push(kind)
  return kind
}

function alleStoppen() {
  for (const kind of gestartet) {
    try {
      process.kill(-kind.pid, 'SIGTERM')
    } catch {
      // schon weg
    }
  }
}

async function serverBereit() {
  const gesund = `http://127.0.0.1:${ATTRAPPE_PORT}/api/health`
  if (!(await erreichbar(gesund))) {
    starte('node', ['attrappe/server.ts'], { RABAN_ATTRAPPE_PORT: ATTRAPPE_PORT })
    await warteAuf(gesund)
  }
  if (!(await erreichbar(BASIS))) {
    starte('npx', ['vite', '--mode', 'test', '--host', '127.0.0.1', '--port', VITE_PORT, '--strictPort'], { RABAN_BACKEND_PORT: ATTRAPPE_PORT })
    await warteAuf(BASIS)
  }
}

// ---- Seite vorbereiten ---------------------------------------------------------------------------

const SDP_ANTWORT = 'v=0\r\no=- 2 2 IN IP4 127.0.0.1\r\ns=-\r\nm=audio 9 UDP/TLS/RTP/SAVPF 111\r\n'

/**
 * Antworten der API für ein Bild. Was hier nicht steht, beantwortet die Attrappe.
 * `verlauf` ist der Verlauf des laufenden Gesprächs, `titel` sein Name im Menü.
 */
async function apiNachstellen(page, { verlauf, titel, faden = null }) {
  await page.route('**/api/**', async (route) => {
    const url = new URL(route.request().url())
    const pfad = url.pathname
    const json = (daten) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(daten) })
    switch (pfad) {
      case '/api/me':
        return json(D.ME)
      case '/api/einrichtung':
        return json({ eingerichtet: true })
      case '/api/personen':
        return json(D.PERSONEN)
      case '/api/gespraech/liste':
        return json(D.menueListe(titel))
      case '/api/gespraech/verlauf':
        return json(verlauf)
      case '/api/anfragen':
        return json(url.searchParams.get('rolle') === 'empfaenger' ? D.ANFRAGEN_AN_MICH : [])
      case '/api/ausloeser/meine':
        return json([])
      case '/api/sprache/weg':
        return json({ sprachweg: 'gpt-live' })
      case '/api/sprache/gpt-live/sitzung':
        return json({ sitzung_id: 'live-bild', sdp: SDP_ANTWORT, denker: 'bild', stimme: 'bild' })
      case '/api/gespraech/strom':
        if (!faden) return route.fulfill({ status: 404, body: '' })
        return route.fulfill({
          status: 200,
          headers: { 'content-type': 'text/event-stream', 'cache-control': 'no-cache' },
          body: `: verbunden\n\ndata: ${JSON.stringify(faden)}\n\n`,
        })
      default:
        return route.fallback()
    }
  })
}

/** Einstellungen der Sitzung, wie ein Mensch sie vorher gewählt hätte: Menü offen, Weg, Tastatur. */
async function sitzungVorbelegen(page, { weg, tastatur }) {
  await page.addInitScript(
    ({ weg, tastatur }) => {
      try {
        localStorage.setItem('raban.pwa-hinweis', 'gesehen')
        sessionStorage.setItem('raban.menue', 'offen')
        if (weg) sessionStorage.setItem('raban.weg', weg)
        else sessionStorage.removeItem('raban.weg')
        sessionStorage.setItem('raban.tastatur', tastatur ? 'an' : 'aus')
      } catch {
        // egal
      }
    },
    { weg, tastatur },
  )
}

/** WebRTC und Mikrofon als Attrappe: Die Sprachebene baut ihre Sitzung ohne echten Dienst auf. */
async function spracheNachstellen(page) {
  await page.addInitScript(() => {
    const stand = { kanalname: '', ereignis: () => {} }
    window.__rtc = stand
    class Kanal {
      readyState = 'open'
      hoerer = {}
      constructor(label) {
        this.label = label
      }
      addEventListener(art, f) {
        ;(this.hoerer[art] ??= []).push(f)
      }
      send() {}
      close() {}
      melde(art, e) {
        for (const f of this.hoerer[art] ?? []) f(e)
      }
    }
    class Verbindung {
      connectionState = 'connected'
      iceGatheringState = 'complete'
      localDescription = null
      kanal = null
      hoerer = {}
      addEventListener(art, f) {
        ;(this.hoerer[art] ??= []).push(f)
      }
      addTrack() {}
      createDataChannel(label) {
        stand.kanalname = label
        this.kanal = new Kanal(label)
        stand.ereignis = (roh) => this.kanal?.melde('message', { data: roh })
        return this.kanal
      }
      async createOffer() {
        return { type: 'offer', sdp: 'v=0\r\no=- 1 1 IN IP4 127.0.0.1\r\ns=-\r\nm=audio 9 UDP/TLS/RTP/SAVPF 111\r\n' }
      }
      async setLocalDescription(b) {
        this.localDescription = b
      }
      async setRemoteDescription() {
        const strom = new MediaStream()
        for (const f of this.hoerer.track ?? []) f({ streams: [strom], track: null })
      }
      close() {}
    }
    window.RTCPeerConnection = Verbindung
    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: { getUserMedia: async () => ({ getTracks: () => [{ stop() {} }] }) },
    })
  })
}

async function anmelden(page, ziel) {
  await page.goto(`${BASIS}${ziel}`)
  await page.getByLabel('E-Mail').fill(D.ICH.email)
  // Kein echtes Passwort: Die Attrappe nimmt jedes außer „falsch“.
  await page.getByLabel('Passwort').fill('beliebig')
  await page.getByRole('button', { name: 'Anmelden' }).click()
  await page.getByTestId('karte').waitFor()
  await page.getByTestId('seitenleiste-person').filter({ hasText: D.ICH.anzeigename }).waitFor()
  // Das Menü gleitet herein; erst wenn die Karte daneben steht, ist das Bild ruhig.
  for (let i = 0; i < 40; i += 1) {
    const box = await page.getByTestId('karte').boundingBox()
    if (box && box.x >= 220) break
    await page.waitForTimeout(100)
  }
}

/** Kein Fokusrahmen, keine Maus über einer Zeile, keine laufende Einblendung. */
async function beruhigen(page) {
  await page.evaluate(() => (document.activeElement instanceof HTMLElement ? document.activeElement.blur() : undefined))
  await page.mouse.move(1279, 799)
  await page.waitForTimeout(700)
}

async function aufnehmen(page, name) {
  const pfad = join(ZIEL, name)
  await page.screenshot({ path: pfad, animations: 'disabled', caret: 'hide' })
  console.log(`gespeichert: ${pfad}`)
}

// ---- Die vier Bilder ------------------------------------------------------------------------------

const BILDER = {
  async 'antwort-mit-fundstelle'(page) {
    await sitzungVorbelegen(page, { weg: 'herausfinden', tastatur: true })
    await apiNachstellen(page, { verlauf: D.verlaufFundstelle(), titel: 'Werkszeugnis fehlt' })
    await anmelden(page, '/gespraech')
    await page.getByTestId('stueck-fundstelle').waitFor()
    await beruhigen(page)
    await aufnehmen(page, 'antwort-mit-fundstelle.png')
  },

  async 'bitte-an-person'(page) {
    await sitzungVorbelegen(page, { weg: 'herausfinden', tastatur: true })
    await apiNachstellen(page, { verlauf: D.verlaufBitte(), titel: 'Sperrlager und Freigaben' })
    await anmelden(page, '/gespraech')
    await page.getByTestId('stueck-vorschlag').waitFor()
    await beruhigen(page)
    await aufnehmen(page, 'bitte-an-person.png')
  },

  async formular(page) {
    await sitzungVorbelegen(page, { weg: 'herausfinden', tastatur: false })
    await apiNachstellen(page, { verlauf: D.verlaufFormular(), titel: 'Lieferantenselbstauskunft' })
    await anmelden(page, '/gespraech')
    await page.getByTestId('stueck-formular').waitFor()
    await page.waitForTimeout(500)
    // Der Verlauf steht unten; für das Bild rollt er so weit hoch, dass das Formular oben beginnt.
    await page.evaluate(() => {
      const verlauf = document.querySelector('[data-testid="verlauf"]')
      const erste = document.querySelector('[data-testid="beitrag"]')
      if (verlauf && erste) verlauf.scrollTop += erste.getBoundingClientRect().top - verlauf.getBoundingClientRect().top - 4
    })
    await beruhigen(page)
    await aufnehmen(page, 'formular.png')
  },

  async 'sprache-faden'(page) {
    await spracheNachstellen(page)
    await sitzungVorbelegen(page, { weg: 'aufnehmen', tastatur: false })
    await apiNachstellen(page, { verlauf: D.verlaufSprache(), titel: null, faden: D.FADEN })
    await anmelden(page, '/gespraech')
    await page.getByTestId('knopf-sprachmodus').click()
    await page.getByTestId('sprachmodus-gptlive').waitFor()
    for (let i = 0; i < 40; i += 1) {
      if ((await page.evaluate(() => window.__rtc?.kanalname)) === 'oai-events') break
      await page.waitForTimeout(100)
    }
    // Die Sitzung steht: Raban hört zu.
    await page.evaluate(() => window.__rtc.ereignis(JSON.stringify({ type: 'session.created' })))
    await page.getByTestId('faden-vorlaeufig').waitFor({ timeout: 15000 })
    await beruhigen(page)
    await aufnehmen(page, 'sprache-faden.png')
  },
}

// ---- Lauf ----------------------------------------------------------------------------------------

mkdirSync(ZIEL, { recursive: true })
let browser
try {
  await serverBereit()
  browser = await chromium.launch({ args: ['--use-fake-ui-for-media-stream', '--autoplay-policy=no-user-gesture-required'] })
  for (const [name, schiessen] of Object.entries(BILDER)) {
    if (NUR.length && !NUR.includes(name)) continue
    const kontext = await browser.newContext({
      // Das Sprachbild ist niedriger: Der Faden steht oben, Rabans Gesicht unten, und bei
      // 800 Punkten Höhe bliebe dazwischen eine leere halbe Karte.
      viewport: { width: 1280, height: name === 'sprache-faden' ? 520 : 800 },
      deviceScaleFactor: 2,
      colorScheme: 'light',
      locale: 'de-DE',
      timezoneId: 'Europe/Berlin',
      permissions: ['microphone'],
    })
    const page = await kontext.newPage()
    try {
      await schiessen(page)
    } finally {
      await kontext.close()
    }
  }
} finally {
  await browser?.close()
  alleStoppen()
}
