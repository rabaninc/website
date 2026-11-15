// Copied from rabaninc/app (`frontend/src/bausteine/rabanPunkte.ts`, 2026-11-15) and kept identical from the next
// comment on, so site and app draw the same sign: change it there first, then copy it here again. Only this type
// stands in for the app's import of its conversation states (`ton/gptlive.ts`); the site draws from `raban-sign.tsx`.
type Anzeigezustand = 'hoert' | 'denkt' | 'spricht' | 'wartet' | 'riss' | 'ende' | 'aus' | 'verbindet' | 'pause'

/**
 * Die Rechnung hinter Rabans Zeichen (Johannes, 14.11.2026): Punkte auf oder in einem Kreis, deren Bewegung sagt, was
 * Raban gerade tut. Es ersetzt die weiße Kugel mit den zwei Augen (11.10.–14.11.2026). Hier nur Zahlen, kein DOM —
 * gezeichnet wird in `RabanZeichen.tsx`. Alle Maße in Halbmessern des Zeichens: Mitte (0, 0), Rand bei 1, y nach unten.
 *
 * Fünf Formen, jede auch als stehendes Bild von den anderen zu unterscheiden:
 *
 * | Form | Bild |
 * | --- | --- |
 * | `aus` | ein einzelner Punkt in der Mitte — Rabans Punkt, wie im App-Symbol |
 * | `ruht` | eine flache Zeile kleiner grauer Punkte, steht still: Raban hört gerade nicht zu (Pause, stumm) |
 * | `hoert` | offen und hohl: Platz für das, was die Person sagt; geht mit dem Pegel am Mikrofon mit |
 * | `denkt` | es dreht sich: denkt nach, sucht, verbindet, die Verbindung hakt |
 * | `spricht` | voll: Rabans Stimme bewegt die Punkte (Scheibe: sie funkeln) |
 *
 * Drei Arten (welche die App zeigt, steht in `RabanZeichen.tsx`; die anderen bleiben auf der Probeseite wählbar):
 * `scheibe` neunzehn Punkte als gefüllter Kreis (in der App seit 15.11.2026), `kranz` acht Punkte auf einem Ring,
 * `reihe` fünf Punkte in einer Reihe, die sich zum Ring biegt.
 *
 * Zwischen zwei Formen wandern die Punkte, sie springen nicht: Jede Form hat ein Gewicht, das an einer Feder hängt
 * (`Lauf`); gezeichnet wird die gewichtete Mischung. Drehwinkel laufen weiter und rasten nur langsam ein.
 */

export type Form = 'aus' | 'ruht' | 'hoert' | 'denkt' | 'spricht'
export const FORMEN: readonly Form[] = ['aus', 'ruht', 'hoert', 'denkt', 'spricht']

export type Art = 'kranz' | 'reihe' | 'scheibe'
export const ARTEN: readonly Art[] = ['kranz', 'reihe', 'scheibe']
export const ANZAHL: Record<Art, number> = { kranz: 8, reihe: 5, scheibe: 19 }

/**
 * Wie die Scheibe spricht (Johannes, 15.11.2026): `funkeln` — jeder Punkt in seinem eigenen Takt, wie stark, sagt die
 * Stimme. Zweite Wahl, falls wir wechseln: `welle` — jede Silbe schwillt in der Mitte an und läuft Ring für Ring hinaus.
 * Verworfen: ein großer Punkt in der Mitte (wie beim Kranz) und eine Welle von links nach rechts.
 */
export type Sprechweise = 'funkeln' | 'welle'
export const SPRECHWEISEN: readonly Sprechweise[] = ['funkeln', 'welle']

export type Punkt = { x: number; y: number; r: number }
/** Was zu zeichnen ist: die Punkte und die Deckkraft des Ganzen (grau = weniger als 1). */
export type Bild = { punkte: Punkt[]; deckkraft: number }
/** Wie laut es gerade ist, je 0–1: am Mikrofon (beim Zuhören) und Rabans Stimme (beim Antworten). */
export type Pegel = { mikrofon?: number; stimme?: number }

/**
 * Welche Form zu welchem Zustand des Gesprächs gehört. Hakt die Verbindung, steht der Sprachweg auf `verbindet` und
 * setzt nur die Marke `riss` — dann dreht es sich wie beim Nachdenken. Stumm gilt nur, solange Raban nicht selbst spricht
 * oder denkt: Was er tut, geht vor.
 */
