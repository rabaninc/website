"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";

import { Brackets } from "../home/brackets";
import { Playback, useClock } from "../home/window/playback";
import { LABEL, SECTION } from "../type";

// „Unser Team“ under the deck on /about (Johannes, 2026-10-08): the two
// founders with their LinkedIn pictures (werkzeuge/team-fotos) and links,
// in slide 8's order, Simon left.
//
// PREVIEW (2026-10-08): four looks to pick from, ?team=a|b|c|d:
// A two flat portraits in bracket marks, an ink hairline scans each one in
//   the first time they come up;
// B the same, the photos printed in the page's sage and ink, in colour while
//   the pointer is on them (on a phone: while they pass the screen's middle);
// C each founder on an ink badge, the Raban mark in its corner;
// D facing each other as on slide 8, a hairline drawn from both photos
//   meets in the Raban mark between them.

export type Person = {
  key: string;
  name: string;
  photo: StaticImageData;
  linkedin: string;
  role: string;
  study: string;
  uni: string;
  alt: string;
  label: string;
};

export type Variante = "a" | "b" | "c" | "d";

const ease = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

/** A founder's name: the size of the home page's call to action. */
const NAME = "text-[18px] font-medium leading-none tracking-[-0.02em] md:text-[28px]";

export function Team({ title, people, variant }: { title: string; people: readonly Person[]; variant: Variante }) {
  return (
    <section aria-labelledby="team" className="pb-16 pt-24 md:pb-32 md:pt-40">
      <h2 id="team" className={`${SECTION} mb-12 text-center md:mb-20`}>
        {title}
      </h2>
      {variant === "a" && <Portraits people={people} />}
      {variant === "b" && <Duoton people={people} />}
      {variant === "c" && <Ausweise people={people} />}
      {variant === "d" && <Gegenueber people={people} />}
    </section>
  );
}

function Photo({ p, sizes, className = "", alt = p.alt }: { p: Person; sizes: string; className?: string; alt?: string }) {
  return <Image src={p.photo} alt={alt} fill sizes={sizes} placeholder="blur" className={`object-cover ${className}`} />;
}

function LinkedIn({ p, className = "" }: { p: Person; className?: string }) {
  return (
    <a
      href={p.linkedin}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={p.label}
      className={`cursor-pointer ${className}`}
    >
      LinkedIn ↗
    </a>
  );
}

/** Name, role, study and the link, in a hairline column; `end` sets it
 *  against the photo on its right from xl up (D). */
function Info({ p, end = false }: { p: Person; end?: boolean }) {
  return (
    <div className={`border-l border-ink/30 pl-3 ${end ? "xl:border-l-0 xl:border-r xl:pl-0 xl:pr-3 xl:text-right" : ""}`}>
      <h3 className={NAME}>{p.name}</h3>
      <p className={`${LABEL} mt-3 uppercase`}>{p.role}</p>
      <p className={`${LABEL} mt-1 uppercase`}>{p.study}</p>
      <p className={`${LABEL} mt-1 uppercase`}>{p.uni}</p>
      <LinkedIn
        p={p}
        className="mt-5 inline-block text-[17px] leading-none underline decoration-1 underline-offset-4 hover:text-ink/60"
      />
    </div>
  );
}

const GRID = "mx-auto grid max-w-[1040px] grid-cols-2 gap-x-6 gap-y-10 md:gap-x-16";
const SIZES = "(min-width: 1100px) 490px, 45vw";

// A — two flat portraits, an ink hairline scans each in.

const SCAN = 1100;
const STAGGER = 220;

function Portraits({ people }: { people: readonly Person[] }) {
  return (
    <Playback length={SCAN + STAGGER + 100} smooth share={0.35}>
      <div className={GRID}>
        {people.map((p, i) => (
          <figure key={p.key} className="min-w-0">
            <div className="relative aspect-square">
              <Scan at={i * STAGGER}>
                <Photo p={p} sizes={SIZES} />
              </Scan>
              <Brackets inset="-8px" />
            </div>
            <figcaption className="mt-6 md:mt-8">
              <Info p={p} />
            </figcaption>
          </figure>
        ))}
      </div>
    </Playback>
  );
}

function Scan({ at, children }: { at: number; children: React.ReactNode }) {
  const s = ease((useClock() - at) / SCAN);
  return (
    <>
      <div className="absolute inset-0" style={s < 1 ? { clipPath: `inset(0 0 ${(1 - s) * 100}% 0)` } : undefined}>
        {children}
      </div>
      {s > 0 && s < 1 && (
        <span aria-hidden className="absolute inset-x-0 h-px bg-ink" style={{ top: `${s * 100}%` }} />
      )}
    </>
  );
}

// B — printed in sage and ink, in colour under the pointer.

function Duoton({ people }: { people: readonly Person[] }) {
  return (
    <div className={GRID}>
      {people.map((p) => (
        <DuoFigure key={p.key} p={p} />
      ))}
    </div>
  );
}

