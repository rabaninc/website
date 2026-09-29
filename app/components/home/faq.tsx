import { LABEL } from "../type";

// typesafe's FAQ: each question a mono line with a small square toggle, the
// answer opening below it in large grotesk at the body's weight, as typesafe
// sets it. Native <details>, so it works without script and the browser's
// find-in-page opens the matching answer.
export function Faq({ items }: { items: readonly { q: string; a: string }[] }) {
  return (
    <div className="border-b border-ink/25">
      {items.map(({ q, a }) => (
        <details key={q} className="group border-t border-ink/25">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
            <span className={`${LABEL} text-[13px]`}>{q}</span>
            <span
              aria-hidden
              className="grid size-4 flex-none place-items-center border border-ink text-[10px] leading-none transition-transform group-open:rotate-180"
            >
              <svg width="8" height="5" viewBox="0 0 8 5" fill="none">
                <path d="M0.5 0.5L4 4L7.5 0.5" stroke="currentColor" />
              </svg>
            </span>
          </summary>
          <p className="max-w-[40ch] pb-8 text-[22px] leading-[1.12] tracking-[-0.015em] md:text-[26px]">
            {a}
          </p>
        </details>
      ))}
    </div>
  );
}
