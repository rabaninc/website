"use client";

import { useId } from "react";

import { Playback, useClock } from "../home/window/playback";
import { KARTE } from "./deutschland";

// PREVIEW (2026-10-06), variant C for the award on /about: where it was won.
// Germany as a field of ink dots (the site's dotted paper, cut to the
// country's outline, from werkzeuge/deutschland-karte), in a frame with its
// degrees of longitude and latitude, like a chart. Two hairlines sweep in from
// the frame's edges while the readout counts the degrees, and lock on
// Heilbronn; the marker blinks and its name types out, as the globe on the
// home page finds the visitor's country; then a ping runs out over the dots.
// It plays once (Playback), on opening the page when the map opens it.

const { breit: W, hoch: H, umriss, heilbronn, laengen, breiten } = KARTE;
const [HX, HY] = heilbronn.xy;
/** Room around the map for the frame's degrees. */
const LEFT = 34;
const BOTTOM = 26;
const VW = W + LEFT + 6;
const VH = H + BOTTOM + 6;

/** The dots: a square every PITCH units, so that one sits on Heilbronn. */
const PITCH = 7;
const DOT = 2.2;

const SWEEP = 1100; // the hairlines reach Heilbronn
const BLINK = [SWEEP, SWEEP + 180, SWEEP + 360];
const TYPE = 70; // ms a letter, as the globe types its label
const PING = 1700;
const LENGTH = PING + 1600;

// Where the sweep starts: the map's top left corner, in degrees.
const NORTH = 55.06;
const WEST = 5.87;

const ease = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

type Words = { place: string; finals: string; alt: string; opens?: boolean };

export function Karte({ place, finals, alt, opens = false }: Words) {
  return (
    <div role="img" aria-label={alt} className="mx-auto w-full max-w-[500px]">
      <div aria-hidden>
        <Playback length={LENGTH} opens={opens} smooth>
          <Map place={place} finals={finals} />
        </Playback>
      </div>
    </div>
  );
}

function Map({ place, finals }: { place: string; finals: string }) {
  const t = useClock();
  const id = useId();
  const s = ease(t / SWEEP);
  const x = LEFT + HX * s;
  const y = HY * s;
  const lat = NORTH + (heilbronn.lat - NORTH) * s;
  const lon = WEST + (heilbronn.lon - WEST) * s;
  const locked = t >= SWEEP;
  const marker = locked && !(t >= BLINK[1] && t < BLINK[2]);
  const typed = place.slice(0, Math.max(0, Math.floor((t - BLINK[2]) / TYPE)));
  const typed2 = finals.slice(0, Math.max(0, Math.floor((t - BLINK[2] - place.length * TYPE - 150) / (TYPE / 2))));
  const ping = Math.min(1, Math.max(0, (t - PING) / 1500));
  const pingR = Math.max(1, ping * 520);

  // A dot pattern lined up on Heilbronn.
  const ox = (LEFT + HX - PITCH / 2) % PITCH;
  const oy = (HY - PITCH / 2) % PITCH;

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} className="block h-auto w-full text-ink">
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
          <text x={LEFT + l.x} y={H + 18} textAnchor="middle" className="fill-current font-mono" fontSize={11}>
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

      {/* Heilbronn: the marker in its brackets, the name and the finals. */}
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
      {typed && (
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
          <rect x={LEFT + HX + 34} y={HY - 10} width={typed.length * 6.8 + 12} height={20} className="fill-ink" />
          <text x={LEFT + HX + 40} y={HY + 4} className="fill-paper">
            {typed.toUpperCase()}
          </text>
          {typed2 && (
            <>
              <rect x={LEFT + HX + 34} y={HY + 12} width={typed2.length * 6.8 + 12} height={20} className="fill-ink" />
              <text x={LEFT + HX + 40} y={HY + 26} className="fill-paper">
                {typed2.toUpperCase()}
              </text>
            </>
          )}
        </g>
      )}
    </svg>
  );
}
