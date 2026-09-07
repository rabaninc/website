import { getLocale } from "@/utils/locale-server";

import { ContactCard } from "./contact-card";
import { PilotCard } from "./pilot-card";

// Two cards: the address, and under it why to write — Raban is looking for
// a second pilot company (pilot-card.tsx, 2026-09-07). The cards sit
// --content-gap apart like the slides on /product, the air a card needs
// from the next; the heading keeps that same gap to the first card, as on
// /product. (History: the address card was the whole page, and the intro
// line that used to sit above it, "Keine Formulare, keine Funnels…", was
// dropped on 2026-09-06.)
const T = {
  de: { h1: "Kontakt" },
  en: { h1: "Contact" },
} as const;

export default async function ContactPage() {
  const locale = await getLocale();
  const t = T[locale];
  return (
    <main className="px-[var(--inset)] pb-[var(--inset)] pt-[var(--content-top)]">
      <div className="space-y-[var(--content-gap)] text-base text-ink">
        <h1 className="text-[length:var(--h1)] font-black leading-[var(--h1-line)]">{t.h1}</h1>
        <ContactCard locale={locale} />
        <PilotCard locale={locale} />
      </div>
    </main>
  );
}
