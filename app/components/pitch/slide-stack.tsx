"use client";

import Image, { type StaticImageData } from "next/image";
import { type CSSProperties, type ReactNode, useEffect, useRef } from "react";

import { BODY, H1, H2, LABEL } from "../type";

// The pitch deck on /about as a stack (Johannes, 2026-09-29): scrolling
// brings each slide up from below the fold, straight up with no tilt, and
// lands it on the one before. The slides it covers ride on as if they hung
// on a Ferris wheel turning away from you: each one first climbs up and back
// round the rim, so the deck grows as a pile three slides deep whose edges
// curve back like the rim (Johannes, 2026-10-01: "like a ferris wheel"), and
// after that it goes over the top and sinks down behind the pile, smaller
// and fainter, until it is gone with no hard edge. Upright the whole way
// round, like a gondola, and physical: a slide shows whatever no slide in
// front of it covers. The wheel
// turns in beats: each slide rests, fully in view, for a moment of scroll
// before the next one comes, and the turn between eases in and out.
// The stage — page title, the deck's heading, the deck, and what the
// founders say to the slide in front, from the stage pitch script, fading
// over as the wheel turns — is sticky from the top of the page for the
// length of the track, so the first slide already stands in its place when
// the page opens (Johannes, 2026-09-30). On the desktop (from `lg`) the text
// stands to the right of the deck; on the phone the same stage stands in one
// column with the text under the deck (Johannes, 2026-09-30: "pretty much
// exactly like on desktop"), and the next slide comes up out of the gap
// between deck and text rather than across the text. A text too long for its
// box under the deck
// scrolls up in it, with the page, while its slide rests, and the wheel
// turns only once it has been read to its end.
// With reduced motion asked for, the slides simply stand one under another,
// each with its text beneath.

type Slide = { src: StaticImageData; alt: string; speaker: string; script: ReactNode };

// How much scroll each slide takes on the desktop, in viewport heights (0.75
// until 2026-09-30, when Johannes asked for less scrolling per slide), and
// the share of it a slide rests for at either end.
const PER_SLIDE = 0.5;
const REST = 0.15;
// The same beat on the phone, where every slide's scroll is its own length:
// a rest at either end and the turn between, in viewport heights, plus
// whatever its text needs to scroll through its box in between.
const HOLD = 0.075;
const TURN = 0.35;
// How long the deck takes to catch up with a mouse wheel on the desktop, in
// seconds (the time constant: after it, about two thirds of the way). On the
// phone the stage follows the finger directly: a lag there reads as drag.
const GLIDE = 0.12;
// The wheel, in slide heights, seen in perspective from EYE in front of the
// front slide, into a vanishing point at its top edge. Every slide's top
// edge rides one circle of radius WHEEL, from the front slide's top edge up
// and back, NOTCH further round per slide; DEEP slides stand behind the
// front one, four cards at rest. So the steps between the top edges shrink
// upward (the rim turns from rising to receding) while the sides step in
// ever further, and the pile's corners run on a curve, the rim seen from in
// front: straight, even steps read as a staircase, not a wheel (2026-09-30
// to 10-01). WHEEL and EYE grow together, so a bigger wheel keeps the same
// shape and only stands taller: at 0.158 and 0.4 even the first band stayed
// under the corner logo (5.9% down a slide), but the arch was too low
// (Johannes, 2026-10-01: "a bit more of an arch", logos may show); now the
// bands are about 8, 6.6 and 3.8% of a slide, so the slide right behind
// shows the top of its logo. The slide at the back goes on round the same
// rim over the top and down behind the pile, smaller and smaller. Each step
// back veils a slide TINT more in the page's sage, and the leaving one fades
// out on its way.
const DEEP = 3;
const WHEEL = 0.237;
const NOTCH = Math.PI / 9;
const EYE = 0.6;
const TINT = 0.12;
// The room the deck keeps above the front slide for the pile, in slide
// heights (the rim's top edge, in perspective, peaks at about 0.18).
const PILE = 0.19;
// The screen height the pile and the front slide share: on the desktop the
// screen less the navbar's clearance, the two headings and the stage's
// margins; on the phone at most this share of the screen, so the text under
// the deck keeps room (a phone held sideways would otherwise get a deck
// taller than itself).
const ROOM = "(100svh - var(--content-top) - var(--h1-line) - var(--header-gap) - var(--h2-line) - 88px)";
const ROOM_PHONE = "(100svh * 0.45)";
// The phone's text box fades out its bottom edge over this many pixels, and
// its top edge over the text's own top padding, so a scrolling text never
// meets a hard edge.
const FADE_FOOT = 28;
const RADIUS = "rounded-[12px]";

