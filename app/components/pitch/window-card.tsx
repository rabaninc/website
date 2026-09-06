// A slide as a macOS window: the graphic and its copy on one card, the three
// traffic lights in its top-left corner (looks only — they do nothing), the
// title in the body beside the graphic. Every graphic on the site sits in one
// of these — the four pitch slides on / and /product, the team slide on /about
// (app/components/pitch/sections.tsx, team.tsx) — with the home page's globe
// as the one graphic that stays a hero.
//
// It is the site's standard card (AGENTS.md, Cards) as a sheet on the page:
// filled `--card`, paper a hair toward the ink (app/globals.css), with no
// hairline and no shadow — the fill alone is what separates it from the
// page, flat, the way the rest of the site is. The radius is 24px, a step below
// the chrome's 28. The lights sit --gutter from the left edge and --gutter
// from the top, the same distance both ways, the way the OS insets them —
// and, since the gutter is the chrome's radius, they start where a corner
// curve would straighten out. The graphic keeps that same --gutter to the
// card's edge on its side, which is why each chart's viewBox is cut to its
// ink (every chart in app/components/pitch/): dead space inside the SVG
// would push the drawing in past the buffer the lights set. Nothing separates the lights
// from the body: no title bar, no divider, just the header gap. (History,
// all 2026-09-06: the cards began as the navbar's frosted glass with a lift
// and a polished lip, a title bar over an inset hairline, and a sticky deck —
// each card pinned one bar lower than the last so they stacked as you
// scrolled. An opaque "classic" frame with a grey title bar was tried the
// same day. All of it was taken back out for a flat card on a page that
// scrolls like a page. The same evening the bare card — no fill, hairline
// only — read as an outline, not an object, and got a window's two-layer
// cast; an hour later the cast went too and the grey fill took its place:
// weight from tone, not from elevation.)
//
// Sides alternate: the first card carries its copy on the left, the next on
// the right, and so on down the page; `side` overrides that when a page needs.

type Side = "left" | "right";

type Props = {
  /** Position on the page, from 0. Drives which side the copy takes. */
  index: number;
  /** Which side the copy sits on from lg up; defaults to alternating, left first. */
  side?: Side;
  /** The graphic. Gets the wide column. */
  graphic: React.ReactNode;
  /** The slide's title: an h2 atop the copy column. Omit for none. */
  title?: string;
  /** The paragraph — the rest of the copy column. */
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
// their size relative to the graphic beside them does not. Black, the weight
// --h1 carries at this size (AGENTS.md, Type), so the title holds its own
// against a graphic the width of the card; still an h2, since the page's own
// h1 outranks it. Two lines is the norm in the copy column, so the lines are
// balanced, and a title may hyphenate: "Verifikationsschleife" alone is 358px
// at 32px black, wider than the lg column, and without a break it would run
// out under the graphic. `hyphens-auto` reads the html's `lang`
// (app/layout.tsx), so German breaks by German rules.
const TITLE =
  "text-[length:var(--slide)] font-black leading-[var(--slide-line)] text-balance hyphens-auto";

export function WindowCard({ index, side, graphic, title, children }: Props) {
  const copySide: Side = side ?? (index % 2 === 0 ? "left" : "right");
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
      {/* The body: from lg up a two-column grid — the graphic on a flexible
          track, the copy on a fixed measure of about 34 characters — with the
          copy's column moved left or right: the order AND the template swap
          together, so the graphic keeps the flexible track whichever side it
          is on. Below lg one column, the graphic first. Both columns start
          at the top, so the title's line box sits level with the top of the
          graphic and the paragraph runs down from it: the copy reads as a
          caption to the picture, not as something floating in the middle
          of its column. The graphic's cell is a
          container (`@container`), so a graphic can size itself to the column
          it actually gets rather than to the viewport (the team slide does,
          see team.tsx). */}
      <div
        className={`grid items-start gap-[var(--gutter)] ${
          copySide === "left"
            ? "lg:grid-cols-[20rem_minmax(0,1fr)] xl:grid-cols-[24rem_minmax(0,1fr)]"
            : "lg:grid-cols-[minmax(0,1fr)_20rem] xl:grid-cols-[minmax(0,1fr)_24rem]"
        }`}
      >
        <div
          className={`@container min-w-0 ${copySide === "left" ? "lg:order-2" : ""}`}
        >
          {graphic}
        </div>
        <div
          className={`space-y-[var(--header-gap)] ${copySide === "left" ? "lg:order-1" : ""}`}
        >
          {title && <h2 className={TITLE}>{title}</h2>}
          {children}
        </div>
      </div>
    </section>
  );
}
