"use client";

import { Playback, useClock } from "../window/playback";

// Variant B of "Eure Daten" (preview, 2026-10-04): typesafe's diagram on its
// dotted panel. What Raban holds (tasks, answers, documents) runs on hairlines
// into a ZIP drawn as a file with a zipper, which closes, and comes out again
// as CSV, JSON and the originals: readable without Raban. Left to right from
// `sm`, top to bottom on a phone, where the wide drawing would shrink its
// words to 6px. Played once when it scrolls into view; the server and reduced
// motion show the finished diagram.

const LENGTH = 2900;

const clamp = (a: number) => Math.max(0, Math.min(1, a));

type Words = { items: readonly string[]; formats: readonly string[]; file: string; label: string };

export function DataFlow(words: Words) {
  return (
    <Playback length={LENGTH}>
      <div className="max-sm:hidden">
        <Wide {...words} />
      </div>
      <div className="sm:hidden">
        <Tall {...words} />
      </div>
    </Playback>
  );
}

/** Where the drawing stands on the clock: lines in, the zipper, lines out, the formats. */
function useStage() {
  const t = useClock();
  const at = (from: number, span: number) => (Number.isFinite(t) ? clamp((t - from) / span) : 1);
  return { inLines: at(0, 700), zip: at(650, 750), outLines: at(1350, 700), format: (j: number) => at(1900 + j * 180, 400) };
}

function Line({ d, drawn }: { d: string; drawn: number }) {
  return <path d={d} fill="none" stroke="var(--ink)" strokeWidth={1} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - drawn} />;
}

function Dot({ x, y }: { x: number; y: number }) {
  return <rect x={x - 2.5} y={y - 2.5} width={5} height={5} fill="var(--ink)" />;
}

/** A word in a box: dark for what goes in (like the site's tags), light for what comes out. */
function Chip({ x, y, w, h, text, dark, size }: { x: number; y: number; w: number; h: number; text: string; dark: boolean; size: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={dark ? "var(--ink)" : "var(--app-card)"} stroke="var(--ink)" strokeWidth={1} />
      <text x={x + size * 0.85} y={y + h / 2 + size * 0.36} fontSize={size} className="font-mono" fill={dark ? "var(--paper)" : "var(--ink)"} letterSpacing="0.04em">
        {text}
      </text>
    </g>
  );
}

/** The ZIP: a page with a folded corner and a zipper down its middle that
 *  closes as `zip` runs from 0 to 1. */
function File({ x, y, w, h, fold, zip }: { x: number; y: number; w: number; h: number; fold: number; zip: number }) {
  const xm = x + w / 2;
  const top = y + fold + 10;
  const bottom = y + h - 40;
  const pitch = 9;
  const teeth = Math.floor((bottom - top) / pitch);
  const slider = top + (bottom - top) * zip;
  return (
    <g>
      <path d={`M${x},${y} H${x + w - fold} L${x + w},${y + fold} V${y + h} H${x} Z`} fill="var(--app-card)" stroke="var(--ink)" strokeWidth={1} />
      <path d={`M${x + w - fold},${y} V${y + fold} H${x + w}`} fill="none" stroke="var(--ink)" strokeWidth={1} />
      {Array.from({ length: teeth }, (_, k) => {
        const ty = top + k * pitch;
        const apart = ty + pitch / 2 > slider ? 4 : 0;
        return (
          <g key={k} fill="var(--ink)">
            <rect x={xm - 7 - apart} y={ty} width={7} height={4} />
            <rect x={xm + apart} y={ty + pitch / 2} width={7} height={4} />
          </g>
        );
      })}
      <rect x={xm - 7} y={slider - 9} width={14} height={18} rx={3} fill="var(--ink)" />
      <rect x={xm - 3} y={slider + 9} width={6} height={13} rx={1.5} fill="var(--ink)" />
    </g>
  );
}

/** From `sm` up: left to right. */
function Wide({ items, formats, file, label }: Words) {
  const s = useStage();
  const rows = [78, 165, 252];
  const left = { x: 16, w: 132 };
  const right = { x: 492, w: 132 };
  const doc = { x: 258, y: 70, w: 124, h: 190, fold: 24 };
  const mid = doc.y + doc.h / 2;
  const busIn = (left.x + left.w + doc.x) / 2;
  const busOut = (doc.x + doc.w + right.x) / 2;
  return (
    <svg viewBox="0 0 640 300" className="block h-auto w-full" role="img" aria-label={label}>
      {rows.map((y) => (
        <Line key={`in${y}`} d={`M${left.x + left.w},${y} H${busIn} V${mid} H${doc.x}`} drawn={s.inLines} />
      ))}
      {rows.map((y) => (
        <Line key={`out${y}`} d={`M${doc.x + doc.w},${mid} H${busOut} V${y} H${right.x}`} drawn={s.outLines} />
      ))}
      {items.map((item, i) => (
        <g key={item}>
          <Chip x={left.x} y={rows[i] - 13} w={left.w} h={26} text={item} dark size={11.5} />
          <Dot x={left.x + left.w} y={rows[i]} />
        </g>
      ))}
      <File {...doc} zip={s.zip} />
      <Dot x={doc.x} y={mid} />
      <Dot x={doc.x + doc.w} y={mid} />
      <text x={doc.x + doc.w / 2} y={doc.y + doc.h + 24} textAnchor="middle" fontSize={11.5} className="font-mono" fill="var(--ink)" letterSpacing="0.04em">
        {file}
      </text>
      {formats.map((format, j) => (
        <g key={format} style={{ opacity: s.format(j) }}>
          <Chip x={right.x} y={rows[j] - 13} w={right.w} h={26} text={format} dark={false} size={11.5} />
          <Dot x={right.x} y={rows[j]} />
        </g>
      ))}
    </svg>
  );
}

/** On a phone: top to bottom, three across. */
function Tall({ items, formats, file, label }: Words) {
  const s = useStage();
  const cols = [10, 120, 230];
  const chip = { w: 100, h: 28 };
  const doc = { x: 120, y: 100, w: 100, h: 160, fold: 20 };
  const mid = doc.x + doc.w / 2;
  const outTop = 322;
  return (
    <svg viewBox="0 0 340 360" className="block h-auto w-full" role="img" aria-label={label}>
      {cols.map((x) => (
        <Line key={`in${x}`} d={`M${x + chip.w / 2},${10 + chip.h} V70 H${mid} V${doc.y}`} drawn={s.inLines} />
      ))}
      {cols.map((x) => (
        <Line key={`out${x}`} d={`M${mid},${doc.y + doc.h} V292 H${x + chip.w / 2} V${outTop}`} drawn={s.outLines} />
      ))}
      {items.map((item, i) => (
        <g key={item}>
          <Chip x={cols[i]} y={10} w={chip.w} h={chip.h} text={item} dark size={12.5} />
          <Dot x={cols[i] + chip.w / 2} y={10 + chip.h} />
        </g>
      ))}
      <File {...doc} zip={s.zip} />
      <Dot x={mid} y={doc.y} />
      <Dot x={mid} y={doc.y + doc.h} />
      <text x={doc.x + doc.w + 10} y={doc.y + doc.h / 2 + 4} fontSize={11} className="font-mono" fill="var(--ink)" letterSpacing="0.02em">
        {file}
      </text>
      {formats.map((format, j) => (
        <g key={format} style={{ opacity: s.format(j) }}>
          <Chip x={cols[j]} y={outTop} w={chip.w} h={chip.h} text={format} dark={false} size={12.5} />
          <Dot x={cols[j] + chip.w / 2} y={outTop} />
        </g>
      ))}
    </svg>
  );
}
