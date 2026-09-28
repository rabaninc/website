// typesafe's corner marks: four small L-shaped brackets on the corners of a
// box, drawn in ink hairlines. The parent must be positioned. Decorative.
const CORNERS = [
  "left-0 top-0 border-l border-t",
  "right-0 top-0 border-r border-t",
  "bottom-0 left-0 border-b border-l",
  "bottom-0 right-0 border-b border-r",
] as const;

export function Brackets({ inset = "-8px" }: { inset?: string }) {
  return (
    <span aria-hidden className="pointer-events-none absolute" style={{ inset }}>
      {CORNERS.map((c) => (
        <span key={c} className={`absolute size-3 border-ink ${c}`} />
      ))}
    </span>
  );
}
