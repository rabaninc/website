"use client";

import { useId } from "react";

import { Playback, useClock } from "../home/window/playback";
import { KARTE } from "./deutschland";

// /about opens with where the pitch won (2026-10-06; Johannes picked this map
// over a split-flap board, a seal and a calendar). Germany as a field of ink
// dots (the site's dotted paper, cut to the country's outline, from
// werkzeuge/deutschland-karte), in a frame with its degrees of longitude and
// latitude, like a chart. Two hairlines sweep in from the frame's edges while
// the readout counts the degrees, and lock on Heilbronn; the marker blinks,
// and three tags type out beside it, as the globe on the home page types the
// visitor's country: the place, the finals, and last the result, the winning
// team; then a ping runs out over the dots. It plays once (Playback): as the
// page opens (on a phone too, where it now fits the first screen, 2026-10-07),
// or, on a page restored further down, when it comes back into view, nearly
// all of it, so Heilbronn, low in the map, is in view when the lines find it.

const { breit: W, hoch: H, umriss, heilbronn, laengen, breiten } = KARTE;
const [HX, HY] = heilbronn.xy;
/** Room around the map for the frame's degrees. */
const LEFT = 34;
const BOTTOM = 26;
const VW = W + LEFT + 6;
const VH = H + BOTTOM + 6;
/** The baseline of the degrees under the map. */
const DEGREES = H + 18;

/** The dots: a square every PITCH units, so that one sits on Heilbronn. */
const PITCH = 7;
const DOT = 2.2;

const SWEEP = 1100; // the hairlines reach Heilbronn
const BLINK = [SWEEP, SWEEP + 180, SWEEP + 360];
/** ms a letter for each tag: the place at about the globe's pace, the
 *  others faster; a pause between them. */
const PACE = [60, 26, 26];
const PAUSE = 140;
const PING = 1500;

/** When each tag starts typing, and when the last is done. */
function timeline(tags: readonly string[]) {
  let at = BLINK[2];
  const starts = tags.map((tag, i) => {
    const start = at;
    at += tag.length * PACE[i] + PAUSE;
    return start;
  });
  return { starts, done: at };
}

// Where the sweep starts: the map's top left corner, in degrees.
const NORTH = 55.06;
const WEST = 5.87;

const ease = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

type Words = { place: string; finals: string; win: string; alt: string; opens?: boolean };

/** When the lines have found Heilbronn and when the last tag is typed, in ms
 *  from the start, for what plays after the map (fotos.tsx). */
export function karteZeiten({ place, finals, win }: Pick<Words, "place" | "finals" | "win">) {
  return { found: SWEEP, done: timeline([place, finals, win]).done };
}

/** Where Heilbronn is on the screen right now, read off the map's svg. */
export function heilbronnAufDemSchirm() {
  const svg = document.querySelector("svg[data-karte]");
  if (!svg) return null;
  const box = svg.getBoundingClientRect();
  return { x: box.left + ((LEFT + HX) / VW) * box.width, y: box.top + (HY / VH) * box.height };
}

export function Karte({ place, finals, win, alt, opens = false }: Words) {
  const tags = [place, finals, win];
  return (
    <div role="img" aria-label={alt} className="w-full">
      <div aria-hidden>
        <Playback length={timeline(tags).done + PING + 100} opens={opens} smooth share={0.85}>
          <Map tags={tags} />
        </Playback>
      </div>
    </div>
  );
}

