"use client";

import Image, { type StaticImageData } from "next/image";
import { type CSSProperties, type ReactNode, useEffect, useRef } from "react";

import { BODY, H2, LABEL } from "../type";

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
// The stage — the deck's heading, which is the page's h1 (the page's own
// name stands only in the navbar: first a big title, then a small mono label,
// both gone, Johannes, 2026-10-01), the deck, and what the
// founders say to the slide in front, from the stage pitch script, fading
// over as the wheel turns — is sticky from the top of the page for the
// length of the track, so the first slide already stands in its place when
// the page opens (Johannes, 2026-09-30). On the desktop (from 1024px wide,
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
// On a touch screen the browser moves it all itself, along the scroll (lay):
// Safari from 26.4 does that together with the scroll and at the screen's
// own rate, smoother than a script, which it gives 60 frames a second
// (Johannes, 2026-10-03). With a mouse or a trackpad, and where a browser
// can't, a script draws the same frame by frame (draw), as on the desktop
// before, gliding a mouse wheel's steps: there Safari's own motion now and
// then left a slide veiled or a text half shown (Johannes, 2026-10-03: "on
// desktop, it worked great before").
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
// Where the browser moves the deck itself (lay), the points it is given
// along every turn: enough that the straight lines between them read as the
// curve.
const SAMPLES = 32;
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
// The stage's head: the deck's heading.
const HEAD = "var(--h2-line)";
// The screen height the pile and the front slide share: on the desktop the
// screen less the navbar's clearance, the stage's head and its margins; on
// the phone at most this share of the screen, so the text under the deck
// keeps room (a phone held sideways would otherwise get a deck taller than
// itself).
const ROOM = "(100svh - var(--deck-top) - var(--deck-head) - var(--deck-chrome))";
const ROOM_PHONE = "(100svh * 0.45)";
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

// View timelines and animation ranges, which TypeScript's DOM types don't
// know yet.
type ViewTimelineType = new (options: { subject: Element; axis?: "block" | "inline" }) => AnimationTimeline;
type RangedOptions = KeyframeAnimationOptions & { rangeStart?: string; rangeEnd?: string };

