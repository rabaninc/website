"use client";

import Image, { type StaticImageData } from "next/image";
import { type CSSProperties, type ReactNode, useEffect, useRef } from "react";

import { Playback } from "../home/window/playback";
import { BODY, LABEL } from "../type";
import { Anzeigetafel, boardLength } from "./anzeigetafel";

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
// The stage — the deck's heading (an h2 since 2026-10-06: the page's h1 is
// what the pitch won, above the deck; the page's own name stands only in the
// navbar: first a big title, then a small mono label, both gone, Johannes,
// 2026-10-01), the deck, and what the founders say to the slide in front,
// from the stage pitch script, fading over as the wheel turns — is sticky
// from the top of its track for the track's length, so the first slide
// stands in its place as soon as the deck reaches the top (until 2026-10-06
// the deck opened the page, Johannes, 2026-09-30). On the desktop (from 1024px wide,
// and on any screen held sideways, a phone too: Johannes, 2026-10-02) the
// text stands to the right of the deck, a little tighter on a short screen;
// on the phone held upright the same stage stands in one
// column with the text under the deck (Johannes, 2026-09-30: "pretty much
// exactly like on desktop"), and the next slide comes up from the foot of
// the screen as on the desktop, floating over the text it replaces
// (Johannes, 2026-10-02). On the phone each text
// takes the largest size from SCRIPT_MAX down to SCRIPT_MIN at which it fits
// its box under the deck, so it stands still to be read (Johannes,
// 2026-10-01: smaller text on the phone, and no text scrolling in its box);
// only where even SCRIPT_MIN can't hold it, on a small phone or one held
// sideways, it still scrolls up in its box while its slide rests, and the
// wheel turns once it has been read to its end.
// With reduced motion asked for, the slides simply stand one under another,
// each with its text beneath.

// `ground` is the colour of a slide's own edge where that isn't white
// (copy.tsx): the box under its picture takes it.
type Slide = { src: StaticImageData; alt: string; speaker: string; script: ReactNode; ground?: string };

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
// to 10-01). The slides sit 25° apart on a wheel whose radius is a third of
// a slide's height, so the pile goes far round it and its arch stands about
// a quarter of a slide high (Johannes, 2026-10-01: a bigger arch, "sort
// of make the wheel smaller", the cards may come up more): the bands are
// about 14, 10 and 3.7% of a slide, so the slide right behind shows its
// whole corner logo and the next one most of it. The slide at the back
// starts its last turn near the top, so at the wheel's own pace it goes over
// and down behind the pile, hidden by the slide in front of it from about
// the middle of the turn, moving with the rest of the wheel; FALL lets it
// drop a touch quicker on its way. (On a wheel of 20° notches it had to
// speed up by 120° to get past the top within the turn, and then looked
// detached from the pile.) Each step back veils a slide TINT more in the
// page's sage, and the leaving one fades out on its way.
const DEEP = 3;
const WHEEL = 0.33;
const NOTCH = (5 * Math.PI) / 36;
const FALL = Math.PI / 6;
const EYE = 1;
const TINT = 0.12;
// The room the deck keeps above the front slide for the pile, in slide
// heights (the rim's top edge, in perspective, peaks at about 0.26).
const PILE = 0.27;
// The stage's head: the deck's heading, a split-flap board
// (anzeigetafel.tsx), as high as --deck-head, which the track sets: 26px on a
// phone held upright, 56px beside the deck on the desktop (48px until
// Johannes asked for a bit bigger, 2026-10-07), 22px on a phone on its side;
// the board narrows its tiles where its column is narrower.
// On the phone held upright the section's frame closes this far under the
// last slide's text, as far as it opens above the heading at the page's top
// (page.tsx), rather than at the foot of the stage (Johannes, 2026-10-07).
const END = 32;
// The screen height the pile and the front slide share: on the desktop the
// screen less the navbar's clearance, the stage's head and its margins; on
// the phone at most this share of the screen, so the text under the deck
// keeps room. A phone upright always fills its column well under it; an iPad
// upright needs about half its screen for that, so 0.45 left its slides short
// of the text's right edge (Johannes, 2026-10-04).
const ROOM = "(100svh - var(--deck-top) - var(--deck-head) - var(--deck-chrome))";
const ROOM_PHONE = "(100svh * 0.55)";
// The phone's script sizes, in px: the largest that fits, between these, in
// steps of SCRIPT_STEP (15px until 2026-10-01). Beside the deck a text starts
// at the size its class gives it and may go down to SCRIPT_MIN_WIDE, which a
// phone on its side needs for the longest.
const SCRIPT_MAX = 13;
const SCRIPT_MIN = 11;
const SCRIPT_MIN_WIDE = 10;
const SCRIPT_STEP = 0.25;
// Where a text still has to scroll, its box fades out its bottom edge over
// this many pixels, and its top edge over the text's own top padding, so a
// scrolling text never meets a hard edge.
const FADE_FOOT = 28;
const FADE = `linear-gradient(to bottom, transparent, #000 12px, #000 calc(100% - ${FADE_FOOT}px), transparent)`;
// On a phone with room to spare, up to this much more air between the deck
// and its text (Johannes, 2026-10-02), before the rest of the room goes
// round the two.
const AIR = 24;
const RADIUS = "rounded-[12px]";

