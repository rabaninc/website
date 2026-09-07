import type { Locale } from "@/utils/locale";

// "So funktioniert Raban" from the pitch deck (Raban Pitch v2, slide 5): the
// expert talks, shows and writes into an AI layer, knowledge lands in the base
// in the middle, and the same AI answers everyone else. Geometry carried over
// from the deck unchanged; colours mapped to the site's tokens (ink lines,
// red-600 blocks, white kept on the accent via on-accent). English is the
// deck's original wording.
//
// Two layouts, switched at the lg breakpoint: the deck's wide slide, read
// left to right, and a narrow one for phones and tablets that is the slide
// transposed — the same flow top to bottom: expert, the three input pills in
// a row, the AI layer, the base, the AI layer again, and the three readers in
// columns with their channels fanned out above them. Every element keeps the
// slide's size and every connector the slide's construction; see Narrow.
const T = {
  de: {
    aria: "Ablauf: Ein Experte spricht, zeigt und schreibt in eine KI-Schicht, das Wissen landet in der Wissensbasis, und dieselbe KI-Schicht antwortet Azubi, Kollegen und HR",
    aiLayer: "KI-Schicht",
    expert: "Experte",
    speech: "Sprache",
    image: "Bild",
    text: "Text",
    azubi: "Azubi",
    peer: "Kollegin",
    hr: "HR",
  },
  en: {
    aria: "Flow: an expert speaks, shows and writes into an AI layer, knowledge lands in the database, and the AI layer answers a trainee, a colleague and HR",
    aiLayer: "AI layer",
    expert: "Expert",
    speech: "Speech",
    image: "Image",
    text: "Text",
    azubi: "Azubi",
    peer: "Peer",
    hr: "HR",
  },
} as const;

const WIDE = "chart hidden w-full lg:block";
const NARROW = "chart mx-auto w-full max-w-[40rem] lg:hidden";

type Icon = "speech" | "image" | "text";

// The reusable symbols. Ids carry a per-layout suffix: two SVGs on one page
// must not share ids, or every <use> resolves into the hidden one.
function Defs({ sfx }: { sfx: string }) {
  return (
    <defs>
      <g id={`pf-ic-speech-${sfx}`} fill="none" className="stroke-ink" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" x2="12" y1="19" y2="22" />
      </g>
      <g id={`pf-ic-image-${sfx}`} fill="none" className="stroke-ink" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
      </g>
      <g id={`pf-ic-text-${sfx}`} fill="none" className="stroke-ink" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="4 7 4 4 20 4 20 7" />
        <line x1="9" x2="15" y1="20" y2="20" />
        <line x1="12" x2="12" y1="4" y2="20" />
      </g>
      <g id={`pf-person-${sfx}`} className="fill-red-600">
        <circle cx="0" cy="-33" r="32" />
        <path d="M -38 65 Q -56 65 -56 47 A 56 44 0 0 1 56 47 Q 56 65 38 65 Z" />
      </g>
    </defs>
  );
}

// A person with their label on the body, centred on (x, y).
function Person({ x, y, label, sfx }: { x: number; y: number; label: string; sfx: string }) {
  return (
    <>
      <use href={`#pf-person-${sfx}`} transform={`translate(${x} ${y}) scale(1.1)`} />
      <text className="fill-on-accent" x={x} y={y + 57} textAnchor="middle" fontSize="18">
        {label}
      </text>
    </>
  );
}

// An input pill (180 × 56) with its icon and label, at top-left (x, y).
function Pill({ x, y, icon, label, sfx }: { x: number; y: number; icon: Icon; label: string; sfx: string }) {
  const dx = icon === "speech" ? 18 : 20;
  return (
    <>
      <rect x={x} y={y} width="180" height="56" rx="28" className="stroke-ink" fill="none" strokeWidth="2" />
      <use href={`#pf-ic-${icon}-${sfx}`} transform={`translate(${x + dx} ${y + 13.6}) scale(1.2)`} />
      <text className="fill-ink" x={x + dx + 39.5} y={y + 28} dominantBaseline="central" fontSize="24">
        {label}
      </text>
    </>
  );
}

