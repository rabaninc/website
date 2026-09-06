import type { Locale } from "@/utils/locale";

// "Die Verifikationsschleife" from the pitch deck (Raban Pitch v2, slide 6):
// zuhören → korrigieren → verfeinern → anleiten, the expert decides, and only
// what is good enough passes into the growing knowledge base at the right
// edge. Geometry carried over from the deck unchanged (the viewBox is grown so
// nothing relies on the slide cropping); colours mapped to the site's tokens.
// English is the deck's original wording.
//
// Two layouts, switched at the lg breakpoint. The wide one is the slide. The
// narrow one, for phones and tablets, turns the whole drawing a quarter turn
// clockwise — the loop stands upright, still running clockwise, and the base
// it feeds sits below it, growing off the bottom edge — while every label is
// set upright again by hand, at the slide's size. Nothing is redrawn, so the
// two layouts cannot drift apart.
const T = {
  de: {
    aria: "Die Verifikationsschleife — zuhören, korrigieren, verfeinern, anleiten — endet an einer Entscheidung: Nur was der Experte gut genug nennt, geht in die wachsende Wissensbasis",
    notGood: "Noch nicht gut genug",
    notGoodLines: ["Noch nicht", "gut genug"],
    decides: "Experte entscheidet",
    good: "Gut genug",
    listen: "Zuhören",
    correct: "Korrigieren",
    refine: "Verfeinern",
    instruct: "Anleiten",
  },
  en: {
    aria: "The verification loop — listen, correct, refine, instruct — ending in a decision gate: only knowledge the expert calls good enough passes into the growing knowledge base",
    notGood: "Not good enough",
    notGoodLines: ["Not good", "enough"],
    decides: "Expert decides",
    good: "Good enough",
    listen: "Listen",
    correct: "Correct",
    refine: "Refine",
    instruct: "Instruct",
  },
} as const;

const WIDE = "chart hidden w-full lg:block";
const NARROW = "chart mx-auto w-full max-w-[40rem] lg:hidden";

