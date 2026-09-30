"use client";

import Image, { type StaticImageData } from "next/image";
import { type CSSProperties, type ReactNode, useEffect, useRef } from "react";

import { BODY, H2, LABEL } from "../type";

// The pitch deck on /about as a Rolodex (Johannes, 2026-09-30: "it should
// read much more as a wheel", after the Apple Watch's Digital Crown). The
// slides ride on a drum behind the one in front. The next slide waits on
// the drum's underside, tilted away and veiled, as a glimpse below the
// front slide. Scrolling rolls it up and forward until it lands flat on the
// slide before; only as it arrives does it push that one back over the top
// of the drum, where the covered slides lie as blank platters in a small
// pile, each thinner, narrower and fainter than the one in front — the
// drum's curve. Covered slides lose their picture on the way back, so no
// Raban logo shows in the pile.
// The feel is the Crown's: every bit of scroll moves the wheel (no dead
// rests), the wheel slows as a slide arrives (a detent) and follows the
// scroll on a critically damped spring; on desktop, when the scrolling stops
// between two slides, the page glides on to the next one in the direction
// you were going, so a single notch of a mouse wheel brings the next slide.
// Desktop (lg): the stage is sticky for the length of the track, the deck on
// the left, what the founders say to the slide in front on the right,
// crossfading. Phone: the deck is sticky under the navbar and the texts run
// underneath it in the page's own flow; the wheel turns as each text comes up
// to the deck, so a long script simply takes longer to scroll past.
// With reduced motion asked for, the slides stand one under another, each
// with its text beneath.

type Slide = { src: StaticImageData; alt: string; speaker: string; script: ReactNode };

// The drum, in heights of the front slide. The eye is EYE in front of it.
const EYE = 3;
// The coming slides ride up the underside of a drum UNDER behind the front
// slide's centre: the next one waits at GLIMPSE degrees, veiled, the one
// after it is out of sight at GONE (past the bottom, facing away).
const UNDER = 0.95;
const GLIMPSE = 66;
const GONE = 100;
const GLIMPSE_VEIL = 0.55;
// The glimpse shows its picture only faintly; it comes up to full as the
// slide rises.
const GLIMPSE_IMAGE = 0.6;
// The covered slide tips back over the top, TIP degrees, turning about the
// axis that brings its top edge to FIRST_TOP on screen, FIRST_BACK behind
// the front slide: a roller just behind the front slide's top edge. On the
// way its top edge lifts by up to LIFT and settles again, over the top. By
// then its picture has gone (a blank platter) and it has folded down to
// FOLD of its height, so its lower part, hidden behind the new front slide
// anyway, never swings out past the deck's sides; that is what lets the
// platter lie close behind the front slide, nearly as wide as it.
const TIP = 60;
const FIRST_TOP = -0.565;
const FIRST_BACK = 0.14;
const LIFT = 0.05;
const FOLD = 0.35;
// The first platter's width, as a share of the front slide's.
const NARROW = 0.95;
// Further back, each platter shows a strip RATIO as tall as the one in front
// of it (the first STRIP), lies BACK further behind and flatter towards
// TIP_MAX, and is a little narrower and more veiled: the drum's curve.
const STRIP = 0.04;
const RATIO = 0.6;
const BACK = 0.16;
const TIP_MAX = 74;
const VEILS = [0, 0.2, 0.45, 0.7, 1];
// The room the deck keeps above and below the front slide for the pile and
// the glimpse.
const ABOVE = 0.2;
const BELOW = 0.3;

// How much scroll a slide takes on desktop, in screen heights. Every bit of
// it turns the wheel (the old deck took 0.75 with a dead rest at each end).
const STEP = 0.5;
// On a phone the wheel turns over TURN screen heights of scroll, just before
// the slide's text reaches the deck; the rest of the text is read at rest.
const TURN = 0.26;
// The detent: the wheel moves at 1 − DETENT of the scroll's speed as a slide
// arrives and 1 + DETENT half way between, so slides feel sticky but never
// dead.
const DETENT = 0.35;
// How quickly the wheel follows the scroll, and how quickly a stopped scroll
// settles onto a slide, in seconds (critically damped springs, as SwiftUI's
// `.spring(duration:, bounce: 0)`).
const FOLLOW = 0.16;
const SETTLE = 0.42;
// How far past a slide (in slides) a scroll must go before the settle takes
// it on to the next rather than back: just past jitter.
const NUDGE = 0.04;

