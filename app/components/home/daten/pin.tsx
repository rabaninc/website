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
// The hold is CSS sticky on the stage, followed by a stretch of empty space;
// the browser keeps the screen still and the script only reads how far the
// stage has slid down over the stretch. Both lengths are in svh, the small
// screen height, so Safari's toolbar folding away on an iPhone moves nothing.
// The moment the zipper is closed the stage stops being sticky where it stands
// and the stretch moves over it: nothing on screen moves and the page is not
// scrolled, so a swipe's glide goes on (moving the page mid-glide stops it dead
// on an iPhone), and nothing can hold the section again. A stage still sticky
// after closing stayed put on the way back up while the section under it moved
// on (Johannes' iPhone, same day). The stretch, now above the section, comes
// out the first time the page turns back up or rests, with the page scrolled
// by the same amount in the same frame.

const Progress = createContext(1);

/** How far the scroll has closed the zipper, 0 to 1; 1 outside a hold. */
export const usePinProgress = () => useContext(Progress);

/** How long the page must rest before the stretch is taken out. */
const REST = 180;

/** Where the stretch is: under the stage while it holds, over it once the zipper is closed. */
type Stretch = "under" | "over" | null;

export function PinOnce({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const stage = useRef<HTMLDivElement>(null);
  const spacer = useRef<HTMLDivElement>(null);
  const [stretch, setStretch] = useState<Stretch>(null);
  const [progress, setProgress] = useState(1);
  const [height, setHeight] = useState(0);
  const before = useRef<number | null>(null);

  useEffect(() => {
    const el = stage.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    setHeight(el.offsetHeight);
    setProgress(0);
    setStretch("under");
  }, []);

  // Holding: the scroll closes the zipper, both ways, until it is closed.
  useEffect(() => {
    const el = stage.current;
    if (stretch !== "under" || !el) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const track = spacer.current?.getBoundingClientRect().height ?? 0;
      if (!track) return;
      // How far the stage has slid down its wrapper: 0 until it sticks, the
      // stretch's length when the hold ends; less again when the reader turns back.
      const slid = el.getBoundingClientRect().top - el.parentElement!.getBoundingClientRect().top;
      const p = Math.max(0, Math.min(1, slid / track));
      if (p < 1) {
        setProgress(p);
        return;
      }
      flushSync(() => {
        setProgress(1);
        setStretch("over");
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    const resized = new ResizeObserver(() => {
      setHeight(el.offsetHeight);
      onScroll();
    });
    resized.observe(el);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      resized.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [stretch]);

  // Closed: the stretch over the section comes out when the page turns back
  // up (a finger or the wheel is driving it then, nothing glides) or rests.
  useEffect(() => {
    const el = stage.current;
    if (stretch !== "over" || !el) return;
    let last = window.scrollY;
    let rest = 0;
    const letGo = () => {
      before.current = el.getBoundingClientRect().top;
      flushSync(() => setStretch(null));
    };
    const onScroll = () => {
      const y = window.scrollY;
      // Up, but not the bounce back from overscrolling the page's foot.
      const foot = document.documentElement.scrollHeight - window.innerHeight;
      if (y < last - 1 && y < foot - 1) {
        letGo();
        return;
      }
      last = y;
      window.clearTimeout(rest);
      rest = window.setTimeout(letGo, REST);
    };
    rest = window.setTimeout(letGo, REST);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(rest);
    };
  }, [stretch]);

  // The stretch is out: scroll by what the stage moved, before the frame is
  // painted (zero where the browser's own scroll anchoring already did it).
  useLayoutEffect(() => {
    const el = stage.current;
    if (stretch !== null || before.current === null || !el) return;
    window.scrollBy(0, el.getBoundingClientRect().top - before.current);
    before.current = null;
  }, [stretch]);

  // Held below the navbar if the section fits the screen, else with its foot
  // (where the zipper is) on the bottom of the screen. The stretch is a spacer,
  // not padding: sticky holds an element only within its parent's content box.
  return (
    <div className={className}>
      {stretch === "over" && <div aria-hidden className="h-[60svh]" />}
      <div ref={stage} style={stretch === "under" ? { position: "sticky", top: `min(var(--nav-h), calc(100svh - ${height}px))` } : undefined}>
        <Progress.Provider value={progress}>{children}</Progress.Provider>
      </div>
      {stretch === "under" && <div ref={spacer} aria-hidden className="h-[60svh]" />}
    </div>
  );
}
