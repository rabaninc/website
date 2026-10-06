"use client";

import { Playback, useClock } from "../home/window/playback";
import { BARE } from "../type";

// PREVIEW (2026-10-06), variant A for the award on /about: the headline on a
// split-flap board, the kind that hung in stations and airports, in the
// site's ink with sage letters (SF Mono Semibold). Every tile starts blank and flaps through the
// alphabet to its letter, the way a real one does, so a Z takes longer than
// an A and the board settles unevenly, in a wave from the top left; the last
// three flaps of each tile slow down, so you see the letter fall into place.
// It plays once (Playback), on opening the page when the board opens it.

const ALPHABET = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.·-";
/** When a tile starts, by its column and its row, in ms. */
const COL = 45;
const ROW = 160;
/** How long one flap takes, at full speed and for the last three. */
const FAST = 38;
const SLOW = [160, 110, 70];

type Plan = { times: number[] };

/** When each of a tile's flaps falls; a blank tile has none. */
function plan(ch: string, row: number, col: number): Plan {
  const target = Math.max(0, ALPHABET.indexOf(ch));
  // A few ms of give per tile, the same on the server and in the browser.
  const give = ((row * 7 + col * 13) % 5) * 9;
  const times: number[] = [];
  let at = col * COL + row * ROW + give;
  for (let k = 1; k <= target; k++) {
    times.push(at);
    const left = target - k;
    at += left < SLOW.length ? SLOW[left] : FAST;
  }
  return { times };
}

/** The duration of a tile's flap that fell at `times[n - 1]`. */
const flapOf = (times: number[], n: number) => (n < times.length ? times[n] - times[n - 1] : SLOW[0]);

function plans(rows: readonly string[], cols: number) {
  return rows.map((r, row) => Array.from({ length: cols }, (_, col) => plan(r[col] ?? " ", row, col)));
}

function lengthOf(grid: Plan[][]) {
  return Math.max(0, ...grid.flat().map((p) => (p.times.length ? p.times[p.times.length - 1] + SLOW[0] : 0))) + 100;
}

// The falling top half and the rising bottom half of a flap; React gives
// each flap new elements (keys), so each runs its animation once.
const KEYFRAMES = `
@keyframes raban-flap-down { from { transform: rotateX(0deg); } to { transform: rotateX(-90deg); } }
@keyframes raban-flap-up { from { transform: rotateX(90deg); } to { transform: rotateX(0deg); } }
`;

type Words = {
  wide: readonly string[];
  narrow: readonly string[];
  alt: string;
  opens?: boolean;
};

export function Anzeigetafel({ wide, narrow, alt, opens = false }: Words) {
  const big = plans(wide, 18);
  const small = plans(narrow, 10);
  return (
    <div role="img" aria-label={alt}>
      <style href="raban-anzeigetafel" precedence="default">
        {KEYFRAMES}
      </style>
      <div aria-hidden>
        <Playback length={Math.max(lengthOf(big), lengthOf(small))} opens={opens} smooth>
          <Board grid={big} cols={18} className="hidden md:block" />
          <Board grid={small} cols={10} className="md:hidden" />
        </Playback>
      </div>
    </div>
  );
}

/** The tiles in rows; their size follows the board's width (cqw). */
function Board({ grid, cols, className }: { grid: Plan[][]; cols: number; className: string }) {
  const gap = cols > 10 ? 5 : 3;
  return (
    <div className={`@container ${className}`}>
      <div
        className={`grid ${BARE} font-mono font-[600] leading-none`}
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gap: `${gap * 1.6}px ${gap}px`,
          fontSize: `calc((100cqw - ${(cols - 1) * gap}px) / ${cols} * 1.08)`,
        }}
      >
        {grid.flat().map((p, i) => (
          <Tile key={i} times={p.times} />
        ))}
      </div>
    </div>
  );
}

function Tile({ times }: { times: number[] }) {
  const t = useClock();
  let n = 0;
  while (n < times.length && times[n] <= t) n++;
  const now = ALPHABET[n];
  const before = ALPHABET[Math.max(0, n - 1)];
  const flap = n > 0 ? flapOf(times, n) : 0;
  const flapping = n > 0 && t - times[n - 1] < flap;
  return (
    <div className="relative aspect-[5/7] [perspective:6em]">
      <Half ch={now} top />
      <Half ch={flapping ? before : now} />
      {flapping && (
        <>
          <Half
            key={`d${n}`}
            ch={before}
            top
            className="origin-bottom"
            style={{
              animation: `raban-flap-down ${flap / 2}ms ease-in forwards`,
            }}
          />
          <Half
            key={`u${n}`}
            ch={now}
            className="origin-top"
            style={{
              animation: `raban-flap-up ${flap / 2}ms ease-out ${flap / 2}ms both`,
            }}
          />
        </>
      )}
    </div>
  );
}

/** One half of a tile: the letter at the tile's full height, cut at the
 *  middle, with a hairline of sage between the halves. */
function Half({
  ch,
  top = false,
  className = "",
  style,
}: {
  ch: string;
  top?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`absolute inset-x-0 h-[calc(50%-0.5px)] overflow-hidden bg-ink [backface-visibility:hidden] ${
        top ? "top-0 rounded-t-[0.14em]" : "bottom-0 rounded-b-[0.14em]"
      } ${className}`}
      style={style}
    >
      <span
        className={`absolute inset-x-0 flex h-[calc(200%+1px)] items-center justify-center text-paper ${
          top ? "top-0" : "bottom-0"
        }`}
      >
        {ch}
      </span>
    </div>
  );
}