const RADIUS = "rounded-[12px]";
const pad = (k: number) => String(k).padStart(2, "0");
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
const rad = (deg: number) => (deg * Math.PI) / 180;

// Where the front slide's top edge goes, and how far it tilts, when the
// slide turns by `a` degrees (top edge away) about an axis `ya` below its
// centre and `r` behind it. Slide heights, from the front slide's centre,
// y down, z towards the eye.
function turned(ya: number, r: number, a: number) {
  const c = Math.cos(rad(a));
  const s = Math.sin(rad(a));
  const dy = -0.5 - ya;
  return { y: ya + dy * c - r * s, z: -r + dy * s + r * c, a };
}

// The axis the covered slide tips about: the one that takes its top edge
// from where it is, in front, to the first platter's top edge (y, z) in a
// turn of `a` degrees.
function axis(y: number, z: number, a: number) {
  const c = Math.cos(rad(a));
  const s = Math.sin(rad(a));
  const p = y + 0.5 * c;
  const q = z + 0.5 * s;
  const det = 2 * c - 2;
  return { ya: (-(1 - c) * p + s * q) / det, r: ((1 - c) * q + s * p) / det };
}
const FIRST_Y = (FIRST_TOP * (EYE + FIRST_BACK)) / EYE;
const ROLLER = axis(FIRST_Y, -FIRST_BACK, TIP);

type Pose = { y: number; z: number; a: number; sx: number; sy: number; veil: number; image: number; cast: number };

// Every slide's pose from its distance to the front, d = position − index:
// d < 0 still to come, 0 in front, d > 0 covered. `y`, `z`: its top edge;
// `a`: its tilt; `sx`, `sy`: its scale; `veil`: how far it is veiled in the
// page's sage; `image`: how much of its picture shows (0 = a blank
// platter); `cast`: its shadow.
function pose(d: number): Pose | null {
  if (d <= -2 || d >= 4) return null;
  if (d < 0) {
    const u = -d;
    if (u <= 1) {
      // Rising from the glimpse: fast at first, landing softly (u²); it
      // comes clear early (u³), so it is a slide, not a ghost, that lands.
      const p = turned(0, UNDER, -GLIMPSE * u * u);
      const dim = u * u * u;
      return { ...p, sx: 1, sy: 1, veil: GLIMPSE_VEIL * dim, image: 1 - (1 - GLIMPSE_IMAGE) * dim, cast: 1 };
    }
    // From out of sight to the glimpse, out of the page's sage.
    const f = u - 1;
    const p = turned(0, UNDER, -(GLIMPSE + (GONE - GLIMPSE) * f));
    const veil = GLIMPSE_VEIL + (1 - GLIMPSE_VEIL) * smooth(0, 0.8, f);
    return { ...p, sx: 1, sy: 1, veil, image: GLIMPSE_IMAGE, cast: 1 - f };
  }
  const image = 1 - smooth(0.3, 0.85, d);
  if (d <= 1) {
    // Pushed over the top: barely moving while the next slide rises, then
    // tipping back fast as it lands (d²).
    const e = d * d;
    const p = turned(ROLLER.ya, ROLLER.r, TIP * e);
    const sy = 1 - (1 - FOLD) * smooth(0, 1, d);
    // Never wider than the deck: its bottom edge, the part nearest the eye,
    // stays inside the front slide's sides.
    const near = p.z + sy * Math.sin(rad(p.a));
    const sx = Math.min(1 - (1 - NARROW) * e, (EYE - near) / EYE);
    return { ...p, y: p.y - LIFT * Math.sin(Math.PI * e), sx, sy, veil: VEILS[1] * d, image, cast: 1 - 0.6 * d };
  }
  // In the pile (the same bound on its width, so it joins the tip without
  // a step).
  const k = d - 1;
  const top = FIRST_TOP - (STRIP * (1 - Math.pow(RATIO, k))) / (1 - RATIO);
  const z = -FIRST_BACK - BACK * k;
  const a = TIP + (TIP_MAX - TIP) * (1 - Math.exp(-k / 1.2));
  const j = Math.min(3, Math.floor(d));
  const veil = VEILS[j] + (VEILS[j + 1] - VEILS[j]) * (d - j);
  const sx = Math.min(NARROW - 0.025 * k, (EYE - z - FOLD * Math.sin(rad(a))) / EYE);
  return { y: (top * (EYE - z)) / EYE, z, a, sx, sy: FOLD, veil, image, cast: Math.max(0, 0.4 - 0.4 * k) };
}

