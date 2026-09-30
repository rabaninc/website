// The type classes of the rebuild (2026-09-28, after typesafe.ai), in one
// place so every heading on the site reads from the same few lines.
// Headings are SF Pro at medium, 570 (Inter off Apple devices, see
// app/layout.tsx, and the weight tokens in app/globals.css),
// with typesafe's leading well under 1 and negative tracking — less than the
// Inter Tight they replaced needed, since SF Display already sets large sizes
// a touch tight on its own (2026-09-29). English headings
// are title-cased the way typesafe sets them ("We Took The Opposite Research
// Direction"); German keeps its own capitals, which carry grammar.

/** The one big statement of a section, up to 150px. */
export const DISPLAY =
  "text-[length:var(--display)] font-medium leading-[0.86] tracking-[-0.035em] text-balance [&:lang(en)]:capitalize";

/** A section heading, a step below the display. */
export const SECTION =
  "text-[length:var(--section)] font-medium leading-[0.92] tracking-[-0.03em] text-balance [&:lang(en)]:capitalize";

/** A page title (/about, /contact, /privacy, /legal). */
export const H1 =
  "text-[length:var(--h1)] font-medium leading-[var(--h1-line)] tracking-[-0.03em] [&:lang(en)]:capitalize";

/** A document's section heading (/privacy, /legal). */
export const H2 = "text-[length:var(--h2)] font-medium leading-[var(--h2-line)] tracking-[-0.02em]";

/** typesafe's small mono label: SF Mono Regular (JetBrains Mono off Apple
 *  devices), 11px, a little open. A literal 400, not font-normal: that token
 *  is 440 for SF, and SF Mono has fixed cuts, so 440 would snap to Medium. */
export const LABEL = "font-mono text-[11px] font-[400] leading-[1.2] tracking-[0.04em]";

/** The inverted mono tag that names a panel, as typesafe tags its windows. */
export const TAG = `${LABEL} inline-block bg-ink px-1.5 py-0.5 text-paper`;

/** Text in the page without typesafe's half-pixel outline (app/globals.css):
 *  the 15px checklists and price captions and the FAQ answers, which read too
 *  heavy with it (Johannes, 2026-09-30). The paragraphs and labels keep it. */
export const BARE = "[-webkit-text-stroke-width:0]";

/** Running text on the home page: typesafe's 17–18px body. */
export const BODY = "text-[17px] leading-[1.3] md:text-[18px]";
