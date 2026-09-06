import type { Locale } from "@/utils/locale";

// "Eigentum und Preis" from the pitch deck (Raban Pitch v2, slide 7): the
// customer's knowledge as a solid red block, our architecture outlined at the
// same size, and beneath both the three price parts, wrapped by one hairline.
// Geometry carried over from the deck unchanged; colours mapped to the site's
// tokens. English is the deck's original wording, re-addressed to the customer.
//
// Two layouts, switched at the lg breakpoint: the slide, and a narrow one for
// phones and tablets that stacks the same five boxes in one column — your
// knowledge on top and outside the hairline, then the hairline around our
// architecture and the three price parts — at the slide's box heights and
// text sizes. Only the widths give (560 for every box, since the column is
// 600 wide), and the two sub-lines that would not fit that width break in two.
const T = {
  de: {
    aria: "Ihr Wissen als voller roter Block, unsere Architektur als Umriss in gleicher Größe; dazu Einrichtung, Basispreis und Nutzung, von einer Haarlinie umschlossen",
    yours: "Ihr Wissen",
    yoursSub: "gehört Ihnen — bleibt in Europa/Deutschland",
    yoursSubLines: ["gehört Ihnen —", "bleibt in Europa/Deutschland"],
    ours: "Unsere Architektur",
    oursSub: "menschgerechte Schnittstelle für Ein- und Ausgabe",
    oursSubLines: ["menschgerechte Schnittstelle", "für Ein- und Ausgabe"],
    tagOnce: "EINMALIG",
    tagBase: "BASIS",
    tagUsage: "NUTZUNG",
    once: "1.000–9.000 €",
    onceSub: "Einrichtung, je nach Standort",
    base: "250 € / Monat",
    baseSub: "Wartung & Upgrades",
    usage: "~25 € / Mitarbeiter/Monat",
    usageSub: "deckt die KI-Kosten",
  },
  en: {
    aria: "Your knowledge as a solid red block, our architecture outlined at the same size; with one-time setup, base fee and usage-based pricing, wrapped by a hairline",
    yours: "Your knowledge",
    yoursSub: "you own it — it stays in Europe/Germany",
    yoursSubLines: ["you own it —", "it stays in Europe/Germany"],
    ours: "Our architecture",
    oursSub: "human-native interface for input and output",
    oursSubLines: ["human-native interface", "for input and output"],
    tagOnce: "ONE TIME",
    tagBase: "BASE",
    tagUsage: "USAGE",
    once: "€1,000–9,000",
    onceSub: "setup, scoped by site",
    base: "€250 / month",
    baseSub: "maintenance & upgrades",
    usage: "~€25 / employee/month",
    usageSub: "covers the AI costs",
  },
} as const;

// Both viewBoxes are cut to the ink, four units past the outer hairline —
// not to the slide frame — so the drawing keeps exactly the card's --gutter
// to its edge, the buffer the lights have (window-card.tsx). Four units is
// also what keeps the hairline whole: with the .chart non-scaling-stroke its
// 2px centre-line needs a pixel of room inside the edge, and four units are
// more than that at every width the chart is drawn at. (History: the frame
// ran along the exact viewBox edge and the SVGs were overflow-visible so the
// clip would not shave the outer half of the stroke off.)
const WIDE = "chart hidden w-full lg:block";
const NARROW = "chart mx-auto w-full max-w-[40rem] lg:hidden";

type Strings = (typeof T)[Locale];

// One price part: the tag, the price, the sub-line, in an outlined box at
// top-left (x, y), w × h. The lines sit at fixed offsets from the box's
// vertical centre, so a box of another height still reads the same.
function Price({ x, y, w, h, tag, price, sub }: { x: number; y: number; w: number; h: number; tag: string; price: string; sub: string }) {
  const pad = (h - 220) / 2;
  return (
    <>
      <rect x={x} y={y} width={w} height={h} rx="24" fill="none" className="stroke-ink" strokeWidth="2" />
      <text className="fill-red-600" x={x + 36} y={y + pad + 56} fontSize="22" letterSpacing="0.08em">
        {tag}
      </text>
      <text className="fill-ink" x={x + 36} y={y + pad + 120} fontSize="26">
        {price}
      </text>
      <text className="fill-ink/60" x={x + 36} y={y + pad + 162} fontSize="22">
        {sub}
      </text>
    </>
  );
}

