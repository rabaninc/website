"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

// Each window plays its scene once, the first time it scrolls into view
// (Johannes, 2026-09-30): the question gets typed and sent, Raban's answer
// builds up line by line, and then the window rests on its last frame.
//
// A scene is written against one clock, the milliseconds since it started;
// every part says at which millisecond it appears. The clock rests at
// Infinity, the finished frame, and that is what the server renders, so the
// page without script, a reader who asked for reduced motion and a window
// already on screen when the page wakes (a restored scroll) all show the
// finished scene and never a replay under their eyes. Only a window still
// below the fold is wound back to 0, out of sight, and waits there.

const Clock = createContext(Number.POSITIVE_INFINITY);

export const useClock = () => useContext(Clock);

/** The step the clock ticks in: 25 frames a second is smooth for type and
 *  fades, and a timer (not requestAnimationFrame) keeps going in a
 *  background tab's preview too. */
const TICK = 40;

/** `opens`: the scene opens the page, so it plays as the page opens at its
 *  top, and the server renders its first frame rather than its last (a
 *  finished frame jumping back to the start would be a replay under the
 *  reader's eyes); a reader who asked for reduced motion, or a page restored
 *  further down, still gets the finished one. `smooth`: every animation
 *  frame instead of the timer's 25, for motion that has to be fluid (flaps,
 *  a drawn line). */
export function Playback({
  length,
  children,
  opens = false,
  smooth = false,
}: {
  length: number;
  children: React.ReactNode;
  opens?: boolean;
  smooth?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [t, setT] = useState(opens ? 0 : Number.POSITIVE_INFINITY);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const box = el.getBoundingClientRect();
    const onScreen = box.bottom > 0 && box.top < window.innerHeight;
    let timer = 0;
    let frame = 0;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      (onScreen && !(opens && window.scrollY === 0))
    ) {
      if (!opens) return;
      timer = window.setTimeout(() => setT(Number.POSITIVE_INFINITY), 0);
      return () => window.clearTimeout(timer);
    }

    const play = () => {
      const start = performance.now();
      const tick = () => {
        const now = performance.now() - start;
        if (now >= length) {
          setT(Number.POSITIVE_INFINITY);
          return;
        }
        setT(now);
        if (smooth) frame = requestAnimationFrame(tick);
        else timer = window.setTimeout(tick, TICK);
      };
      tick();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        play();
      },
      { threshold: 0.45 },
    );
    // Wind back out of sight, then wait for the window to come into view
    // (or, opening the page, play right away).
    timer = window.setTimeout(() => {
      setT(0);
      if (onScreen) play();
      else observer.observe(el);
    }, 0);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [length, opens, smooth]);

  return (
    <Clock.Provider value={t}>
      <div ref={root}>{children}</div>
    </Clock.Provider>
  );
}

const FADE = "transition-[opacity,translate] duration-500 ease-out";

/** A part of the scene that fades in, rising a few design pixels, at `at`
 *  milliseconds. Until then it keeps its place, so nothing below it jumps. */
export function Show({
  at,
  className = "",
  as: Tag = "div",
  children,
}: {
  at: number;
  className?: string;
  as?: "div" | "span" | "li";
  children?: React.ReactNode;
}) {
  const on = useClock() >= at;
  return <Tag className={`${FADE} ${on ? "" : "translate-y-1 opacity-0"} ${className}`}>{children}</Tag>;
}

/** True once the clock has passed `at` — for parts that change state (grey
 *  to ink, a button pressed) rather than appear. */
export function useAfter(at: number) {
  return useClock() >= at;
}

/** Text typed in from `at`, one character every `pace` milliseconds, with the
 *  caret blinking while it types. Before `at` it is empty; after the last
 *  character the caret goes. */
export function Typed({ at, text, pace = 26 }: { at: number; text: string; pace?: number }) {
  const t = useClock();
  const shown = t < at ? 0 : Math.min(text.length, Math.floor((t - at) / pace));
  const typing = t >= at && shown < text.length;
  return (
    <>
      {text.slice(0, shown)}
      {typing && <span className="ml-px inline-block h-[1.1em] w-px translate-y-[0.15em] bg-current" />}
    </>
  );
}

/** When typing `text` from `at` at `pace` will be done. */
export const typedUntil = (at: number, text: string, pace = 26) => at + text.length * pace;
