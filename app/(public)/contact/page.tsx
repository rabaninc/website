import { getLocale } from "@/utils/locale-server";

import { ContactCard } from "./contact-card";

const T = {
  de: { h1: "Kontakt", line: "Keine Formulare, keine Funnels. Schreiben Sie uns einfach." },
  en: { h1: "Contact", line: "No forms, no funnels. Just write to us." },
} as const;

export default async function ContactPage() {
  const locale = await getLocale();
  const t = T[locale];
  return (
    <main className="px-[var(--inset)] pb-[var(--content-gap)] pt-[var(--content-top)]">
      <div className="space-y-[var(--header-gap)] text-base text-ink">
        <h1 className="text-[length:var(--h1)] font-black leading-[var(--h1-line)]">{t.h1}</h1>
        <p>{t.line}</p>
        <ContactCard locale={locale} />
      </div>
    </main>
  );
}