// An outbound channel: the icon in a 26-radius ring, centred on (cx, cy).
function Channel({ cx, cy, icon, sfx }: { cx: number; cy: number; icon: Icon; sfx: string }) {
  return (
    <>
      <circle cx={cx} cy={cy} r="26" className="stroke-ink" fill="none" strokeWidth="2" />
      <use href={`#pf-ic-${icon}-${sfx}`} transform={`translate(${cx - 14.4} ${cy - 14.4}) scale(1.2)`} />
    </>
  );
}

// The knowledge base: twelve blocks in a 4 × 4 grid with the corners empty,
// two of them lit, at top-left (x, y). 218 units square.
const BASE_BLOCKS = [
  [0, 58], [0, 116],
  [58, 0], [58, 58], [58, 116], [58, 174],
  [116, 0], [116, 58], [116, 116], [116, 174],
  [174, 58], [174, 116],
] as const;

function Base({ x, y }: { x: number; y: number }) {
  return (
    <>
      <g className="fill-red-600">
        {BASE_BLOCKS.map(([bx, by]) => (
          <rect key={`${bx}-${by}`} x={x + bx} y={y + by} width="44" height="44" rx="8" />
        ))}
      </g>
      <circle cx={x + 31} cy={y + 147} r="5.5" className="fill-on-accent" />
      <circle cx={x + 205} cy={y + 89} r="5.5" className="fill-on-accent" />
    </>
  );
}

const LINES = { className: "stroke-ink", fill: "none", strokeWidth: 2, strokeLinecap: "round" } as const;
const DASHED = { className: "stroke-ink/40", fill: "none", strokeWidth: 2, strokeDasharray: "10 12", strokeLinecap: "round" } as const;