export function SlideStack({ title, slides }: { title: string; slides: readonly Slide[] }) {
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const deck = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const casts = useRef<(HTMLDivElement | null)[]>([]);
  const veils = useRef<(HTMLDivElement | null)[]>([]);
  const texts = useRef<(HTMLDivElement | null)[]>([]);
  const panes = useRef<(HTMLDivElement | null)[]>([]);
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
    // What the motion needs of the layout, read once per measure (survey):
    // the stage's height; where a rising slide sets out; each slide's offset
    // in the stage and its height, as the offsets give them (whole pixels);
    // and, from the top of the stage to the fraction of a pixel, the grid
    // cell all slides share and the text box, for the wipe.
    const geo = {
      vh: 0,
      floor: 0,
      cards: [] as { top: number; h: number }[],
      cell: { top: 0, h: 0 },
      box: { top: 0, h: 0 },
    };
    // On a touch screen whose browser has view timelines, the browser moves
    // the deck itself (lay); elsewhere the script draws it frame by frame
    // (tick).
    const View = (window as unknown as { ViewTimeline?: ViewTimelineType }).ViewTimeline;
    const subject = track.current;
    let timeline = View && subject && touchQuery.matches ? new View({ subject, axis: "block" }) : null;
    let runs: Animation[] = [];
    let laid = ""; // the layout the browser's animations were laid out for

    // Each text is sized to fit its box. Where one overflows even at the
    // smallest size, the track is measured instead of even: that text's slide
    // rests longer by its overflow, which the text scrolls through then; on
    // the phone held upright the track is measured always. Only the stage's
    // own height is used, never the window's, so Safari's collapsing address
    // bar changes nothing.
    const arrange = () => {
      const el = track.current;
      const stuck = stage.current;
      const win = box.current;
      if (!el || !stuck || !win) return;
      const scripts = texts.current.map((t) => t?.lastElementChild as HTMLElement | null | undefined);
      // Start clean of what an earlier measure set, maybe for the other stage.
      deck.current?.style.removeProperty("margin-top");
      deck.current?.style.removeProperty("margin-bottom");
      el.style.removeProperty("height");
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

    // What the motion needs of the layout, once the texts are fitted (geo).
    // Where a rising slide sets out, from the top of the stage: below the foot
    // of the window, and on a touch screen below the foot of the screen
    // itself, which on an iPhone lies further down, behind Safari's floating
    // bar, where the page shows through (iOS gives the screen's size upright
    // whichever way the phone is held).
    const survey = () => {
      const stuck = stage.current;
      if (!stuck) return;
      const top = stuck.getBoundingClientRect().top;
      geo.vh = stuck.clientHeight;
      const held =
        window.innerWidth > window.innerHeight
          ? Math.min(screen.width, screen.height)
          : Math.max(screen.width, screen.height);
      geo.floor = Math.max(geo.vh, window.innerHeight, touchQuery.matches ? held : 0) + 24;
      geo.cards = cards.current.map((c) => ({ top: c?.offsetTop ?? 0, h: c?.offsetHeight ?? 0 }));
      const grid = deck.current?.firstElementChild;
      if (grid) {
        const g = grid.getBoundingClientRect();
        const pad = parseFloat(getComputedStyle(grid).paddingTop);
        geo.cell = { top: g.top + pad - top, h: g.height - pad };
      }
      const b = box.current?.getBoundingClientRect();
      if (b) geo.box = { top: b.top - top, h: b.height };
    };

    const measure = () => {
      arrange();
      survey();
    };

    // From scroll to wheel on the desktop: whole slides rest, the turn
    // between them eases in and out, so every stop and start is soft.
    const beat = (t: number) => {
      const k = Math.floor(t);
      return k + ease(clamp01((t - k - REST) / (1 - 2 * REST)));
    };

    // Where the deck stands s px into the track: which slide rests, or how
    // far the turn to the next has come, and how far each text has scrolled
    // in its box. The even track of the desktop takes one slide per even
    // stretch; the measured one goes by its plan.
    const place = (s: number) => {
      const lifts = new Array<number>(n).fill(0);
      const p = plan;
      if (!p) {
        const span = Math.max(1, (track.current?.offsetHeight ?? 0) - geo.vh);
        return { t: beat(clamp01(s / span) * (n - 1)), lifts };
      }
      const into = (i: number) => Math.min(p.span, Math.max(0, s)) - p.starts[i];
      for (let i = 0; i < n; i++) {
        if (into(i) <= p.rests[i] || i === n - 1) {
          lifts[i] = Math.min(p.lifts[i], Math.max(0, into(i) - p.hold));
          return { t: i, lifts };
        }
        if (into(i) < p.rests[i] + p.turn) {
          lifts[i] = p.lifts[i];
          return { t: i + ease((into(i) - p.rests[i]) / p.turn), lifts };
        }
      }
      return { t: n - 1, lifts };
    };

    // How every slide and text looks with the deck at t and the texts
    // scrolled by lifts, for both ways of moving it: the script draws it frame
    // by frame (draw), the browser gets it along the whole track (lay).
    const look = (t: number, lifts: number[]) => {
      // How far below its place a rising slide (d < 0) stands. Its offset is
      // from the top of the stage, which stands at the top of the window.
      const rise = (i: number, d: number) => -d * (geo.floor - (geo.cards[i]?.top ?? 0));
      return {
        cards: Array.from({ length: n }, (_, i) => {
          const d = t - i; // > 0: landed and being covered, < 0: still to come
          // Before it rises and once it has gone a slide is hidden, waiting
          // where it sets out and staying where it went, so its path never
          // jumps.
          const e = Math.min(DEEP + 1, Math.max(-1, d));
          let y = 0;
          let s = 1;
          let shown = 1; // 1 fully there, 0 faded out
          if (e < 0) {
            // Rising into place, straight up from below the screen's foot, on
            // the phone as on the desktop: there it floats up over the text,
            // which gives way to the next one under it (Johannes, 2026-10-02;
            // before, it came out of an edge above the text and never crossed
            // it).
            y = rise(i, e);
          } else if (e > 0) {
            // Up and back round the rim, and from the back of the pile on over
            // the top and down behind it, gathering speed. Seen in
            // perspective, scaled from the top edge, the vanishing point, so
            // the pile shows as a row of top edges.
            const a = NOTCH * e + (e > DEEP ? FALL * (e - DEEP) ** 2 : 0);
            const z = WHEEL * (1 - Math.cos(a));
            shown = 1 - TINT * Math.min(e, DEEP);
            if (e > DEEP) shown *= 1 - (e - DEEP) ** 2;
            s = EYE / (EYE + z);
            y = -WHEEL * Math.sin(a) * s * (geo.cards[i]?.h ?? 0);
          }
          const on = d > -1 && d < DEEP + 1;
          // The fade veils the slide in the page's own sage rather than
          // making it see-through, so the slide behind never shows through it;
          // its shadow fades with it. A rising slide passes over the text box
          // (z-20); the slides at rest stay under it, so their shadow never
          // dims the text.
          return { transform: `translate3d(0, ${y}px, 0) scale(${s})`, shown: on ? shown : 0, z: d < 0 ? 30 : i + 1, on };
        }),
        texts: Array.from({ length: n }, (_, i) => {
          const d = t - i;
          const lift = lifts[i] ?? 0;
          // A long text that can't fit scrolls up in its box during its rest.
          // Beside the deck the text goes out in the first part of the turn,
          // rising with the wheel, and the next comes up in the last part, one
          // at a time.
          if (wide) {
            const opacity = Math.max(0, 1 - Math.abs(d) * 2.5);
            return { opacity, transform: `translate3d(0, ${-lift - d * 32}px, 0)`, pane: "none", on: opacity > 0 };
          }
          // On the phone held upright the rising slide floats up over the
          // text and swaps it as it passes, with no fade (Johannes,
          // 2026-10-02): the text going out shows above the slide's top edge,
          // the next one below its bottom edge, so the slide wipes the one
          // into the other. Each text shows through a pane the height of its
          // box that moves with the slide's edge while the text inside stays
          // put, as the browser can move it along the scroll (a clip-path
          // can't be). Before and after its turns the pane stays below the
          // box or above it, so a text hides by its pane alone: a switch of
          // visibility runs on Safari's main thread and lags behind the
          // slides (Johannes, 2026-10-03: two texts over each other).
          let y = 0;
          if (d < 0) y = Math.max(0, geo.cell.top + rise(i, Math.max(-1, d)) + geo.cell.h - geo.box.top);
          else if (d > 0) y = Math.min(0, geo.cell.top + rise(i + 1, Math.min(1, d) - 1) - geo.box.top - geo.box.h);
          return { opacity: 1, transform: `translate3d(0, ${-y - lift}px, 0)`, pane: `translate3d(0, ${y}px, 0)`, on: d > -1 && d < 1 };
        }),
      };
    };
    type Look = ReturnType<typeof look>;

    // The script's way: set every slide and text by hand.
    const draw = (t: number, lifts: number[]) => {
      const l = look(t, lifts);
      l.cards.forEach((c, i) => {
        const card = cards.current[i];
        if (!card) return;
        card.style.transform = c.transform;
        card.style.zIndex = String(c.z);
        card.style.visibility = c.on ? "visible" : "hidden";
        const cast = casts.current[i];
        const veil = veils.current[i];
        if (cast) cast.style.opacity = String(c.shown);
        if (veil) veil.style.opacity = String(1 - c.shown);
      });
      l.texts.forEach((x, i) => {
        const text = texts.current[i];
        if (!text) return;
        text.style.opacity = String(x.opacity);
        text.style.transform = x.transform;
        text.style.visibility = x.on ? "visible" : "hidden";
        const pane = panes.current[i];
        if (pane) pane.style.transform = x.pane;
      });
    };

    // The browser's way: the deck's whole motion handed over once, every
    // element's look at points along the track as keyframes on a view
    // timeline over the track (exit-crossing: from its top at the top of the
    // window to its foot there, in pixels of scroll, whatever the window's
    // height). The browser then moves the slides itself, and Safari from 26.4
    // does so together with the scroll and at the screen's own rate, where a
    // script gets 60 frames a second (Johannes, 2026-10-03, having seen both
    // side by side: "the right one is smoother").
    const lay = () => {
      const el = track.current;
      if (!timeline || !el || el.offsetParent === null) return;
      const total = el.offsetHeight;
      const shape = JSON.stringify([total, geo, plan, wide]);
      if (shape === laid) return;
      laid = shape;
      // The points: where every rest begins and ends (and where a text
      // starts and stops scrolling), and SAMPLES along every turn.
      const points = [0, total];
      const along = (from: number, length: number) => {
        for (let j = 1; j < SAMPLES; j++) points.push(from + (length * j) / SAMPLES);
      };
      const p = plan;
      if (p) {
        p.starts.forEach((start, i) => {
          points.push(start, start + p.hold, start + p.hold + p.lifts[i], start + p.rests[i]);
          if (i < n - 1) along(start + p.rests[i], p.turn);
        });
      } else {
        const each = Math.max(1, total - geo.vh) / (n - 1);
        for (let k = 0; k < n - 1; k++) {
          points.push(k * each, (k + REST) * each, (k + 1 - REST) * each, (k + 1) * each);
          along((k + REST) * each, (1 - 2 * REST) * each);
        }
      }
      const looks = [...new Set(points)]
        .sort((a, b) => a - b)
        .map((s) => {
          const { t, lifts } = place(s);
          return { offset: s / total, view: look(t, lifts) };
        });
      // One element's keyframes for one group of its properties; a run of one
      // value keeps only its ends.
      const keyframes = (pick: (l: Look) => Keyframe, step = false) => {
        const all = looks.map(({ offset, view }) => {
          const value = pick(view);
          return { offset, value, key: Object.values(value).join(" ") };
        });
        return all
          .filter((f, i) => f.key !== all[i - 1]?.key || f.key !== all[i + 1]?.key)
          .map(({ offset, value }) => ({ ...value, offset, ...(step ? { easing: "step-end" } : {}) }));
      };
      // Nothing is switched to hidden here: a slide waits below the screen and
      // goes behind the pile under its full veil, a text hides by its pane
      // or, beside the deck, its opacity. In Safari 26 an animation inside a
      // hidden slide could stay stuck once it showed again (Johannes,
      // 2026-10-03: the last slide stood there all sage, veiled). Only the
      // z-index switches, in one step (step-end), not through the numbers
      // between.
      const plays: [Element | null | undefined, (l: Look) => Keyframe, boolean?][] = [];
      cards.current.forEach((card, i) => {
        plays.push([card, (l) => ({ transform: l.cards[i].transform })]);
        plays.push([card, (l) => ({ zIndex: l.cards[i].z }), true]);
        plays.push([casts.current[i], (l) => ({ opacity: l.cards[i].shown })]);
        plays.push([veils.current[i], (l) => ({ opacity: 1 - l.cards[i].shown })]);
      });
      texts.current.forEach((text, i) => {
        plays.push([text, (l) => ({ opacity: l.texts[i].opacity, transform: l.texts[i].transform })]);
        if (!wide) plays.push([panes.current[i], (l) => ({ transform: l.texts[i].pane })]);
      });
      [...cards.current, ...texts.current].forEach((x) => x?.style.setProperty("visibility", "visible"));
      runs.forEach((r) => r.cancel());
      const options: RangedOptions = {
        timeline,
        fill: "both",
        rangeStart: "exit-crossing 0%",
        rangeEnd: "exit-crossing 100%",
      };
      runs = plays.flatMap(([target, pick, step]) => (target ? [target.animate(keyframes(pick, step), options)] : []));
      // A browser whose timeline doesn't run over the track as asked gets the
      // script instead.
      runs[0]?.ready.then(
        () => {
          const progress = runs[0]?.effect?.getComputedTiming().progress;
          const want = clamp01(-el.getBoundingClientRect().top / total);
          if (progress != null && Math.abs(progress - want) < 0.01) return;
          runs.forEach((r) => r.cancel());
          runs = [];
          timeline = null;
          schedule();
        },
        () => {}, // cancelled by a later lay
      );
    };

    const tick = (now: number) => {
      frame = 0;
      const el = track.current;
      if (!el || el.offsetParent === null || runs.length) return; // the list is showing, or the browser moves the deck
      // The measured track, on the phone held upright or where a text has to
      // scroll beside the deck; else the desktop's even one, where a mouse
      // wheel's steps are glided.
      if (!wide && !plan) measure();
      if (plan) {
        const { t, lifts } = place(-el.getBoundingClientRect().top);
        draw(t, lifts);
        return;
      }
      if (!wide) return;
      const span = Math.max(1, el.offsetHeight - geo.vh);
      const want = clamp01(-el.getBoundingClientRect().top / span) * (n - 1);
      if (at < 0 || touchQuery.matches) {
        at = want;
      } else {
        const dt = Math.min(0.05, Math.max(0, now - last) / 1000);
        at += (want - at) * (1 - Math.exp(-dt / GLIDE));
        if (Math.abs(want - at) < 0.001) at = want;
      }
      last = now;
      draw(beat(at), new Array<number>(n).fill(0));
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
      lay();
      schedule();
    };
    measure();
    lay();
    tick(performance.now());
    // The texts' heights depend on the font, which may arrive after the first
    // measure.
    document.fonts?.ready.then(remeasure);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", remeasure, { passive: true });
    wideQuery.addEventListener("change", remeasure);
    return () => {
      cancelAnimationFrame(frame);
      runs.forEach((r) => r.cancel());
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
    "--deck-head": HEAD,
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
        className="relative h-[var(--track-phone,900svh)] [will-change:transform] [--deck-chrome:88px] [--deck-top:var(--content-top)] motion-reduce:hidden deck-wide:h-[var(--track)] deck-squat:[--deck-chrome:32px] deck-squat:[--deck-top:calc(var(--nav-h)+12px)]"
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
              <h1 className={H2}>{title}</h1>
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
                      {/* The shadow and the veil are layers of their own from
                          the start (will-change), so the browser fades them
                          itself, whether the slide is in view or not. */}
                      <div
                        ref={(el) => {
                          casts.current[i] = el;
                        }}
                        aria-hidden
                        className={`absolute inset-0 ${RADIUS} shadow-[var(--slide-cast)] will-change-[opacity]`}
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
                          className="pointer-events-none absolute inset-0 bg-paper opacity-0 will-change-[opacity]"
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
                next through the pane each text shows through (see look).
                The box is the bare page, so the deck's shadow falls on it as
                on the desktop (a sage shelf laid over it cut the shadow in a
                line across the screen). Each pane is a layer of its own from
                the start (will-change), so its edge moves with it on the
                browser's own thread, where Safari 26 otherwise cut the text at
                a place its main thread worked out, behind the slide (Johannes,
                2026-10-03). Beside the deck the panes dissolve (`contents`). */}
            <div className="relative z-20 mt-5 min-h-0 flex-1 deck-wide:contents">
              <div
                ref={box}
                className="relative h-full overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,var(--ink)_12px,var(--ink)_calc(100%-28px),transparent)] deck-wide:grid deck-wide:h-auto deck-wide:min-h-0 deck-wide:overflow-visible deck-wide:pt-[var(--deck-head)] deck-wide:[mask-image:none] deck-squat:pt-0"
              >
                {slides.map((s, i) => (
                  <div
                    key={s.alt}
                    ref={(el) => {
                      panes.current[i] = el;
                    }}
                    className="absolute inset-0 overflow-hidden [will-change:transform] deck-wide:contents"
                  >
                    <div
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
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden space-y-[var(--content-gap)] pt-[var(--content-top)] motion-reduce:block">
        <h1 className={H2}>{title}</h1>
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