export function formFuer(zustand: Anzeigezustand, stumm = false, riss = false): Form {
  if (zustand === 'spricht') return 'spricht'
  if (riss || zustand === 'denkt' || zustand === 'riss' || zustand === 'verbindet') return 'denkt'
  if (zustand === 'aus' || zustand === 'ende') return 'aus'
  if (zustand === 'pause' || stumm) return 'ruht'
  return 'hoert'
}

const TAU = Math.PI * 2
const GRAD = Math.PI / 180
const OBEN = -90 * GRAD

/**
 * Was über die Zeit mitläuft: die Uhr, zwei Drehwinkel (Bogenmaß), der geglättete Pegel samt Nachhall und der Pegel von
 * vor 0,11 und 0,22 Sekunden (`echo`: die Welle, die von der Mitte nach außen läuft).
 */
type Uhren = { zeit: number; dreh: [number, number]; pegel: number; nach: number; echo: [number, number]; sprechweise: Sprechweise }

const pol = (rho: number, winkel: number, r: number): Punkt => ({ x: rho * Math.cos(winkel), y: rho * Math.sin(winkel), r })
/** Winkel auf 0 bis 2π. */
const umlauf = (w: number) => ((w % TAU) + TAU) % TAU
/**
 * Der Ring flach gelegt: Jeder Punkt fällt auf die waagrechte Linie, so weit links oder rechts, wie er auf dem Ring vom
 * rechten Ende entfernt war. Oben und unten fallen aufeinander — aus acht Punkten auf dem Ring werden fünf in einer Zeile.
 */
const zeile = (rho: number, winkel: number, r: number): Punkt => ({ x: rho * (1 - (2 * Math.abs(umlauf(winkel + Math.PI) - Math.PI)) / Math.PI), y: 0, r })
const grenze = (v: number, von = 0, bis = 1) => Math.min(bis, Math.max(von, v))

/** Der Punkt in der Mitte, wenn kein Gespräch läuft; so groß wie im App-Symbol im Verhältnis zur Kachel. */
const PUNKT = 0.17
const DECKKRAFT: Record<Form, number> = { aus: 1, ruht: 0.45, hoert: 1, denkt: 1, spricht: 1 }

/**
 * Kranz: acht Punkte auf einem Ring. Die geraden und die ungeraden bilden je ein Viereck mit eigenem Drehwinkel — beim
 * Nachdenken laufen sie auf zwei Bahnen gegeneinander wie zwei Räder. Beim Antworten geht ein Punkt in die Mitte, die
 * sieben anderen rücken auf dem Ring zusammen.
 */
function kranz(form: Form, i: number, u: Uhren): Punkt {
  const gerade = i % 2 === 0
  const winkel = OBEN + i * 45 * GRAD + u.dreh[gerade ? 0 : 1]
  switch (form) {
    case 'aus':
      return pol(0, winkel, PUNKT)
    case 'ruht':
      return zeile(0.72, winkel, 0.085)
    case 'hoert': {
      // Atmet langsam; redet jemand, läuft eine Welle um den Ring und drückt die Punkte nach außen.
      const welle = 0.5 + 0.5 * Math.sin(TAU * 1.3 * u.zeit - i * (TAU / 4))
      const atem = 0.025 * Math.sin(TAU * 0.2 * u.zeit)
      return pol(0.72 + atem + 0.12 * u.pegel * (0.5 + 0.5 * welle), winkel, 0.09 + 0.03 * u.pegel)
    }
    case 'denkt':
      return gerade ? pol(0.8, winkel, 0.105) : pol(0.4, winkel, 0.075)
    case 'spricht': {
      if (i === 0) return pol(0, winkel, 0.2 + 0.1 * u.pegel)
      // Die sieben anderen teilen sich den Ring neu, vom Platz des ersten aus gemessen: Aus 45° Abstand werden 51,4°.
      const erster = OBEN + u.dreh[0]
      const neu = erster + Math.PI + (umlauf(winkel - erster) - Math.PI) * (8 / 7)
      return pol(0.64 + 0.1 * u.nach, neu, 0.08 + 0.035 * u.nach)
    }
  }
}

/**
 * Reihe: fünf Punkte nebeneinander, R-A-B-A-N. Beim Zuhören biegt sich die Reihe zum Ring, beim Nachdenken dreht sie
 * sich um ihre Mitte, beim Antworten läuft Rabans Stimme als Welle durch sie.
 */