// Both viewBoxes are cut to the ink, four units past the outermost stroke
// and glyph — not to the slide frame — so the drawing keeps exactly the
// card's --gutter to its edge, the buffer the lights have (window-card.tsx).
function Wide({ t, className }: { t: (typeof T)[Locale]; className: string }) {
  const sfx = "w";
  return (
    <svg viewBox="84 -49 1512 597" className={`${WIDE} ${className}`} role="img" aria-label={t.aria}>
      <Defs sfx={sfx} />
      {/* connector lines, expert side */}
      <g {...LINES}>
        <path d="M 216 300 L 253 300 Q 285 300 291.4 268.6 L 323.6 109.4 Q 330 78 362 78 L 378.5 78" />
        <line x1="216" y1="300" x2="378.5" y2="300" />
        <path d="M 216 300 L 253 300 Q 285 300 292.4 331.1 L 322.6 458.9 Q 330 490 362 490 L 378.5 490" />
        <path d="M 558.5 78 L 580 78 Q 612 78 617.6 109.5 L 651.4 297.5 Q 657 329 689 329 L 723 329" />
        <path d="M 558.5 300 L 588 300 Q 612 300 634.5 314.5 Q 657 329 681 329 L 723 329" />
        <path d="M 558.5 490 L 580 490 Q 612 490 620.6 459.2 L 648.4 359.8 Q 657 329 689 329 L 723 329" />
        {/* connector lines, reader side */}
        <path d="M 957 271 L 990 271 Q 1022 271 1029.8 240 L 1048.6 165.2 Q 1055 140 1081 140 L 1090 140" />
        <path d="M 1090 140 Q 1114 140 1118.9 116.5 L 1122.5 99.5 Q 1127.4 76 1151.4 76 L 1185.5 76" />
        <line x1="1090" y1="140" x2="1185.5" y2="140" />
        <path d="M 1090 140 Q 1114 140 1118.9 163.5 L 1122.5 180.5 Q 1127.4 204 1151.4 204 L 1185.5 204" />
        <path d="M 1237.5 76 L 1268.6 76 Q 1292.6 76 1297.5 99.5 L 1301.1 116.5 Q 1306 140 1330 140" />
        <path d="M 1237.5 204 L 1268.6 204 Q 1292.6 204 1297.5 180.5 L 1301.1 163.5 Q 1306 140 1330 140" />
        <path d="M 957 271 L 991 271 Q 1015 271 1034.3 285.5 Q 1053.5 300 1077.5 300 L 1185.5 300" />
        <path d="M 957 271 L 990 271 Q 1022 271 1027.5 302.5 L 1050.5 434.4 Q 1055 460 1081 460 L 1090 460" />
        <path d="M 1090 460 L 1099 460 Q 1114 460 1117.4 444 Q 1120.7 428 1135.7 428 L 1185.5 428" />
        <path d="M 1090 460 L 1099 460 Q 1114 460 1117.4 476 Q 1120.7 492 1135.7 492 L 1185.5 492" />
        <path d="M 1237.5 428 L 1284.3 428 Q 1299.3 428 1302.6 444 Q 1306 460 1321 460 L 1330 460" />
        <path d="M 1237.5 492 L 1284.3 492 Q 1299.3 492 1302.6 476 Q 1306 460 1321 460 L 1330 460" />
        <line x1="1237.5" y1="140" x2="1330" y2="140" />
        <line x1="1330" y1="140" x2="1464" y2="140" />
        <line x1="1237.5" y1="300" x2="1464" y2="300" />
        <line x1="1330" y1="460" x2="1464" y2="460" />
      </g>
      <Person x={150} y={300} label={t.expert} sfx={sfx} />
      {/* the two AI layers: dashed guides plus a brace with its label */}
      <g {...DASHED}>
        <path d="M 570 34 L 570 524 Q 570 544 590 544 L 700 544 Q 720 544 720 524 L 720 34" />
        <path d="M 960 34 L 960 524 Q 960 544 980 544 L 1090 544 Q 1110 544 1110 524 L 1110 34" />
      </g>
      <g {...LINES}>
        <path d="M 570 34 C 570 20 578 20 592 20 L 632 20 C 641 20 645 16 645 4 C 645 16 650 20 659 20 L 698 20 C 712 20 720 20 720 34" />
        <path d="M 960 34 C 960 20 968 20 982 20 L 1022 20 C 1031 20 1035 16 1035 4 C 1035 16 1040 20 1049 20 L 1088 20 C 1102 20 1110 20 1110 34" />
      </g>
      <text className="fill-ink" x="645" y="-20" textAnchor="middle" fontSize="28">
        {t.aiLayer}
      </text>
      <text className="fill-ink" x="1035" y="-20" textAnchor="middle" fontSize="28">
        {t.aiLayer}
      </text>
      <Pill x={378.5} y={50} icon="speech" label={t.speech} sfx={sfx} />
      <Pill x={378.5} y={272} icon="image" label={t.image} sfx={sfx} />
      <Pill x={378.5} y={462} icon="text" label={t.text} sfx={sfx} />
      <Base x={731} y={191} />
      <Channel cx={1211.5} cy={76} icon="speech" sfx={sfx} />
      <Channel cx={1211.5} cy={140} icon="image" sfx={sfx} />
      <Channel cx={1211.5} cy={204} icon="text" sfx={sfx} />
      <Channel cx={1211.5} cy={300} icon="image" sfx={sfx} />
      <Channel cx={1211.5} cy={428} icon="image" sfx={sfx} />
      <Channel cx={1211.5} cy={492} icon="text" sfx={sfx} />
      <Person x={1530} y={140} label={t.azubi} sfx={sfx} />
      <Person x={1530} y={300} label={t.peer} sfx={sfx} />
      <Person x={1530} y={460} label={t.hr} sfx={sfx} />
    </svg>
  );
}