const pad = (k: number) => String(k).padStart(2, "0");
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
// Smootherstep: 0 to 1 with no kink at either end.
const ease = (x: number) => x * x * x * (x * (6 * x - 15) + 10);

// The phone's scroll track, measured: where each slide's rest starts (in px
// from the top of the track), how long it is, how far its text scrolls in
// that time, and how long a turn is.
type Plan = { starts: number[]; rests: number[]; lifts: number[]; hold: number; turn: number; span: number };

export function SlideStack({ title, slides }: { title: string; slides: readonly Slide[] }) {
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const deck = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const casts = useRef<(HTMLDivElement | null)[]>([]);
  const veils = useRef<(HTMLDivElement | null)[]>([]);
  const texts = useRef<(HTMLDivElement | null)[]>([]);
  const n = slides.length;

  useEffect(() => {
    let frame = 0;
    let at = -1; // where the desktop deck is drawn, in slides; -1 before the first draw
    let last = 0;
    // The desktop's stage, two columns, from 1024px wide and on any screen
    // held sideways (the `deck-wide` variant in app/globals.css).
    const wideQuery = window.matchMedia("(min-width: 1024px), (orientation: landscape)");
    let wide = wideQuery.matches; // the desktop stage rather than the phone's
    // Under a finger the deck follows directly, also on the wide stage (a
    // phone on its side): a glide there reads as drag.
    const touchQuery = window.matchMedia("(pointer: coarse)");
    let plan: Plan | null = null;

    // Each text is sized to fit its box. Where one overflows even at the
    // smallest size, the track is measured instead of even: that text's slide
    // rests longer by its overflow, which the text scrolls through then; on
    // the phone held upright the track is measured always. Only the stage's
    // own height is used, never the window's, so Safari's collapsing address
    // bar changes nothing.
    const measure = () => {
      const el = track.current;
      const stuck = stage.current;
      const win = box.current;
      if (!el || !stuck || !win) return;
      const scripts = texts.current.map((t) => t?.lastElementChild as HTMLElement | null | undefined);
      // Start clean of what an earlier measure set, maybe for the other stage.
      deck.current?.style.removeProperty("margin-top");
      deck.current?.style.removeProperty("margin-bottom");
      el.style.removeProperty("height");
      el.style.removeProperty("margin-bottom");
      win.style.removeProperty("overflow");
      texts.current.forEach((t) => t?.style.removeProperty("align-self"));
      const fade = (on: boolean) => {
        win.style.setProperty("mask-image", on ? FADE : "none");
        win.style.setProperty("-webkit-mask-image", on ? FADE : "none");
      };
      const vh = stuck.clientHeight;
      const hold = HOLD * vh;
      const turn = TURN * vh;
      if (wide) {
        texts.current.forEach((t) => t?.style.removeProperty("padding-top"));
        // Beside the deck each text has the size the screen's height gives it
        // (its class); where that doesn't fit the column, on a phone on its
        // side or a short window, the largest that does, down to
        // SCRIPT_MIN_WIDE.
        const room = win.clientHeight - parseFloat(getComputedStyle(win).paddingTop);
        const lifts = texts.current.map((t, i) => {
          const p = scripts[i];
          if (!t || !p) return 0;
          p.style.removeProperty("font-size");
          let size = parseFloat(getComputedStyle(p).fontSize);
          while (size > SCRIPT_MIN_WIDE && t.offsetHeight > room) {
            size -= SCRIPT_STEP;
            p.style.fontSize = `${size}px`;
          }
          const over = t.offsetHeight - room;
          return over > 0 ? over + FADE_FOOT : 0;
        });
        if (!lifts.some((l) => l > 0)) {
          plan = null;
          el.removeAttribute("data-deck-plan");
          win.style.removeProperty("mask-image");
          win.style.removeProperty("-webkit-mask-image");
          return;
        }
        // A text too long for the column even then (a small phone on its
        // side) starts at the column's top and scrolls up in it while its
        // slide rests, as on the phone held upright.
        win.style.overflow = "hidden";
        fade(true);
        texts.current.forEach((t, i) => {
          if (t && lifts[i] > 0) t.style.alignSelf = "start";
        });
        plot(el, lifts, hold, turn, vh);
        return;
      }
      const room = win.clientHeight;
      // Fit every text, first without the top padding a scrolling text needs
      // for its fade; only if one still overflows at SCRIPT_MIN, again with it.
      const fit = (padded: boolean) =>
        texts.current.map((t, i) => {
          const p = scripts[i];
          if (!t || !p) return 0;
          t.style.paddingTop = padded ? "" : "0px";
          let size = SCRIPT_MAX;
          p.style.fontSize = `${size}px`;
          while (size > SCRIPT_MIN && t.offsetHeight > room) {
            size -= SCRIPT_STEP;
            p.style.fontSize = `${size}px`;
          }
          const over = t.offsetHeight - room;
          return over > 0 ? over + FADE_FOOT : 0;
        });
      let lifts = fit(false);
      const scrolls = lifts.some((l) => l > 0);
      if (scrolls) lifts = fit(true);
      // The fades are for a scrolling text only.
      fade(scrolls);
      // On a tall phone the deck and the text under it sit in the middle of
      // the room below the heading, as the desktop centres its deck: of what
      // the tallest text leaves of the box, up to AIR goes between deck and
      // text, the rest half above the deck and half under the text, the same
      // for every slide so the deck never moves.
      const block = deck.current;
      if (block && !scrolls) {
        const spare = room - Math.max(...texts.current.map((t) => t?.offsetHeight ?? 0));
        if (spare > 0) {
          const air = Math.min(AIR, spare / 2);
          block.style.marginBottom = `${air}px`;
          block.style.marginTop = `${parseFloat(getComputedStyle(block).marginTop) + (spare - air) / 2}px`;
        }
      }
      plot(el, lifts, hold, turn, vh);
      // Under the last text the stage stays empty down to its foot; the track
      // ends that much higher, less END, so the frame's bottom corners come
      // up under the text (the page clips what of the stage hangs below).
      const end = texts.current[n - 1];
      if (end) {
        const top = win.getBoundingClientRect().top - stuck.getBoundingClientRect().top;
        const foot = top + Math.min(end.offsetHeight, room);
        el.style.marginBottom = `${-Math.max(0, vh - foot - END)}px`;
      }
    };

    // The measured track: each slide rests for 2 · hold plus its text's
    // overflow, with a turn between.
    const plot = (el: HTMLDivElement, lifts: number[], hold: number, turn: number, vh: number) => {
      const rests = lifts.map((l) => 2 * hold + l);
      const starts: number[] = [];
      let pos = 0;
      rests.forEach((r, i) => {
        starts.push(pos);
        pos += r + (i < n - 1 ? turn : 0);
      });
      plan = { starts, rests, lifts, hold, turn, span: pos };
      if (wide) el.style.height = `${pos + vh}px`;
      else el.style.setProperty("--track-phone", `${pos + vh}px`);
      // For werkzeuge/deck-film, which films the measured track by this plan.
      el.setAttribute("data-deck-plan", `${starts.map((s, i) => `${Math.round(s)}:${Math.round(rests[i])}`).join(",")};${Math.round(turn)}`);
    };

    // From scroll to wheel on the desktop: whole slides rest, the turn
    // between them eases in and out, so every stop and start is soft.
    const beat = (t: number) => {
      const k = Math.floor(t);
      return k + ease(clamp01((t - k - REST) / (1 - 2 * REST)));
    };

    const draw = (t: number, lifts?: number[]) => {
      // Where a rising slide sets out, from the top of the stage: below the
      // foot of the window, and on a touch screen below the foot of the
      // screen itself, which on an iPhone lies further down, behind Safari's
      // floating bar, where the page shows through (iOS gives the screen's
      // size upright whichever way the phone is held).
      const held =
        window.innerWidth > window.innerHeight
          ? Math.min(screen.width, screen.height)
          : Math.max(screen.width, screen.height);
      const floor =
        Math.max(stage.current?.clientHeight ?? 0, window.innerHeight, touchQuery.matches ? held : 0) + 24;
      cards.current.forEach((card, i) => {
        if (!card) return;
        const d = t - i; // > 0: landed and being covered, < 0: still to come
        const h = card.offsetHeight;
        let transform = "none";
        let shown = 1; // 1 fully there, 0 faded out
        if (d <= -1 || d >= DEEP + 1) {
          shown = 0;
        } else if (d < 0) {
          // Rising into place, straight up from below the screen's foot, on
          // the phone as on the desktop: there it floats up over the text,
          // which gives way to the next one under it (Johannes, 2026-10-02;
          // before, it came out of an edge above the text and never crossed
          // it). offsetTop is from the top of the stage, which stands at the
          // top of the window.
          transform = `translate3d(0, ${-d * (floor - card.offsetTop)}px, 0)`;
        } else if (d > 0) {
          // Up and back round the rim, and from the back of the pile on over
          // the top and down behind it, gathering speed. Seen in
          // perspective, scaled from the top edge, the vanishing point, so
          // the pile shows as a row of top edges.
          const a = NOTCH * d + (d > DEEP ? FALL * (d - DEEP) ** 2 : 0);
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
        // A rising slide passes over the text box (z-20); the slides at rest
        // stay under it, so their shadow never dims the text.
        card.style.zIndex = String(d < 0 ? 30 : i + 1);
        card.style.visibility = shown > 0 ? "visible" : "hidden";
        const cast = casts.current[i];
        const veil = veils.current[i];
        if (cast) cast.style.opacity = String(shown);
        if (veil) veil.style.opacity = String(1 - shown);
      });
      // A long text that can't fit scrolls up in its box during its rest.
      // Beside the deck the text goes out in the first part of the turn,
      // rising with the wheel, and the next comes up in the last part, one at
      // a time.
      if (wide) {
        texts.current.forEach((text, i) => {
          if (!text) return;
          const d = t - i;
          const o = Math.max(0, 1 - Math.abs(d) * 2.5);
          text.style.opacity = String(o);
          text.style.transform = `translate3d(0, ${-(lifts?.[i] ?? 0) - d * 32}px, 0)`;
          text.style.visibility = o > 0 ? "visible" : "hidden";
          text.style.removeProperty("clip-path");
        });
        return;
      }
      // On the phone held upright the rising slide floats up over the text and
      // swaps it as it passes, with no fade (Johannes, 2026-10-02): the text
      // going out shows above the slide's top edge, the next one below its
      // bottom edge, so the slide wipes the one into the other.
      const k = Math.floor(t);
      const over = t > k ? cards.current[k + 1]?.getBoundingClientRect() : undefined;
      texts.current.forEach((text, i) => {
        if (!text) return;
        text.style.transform = `translate3d(0, ${-(lifts?.[i] ?? 0)}px, 0)`;
        let on = i === k;
        let clip = "none";
        if (over && (i === k || i === k + 1)) {
          const b = text.getBoundingClientRect();
          if (i === k) {
            on = over.top > b.top;
            clip = `inset(0 0 ${Math.max(0, b.bottom - over.top)}px 0)`;
          } else {
            on = over.bottom < b.bottom;
            clip = `inset(${Math.max(0, over.bottom - b.top)}px 0 0 0)`;
          }
        }
        text.style.opacity = on ? "1" : "0";
        text.style.visibility = on ? "visible" : "hidden";
        text.style.clipPath = clip;
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
      // The measured track, on the phone held upright or where a text has to
      // scroll beside the deck; else the desktop's even one.
      if (!wide && !plan) measure();
      if (plan) {
        drawPhone(el, plan);
        return;
      }
      if (!wide) return;
      const span = Math.max(1, el.offsetHeight - window.innerHeight);
      const want = clamp01(-el.getBoundingClientRect().top / span) * (n - 1);
      if (at < 0 || touchQuery.matches) {
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

  const card = `overflow-hidden ${RADIUS} bg-hero shadow-[var(--slide-cast)]`;
  const caption = (i: number) => `${pad(i + 1)} / ${pad(n)} · ${slides[i].speaker}`;
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
      {/* Safari 26 on the iPhone clips a pinned box at the top of its
          floating bar when the box sits right on the page. On a layer of
          its own (will-change) the track carries the pinned stage instead,
          so a rising slide shows right down to the foot of the screen,
          through the bar, as the app windows on the home page do (Johannes,
          2026-10-03). */}
      <div
        ref={track}
        data-deck-track={n}
        className="relative h-[var(--track-phone,900svh)] [will-change:transform] [--deck-chrome:88px] [--deck-head:26px] [--deck-top:var(--content-top)] motion-reduce:hidden deck-wide:h-[var(--track)] deck-wide:[--deck-head:56px] deck-squat:[--deck-chrome:32px] deck-squat:[--deck-head:22px] deck-squat:[--deck-top:calc(var(--nav-h)+12px)]"
        style={measures}
      >
        {/* The box that pins the stage is hidden itself and holds nothing
            but the stage. Safari 26 on the iPhone paints the strip under its
            floating bar in the colour of whatever passes the foot of the
            window inside a pinned box about the size of the screen, and
            keeps it: a rising slide turned that strip white for good
            (Johannes, 2026-10-02). A hidden pinned box it passes by, so the
            strip stays Safari's own glass, as on every other page. */}
        <div className="invisible sticky top-0 h-[100svh]">
          <div
            ref={stage}
            className="visible relative flex h-full flex-col pt-[calc(var(--nav-h)+24px)] pb-3 deck-wide:grid deck-wide:grid-cols-[minmax(0,4fr)_minmax(0,3fr)] deck-wide:gap-x-16 deck-wide:pt-[var(--deck-top)] deck-wide:pb-10 deck-squat:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] deck-squat:gap-x-8 deck-squat:pb-3"
          >
            {/* On the phone this column dissolves (`contents`), so the
                heading, the deck and the text box are one column. */}
            <div className="deck-narrow:contents deck-wide:flex deck-wide:min-h-0 deck-wide:flex-col">
              <DeckHead title={title} />
              <div ref={deck} className="mt-4 deck-wide:my-auto">
                <div className="grid pt-[var(--pile-phone)] deck-wide:pt-[var(--pile)]">
                  {slides.map((s, i) => (
                    <div
                      key={s.alt}
                      ref={(el) => {
                        cards.current[i] = el;
                      }}
                      className="relative col-start-1 row-start-1 w-[var(--slide-phone)] origin-top will-change-transform deck-wide:w-[var(--slide)]"
                      style={{ zIndex: i + 1, visibility: i === 0 ? "visible" : "hidden" }}
                    >
                      <div
                        ref={(el) => {
                          casts.current[i] = el;
                        }}
                        aria-hidden
                        className={`absolute inset-0 ${RADIUS} shadow-[var(--slide-cast)]`}
                      />
                      <div
                        className={`relative overflow-hidden ${RADIUS} bg-hero`}
                        style={s.ground ? { backgroundColor: s.ground } : undefined}
                      >
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
            {/* The texts share one place: on the desktop the right column,
                centred in the band beside the deck, fading over each other,
                the size following the screen's height so the longest (slide 6)
                still fits a short laptop; on the phone the box under the deck,
                each text sized to fit it, the next slide floating up over it
                from the foot of the screen and wiping the one text into the
                next (see draw). The box is the bare page, so the
                deck's shadow falls on it as on the desktop (a sage shelf laid
                over it cut the shadow in a line across the screen). */}
            <div className="relative z-20 mt-5 min-h-0 flex-1 deck-wide:contents">
              <div
                ref={box}
                className="relative h-full overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,var(--ink)_12px,var(--ink)_calc(100%-28px),transparent)] deck-wide:grid deck-wide:h-auto deck-wide:min-h-0 deck-wide:overflow-visible deck-wide:pt-[var(--deck-head)] deck-wide:[mask-image:none] deck-squat:pt-0"
              >
                {slides.map((s, i) => (
                  <div
                    key={s.alt}
                    ref={(el) => {
                      texts.current[i] = el;
                    }}
                    className={`absolute inset-x-0 top-0 pt-3 will-change-[transform,opacity] deck-wide:relative deck-wide:col-start-1 deck-wide:row-start-1 deck-wide:self-center deck-wide:pt-0 ${
                      i > 0 ? "invisible opacity-0" : ""
                    }`}
                  >
                    <p className={LABEL}>{caption(i)}</p>
                    <p className="mt-3 text-[13px] leading-[1.3] text-pretty deck-wide:mt-4 deck-wide:max-w-[34em] deck-wide:text-[clamp(14px,2.3svh,18px)] deck-wide:leading-[1.4] deck-squat:mt-3 deck-squat:leading-[1.3]">
                      {s.script}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden space-y-[var(--content-gap)] pt-[var(--content-top)] motion-reduce:block">
        <DeckHead title={title} />
        {slides.map((s, i) => (
          <div key={s.alt}>
            <div className={card} style={s.ground ? { backgroundColor: s.ground } : undefined}>
              <Image src={s.src} alt={s.alt} sizes="92vw" className="block h-auto w-full" />
            </div>
            <p className={`${LABEL} mt-5`}>{caption(i)}</p>
            <p className={`${BODY} mt-3 text-pretty`}>{s.script}</p>
          </div>
        ))}
      </div>
    </>
  );
}

/** The deck's heading as a split-flap board (Johannes, 2026-10-07: first
 *  the plain 28px heading looked out of place, then an ink tag like the
 *  map's; then "use the style of A, like the airplane terminal graphic"),
 *  flapping into place once as it comes into view. Outside the track (reduced
 *  motion) it falls back to 40px. */
function DeckHead({ title }: { title: string }) {
  return (
    <Playback length={boardLength(title)} share={0.9} smooth>
      <h2 className="h-[var(--deck-head,40px)] @container">
        <span className="sr-only">{title}</span>
        <Anzeigetafel text={title} />
      </h2>
    </Playback>
  );
}