function reihe(form: Form, i: number, u: Uhren): Punkt {
  const s = (i - 2) / 2
  const w = u.dreh[0]
  /** Im Rahmen der Reihe: `laengs` entlang, `hoch` quer dazu (nach oben, solange die Reihe waagrecht liegt). */
  const auf = (laengs: number, hoch: number, r: number): Punkt => ({
    x: laengs * Math.cos(w) + hoch * Math.sin(w),
    y: laengs * Math.sin(w) - hoch * Math.cos(w),
    r,
  })
  switch (form) {
    case 'aus':
      return auf(0, 0, PUNKT)
    case 'ruht':
      return auf(s * 0.72, 0, 0.085)
    case 'hoert': {
      // Der mittlere Punkt steigt nach oben, die Enden rollen sich nach unten ein: ein Fünfeck.
      const winkel = (i - 2) * 72 * GRAD
      const welle = 0.5 + 0.5 * Math.sin(TAU * 1.3 * u.zeit - i * (TAU / 5) * 2)
      const rho = 0.68 + 0.025 * Math.sin(TAU * 0.2 * u.zeit) + 0.12 * u.pegel * (0.5 + 0.5 * welle)
      return auf(rho * Math.sin(winkel), rho * Math.cos(winkel), 0.115 + 0.03 * u.pegel)
    }
    case 'denkt':
      return auf(s * 0.8, 0, 0.085 + 0.035 * Math.abs(s))
    case 'spricht': {
      const hub = 0.08 + 0.3 * u.pegel
      return auf(s * 0.72, hub * Math.sin(TAU * 1.8 * u.zeit - i * 1.15), 0.125)
    }
  }
}

/** Scheibe: Mitte, innerer Ring (6) und äußerer Ring (12). Welcher Punkt auf welchem Ring an welcher Stelle sitzt. */
function platz(i: number): { ring: 0 | 1 | 2; winkel: number } {
  if (i === 0) return { ring: 0, winkel: OBEN }
  if (i <= 6) return { ring: 1, winkel: OBEN + (i - 1) * 60 * GRAD }
  return { ring: 2, winkel: OBEN + (i - 7) * 30 * GRAD }
}
const RING = [0, 0.4, 0.8] as const

/**
 * Scheibe: neunzehn Punkte, die an ihrem Platz bleiben; nur ihre Größe wandert. Beim Zuhören ist die Scheibe hohl und
 * die Welle läuft von außen nach innen, beim Nachdenken streicht ein Zeiger aus großen Punkten im Kreis wie auf einem
 * Suchschirm, beim Antworten funkeln die Punkte mit der Stimme (`Sprechweise`).
 */
function scheibe(form: Form, i: number, u: Uhren): Punkt {
  const { ring, winkel } = platz(i)
  const rho = RING[ring]
  switch (form) {
    case 'aus':
      return pol(0, winkel, ring === 0 ? PUNKT : 0.05)
    case 'ruht':
      return zeile(rho, winkel, 0.065)
    case 'hoert': {
      const welle = 0.5 + 0.5 * Math.sin(TAU * 1.1 * u.zeit + ring * 1.3)
      const atem = 1 + 0.03 * Math.sin(TAU * 0.2 * u.zeit)
      return pol(rho * atem, winkel, [0.03, 0.055, 0.095][ring] * (1 + (0.12 + 0.5 * u.pegel) * welle))
    }
    case 'denkt': {
      // Der Zeiger: außen ein Stück hinterher, so wird aus dem Strich ein Bogen.
      const nah = Math.max(0, Math.cos(winkel - u.dreh[0] + ring * 0.3))
      return pol(rho, winkel, ring === 0 ? 0.075 : 0.035 + 0.085 * nah ** 4)
    }
    case 'spricht':
      switch (u.sprechweise) {
        case 'welle': {
          // Alle Punkte fast gleich groß; jede Silbe schwillt in der Mitte an und läuft Ring für Ring hinaus.
          const laut = [u.pegel, u.echo[0], u.echo[1]][ring]
          return pol(rho, winkel, [0.085, 0.075, 0.065][ring] * (1 + [1, 0.9, 0.8][ring] * laut))
        }
        case 'funkeln': {
          // Jeder Punkt in seinem eigenen Takt; wie stark, sagt die Stimme.
          const eigen = 0.5 + 0.5 * Math.sin(TAU * (2.1 + 0.37 * ((i * 7) % 5)) * u.zeit + i * 2.4)
          return pol(rho, winkel, 0.055 + 0.105 * u.pegel * eigen)
        }
      }
  }
}

const HALTUNG: Record<Art, (form: Form, i: number, u: Uhren) => Punkt> = { kranz, reihe, scheibe }