// The slide's connector, turned for the vertical run: a straight stub out of
// (x0, y0), one diagonal, a straight stub into (x1, y1), the two corners
// rounded with quadratic curves that leave the corner point r along each leg
// — the construction every connector on the slide uses (e.g. "L 253 300
// Q 285 300 291.4 268.6": corner at 285, curve ends 32 along the diagonal).
// `a` is the run from the start to the first corner, `b` from the second
// corner to the end.
function bend(x0: number, y0: number, a: number, x1: number, y1: number, b: number, r: number) {
  const c1y = y0 + a;
  const c2y = y1 - b;
  const dx = x1 - x0;
  const dy = c2y - c1y;
  const len = Math.hypot(dx, dy);
  const ux = (dx / len) * r;
  const uy = (dy / len) * r;
  const f = (n: number) => Math.round(n * 10) / 10;
  return [
    `M ${x0} ${y0} L ${x0} ${f(c1y - r)}`,
    `Q ${x0} ${f(c1y)} ${f(x0 + ux)} ${f(c1y + uy)}`,
    `L ${f(x1 - ux)} ${f(c2y - uy)}`,
    `Q ${x1} ${f(c2y)} ${x1} ${f(c2y + r)}`,
    `L ${x1} ${y1}`,
  ].join(" ");
}

