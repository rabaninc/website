"use client";

import Image, { type StaticImageData } from "next/image";
import { type ReactNode, useEffect, useRef } from "react";

import { BODY, H2, LABEL } from "../type";

// The pitch deck on /about as a stack (Johannes, 2026-09-29): scrolling
// brings each slide up from below the fold, straight up with no tilt, and
// lands it on the one before. The slides it covers ride on as if they hung
// on a big wheel turning away from you: each one first climbs up and back,
// so the deck grows as a tight pile four slides deep, shrinking fast as it
// goes back, and after that it goes over the top and sinks down behind the
// pile, smaller and fainter, until it is gone with no hard edge. Upright the
// whole way round, like a gondola. The wheel turns in beats: each slide
// rests, fully in view, for a moment of scroll before the next one comes;
// the turn between eases in and out; and the deck glides after the scroll
// instead of jumping with each notch of a mouse wheel.
// The deck stands on the left; on the right, what the founders say to the
// slide in front, from the stage pitch script, fading over as the wheel
// turns. The stage, with the deck's heading on top, is sticky for the length
// of the track, and the scroll position through the track says how far the
// deck has come.
// Below `lg`, and with reduced motion asked for, the slides simply stand one
// under another, each with its text beneath.

type Slide = { src: StaticImageData; alt: string; speaker: string; script: ReactNode };

// How much scroll each slide takes to come up, in viewport heights.
const PER_SLIDE = 0.75;
// The share of each slide's scroll it rests for, at either end.
const REST = 0.15;
// How long the deck takes to catch up with the scroll, in seconds (the time
// constant: after it, about two thirds of the way).
const GLIDE = 0.12;
// The wheel, in slide heights: how far it turns per slide (a tenth of a half
// turn), its radius, and how far the eye is in front of it. A small wheel
// seen from close up: the pile's layers sit tight — each strip thinner than
// the 5.9% of a slide above the Raban logo in its corner, so no logo shows
// (Johannes, 2026-09-30) — while the perspective is strong, so a slide
// first rises and then, going over the top, shrinks away fast into a
// vanishing point at the front slide's top edge. That rise-then-recede is
// what reads as a wheel; a steady shrink per slide read as a straight line
// into the distance. After FADE slides a covered one has faded out
// completely; by then it is long hidden behind the pile.
const STEP = Math.PI / 10;
const WHEEL = 0.15;
const EYE = 0.35;
const FADE = 6;
// The room the deck keeps above the front slide for the pile, in slide
// heights (the pile tops out at about 0.11).
const PILE = 0.13;
// The screen height the pile and the front slide share: the screen less the
// navbar, the heading and the stage's margins.
const ROOM = "(100svh - var(--nav-h) - 136px)";
const RADIUS = "rounded-[12px]";

const pad = (k: number) => String(k).padStart(2, "0");

export function SlideStack({ title, slides }: { title: string; slides: readonly Slide[] }) {
  const track = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const casts = useRef<(HTMLDivElement | null)[]>([]);
  const veils = useRef<(HTMLDivElement | null)[]>([]);
  const texts = useRef<(HTMLDivElement | null)[]>([]);
  const n = slides.length;

  useEffect(() => {
    let frame = 0;
    let at = -1; // where the deck is drawn, in slides; -1 before the first draw
    let last = 0;

    // Where the scroll says the deck should be, in slides.
    const goal = (el: HTMLDivElement) => {
      const span = Math.max(1, el.offsetHeight - window.innerHeight);
      return Math.min(1, Math.max(0, -el.getBoundingClientRect().top / span)) * (n - 1);
    };

    // From scroll to wheel: whole slides rest, the turn between them eases
    // in and out (smootherstep), so every stop and start is soft.
    const beat = (t: number) => {
      const k = Math.floor(t);
      const x = Math.min(1, Math.max(0, (t - k - REST) / (1 - 2 * REST)));
      return k + x * x * x * (x * (6 * x - 15) + 10);
    };

    const draw = (t: number) => {
      const vh = window.innerHeight;
      cards.current.forEach((card, i) => {
        if (!card) return;
        const d = t - i; // > 0: landed and being covered, < 0: still to come
        const h = card.offsetHeight;
        let transform = "none";
        let shown = 1; // 1 fully there, 0 faded out
        if (d <= -1 || d >= FADE) {
          shown = 0;
        } else if (d < 0) {
          // Rising: from just below the fold to its place, straight up
          // (offsetTop is from the top of the stuck stage, i.e. the screen).
          transform = `translate3d(0, ${-d * (vh - card.offsetTop + 24)}px, 0)`;
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
      draw(beat(at));
      if (at !== want) frame = requestAnimationFrame(tick);
    };
    const schedule = () => {
      if (frame) return;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };
    tick(performance.now());
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [n]);

  const card = `overflow-hidden ${RADIUS} bg-hero shadow-[var(--window-cast)]`;
  const label = (i: number) => `${pad(i + 1)} / ${pad(n)} · ${slides[i].speaker}`;

  return (
    <>
      <div
        ref={track}
        className="relative hidden lg:motion-safe:block"
        style={{ height: `calc(${n - 1} * ${PER_SLIDE * 100}svh + 100svh)` }}
      >
        <div className="sticky top-0 grid h-[100svh] grid-cols-[minmax(0,4fr)_minmax(0,3fr)] gap-x-16 pt-[var(--nav-h)] pb-10">
          <div className="flex min-h-0 flex-col">
            <h2 className={`${H2} pt-6`}>{title}</h2>
            {/* The room above the front slide for the pile: PILE of the
                slide's height, whether the slide fills the column (then
                that is PILE · 9/16 of the column's width, which is what a
                percentage padding measures) or the screen's height caps it. */}
            <div
              className="my-auto grid"
              style={{ paddingTop: `min(${PILE * (9 / 16) * 100}%, calc(${ROOM} / ${1 + PILE} * ${PILE}))` }}
            >
              {slides.map((s, i) => (
                <div
                  key={s.alt}
                  ref={(el) => {
                    cards.current[i] = el;
                  }}
                  className="relative col-start-1 row-start-1 origin-top will-change-transform"
                  style={{
                    width: `min(100%, calc(${ROOM} / ${1 + PILE} * 16 / 9))`,
                    zIndex: i,
                    visibility: i === 0 ? "visible" : "hidden",
                  }}
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
                      sizes="60vw"
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
          </div>
          {/* The text has the column's whole height, from the heading's line
              down, each slide's centred in it; its size follows the screen's
              height so the longest (slide 6) still fits a short laptop. */}
          <div className="grid min-h-0 pt-6">
            {slides.map((s, i) => (
              <div
                key={s.alt}
                ref={(el) => {
                  texts.current[i] = el;
                }}
                className="col-start-1 row-start-1 self-center will-change-[transform,opacity]"
                style={{ opacity: i === 0 ? 1 : 0, visibility: i === 0 ? "visible" : "hidden" }}
              >
                <p className={LABEL}>{label(i)}</p>
                <p className="mt-4 max-w-[34em] text-[clamp(14px,2.3svh,18px)] leading-[1.4] text-pretty">{s.script}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-[var(--content-gap)] lg:motion-safe:hidden">
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
