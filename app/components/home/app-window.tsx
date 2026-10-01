"use client";

import { useEffect, useRef, useState } from "react";

import type { WindowCopy } from "./window/content";
import { Icon, type IconName } from "./window/icons";
import { Show, Typed, useClock } from "./window/playback";

// The app, drawn as a macOS window (2026-09-30, replacing the screenshots):
// the way the app itself looks and the way Buzz frames it — the sage floor
// with the three lights in its top row, the menu standing on the floor, the
// white card inset on it with rounded corners. It is the app at its real
// size, pixel for pixel: a 1280 × 853 window (x.ai/build's 3:2) with the menu
// at its narrowest 220px (the app's menu can be dragged from 220 to 420), the
// app's own type, rows, avatars and margins. Everything inside is live text on the canvas of
// app/globals.css (`.app-canvas`), scaled whole to the figure's width, so
// the four windows are the same picture at every width, in the page's
// language. The canvas is one picture for assistive tech: hidden, with the
// row's description as the figure's caption.

// The window's three lights. The colours are macOS's own, the one place a
// literal colour lives outside globals.css — they are Apple's, not the site's.
// Size and place are x.ai/build's (Johannes, 2026-10-01): measured on their
// 1320px window, 18px lights on a 30px pitch, 26px in from the left and 27px
// down, scaled to our 1280 — so they sit in a tall title row (TOP) above
// the menu and the card.
const LIGHTS = ["#ed6a5e", "#f4bf4f", "#61c554"] as const;
const TOP = 70;

/** The canvas's width in app pixels; the figure scales it to its own. */
const WIDTH = 1280;

export type Nav = "home" | "inbox" | "recordings" | "tasks";

export function AppWindow({
  label,
  menu,
  nav,
  open,
  running = false,
  children,
}: {
  /** What the window shows, for readers who don't see it. */
  label: string;
  menu: WindowCopy["menu"];
  /** The menu row that is selected, if it's one of the four. */
  nav?: Nav;
  /** The open recording that is selected, as its index in `menu.open`. */
  open?: number;
  /** A recording is running: the first open recording shows as such. */
  running?: boolean;
  children: React.ReactNode;
}) {
  const figure = useRef<HTMLElement>(null);
  const [scale, setScale] = useState<number>();
  useEffect(() => {
    const el = figure.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / WIDTH));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <figure ref={figure} className="@container relative aspect-[1280/853]">
      <figcaption className="sr-only">{label}</figcaption>
      <div
        aria-hidden
        className="app-canvas absolute left-0 top-0 select-none overflow-hidden rounded-[14px] bg-app-floor shadow-[var(--window-cast)]"
        style={scale ? { scale } : undefined}
      >
        <div className="absolute left-[25px] top-[26px] flex gap-[11.5px]">
          {LIGHTS.map((c) => (
            <span key={c} className="size-[17.5px] rounded-full" style={{ background: c }} />
          ))}
        </div>
        <Menu menu={menu} nav={nav} open={open} running={running} />
        <div
          className="absolute bottom-2 left-[220px] right-2 flex flex-col overflow-hidden rounded-[12px] bg-app-card shadow-[var(--app-card-edge)]"
          style={{ top: TOP }}
        >
          {children}
        </div>
      </div>
    </figure>
  );
}

// A menu row as the app's SidebarMenuButton draws it: 32px, 14px type, a
// 16px icon, 8px in from its rounded box.
const ROW = "flex h-8 items-center gap-2 rounded-md px-2";

