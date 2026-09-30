// The app's icons, drawn the way the app draws them: lucide's 24-unit
// glyphs (ISC licence) at stroke 2 in currentColor, plus the app's own two
// (the magnifier with the longer handle, the tasks mark with two ticks and
// a box). Sized by the caller's class, so inside a window they scale with it.

type Shape =
  | ["path", string]
  | ["circle", number, number, number]
  | ["rect", number, number, number, number, number]
  | ["polyline", string];

const ICONS = {
  // The app's own magnifier (bausteine/Lupe.tsx): lucide's Search with a longer handle.
  search: [
    ["circle", 10.5, 10.5, 7.5],
    ["path", "m21.25 21.25-5.45-5.45"],
  ],
  // The app's own tasks mark (bausteine/AufgabenSymbol.tsx).
  tasks: [
    ["path", "m4 5 1.25 1.25 2.75-2.75"],
    ["path", "m4 12 1.25 1.25 2.75-2.75"],
    ["rect", 4, 17, 4, 4, 1],
    ["path", "M13 5h8"],
    ["path", "M13 12h8"],
    ["path", "M13 19h8"],
  ],
  home: [
    ["path", "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"],
    ["path", "M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"],
  ],
  inbox: [
    ["polyline", "22 12 16 12 14 15 10 15 8 12 2 12"],
    ["path", "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"],
  ],
  sparkles: [
    ["path", "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"],
    ["path", "M20 2v4"],
    ["path", "M22 4h-4"],
    ["circle", 4, 20, 2],
  ],
  message: [
    ["path", "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"],
  ],
  history: [
    ["path", "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"],
    ["path", "M3 3v5h5"],
    ["path", "M12 7v5l4 2"],
  ],
  panel: [
    ["rect", 3, 3, 18, 18, 2],
    ["path", "M9 3v18"],
  ],
  mic: [
    ["path", "M12 19v3"],
    ["path", "M19 10v2a7 7 0 0 1-14 0v-2"],
    ["rect", 9, 2, 6, 13, 3],
  ],
  camera: [
    ["path", "M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z"],
    ["circle", 12, 13, 3],
  ],
  paperclip: [
    ["path", "m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551"],
  ],
  keyboard: [
    ["path", "M10 8h.01"],
    ["path", "M12 12h.01"],
    ["path", "M14 8h.01"],
    ["path", "M16 12h.01"],
    ["path", "M18 8h.01"],
    ["path", "M6 8h.01"],
    ["path", "M7 16h10"],
    ["path", "M8 12h.01"],
    ["rect", 2, 4, 20, 16, 2],
  ],
  arrowUp: [
    ["path", "m5 12 7-7 7 7"],
    ["path", "M12 19V5"],
  ],
  check: [["path", "M20 6 9 17l-5-5"]],
  chevronDown: [["path", "m6 9 6 6 6-6"]],
  file: [
    ["path", "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"],
    ["path", "M14 2v5a1 1 0 0 0 1 1h5"],
    ["path", "M16 13H8"],
    ["path", "M16 17H8"],
  ],
  pause: [
    ["rect", 14, 3, 5, 18, 1],
    ["rect", 5, 3, 5, 18, 1],
  ],
  square: [["rect", 3, 3, 18, 18, 2]],
  // lucide's Database; its top ellipse written as two arcs.
  database: [
    ["path", "M3 5a9 3 0 1 0 18 0a9 3 0 1 0 -18 0"],
    ["path", "M3 5V19A9 3 0 0 0 21 19V5"],
    ["path", "M3 12A9 3 0 0 0 21 12"],
  ],
  book: [
    ["path", "M12 7v14"],
    ["path", "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"],
  ],
  printer: [
    ["path", "M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"],
    ["path", "M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"],
    ["rect", 6, 14, 12, 8, 1],
  ],
  mail: [
    ["path", "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"],
    ["rect", 2, 4, 20, 16, 2],
  ],
  plus: [
    ["path", "M5 12h14"],
    ["path", "M12 5v14"],
  ],
} satisfies Record<string, Shape[]>;

export type IconName = keyof typeof ICONS;

export function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={`shrink-0 ${className}`}
    >
      {(ICONS[name] as Shape[]).map((shape, i) => {
        switch (shape[0]) {
          case "path":
            return <path key={i} d={shape[1]} />;
          case "polyline":
            return <polyline key={i} points={shape[1]} />;
          case "circle":
            return <circle key={i} cx={shape[1]} cy={shape[2]} r={shape[3]} />;
          case "rect":
            return <rect key={i} x={shape[1]} y={shape[2]} width={shape[3]} height={shape[4]} rx={shape[5]} />;
        }
      })}
    </svg>
  );
}

/** Raban's face (bausteine/Raban.tsx in the app): two eyes, the nose's hook,
 *  the smile. */
export function RabanFace({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="18 21 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={5.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={`shrink-0 overflow-visible ${className}`}
    >
      <path d="M30 31 V42" />
      <path d="M70 31 V42" />
      <path d="M53 31 V52 Q53 57 48 57 H45" />
      <path d="M34 68 Q50 79 66 68" />
    </svg>
  );
}
