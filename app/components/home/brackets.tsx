// typesafe's corner marks: four small L-shaped brackets on the corners of a
// box, drawn in ink hairlines. The parent must be positioned. Decorative.
// A section mark at the very top of a page, under the navbar, or at its very
// foot, over the footer card, marks off nothing (Johannes, 2026-10-07: "we
// don't need them at the very top and at the very bottom"), so a page's
// first section can leave out its top pair and its last its bottom pair.
// Where two sections meet, the upper one's bottom pair and the lower one's
// top pair share a row and read as one mark pointing up and down; `up` gives
// a section under a part without marks (the home page's hero) the same mark,
// its top pair with arms up (Johannes, 2026-10-07: "these ones should also
// point upward").
const CORNERS = [
  { at: "left-0 top-0 border-l border-t", edge: "top" },
  { at: "right-0 top-0 border-r border-t", edge: "top" },
  { at: "bottom-0 left-0 border-b border-l", edge: "bottom" },
  { at: "bottom-0 right-0 border-b border-r", edge: "bottom" },
  { at: "left-0 -top-[11px] border-b border-l", edge: "up" },
  { at: "right-0 -top-[11px] border-b border-r", edge: "up" },
] as const;

export function Brackets({
  inset = "-8px",
  top = true,
  bottom = true,
  up = false,
}: {
  inset?: string;
  top?: boolean;
  bottom?: boolean;
  up?: boolean;
}) {
  const shown = { top, bottom, up: top && up };
  return (
    <span aria-hidden className="pointer-events-none absolute" style={{ inset }}>
      {CORNERS.filter((c) => shown[c.edge]).map((c) => (
        <span key={c.at} className={`absolute size-3 border-ink ${c.at}`} />
      ))}
    </span>
  );
}
