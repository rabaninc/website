import { getLocale } from "@/utils/locale-server";

import { ContactCard } from "./contact-card";

// The card is the whole page: the intro line that used to sit above it
// ("Keine Formulare, keine Funnels…") was dropped on 2026-09-06.
const T = {
  de: { h1: "Kontakt" },
  en: { h1: "Contact" },
} as const;

export default async function ContactPage() {
  const locale = await getLocale();
  const t = T[locale];
  return (
    <main className="px-[var(--inset)] pb-[var(--inset)] pt-[var(--content-top)]">
      <div className="space-y-[var(--header-gap)] text-base text-ink">
        <h1 className="text-[length:var(--h1)] font-black leading-[var(--h1-line)]">{t.h1}</h1>
        <ContactCard locale={locale} />
      </div>
    </main>
  );
}
