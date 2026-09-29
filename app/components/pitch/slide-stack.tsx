"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";

import { LABEL } from "../type";

// The pitch deck on /about as a stack (Johannes, 2026-09-29): scrolling
// brings each slide up from below the fold, straight up with no tilt, and
// lands it on the one before; the earlier slides stay behind it, each a step
// further back — a little higher, a little smaller, a little darker — so the
// deck grows as a pile. The stage is sticky for the length of the track, and
// the scroll position through the track says how far the deck has come.
// With reduced motion asked for, the slides simply stand one under another.

type Slide = { src: StaticImageData; alt: string };

// How much scroll each slide takes to come up, in viewport heights.
const PER_SLIDE = 0.75;
// How many slides stay visible behind the front one.
const BEHIND = 4;

export function SlideStack({ slides }: { slides: readonly Slide[] }) {
  const track = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const shades = useRef<(HTMLDivElement | null)[]>([]);
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
        let shade = 0;
        let hidden = false;
        if (d <= -1) {
          hidden = true;
        } else if (d < 0) {
          // Rising: from just below the fold to its place, straight up.
          transform = `translate3d(0, ${-d * (vh / 2 + h / 2 + 24)}px, 0)`;
        } else if (d > 0) {
          const k = Math.min(d, BEHIND);
          transform = `translate3d(0, ${-k * h * 0.06}px, 0) scale(${1 - k * 0.05})`;
          shade = k * 0.07;
          hidden = d > BEHIND;
        }
        card.style.transform = transform;
        card.style.visibility = hidden ? "hidden" : "visible";
        const s = shades.current[i];
        if (s) s.style.opacity = String(shade);
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

  const card = "overflow-hidden rounded-[18px] bg-hero shadow-[var(--window-cast)]";
  const sizes = "(min-width: 1280px) 1100px, 86vw";

  if (still) {
    return (
      <div className="space-y-[var(--content-gap)]">
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
      <div className="sticky top-0 grid h-[100svh] place-items-center pt-[var(--nav-h)]">
        {slides.map((s, i) => (
          <div
            key={s.alt}
            ref={(el) => {
              cards.current[i] = el;
            }}
            className={`relative col-start-1 row-start-1 w-[min(100%,1100px,calc((100svh-var(--nav-h)-120px)*16/9))] origin-top will-change-transform ${card}`}
            style={{ zIndex: i, visibility: i === 0 ? "visible" : "hidden" }}
          >
            <Image src={s.src} alt={s.alt} sizes={sizes} priority={i < 2} className="block h-auto w-full" />
            <div
              ref={(el) => {
                shades.current[i] = el;
              }}
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-ink opacity-0"
            />
          </div>
        ))}
        <span ref={count} className={`${LABEL} absolute bottom-6 left-1/2 -translate-x-1/2`}>
          01 / {String(n).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