// Everything drawn on the slide except the words: the loop, its arrows, the
// four block groups in their cut-outs of the lines, the exit path. The marker id is
// per layout — two SVGs on one page must not share ids. `exitY` is where
// the exit path's last leg runs into the base: 359 on the slide, the centre
// of the block that carries the white dot; the narrow layout moves the base
// and passes the moved centre so the arrow keeps pointing at that block.
function Loop({ id, exitY = 359 }: { id: string; exitY?: number }) {
  return (
    <>
      <defs>
        <marker
          id={id}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L10,5 L0,10 z" className="fill-ink" />
        </marker>
        {/* The four block groups sit ON the loop's lines, so the lines must
            stop where a group starts. This is a real cut-out, not a plate:
            the loop and the paths are drawn through a mask that is white
            everywhere except the four group rectangles, so nothing is drawn
            there at all and whatever is behind the chart shows through
            untouched. (History: the cut-outs were four paper-filled rects
            painted over the lines — invisible on flat paper, but the cards
            are frosted glass now, and on a card over a stacked deck each
            plate read as an opaque white box against the blur.) One mask per
            layout, like the marker: two SVGs on a page must not share ids.
            The white rect is deliberately huge — a mask's default region is
            the masked group's bounding box plus a tenth, and the narrow
            layout rotates the whole group, so this covers it in either. */}
        <mask
          id={`${id}-cut`}
          maskUnits="userSpaceOnUse"
          x="-2000"
          y="-2000"
          width="6000"
          height="6000"
        >
          <rect x="-2000" y="-2000" width="6000" height="6000" fill="#fff" />
          <rect x="48" y="238" width="184" height="184" fill="#000" />
          <rect x="308" y="180" width="184" height="184" fill="#000" />
          <rect x="788" y="8" width="184" height="184" fill="#000" />
          <rect x="988" y="267" width="184" height="155" fill="#000" />
        </mask>
      </defs>
      <g mask={`url(#${id}-cut)`}>
        <rect
          x="140"
          y="100"
          width="940"
          height="420"
          rx="80"
          fill="none"
          className="stroke-ink"
          strokeWidth="2"
        />
        <path
          d="M 240 272 L 560 272 Q 640 272 640 192 L 640 180 Q 640 100 720 100 L 744 100"
          fill="none"
          className="stroke-red-600"
          strokeWidth="2"
          strokeDasharray="8 8"
        />
        <path d="M 766 90 L 788 100 L 766 110 Z" className="fill-ink" />
        <path d="M 1070 245 L 1080 267 L 1090 245 Z" className="fill-ink" />
        <path d="M 130 444 L 140 422 L 150 444 Z" className="fill-ink" />
        <path d="M 630 202 L 640 180 L 650 202 Z" className="fill-ink" />
        <path
          d={`M 920 520 L 618 520 A 80 80 0 0 0 618 680 L 1353 680 Q 1433 680 1433 600 L 1433 ${exitY + 60} Q 1433 ${exitY} 1493 ${exitY} L 1513 ${exitY}`}
          fill="none"
          className="stroke-ink"
          strokeWidth="2"
          strokeLinecap="round"
          markerEnd={`url(#${id})`}
        />
      </g>
      {/* zuhören: partly right, partly grey, partly wrong */}
      <rect
        className="fill-red-600"
        x="60"
        y="250"
        width="44"
        height="44"
        rx="8"
      />
      <rect
        className="fill-ink/25"
        x="118"
        y="250"
        width="44"
        height="44"
        rx="8"
      />
      <rect
        fill="none"
        className="stroke-red-600"
        strokeWidth="2"
        strokeDasharray="7 7"
        x="176"
        y="250"
        width="44"
        height="44"
        rx="8"
      />
      <rect
        className="fill-red-600"
        x="60"
        y="308"
        width="44"
        height="44"
        rx="8"
      />
      <rect
        className="fill-red-600"
        x="118"
        y="308"
        width="44"
        height="44"
        rx="8"
      />
      <rect
        className="fill-ink/25"
        x="176"
        y="308"
        width="44"
        height="44"
        rx="8"
      />
      <rect
        className="fill-red-600"
        x="60"
        y="366"
        width="44"
        height="44"
        rx="8"
      />
      <rect
        className="fill-red-600"
        x="118"
        y="366"
        width="44"
        height="44"
        rx="8"
      />
      <rect
        className="fill-red-600"
        x="176"
        y="366"
        width="44"
        height="44"
        rx="8"
      />
      {/* korrigieren: everything solid */}
      <g className="fill-red-600">
        <rect x="320" y="221" width="44" height="44" rx="8" />
        <rect x="378" y="221" width="44" height="44" rx="8" />
        <rect x="436" y="221" width="44" height="44" rx="8" />
        <rect x="320" y="279" width="44" height="44" rx="8" />
        <rect x="378" y="279" width="44" height="44" rx="8" />
        <rect x="436" y="279" width="44" height="44" rx="8" />
      </g>
      {/* verfeinern: the gaps show again */}
      <rect
        className="fill-red-600"
        x="800"
        y="49"
        width="44"
        height="44"
        rx="8"
      />
      <rect
        className="fill-ink/25"
        x="858"
        y="49"
        width="44"
        height="44"
        rx="8"
      />
      <rect
        fill="none"
        className="stroke-red-600"
        strokeWidth="2"
        strokeDasharray="7 7"
        x="916"
        y="49"
        width="44"
        height="44"
        rx="8"
      />
      <rect
        className="fill-red-600"
        x="800"
        y="107"
        width="44"
        height="44"
        rx="8"
      />
      <rect
        className="fill-red-600"
        x="858"
        y="107"
        width="44"
        height="44"
        rx="8"
      />
      <rect
        className="fill-red-600"
        x="916"
        y="107"
        width="44"
        height="44"
        rx="8"
      />
      {/* anleiten: half-filled where the answer is still forming */}
      <rect
        className="fill-red-600"
        x="1000"
        y="279"
        width="44"
        height="44"
        rx="8"
      />
      <rect
        className="fill-ink/25"
        x="1058"
        y="279"
        width="44"
        height="44"
        rx="8"
      />
      <rect
        className="fill-red-600/50 stroke-red-600"
        strokeWidth="2"
        strokeDasharray="7 7"
        x="1116"
        y="279"
        width="44"
        height="44"
        rx="8"
      />
      <rect
        className="fill-red-600"
        x="1000"
        y="337"
        width="44"
        height="44"
        rx="8"
      />
      <rect
        className="fill-red-600"
        x="1058"
        y="337"
        width="44"
        height="44"
        rx="8"
      />
      <rect
        className="fill-red-600"
        x="1116"
        y="337"
        width="44"
        height="44"
        rx="8"
      />
    </>
  );
}