// The vertical run, the slide transposed: left-to-right becomes top-to-bottom,
// top-to-bottom becomes left-to-right. Three columns at x = 110 / 300 / 490.
// Every distance along a connector is the slide's own — stubs, corner radii,
// where the three inputs merge inside the AI layer, where the readers'
// channels fan out and merge back — only the axis has turned. The one thing
// that cannot turn is the AI layer's label: the slide's bracket opens away
// from the flow with its brace and label beside it, and beside a horizontal
// band there is no room for a horizontal word. So here the layer is a closed
// dashed box, 150 deep like the slide's bracket, with the word inside it,
// set in the corner its connectors leave free.
//
// The base is not turned, so its two lit blocks keep their places — lower
// left and upper right — and the lines meet them the way the slide's do:
// on the slide the merged input runs into the lit block on the base's left
// face and the output leaves the lit block on its right face. Here the
// input comes down into the upper-right lit block through the base's empty
// corner above it (x 358, the block's centre), and the output leaves the
// lower-left lit block downward through the empty corner below it (x 184).
// (History, 2026-09-07: both ran on the middle column, x 300, into and out
// of unlit blocks; the founders asked for the slide's lit ones.)
function Narrow({ t, className }: { t: (typeof T)[Locale]; className: string }) {
  const sfx = "n";
  return (
    <svg viewBox="16 4 568 1425" className={`${NARROW} ${className}`} role="img" aria-label={t.aria}>
      <Defs sfx={sfx} />
      <g {...LINES}>
        {/* expert → pills: the slide's fan (stub 69 to the corner, 48.5 after) */}
        <line x1="300" y1="146" x2="300" y2="300" />
        <path d={bend(300, 146, 69, 110, 300, 48.5, 32)} />
        <path d={bend(300, 146, 69, 490, 300, 48.5, 32)} />
        {/* pills → base: all three bend onto the lit block's column (x 358)
            and merge inside the AI layer — the outer two with the slide's
            corner 53.5 past the pill, the middle one with a shorter 40 since
            it has only 58 to travel — merged 34 before the layer's far edge,
            then one line runs on to 8 above the block's top face (590) */}
        <path d={bend(300, 356, 40, 358, 590, 138, 32)} />
        <path d={bend(110, 356, 53.5, 358, 590, 138, 32)} />
        <path d={bend(490, 356, 53.5, 358, 590, 138, 32)} />
        {/* base → readers: one line out of the lit block's bottom face (8
            below it, x 184), fanning inside the second AI layer at the same
            corner as before (y 831, split 35 before the far edge) to the
            three columns — the middle one is a bend now too */}
        <path d={bend(184, 708, 123, 300, 1008.5, 130.5, 32)} />
        <path d={bend(184, 708, 123, 110, 913, 35, 32)} />
        <path d={bend(184, 708, 123, 490, 913, 35, 32)} />
        {/* the trainee's three channels: fan out, merge back — the slide's
            "M 1090 140 Q 1114 140 1118.9 116.5 …" and its return, transposed */}
        <path d="M 110 913 Q 110 937 86.5 941.9 L 69.5 945.5 Q 46 950.4 46 974.4 L 46 1008.5" />
        <line x1="110" y1="913" x2="110" y2="1008.5" />
        <path d="M 110 913 Q 110 937 133.5 941.9 L 150.5 945.5 Q 174 950.4 174 974.4 L 174 1008.5" />
        <path d="M 46 1060.5 L 46 1091.6 Q 46 1115.6 69.5 1120.5 L 86.5 1124.1 Q 110 1129 110 1153" />
        <line x1="110" y1="1060.5" x2="110" y2="1153" />
        <path d="M 174 1060.5 L 174 1091.6 Q 174 1115.6 150.5 1120.5 L 133.5 1124.1 Q 110 1129 110 1153" />
        <line x1="110" y1="1153" x2="110" y2="1287" />
        {/* the colleague's one channel sits on the line */}
        <line x1="300" y1="1060.5" x2="300" y2="1287" />
        {/* HR's two channels: the slide's short S-steps, ±32 off the line */}
        <path d="M 490 913 L 490 922 Q 490 937 474 940.4 Q 458 943.7 458 958.7 L 458 1008.5" />
        <path d="M 490 913 L 490 922 Q 490 937 506 940.4 Q 522 943.7 522 958.7 L 522 1008.5" />
        <path d="M 458 1060.5 L 458 1107.3 Q 458 1122.3 474 1125.6 Q 490 1129 490 1144 L 490 1153" />
        <path d="M 522 1060.5 L 522 1107.3 Q 522 1122.3 506 1125.6 Q 490 1129 490 1144 L 490 1153" />
        <line x1="490" y1="1153" x2="490" y2="1287" />
      </g>
      <Person x={300} y={80} label={t.expert} sfx={sfx} />
      <Pill x={20} y={300} icon="speech" label={t.speech} sfx={sfx} />
      <Pill x={210} y={300} icon="image" label={t.image} sfx={sfx} />
      <Pill x={400} y={300} icon="text" label={t.text} sfx={sfx} />
      {/* the two AI layers, each labelled in the corner its lines leave free:
          lower left in the first (the merge sits right of centre), upper
          right in the second (the fan starts left of centre) */}
      <g {...DASHED}>
        <rect x="40" y="368" width="520" height="150" rx="20" />
        <rect x="40" y="780" width="520" height="150" rx="20" />
      </g>
      <text className="fill-ink" x="60" y="500" fontSize="28">
        {t.aiLayer}
      </text>
      <text className="fill-ink" x="540" y="830" fontSize="28" textAnchor="end">
        {t.aiLayer}
      </text>
      {/* the base, centred under the column; the lines meet its two lit
          blocks (see the note above Narrow) */}
      <Base x={162} y={540} />
      <Channel cx={46} cy={1034.5} icon="speech" sfx={sfx} />
      <Channel cx={110} cy={1034.5} icon="image" sfx={sfx} />
      <Channel cx={174} cy={1034.5} icon="text" sfx={sfx} />
      <Channel cx={300} cy={1034.5} icon="image" sfx={sfx} />
      <Channel cx={458} cy={1034.5} icon="image" sfx={sfx} />
      <Channel cx={522} cy={1034.5} icon="text" sfx={sfx} />
      <Person x={110} y={1353} label={t.azubi} sfx={sfx} />
      <Person x={300} y={1353} label={t.peer} sfx={sfx} />
      <Person x={490} y={1353} label={t.hr} sfx={sfx} />
    </svg>
  );
}

export function KnowledgeFlowChart({
  className = "",
  locale = "de",
}: {
  className?: string;
  locale?: Locale;
}) {
  const t = T[locale];
  return (
    <>
      <Wide t={t} className={className} />
      <Narrow t={t} className={className} />
    </>
  );
}
