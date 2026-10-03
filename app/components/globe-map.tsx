"use client";

import { useEffect, useRef, useState } from "react";
import { ComposableMap, Geographies, Geography, Graticule, Marker, Sphere } from "react-simple-maps";
import worldAtlas from "world-atlas/countries-110m.json";
const NORTH_POLE: [number, number, number] = [0, -90, 0];
const PROJECTION_SCALE = 400;
const DURATION = 1800;
const START_SCALE = 0.5;
const TYPE_CHAR_MS = 80;

let hasAnimatedOnce = false;

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Breakpoints/scales must match the section height & margins in
// app/(public)/page.tsx (section height = 100vw * scale; its negative bottom
// margin is 25% of that); a mismatch leaves a gap above the footer or lets the
// chapters overlap the visible part of the globe.
function getEndScale() {
  if (typeof window === "undefined") return 1;
  const w = window.innerWidth;
  if (w < 768) return 2.5;
  if (w < 1024) return 1.75;
  return 1;
}

// For a visitor the point and label are their country, not their city, named in
// the page's language (see utils/visitor-geo.ts, which also holds the fallback).
export type Geo = { lat: number; lng: number; label: string | null };

export function GlobeMap({ lat, lng, label }: Geo) {
  const [rotate, setRotate] = useState<[number, number, number]>(() =>
    hasAnimatedOnce ? [-lng, -lat, 0] : NORTH_POLE,
  );
  const [scale, setScale] = useState(() => (hasAnimatedOnce ? getEndScale() : START_SCALE));
  const [showMarker, setShowMarker] = useState(() => hasAnimatedOnce);
  const [markerOpacity, setMarkerOpacity] = useState(1);
  const [typedLabel, setTypedLabel] = useState("");
  const rafRef = useRef<number | null>(null);
  const endScaleRef = useRef<number>(1);
  const animationDoneRef = useRef(false);

  useEffect(() => {
    endScaleRef.current = getEndScale();
    function onResize() {
      const next = getEndScale();
      if (next === endScaleRef.current) return;
      endScaleRef.current = next;
      if (animationDoneRef.current) {
        setScale(next);
      }
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const blinkTimers: ReturnType<typeof setTimeout>[] = [];

    // Schedules the arrival sequence: a marker blink and the label typing out.
    // Only async timers here — never a synchronous setState in the effect body.
    function scheduleArrival() {
      animationDoneRef.current = true;
      blinkTimers.push(setTimeout(() => setMarkerOpacity(0), 180));
      blinkTimers.push(setTimeout(() => setMarkerOpacity(1), 360));
      if (label) {
        const typeStart = 360;
        for (let i = 1; i <= label.length; i++) {
          blinkTimers.push(
            setTimeout(() => setTypedLabel(label.slice(0, i)), typeStart + i * TYPE_CHAR_MS),
          );
        }
      }
    }

    // Already animated this session: rotate/scale/showMarker are seeded to the
    // end state by the lazy useState initializers, so just replay the arrival.
    if (hasAnimatedOnce) {
      scheduleArrival();
      return () => blinkTimers.forEach(clearTimeout);
    }

    const endRotate: [number, number, number] = [-lng, -lat, 0];
    const animEndScale = endScaleRef.current;
    let startTime: number | null = null;

    function step(ts: number) {
      if (startTime === null) startTime = ts;
      const t = Math.min((ts - startTime) / DURATION, 1);
      const e = easeInOutCubic(t);

      setScale(START_SCALE + (animEndScale - START_SCALE) * e);
      setRotate([
        NORTH_POLE[0] + (endRotate[0] - NORTH_POLE[0]) * e,
        NORTH_POLE[1] + (endRotate[1] - NORTH_POLE[1]) * e,
        0,
      ]);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setScale(endScaleRef.current);
        hasAnimatedOnce = true;
        setShowMarker(true);
        scheduleArrival();
      }
    }

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      blinkTimers.forEach(clearTimeout);
    };
  }, [lat, lng, label]);

  return (
    <div style={{ width: "100vw", height: "100vw", transform: `scale(${scale})` }}>
      <ComposableMap
        width={800}
        height={800}
        projection="geoOrthographic"
        projectionConfig={{ scale: PROJECTION_SCALE, rotate }}
        style={{ width: "100%", height: "100%" }}
      >
        {/* Center-to-limb depth grade, in neutral grey (no hue — see the design
           language). userSpaceOnUse so the gradient spans the whole globe (cx/cy
           = viewBox center, r = PROJECTION_SCALE = sphere radius) rather than
           each country's own bounding box. Deeper at the near face, fading to
           nearly paper at the horizon so the globe dissolves into the page. Each
           stop keeps its original distance below the paper white, so the dissolve
           reads the same as it did on the old warm paper — and the dark arm of
           each token keeps that same distance ABOVE the dark paper, so the globe
           dissolves at the same rate in either theme (see app/globals.css).
           The stops go through `style`, not the stopColor attribute: a CSS var
           in an SVG presentation attribute isn't substituted, in a declaration
           it is. */}
        <defs>
          <radialGradient id="globeGrade" cx="400" cy="400" r="400" gradientUnits="userSpaceOnUse">
            <stop offset="0%" style={{ stopColor: "var(--globe-near)" }} />
            <stop offset="100%" style={{ stopColor: "var(--globe-far)" }} />
          </radialGradient>
          <radialGradient id="globeGradeFaint" cx="400" cy="400" r="400" gradientUnits="userSpaceOnUse">
            <stop offset="0%" style={{ stopColor: "var(--globe-faint-near)" }} />
            <stop offset="100%" style={{ stopColor: "var(--globe-faint-far)" }} />
          </radialGradient>
        </defs>
        <Sphere id="sphere" fill="none" stroke="url(#globeGradeFaint)" strokeWidth={0.5} />
        <Graticule stroke="url(#globeGradeFaint)" strokeWidth={0.3} />
        <Geographies geography={worldAtlas}>
          {({ geographies }: { geographies: unknown[] }) =>
            (geographies as { rsmKey: string }[]).map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="none"
                stroke="url(#globeGrade)"
                strokeWidth={0.6}
                style={{ default: { outline: "none" }, hover: { outline: "none" }, pressed: { outline: "none" } }}
              />
            ))
          }
        </Geographies>
        {showMarker && (
          <Marker coordinates={[lng, lat]}>
            <circle r={1.8} style={{ fill: "var(--globe-marker)" }} opacity={markerOpacity} />
            {typedLabel && (
              <text
                x={4}
                y={0}
                dominantBaseline="central"
                style={{ fill: "var(--globe-marker)" }}
                fontSize={6}
                fontFamily="inherit"
                fontWeight={570}
              >
                {typedLabel}
              </text>
            )}
          </Marker>
        )}
      </ComposableMap>
    </div>
  );
}
