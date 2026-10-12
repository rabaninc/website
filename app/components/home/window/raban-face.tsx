"use client";

import { useEffect, useId, useRef } from "react";

import { useClock } from "./playback";
import { BALL, eyePaths, Motion, placement, stillPose, type Mood, type Pose } from "./raban-ball";

/** A scene's script for the face: from which millisecond which mood holds. */
export type FaceScript = [at: number, mood: Mood][];

/** The ball's light, brightest grey to darkest (`--app-face-light-*`), and
 *  where each sits between the brightest point and the circle around it. */
const FACE_LIGHT = ["0", ".2", ".4", ".6", ".8", "1"];

const matrix = (s: Pose) => `matrix(${placement(s).map((v) => v.toFixed(3)).join(" ")})`;

const moodAt = (script: FaceScript, t: number) =>
  script.reduce<Mood>((mood, [at, next]) => (t >= at ? next : mood), script[0][1]);

/** Raban's face (bausteine/Raban.tsx in the app): a white ball in a dark
 *  opening, two slanted eyes, no mouth — the icon Johannes drew; since
 *  2026-10-12 an open hole, no glass edge and no sheen ("more like an open
 *  hole"). With a `script` it moves like the app while its scene plays: it
 *  jumps in from the right, listens looking up to the top right, looks at you
 *  while it speaks and to the bottom left while it thinks. The server, reduced
 *  motion and a scene at rest show it still in the pose of his picture, the
 *  way Raban listens. Greys only, like the app. */
export function RabanFace({ className = "", script }: { className?: string; script?: FaceScript }) {
  const id = `raban${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const t = useClock();
  const svg = useRef<SVGSVGElement>(null);
  const last: Mood = script ? script[script.length - 1][1] : "rest";
  const playing = script !== undefined && Number.isFinite(t) && t > 0;
  // React draws two frames only: the finished one and, while the scene waits
  // or plays, the empty opening the ball jumps in from. While it plays, the
  // motion draws over that on every frame.
  const drawn = script === undefined || !Number.isFinite(t) ? stillPose(last) : stillPose("away");
  const eyes = eyePaths(drawn);
  const mood = useRef<Mood>(last);
  useEffect(() => {
    mood.current = playing && script ? moodAt(script, t) : last;
  });

  useEffect(() => {
    const el = svg.current;
    if (!playing || !el) return;
    const ball = el.querySelector("[data-ball]");
    const paths = el.querySelectorAll("[data-eye]");
    const draw = (s: Pose) => {
      ball?.setAttribute("transform", matrix(s));
      eyePaths(s).forEach(({ d, seen }, i) => {
        paths[i]?.setAttribute("d", d);
        paths[i]?.setAttribute("stroke-opacity", (0.85 * seen).toFixed(2));
      });
    };
    const motion = new Motion();
    let frame = requestAnimationFrame(function tick(ms) {
      draw(motion.step(mood.current, ms / 1000));
      frame = requestAnimationFrame(tick);
    });
    // The scene comes to rest: the face holds the pose its last mood settles into.
    return () => {
      cancelAnimationFrame(frame);
      draw(stillPose(last));
    };
  }, [playing, last]);

  return (
    <svg ref={svg} viewBox="0 0 100 100" aria-hidden className={`shrink-0 ${className}`}>
      <defs>
        <clipPath id={`${id}-window`}>
          <rect width="100" height="100" rx="25.5" />
        </clipPath>
        <clipPath id={`${id}-ball`}>
          <circle cx={BALL.x} cy={BALL.y} r={BALL.r} />
        </clipPath>
        <radialGradient id={`${id}-light`} gradientUnits="userSpaceOnUse" cx="63.75" cy="35.12" r="107.72" fx="62.34" fy="48.31">
          {FACE_LIGHT.map((offset, i) => (
            <stop key={offset} offset={offset} style={{ stopColor: `var(--app-face-light-${i})` }} />
          ))}
        </radialGradient>
        {/* The ball's bright rim, on its lit side only. */}
        <linearGradient id={`${id}-rim`} x1=".15" y1=".85" x2=".85" y2=".1">
          <stop offset="0" style={{ stopColor: "var(--app-face-white)", stopOpacity: 0 }} />
          <stop offset=".5" style={{ stopColor: "var(--app-face-white)", stopOpacity: 0.1 }} />
          <stop offset="1" style={{ stopColor: "var(--app-face-white)", stopOpacity: 0.95 }} />
        </linearGradient>
      </defs>
      <g clipPath={`url(#${id}-window)`}>
        <rect width="100" height="100" style={{ fill: "var(--app-face-window)" }} />
        <g data-ball transform={matrix(drawn)}>
          <circle cx={BALL.x} cy={BALL.y} r={BALL.r} fill={`url(#${id}-light)`} />
          <g clipPath={`url(#${id}-ball)`}>
            {eyes.map(({ d, seen }, i) => (
              <path
                key={i}
                data-eye
                d={d}
                strokeWidth={1}
                strokeOpacity={(0.85 * seen).toFixed(2)}
                strokeLinejoin="round"
                paintOrder="stroke"
                style={{ fill: "var(--app-face-eye)", stroke: "var(--app-face-white)" }}
              />
            ))}
          </g>
          <circle cx={BALL.x} cy={BALL.y} r={BALL.r - 0.3} fill="none" stroke={`url(#${id}-rim)`} strokeWidth={0.7} />
        </g>
      </g>
    </svg>
  );
}
