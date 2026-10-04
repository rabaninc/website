"use client";

import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

// The first time its section comes up the page, the zipper holds the screen
// still for a stretch of scrolling and that scrolling closes it; closed, it
// lets go and never holds again (Johannes, 2026-10-04: "connect it to the
// scrolling … while the screen otherwise doesn't move, but only once, the way
// the app windows do it"). Until it has been closed it follows the scroll both
// ways: a reader who turns back halfway sees it open again, so the way down
// again has no stretch where nothing moves. Once closed it stays closed and the
// page scrolls past it like any other, back up too (Johannes, same day: "the
// unzipping only happens if the zipping has never been fully completed"). As
// with the windows, the server, a reader who asked for reduced motion and a
// section already on screen when the page wakes show it closed and never hold:
// only a section still below the fold is opened, out of sight, and waits.
//
// The hold is CSS sticky on the stage, followed by a spacer as long as the
// stretch; the browser keeps the screen still and the script only reads how
// far the stage has slid down its wrapper. Both lengths are in svh, the small
// screen height, so Safari's toolbar folding away on an iPhone moves nothing.
// To let go, the spacer is taken out and the page scrolled by the same amount
// in the same frame: nothing on screen moves. That scroll must not land while
// the page still glides after a swipe (on an iPhone it stops the glide dead),
// so a closed zipper lets go at the first of: the page rests, a finger is on
// the screen, the wheel turns up, a key is pressed. Each comes before the page
// could scroll back into the hold.

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
    let closed = false;
    let touching = false;
    let gone = false;
    // Synchronous, so the stretch is out before the browser goes on with the
    // wheel turn or key press that called it.
    const letGo = () => {
      if (gone) return;
      gone = true;
      before.current = el.getBoundingClientRect().top;
      flushSync(() => {
        setProgress(1);
        setArmed(false);
      });
    };
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY < 0) letGo();
    };
    const measure = () => {
      frame = 0;
      if (closed) return;
      const track = spacer.current?.getBoundingClientRect().height ?? 0;
      if (!track) return;
      // How far the stage has slid down its wrapper: 0 until it sticks, the
      // spacer's length when the hold ends; less again when the reader turns back.
      const slid = el.getBoundingClientRect().top - el.parentElement!.getBoundingClientRect().top;
      const p = Math.max(0, Math.min(1, slid / track));
      setProgress(p);
      if (p < 1) return;
      closed = true;
      // Not passive, so the browser waits for it before scrolling.
      window.addEventListener("wheel", onWheel, { passive: false });
      window.addEventListener("keydown", letGo);
      if (touching) letGo();
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
      window.clearTimeout(rest);
      rest = window.setTimeout(() => closed && letGo(), REST);
    };
    const onTouch = (e: TouchEvent) => {
      touching = e.touches.length > 0;
      if (closed && touching) letGo();
    };
    const touches = ["touchstart", "touchend", "touchcancel"] as const;
    const resized = new ResizeObserver(() => {
      setHeight(el.offsetHeight);
      onScroll();
    });
    resized.observe(el);
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    for (const type of touches) window.addEventListener(type, onTouch, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      for (const type of touches) window.removeEventListener(type, onTouch);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", letGo);
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
