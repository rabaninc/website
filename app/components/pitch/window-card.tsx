// A slide as a macOS window: the three traffic lights in the top-left corner
// (looks only — they do nothing), then the slide's title and its copy, then
// the graphic across the full width of the card. Every graphic on the site
// sits in one of these — the four pitch slides on / and /product, the team
// slide on /about (app/components/pitch/sections.tsx, team.tsx) — with the
// home page's globe as the one graphic that stays a hero.
//
// It is the site's standard card (AGENTS.md, Cards) as a sheet on the page:
// filled `--card`, paper a hair toward the ink (app/globals.css), with no
// hairline and no shadow — the fill alone is what separates it from the
// page, flat, the way the rest of the site is. The radius is 24px, a step below
// the chrome's 28. The lights sit --gutter from the left edge and --gutter
// from the top, the same distance both ways, the way the OS insets them —
// and, since the gutter is the chrome's radius, they start where a corner
// curve would straighten out. The graphic keeps that same --gutter to the
// card's edge on both sides, which is why each chart's viewBox is cut to its
// ink (every chart in app/components/pitch/): dead space inside the SVG
// would push the drawing in past the buffer the lights set. Nothing separates
// the lights from the body: no title bar, no divider, just the header gap.
//
// Copy above, graphic below, at every width. The copy is a title and two or
// three sentences and reads as the caption the picture comes after; it is
// held to --measure (the long-document reading width, app/globals.css) so
// it doesn't run across a 1200px card in one line, while the graphic takes
// the whole width and is drawn at the size the deck drew it. (History, all
// 2026-09-06: the cards began as the navbar's frosted glass with a lift and
// a polished lip, a title bar over an inset hairline, and a sticky deck —
// each card pinned one bar lower than the last so they stacked as you
// scrolled. An opaque "classic" frame with a grey title bar was tried the
// same day. All of it was taken back out for a flat card on a page that
// scrolls like a page. The body was then a two-column grid from lg up —
// graphic on a flexible track, copy on a fixed 20–24rem column, sides
// alternating card by card — which left every graphic at two thirds of the
// card and the copy column taller than the picture beside it; the founders
// asked for the copy above the graphic instead, first on phones, then
// everywhere, for better-proportioned cards.)

type Props = {
  /** The graphic. Takes the card's full width. */
  graphic: React.ReactNode;
  /** The slide's title: an h2 atop the copy. Omit for none. */
  title?: string;
  /** The paragraph — the rest of the copy. */
  children: React.ReactNode;
};

// The three window buttons in macOS's own colours, the same in both themes
// — the one splash of colour on the page besides the slab's red: the coral,
// straw yellow and leaf green the OS has used since Big Sur, softer than the
// vivid #ff5f57 / #febc2e / #28c840 most "macOS window" snippets carry,
// which are the Catalina-era values. 14px on a 22px pitch (size-3.5, gap-2):
// a touch over the OS's 12, because on a card the size of a slide the true
// size read small — off the 8px grid, deliberately, the eye judged it.
// (History, 2026-09-06: 12px, then 16px at the vivid values — beside
// Safari's own they read larger and louder than the real thing — then 12
// again at the real colours, then this.)
const LIGHTS = ["#ed6a5e", "#f4bf4f", "#61c554"] as const;

// Slide titles read their own step of the scale, --slide (32px on 40, see
// app/globals.css), whichever page they are on: rank on the page changes,
// their size relative to the graphic under them does not. Black, the weight
// --h1 carries at this size (AGENTS.md, Type), so the title holds its own
// against a graphic the width of the card; still an h2, since the page's own
// h1 outranks it. Balanced lines and hyphenation stay from the days of the
// narrow copy column: on a phone "Verifikationsschleife" alone is 358px at
// 32px black, and `hyphens-auto` reads the html's `lang` (app/layout.tsx),
// so German breaks by German rules.
const TITLE =
  "text-[length:var(--slide)] font-black leading-[var(--slide-line)] text-balance hyphens-auto";

export function WindowCard({ graphic, title, children }: Props) {
  return (
    <section className="space-y-[var(--header-gap)] rounded-3xl bg-card p-[var(--gutter)]">
      <div className="flex gap-2" aria-hidden>
        {LIGHTS.map((c) => (
          <span
            key={c}
            className="size-3.5 rounded-full"
            style={{ background: c }}
          />
        ))}
      </div>
      <div className="max-w-[var(--measure)] space-y-[var(--header-gap)]">
        {title && <h2 className={TITLE}>{title}</h2>}
        {children}
      </div>
      {/* The graphic's box is a container (`@container`), so a graphic can
          size itself to the width it actually gets rather than to the
          viewport (the team slide does, see team.tsx). */}
      <div className="@container min-w-0">{graphic}</div>
    </section>
  );
}
