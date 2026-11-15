"use client";

import { useEffect, useRef, useState } from "react";

import { useClock } from "./playback";
import { ANZAHL, Lauf, silben, stillbild, type Art, type Bild, type Form } from "./raban-punkte";

/** A scene's script for the sign: from which millisecond which form holds. */
export type SignScript = [at: number, form: Form][];

/** The kind the app shows (`ART` in its RabanZeichen.tsx): eight dots on a ring. */
const KIND: Art = "kranz";

const formAt = (script: SignScript, t: number) =>
  script.reduce<Form>((form, [at, next]) => (t >= at ? next : form), script[0][1]);

const n = (v: number) => v.toFixed(4);

/** Raban's sign (bausteine/RabanZeichen.tsx in the app, Johannes, 2026-11-14):
 *  eight round dots on a ring in the colour of the text. No tile, no face, no
 *  glow, one colour. It replaces the white ball with two eyes, which was too
 *  close to a figure a bigger company uses. What Raban does shows in the dots:
 *  an open ring listens (`hoert`), two squares turning against each other
 *  think (`denkt`), one dot in the middle with seven around it speaks
 *  (`spricht`). The maths is the app's own, copied (./raban-punkte.ts).
 *  While its scene plays the sign opens out of one dot and moves from form to
 *  form as in the app; `talking` lets the ring go with a voice while it
 *  listens. When the scene ends it holds still where it stands. The server,
 *  reduced motion and a scene already in view show the last form as a still
 *  picture. */
export function RabanSign({
  className = "",
  script,
  talking = false,
}: {
  className?: string;
  script: SignScript;
  talking?: boolean;
}) {
  const t = useClock();
  const dots = useRef<SVGGElement>(null);
  const last = script[script.length - 1][1];
  const phase = !Number.isFinite(t) ? "rest" : t > 0 ? "play" : "wait";
  // The markup carries the finished picture; from then on only the effect
  // below draws, so nothing jumps when React renders again.
  const [first] = useState<Bild>(() => stillbild(KIND, last));
  const form = useRef<Form>(last);
  useEffect(() => {
    form.current = phase === "play" ? formAt(script, t) : last;
  });

  useEffect(() => {
    const g = dots.current;
    if (!g || phase === "rest") return;
    const circles = g.querySelectorAll("circle");
    const draw = (picture: Bild) => {
      g.setAttribute("opacity", picture.deckkraft.toFixed(3));
      picture.punkte.forEach((p, i) => {
        circles[i]?.setAttribute("cx", n(p.x));
        circles[i]?.setAttribute("cy", n(p.y));
        circles[i]?.setAttribute("r", n(p.r));
      });
    };
    // Wound back, out of sight: the one dot the scene opens from.
    draw(stillbild(KIND, "aus"));
    if (phase === "wait") return;
    const run = new Lauf(KIND, "aus");
    let drawn = Number.NEGATIVE_INFINITY;
    let frame = requestAnimationFrame(function tick(ms) {
      const s = ms / 1000;
      draw(run.schritt(form.current, s, { mikrofon: talking ? silben(s) : 0 }));
      drawn = performance.now();
      frame = requestAnimationFrame(tick);
    });
    // The scene comes to rest: the sign stays as it was last drawn. Where the
    // browser held the frames back (a tab in the background), it would stand
    // half-way, so there it takes the still picture of its last form.
    return () => {
      cancelAnimationFrame(frame);
      if (performance.now() - drawn > 250) draw(stillbild(KIND, last));
    };
  }, [phase, talking, last]);

  return (
    <svg viewBox="-1 -1 2 2" aria-hidden className={`block shrink-0 overflow-visible text-app-ink ${className}`}>
      {/* The outline is as wide on screen at any size, so small dots come out stronger, as in the app. */}
      <g
        ref={dots}
        fill="currentColor"
        stroke="currentColor"
        strokeWidth={0.6}
        opacity={first.deckkraft.toFixed(3)}
      >
        {Array.from({ length: ANZAHL[KIND] }, (_, i) => (
          <circle
            key={i}
            vectorEffect="non-scaling-stroke"
            cx={n(first.punkte[i].x)}
            cy={n(first.punkte[i].y)}
            r={n(first.punkte[i].r)}
          />
        ))}
      </g>
    </svg>
  );
}
