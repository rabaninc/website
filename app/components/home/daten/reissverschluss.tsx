"use client";

import { usePinProgress } from "./pin";

// "Eure Daten" (Johannes, 2026-10-04): a zipper drawn in ink hairlines across
// the section. Its slider runs from left to right and closes it; what Raban
// holds (tasks, answers, documents) shows above it as the slider passes, and
// the slider carries a "ZIP" tag like the site's panel tags. The scroll moves
// the slider while the section holds the screen, the first time only
// (pin.tsx); the server, reduced motion and a section already on screen show
// it closed. (A zipper that played once by itself and one that followed the
// scroll without holding were tried on the preview the same day; Johannes
// picked this one.)

type Words = { items: readonly string[]; label: string };

/** Closed by the scroll while its section holds the screen, once (`PinOnce`). */
export function PinnedZipper(words: Words) {
  return <Drawings progress={usePinProgress()} {...words} />;
}

// On a phone the chain runs further right: closed, the slider's tag (4.8 type
// sizes past the chain's end) meets the column's right edge (Johannes,
// 2026-10-04: "on phone, the zipper can extend a bit further to the right").
function Drawings({ progress, items, label }: Words & { progress: number }) {
  return (
    <>
      <div className="hidden md:block">
        <Drawing width={1200} teeth={58} type={11} room={9} progress={progress} items={items} label={label} />
      </div>
      <div className="md:hidden">
        <Drawing width={600} teeth={28} type={19} room={4.8} progress={progress} items={items} label={label} />
      </div>
    </>
  );
}

function Drawing({
  width: W,
  teeth: n,
  type: fs,
  room,
  progress,
  items,
  label,
}: Words & {
  width: number;
  teeth: number;
  type: number;
  /** The space right of the chain, in type sizes. */
  room: number;
  progress: number;
}) {
  const H = fs * 12;
  const cy = H - fs * 3.4;
  const x0 = 4;
  const x1 = W - fs * room;
  const pitch = (x1 - x0) / n;
  const tooth = pitch * 0.42;
  const slider = x0 + fs * 2 + (x1 - x0 - fs * 2) * progress;
  // How far the two halves stand apart at x: closed behind the slider, opening
  // in a V ahead of it.
  const open = (x: number) => {
    const at = Math.min(x, x1);
    return at <= slider ? 0 : Math.min(fs * 2.4, (at - slider) * 0.16);
  };

  const inner = fs * 1.1; // half the closed chain's height
  const tape = fs * 1.1;
  const edge = (x: number, side: 1 | -1, depth: number) => `${x.toFixed(1)},${(cy + side * (depth + open(x))).toFixed(1)}`;
  const xs = Array.from({ length: n * 2 + 1 }, (_, i) => x0 + (i * pitch) / 2).concat(x1 + fs);
  const tapePath = (side: 1 | -1) =>
    `M${xs.map((x) => edge(x, side, inner)).join(" L")} L${[...xs].reverse().map((x) => edge(x, side, inner + tape)).join(" L")} Z`;

  const tagWidth = fs * 3.3;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full overflow-visible" role="img" aria-label={label}>
      <path d={tapePath(-1)} fill="none" stroke="var(--ink)" strokeWidth={1} />
      <path d={tapePath(1)} fill="none" stroke="var(--ink)" strokeWidth={1} />

      {Array.from({ length: n }, (_, i) => {
        const top = x0 + i * pitch + pitch / 4;
        const bottom = top + pitch / 2;
        return (
          <g key={i} fill="var(--ink)">
            <rect x={top - tooth / 2} y={cy - inner - open(top)} width={tooth} height={inner * 1.25} />
            <rect x={bottom - tooth / 2} y={cy - inner * 0.25 + open(bottom)} width={tooth} height={inner * 1.25} />
          </g>
        );
      })}

      {items.map((item, i) => {
        const x = x0 + ((i + 0.5) * (x1 - x0)) / items.length;
        const top = cy - inner - tape - open(x);
        return (
          <g key={item} className="transition-opacity duration-500" style={{ opacity: slider >= x ? 1 : 0 }}>
            <text x={x} y={fs * 1.6} textAnchor="middle" fontSize={fs} className="font-mono" fill="var(--ink)" letterSpacing="0.04em">
              {item}
            </text>
            <line x1={x} x2={x} y1={fs * 2.4} y2={top - fs * 0.5} stroke="var(--ink)" strokeWidth={1} />
            <rect x={x - fs * 0.22} y={top - fs * 0.5} width={fs * 0.44} height={fs * 0.44} fill="var(--ink)" />
          </g>
        );
      })}

      <g transform={`translate(${slider.toFixed(1)} ${cy})`}>
        <rect x={-fs * 1.5} y={-fs * 1.55} width={fs * 3} height={fs * 3.1} rx={fs * 0.5} fill="var(--ink)" />
        <rect x={fs * 1.5} y={-fs * 0.85} width={tagWidth} height={fs * 1.7} fill="var(--ink)" />
        <text x={fs * 1.5 + tagWidth / 2} y={fs * 0.38} textAnchor="middle" fontSize={fs} className="font-mono" fill="var(--paper)" letterSpacing="0.04em">
          ZIP
        </text>
      </g>
    </svg>
  );
}