function Menu({
  menu,
  nav,
  open,
  running,
}: {
  menu: WindowCopy["menu"];
  nav?: Nav;
  open?: number;
  running: boolean;
}) {
  const items: [Nav, IconName, string][] = [
    ["home", "home", menu.home],
    ["inbox", "inbox", menu.inbox],
    ["recordings", "sparkles", menu.recordings],
    ["tasks", "tasks", menu.tasks],
  ];
  const recordings = running ? [menu.running, ...menu.open.slice(1)] : menu.open;
  return (
    <div className="absolute bottom-0 left-0 flex w-[220px] flex-col px-[11px] pb-3" style={{ top: TOP }}>
      <div className="flex items-center gap-1">
        <div className={`${ROW} flex-1 bg-app-floor-line/35 text-app-ink/55`}>
          <Icon name="search" className="size-4 text-app-ink/45" />
          {menu.search}
        </div>
        <span className="flex size-8 items-center justify-center text-app-ink/60">
          <Icon name="panel" className="size-4" />
        </span>
      </div>
      <ul className="mt-2 flex flex-col gap-1">
        {items.map(([key, icon, text]) => (
          <li key={key} className={`${ROW} ${nav === key ? "bg-app-ink/7 font-medium" : ""}`}>
            <Icon name={icon} className="size-4" />
            {text}
            {key === "inbox" && (
              <span className="ml-auto rounded-full bg-app-ink/15 px-1.5 text-2xs">3</span>
            )}
          </li>
        ))}
      </ul>
      <p className="mt-2 flex h-8 items-center px-2 text-xs font-medium text-app-ink/70">{menu.openLabel}</p>
      <ul className="flex flex-col gap-1">
        {recordings.map((text, i) => (
          <li key={text} className={`${ROW} ${open === i ? "bg-app-ink/7" : ""}`}>
            <Icon name="message" className="size-4 text-app-ink/60" />
            <span className="min-w-0 truncate">{text}</span>
          </li>
        ))}
        <li className={`${ROW} text-app-ink/80`}>
          <Icon name="history" className="size-4" />
          <span className="min-w-0 truncate">{menu.all}</span>
        </li>
      </ul>
      <div className="mt-auto flex items-center gap-3 px-2">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-app-ink text-xs font-medium text-app-card">
          JK
        </span>
        <span className="min-w-0">
          <span className="block truncate font-medium leading-tight">{menu.person}</span>
          <span className="block truncate text-xs leading-snug text-app-ink/70">{menu.firm}</span>
        </span>
      </div>
    </div>
  );
}

/** The card's top row (the app's Kopfzeile): what the screen is, and on the
 *  right its action. */
export function CardHeader({ icon, title, right }: { icon: IconName; title: string; right?: React.ReactNode }) {
  return (
    <div className="flex h-14 shrink-0 items-center gap-1 pl-4 pr-3">
      <Icon name={icon} className="size-4 text-app-grey" />
      <span className="text-base font-medium">{title}</span>
      {right && <div className="ml-auto">{right}</div>}
    </div>
  );
}

/** The dark button the app puts top right of a conversation. */
export function DoneButton({ text }: { text: string }) {
  return (
    <span className="flex h-8 items-center rounded-lg bg-app-ink px-3 text-sm font-medium text-app-card">{text}</span>
  );
}

/** A turn in the conversation, as the app sets it (Beitrag.tsx): the round
 *  initial, the name and time, then the text — and below it, a card if
 *  there is one. */
export function Message({
  who,
  initial,
  time,
  mine = false,
  at,
  children,
}: {
  who: string;
  initial: string;
  time: string;
  mine?: boolean;
  at: number;
  children: React.ReactNode;
}) {
  return (
    <Show at={at} className="mx-1 flex gap-2.5 px-2 py-1">
      <span
        className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-medium shadow-xs ${
          mine ? "bg-app-fill" : "bg-app-ink text-app-card"
        }`}
      >
        {initial}
      </span>
      <div className="min-w-0 flex-1">
        <p className="flex items-baseline gap-1.5 leading-4">
          <span className="font-medium">{who}</span>
          <span className="text-xs tabular-nums text-app-grey/55">{time}</span>
        </p>
        <div className="mt-0.5">{children}</div>
      </div>
    </Show>
  );
}

/** The app's message box (Eingabezeile.tsx), typing `text` from `at` and
 *  sending it at `sendAt`: the send button lights while there is text, and
 *  the box empties again once it is sent (the finished frame shows it empty). */
export function Composer({
  placeholder,
  text,
  at,
  sendAt,
}: {
  placeholder: string;
  text: string;
  at: number;
  sendAt: number;
}) {
  const t = useClock();
  const typing = t >= at && t < sendAt;
  return (
    <div className="shrink-0 px-3 pb-3">
      <div className="rounded-2xl border border-app-line px-4 pb-2 pt-3">
        <p className="h-5 truncate">
          {typing ? <Typed at={at} text={text} /> : <span className="text-app-grey">{placeholder}</span>}
        </p>
        <div className="mt-2 flex items-center">
          <div className="-ml-2 flex items-center gap-1 py-1 text-app-grey">
            {(["keyboard", "camera", "paperclip", "mic"] as const).map((name) => (
              <span key={name} className="flex size-8 items-center justify-center">
                <Icon name={name} className="size-4" />
              </span>
            ))}
          </div>
          <span
            className={`ml-auto flex size-8 items-center justify-center rounded-lg bg-app-ink text-app-card transition-opacity ${
              typing && t > at + 120 ? "" : "opacity-50"
            }`}
          >
            <Icon name="arrowUp" className="size-4" />
          </span>
        </div>
      </div>
    </div>
  );
}