function Map({ tags }: { tags: string[] }) {
  const t = useClock();
  const id = useId();
  const { starts, done } = timeline(tags);
  const s = ease(t / SWEEP);
  const x = LEFT + HX * s;
  const y = HY * s;
  const lat = NORTH + (heilbronn.lat - NORTH) * s;
  const lon = WEST + (heilbronn.lon - WEST) * s;
  const locked = t >= SWEEP;
  const marker = locked && !(t >= BLINK[1] && t < BLINK[2]);
  const typed = tags.map((tag, i) => tag.slice(0, Math.max(0, Math.floor((t - starts[i]) / PACE[i]))));
  const ping = Math.min(1, Math.max(0, (t - done) / PING));
  const pingR = Math.max(1, ping * 520);

  // A dot pattern lined up on Heilbronn.
  const ox = (LEFT + HX - PITCH / 2) % PITCH;
  const oy = (HY - PITCH / 2) % PITCH;

  return (
    <svg data-karte viewBox={`0 0 ${VW} ${VH}`} className="block h-auto w-full text-ink">
      <defs>
        <pattern id={`${id}-dots`} x={ox} y={oy} width={PITCH} height={PITCH} patternUnits="userSpaceOnUse">
          <rect x={(PITCH - DOT) / 2} y={(PITCH - DOT) / 2} width={DOT} height={DOT} className="fill-ink" />
        </pattern>
        <pattern id={`${id}-big`} x={ox} y={oy} width={PITCH} height={PITCH} patternUnits="userSpaceOnUse">
          <rect x={(PITCH - 3.4) / 2} y={(PITCH - 3.4) / 2} width={3.4} height={3.4} className="fill-ink" />
        </pattern>
        <clipPath id={`${id}-land`}>
          <path d={umriss} transform={`translate(${LEFT} 0)`} />
        </clipPath>
        <radialGradient id={`${id}-ring`} gradientUnits="userSpaceOnUse" cx={LEFT + HX} cy={HY} r={pingR}>
          <stop offset="0.7" className="[stop-color:var(--hero)]" stopOpacity={0} />
          <stop offset="0.94" className="[stop-color:var(--hero)]" stopOpacity={1} />
          <stop offset="1" className="[stop-color:var(--hero)]" stopOpacity={0} />
        </radialGradient>
        <mask id={`${id}-ping`}>
          <rect width={VW} height={VH} fill={`url(#${id}-ring)`} />
        </mask>
      </defs>

      {/* The frame, its degrees, and the graticule as dotted hairlines. */}
      <rect
        x={LEFT}
        y={0}
        width={W}
        height={H}
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
      />
      {laengen.map((l) => (
        <g key={l.grad}>
          <line
            x1={LEFT + l.x}
            y1={0}
            x2={LEFT + l.x}
            y2={H}
            stroke="currentColor"
            strokeOpacity={0.35}
            strokeWidth={1}
            strokeDasharray="1 4"
            vectorEffect="non-scaling-stroke"
          />
          <line
            x1={LEFT + l.x}
            y1={H}
            x2={LEFT + l.x}
            y2={H + 5}
            stroke="currentColor"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
          <text x={LEFT + l.x} y={DEGREES} textAnchor="middle" className="fill-current font-mono" fontSize={11}>
            {l.grad}°E
          </text>
        </g>
      ))}
      {breiten.map((b) => (
        <g key={b.grad}>
          <line
            x1={LEFT}
            y1={b.y}
            x2={LEFT + W}
            y2={b.y}
            stroke="currentColor"
            strokeOpacity={0.35}
            strokeWidth={1}
            strokeDasharray="1 4"
            vectorEffect="non-scaling-stroke"
          />
          <line
            x1={LEFT - 5}
            y1={b.y}
            x2={LEFT}
            y2={b.y}
            stroke="currentColor"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
          <text x={LEFT - 8} y={b.y + 4} textAnchor="end" className="fill-current font-mono" fontSize={11}>
            {b.grad}°N
          </text>
        </g>
      ))}

      {/* The country: dots, and the ping running out over them in bigger ones. */}
      <rect width={VW} height={VH} fill={`url(#${id}-dots)`} clipPath={`url(#${id}-land)`} opacity={0.7} />
      {ping > 0 && ping < 1 && (
        <g mask={`url(#${id}-ping)`} opacity={1 - ping}>
          <rect width={VW} height={VH} fill={`url(#${id}-big)`} clipPath={`url(#${id}-land)`} />
        </g>
      )}

      {/* The hairlines and the readout. */}
      <line
        x1={LEFT}
        y1={y}
        x2={LEFT + W}
        y2={y}
        stroke="currentColor"
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
      />
      <line x1={x} y1={0} x2={x} y2={H} stroke="currentColor" strokeWidth={1} vectorEffect="non-scaling-stroke" />
      <g className="font-mono" fontSize={11}>
        <rect x={LEFT + 8} y={8} width={128} height={20} className="fill-ink" />
        <text x={LEFT + 15} y={22} className="fill-paper">
          {lat.toFixed(2)}°N {lon.toFixed(2)}°E
        </text>
      </g>

      {/* Heilbronn: the marker in its brackets, and its tags. */}
      {marker && (
        <g>
          <rect x={LEFT + HX - 4.5} y={HY - 4.5} width={9} height={9} className="fill-ink" />
          {[
            [-1, -1],
            [1, -1],
            [-1, 1],
            [1, 1],
          ].map(([sx, sy]) => (
            <path
              key={`${sx}${sy}`}
              d={`M ${LEFT + HX + sx * 11} ${HY + sy * 5} V ${HY + sy * 11} H ${LEFT + HX + sx * 5}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>
      )}
      {typed[0] && (
        <g className="font-mono" fontSize={11}>
          <line
            x1={LEFT + HX + 15}
            y1={HY}
            x2={LEFT + HX + 34}
            y2={HY}
            stroke="currentColor"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
          {typed.map(
            (tag, i) =>
              tag && (
                <g key={i}>
                  <rect
                    x={LEFT + HX + 34}
                    y={HY - 10 + i * 22}
                    width={tag.length * 6.8 + 12}
                    height={20}
                    className="fill-ink"
                  />
                  <text x={LEFT + HX + 40} y={HY + 4 + i * 22} className="fill-paper">
                    {tag.toUpperCase()}
                  </text>
                </g>
              ),
          )}
        </g>
      )}
    </svg>
  );
}