/**
 * Wie sich die beiden Drehwinkel je Form verhalten: `tempo` in Bogenmaß je Sekunde; `rastet` zieht den ersten Winkel
 * auf das Raster der Art, damit die Form gerade steht; `frei` lässt den zweiten Winkel vom ersten los (sonst bleibt er
 * an ihm, auf dem Raster).
 */
type Gang = { tempo: [number, number]; rastet?: boolean; frei?: boolean }
const STEHT: Gang = { tempo: [0, 0], rastet: true }
const GANG: Record<Art, Record<Form, Gang>> = {
  kranz: {
    aus: STEHT,
    ruht: STEHT,
    hoert: { tempo: [0.14, 0.14] },
    denkt: { tempo: [2.3, -3.3], frei: true },
    spricht: { tempo: [0, 0] },
  },
  reihe: {
    aus: STEHT,
    ruht: STEHT,
    hoert: { tempo: [0.22, 0] },
    denkt: { tempo: [3.4, 0] },
    spricht: STEHT,
  },
  scheibe: {
    aus: { tempo: [0, 0] },
    ruht: { tempo: [0, 0] },
    hoert: { tempo: [0, 0] },
    denkt: { tempo: [4.2, 0] },
    spricht: { tempo: [0, 0] },
  },
}
/** Auf welchen Winkel die Art einrastet (0 = gar nicht): Der Kranz sieht alle 90° gleich aus, die Reihe alle 180°. */
const RASTER: Record<Art, number> = { kranz: 90 * GRAD, reihe: 180 * GRAD, scheibe: 0 }
/** Wie stark das Raster zieht (je Sekunde) und wie steif die Feder der Gewichte ist (Bogenmaß je Sekunde). */
const ZUG = 7
const FEDER = 11

/** Der Zug zum nächsten Rasterpunkt: null auf dem Raster, am stärksten ein Achtel Raster daneben. */
const zug = (winkel: number, raster: number) => (raster ? (-ZUG * Math.sin((TAU / raster) * winkel)) / (TAU / raster) : 0)

/**
 * Rabans Stimme, wenn niemand ihren Pegel misst: Silben, nicht im Takt, mit kurzen Pausen zwischen den Sätzen (0–1).
 * Fest an der Zeit, kein Zufall — so lässt es sich prüfen.
 */
export function silben(t: number): number {
  const silbe = 0.5 + 0.28 * Math.sin(TAU * 3.3 * t) + 0.2 * Math.sin(TAU * 5.1 * t + 1.3) + 0.14 * Math.sin(TAU * 1.7 * t + 0.4)
  const satz = grenze((Math.sin(TAU * 0.31 * t) + 0.8) / 0.4)
  return grenze(silbe) * satz
}

function mischen(art: Art, gewicht: Record<Form, number>, u: Uhren): Bild {
  const punkte: Punkt[] = []
  for (let i = 0; i < ANZAHL[art]; i++) {
    const p = { x: 0, y: 0, r: 0 }
    for (const f of FORMEN) {
      const g = gewicht[f]
      if (g === 0) continue
      const h = HALTUNG[art](f, i, u)
      p.x += g * h.x
      p.y += g * h.y
      p.r += g * h.r
    }
    p.r = Math.max(0, p.r)
    punkte.push(p)
  }
  return { punkte, deckkraft: grenze(FORMEN.reduce((s, f) => s + gewicht[f] * DECKKRAFT[f], 0)) }
}

const einzig = (form: Form) => Object.fromEntries(FORMEN.map((f) => [f, f === form ? 1 : 0])) as Record<Form, number>
const leer = () => Object.fromEntries(FORMEN.map((f) => [f, 0])) as Record<Form, number>

/**
 * Die Form als stehendes Bild — für `prefers-reduced-motion`, für das erste Bild im Markup und für Stellen, an denen
 * das Zeichen nur Marke ist. Beim Nachdenken steht der Zeiger schräg, beim Antworten mitten in einer Silbe.
 */
export function stillbild(art: Art, form: Form, sprechweise: Sprechweise = 'funkeln'): Bild {
  const schraeg = { kranz: 0, reihe: -38 * GRAD, scheibe: -40 * GRAD }[art]
  const laut = form === 'spricht' ? 0.6 : 0
  const u: Uhren = { zeit: 0, dreh: form === 'denkt' ? [schraeg, -schraeg] : [0, 0], pegel: laut, nach: laut, echo: [laut, laut], sprechweise }
  return mischen(art, einzig(form), u)
}