const pad = (k: number) => String(k).padStart(2, "0");
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
// Smootherstep: 0 to 1 with no kink at either end.
const ease = (x: number) => x * x * x * (x * (6 * x - 15) + 10);

// The phone's scroll track, measured: where each slide's rest starts (in px
// from the top of the track), how long it is, how far its text scrolls in
// that time, and how long a turn is.
type Plan = { starts: number[]; rests: number[]; lifts: number[]; hold: number; turn: number; span: number };

export function SlideStack({
  heading,
  title,
  slides,
}: {
  heading: string;
  title: string;
  slides: readonly Slide[];
}) {
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const shelf = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const casts = useRef<(HTMLDivElement | null)[]>([]);
  const veils = useRef<(HTMLDivElement | null)[]>([]);
  const texts = useRef<(HTMLDivElement | null)[]>([]);
  const n = slides.length;

  useEffect(() => {
    let frame = 0;
    let at = -1; // where the desktop deck is drawn, in slides; -1 before the first draw
    let last = 0;
    const wideQuery = window.matchMedia("(min-width: 1024px)");
    let wide = wideQuery.matches; // the desktop stage rather than the phone's
    let plan: Plan | null = null;

    // On the phone every slide's scroll has its own length, so the track is
    // measured: each text's overflow over its box becomes scroll during its
    // slide's rest. Only the stage's own height is used, never the window's,
    // so Safari's collapsing address bar changes nothing.
    const measure = () => {
      const el = track.current;
      const stuck = stage.current;
      const win = box.current;
      if (!el || !stuck || !win) return;
      if (wide) {
        plan = null;
        el.removeAttribute("data-deck-plan");
        return;
      }
      const vh = stuck.clientHeight;
      const hold = HOLD * vh;
      const turn = TURN * vh;
      const lifts = texts.current.map((t) => Math.max(0, (t?.offsetHeight ?? 0) - win.clientHeight + FADE_FOOT));
      const rests = lifts.map((l) => 2 * hold + l);
      const starts: number[] = [];
      let pos = 0;
      rests.forEach((r, i) => {
        starts.push(pos);
        pos += r + (i < n - 1 ? turn : 0);
      });
      plan = { starts, rests, lifts, hold, turn, span: pos };
      el.style.setProperty("--track-phone", `${pos + vh}px`);
      // For werkzeuge/deck-film, which films the phone by this plan.
      el.setAttribute("data-deck-plan", `${starts.map((s, i) => `${Math.round(s)}:${Math.round(rests[i])}`).join(",")};${Math.round(turn)}`);
    };

    // From scroll to wheel on the desktop: whole slides rest, the turn
    // between them eases in and out, so every stop and start is soft.
    const beat = (t: number) => {
      const k = Math.floor(t);
      return k + ease(clamp01((t - k - REST) / (1 - 2 * REST)));
    };

    const draw = (t: number, lifts?: number[]) => {
      cards.current.forEach((card, i) => {
        if (!card) return;
        const d = t - i; // > 0: landed and being covered, < 0: still to come
        const h = card.offsetHeight;
        let transform = "none";
        let shown = 1; // 1 fully there, 0 faded out
        if (d <= -1 || d >= DEEP + 1) {
          shown = 0;
        } else if (d < 0) {
          // Rising into place, straight up: on the desktop from just below
          // the fold, on the phone from behind the top edge of the text's
          // shelf, so it comes up out of the gap under the deck and never
          // crosses the text. offsetTop is from the top of the stuck stage.
          const floor = wide
            ? ((card.offsetParent as HTMLElement | null)?.clientHeight ?? window.innerHeight) + 24
            : (shelf.current?.offsetTop ?? window.innerHeight);
          transform = `translate3d(0, ${-d * (floor - card.offsetTop)}px, 0)`;
        } else if (d > 0) {
          // Up and back round the rim, and from the back of the pile on over
          // the top and down behind it. Seen in perspective, scaled from the
          // top edge, the vanishing point, so the pile shows as a row of top
          // edges.
          const a = NOTCH * d;
          const y = WHEEL * Math.sin(a);
          const z = WHEEL * (1 - Math.cos(a));
          shown = 1 - TINT * Math.min(d, DEEP);
          if (d > DEEP) shown *= 1 - (d - DEEP) ** 2;
          const s = EYE / (EYE + z);
          transform = `translate3d(0, ${-y * s * h}px, 0) scale(${s})`;
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
      // The text goes out in the first part of the turn, rising with the
      // wheel, and the next comes up in the last part, one at a time; on the
      // phone a long one also scrolls up in its box during its rest.
      texts.current.forEach((text, i) => {
        if (!text) return;
        const d = t - i;
        const o = Math.max(0, 1 - Math.abs(d) * 2.5);
        text.style.opacity = String(o);
        text.style.transform = `translate3d(0, ${-(lifts?.[i] ?? 0) - d * 32}px, 0)`;
        text.style.visibility = o > 0 ? "visible" : "hidden";
      });
    };

    // The phone: where the page is in the track says which slide rests, how
    // far its text has scrolled, or how far the turn to the next has come.
    const drawPhone = (el: HTMLDivElement, p: Plan) => {
      const s = Math.min(p.span, Math.max(0, -el.getBoundingClientRect().top));
      const lifts = p.lifts.map(() => 0);
      let t = n - 1;
      for (let i = 0; i < n; i++) {
        const into = s - p.starts[i];
        if (into <= p.rests[i] || i === n - 1) {
          t = i;
          lifts[i] = Math.min(p.lifts[i], Math.max(0, into - p.hold));
          break;
        }
        if (into < p.rests[i] + p.turn) {
          t = i + ease((into - p.rests[i]) / p.turn);
          lifts[i] = p.lifts[i];
          break;
        }
      }
      draw(t, lifts);
    };

    const tick = (now: number) => {
      frame = 0;
      const el = track.current;
      if (!el || el.offsetParent === null) return; // the list is showing instead
      if (!wide) {
        if (!plan) measure();
        if (plan) drawPhone(el, plan);
        return;
      }
      const span = Math.max(1, el.offsetHeight - window.innerHeight);
      const want = clamp01(-el.getBoundingClientRect().top / span) * (n - 1);
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
    const remeasure = () => {
      wide = wideQuery.matches;
      at = -1;
      measure();
      schedule();
    };
    measure();
    tick(performance.now());
    // The texts' heights depend on the font, which may arrive after the first
    // measure.
    document.fonts?.ready.then(remeasure);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", remeasure, { passive: true });
    wideQuery.addEventListener("change", remeasure);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", remeasure);
      wideQuery.removeEventListener("change", remeasure);
    };
  }, [n]);

  const card = `overflow-hidden ${RADIUS} bg-hero shadow-[var(--window-cast)]`;
  const label = (i: number) => `${pad(i + 1)} / ${pad(n)} · ${slides[i].speaker}`;
  // The deck's measures, as variables the classes read (an inline style
  // cannot switch at a breakpoint): the desktop track's length; the slide's
  // width, capped by the screen's height; and the room above the front slide
  // for the pile — PILE of the slide's height, whether the slide fills the
  // column (then that is PILE · 9/16 of the column's width, which is what a
  // percentage padding measures) or the screen's height caps it.
  const slide = (room: string) => `min(100%, calc(${room} / ${1 + PILE} * 16 / 9))`;
  const pile = (room: string) => `min(${PILE * (9 / 16) * 100}%, calc(${room} / ${1 + PILE} * ${PILE}))`;
  const measures = {
    "--track": `calc(${n - 1} * ${PER_SLIDE * 100}svh + 100svh)`,
    "--slide": slide(ROOM),
    "--slide-phone": slide(ROOM_PHONE),
    "--pile": pile(ROOM),
    "--pile-phone": pile(ROOM_PHONE),
  } as CSSProperties;

  return (
    <>
      <div
        ref={track}
        data-deck-track={n}
        className="relative h-[var(--track-phone,900svh)] motion-reduce:hidden lg:h-[var(--track)]"
        style={measures}
      >
        <div
          ref={stage}
          className="sticky top-0 flex h-[100svh] flex-col pt-[calc(var(--nav-h)+24px)] pb-5 lg:grid lg:grid-cols-[minmax(0,4fr)_minmax(0,3fr)] lg:gap-x-16 lg:pt-[var(--content-top)] lg:pb-10"
        >
          {/* On the phone this column dissolves (`contents`), so the
              headings, the deck and the text box are one column. */}
          <div className="max-lg:contents lg:flex lg:min-h-0 lg:flex-col">
            <h1 className={H1}>{heading}</h1>
            <h2 className={`${H2} mt-[var(--header-gap)]`}>{title}</h2>
            <div className="mt-4 lg:my-auto">
              <div className="grid pt-[var(--pile-phone)] lg:pt-[var(--pile)]">
                {slides.map((s, i) => (
                  <div
                    key={s.alt}
                    ref={(el) => {
                      cards.current[i] = el;
                    }}
                    className="relative col-start-1 row-start-1 w-[var(--slide-phone)] origin-top will-change-transform lg:w-[var(--slide)]"
                    style={{ zIndex: i + 1, visibility: i === 0 ? "visible" : "hidden" }}
                  >
                    <div
                      ref={(el) => {
                        casts.current[i] = el;
                      }}
                      aria-hidden
                      className={`absolute inset-0 ${RADIUS} shadow-[var(--window-cast)]`}
                    />
                    <div className={`relative overflow-hidden ${RADIUS} bg-hero`}>
                      <Image
                        src={s.src}
                        alt={s.alt}
                        sizes="(min-width: 1024px) 60vw, 92vw"
                        priority={i < 2}
                        className="block h-auto w-full"
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
          </div>
          {/* The texts share one place and fade over each other: on the
              desktop the right column, centred in the band beside the deck,
              the size following the screen's height so the longest (slide 6)
              still fits a short laptop; on the phone the box under the deck,
              its edges faded so a long text can scroll up through it. On the
              phone the box stands on a shelf of sage laid over the deck's
              lower part: the next slide rises from behind the shelf's top
              edge, which fades in from the gap under the front slide (so its
              shadow fades out rather than stopping at a line), and the shelf
              reaches out past the page's inset and down to the screen's edge
              so nothing of a rising slide shows beside or under the text. */}
          <div ref={shelf} className="relative z-20 mt-5 min-h-0 flex-1 lg:contents">
            <div
              aria-hidden
              className="absolute -inset-x-[var(--inset)] -top-5 -bottom-5 bg-[linear-gradient(to_bottom,transparent,var(--paper)_20px)] lg:hidden"
            />
            <div
              ref={box}
              className="relative h-full overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,var(--ink)_12px,var(--ink)_calc(100%-28px),transparent)] lg:grid lg:h-auto lg:min-h-0 lg:overflow-visible lg:pt-[calc(var(--h1-line)+var(--header-gap)+var(--h2-line))] lg:[mask-image:none]"
            >
              {slides.map((s, i) => (
                <div
                  key={s.alt}
                  ref={(el) => {
                    texts.current[i] = el;
                  }}
                  className={`absolute inset-x-0 top-0 pt-3 will-change-[transform,opacity] lg:relative lg:col-start-1 lg:row-start-1 lg:self-center lg:pt-0 ${
                    i > 0 ? "invisible opacity-0" : ""
                  }`}
                >
                  <p className={LABEL}>{label(i)}</p>
                  <p className="mt-3 text-[15px] leading-[1.4] text-pretty lg:mt-4 lg:max-w-[34em] lg:text-[clamp(14px,2.3svh,18px)]">
                    {s.script}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="hidden space-y-[var(--content-gap)] pt-[var(--content-top)] motion-reduce:block">
        <h1 className={H1}>{heading}</h1>
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
