// typesafe's corner marks: four small L-shaped brackets on the corners of a
// box, drawn in ink hairlines. The parent must be positioned. Decorative.
// A section mark at the very top of a page, under the navbar, or at its very
// foot, over the footer card, marks off nothing (Johannes, 2026-10-07: "we
// don't need them at the very top and at the very bottom"), so a page's
// first section can leave out its top pair and its last its bottom pair.
const CORNERS = [
  { at: "left-0 top-0 border-l border-t", top: true },
  { at: "right-0 top-0 border-r border-t", top: true },
  { at: "bottom-0 left-0 border-b border-l", top: false },
  { at: "bottom-0 right-0 border-b border-r", top: false },
] as const;

export function Brackets({
  inset = "-8px",
  top = true,
  bottom = true,
}: {
  inset?: string;
  top?: boolean;
  bottom?: boolean;
}) {
  return (
    <span aria-hidden className="pointer-events-none absolute" style={{ inset }}>
      {CORNERS.filter((c) => (c.top ? top : bottom)).map((c) => (
        <span key={c.at} className={`absolute size-3 border-ink ${c.at}`} />
      ))}
    </span>
  );
}
