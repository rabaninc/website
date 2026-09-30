"use client";

import Image, { type StaticImageData } from "next/image";
import { type CSSProperties, type ReactNode, useEffect, useRef } from "react";

import { BODY, H2, LABEL } from "../type";

// The pitch deck on /about as a big wheel (Johannes, 2026-09-30): the slides
// hang on it like gondolas on a Ferris wheel, upright and facing you the
// whole way round, never tilting, and the whole deck turns as one. The one in
// front is flat, sharp and whole. The one you saw before rides on up and
// back, smaller, out of focus and veiled in the page's sage, and shows above
// it; the one before that goes over the top and sinks away behind. The next
// one waits below, a glimpse at the foot of the screen, and comes up round
// the front of the wheel, a touch nearer to you than the slot, to take its
// place. The wheel is seen a little from the side, so going back also means
// going left and every path is a curve, not a straight line into the
// distance. Everything is a true perspective projection of that wheel.
// Scrolling turns it the way the Digital Crown turns an Apple Watch list:
// every bit of scroll moves it, a little slower near each slide and a little
// faster between (a detent), the deck follows the scroll on a quick spring,
// and when a scroll someone made stops between two slides it settles on one,
// the way they were going.
// From `lg` the deck stands on the left and what the founders say to the
// slide in front stands on the right, crossfading as the wheel turns. Below
// `lg` the deck is stuck at the top of the screen and the texts scroll past
// under it; each turns the wheel as it comes up. With reduced motion asked
// for, the slides simply stand one under another, each with its text beneath.

type Slide = { src: StaticImageData; alt: string; speaker: string; script: ReactNode };

// Scroll per slide from `lg`, in viewport heights. Every bit of it turns
// the wheel; the rests are the detent and the settle, not dead scroll.
const STEP = 0.5;
// The detent: how much slower the wheel turns near a slide than between two
// (0 = even, 1 = it would stop dead on each slide).
const DETENT = 0.35;
// How quickly the deck follows the scroll, and how long the settle takes: the
// response of a critically damped spring, in seconds (no overshoot).
const FOLLOW = 0.16;
const SETTLE = 0.42;

// The wheel, in slide heights and degrees. `radius` is the wheel's; the slot
// in front sits `slot` above the point of the wheel nearest to you, so the
// next slide, coming up the front, passes nearer to you than the slot and is
// in front of the one it covers, as on a real wheel. Each slide turns the
// wheel on by `up`: the one before rides up and back to the top, the one
// before that has gone over it. `yaw` turns the wheel away from square-on
// (little on a phone, where the slides fill the width); `eye` is how far the
// eye is from the slot, looking at its centre. Below lg the next slide starts
// `drop` lower, so it waits out of sight under the stage's soft edge.
type Wheel = { radius: number; slot: number; up: number; yaw: number; eye: number; drop: number };
const DESK: Wheel = { radius: 1.6, slot: 30, up: 40, yaw: 24, eye: 2.4, drop: 0 };
const PHONE: Wheel = { radius: 1.6, slot: 30, up: 40, yaw: 6, eye: 3.2, drop: 0.35 };
// The sage veil on the slide before (one round the wheel) and on the next
// one waiting below; how far round a seen slide still shows at all.
const PREV = 0.58;
const NEXT = 0.5;
const GONE = 2.1;
const RADIUS = "rounded-[12px]";

const pad = (k: number) => String(k).padStart(2, "0");
// A soft edge of the page's sage, eased rather than linear (a linear ramp
// shows a line where it ends): solid at `from`, gone at the far side.
const fog = (from: string) =>
  `linear-gradient(to ${from === "bottom" ? "top" : "bottom"}, ${[100, 92, 70, 38, 12, 0]
    .map((a, k) => `color-mix(in srgb, var(--paper) ${a}%, transparent) ${k * 20}%`)
    .join(", ")})`;
// A share of the slot's height as a padding: `part` of the column's width ·
// 9/16 (a percentage padding measures the width), or of the screen's room
// when the room caps the slot.
const share = (part: string) =>
  `min(calc(var(${part}) * 56.25%), calc(var(--room) / (1 + var(--pile) + var(--below)) * var(${part})))`;
const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
const smooth = (a: number, b: number, x: number) => {
  const u = clamp((x - a) / (b - a), 0, 1);
  return u * u * (3 - 2 * u);
};
const rad = Math.PI / 180;

