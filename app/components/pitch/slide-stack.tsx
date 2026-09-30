"use client";

import Image, { type StaticImageData } from "next/image";
import { type CSSProperties, type ReactNode, useEffect, useRef } from "react";

import { BODY, H1, H2, LABEL } from "../type";

// The pitch deck on /about as a stack (Johannes, 2026-09-29): scrolling
// brings each slide up from below, straight up with no tilt, and lands it on
// the one before. The slides it covers ride on as if they hung on a big wheel
// turning away from you: each one first climbs up and back, so the deck grows
// as a pile four slides deep, and after that it goes over the top and sinks
// down behind the pile, smaller and fainter, until it is gone with no hard
// edge. Upright the whole way round, like a gondola, and physical: a slide
// shows whatever no slide in front of it covers. The wheel turns in beats:
// each slide rests, fully in view, for a moment of scroll before the next one
// comes; the turn between eases in and out; and the deck glides after the
// scroll instead of jumping with each notch of a mouse wheel.
// On the desktop stage (from `lg`) the page title, the deck's heading and the
// deck stand on the left and, on the right, what the founders say to the
// slide in front, from the stage pitch script, fading over as the wheel
// turns. The whole stage is sticky from the top of the page for the length
// of the track, so the first slide already stands in its place when the page
// opens (Johannes, 2026-09-30), and the scroll position through the track
// says how far the deck has come.
// On phones the deck sticks under the navbar and the texts run past
// underneath it in the page's own flow; a text arriving under the deck is
// what turns the wheel to its slide.
// With reduced motion asked for, the slides simply stand one under another,
// each with its text beneath.

type Slide = { src: StaticImageData; alt: string; speaker: string; script: ReactNode };

// How much scroll each slide takes to come up on the desktop stage, in
// viewport heights (0.75 until 2026-09-30, when Johannes asked for less
// scrolling per slide).
const PER_SLIDE = 0.5;
// The share of each slide's scroll it rests for, at either end.
const REST = 0.15;
// How long the deck takes to catch up with the scroll, in seconds (the time
// constant: after it, about two thirds of the way).
const GLIDE = 0.12;
// The wheel, in slide heights: how far it turns per slide (a tenth of a half
// turn), its radius, and how far the eye is in front of it. A slide first
// rises and then, going over the top, shrinks away into a vanishing point at
// the front slide's top edge; that rise-then-recede is what reads as a wheel
// (a steady shrink per slide read as a straight line into the distance).
// The radius sets the height of that arch: 0.15 kept the pile's strips under
// the corner logos but flattened the arch until it no longer read as a wheel;
// since 2026-09-30 it is 0.5 (Johannes: a higher arch), with the eye moved
// back in step so the slides shrink as fast as before. After FADE slides a
// covered one has faded out completely; by then it is long hidden behind the
// pile.
const STEP = Math.PI / 10;
const WHEEL = 0.5;
const EYE = 1.33;
const FADE = 6;
// The room the deck keeps above the front slide for the pile, in slide
// heights (the arch tops out at about 0.38).
const PILE = 0.4;
// On phones: how much scroll a turn takes, in viewport heights, and how far
// under the deck a text's top rests once its slide has landed (its first line
// then clears the fade under the deck).
const TURN = 0.3;
const UNDER = 16;
// The screen height the pile and the front slide share on the desktop stage:
// the screen less the navbar's clearance, the two headings and the stage's
// margins.
const ROOM = "(100svh - var(--content-top) - var(--h1-line) - var(--header-gap) - var(--h2-line) - 88px)";
const RADIUS = "rounded-[12px]";

const pad = (k: number) => String(k).padStart(2, "0");
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
// Smootherstep: 0 to 1 with no kink at either end.
const ease = (x: number) => x * x * x * (x * (6 * x - 15) + 10);

