"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";

import { H2, LABEL } from "../type";

// The pitch deck on /about as a stack (Johannes, 2026-09-29): scrolling
// brings each slide up from below the fold, straight up with no tilt, and
// lands it on the one before. The slides it covers turn away as if they sat
// on a drum rolling under the stack: each one sinks, shrinks and fades as it
// goes round, upright the whole way, until it is gone with no hard edge.
// The stage, with the deck's heading on top, is sticky for the length of the
// track, and the scroll position through the track says how far the deck has
// come.
// With reduced motion asked for, the slides simply stand one under another.

type Slide = { src: StaticImageData; alt: string };

// How much scroll each slide takes to come up, in viewport heights.
const PER_SLIDE = 0.75;
// The drum: how far it turns per slide, its radius as a share of a slide's
// height (how far a slide sinks), how much smaller a slide is a quarter turn
// round, and after how many slides a covered one has faded out completely.
const STEP = Math.PI / 6;
const DROP = 0.2;
const DEPTH = 0.3;
const FADE = 2.6;
const RADIUS = "rounded-[8px]";

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
    const layout = () => {
      frame = 0;
      const el = track.current;
      if (!el) return;
      const vh = window.innerHeight;
      const span = Math.max(1, el.offsetHeight - vh);
      const p = Math.min(1, Math.max(0, -el.getBoundingClientRect().top / span));
      const t = p * (n - 1);
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
          // Turning away on the drum: down and back, never tilted.
          const a = Math.min(d * STEP, Math.PI / 2);
          const f = d / FADE;
          transform = `translate3d(0, ${DROP * h * Math.sin(a)}px, 0) scale(${1 - DEPTH * (1 - Math.cos(a))})`;
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
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(layout);
    };
    layout();
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
        <div className="grid flex-1 place-items-center pb-16">
          {slides.map((s, i) => (
            <div
              key={s.alt}
              ref={(el) => {
                cards.current[i] = el;
              }}
              className="relative col-start-1 row-start-1 w-[min(100%,1100px,calc((100svh-var(--nav-h)-240px)*16/9))] will-change-transform"
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