// The patch that hides a slide's logo takes the slide's own colour just left
// of the logo (white, or the last slide's red), read once from the small
// blurred copy when it has loaded; if that fails it stays the page's white.
function tint(img: HTMLImageElement, mark: HTMLDivElement | null) {
  if (!mark) return;
  try {
    const c = document.createElement("canvas");
    c.width = c.height = 1;
    const g = c.getContext("2d");
    if (!g) return;
    g.drawImage(img, img.naturalWidth * 0.9, img.naturalHeight * 0.03, 1, 1, 0, 0, 1, 1);
    const [r, gr, b] = g.getImageData(0, 0, 1, 1).data;
    mark.style.backgroundColor = `rgb(${r} ${gr} ${b})`;
  } catch {
    // Keep the white.
  }
}

// Where slide i hangs when the deck stands at t (d = t - i: > 0 seen and
// going round, < 0 still to come): its centre's offset from the slot's
// centre and its scale, from a true perspective projection of the wheel.
function hang(d: number, w: Wheel) {
  const th = (w.slot + w.up * d) * rad;
  const s0 = w.slot * rad;
  let up = -w.radius * (Math.sin(th) - Math.sin(s0));
  // Let down by drop · d² below the slot: out of sight at first, the same
  // pace as the wheel's where it meets the slot (no jerk as it passes).
  if (d < 0) up += w.drop * d * d;
  const near = w.radius * (Math.cos(th) - Math.cos(s0));
  const x = near * Math.sin(w.yaw * rad);
  const z = near * Math.cos(w.yaw * rad);
  const s = w.eye / (w.eye - z);
  return { x: x * s, y: up * s, s };
}

// The sage veil over a slide away from the front: PREV one round the wheel,
// all there by GONE; NEXT on the one waiting below, lifting as it comes up.
// A veil in the page's own colour rather than transparency, so the slide
// behind never shows through.
const veilOf = (d: number) =>
  d <= 0 ? NEXT * smooth(0.3, 1, -d) : d < 1 ? PREV * Math.pow(d, 1.4) : PREV + (1 - PREV) * smooth(1, GONE, d);

