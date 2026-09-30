"use client";

import Image, { type StaticImageData } from "next/image";
import { type CSSProperties, type ReactNode, useEffect, useRef } from "react";

import { BODY, H2, LABEL } from "../type";

// The pitch deck on /about as a drum (Johannes, 2026-09-30: "much more a
// wheel", after the Apple Watch's Digital Crown). The slides sit round a
// drum whose axle lies behind the slide in front, like the wheel of an iOS
// picker or the Watch's elliptical list: the slide in front stands flat and
// big in the middle, the one before it has rolled up and back over the top,
// the next one waits on the underside, both tucked a little under the slide
// in front, tilted away and veiled in the page's sage, so they read as the
// curve of the wheel rather than as more slides (and no Raban logo shows on
// them). Scrolling turns the whole drum as one piece.
// It turns the way the Crown turns a list: every bit of scroll moves it (no
// dead rests), a little slower near each slide and a little faster between
// (the detent), the drum follows the scroll on a critically damped spring
// (quick, never overshooting), and when the scroll stops between two slides
// the page glides on to the slide it was heading for.
// Desktop (from `lg`): the drum on the left, what the founders say to the
// slide in front on the right, from the stage pitch script, fading over as
// the drum turns; the stage is sticky for the length of the track.
// Phones: the drum sticks under the navbar and the texts run in the page
// below it, one after another; the drum turns in the space between two
// texts, so each slide stays in front for as long as its text takes to read.
// With reduced motion asked for, the slides simply stand one under another,
// each with its text beneath.

type Slide = { src: StaticImageData; alt: string; speaker: string; script: ReactNode };

// Scroll per slide on desktop, in viewport heights (the old stack took 0.75,
// a fifth of it standing still).
const STEP = 0.5;
// The detent: how much slower the drum turns near a slide than between two
// (0 = even; below 1 so it never stops moving under the scroll).
const DETENT = 0.35;
// How quickly the drum follows the scroll, and how quickly the page glides
// on to a slide when the scroll stops between two: the response of a
// critically damped spring, in seconds (SwiftUI's `.spring(duration:,
// bounce: 0)`).
const FOLLOW = 0.16;
const SNAP = 0.42;
// How far past a slide the scroll has to have gone, in slides, for the page
// to glide on to the next one rather than back: a notch of a mouse wheel
// goes on, a nudge of a trackpad comes back.
const NUDGE = 0.12;

// The drum, in slide heights. PITCH is the turn from one slide to the next;
// the radius puts neighbouring slides edge to edge with a small gap between
// them at that pitch; EYE is how far in front of the slide the eye is. Past
// the first neighbour the turn slows (to at most 1.6 pitches), so a slide
// leaving the view goes on round the rim instead of over the back.
const PITCH = 44;
const GAP = 0.06;
const RADIUS = ((1 + GAP) * 0.5) / Math.tan(((PITCH / 2) * Math.PI) / 180);
const EYE = 3;
const RIM = 0.6;
// A neighbour shrinks a little on top of the perspective, as the Watch's
// list shrinks toward its edge, and is veiled half into the page's sage.
const SHRINK = 0.1;
const VEIL = 0.5;
// The veil deepens to the full sage toward the edge further round the drum
// (the top of the slide before, the bottom of the next), so each neighbour
// melts into the page before its edge: the drum has no hard rim, and the
// Raban logo in the top corner of the slide before is gone in the sage.
const FAR = 1;
// Both neighbours tuck under the slide in front, as the Watch's Smart Stack
// shows the next widget peeking from under the current one, so the drum
// reads as one barrel rather than three separate slides: the next one
// TUCK slide heights further up than the bare drum would put it, which
// hides its top edge, and with it its Raban logo, behind the slide in
// front; the one before TUCK_ABOVE further down (it has no logo at that
// edge, so less will do). A slide comes out from under as it rolls toward
// the front (the tuck is gone by half way, where the two faces pass each
// other with a gap between them, so which of them is drawn on top never
// changes while they overlap).
const TUCK = 0.17;
const TUCK_ABOVE = 0.1;