// The knowledge base, growing off the slide's right edge.
function Base() {
  return (
    <>
      <g className="fill-red-600">
        <rect x="1749" y="-69" width="44" height="44" rx="8" />
        <rect x="1691" y="-69" width="44" height="44" rx="8" />
        <rect x="1691" y="-11" width="44" height="44" rx="8" />
        <rect x="1749" y="-11" width="44" height="44" rx="8" />
        <rect x="1517" y="163" width="44" height="44" rx="8" />
        <rect x="1517" y="221" width="44" height="44" rx="8" />
        <rect x="1517" y="279" width="44" height="44" rx="8" />
        <rect x="1517" y="337" width="44" height="44" rx="8" />
        <rect x="1575" y="47" width="44" height="44" rx="8" />
        <rect x="1575" y="105" width="44" height="44" rx="8" />
        <rect x="1575" y="163" width="44" height="44" rx="8" />
        <rect x="1575" y="221" width="44" height="44" rx="8" />
        <rect x="1575" y="279" width="44" height="44" rx="8" />
        <rect x="1575" y="337" width="44" height="44" rx="8" />
        <rect x="1575" y="395" width="44" height="44" rx="8" />
        <rect x="1575" y="453" width="44" height="44" rx="8" />
        <rect x="1633" y="47" width="44" height="44" rx="8" />
        <rect x="1633" y="105" width="44" height="44" rx="8" />
        <rect x="1633" y="163" width="44" height="44" rx="8" />
        <rect x="1633" y="221" width="44" height="44" rx="8" />
        <rect x="1633" y="279" width="44" height="44" rx="8" />
        <rect x="1633" y="337" width="44" height="44" rx="8" />
        <rect x="1633" y="395" width="44" height="44" rx="8" />
        <rect x="1633" y="453" width="44" height="44" rx="8" />
        <rect x="1691" y="569" width="44" height="44" rx="8" />
        <rect x="1691" y="47" width="44" height="44" rx="8" />
        <rect x="1691" y="105" width="44" height="44" rx="8" />
        <rect x="1691" y="163" width="44" height="44" rx="8" />
        <rect x="1691" y="221" width="44" height="44" rx="8" />
        <rect x="1691" y="279" width="44" height="44" rx="8" />
        <rect x="1691" y="337" width="44" height="44" rx="8" />
        <rect x="1691" y="395" width="44" height="44" rx="8" />
        <rect x="1691" y="453" width="44" height="44" rx="8" />
        <rect x="1691" y="511" width="44" height="44" rx="8" />
        <rect x="1749" y="569" width="44" height="44" rx="8" />
        <rect x="1749" y="47" width="44" height="44" rx="8" />
        <rect x="1749" y="105" width="44" height="44" rx="8" />
        <rect x="1749" y="163" width="44" height="44" rx="8" />
        <rect x="1749" y="221" width="44" height="44" rx="8" />
        <rect x="1749" y="279" width="44" height="44" rx="8" />
        <rect x="1749" y="337" width="44" height="44" rx="8" />
        <rect x="1749" y="395" width="44" height="44" rx="8" />
        <rect x="1749" y="453" width="44" height="44" rx="8" />
        <rect x="1749" y="511" width="44" height="44" rx="8" />
      </g>
      <circle cx="1548" cy="368" r="5.5" className="fill-on-accent" />
    </>
  );
}

