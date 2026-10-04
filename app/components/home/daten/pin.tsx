"use client";

import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";

// The first time its section comes up the page, the zipper holds the screen
// still for a stretch of scrolling and that scrolling closes it; closed, it
// lets go and never holds again (Johannes, 2026-10-04: "connect it to the
// scrolling … while the screen otherwise doesn't move, but only once, the way
// the app windows do it"). Until then it follows the scroll both ways: a reader
// who turns back halfway sees it open again, so the way down again has no
// stretch where nothing moves (Johannes, same day). As with the windows, the
// server, a reader who asked for reduced motion and a section already on
// screen when the page wakes show it closed and never hold: only a section
// still below the fold is opened, out of sight, and waits.
//
// The hold is CSS sticky on the stage, followed by a spacer as long as the
// stretch; the browser keeps the screen still and the script only reads how
// far the stage has slid down its wrapper. Both lengths are in svh, the small
// screen height, so Safari's toolbar folding away on an iPhone moves nothing.
// Once the zipper is closed and the page rests, the spacer is taken out and the
// page scrolled by the same amount in the same frame: nothing on screen moves.
// A page that rests before the zipper is closed keeps the hold.

const Progress = createContext(1);

/** How far the scroll has closed the zipper, 0 to 1; 1 outside a hold. */
export const usePinProgress = () => useContext(Progress);

/** How long the page must rest before the stretch is taken out. */
const REST = 180;

export function PinOnce({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const stage = useRef<HTMLDivElement>(null);
  const spacer = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  const [progress, setProgress] = useState(1);
  const [height, setHeight] = useState(0);
  const before = useRef<number | null>(null);

  useEffect(() => {
    const el = stage.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    setHeight(el.offsetHeight);
    setProgress(0);
    setArmed(true);
  }, []);

  useEffect(() => {
    const el = stage.current;
    if (!armed || !el) return;
    let frame = 0;
    let rest = 0;
    let p = 0;
    const measure = () => {
      frame = 0;
      const track = spacer.current?.getBoundingClientRect().height ?? 0;
      if (!track) return;
      // How far the stage has slid down its wrapper: 0 until it sticks, the
      // spacer's length when the hold ends; less again when the reader turns back.
      const slid = el.getBoundingClientRect().top - el.parentElement!.getBoundingClientRect().top;
      p = Math.max(0, Math.min(1, slid / track));
      setProgress(p);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
      window.clearTimeout(rest);
      rest = window.setTimeout(() => {
        if (p < 1) return;
        before.current = el.getBoundingClientRect().top;
        setArmed(false);
      }, REST);
    };
    const resized = new ResizeObserver(() => {
      setHeight(el.offsetHeight);
      onScroll();
    });
    resized.observe(el);
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      resized.disconnect();
      cancelAnimationFrame(frame);
      window.clearTimeout(rest);
    };
  }, [armed]);

  // The stretch is out: scroll by what the stage moved, before the frame is painted.
  useLayoutEffect(() => {
    const el = stage.current;
    if (armed || before.current === null || !el) return;
    window.scrollBy(0, el.getBoundingClientRect().top - before.current);
    before.current = null;
  }, [armed]);

  // Held below the navbar if the section fits the screen, else with its foot
  // (where the zipper is) on the bottom of the screen. The stretch is a spacer,
  // not padding: sticky holds an element only within its parent's content box.
  return (
    <div className={className}>
      <div ref={stage} style={armed ? { position: "sticky", top: `min(var(--nav-h), calc(100svh - ${height}px))` } : undefined}>
        <Progress.Provider value={progress}>{children}</Progress.Provider>
      </div>
      {armed && <div ref={spacer} aria-hidden className="h-[60svh]" />}
    </div>
  );
}