export function SlideStack({
  heading,
  title,
  slides,
}: {
  heading: string;
  title: string;
  slides: readonly Slide[];
}) {
  const track = useRef<HTMLDivElement>(null);
  const deck = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const casts = useRef<(HTMLDivElement | null)[]>([]);
  const veils = useRef<(HTMLDivElement | null)[]>([]);
  const texts = useRef<(HTMLDivElement | null)[]>([]);
  const n = slides.length;

  useEffect(() => {
    let frame = 0;
    let at = -1; // where the deck is drawn, in slides; -1 before the first draw
    let last = 0;
    const wideQuery = window.matchMedia("(min-width: 1024px)");
    let wide = wideQuery.matches; // the desktop stage rather than the phone's

    // Where the scroll says the deck should be, in slides.
    const goal = (el: HTMLDivElement) => {
      if (wide) {
        const span = Math.max(1, el.offsetHeight - window.innerHeight);
        return clamp01(-el.getBoundingClientRect().top / span) * (n - 1);
      }
      // On phones the texts drive the deck: slide j lands as text j's top
      // comes up to its resting place under the deck, and the turn takes
      // TURN of a screen of scroll before that, eased at both ends. The
      // texts are at least a turn and a bit tall, so turns never overlap.
      const box = deck.current;
      if (!box) return 0;
      const rest = box.getBoundingClientRect().bottom + UNDER;
      const turn = window.innerHeight * TURN;
      let t = 0;
      for (let j = 1; j < n; j++) {
        const text = texts.current[j];
        if (text) t += ease(clamp01((rest + turn - text.getBoundingClientRect().top) / turn));
      }
      return t;
    };

    // From scroll to wheel on the desktop stage: whole slides rest, the turn
    // between them eases in and out, so every stop and start is soft.
    const beat = (t: number) => {
      const k = Math.floor(t);
      return k + ease(clamp01((t - k - REST) / (1 - 2 * REST)));
    };

    const draw = (t: number) => {
      cards.current.forEach((card, i) => {
        if (!card) return;
        const d = t - i; // > 0: landed and being covered, < 0: still to come
        const h = card.offsetHeight;
        let transform = "none";
        let shown = 1; // 1 fully there, 0 faded out
        if (d <= -1 || d >= FADE) {
          shown = 0;
        } else if (d < 0) {
          // Rising into place, straight up: from just below the fold on the
          // desktop stage, from under the deck's bottom edge on the phone,
          // where the deck's clip hides it. offsetTop is from the top of the
          // box the card is laid out in — the stuck stage, whose top is the
          // screen's, or the phone's stuck deck.
          const box = card.offsetParent as HTMLElement | null;
          const from = (box ? box.clientHeight - card.offsetTop : window.innerHeight) + 24;
          transform = `translate3d(0, ${-d * from}px, 0)`;
        } else if (d > 0) {
          // Round the wheel: up and back, over the top, down behind the pile,
          // seen in perspective. Scaled from the top edge, the vanishing
          // point, so the pile shows as a row of top edges.
          const a = d * STEP;
          const s = EYE / (EYE + WHEEL * (1 - Math.cos(a)));
          const f = d / FADE;
          transform = `translate3d(0, ${-WHEEL * h * Math.sin(a) * s}px, 0) scale(${s})`;
          shown = 1 - f * f * (3 - 2 * f);
        }
        // The fade veils the slide in the page's own sage rather than making
        // it see-through, so the slide behind never shows through it; its
        // shadow fades with it.
        card.style.transform = transform;
        card.style.visibility = shown > 0 ? "visible" : "hidden";
        const cast = casts.current[i];
        const veil = veils.current[i];
        if (cast) cast.style.opacity = String(shown);
        if (veil) veil.style.opacity = String(1 - shown);
      });
      if (!wide) return;
      // The text goes out in the first part of the turn, rising with the
      // wheel, and the next comes up in the last part, one at a time.
      texts.current.forEach((text, i) => {
        if (!text) return;
        const d = t - i;
        const o = Math.max(0, 1 - Math.abs(d) * 2.5);
        text.style.opacity = String(o);
        text.style.transform = `translate3d(0, ${-d * 32}px, 0)`;
        text.style.visibility = o > 0 ? "visible" : "hidden";
      });
    };

    const tick = (now: number) => {
      frame = 0;
      const el = track.current;
      if (!el || el.offsetParent === null) return; // the list is showing instead
      const want = goal(el);
      if (at < 0) {
        at = want;
      } else {
        const dt = Math.min(0.05, Math.max(0, now - last) / 1000);
        at += (want - at) * (1 - Math.exp(-dt / GLIDE));
        if (Math.abs(want - at) < 0.001) at = want;
      }
      last = now;
      draw(wide ? beat(at) : at);
      if (at !== want) frame = requestAnimationFrame(tick);
    };
    const schedule = () => {
      if (frame) return;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };
    // Between the two stages the texts change hands: on the phone they lie
    // in the page's flow and nothing of the desktop's fading may stay on them.
    const restage = () => {
      wide = wideQuery.matches;
      if (!wide) texts.current.forEach((text) => text && (text.style.cssText = ""));
      at = -1;
      schedule();
    };
    tick(performance.now());
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    wideQuery.addEventListener("change", restage);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      wideQuery.removeEventListener("change", restage);
    };
  }, [n]);

  const card = `overflow-hidden ${RADIUS} bg-hero shadow-[var(--window-cast)]`;
  const label = (i: number) => `${pad(i + 1)} / ${pad(n)} · ${slides[i].speaker}`;
  const script = `${BODY} mt-4 text-pretty lg:max-w-[34em] lg:text-[clamp(14px,2.3svh,18px)] lg:leading-[1.4]`;
  // The deck's measures the two stages share, as variables the classes read
  // (an inline style cannot switch at a breakpoint): the desktop stage's track
  // length; the room above the front slide for the pile — PILE of the slide's
  // height, whether the slide fills the column (then that is PILE · 9/16 of
  // the column's width, which is what a percentage padding measures) or, on
  // the desktop stage, the screen's height caps it; and that capped width.
  const measures = {
    "--track": `calc(${n - 1} * ${PER_SLIDE * 100}svh + 100svh)`,
    "--pile": `${PILE * (9 / 16) * 100}%`,
    "--pile-capped": `min(${PILE * (9 / 16) * 100}%, calc(${ROOM} / ${1 + PILE} * ${PILE}))`,
    "--slide": `min(100%, calc(${ROOM} / ${1 + PILE} * 16 / 9))`,
  } as CSSProperties;

  return (
    <>
      <div
        ref={track}
        data-deck-track={n}
        className="relative motion-reduce:hidden lg:h-[var(--track)]"
        style={measures}
      >
        <div className="pt-[var(--content-top)] lg:sticky lg:top-0 lg:grid lg:h-[100svh] lg:grid-cols-[minmax(0,4fr)_minmax(0,3fr)] lg:gap-x-16 lg:pb-10">
          {/* On the phone this column dissolves (`contents`), so the deck's
              sticky box is held by the whole stage, texts included, and
              sticks for their full length. */}
          <div className="max-lg:contents lg:flex lg:min-h-0 lg:flex-col">
            <h1 className={H1}>{heading}</h1>
            <h2 className={`${H2} mt-[var(--header-gap)]`}>{title}</h2>
            <div className="max-lg:sticky max-lg:top-[var(--nav-h)] max-lg:z-10 max-lg:bg-paper max-lg:pt-3 lg:my-auto">
              <div
                ref={deck}
                data-deck-window
                className="grid pt-[var(--pile)] max-lg:overflow-clip max-lg:pb-10 lg:pt-[var(--pile-capped)]"
              >
                {slides.map((s, i) => (
                  <div
                    key={s.alt}
                    ref={(el) => {
                      cards.current[i] = el;
                    }}
                    className="relative col-start-1 row-start-1 w-full origin-top will-change-transform lg:w-[var(--slide)]"
                    style={{ zIndex: i, visibility: i === 0 ? "visible" : "hidden" }}
                  >
                    <div
                      ref={(el) => {
                        casts.current[i] = el;
                      }}
                      aria-hidden
                      className={`absolute inset-0 ${RADIUS} shadow-[var(--window-cast)]`}
                    />
                    <div className={`relative overflow-hidden ${RADIUS} bg-hero`}>
                      <Image
                        src={s.src}
                        alt={s.alt}
                        sizes="(min-width: 1024px) 60vw, 92vw"
                        priority={i < 2}
                        className="block h-auto w-full"
                      />
                      <div
                        ref={(el) => {
                          veils.current[i] = el;
                        }}
                        aria-hidden
                        className="pointer-events-none absolute inset-0 bg-paper opacity-0"
                      />
                    </div>
                  </div>
                ))}
              </div>
              {/* On the phone the texts pass under the deck: a breath of sage
                  fades them out before its edge, instead of a hard cut. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-full h-8 bg-gradient-to-b from-paper to-transparent lg:hidden"
              />
            </div>
          </div>
          {/* On the desktop stage the texts share one cell and fade over
              each other, centred in the band the deck has under the
              headings; the size follows the screen's height so the longest
              (slide 6) still fits a short laptop. On the phone they stand one
              under another, each at least a turn and a bit tall. */}
          <div className="lg:grid lg:min-h-0 lg:pt-[calc(var(--h1-line)+var(--header-gap)+var(--h2-line))]">
            {slides.map((s, i) => (
              <div
                key={s.alt}
                ref={(el) => {
                  texts.current[i] = el;
                }}
                data-deck-text
                className={`max-lg:pt-6 lg:col-start-1 lg:row-start-1 lg:self-center lg:will-change-[transform,opacity] ${
                  i < n - 1 ? "max-lg:min-h-[36svh]" : ""
                } ${i > 0 ? "lg:invisible lg:opacity-0" : ""}`}
              >
                <p className={LABEL}>{label(i)}</p>
                <p className={script}>{s.script}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="hidden space-y-[var(--content-gap)] pt-[var(--content-top)] motion-reduce:block">
        <h1 className={H1}>{heading}</h1>
        <h2 className={H2}>{title}</h2>
        {slides.map((s, i) => (
          <div key={s.alt}>
            <div className={card}>
              <Image src={s.src} alt={s.alt} sizes="92vw" className="block h-auto w-full" />
            </div>
            <p className={`${LABEL} mt-5`}>{label(i)}</p>
            <p className={`${BODY} mt-3 text-pretty`}>{s.script}</p>
          </div>
        ))}
      </div>
    </>
  );
}