// A sub-line that may break in two, centred on x; 30 between lines.
function Sub({ x, y, lines, className, fontSize }: { x: number; y: number; lines: readonly string[]; className: string; fontSize: number }) {
  return (
    <text className={className} x={x} y={y} textAnchor="middle" fontSize={fontSize}>
      {lines.map((line, i) => (
        <tspan key={line} x={x} dy={i === 0 ? 0 : 30}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

function Wide({ t, className }: { t: Strings; className: string }) {
  return (
    <svg viewBox="116 -4 1448 618" className={`${WIDE} ${className}`} role="img" aria-label={t.aria}>
      <rect x="140" y="20" width="640" height="310" rx="24" className="fill-red-600" />
      <text className="fill-on-accent" x="460" y="161" textAnchor="middle" fontSize="38">
        {t.yours}
      </text>
      <text className="fill-on-accent" x="460" y="225" textAnchor="middle" fontSize="22">
        {t.yoursSub}
      </text>
      <path
        d="M 922 0 L 1518 0 A 42 42 0 0 1 1560 42 L 1560 568 A 42 42 0 0 1 1518 610 L 162 610 A 42 42 0 0 1 120 568 L 120 392 A 42 42 0 0 1 162 350 L 838 350 A 42 42 0 0 0 880 308 L 880 42 A 42 42 0 0 1 922 0 Z"
        fill="none"
        className="stroke-ink/25"
        strokeWidth="2"
      />
      <rect x="900" y="20" width="640" height="310" rx="24" fill="none" className="stroke-ink" strokeWidth="2" />
      <text className="fill-ink" x="1220" y="161" textAnchor="middle" fontSize="38">
        {t.ours}
      </text>
      <text className="fill-ink/75" x="1220" y="225" textAnchor="middle" fontSize="20">
        {t.oursSub}
      </text>
      <Price x={140} y={370} w={446} h={220} tag={t.tagOnce} price={t.once} sub={t.onceSub} />
      <Price x={617} y={370} w={446} h={220} tag={t.tagBase} price={t.base} sub={t.baseSub} />
      <Price x={1094} y={370} w={446} h={220} tag={t.tagUsage} price={t.usage} sub={t.usageSub} />
    </svg>
  );
}

// One column, 560 wide inside a 600-wide frame, every box at the slide's height
// (310 for the two big ones, 220 for the price parts) with the slide's text
// offsets; the two broken sub-lines sit where the single line sat.
function Narrow({ t, className }: { t: Strings; className: string }) {
  return (
    <svg viewBox="-4 -4 608 1448" className={`${NARROW} ${className}`} role="img" aria-label={t.aria}>
      <rect x="20" y="0" width="560" height="310" rx="24" className="fill-red-600" />
      <text className="fill-on-accent" x="300" y="129" textAnchor="middle" fontSize="38">
        {t.yours}
      </text>
      <Sub x={300} y={181} lines={t.yoursSubLines} className="fill-on-accent" fontSize={22} />
      <rect x="0" y="350" width="600" height="1090" rx="42" fill="none" className="stroke-ink/25" strokeWidth="2" />
      <rect x="20" y="370" width="560" height="310" rx="24" fill="none" className="stroke-ink" strokeWidth="2" />
      <text className="fill-ink" x="300" y="499" textAnchor="middle" fontSize="38">
        {t.ours}
      </text>
      <Sub x={300} y={551} lines={t.oursSubLines} className="fill-ink/75" fontSize={20} />
      <Price x={20} y={720} w={560} h={220} tag={t.tagOnce} price={t.once} sub={t.onceSub} />
      <Price x={20} y={960} w={560} h={220} tag={t.tagBase} price={t.base} sub={t.baseSub} />
      <Price x={20} y={1200} w={560} h={220} tag={t.tagUsage} price={t.usage} sub={t.usageSub} />
    </svg>
  );
}

export function OwnershipPricingChart({
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