/**
 * Das Zeichen über die Zeit. Ein `Lauf` je gezeichnetem Zeichen, über Zustandswechsel hinweg: Die Punkte bewegen sich
 * vom Fleck weiter. Ruht die Form (`aus`, `ruht`) und ist alles angekommen, meldet `ruhig`, dass nichts mehr zu zeichnen
 * ist, bis sich die Form ändert.
 */
export class Lauf {
  private art: Art
  private gewicht: Record<Form, number>
  private schwung = leer()
  private uhren: Uhren = { zeit: 0, dreh: [0, 0], pegel: 0, nach: 0, echo: [0, 0], sprechweise: 'funkeln' }
  private spur: { zeit: number; pegel: number }[] = []
  private vorher: number | null = null
  private form: Form
  private angekommen = true

  constructor(art: Art, anfang: Form = 'aus', sprechweise: Sprechweise = 'funkeln') {
    this.art = art
    this.uhren.sprechweise = sprechweise
    this.form = anfang
    this.gewicht = einzig(anfang)
  }

  /** Nichts bewegt sich mehr und nichts wird sich bewegen, solange die Form bleibt. */
  get ruhig(): boolean {
    return this.angekommen && (this.form === 'aus' || this.form === 'ruht')
  }

  /** Das Bild zur Zeit `sekunden` (steigend). */
  schritt(form: Form, sekunden: number, pegel: Pegel = {}): Bild {
    // Eine eigene Uhr, die nur läuft, solange gezeichnet wird: War das Zeichen nicht zu sehen (Tab versteckt, App im
    // Hintergrund), holt es die verpasste Zeit nicht im Wirbel nach.
    const dt = this.vorher === null ? 0 : Math.min(0.05, Math.max(0, sekunden - this.vorher))
    this.vorher = sekunden
    this.form = form
    const u = this.uhren
    u.zeit += dt

    // Die Gewichte: kritisch gedämpfte Federn, alle gleich steif — so bleibt ihre Summe 1.
    let offen = 0
    for (const f of FORMEN) {
      const ziel = f === form ? 1 : 0
      this.schwung[f] += ((ziel - this.gewicht[f]) * FEDER * FEDER - this.schwung[f] * 2 * FEDER) * dt
      this.gewicht[f] += this.schwung[f] * dt
      offen = Math.max(offen, Math.abs(ziel - this.gewicht[f]), Math.abs(this.schwung[f]) / FEDER)
    }

    // Der Pegel: schnell hinauf, langsamer hinunter; `nach` läuft ihm hinterher (der Ring nach der Mitte).
    const laut = form === 'spricht' ? (pegel.stimme ?? silben(u.zeit)) : form === 'hoert' ? (pegel.mikrofon ?? 0) : 0
    u.pegel += (grenze(laut) - u.pegel) * (1 - Math.exp(-dt / (laut > u.pegel ? 0.045 : 0.16)))
    u.nach += (u.pegel - u.nach) * (1 - Math.exp(-dt / 0.09))
    this.spur.push({ zeit: u.zeit, pegel: u.pegel })
    while (this.spur[0].zeit < u.zeit - 0.4) this.spur.shift()
    const frueher = (sekunden: number) => this.spur.find((s) => s.zeit >= u.zeit - sekunden)?.pegel ?? u.pegel
    u.echo = [frueher(0.11), frueher(0.22)]

    // Die Drehwinkel: Tempo je Form gemischt; wo eine Form gerade stehen will, zieht das Raster.
    const raster = RASTER[this.art]
    let tempoA = 0, tempoB = 0, rastet = 0, gebunden = 0
    for (const f of FORMEN) {
      const gang = GANG[this.art][f]
      const g = this.gewicht[f]
      tempoA += g * gang.tempo[0]
      tempoB += g * gang.tempo[1]
      if (gang.rastet) rastet += g
      if (!gang.frei) gebunden += g
    }
    u.dreh[0] += (tempoA + rastet * zug(u.dreh[0], raster)) * dt
    u.dreh[1] += (tempoB + gebunden * zug(u.dreh[1] - u.dreh[0], raster)) * dt
    const schief = raster ? Math.abs(Math.sin((TAU / raster) * u.dreh[0])) + Math.abs(Math.sin((TAU / raster) * (u.dreh[1] - u.dreh[0]))) : 0

    this.angekommen = offen < 0.002 && schief < 0.01 && u.pegel < 0.004
    if (this.angekommen && (form === 'aus' || form === 'ruht')) {
      // Genau ankommen, damit das letzte Bild das stehende Bild ist.
      this.gewicht = einzig(form)
      this.schwung = leer()
    }
    return mischen(this.art, this.gewicht, u)
  }
}
