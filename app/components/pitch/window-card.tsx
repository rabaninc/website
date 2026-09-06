// A slide as a macOS window: the graphic and its copy on one card, the three
// traffic lights in its top-left corner (looks only — they do nothing), the
// title in the body above the paragraph. Every graphic on the site sits in one
// of these — the four pitch slides on / and /product, the team slide on /about
// (app/components/pitch/sections.tsx, team.tsx) — with the home page's globe
// as the one graphic that stays a hero.
//
// It is the site's standard card (AGENTS.md, Cards), flat: paper, no fill, a
// faint `ink/10` hairline, no shadow — the only thing behind a card is the
// paper, so there is nothing for glass or a lift to do. The radius is 24px, a
// step below the chrome's 28. The lights sit --gutter from the left edge and
// --gutter from the top, the same distance both ways, the way the OS insets
// them — and, since the gutter is the chrome's radius, they start where a
// corner curve would straighten out. Nothing separates them from the body: no
// title bar, no divider, just the header gap. (History, all 2026-09-06: the
// cards began as the navbar's frosted glass with a lift and a polished lip,
// a title bar over an inset hairline, and a sticky deck — each card pinned
// one bar lower than the last so they stacked as you scrolled. An opaque
// "classic" frame with a grey title bar was tried the same day. All of it was
// taken back out for this: a flat card on a page that scrolls like a page.)
//
// Sides alternate: the first card carries its copy on the right, the next on
// the left, and so on down the page; `side` overrides that when a page needs.

type Side = "left" | "right";

type Props = {
  /** Position on the page, from 0. Drives which side the copy takes. */
  index: number;
  /** Which side the copy sits on from lg up; defaults to alternating, right first. */
  side?: Side;
  /** The graphic. Gets the wide column. */
  graphic: React.ReactNode;
  /** The slide's title: an h2 atop the copy column. Omit for none. */
  title?: string;
  /** The paragraph — the rest of the copy column. */
  children: React.ReactNode;
};

// The three window buttons at macOS's own colours, the same in both themes —
// the one splash of colour on the page besides the slab's red. 12px on a
// 20px pitch, as the OS draws them.
const LIGHTS = ["#ff5f57", "#febc2e", "#28c840"] as const;

// Slide titles read the --h2 scale whichever page they are on: rank on the
// page changes, their size relative to the graphic beside them does not.
const TITLE = "text-[length:var(--h2)] font-semibold leading-[var(--h2-line)]";

export function WindowCard({ index, side, graphic, title, children }: Props) {
  const copySide: Side = side ?? (index % 2 === 0 ? "right" : "left");
  return (
    <section className="space-y-[var(--header-gap)] rounded-3xl border border-ink/10 p-[var(--gutter)]">
      <div className="flex gap-2" aria-hidden>
        {LIGHTS.map((c) => (
          <span
            key={c}
            className="size-3 rounded-full"
            style={{ background: c }}
          />
        ))}
      </div>
      {/* The body: from lg up a two-column grid — the graphic on a flexible
          track, the copy on a fixed measure of about 34 characters — with the
          copy's column moved left or right: the order AND the template swap
          together, so the graphic keeps the flexible track whichever side it
          is on. Below lg one column, the graphic first. Both columns centre
          vertically, so a short paragraph sits level with the middle of its
          graphic rather than hanging off its top. The graphic's cell is a
          container (`@container`), so a graphic can size itself to the column
          it actually gets rather than to the viewport (the team slide does,
          see team.tsx). */}
      <div
        className={`grid items-center gap-[var(--gutter)] ${
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
