import Link from "next/link";

import type { Locale } from "@/utils/locale";

import { LanguageFlip } from "./language-flip";
import { LinkStyle } from "./link-style";

// The footer's link groups: a label and its routes, in both languages. Declared
// here so the markup below stays a single map and a new group is one entry, not
// new JSX. The nav routes deliberately don't appear here — they're already in
// the navbar on every page, and repeating them gave the footer a column that
// earned nothing.
const GROUPS: Record<Locale, { label: string; links: [string, string][] }[]> = {
  de: [
    {
      label: "Rechtliches",
      links: [
        ["/privacy", "Datenschutz"],
        ["/legal", "Impressum"],
      ],
    },
  ],
  en: [
    {
      label: "Terms & Policies",
      links: [
        ["/privacy", "Privacy policy"],
        ["/legal", "Legal"],
      ],
    },
  ],
};

export function Footer({ locale }: { locale: Locale }) {
  return (
    <footer
      // vw-based page heights land on a fractional pixel at some viewport
      // widths, leaving a <1px sliver of canvas below the footer. This 1px
      // box-shadow covers it without affecting layout. Purely structural: the
      // footer takes no lift shadow (nothing sits below it to catch one). It
      // paints the slab's own colour rather than black — the slab is light grey,
      // not ink, so a black line there would draw an edge instead of hiding one.
      // The footer itself is square now: the curve belongs to the
      // paper card above it, which the slab shows through at the corners.
      style={{ boxShadow: "0 1px 0 0 var(--slab)" }}
      className="relative w-screen bg-slab p-[var(--gutter)] text-[12px] text-slab-ink"
    >
      <div className="flex justify-between gap-[var(--header-gap)]">
        {/* The wordmark at the top, the language flip at the bottom: justify-between
            spreads them over the column's full height, which the link groups
            opposite set, so the pills line up with the last link rather than
            hanging under the wordmark with dead space beneath. The gap is the
            floor for when the column has nothing to stretch to. */}
        <div className="flex flex-none flex-col items-start justify-between gap-4">
          <span>Raban</span>
          {/* (History: a theme flip sat beside it, 16px to the right, until
              the dark theme came out on 2026-09-06.) */}
          <LanguageFlip locale={locale} />
        </div>
        {/* The groups sit opposite the wordmark at every width — on a phone too,
            where there's room for one column beside it. A second group stacks
            under the first on phones and moves alongside it once there's room;
            the horizontal gap between columns stays wider than any vertical gap
            inside them, so they read as separate lists rather than one grid. */}
        <div className="flex flex-col gap-[var(--header-gap)] sm:flex-row sm:gap-[calc(var(--gutter)*2)]">
          {GROUPS[locale].map((group) => (
            <div key={group.label} className="flex flex-col items-start gap-4">
              {/* Group label: the same size and weight as the links it heads,
                  and at full ink — tone is still the only thing separating them,
                  but the split now runs the other way. Clickable text rests at
                  half ink everywhere off the navbar, so the links recede on
                  their own and the label doesn't have to be held back to stay
                  distinct from them; half-strength here would make it identical
                  to its own list at rest. (History: it sat at slab-ink/50 as the
                  one deliberate exception to the full-ink rule, back when the
                  links beside it were full ink too — the exception is gone, not
                  overlooked.) The gap below it matches the gap between the
                  links, so it reads as the head of the list, not a caption. */}
              <span>{group.label}</span>
              {group.links.map(([href, label]) => (
                <LinkStyle key={href} tone="light" highlight={false}>
                  <Link href={href} className="cursor-pointer no-underline">
                    {label}
                  </Link>
                </LinkStyle>
              ))}
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