// Two-line caption, centred on x, lines 30 apart.
function Stacked({
  x,
  y,
  lines,
}: {
  x: number;
  y: number;
  lines: readonly string[];
}) {
  return (
    <text x={x} y={y} textAnchor="middle">
      {lines.map((line, i) => (
        <tspan key={line} x={x} dy={i === 0 ? 0 : 30}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

export function VerificationLoopChart({
  className = "",
  locale = "de",
}: {
  className?: string;
  locale?: Locale;
}) {
  const t = T[locale];
  return (
    <>
      <svg
        viewBox="0 -90 1800 790"
        className={`${WIDE} ${className}`}
        role="img"
        aria-label={t.aria}
      >
        <Loop id="pv-ah-w" />
        <Base />
        <g className="fill-ink/60" fontSize="24">
          <text x="340" y="492" textAnchor="middle">
            {t.notGood}
          </text>
          <text x="724" y="492" textAnchor="middle">
            {t.decides}
          </text>
          <text x="820" y="656" textAnchor="middle">
            {t.good}
          </text>
        </g>
        <g className="fill-ink" fontSize="28">
          <text x="244" y="403" textAnchor="start">
            {t.listen}
          </text>
          <text x="320" y="195" textAnchor="start">
            {t.correct}
          </text>
          <text x="800" y="199" textAnchor="start">
            {t.refine}
          </text>
          <text x="976" y="374" textAnchor="end">
            {t.instruct}
          </text>
        </g>
      </svg>
      {/* narrow: the slide turned a quarter turn clockwise — a slide point
          (x, y) lands at (−y, x) — with the labels set upright again. The
          loop's left edge is now the top, its top the right, its right the
          bottom, and its bottom (where the expert decides) the left; the exit
          path loops out past that left edge and comes back in from above
          the base. The base is shifted 88 along the slide's y (88 to the
          left once turned) so it sits centred under the loop, filling the
          width, and the exit arrow follows it onto the dotted block. */}
      <svg
        viewBox="-720 30 720 1770"
        className={`${NARROW} ${className}`}
        role="img"
        aria-label={t.aria}
      >
        <g transform="rotate(90)">
          <Loop id="pv-ah-n" exitY={447} />
          <g transform="translate(0 88)">
            <Base />
          </g>
        </g>
        <g className="fill-ink" fontSize="28">
          {/* zuhören: blocks straddle the top edge, x −410…−250 */}
          <text x="-226" y="100" textAnchor="start">
            {t.listen}
          </text>
          {/* korrigieren: blocks inside, x −323…−221, y 320…480 */}
          <text x="-340" y="410" textAnchor="end">
            {t.correct}
          </text>
          {/* verfeinern: blocks straddle the right edge, y 800…960 */}
          <text x="-170" y="890" textAnchor="end">
            {t.refine}
          </text>
          {/* anleiten: blocks straddle the bottom edge, x −381…−279 */}
          <text x="-255" y="1150" textAnchor="start">
            {t.instruct}
          </text>
        </g>
        <g className="fill-ink/60" fontSize="24">
          {/* "not good enough" outside the left edge, in the strip the exit
              path loops through; "expert decides" inside the loop beside that
              edge, as on the slide, on the way up to the gate */}
          <Stacked x={-600} y={330} lines={t.notGoodLines} />
          <text x="-500" y="790" textAnchor="start">
            {t.decides}
          </text>
          {/* down the exit run, before it turns in toward the base */}
          <text x="-656" y="1250" textAnchor="start">
            {t.good}
          </text>
        </g>
      </svg>
    </>
  );
}