function DuoFigure({ p }: { p: Person }) {
  const ref = useRef<HTMLElement>(null);
  const [on, setOn] = useState(false);
  // Without a pointer that hovers, colour while the photo crosses the
  // middle fifth of the screen.
  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(hover: none)").matches) return;
    const io = new IntersectionObserver(([e]) => setOn(!!e?.isIntersecting), { rootMargin: "-40% 0px -40% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <figure ref={ref} className="group min-w-0">
      <div className="relative isolate aspect-square overflow-hidden bg-paper">
        <Photo p={p} sizes={SIZES} className="mix-blend-multiply contrast-[1.15] grayscale" />
        <Photo
          p={p}
          sizes={SIZES}
          alt=""
          className={`transition-opacity duration-700 ease-out group-focus-within:opacity-100 group-hover:opacity-100 ${on ? "opacity-100" : "opacity-0"}`}
        />
      </div>
      <figcaption className="mt-6 md:mt-8">
        <Info p={p} />
      </figcaption>
    </figure>
  );
}

// C — ink badges.

function Mark({ className = "", style, dot }: { className?: string; style?: React.CSSProperties; dot: string }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden className={className} style={style}>
      <rect width="100" height="100" rx="24" fill="currentColor" />
      <circle cx="72" cy="72" r="9.5" className={dot} />
    </svg>
  );
}

function Ausweise({ people }: { people: readonly Person[] }) {
  return (
    <div className="mx-auto grid max-w-[880px] grid-cols-2 gap-3 md:gap-8">
      {people.map((p) => (
        <article key={p.key} className="flex min-w-0 flex-col rounded-[var(--radius)] bg-slab p-2 text-slab-ink md:p-3">
          <div className="flex items-center justify-between px-2 pb-2 pt-1 md:px-3 md:pb-3 md:pt-2">
            <span className={`${LABEL} uppercase`}>{p.role}</span>
            <Mark className="size-4 text-paper md:size-5" dot="fill-slab" />
          </div>
          <div className="relative aspect-square overflow-hidden rounded-[calc(var(--radius)-12px)]">
            <Photo p={p} sizes="(min-width: 900px) 420px, 45vw" />
          </div>
          <div className="px-2 pb-3 pt-5 md:px-3 md:pb-4 md:pt-7">
            <h3 className={NAME}>{p.name}</h3>
            <p className={`${LABEL} mt-3 uppercase text-paper`}>{p.study}</p>
            <p className={`${LABEL} mt-1 uppercase text-paper`}>{p.uni}</p>
            <LinkedIn
              p={p}
              className={`${LABEL} mt-5 inline-block bg-paper px-1.5 py-0.5 uppercase text-ink hover:bg-slab-ink`}
            />
          </div>
        </article>
      ))}
    </div>
  );
}

// D — facing each other, as on slide 8.

const DRAW = 900;
const POP = 300;

function Gegenueber({ people }: { people: readonly Person[] }) {
  const [a, b] = people;
  if (!a || !b) return null;
  return (
    <Playback length={DRAW + POP + 100} smooth share={0.5}>
      <div className="mx-auto grid max-w-[880px] grid-cols-[1fr_48px_1fr] items-center gap-y-6 md:grid-cols-[1fr_120px_1fr] md:gap-y-8 xl:max-w-[1320px] xl:grid-cols-[1fr_minmax(0,300px)_minmax(64px,160px)_minmax(0,300px)_1fr] xl:gap-y-0">
        <div className="col-start-1 row-start-2 self-start xl:row-start-1 xl:self-center xl:justify-self-end xl:pr-8">
          <Info p={a} end />
        </div>
        <div className="relative col-start-1 row-start-1 aspect-square xl:col-start-2">
          <Photo p={a} sizes="(min-width: 1280px) 300px, (min-width: 940px) 380px, 45vw" />
        </div>
        <Bridge className="col-start-2 row-start-1 xl:col-start-3" />
        <div className="relative col-start-3 row-start-1 aspect-square xl:col-start-4">
          <Photo p={b} sizes="(min-width: 1280px) 300px, (min-width: 940px) 380px, 45vw" />
        </div>
        <div className="col-start-3 row-start-2 self-start xl:col-start-5 xl:row-start-1 xl:self-center xl:pl-8">
          <Info p={b} />
        </div>
      </div>
    </Playback>
  );
}

function Bridge({ className }: { className: string }) {
  const t = useClock();
  const s = ease(t / DRAW);
  const m = ease((t - DRAW) / POP);
  return (
    <div aria-hidden className={`relative flex h-full items-center justify-center ${className}`}>
      <span className="absolute left-0 top-1/2 h-px w-1/2 origin-left bg-ink" style={{ transform: `scaleX(${s})` }} />
      <span className="absolute right-0 top-1/2 h-px w-1/2 origin-right bg-ink" style={{ transform: `scaleX(${s})` }} />
      <Mark className="relative size-5 text-ink md:size-8" style={{ transform: `scale(${m})` }} dot="fill-paper" />
    </div>
  );
}
