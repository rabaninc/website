import Link from "next/link";

import type { Locale } from "@/utils/locale";
import { blocks, link, list } from "@/utils/markdown";

import { LanguageFlip } from "./language-flip";
import { LinkStyle } from "./link-style";
import { LABEL } from "./type";
import { ViewFlip } from "./view-flip";

// The footer is a card, not a slab (rebuild 2026-09-28): near-black, inset on
// the sage like Personio's footer — it does not run the full width — with a
// neumorphic relief (--neu) instead of an edge line. Personio's layout inside:
// a short line top left, the link columns beside it, and the wordmark set as
// large as the card is wide, cut off by the card's bottom edge. It is static;
// nothing moves as it comes into view. It sits flush on the bottom of the
// page, as if the page edge cut it off: no gap below it, and only its top
// corners are rounded (Johannes, 2026-09-28).
const T = {
  de: {
    line: "Wissen was bleibt.",
    // Legal first, then Raban (Johannes, 2026-10-01).
    groups: [
      {
        label: "Rechtliches",
        links: [
          ["/privacy", "Datenschutz"],
          ["/legal", "Impressum"],
        ],
      },
      {
        label: "Raban",
        links: [
          ["/about", "Über uns"],
          ["/contact", "Kontakt"],
          ["https://app.raban.ai", "Anmelden"],
        ],
      },
    ],
    contact: "Kontakt",
    language: "Sprache",
    view: "Ansicht",
  },
  en: {
    line: "Knowing what stays.",
    groups: [
      {
        label: "Terms & Policies",
        links: [
          ["/privacy", "Privacy policy"],
          ["/legal", "Legal"],
        ],
      },
      {
        label: "Raban",
        links: [
          ["/about", "About"],
          ["/contact", "Contact"],
          ["https://app.raban.ai", "Sign in"],
        ],
      },
    ],
    contact: "Contact",
    language: "Language",
    view: "View",
  },
} as const;

const ADDRESS = "humans@raban.ai";

export function Footer({ locale }: { locale: Locale }) {
  const t = T[locale];
  return (
    <footer className="px-[var(--inset)]">
      <div className="@container relative overflow-hidden rounded-t-[40px] bg-slab text-slab-ink shadow-[var(--neu)]">
        <div className="grid gap-y-10 p-[var(--gutter)] sm:grid-cols-2 sm:gap-x-[var(--gutter)] md:p-14 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* The line: the card's one statement, in the page's own sage. */}
          <p className="text-[32px] font-medium leading-[0.95] tracking-[-0.03em] text-paper sm:col-span-2 md:text-[40px] lg:col-span-1">
            {t.line}
          </p>
          {t.groups.map((group) => (
            <nav key={group.label} aria-label={group.label} className="flex flex-col items-start gap-3">
              <span className={`${LABEL} mb-2 text-slab-ink/50`}>{group.label}</span>
              {group.links.map(([href, label]) => (
                <LinkStyle key={href} tone="light" chrome>
                  <Link href={href} className="cursor-pointer text-[17px] no-underline">
                    {label}
                  </Link>
                </LinkStyle>
              ))}
            </nav>
          ))}
          <div className="flex flex-col items-start gap-3">
            <span className={`${LABEL} mb-2 text-slab-ink/50`}>{t.contact}</span>
            <LinkStyle tone="light" chrome>
              <a href={`mailto:${ADDRESS}`} className="cursor-pointer text-[17px] no-underline">
                {ADDRESS}
              </a>
            </LinkStyle>
            {/* The switches take the room a 17px text line keeps around its
                ink (about 6px above the capitals and below the baseline), so
                each label sits as far from its switch as from the address, and
                the groups stand equally far apart (Johannes, 2026-10-01). */}
            <span className={`${LABEL} mt-6 mb-2 text-slab-ink/50`}>{t.language}</span>
            <div className="my-1.5">
              <LanguageFlip locale={locale} />
            </div>
            {/* The page for people, or as agents read it (agent-view.tsx). */}
            <span className={`${LABEL} mt-6 mb-2 text-slab-ink/50`}>{t.view}</span>
            <div className="my-1.5">
              <ViewFlip locale={locale} />
            </div>
          </div>
        </div>
        {/* The wordmark, as wide as the card and cut by its bottom edge: the
            negative margin pulls the card's bottom up through the letters, so
            about a fifth of the capitals falls outside and is clipped. Sized in
            container units, so it spans the card at every width, and centred
            on its ink: the right padding takes back the tracking the last
            letter carries and the R's side bearing (measured 375–1728px,
            equal margins to the pixel; Johannes, 2026-09-30). */}
        <p
          aria-hidden="true"
          translate="no"
          className="-mb-[5.2cqw] select-none pr-[0.075em] text-center text-[35cqw] font-medium leading-[0.8] tracking-[-0.06em]"
        >
          Raban
        </p>
      </div>
    </footer>
  );
}

/** The card in Markdown, closing every page's Markdown (app/md/pages.ts): the
 *  line, the link columns and the address. */
export function footerMarkdown(locale: Locale): string {
  const t = T[locale];
  return blocks(
    `**Raban** · ${t.line}`,
    list([
      ...t.groups.map((group) => `${group.label}: ${group.links.map(([href, label]) => link(label, href)).join(" · ")}`),
      `${t.contact}: ${link(ADDRESS, `mailto:${ADDRESS}`)}`,
    ]),
  );
}