export function SlideStack({ title, slides }: { title: string; slides: readonly Slide[] }) {
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const casts = useRef<(HTMLDivElement | null)[]>([]);
  const veils = useRef<(HTMLDivElement | null)[]>([]);
  const marks = useRef<(HTMLDivElement | null)[]>([]);
  const blurs = useRef<(HTMLImageElement | null)[]>([]);
  const texts = useRef<(HTMLDivElement | null)[]>([]);
  const reads = useRef<(HTMLDivElement | null)[]>([]);
  const n = slides.length;

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const wide = window.matchMedia("(min-width: 1024px)");
    let frame = 0;
    let last = 0;
    let x = -1; // where the deck is drawn, in slides; -1 before the first draw
    let v = 0;
    let h = 1; // the slot's height, px
    let wheel = DESK;
    // Below lg: where each text starts in the track, and the band of the
    // screen its top crosses while it turns the wheel to its slide.
    let starts: number[] = [];
    let from = 0;
    let turn = 1;

    const measure = () => {
      h = cards.current[0]?.offsetHeight || 1;
      stage.current?.style.setProperty("--slot-h", `${h}px`);
      wheel = wide.matches ? DESK : PHONE;
      starts = reads.current.map((r) => r?.offsetTop ?? 0);
      const bottom = (stage.current?.getBoundingClientRect().height ?? 0) + navH();
      turn = Math.min(0.3 * window.innerHeight, 0.6 * (window.innerHeight - bottom));
      // A text has turned the wheel to its slide once its label (40px into
      // it) sits just under the stage's soft edge.
      from = bottom - 8 + turn;
    };
    const navH = () => parseFloat(getComputedStyle(el).getPropertyValue("--nav-h")) || 56;

    // Scroll to deck position, before the detent: from lg linear through the
    // track; below it, text by text.
    const span = () => Math.max(1, el.offsetHeight - window.innerHeight);
    const raw = () => {
      const top = el.getBoundingClientRect().top;
      if (wide.matches) return clamp(-top / span(), 0, 1) * (n - 1);
      let t = 0;
      for (let i = 1; i < n; i++) t += clamp((from - (top + starts[i])) / turn, 0, 1);
      return t;
    };
    const detent = (p: number) => p - (DETENT / (2 * Math.PI)) * Math.sin(2 * Math.PI * p);

    const draw = (t: number) => {
      cards.current.forEach((card, i) => {
        if (!card) return;
        const d = t - i;
        if (d >= GONE || d <= -1.5) {
          card.style.visibility = "hidden";
          return;
        }
        const g = hang(d, wheel);
        const veil = veilOf(d);
        card.style.visibility = "visible";
        card.style.transform = `translate3d(${g.x * h}px, ${g.y * h}px, 0) scale(${g.s})`;
        const cast = casts.current[i];
        const vl = veils.current[i];
        const mark = marks.current[i];
        const blur = blurs.current[i];
        if (cast) cast.style.opacity = String(1 - veil);
        if (vl) vl.style.opacity = String(veil);
        // Out of focus away from the front: a copy blurred once, faded in,
        // never a blur that changes (that would be redrawn every frame).
        if (blur) blur.style.opacity = String(d > 0 ? smooth(0.25, 1.1, d) : smooth(0.4, 1, -d));
        // The Raban logo in the slide's corner shows only in front: it goes
        // as the slide leaves and comes as the next one arrives, so none
        // shows on the slides going round (Johannes, 2026-09-30).
        if (mark) mark.style.opacity = String(d > 0 ? smooth(0.05, 0.45, d) : smooth(0.15, 0.6, -d));
      });
      texts.current.forEach((text, i) => {
        if (!text) return;
        const d = t - i;
        const o = Math.max(0, 1 - Math.abs(d) * 2.5);
        text.style.opacity = String(o);
        text.style.transform = `translate3d(0, ${-d * 24}px, 0)`;
        text.style.visibility = o > 0 ? "visible" : "hidden";
      });
    };

    // One exact step of a critically damped spring (frame-rate independent).
    const spring = (at: number, vel: number, to: number, dt: number, response: number) => {
      const w = (2 * Math.PI) / response;
      const dx = at - to;
      const c = vel + w * dx;
      const e = Math.exp(-w * dt);
      return [to + (dx + c * dt) * e, (vel - w * c * dt) * e];
    };

    const tick = (now: number) => {
      frame = 0;
      if (el.offsetParent === null) return; // the list is showing instead
      const want = detent(raw());
      if (x < 0) {
        x = want;
        v = 0;
      } else {
        const dt = Math.min(1 / 30, Math.max(0, now - last) / 1000);
        [x, v] = spring(x, v, want, dt, FOLLOW);
        if (Math.abs(x - want) < 1e-4 && Math.abs(v) < 1e-3) {
          x = want;
          v = 0;
        }
      }
      last = now;
      draw(x);
      if (x !== want || settling) frame = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (frame) return;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };

    // The settle: when the scroll stops between two slides, scroll on to one
    // of them on a soft spring, the way it was going; any touch of wheel,
    // finger or key cancels it.
    let dir = 0;
    let lastY = window.scrollY;
    let settling = false;
    // Only a scroll someone made settles: not a script's or a link's jump.
    let touched = false;
    let idle = 0;
    // Safari before 26.2 has no scrollend; a pause of 140 ms stands in.
    const ends = "onscrollend" in window;
    // The scroll position where the deck rests on slide k, coming from
    // slide k - 1 (end) or about to leave it for k + 1 (start).
    const restAt = (k: number, end: boolean) => {
      const top = el.getBoundingClientRect().top + window.scrollY;
      if (wide.matches) return top + (span() * k) / (n - 1);
      const i = end ? k : k + 1;
      return top + starts[i] - (end ? from - turn : from);
    };
    const settleTo = (to: number) => {
      let y = window.scrollY;
      let vy = 0;
      let t0 = performance.now();
      settling = true;
      const run = (now: number) => {
        if (!settling) return;
        const dt = Math.min(1 / 30, (now - t0) / 1000);
        t0 = now;
        [y, vy] = spring(y, vy, to, dt, SETTLE);
        if (Math.abs(y - to) < 0.5 && Math.abs(vy) < 5) {
          y = to;
          settling = false;
        }
        window.scrollTo({ top: y, behavior: "instant" });
        wake();
        if (settling) requestAnimationFrame(run);
      };
      requestAnimationFrame(run);
    };
    const settle = () => {
      if (settling || !touched || el.offsetParent === null) return;
      // A mouse wheel clicked notch by notch ends a scroll after every
      // notch; wait out a short pause so a slow turn is not cut short.
      const wait = lastWheel + 260 - performance.now();
      if (wait > 0) {
        window.clearTimeout(idle);
        idle = window.setTimeout(settle, wait);
        return;
      }
      touched = false;
      const p = raw();
      const k = Math.floor(p);
      const f = p - k;
      if (f < 0.01 || f > 0.99) return;
      // Any deliberate move carries on to the next slide (one notch of a
      // mouse wheel is enough); only a nudge of under a tenth falls back.
      const next = dir > 0 ? f > 0.1 : dir < 0 ? f > 0.9 : f > 0.5;
      settleTo(next ? restAt(k + 1, true) : restAt(k, false));
    };
    let lastWheel = 0;
    const cancel = (e: Event) => {
      settling = false;
      touched = true;
      if (e.type === "wheel") lastWheel = performance.now();
    };
    const onScroll = () => {
      if (!settling) {
        const y = window.scrollY;
        if (y !== lastY) dir = Math.sign(y - lastY);
        lastY = y;
        if (!ends) {
          window.clearTimeout(idle);
          idle = window.setTimeout(settle, 140);
        }
      }
      wake();
    };
    // From lg, the arrow and page keys step one slide while the deck is on
    // screen (a page key would otherwise skip almost two).
    const onKey = (e: KeyboardEvent) => {
      if (!wide.matches || e.altKey || e.ctrlKey || e.metaKey || el.offsetParent === null) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable]")) return;
      if (e.key === " " && target?.closest("a, button, summary")) return;
      const r = el.getBoundingClientRect();
      if (r.top > 1 || r.bottom < window.innerHeight - 1) return;
      const fwd = e.key === "ArrowDown" || e.key === "PageDown" || (e.key === " " && !e.shiftKey);
      const back = e.key === "ArrowUp" || e.key === "PageUp" || (e.key === " " && e.shiftKey);
      if (!fwd && !back) return;
      const p = raw();
      const k = fwd ? Math.floor(p + 0.02) + 1 : Math.ceil(p - 0.02) - 1;
      if (k < 0 || k > n - 1) return;
      e.preventDefault();
      settleTo(restAt(k, true));
    };
    const onResize = () => {
      measure();
      x = -1;
      wake();
    };

    measure();
    tick(performance.now());
    // Cancel first: a key the deck steps with starts a new settle after it.
    for (const type of ["wheel", "touchstart", "pointerdown", "keydown"] as const)
      window.addEventListener(type, cancel, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scrollend", settle);
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("keydown", onKey);
    wide.addEventListener("change", onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(idle);
      settling = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scrollend", settle);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
      for (const type of ["wheel", "touchstart", "pointerdown", "keydown"] as const)
        window.removeEventListener(type, cancel);
      wide.removeEventListener("change", onResize);
    };
  }, [n]);

  const label = (i: number) => `${pad(i + 1)} / ${pad(n)} · ${slides[i].speaker}`;

  return (
    <>
      <h2 className={`${H2} mb-6 hidden motion-safe:block lg:motion-safe:hidden`}>{title}</h2>
      {/* The track: from lg STEP of scroll per slide, the deck's position
          running evenly through it; below lg as long as the texts, the deck
          turning as each text comes up. data-deck-track is what the film
          tool that checks this motion looks for. */}
      <div
        ref={track}
        data-deck-track={n}
        className="relative hidden motion-safe:block lg:h-[calc(var(--deck-steps)*var(--deck-step)+100svh)]"
        style={{ "--deck-steps": n - 1, "--deck-step": `${STEP * 100}svh` } as CSSProperties}
      >
        <div
          ref={stage}
          className="sticky top-[var(--nav-h)] z-10 bg-paper pt-3 [--below:0] [--pile:0.44] [--room:calc(62svh_-_48px)] lg:top-0 lg:grid lg:[--below:0.16] lg:[--room:calc(100svh_-_var(--nav-h)_-_72px)] lg:[--slot-h:min(calc((100vw_-_192px)*4/7*9/16),calc(var(--room)/(1_+_var(--pile)_+_var(--below))))] lg:h-[100svh] lg:grid-cols-[minmax(0,4fr)_minmax(0,3fr)] lg:gap-x-16 lg:bg-transparent lg:pt-[var(--nav-h)]"
        >
          <div className="flex min-h-0 flex-col">
            <h2 className={`${H2} hidden pt-6 lg:block`}>{title}</h2>
            {/* The slot, with room above it for the slides going round the
                top (--pile of the slot's height) and, from lg, below it for a
                glimpse of the next one coming up (--below): whether the slot
                fills the column (then these are --pile · 9/16 of the column's
                width, which is what a percentage padding measures) or the
                screen's height caps it (--room, the height the three share).
                From lg the deck stands on the foot of the screen, the glimpse
                cut by its edge. Below lg the deck runs a little wider than the
                text, 16px from the screen's edges, and the next slide comes up
                out of a soft sage edge at its foot. */}
            <div className="relative -mx-3 grid pb-12 [clip-path:inset(-100vh_-100vw_0_-100vw)] lg:mx-0 lg:mt-auto lg:pb-0 lg:[clip-path:none]">
              <div aria-hidden style={{ paddingTop: share("--pile") }} />
              {slides.map((s, i) => (
                <div
                  key={s.alt}
                  ref={(el) => {
                    cards.current[i] = el;
                  }}
                  className="relative col-start-1 row-start-2 justify-self-center will-change-transform lg:justify-self-start"
                  style={{
                    width: "min(100%, calc(var(--room) / (1 + var(--pile) + var(--below)) * 16 / 9))",
                    zIndex: i,
                    visibility: i === 0 ? "visible" : "hidden",
                  }}
                >
                  <div
                    ref={(el) => {
                      casts.current[i] = el;
                    }}
                    aria-hidden
                    className={`absolute inset-0 ${RADIUS} shadow-[var(--window-cast)] will-change-[opacity]`}
                  />
                  <div className={`relative overflow-hidden ${RADIUS} bg-hero`}>
                    <Image
                      src={s.src}
                      alt={s.alt}
                      sizes="(min-width: 1024px) 57vw, 100vw"
                      priority={i < 2}
                      className="block h-auto w-full"
                    />
                    <Image
                      ref={(el) => {
                        blurs.current[i] = el;
                      }}
                      src={s.src}
                      alt=""
                      aria-hidden
                      sizes="320px"
                      onLoad={(e) => tint(e.currentTarget, marks.current[i])}
                      className="absolute inset-0 h-full w-full opacity-0 blur-[3px] will-change-[opacity] lg:blur-[5px]"
                    />
                    <div
                      ref={(el) => {
                        marks.current[i] = el;
                      }}
                      aria-hidden
                      className="absolute top-[3.8%] left-[91.8%] h-[11%] w-[6.6%] rounded-[25%] bg-hero opacity-0 blur-[2px] will-change-[opacity]"
                    />
                    <div
                      ref={(el) => {
                        veils.current[i] = el;
                      }}
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-paper opacity-0 will-change-[opacity]"
                    />
                  </div>
                </div>
              ))}
              <div aria-hidden className="row-start-3" style={{ paddingTop: share("--below") }} />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 z-[100] h-12 lg:hidden"
                style={{ backgroundImage: fog("bottom") }}
              />
            </div>
          </div>
          {/* From lg each slide's text stands beside the slot: its label
              level with the slot's top edge, or, when it is too long for
              that, raised until it ends level with the slot's foot. Its size
              follows the screen's height so the longest (slide 6) still fits
              a short laptop. --slot-h is measured; the class gives a close
              first guess. */}
          <div className="relative hidden lg:block">
            {slides.map((s, i) => (
              <div
                key={s.alt}
                ref={(el) => {
                  texts.current[i] = el;
                }}
                className="absolute inset-x-0 top-6 bottom-[calc(var(--below)*var(--slot-h))] flex flex-col will-change-[transform,opacity]"
                style={{ opacity: i === 0 ? 1 : 0, visibility: i === 0 ? "visible" : "hidden" }}
              >
                <div aria-hidden className="shrink basis-[calc(100%-var(--slot-h))]" />
                <p className={LABEL}>{label(i)}</p>
                <p className="mt-4 max-w-[34em] text-[clamp(14px,2.3svh,18px)] leading-[1.4] text-pretty">{s.script}</p>
              </div>
            ))}
          </div>
          {/* Below lg the texts scroll up under the stuck deck and fade out
              into it. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-full h-8 lg:hidden"
            style={{ backgroundImage: fog("top") }}
          />
        </div>
        {/* Each text keeps the deck on its slide for at least 42% of a
            screen of scroll, however short it is, before the next one comes
            up and turns the wheel. */}
        <div className="pb-[30svh] lg:hidden">
          {slides.map((s, i) => (
            <div
              key={s.alt}
              ref={(el) => {
                reads.current[i] = el;
              }}
              data-deck-text={i}
              className="min-h-[42svh] pt-10"
            >
              <p className={LABEL}>{label(i)}</p>
              <p className={`${BODY} mt-3 text-pretty`}>{s.script}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-[var(--content-gap)] motion-safe:hidden">
        <h2 className={H2}>{title}</h2>
        {slides.map((s, i) => (
          <div key={s.alt}>
            <div className={`overflow-hidden ${RADIUS} bg-hero shadow-[var(--window-cast)]`}>
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