// One step of a critically damped spring towards `to`, exact for any frame
// time, so the motion is the same at 60 and 120 Hz.
function spring(x: number, v: number, to: number, dt: number, response: number) {
  const w = (2 * Math.PI) / response;
  const dx = x - to;
  const c = v + w * dx;
  const e = Math.exp(-w * dt);
  return [to + (dx + c * dt) * e, (v - w * c * dt) * e] as const;
}

export function SlideStack({ title, slides }: { title: string; slides: readonly Slide[] }) {
  const track = useRef<HTMLDivElement>(null);
  const area = useRef<HTMLDivElement>(null);
  const deck = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const casts = useRef<(HTMLDivElement | null)[]>([]);
  const pictures = useRef<(HTMLImageElement | null)[]>([]);
  const veils = useRef<(HTMLDivElement | null)[]>([]);
  const texts = useRef<(HTMLDivElement | null)[]>([]);
  const reads = useRef<(HTMLDivElement | null)[]>([]);
  const n = slides.length;

  useEffect(() => {
    const el = track.current;
    const stuck = area.current;
    const wheel = deck.current;
    if (!el || !stuck || !wheel) return;
    const wide = window.matchMedia("(min-width: 1024px)");

    let h = 0; // the front slide's height, px
    let at = -1; // where the wheel is drawn, in slides; -1 before the first draw
    let speed = 0;
    let frame = 0;
    let last = 0;
    // Phone: each text's top relative to the track's, and the line under
    // the stuck deck where a text arrives.
    let tops: number[] = [];
    let line = 0;
    // The settle glide (desktop): whether it runs, where it has the page and
    // how fast, and where to; the direction last scrolled (1 down, -1 up);
    // whether the visitor has scrolled since the last settle, and with how
    // many fingers still down.
    let settling = false;
    let by = 0;
    let bySpeed = 0;
    let to = 0;
    let lastY = window.scrollY;
    let heading = 0;
    let touched = false;
    let fingers = 0;
    let idle = 0;
    let home = 0; // the slide the deck last came to rest on
    // Browsers without `scrollend` (Safari before 26.2) settle 140 ms after
    // the last scroll instead.
    const ends = "onscrollend" in window;

    const measure = () => {
      h = wheel.offsetHeight;
      wheel.style.perspective = `${EYE * h}px`;
      if (wide.matches) return;
      line = parseFloat(getComputedStyle(stuck).top) + stuck.offsetHeight;
      const base = el.getBoundingClientRect().top;
      tops = reads.current.map((r) => (r ? r.getBoundingClientRect().top - base : 0));
      // The last text gets the whole reading room, so the wheel is still
      // stuck when it has come up to the deck.
      const end = reads.current[n - 1];
      if (end) end.style.minHeight = `${Math.max(0, window.innerHeight - line)}px`;
    };

    // Where the scroll puts the wheel, in slides, before the detent.
    const raw = () => {
      const top = el.getBoundingClientRect().top;
      if (wide.matches) {
        const span = Math.max(1, el.offsetHeight - window.innerHeight);
        return clamp(-top / span, 0, 1) * (n - 1);
      }
      // Phone: slide k lands as its text's top reaches the line, turning
      // over the TURN before it.
      const turn = TURN * window.innerHeight;
      for (let k = 1; k < n; k++) {
        const y = top + tops[k] - line; // how far the text is below the line
        if (y > 0) return k - 1 + clamp(1 - y / turn, 0, 1);
      }
      return n - 1;
    };
    const detent = (p: number) => p - (DETENT / (2 * Math.PI)) * Math.sin(2 * Math.PI * p);

    const draw = (t: number) => {
      cards.current.forEach((card, i) => {
        if (!card) return;
        const p = pose(t - i);
        if (!p) {
          card.style.visibility = "hidden";
          return;
        }
        card.style.visibility = "visible";
        card.style.transform = `translate3d(0,${((p.y + 0.5) * h).toFixed(2)}px,${(p.z * h).toFixed(2)}px) rotateX(${p.a.toFixed(3)}deg) scale(${p.sx.toFixed(4)},${p.sy.toFixed(4)})`;
        const veil = veils.current[i];
        const picture = pictures.current[i];
        const cast = casts.current[i];
        if (veil) veil.style.opacity = p.veil.toFixed(3);
        if (picture) picture.style.opacity = p.image.toFixed(3);
        if (cast) cast.style.opacity = p.cast.toFixed(3);
      });
      // Desktop: the text rises with the wheel, fading out in the first
      // part of the turn, the next fading in over the last.
      texts.current.forEach((text, i) => {
        if (!text) return;
        const d = t - i;
        const o = Math.max(0, 1 - Math.abs(d) * 2.5);
        text.style.opacity = o.toFixed(3);
        text.style.transform = `translate3d(0,${(-d * 24).toFixed(2)}px,0)`;
        text.style.visibility = o > 0 ? "visible" : "hidden";
      });
    };

    const tick = (now: number) => {
      frame = 0;
      if (el.offsetParent === null) return; // the list is showing instead
      const goal = detent(raw());
      if (at < 0) {
        at = goal;
        speed = 0;
      } else {
        const dt = Math.min(1 / 30, Math.max(0, now - last) / 1000);
        [at, speed] = spring(at, speed, goal, dt, FOLLOW);
        if (Math.abs(at - goal) < 1e-4 && Math.abs(speed) < 1e-3) {
          at = goal;
          speed = 0;
        }
      }
      last = now;
      draw(at);
      if (at !== goal || settling) frame = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (frame) return;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };

    // Desktop: when the scrolling stops between two slides, glide the page
    // onto one, in the direction you were scrolling — like a detent on the
    // Crown, a single notch of a mouse wheel (a fifth of a slide) is enough
    // to bring the next one. (A threshold of a quarter, tried first, sent
    // every notch back where it came from.) Only after the visitor's own scrolling (wheel,
    // touch, keys): a jump to an anchor or a script's scroll is left alone.
    const pinned = () => {
      const r = el.getBoundingClientRect();
      return r.top <= 1 && r.bottom >= window.innerHeight - 1;
    };
    const place = (slide: number) => {
      const r = el.getBoundingClientRect();
      const span = el.offsetHeight - window.innerHeight;
      return window.scrollY + r.top + (span * slide) / (n - 1);
    };
    const glide = (slide: number) => {
      to = place(slide);
      by = window.scrollY;
      bySpeed = 0;
      if (Math.abs(to - by) < 0.5) {
        home = slide;
        return;
      }
      settling = true;
      let then = performance.now();
      const run = (now: number) => {
        if (!settling) return;
        const dt = Math.min(1 / 30, Math.max(0, now - then) / 1000);
        then = now;
        [by, bySpeed] = spring(by, bySpeed, to, dt, SETTLE);
        if (Math.abs(by - to) < 0.5 && Math.abs(bySpeed) < 5) {
          by = to;
          settling = false;
          home = slide;
        }
        window.scrollTo(0, by);
        wake();
        if (settling) requestAnimationFrame(run);
      };
      requestAnimationFrame(run);
    };
    // The next slide is counted from `home`, the one the deck last came to
    // rest on: a scroll that has already passed it (a glide the visitor
    // scrolled on through) settles on the nearest, never one further.
    const settle = () => {
      if (fingers > 0 || settling || !wide.matches) return;
      const p = raw();
      if (!touched || !pinned()) {
        home = Math.round(p);
        return;
      }
      touched = false;
      if (Math.abs(p - Math.round(p)) < 0.01) {
        home = Math.round(p);
        return;
      }
      let slide = Math.round(p);
      if (heading > 0 && p < home + 1) slide = p - home > NUDGE ? home + 1 : home;
      else if (heading < 0 && p > home - 1) slide = home - p > NUDGE ? home - 1 : home;
      glide(clamp(slide, 0, n - 1));
    };
    // Wait a moment after the scroll ends (some browsers end a scroll
    // between two notches of a wheel still turning).
    const ended = () => {
      clearTimeout(idle);
      idle = window.setTimeout(settle, 80);
    };
    const stop = () => {
      settling = false;
    };

    const onScroll = () => {
      const y = window.scrollY;
      if (!settling) {
        if (y !== lastY) heading = Math.sign(y - lastY);
        if (!ends) {
          clearTimeout(idle);
          idle = window.setTimeout(settle, 140);
        }
      }
      lastY = y;
      wake();
    };
    const onWheel = () => {
      stop();
      clearTimeout(idle);
      touched = true;
    };
    const onTouchStart = (e: TouchEvent) => {
      stop();
      touched = true;
      fingers = e.touches.length;
    };
    const onTouchEnd = (e: TouchEvent) => {
      fingers = e.touches.length;
      window.clearTimeout(idle);
      idle = window.setTimeout(settle, 140);
    };
    // Keys walk the deck one slide at a time while it is pinned (PageDown
    // would otherwise jump almost two slides); at either end they scroll on.
    const onKey = (e: KeyboardEvent) => {
      stop();
      const target = e.target as HTMLElement | null;
      if (e.metaKey || e.ctrlKey || e.altKey || target?.closest("input, textarea, select, [contenteditable]")) return;
      // Space on a button or link presses it.
      if (e.key === " " && target?.closest("button, a, summary, [role=button]")) return;
      const on = e.key === "ArrowDown" || e.key === "PageDown" || (e.key === " " && !e.shiftKey);
      const back = e.key === "ArrowUp" || e.key === "PageUp" || (e.key === " " && e.shiftKey);
      if (!on && !back) return;
      touched = true;
      if (!wide.matches || !pinned()) return;
      const p = raw();
      const next = on ? Math.floor(p + 0.01) + 1 : Math.ceil(p - 0.01) - 1;
      if (next < 0 || next > n - 1) return;
      e.preventDefault();
      heading = on ? 1 : -1;
      glide(next);
    };
    const onResize = () => {
      measure();
      wake();
    };

    measure();
    tick(performance.now());
    home = Math.round(raw());
    const sized = new ResizeObserver(onResize);
    sized.observe(wheel);
    sized.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scrollend", ended);
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("pointerdown", stop, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize, { passive: true });
    wide.addEventListener("change", onResize);
    return () => {
      cancelAnimationFrame(frame);
      settling = false;
      window.clearTimeout(idle);
      sized.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scrollend", ended);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("pointerdown", stop);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      wide.removeEventListener("change", onResize);
    };
  }, [n]);

  const label = (i: number) => `${pad(i + 1)} / ${pad(n)} · ${slides[i].speaker}`;
  // The deck's room: ABOVE + 1 + BELOW slide heights. On desktop the stage
  // is a size container and the front slide as large as fits both its width
  // and its height; on a phone it spans the page's width.
  const room = 1 + ABOVE + BELOW;
  const vars = {
    "--deck-steps": n - 1,
    "--deck-step": `${STEP * 100}svh`,
    "--deck-room": room,
    "--deck-above": ABOVE,
  } as CSSProperties;

  return (
    <>
      <div className="hidden motion-safe:block" style={vars}>
        <h2 className={`${H2} mt-[var(--header-gap)] lg:hidden`}>{title}</h2>
        <div
          ref={track}
          data-deck-track={n}
          className="relative max-lg:mt-4 lg:h-[calc(var(--deck-steps)*var(--deck-step)_+_100svh)]"
        >
          <div
            ref={area}
            className="max-lg:sticky max-lg:top-[var(--nav-h)] max-lg:z-10 max-lg:bg-paper max-lg:pb-4 lg:sticky lg:top-0 lg:grid lg:h-[100svh] lg:grid-cols-[minmax(0,4fr)_minmax(0,3fr)] lg:grid-rows-[auto_minmax(0,1fr)] lg:gap-x-16 lg:pt-[var(--nav-h)] lg:pb-10"
          >
            {/* Phone: the texts fade as they slide under the stuck deck. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-full h-8 bg-linear-to-b from-paper lg:hidden"
            />
            <h2 className={`${H2} pt-6 max-lg:hidden lg:col-span-2`}>{title}</h2>
            {/* The stage: on desktop a size container (the deck takes the
                largest front slide whose pile and glimpse still fit), on a
                phone the page's width with the pile's room above and the
                glimpse's below, as padding (a percentage of the width). */}
            <div className="relative max-lg:pt-[calc(var(--deck-above)*56.25%_+_8px)] max-lg:pb-[calc((var(--deck-room)_-_1_-_var(--deck-above))*56.25%)] lg:[container-type:size]">
              <div
                ref={deck}
                className="relative aspect-video w-full lg:absolute lg:left-0 lg:top-[calc((100cqh_-_var(--deck-room)*var(--deck-w)*9/16)/2_+_var(--deck-above)*var(--deck-w)*9/16)] lg:w-[var(--deck-w)] lg:[--deck-w:min(100cqw,100cqh/var(--deck-room)*16/9)]"
              >
                {slides.map((s, i) => (
                  <div
                    key={s.alt}
                    ref={(el) => {
                      cards.current[i] = el;
                    }}
                    className="absolute inset-0 origin-top [backface-visibility:hidden] will-change-transform"
                    style={{ zIndex: i, visibility: i === 0 ? "visible" : "hidden" }}
                  >
                    <div
                      ref={(el) => {
                        casts.current[i] = el;
                      }}
                      aria-hidden
                      className={`absolute inset-0 ${RADIUS} shadow-[var(--window-cast)]`}
                    />
                    <div className={`relative h-full overflow-hidden ${RADIUS} bg-hero`}>
                      <Image
                        ref={(el) => {
                          pictures.current[i] = el;
                        }}
                        src={s.src}
                        alt={s.alt}
                        sizes="(min-width: 1024px) 60vw, 92vw"
                        priority={i < 2}
                        className="block h-full w-full"
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
            {/* Desktop: the text beside the deck, centred on the same height,
                its size following the screen's height so the longest
                (slide 6) still fits a short laptop. */}
            <div className="grid min-h-0 max-lg:hidden">
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
                  <p className="mt-4 max-w-[34em] text-[clamp(14px,2.3svh,18px)] leading-[1.4] text-pretty">
                    {s.script}
                  </p>
                </div>
              ))}
            </div>
          </div>
          {/* Phone: the texts in the page's flow under the stuck deck. Each
              is at least TURN + a rest tall, so a short one still holds its
              slide for a moment. */}
          <div className="lg:hidden">
            {slides.map((s, i) => (
              <div
                key={s.alt}
                ref={(el) => {
                  reads.current[i] = el;
                }}
                data-deck-text={i}
                className="min-h-[44svh] pt-3 pb-10"
              >
                <p className={LABEL}>{label(i)}</p>
                <p className={`${BODY} mt-3 text-pretty`}>{s.script}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-[var(--header-gap)] space-y-[var(--content-gap)] motion-safe:hidden">
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
