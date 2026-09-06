import { ReactElement, cloneElement } from "react";

// Applies the shared link styling directly onto the interactive child rather
// than a wrapper, so the affordance and the click target are the exact same
// element.
//
// ONE AFFORDANCE, NEVER TWO. Every control here marks itself as a control
// exactly once, and this component's whole job is picking which mark:
//
//   • a soft rounded highlight box on hover (the default) — content links and
//     buttons, at full ink, because the box is already doing the saying;
//   • half ink that resolves to full (highlight={false}) — the footer's links,
//     which have no box, so the ink itself is the mark;
//   • a dim to neutral-500 on hover (chrome) — the navbar;
//   • nothing at all (icon + highlight={false}) — the theme flip alone, whose
//     knob is its own answer.
//
// Which is why "half ink for clickable text" is NOT a blanket rule: it's what a
// control falls back to when it has nothing else. Stack it on top of a box and
// you've said the same thing twice, and dimmed a live button for no gain.
// (Links out to another site, outside this component, are the fourth mark: an
// underline, at full ink, which hover LIFTS rather than adds. Same rule read
// backwards — the mark is already on at rest, so removing it is what's left.)
//
// The box's padding is cancelled by equal negative margins so it bleeds into
// surrounding whitespace without shifting layout. tone picks ink + highlight for
// light vs dark backgrounds. (Font is the global mono stack from body.)
type StyledElement = ReactElement<{ className?: string }>;

export function LinkStyle({
  children,
  tone = "dark",
  highlight = true,
  chrome = false,
  icon = false,
  block = false,
}: {
  children: StyledElement;
  tone?: "dark" | "light";
  // highlight: the box, on by default. Turning it OFF is what hands the control
  // over to the half-ink resolve — so highlight={false} means "no box, mark
  // yourself with the ink instead", not "no affordance".
  highlight?: boolean;
  // chrome: the navbar, and nothing else. The bar is a frame around the page
  // that is present on every route, so a permanently half-lit one reads as
  // disabled; it keeps full resting ink and dims to neutral-500 on hover
  // instead. Implies no highlight box.
  chrome?: boolean;
  // block: the link is a full-width row in a stacked list (the phone sheet),
  // so the whole line is its target rather than just the label sitting on it.
  // It spans the container's content box, which is what the horizontal half of
  // the touch padding below was for — and w-full plus a negative inline margin
  // would push the row out past its own gutter — so a block row takes the row
  // padding its caller gives it and nothing else.
  block?: boolean;
  // icon: the child is a square glyph (e.g. an SVG), not text. Switches the
  // highlight box to symmetric padding (p-2 vs the text default's px-2 py-1)
  // and centres the child, so the box stays square and the glyph sits dead
  // centre. Pair with an SVG icon — text glyphs (+, ×) sit on odd baselines.
  //
  // A glyph never takes the half ink even with the box off. A word at half
  // strength still reads as the word; a 16px hairline at half strength reads as
  // a disabled control, with no size or weight left in it to carry what the ink
  // took away. So icon + highlight={false} is full ink and no hover state
  // whatsoever — the theme flip is its one caller.
  icon?: boolean;
}) {
  // tone names the SURFACE the link sits on, not a colour: "dark" is the paper,
  // "light" is the footer slab. Both sides are tokens (the slab's ink is black
  // today, and was white), so a link never knows which — see app/globals.css.
  //
  // The resolve snaps (no transition, like every other hover here), and active:
  // mirrors hover: because hover is gated behind @media (hover: hover) and never
  // fires on touch — so a tap-down gets it too.
  const full = tone === "light" ? "text-slab-ink" : "text-ink";
  const resolve =
    tone === "light"
      ? "text-slab-ink/50 hover:text-slab-ink active:text-slab-ink"
      : "text-ink/50 hover:text-ink active:text-ink";
  // The ink is the mark of last resort: only for text with no box, no chrome
  // dim, and no glyph shape to lose. See the header.
  const ink = highlight || chrome || icon ? full : resolve;
  const bg =
    tone === "light"
      ? "hover:bg-slab-ink/15 active:bg-slab-ink/15"
      : "hover:bg-ink/[0.06] active:bg-ink/[0.06]";
  // Below lg — phone and tablet, where the pointer is a fingertip rather than a
  // cursor — every link grows its hit area by 8px on each side, cancelled by
  // equal negative margins so nothing moves. 8px is chosen, not rounded up: the
  // footer stacks its links on a gap-4, so 8px above and 8px below makes
  // adjacent targets meet exactly and neither overlap (which would let one link
  // steal the other's edge) nor leave a dead strip between them. The navbar's
  // gap-[--gutter] row has 24px to give, so 8px a side leaves it comfortable.
  const touch = block ? "" : "max-lg:-m-2 max-lg:p-2";
  const layout = block ? "flex w-full items-center" : "inline-flex items-center";

  // The mid grey the navbar dims to is halfway between paper and ink, and the
  // same grey whichever theme (or surface) it sits on since it's the midpoint of
  // all four — which is why it's the one literal colour allowed outside
  // globals.css with no dark arm to keep in sync.
  const box = icon
    ? "-m-2 justify-center p-2"
    : block
      ? "-my-1 py-1"
      : `-mx-2 -my-1 px-2 py-1 ${touch}`;
  // Medium weight for the chrome only: at the body's 400 the bar's words sat
  // lighter than the page they frame, and 500 is the least that reads as a
  // frame without turning the bar into a heading.
  const interaction = chrome
    ? `${touch} font-medium hover:text-neutral-500 active:text-neutral-500`
    : highlight
      ? `${box} rounded-lg ${bg}`
      : touch;

  const className = [layout, ink, interaction, children.props.className]
    .filter(Boolean)
    .join(" ");

  return cloneElement(children, { className });
}
