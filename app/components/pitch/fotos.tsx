"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef } from "react";

import { Later, Playback, useClock } from "../home/window/playback";
import { Anzeigetafel } from "./anzeigetafel";
import { heilbronnAufDemSchirm, karteZeiten } from "./karte";

// PREVIEW (2026-10-07): Johannes' three photos from Heilbronn (AI Start, cut
// by werkzeuge/auszeichnung-fotos) in the room under the sentence on /about,
// in three variants (?bild=a|b|c). The one he picks stays, the others go.
//
// On the desktop (and a tablet on its side) the photos fill the room the
// map leaves under the sentence, down to the foot of the map's frame; under
// them, on the baseline of the map's degrees, there is room for a line of
// mono. On a phone they come after the map, under the first screen, before
// the deck.

export type Foto = {
  key: "treppenhaus" | "bruecke" | "finaltag";
  src: StaticImageData;
  date: string;
  day: string;
  alt: string;
};
type Words = { place: string; finals: string; win: string };
type Props = { photos: readonly Foto[]; map: Words; where: "spalte" | "unten" };

/** Where each photo's subject sits, for the crops `object-cover` makes. */
const FOKUS = { treppenhaus: "50% 62%", bruecke: "58% 30%", finaltag: "52% 42%" } as const;

const VARIANTS = { a: Spalten, b: Fallblatt, c: Abzuege } as const;
export type Variante = keyof typeof VARIANTS;

export function Fotos({ variant, ...props }: Props & { variant: Variante }) {
  const Variant = VARIANTS[variant];
  if (props.where === "spalte")
    return (
      // The room under the sentence, as a size container laid over its flex
      // slot (as the map's box on the phone); --foot is the strip under the
      // map's frame where its degrees stand (karte.tsx: 32 of 440).
      <div className="relative z-10 hidden flex-1 deck-wide:block deck-squat:hidden">
        <div className="absolute inset-0 [container-type:size] [--foot:calc(var(--karte)*32/440)]">
          <Variant {...props} />
        </div>
      </div>
    );
  // The deck's track starts a navbar higher and its heading 80px into it
  // (page.tsx), so 16px here leave 40px between the photos and the heading.
  return (
    <div className="pb-4 [container-type:inline-size] deck-wide:hidden deck-squat:block">
      <Variant {...props} />
    </div>
  );
}

function Photo({ p, sizes, decorative = false }: { p: Foto; sizes: string; decorative?: boolean }) {
  return (
    <Image
      src={p.src}
      alt={decorative ? "" : p.alt}
      fill
      sizes={sizes}
      className="object-cover"
      style={{ objectPosition: FOKUS[p.key] }}
    />
  );
}

// ---------------------------------------------------------------------------
// A · Columns: the three side by side, flat and square-cornered as typesafe
// sets its pictures, the room's full width, their feet on the foot of the
// map's frame; under each a hairline drops from its left edge to a mono date
// on the baseline of the map's degrees, so the photos' dates and the map's
// degrees read as one axis across the page. No motion.

