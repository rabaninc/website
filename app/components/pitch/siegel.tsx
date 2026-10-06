"use client";

import { useEffect, useId, useRef } from "react";

import { Playback, useClock } from "../home/window/playback";

// PREVIEW (2026-10-06), variant B for the award on /about: a seal, the way a
// certificate or a banknote carries one. A guilloche rosette, woven from
// phase-shifted waves in ink hairlines, draws itself; around it a ring of
// ticks and a ring of mono text naming the win; in the middle the Raban mark
// lands like a stamp. Once drawn, the rings turn slowly as the page scrolls.
// It plays once (Playback), on opening the page when the seal opens it.

const LENGTH = 2400;

// The rosette, in units of the seal's radius: bands of closed waves, each
// band the same wave several times, shifted along itself, which is what
// weaves a guilloche. r(θ) = base + amp · sin(lobes · θ + shift).
type Band = {
  base: number;
  amp: number;
  lobes: number;
  copies: number;
  from: number;
  to: number;
};
const BANDS: Band[] = [
  // a rope: few waves, so their twist shows
  { base: 0.715, amp: 0.045, lobes: 40, copies: 4, from: 0, to: 1300 },
  // a fine lattice
  { base: 0.57, amp: 0.06, lobes: 26, copies: 11, from: 150, to: 1450 },
  // woven petals
  { base: 0.405, amp: 0.095, lobes: 10, copies: 8, from: 300, to: 1600 },
];
const STEPS = 1440;

// The ring of ticks, every 2.5°, a longer one every 15°, as one path in the
// seal's 1000-unit box; rounded, so the server and the browser write the same
// numbers (their sines differ in the last digit).
const TICKS = Array.from({ length: 144 }, (_, i) => {
  const a = (i / 144) * Math.PI * 2;
  const r0 = i % 6 === 0 ? 382 : 392;
  const at = (r: number) => `${(500 + r * Math.cos(a)).toFixed(1)} ${(500 + r * Math.sin(a)).toFixed(1)}`;
  return `M${at(r0)}L${at(404)}`;
}).join("");

const ease = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
const span = (t: number, from: number, to: number) => ease((t - from) / (to - from));

/** The rosette on its canvas, each band drawn as far as the clock `t` has got. */
function drawRosette(el: HTMLCanvasElement | null, t: number) {
  if (!el) return;
  const size = el.clientWidth;
  const dpr = Math.min(3, window.devicePixelRatio || 1);
  if (el.width !== Math.round(size * dpr)) {
    el.width = Math.round(size * dpr);
    el.height = Math.round(size * dpr);
  }
  const ctx = el.getContext("2d");
  if (!ctx) return;
  const r = (size / 2) * dpr;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, el.width, el.height);
  ctx.translate(r, r);
  ctx.strokeStyle = getComputedStyle(el).color;
  ctx.lineWidth = 0.6 * dpr;
  for (const b of BANDS) {
    const p = span(t, b.from, b.to);
    if (p <= 0) continue;
    const steps = Math.ceil(STEPS * p);
    for (let c = 0; c < b.copies; c++) {
      const shift = (c / b.copies) * Math.PI * 2;
      ctx.beginPath();
      for (let s = 0; s <= steps; s++) {
        const a = (s / STEPS) * Math.PI * 2 - Math.PI / 2;
        const rr = r * (b.base + b.amp * Math.sin(b.lobes * a + shift));
        const x = rr * Math.cos(a);
        const y = rr * Math.sin(a);
        if (s === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }
}

type Words = { ring: string; alt: string; opens?: boolean };

export function Siegel({ ring, alt, opens = false }: Words) {
  return (
    <div role="img" aria-label={alt} className="mx-auto w-full max-w-[520px]">
      <div aria-hidden>
        <Playback length={LENGTH} opens={opens} smooth>
          <Seal ring={ring} />
        </Playback>
      </div>
    </div>
  );
}

function Seal({ ring }: { ring: string }) {
  const t = useClock();
  const id = useId();
  const canvas = useRef<HTMLCanvasElement>(null);
  const turn = useRef<HTMLDivElement>(null);
  const clock = useRef(t);

  // The rosette, drawn as far as the clock has got, and again when the seal
  // changes size.
  useEffect(() => {
    clock.current = t;
    drawRosette(canvas.current, t);
  }, [t]);
  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const observer = new ResizeObserver(() => drawRosette(el, clock.current));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Once drawn, the rings turn with the scroll, a degree for every 25px.
  useEffect(() => {
    let frame = 0;
    const draw = () => {
      frame = 0;
      if (turn.current) turn.current.style.transform = `rotate(${(window.scrollY / 25) % 360}deg)`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    draw();
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      cancelAnimationFrame(frame);
    };
  }, []);

  const ticks = span(t, 500, 1500);
  const words = span(t, 1000, 1800);
  const stamp = span(t, 1750, 2050);
  const R = 500;
  const textR = 452;
  const around = 2 * Math.PI * textR;

  return (
    <div className="relative aspect-square w-full text-ink">
      <div ref={turn} className="absolute inset-0">
        <canvas ref={canvas} className="absolute inset-0 size-full" />
        <svg viewBox="0 0 1000 1000" className="absolute inset-0 size-full overflow-visible">
          <defs>
            <path
              id={`${id}-ring`}
              d={`M ${R} ${R - textR} a ${textR} ${textR} 0 1 1 0 ${2 * textR} a ${textR} ${textR} 0 1 1 0 ${-2 * textR}`}
            />
            <mask id={`${id}-ticks`}>
              <circle
                cx={R}
                cy={R}
                r={393}
                transform={`rotate(-90 ${R} ${R})`}
                fill="none"
                className="stroke-hero"
                strokeWidth={34}
                pathLength={1}
                strokeDasharray={`${ticks} 1`}
              />
            </mask>
          </defs>
          <circle
            cx={R}
            cy={R}
            r={496}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            vectorEffect="non-scaling-stroke"
          />
          <circle
            cx={R}
            cy={R}
            r={412}
            fill="none"
            stroke="currentColor"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
          <g mask={`url(#${id}-ticks)`} stroke="currentColor" vectorEffect="non-scaling-stroke">
            <path d={TICKS} fill="none" strokeWidth={1} vectorEffect="non-scaling-stroke" />
          </g>
          <g
            style={{
              opacity: words,
              transform: `rotate(${(1 - words) * -40}deg)`,
              transformOrigin: "50% 50%",
            }}
          >
            <text className="fill-current font-mono" fontSize={27} letterSpacing={2}>
              <textPath href={`#${id}-ring`} textLength={around - 2} lengthAdjust="spacing">
                {ring}
                {ring}
              </textPath>
            </text>
          </g>
        </svg>
      </div>
      {/* The mark stands upright while the rings turn. */}
      <svg
        viewBox="0 0 1000 1000"
        className="pointer-events-none absolute inset-0 size-full"
        style={{
          opacity: stamp,
          transform: `scale(${1.3 - 0.3 * stamp})`,
          transformOrigin: "50% 50%",
        }}
      >
        <rect x={400} y={400} width={200} height={200} rx={48} className="fill-ink" />
        <circle cx={400 + 200 * 0.72} cy={400 + 200 * 0.72} r={200 * 0.095} className="fill-paper" />
      </svg>
    </div>
  );
}
