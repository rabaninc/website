"use client";

import { useClock } from "../home/window/playback";
import { BARE } from "../type";

// The deck's heading on /about as a split-flap board, the kind that hangs in
// stations and airports (Johannes, 2026-10-07: "use the style of A, like the
// airplane terminal graphic, for the heading of our pitch deck"; A was this
// board as the award's headline in the preview, d69afb8), in the site's ink
// with sage letters (SF Mono Semibold). Every tile starts blank and flaps
// through the alphabet to its letter, the way a real one does, so a U takes
// longer than an A and the board settles unevenly, in a wave from the left;
// the last three flaps of each tile slow down, so you see the letter fall
// into place. It runs on its Playback's clock: once, as it comes into view.
//
// The board fills the height its parent gives it (--deck-head), as wide as
// that makes it, or narrower where its parent, an @container, is narrower.
// Only spans, so it can stand inside a heading.

const ALPHABET = " ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜ0123456789.·-";
/** When a tile starts, by its column, in ms. */
const COL = 45;
/** How long one flap takes, at full speed and for the last three. */
const FAST = 38;
const SLOW = [160, 110, 70];
/** The gap between tiles, in px. */
const GAP = 3;

/** When each of a tile's flaps falls; a blank tile has none. */
function flaps(ch: string, col: number) {
  const target = Math.max(0, ALPHABET.indexOf(ch));
  // A few ms of give per tile, the same on the server and in the browser.
  let at = col * COL + ((col * 13) % 5) * 9;
  const times: number[] = [];
  for (let k = 1; k <= target; k++) {
    times.push(at);
    const left = target - k;
    at += left < SLOW.length ? SLOW[left] : FAST;
  }
  return times;
}

/** How long the board takes to settle on `text`, in ms. */
export function boardLength(text: string) {
  const last = [...text.toUpperCase()].map((ch, col) => flaps(ch, col).at(-1) ?? 0);
  return Math.max(0, ...last) + SLOW[0] + 100;
}

/** The duration of a tile's flap that fell at `times[n - 1]`. */
const flapOf = (times: number[], n: number) => (n < times.length ? times[n] - times[n - 1] : SLOW[0]);

// The falling top half and the rising bottom half of a flap; React gives
// each flap new elements (keys), so each runs its animation once.
const KEYFRAMES = `
@keyframes raban-flap-down { from { transform: rotateX(0deg); } to { transform: rotateX(-90deg); } }
@keyframes raban-flap-up { from { transform: rotateX(90deg); } to { transform: rotateX(0deg); } }
`;

export function Anzeigetafel({ text }: { text: string }) {
  const chars = [...text.toUpperCase()];
  const n = chars.length;
  // A tile is 5:7, as high as the parent allows, as wide as the row lets it.
  const tile = `min(calc(var(--deck-head, 40px) * 5 / 7), calc((100cqw - ${(n - 1) * GAP}px) / ${n}))`;
  return (
    <span aria-hidden className="block">
      <style href="raban-anzeigetafel" precedence="default">
        {KEYFRAMES}
      </style>
      <span
        className={`grid ${BARE} font-mono font-[600] leading-none`}
        style={{ gridTemplateColumns: `repeat(${n}, ${tile})`, gap: `${GAP}px`, fontSize: `calc(${tile} * 1.08)` }}
      >
        {chars.map((ch, col) => (
          <Tile key={col} times={flaps(ch, col)} />
        ))}
      </span>
    </span>
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
    <span className="relative block aspect-[5/7] [perspective:6em]">
      <Half ch={now} top />
      <Half ch={flapping ? before : now} />
      {flapping && (
        <>
          <Half
            key={`d${n}`}
            ch={before}
            top
            className="origin-bottom"
            style={{ animation: `raban-flap-down ${flap / 2}ms ease-in forwards` }}
          />
          <Half
            key={`u${n}`}
            ch={now}
            className="origin-top"
            style={{ animation: `raban-flap-up ${flap / 2}ms ease-out ${flap / 2}ms both` }}
          />
        </>
      )}
    </span>
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
    <span
      className={`absolute inset-x-0 block h-[calc(50%-0.5px)] overflow-hidden bg-ink [backface-visibility:hidden] ${
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
    </span>
  );
}