function Spalten({ photos, where }: Props) {
  if (where === "spalte")
    return (
      <div className="grid h-full grid-cols-3 gap-x-6">
        {photos.map((p) => (
          <figure key={p.key} className="flex min-w-0 flex-col">
            <div className="relative min-h-0 flex-1 bg-ink/10">
              <Photo p={p} sizes="(min-width: 1024px) 26vw, 30vw" />
            </div>
            <figcaption className="relative h-[var(--foot)] shrink-0">
              <span aria-hidden className="absolute left-0 top-0 h-[calc(var(--karte)*18/440)] border-l border-ink" />
              <span className="absolute left-[calc(var(--karte)*7/440)] top-[calc(var(--karte)*18/440)] -translate-y-full whitespace-nowrap font-mono text-[length:calc(var(--karte)*11/440)] uppercase leading-none [text-box:trim-both_cap_alphabetic]">
                {p.date}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    );
  return (
    <div className="grid grid-cols-3 gap-x-3 deck-squat:gap-x-6">
      {photos.map((p) => (
        <figure key={p.key} className="min-w-0">
          <div className="relative aspect-[3/4] max-h-[54svh] w-full bg-ink/10">
            <Photo p={p} sizes="(orientation: landscape) 30vw, 30vw" />
          </div>
          <figcaption className="relative h-[34px]">
            <span aria-hidden className="absolute left-0 top-0 h-[19px] border-l border-ink" />
            <span className="absolute left-[7px] top-[19px] -translate-y-full font-mono text-[11px] uppercase leading-none [text-box:trim-both_cap_alphabetic]">
              {p.day}
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// B · Split-flap: the three as the tiles of a departure board, like the
// deck's heading under them (anzeigetafel.tsx) and the airline logos the old
// Solari boards carried on their flaps: each tile cut at the middle by a
// hairline of sage, blank ink at first, then flapping through the photos to
// its own, the last three flaps slowing down, in a wave from the left; under
// each, its day on a small board of the heading's tiles. On the desktop it
// starts as the map's lines find Heilbronn; on a phone, as it comes into view.

// The flaps use the board's keyframes, raban-flap-down and raban-flap-up,
// which the days' boards bring along (anzeigetafel.tsx).

/** ms a flap takes at full speed, and the last three. */
const FAST = 70;
const SLOW = [320, 220, 140];
/** ms between the tiles' starts. */
const BETWEEN = 200;

/** What a tile shows after each flap: blank (-1), then twice through the
 *  photos, ending on its own. */
const frames = (i: number) => [-1, (i + 1) % 3, (i + 2) % 3, i, (i + 1) % 3, (i + 2) % 3, i];

/** When each of a tile's flaps falls. */
function flapTimes(i: number, start: number) {
  const n = frames(i).length - 1;
  let at = start + i * BETWEEN;
  const times: number[] = [];
  for (let k = 1; k <= n; k++) {
    times.push(at);
    const left = n - k;
    at += left < SLOW.length ? SLOW[left] : FAST;
  }
  return times;
}

function Fallblatt({ photos, map, where }: Props) {
  const desk = where === "spalte";
  const start = desk ? karteZeiten(map).found + 120 : 150;
  const times = photos.map((_, i) => flapTimes(i, start));
  // The days' boards run behind their tiles and take the longest.
  const length = Math.max(...times.map((t) => t[0])) + 2400;
  return (
    <Playback length={length} opens={desk} smooth share={0.6} className={desk ? "h-full" : undefined}>
      <div className={desk ? "grid h-full grid-cols-3 gap-x-3" : "grid grid-cols-3 gap-x-2 deck-squat:gap-x-4"}>
        {photos.map((p, i) => (
          <div key={p.key} className="flex min-w-0 flex-col">
            <div
              role="img"
              aria-label={p.alt}
              className={`relative ${desk ? "min-h-0 flex-1" : "aspect-[3/4] max-h-[52svh] w-full"} [perspective:1100px]`}
            >
              <FlapTile photos={photos} frames={frames(i)} times={times[i]} desk={desk} />
            </div>
            <div
              aria-hidden
              className={`@container ${desk ? "h-[var(--foot)] pt-[calc(var(--foot)*0.2)] [--deck-head:calc(var(--foot)*0.62)]" : "h-[30px] pt-[7px] [--deck-head:18px]"}`}
            >
              <Later by={times[i][0]}>
                <Anzeigetafel text={p.day} />
              </Later>
            </div>
          </div>
        ))}
      </div>
    </Playback>
  );
}

function FlapTile({
  photos,
  frames,
  times,
  desk,
}: {
  photos: readonly Foto[];
  frames: number[];
  times: number[];
  desk: boolean;
}) {
  const t = useClock();
  let n = 0;
  while (n < times.length && times[n] <= t) n++;
  const now = frames[n];
  const before = frames[Math.max(0, n - 1)];
  const flap = n > 0 ? (n < times.length ? times[n] - times[n - 1] : SLOW[0]) : 0;
  const flapping = n > 0 && t - times[n - 1] < flap;
  const half = (shown: number, top: boolean, key?: string, style?: React.CSSProperties, origin = "") => (
    <FlapHalf key={key} photo={shown >= 0 ? photos[shown] : undefined} top={top} desk={desk} style={style} className={origin} />
  );
  return (
    <>
      {half(now, true)}
      {half(flapping ? before : now, false)}
      {flapping && (
        <>
          {half(before, true, `d${n}`, { animation: `raban-flap-down ${flap / 2}ms ease-in forwards` }, "origin-bottom")}
          {half(now, false, `u${n}`, { animation: `raban-flap-up ${flap / 2}ms ease-out ${flap / 2}ms both` }, "origin-top")}
        </>
      )}
    </>
  );
}

/** One half of a photo tile: the photo at the tile's full height, cut at
 *  the middle, a hairline of sage between the halves. */
function FlapHalf({
  photo,
  top,
  desk,
  className = "",
  style,
}: {
  photo?: Foto;
  top: boolean;
  desk: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const radius = desk ? "6px" : "4px";
  return (
    <div
      className={`absolute inset-x-0 h-[calc(50%-0.5px)] overflow-hidden bg-ink [backface-visibility:hidden] ${top ? "top-0" : "bottom-0"} ${className}`}
      style={{ ...style, borderRadius: top ? `${radius} ${radius} 0 0` : `0 0 ${radius} ${radius}` }}
    >
      {photo && (
        <div className={`absolute inset-x-0 h-[calc(200%+1px)] ${top ? "top-0" : "bottom-0"}`}>
          <Photo p={photo} sizes={desk ? "(min-width: 1024px) 26vw, 30vw" : "30vw"} decorative />
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// C · Prints: the three as prints with a white border, the way the deck's
// slides are cards, dealt out of Heilbronn: once the map has typed its last
// tag (as its ping runs out), they fly one after another from the marker
// into a loose pile under the sentence, each settling a little turned.
// Pointing at one lifts it out of the pile and turns it straight. On a phone
// they fly from the marker, above, as the pile comes into view.

const DEAL = 760;
const STAGGER = 170;

/** Each print in the pile: its photo's height as a share of the room, how far
 *  up from the foot it stands (in room heights), and its turn. Side by side
 *  from the left edge of the sentence, each overlapping the one before by
 *  OVERLAP room heights (more on a phone, where the room is narrow). */
const PILE = [
  { h: 0.92, up: 0.03, turn: -5 },
  { h: 1, up: 0, turn: 3 },
  { h: 0.88, up: 0.04, turn: -2 },
] as const;
const ASPECT = { treppenhaus: 3 / 4, bruecke: 5 / 6, finaltag: 4 / 3 } as const;
const OVERLAP = { desk: 0.1, phone: 0.24 };
/** The white border, in px. */
const BORDER = { desk: 6, phone: 4 };

/** Where each print's left edge stands, and how wide the pile is, as
 *  (room heights, px). */
function pileOf(photos: readonly Foto[], desk: boolean) {
  const overlap = desk ? OVERLAP.desk : OVERLAP.phone;
  const border = 2 * (desk ? BORDER.desk : BORDER.phone);
  let k = 0;
  const lefts = photos.map((p, i) => {
    const at = [k, i * border] as const;
    k += PILE[i].h * ASPECT[p.key] - overlap;
    return at;
  });
  return { lefts, width: [k + overlap, photos.length * border] as const };
}

function Abzuege({ photos, map, where }: Props) {
  const desk = where === "spalte";
  const start = desk ? karteZeiten(map).done : 120;
  const length = start + STAGGER * photos.length + DEAL + 100;
  const { lefts, width } = pileOf(photos, desk);
  // On a phone the pile stands in the middle, as large as the width allows.
  const room = `min(calc((100cqw - ${width[1] + 24}px) / ${width[0]}), 46svh)`;
  return (
    <Playback length={length} opens={desk} share={0.55} className={desk ? "h-full" : undefined}>
      <div
        className={desk ? "relative h-full" : "relative"}
        style={
          (desk
            ? { "--room": "calc(100cqh - var(--foot))" }
            : { "--room": room, height: "calc(var(--room) * 1.14 + 16px)" }) as unknown as React.CSSProperties
        }
      >
        {photos.map((p, i) => (
          <Print
            key={p.key}
            p={p}
            i={i}
            at={start + i * STAGGER}
            desk={desk}
            left={
              desk
                ? `calc(var(--room) * ${lefts[i][0]} + ${lefts[i][1]}px)`
                : `calc((100cqw - var(--room) * ${width[0]} - ${width[1]}px) / 2 + var(--room) * ${lefts[i][0]} + ${lefts[i][1]}px)`
            }
          />
        ))}
      </div>
    </Playback>
  );
}

function Print({ p, i, at, desk, left }: { p: Foto; i: number; at: number; desk: boolean; left: string }) {
  const t = useClock();
  const shown = t >= at;
  const playing = Number.isFinite(t);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = box.current;
    if (!el || !shown || !playing) return;
    const from = heilbronnAufDemSchirm();
    if (!from) return;
    const r = el.getBoundingClientRect();
    const dx = from.x - (r.left + r.width / 2);
    const dy = from.y - (r.top + r.height / 2);
    el.animate(
      [
        { transform: `translate(${dx}px, ${dy}px) scale(0.06) rotate(${PILE[i].turn * -4}deg)`, opacity: 0 },
        { opacity: 1, offset: 0.12 },
        { transform: "translate(0, 0) scale(1) rotate(0deg)", opacity: 1 },
      ],
      { duration: DEAL, easing: "cubic-bezier(0.2, 0.85, 0.25, 1.06)", fill: "backwards" },
    );
    // Only when it is dealt; the clock ticking on doesn't deal it again.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown]);
  const s = PILE[i];
  const border = 2 * (desk ? BORDER.desk : BORDER.phone);
  return (
    <div
      ref={box}
      className={`group absolute z-[var(--z)] hover:z-10 ${shown ? "" : "opacity-0"}`}
      style={
        {
          left,
          width: `calc(var(--room) * ${s.h * ASPECT[p.key]} + ${border}px)`,
          height: `calc(var(--room) * ${s.h} + ${border}px)`,
          bottom: desk ? `calc(var(--foot) + var(--room) * ${s.up})` : `calc(var(--room) * ${s.up} + 8px)`,
          "--z": i,
          "--turn": `${s.turn}deg`,
        } as React.CSSProperties
      }
    >
      <div
        className={`relative size-full bg-hero shadow-[var(--print-cast)] transition-[translate,scale,rotate] duration-300 ease-out [rotate:var(--turn)] group-hover:-translate-y-2 group-hover:scale-[1.04] group-hover:[rotate:0deg] ${desk ? "p-1.5" : "p-1"}`}
      >
        <div className="relative size-full overflow-hidden">
          <Photo p={p} sizes={desk ? "(min-width: 1024px) 24vw, 30vw" : "40vw"} />
        </div>
      </div>
    </div>
  );
}