// Phones: how far under the drum a text's top edge comes to rest, in px.
const LEAD = 32;

const pad = (k: number) => String(k).padStart(2, "0");
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

// One step of an exactly solved critically damped spring toward `to`:
// frame-rate independent, and it starts from the velocity it already has,
// so a new target mid-flight bends the path instead of kinking it.
function spring(x: number, v: number, to: number, dt: number, response: number): [number, number] {
  const w = (2 * Math.PI) / response;
  const dx = x - to;
  const c = v + w * dx;
  const e = Math.exp(-w * dt);
  return [to + (dx + c * dt) * e, (v - w * c * dt) * e];
}

// The detent on a stretch 0..1 of one slide's turn, or on the whole deck:
// slope 1 - DETENT at every slide, 1 + DETENT half way between.
const detent = (p: number) => p - (DETENT / (2 * Math.PI)) * Math.sin(2 * Math.PI * p);

export function SlideStack({ title, slides }: { title: string; slides: readonly Slide[] }) {
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const casts = useRef<(HTMLDivElement | null)[]>([]);
  const veils = useRef<(HTMLDivElement | null)[]>([]);
  const fades = useRef<(HTMLDivElement | null)[]>([]);
  const texts = useRef<(HTMLDivElement | null)[]>([]);
  const reads = useRef<(HTMLDivElement | null)[]>([]);
  const n = slides.length;

  useEffect(() => {
    const el = track.current;
    const st = stage.current;
    if (!el || !st) return;
    const wide = window.matchMedia("(min-width: 1024px)");

    // Phones: where each text sits in the track, and the reading line, the
    // height on screen just under the stuck drum where a text's top edge
    // comes to rest once the drum has turned to its slide. Measured on
    // layout, not per frame.
    let desk = wide.matches;
    let tops: number[] = [];
    let ends: number[] = [];
    let line = 0;

    const measure = () => {
      desk = wide.matches;
      if (desk) {
        el.removeAttribute("data-deck-at");
        return;
      }
      const pin = parseFloat(getComputedStyle(st).top) || 0;
      const below = pin + st.offsetHeight;
      line = below + LEAD;
      tops = reads.current.map((r) => (r ? r.offsetTop : 0));
      ends = reads.current.map((r) => (r ? r.offsetTop + r.offsetHeight : 0));
      // For the film tool and anyone scripting the page: the scroll offsets
      // from the track's top between which the drum turns to each slide
      // (the first is where the drum pins).
      const at = tops.map((top, k) =>
        k === 0 ? [-pin, -pin] : [Math.round(ends[k - 1] - line), Math.round(top - line)],
      );
      at[0] = [Math.min(-pin, at[1]?.[0] ?? -pin), Math.min(-pin, at[1]?.[0] ?? -pin)];
      el.setAttribute("data-deck-at", JSON.stringify(at));
    };

    // Phones: how far through the turn to slide k (1..n-1) the scroll is,
    // 0..1: the drum turns while the gap between text k-1 and text k passes
    // the reading line.
    const turn = (k: number, top: number) =>
      clamp((line - (top + ends[k - 1])) / Math.max(1, tops[k] - ends[k - 1]), 0, 1);

    // Where the scroll says the deck is, in slides, before the detent.
    const raw = () => {
      const r = el.getBoundingClientRect();
      if (desk) return clamp(-r.top / Math.max(1, r.height - window.innerHeight), 0, 1) * (n - 1);
      let p = 0;
      for (let k = 1; k < n; k++) p += turn(k, r.top);
      return p;
    };
    const goal = () => {
      if (desk) return detent(raw());
      const top = el.getBoundingClientRect().top;
      let q = 0;
      for (let k = 1; k < n; k++) q += detent(turn(k, top));
      return q;
    };

    const draw = (t: number) => {
      cards.current.forEach((card, i) => {
        if (!card) return;
        const d = t - i; // > 0: already seen, rolled up; < 0: still to come
        const a = Math.abs(d);
        if (a >= 2) {
          card.style.visibility = "hidden";
          return;
        }
        const turned = a <= 1 ? PITCH * a : PITCH * (1 + RIM * (1 - Math.exp(-(a - 1) / RIM)));
        const scale = 1 - SHRINK * Math.min(a, 1) - (SHRINK / 2) * Math.max(0, a - 1);
        const veil = Math.min(1, VEIL * Math.min(a, 1) + (1 - VEIL) * Math.max(0, a - 1));
        // Tucked: none at half way, all of it from one slide away on
        // (smoothstep over 0.35..1); up from below, down from above.
        const u = clamp((a - 0.35) / 0.65, 0, 1);
        const tuck = (d < 0 ? TUCK : -TUCK_ABOVE) * u * u * (3 - 2 * u);
        card.style.visibility = "visible";
        card.style.transform =
          `translateY(${(-tuck * 100).toFixed(3)}%) ` +
          `rotateX(${(d >= 0 ? turned : -turned).toFixed(3)}deg) scale(${scale.toFixed(4)})`;
        card.style.zIndex = String(100 - Math.round(10 * a));
        const cast = casts.current[i];
        const flat = veils.current[i];
        const far = fades.current[i];
        // A slide rolled up over the top faces the sky and casts nothing we
        // could see, so its shadow goes early (gone well before the slide
        // coming up passes it); one still to come casts onto the slide
        // tucked under it while it rises, and nothing while it waits, where
        // a shadow under its melted-away bottom edge would draw the edge
        // back in.
        const shade = d > 0 ? Math.max(0, 1 - 2.5 * d) : Math.max(0, 1 - 1.25 * a);
        if (cast) cast.style.opacity = ((1 - veil) * shade).toFixed(3);
        if (flat) flat.style.opacity = veil.toFixed(3);
        if (far) {
          far.style.opacity = (FAR * Math.min(a, 1)).toFixed(3);
          // The far edge is the top for a slide above, the bottom below.
          far.style.transform = d >= 0 ? "none" : "scaleY(-1)";
        }
      });
      // Desktop: the text goes out in the first part of the turn, rising
      // with the drum, and the next comes up in the last part.
      texts.current.forEach((text, i) => {
        if (!text) return;
        const d = t - i;
        const o = Math.max(0, 1 - Math.abs(d) * 2.5);
        text.style.opacity = o.toFixed(3);
        text.style.transform = `translate3d(0, ${(-d * 24).toFixed(2)}px, 0)`;
        text.style.visibility = o > 0 ? "visible" : "hidden";
      });
      // Phones: the text of the slide in front in full ink, the others a
      // step back, so the eye knows which text belongs to the drum.
      reads.current.forEach((read, i) => {
        if (!read) return;
        read.style.opacity = (0.42 + 0.58 * Math.max(0, 1 - Math.abs(t - i))).toFixed(3);
      });
    };

    // --- the loop: scroll -> detent -> spring -> drum, while anything moves
    let x = -1; // where the drum is drawn, in slides; -1 before the first draw
    let v = 0;
    let last = 0;
    let frame = 0;
    // The page's own glide to a slide (see settle).
    let gliding = false;
    let gy = 0;
    let gv = 0;
    let gto = 0;

    const shown = () => el.offsetParent !== null;

    const tick = (now: number) => {
      frame = 0;
      if (!shown()) {
        gliding = false;
        return;
      }
      const dt = Math.min(1 / 30, Math.max(0, now - last) / 1000);
      last = now;
      if (gliding) {
        [gy, gv] = spring(gy, gv, gto, dt, SNAP);
        if (Math.abs(gy - gto) < 0.5 && Math.abs(gv) < 5) {
          gy = gto;
          gliding = false;
        }
        window.scrollTo(0, gy);
      }
      const want = goal();
      if (x < 0) {
        x = want;
        v = 0;
      } else {
        [x, v] = spring(x, v, want, dt, FOLLOW);
        if (Math.abs(x - want) < 1e-4 && Math.abs(v) < 1e-3) {
          x = want;
          v = 0;
        }
      }
      draw(x);
      if (x !== want || gliding) frame = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (frame) return;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };

    const glide = (to: number) => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      gto = clamp(to, 0, max);
      if (!gliding) {
        gy = window.scrollY;
        gv = 0;
      }
      gliding = true;
      wake();
    };

    // --- the detent: when the scroll stops between two slides, glide on
    // in the direction it was going (or back, if it barely moved). Only
    // after the reader's own scrolling (wheel, touch, keys), not after a
    // jump to an anchor or a script's scroll, and only while the drum is
    // stuck on screen.
    let heading = 0;
    let lastY = window.scrollY;
    let touched = -1e9;
    // Set by the reader's hand, used up by the next settle: a scroll that
    // follows no input of theirs (an anchor, a script) is left where it is.
    let fresh = false;
    let idle = 0;
    // Browsers without `scrollend` (Safari before 26.2) settle 140 ms after
    // the last scroll event instead.
    const hasEnd = "onscrollend" in window;

    const pinned = () => {
      const r = el.getBoundingClientRect();
      if (desk) return r.top <= 1 && r.bottom >= window.innerHeight - 1;
      const top = parseFloat(getComputedStyle(st).top) || 0;
      return st.getBoundingClientRect().top <= top + 1 && r.bottom > top + st.offsetHeight;
    };

    const settle = () => {
      const mine = fresh;
      fresh = false;
      if (!mine || gliding || !shown() || performance.now() - touched > 3000 || !pinned()) return;
      if (desk) {
        const p = raw();
        const k = Math.floor(p);
        const f = p - k;
        if (f < 0.01 || f > 0.99) return;
        const to = heading > 0 ? (f > NUDGE ? k + 1 : k) : heading < 0 ? (f < 1 - NUDGE ? k : k + 1) : Math.round(p);
        const r = el.getBoundingClientRect();
        const top = r.top + window.scrollY;
        glide(top + ((r.height - window.innerHeight) * to) / (n - 1));
        return;
      }
      const top = el.getBoundingClientRect().top;
      for (let k = 1; k < n; k++) {
        const f = turn(k, top);
        if (f <= 0.01 || f >= 0.99) continue;
        const on = heading > 0 ? f > NUDGE : heading < 0 ? f > 1 - NUDGE : f > 0.5;
        // The track's top on screen at which the turn is done (on) or not
        // yet begun; the page scrolls by the difference.
        const want = on ? line - tops[k] : line - ends[k - 1];
        glide(window.scrollY + (top - want));
        return;
      }
    };

    const onScroll = () => {
      if (!gliding) {
        const y = window.scrollY;
        if (y !== lastY) heading = Math.sign(y - lastY);
        lastY = y;
      } else {
        lastY = window.scrollY;
      }
      wake();
      if (!hasEnd) {
        window.clearTimeout(idle);
        idle = window.setTimeout(settle, 140);
      }
    };
    // A short wait after the scroll ends, so a wheel turned notch by notch
    // is not taken for a finished scroll between two notches.
    const onScrollEnd = () => {
      window.clearTimeout(idle);
      idle = window.setTimeout(settle, 150);
    };
    // Any hand on the wheel, the screen or the keys takes the page back.
    const onHand = () => {
      touched = performance.now();
      fresh = true;
      gliding = false;
    };
    const onLift = () => {
      touched = performance.now();
      fresh = true;
    };

    // Keys, desktop only: while the drum is stuck, the arrow keys, Page Up/
    // Down and the space bar step one slide (Page Down alone would jump
    // almost two). At either end of the deck they scroll the page as usual.
    const onKey = (e: KeyboardEvent) => {
      if (!desk || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || !shown() || !pinned()) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      if (e.key === " " && t && /^(BUTTON|A|SUMMARY)$/.test(t.tagName)) return;
      const next = e.key === "ArrowDown" || e.key === "PageDown" || (e.key === " " && !e.shiftKey);
      const back = e.key === "ArrowUp" || e.key === "PageUp" || (e.key === " " && e.shiftKey);
      if (!next && !back) return;
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      const top = r.top + window.scrollY;
      const from = gliding ? ((gto - top) / span) * (n - 1) : raw();
      const to = next ? Math.floor(from + 0.01) + 1 : Math.ceil(from - 0.01) - 1;
      if (to < 0 || to > n - 1) return;
      e.preventDefault();
      touched = performance.now();
      glide(top + (span * to) / (n - 1));
    };

    const onResize = () => {
      measure();
      wake();
    };

    measure();
    tick(performance.now());
    const ro = new ResizeObserver(onResize);
    ro.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scrollend", onScrollEnd);
    window.addEventListener("resize", onResize, { passive: true });
    wide.addEventListener("change", onResize);
    for (const e of ["wheel", "touchstart", "pointerdown"]) window.addEventListener(e, onHand, { passive: true });
    for (const e of ["touchmove", "touchend", "pointerup"]) window.addEventListener(e, onLift, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(idle);
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scrollend", onScrollEnd);
      window.removeEventListener("resize", onResize);
      wide.removeEventListener("change", onResize);
      for (const e of ["wheel", "touchstart", "pointerdown"]) window.removeEventListener(e, onHand);
      for (const e of ["touchmove", "touchend", "pointerup"]) window.removeEventListener(e, onLift);
      window.removeEventListener("keydown", onKey);
    };
  }, [n]);

  const card = `overflow-hidden rounded-[12px] bg-hero shadow-[var(--window-cast)]`;
  const label = (i: number) => `${pad(i + 1)} / ${pad(n)} · ${slides[i].speaker}`;
  // The drum's axle, RADIUS slide heights behind the slide in front; --h is
  // the slide's height (see the drum's box below).
  const axle = `50% 50% calc(var(--h) * ${(-RADIUS).toFixed(4)})`;

  return (
    <>
      <div className="hidden motion-safe:block">
        <h2 className={`${H2} relative z-[2] lg:hidden`}>{title}</h2>
        <div
          ref={track}
          data-deck-track={n}
          className="relative lg:h-[var(--deck)]"
          style={{ "--deck": `calc(${n - 1} * ${STEP * 100}svh + 100svh)` } as CSSProperties}
        >
          {/* The stage. Phones: stuck under the navbar, the drum only, on
              the page's sage so the texts pass under it, and the sage
              carried up behind the navbar's glass and faded out below; in
              the page it is pulled up by the room the drum keeps above the
              first slide for the one before, empty until the drum turns,
              so the first slide sits under the heading as the other gaps
              on the page do. Desktop: the whole screen, heading and drum
              left, text right, pulled up by the navbar's height it only
              needs once stuck. */}
          <div
            ref={stage}
            className="sticky top-[var(--nav-h)] z-[1] mt-[calc(24px-(var(--room)-min(var(--slide),var(--room)/1.62))/2)] bg-paper py-2 [--room:min(calc(var(--slide)*1.8),calc(100svh-var(--nav-h)-316px))] [--slide:calc((100vw-2*var(--inset))*0.5625)] before:absolute before:inset-x-0 before:bottom-full before:h-[var(--nav-h)] before:bg-paper after:pointer-events-none after:absolute after:inset-x-0 after:top-full after:h-8 after:bg-linear-to-b after:from-paper after:to-transparent lg:top-0 lg:-mt-[var(--nav-h)] lg:grid lg:h-[100svh] lg:grid-cols-[minmax(0,4fr)_minmax(0,3fr)] lg:grid-rows-[auto_minmax(0,1fr)] lg:gap-x-16 lg:bg-transparent lg:pt-[var(--nav-h)] lg:pb-10 lg:before:hidden lg:after:hidden"
          >
            <h2 className={`${H2} relative z-[2] hidden pt-6 lg:block`}>{title}</h2>
            {/* The drum's room. Phones (--room, on the stage): 1.8 slide
                heights of a slide as wide as the page (--slide), but never so
                tall that less than 300px of screen is left under it for the
                text; the room clips the drum, its rims fading out before its
                edges. Desktop: the column under
                the heading, the slide as big as the column allows while the
                drum still fits the screen's height. */}
            <div className="relative grid h-[var(--room)] place-items-center overflow-hidden [container-type:size] lg:col-start-1 lg:row-start-2 lg:h-full lg:overflow-visible">
              <div
                className="relative aspect-video w-[calc(var(--h)*16/9)] [--h:min(100cqw*9/16,100cqh/1.62)] lg:[--h:min(100cqw*9/16,100cqh/1.9)]"
                style={{ perspective: `calc(var(--h) * ${EYE})` }}
              >
                {slides.map((s, i) => (
                  <div
                    key={s.alt}
                    ref={(e) => {
                      cards.current[i] = e;
                    }}
                    className="absolute inset-0 will-change-transform [backface-visibility:hidden]"
                    style={{ transformOrigin: axle, visibility: i < 2 ? "visible" : "hidden" }}
                  >
                    <div
                      ref={(e) => {
                        casts.current[i] = e;
                      }}
                      aria-hidden
                      className="absolute inset-0 rounded-[12px] shadow-[var(--window-cast)]"
                    />
                    <div className="relative h-full overflow-hidden rounded-[12px] bg-hero">
                      <Image
                        src={s.src}
                        alt={s.alt}
                        sizes="(min-width: 1024px) 60vw, 100vw"
                        priority={i < 2}
                        className="block h-full w-full object-cover"
                      />
                    </div>
                    {/* The veils reach a pixel past the slide's edge, outside
                        its clip: clipped along the same curve as the white,
                        the white would glint through their edge pixels as a
                        hairline round a slide melted into the sage. */}
                    <div
                      ref={(e) => {
                        veils.current[i] = e;
                      }}
                      aria-hidden
                      className="pointer-events-none absolute -inset-px rounded-[13px] bg-paper opacity-0"
                    />
                    <div
                      ref={(e) => {
                        fades.current[i] = e;
                      }}
                      aria-hidden
                      className="pointer-events-none absolute -inset-px rounded-[13px] bg-linear-to-b from-paper from-[14%] via-paper/35 via-[34%] to-transparent to-[58%] opacity-0"
                    />
                  </div>
                ))}
              </div>
              {/* The rims roll off into the sage at the room's edges. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[10%] bg-linear-to-b from-paper to-transparent lg:-top-2 lg:h-10"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[10%] bg-linear-to-t from-paper to-transparent lg:-bottom-10 lg:h-20"
              />
            </div>
            {/* Desktop: the text has the drum's height, each slide's centred
                on the slide in front; its size follows the screen's height
                so the longest (slide 6) still fits a short laptop. */}
            <div className="hidden min-h-0 lg:col-start-2 lg:row-start-2 lg:grid">
              {slides.map((s, i) => (
                <div
                  key={s.alt}
                  ref={(e) => {
                    texts.current[i] = e;
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
          {/* Phones: the texts in the page under the drum, with room between
              them for the drum to turn in. */}
          <div className="pt-6 pb-[12svh] lg:hidden">
            {slides.map((s, i) => (
              <div
                key={s.alt}
                ref={(e) => {
                  reads.current[i] = e;
                }}
                className={i > 0 ? "mt-[22svh]" : undefined}
                style={{ opacity: i === 0 ? 1 : 0.42 }}
              >
                <p className={LABEL}>{label(i)}</p>
                <p className={`${BODY} mt-3 text-pretty`}>{s.script}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="hidden space-y-[var(--content-gap)] motion-reduce:block">
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
