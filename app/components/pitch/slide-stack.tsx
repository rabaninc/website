"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";

import { H2, LABEL } from "../type";

// The pitch deck on /about as a stack (Johannes, 2026-09-29): scrolling
// brings each slide up from below the fold, straight up with no tilt, and
// lands it on the one before. The slides it covers ride on as if they hung
// on a big wheel turning away from you (Johannes, 2026-09-29): each one first
// climbs up and back, so the deck grows as a pile, and after two more slides
// or so it goes over the top and sinks down behind the pile, smaller and
// fainter, until it is gone with no hard edge. Upright the whole way round,
// like a gondola. The wheel turns in beats: each slide rests, fully in view,
// for a moment of scroll before the next one comes; the turn between eases
// in and out; and the deck glides after the scroll instead of jumping with
// each notch of a mouse wheel (Johannes, 2026-09-29: "even better").
// The stage, with the deck's heading on top, is sticky for the length of the
// track, and the scroll position through the track says how far the deck has
// come.
// With reduced motion asked for, the slides simply stand one under another.

type Slide = { src: StaticImageData; alt: string };

// How much scroll each slide takes to come up, in viewport heights.
const PER_SLIDE = 0.75;
// The share of each slide's scroll it rests for, at either end.
const REST = 0.15;
// How long the deck takes to catch up with the scroll, in seconds (the time
// constant: after it, about two thirds of the way).
const GLIDE = 0.12;
// The wheel, in slide heights: how far it turns per slide (a fifth of a half
// turn, so a slide is at the top two and a half slides after it landed), its
// radius (how high the pile rises), and how far the eye is in front of it
// (the perspective: the wheel shrinks slides into a vanishing point at the
// front slide's top edge as they go back). After FADE slides a covered one
// has faded out completely; by then it is long hidden behind the pile.
const STEP = Math.PI / 5;
const WHEEL = 0.2;
const EYE = 1.6;
const FADE = 4;
const RADIUS = "rounded-[12px]";

export function SlideStack({ title, slides }: { title: string; slides: readonly Slide[] }) {
  const track = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const casts = useRef<(HTMLDivElement | null)[]>([]);
  const veils = useRef<(HTMLDivElement | null)[]>([]);
  const count = useRef<HTMLSpanElement>(null);
  const [still, setStill] = useState(false);
  const n = slides.length;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setStill(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (still) return;
    let frame = 0;
    let at = -1; // where the deck is drawn, in slides; -1 before the first draw
    let last = 0;

    // Where the scroll says the deck should be, in slides.
    const goal = () => {
      const el = track.current;
      if (!el) return 0;
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
      if (count.current) {
        count.current.textContent = `${String(Math.round(t) + 1).padStart(2, "0")} / ${String(n).padStart(2, "0")}`;
      }
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
    };

    const tick = (now: number) => {
      frame = 0;
      const want = goal();
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
  }, [still, n]);

  const card = `overflow-hidden ${RADIUS} bg-hero shadow-[var(--window-cast)]`;
  const sizes = "(min-width: 1280px) 1100px, 86vw";

  if (still) {
    return (
      <div className="space-y-[var(--content-gap)]">
        <h2 className={H2}>{title}</h2>
        {slides.map((s) => (
          <div key={s.alt} className={card}>
            <Image src={s.src} alt={s.alt} sizes={sizes} className="block h-auto w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={track} className="relative" style={{ height: `calc(${n - 1} * ${PER_SLIDE * 100}svh + 100svh)` }}>
      <div className="sticky top-0 flex h-[100svh] flex-col pt-[var(--nav-h)]">
        <h2 className={`${H2} pt-6`}>{title}</h2>
        <div className="grid flex-1 place-items-center pt-16">
          {slides.map((s, i) => (
            <div
              key={s.alt}
              ref={(el) => {
                cards.current[i] = el;
              }}
              className="relative col-start-1 row-start-1 w-[min(100%,1100px,calc((100svh-var(--nav-h)-240px)*16/9))] origin-top will-change-transform"
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
                <Image src={s.src} alt={s.alt} sizes={sizes} priority={i < 2} className="block h-auto w-full" />
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
        <span ref={count} className={`${LABEL} absolute bottom-6 left-1/2 -translate-x-1/2`}>
          01 / {String(n).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
