// Zeichnet Deutschland für die Karte unter „Im Finale gewonnen“ (/about): den Umriss aus world-atlas
// (Natural Earth, gemeinfrei, 1:50 Mio.) in Mercator, Heilbronn darin und die Gradnetz-Striche am Rand,
// als fertige Zahlen nach `app/components/pitch/deutschland.ts`, damit die Seite nicht den ganzen
// Atlas lädt. Aufruf: `node werkzeuge/deutschland-karte/karte.mjs`.

import { readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const HIER = dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)
const { feature } = require('topojson-client')
const { geoMercator, geoPath } = require('d3-geo')

const atlas = JSON.parse(readFileSync(resolve(HIER, '../../node_modules/world-atlas/countries-50m.json'), 'utf8'))
const deutschland = feature(atlas, atlas.objects.countries).features.find((f) => f.id === '276')

// 400 breit; Rand für die Gradzahlen links und unten.
const BREIT = 400
const RAND = 8
const projektion = geoMercator().fitWidth(BREIT - 2 * RAND, deutschland)
const [, [, unten]] = geoPath(projektion).bounds(deutschland)
const [dx, dy] = projektion.translate()
projektion.translate([dx + RAND, dy + RAND])
const HOCH = Math.ceil(unten + 2 * RAND)

const runden = (d) => d.replace(/-?\d+\.\d+/g, (z) => String(Math.round(Number(z) * 10) / 10))
const umriss = runden(geoPath(projektion)(deutschland))

const punkt = (lon, lat) => projektion([lon, lat]).map((z) => Math.round(z * 10) / 10)
const HEILBRONN = { lat: 49.1427, lon: 9.2109 }

// Jeder zweite Grad: Längen unten, Breiten links.
const laengen = [6, 8, 10, 12, 14].map((lon) => ({ grad: lon, x: punkt(lon, 51)[0] }))
const breiten = [48, 50, 52, 54].map((lat) => ({ grad: lat, y: punkt(10, lat)[1] }))

const ts = `// Von werkzeuge/deutschland-karte/karte.mjs gezeichnet (world-atlas, Natural Earth, gemeinfrei) —
// nicht von Hand ändern, sondern das Werkzeug neu laufen lassen.

export const KARTE = {
  breit: ${BREIT},
  hoch: ${HOCH},
  umriss: "${umriss}",
  heilbronn: { lat: ${HEILBRONN.lat}, lon: ${HEILBRONN.lon}, xy: [${punkt(HEILBRONN.lon, HEILBRONN.lat).join(', ')}] },
  laengen: ${JSON.stringify(laengen)},
  breiten: ${JSON.stringify(breiten)},
} as const;
`
writeFileSync(resolve(HIER, '../../app/components/pitch/deutschland.ts'), ts)
console.log(`${BREIT} × ${HOCH}, Umriss ${umriss.length} Zeichen, Heilbronn bei ${punkt(HEILBRONN.lon, HEILBRONN.lat)}`)
