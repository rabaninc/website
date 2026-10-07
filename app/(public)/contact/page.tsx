import type { Metadata } from "next";
import { DISPLAY, LABEL } from "@/app/components/type";
import { titleAt } from "@/app/md/pages";
import { getLocale } from "@/utils/locale-server";

import { Address } from "./address";
import { T } from "./copy";

// The tab and search results name the page (app/md/pages.ts).
export async function generateMetadata(): Promise<Metadata> {
  return { title: titleAt("/contact", await getLocale()) };
}

// Kontakt in the home page's language (Johannes, 2026-09-29): one display
// line (its mono label „Kontakt“ above it went on 2026-10-01; the navbar
// names the page), the address as the call to action, and why to write —
// Raban is looking for a second pilot company — in a hairline column.
// (History: two macOS-window cards, the address and the pilot call, from
// 2026-09-06 until then.)
export default async function ContactPage() {
  const locale = await getLocale();
  const t = T[locale];
  return (
    <main className="px-[var(--inset)] pb-[var(--inset)] pt-[var(--content-top)] text-ink">
      {/* No bracket marks: the one section is the page's top and foot
          (brackets.tsx; Johannes, 2026-10-07). */}
      <section className="relative px-0 py-16 md:py-24">
        <h1 className={`${DISPLAY} max-w-[12ch]`}>{t.display}</h1>
        <div className="mt-12 md:mt-16">
          <Address locale={locale} />
        </div>
        <div className="mt-20 max-w-md border-l border-ink/30 pl-3">
          <p className={`${LABEL} mb-6`}>{t.pilotLabel}</p>
          <p className="text-[17px] leading-[1.3]">{t.pilot}</p>
        </div>
      </section>
    </main>
  );
}
