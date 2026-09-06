import type { Locale } from "@/utils/locale";

// "Wo das Wissen im Unternehmen liegt" from the pitch deck (Raban Pitch v2,
// slide 2): documented knowledge as four unconnected clusters of systems on the
// left, undocumented knowledge as people on the right — one of them heading
// out the door. Geometry carried over from the deck unchanged; colours mapped
// to the site's tokens. English is the deck's original wording.
//
// Two layouts, switched at the lg breakpoint: the deck's wide slide, and a
// narrow one for phones and tablets that stacks the same two halves — same
// clusters, same people, same label sizes — one above the other, so nothing
// shrinks to a thumbnail. An SVG scales as one picture; the narrow layout is
// what "smaller but just as legible" means for it.
//
// Both viewBoxes are cut to the ink, a few units past the outermost stroke,
// marker tip and descender — not to the deck's slide frame. The card gives
// the graphic --gutter to its edge (window-card.tsx), and a viewBox with the
// slide's own margins inside it would add those on top: on the wide layout
// the first cluster sat some 80px in from where the lights start.
const T = {
  de: {
    aria: "Schema: Dokumentiertes Wissen als vier unverbundene Gruppen von Systemen, undokumentiertes Wissen als Menschen, eine Person auf dem Weg in die Rente",
    documented: "Dokumentiert",
    documentedSub: "in unverbundenen Systemen",
    undocumented: "Undokumentiert",
    undocumentedSub: "in Menschen",
  },
  en: {
    aria: "Schematic: documented knowledge as four unconnected clusters of systems, undocumented knowledge as people, one person heading toward retirement",
    documented: "Documented",
    documentedSub: "in unconnected systems",
    undocumented: "Undocumented",
    undocumentedSub: "in people",
  },
} as const;

const WIDE = "chart hidden w-full lg:block";
const NARROW = "chart mx-auto w-full max-w-[40rem] lg:hidden";

// One 4-block cluster in its hairline frame, at the given top-left corner.
function Cluster({ x, y }: { x: number; y: number }) {
  return (
    <>
      <rect x={x} y={y} width="182" height="182" rx="16" fill="none" className="stroke-ink/45" strokeWidth="1.5" />
      <g className="fill-red-600">
        <rect x={x + 16} y={y + 16} width="68" height="68" rx="12" />
        <rect x={x + 98} y={y + 16} width="68" height="68" rx="12" />
        <rect x={x + 16} y={y + 98} width="68" height="68" rx="12" />
        <rect x={x + 98} y={y + 98} width="68" height="68" rx="12" />
      </g>
    </>
  );
}

// The documented half at the deck's coordinates: four clusters, 220–624 wide.
function Documented() {
  return (
    <>
      <Cluster x={220} y={40} />
      <Cluster x={442} y={40} />
      <Cluster x={220} y={262} />
      <Cluster x={442} y={262} />
    </>
  );
}

// The undocumented half at the deck's coordinates: eight heads, the last one
// with a body, walking out to the right. `arrowEnd` is where the exit arrow
// stops (1500 on the slide; the narrow layout shortens it to stay in frame).
// The marker id is per layout — two SVGs on one page must not share ids.
function People({ id, arrowEnd }: { id: string; arrowEnd: number }) {
  return (
    <>
      <defs>
        <marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" className="fill-red-600" />
        </marker>
      </defs>
      <g fill="none" className="stroke-ink" strokeWidth="2">
        <circle cx="1040" cy="84" r="32" />
        <circle cx="1172" cy="84" r="32" />
        <circle cx="1304" cy="84" r="32" />
        <circle cx="1040" cy="234" r="32" />
        <circle cx="1172" cy="234" r="32" />
        <circle cx="1304" cy="234" r="32" />
        <circle cx="1040" cy="384" r="32" />
        <circle cx="1172" cy="384" r="32" />
      </g>
      {/* the one who is leaving: filled, with a body, walking right */}
      <path
        d="M 1266 482 Q 1248 482 1248 464 A 56 44 0 0 1 1360 464 Q 1360 482 1342 482 Z"
        className="fill-red-600"
      />
      <circle cx="1304" cy="384" r="32" className="fill-red-600" />
      <line
        className="stroke-red-600"
        strokeWidth="2"
        strokeLinecap="round"
        x1="1370"
        y1="384"
        x2={arrowEnd}
        y2="384"
        markerEnd={`url(#${id})`}
      />
    </>
  );
}

// A caption pair — title with its sub-line 36 below — centred on x.
function Caption({ x, y, title, sub }: { x: number; y: number; title: string; sub: string }) {
  return (
    <>
      <text className="fill-ink" x={x} y={y} fontSize="28" textAnchor="middle">
        {title}
      </text>
      <text className="fill-ink/60" x={x} y={y + 36} fontSize="22" textAnchor="middle">
        {sub}
      </text>
    </>
  );
}

export function KnowledgeLivesChart({
  className = "",
  locale = "de",
}: {
  className?: string;
  locale?: Locale;
}) {
  const t = T[locale];
  return (
    <>
      {/* the slide: both halves side by side, a divider between them */}
      <svg viewBox="216 16 1290 600" className={`${WIDE} ${className}`} role="img" aria-label={t.aria}>
        <line className="stroke-ink/25" strokeWidth="2" x1="840" y1="20" x2="840" y2="460" />
        <Documented />
        <People id="pk-ah-w" arrowEnd={1500} />
        <Caption x={422} y={572} title={t.documented} sub={t.documentedSub} />
        <Caption x={1172} y={572} title={t.undocumented} sub={t.undocumentedSub} />
      </svg>
      {/* narrow: the same halves stacked, the divider turned horizontal */}
      <svg viewBox="74 16 492 1202" className={`${NARROW} ${className}`} role="img" aria-label={t.aria}>
        <g transform="translate(-142 -20)">
          <Documented />
        </g>
        <Caption x={280} y={500} title={t.documented} sub={t.documentedSub} />
        <line className="stroke-ink/25" strokeWidth="2" x1="80" y1="590" x2="480" y2="590" />
        <g transform="translate(-912 600)">
          <People id="pk-ah-n" arrowEnd={1470} />
        </g>
        <Caption x={260} y={1172} title={t.undocumented} sub={t.undocumentedSub} />
      </svg>
    </>
  );
}
