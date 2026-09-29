import { Brackets } from "@/app/components/home/brackets";
import { DISPLAY, LABEL } from "@/app/components/type";
import { getLocale } from "@/utils/locale-server";

import { Address } from "./address";

// Kontakt in the home page's language (Johannes, 2026-09-29): a mono label,
// one display line, the address as the call to action, and why to write —
// Raban is looking for a second pilot company — in a hairline column.
// (History: two macOS-window cards, the address and the pilot call, from
// 2026-09-06 until then.)
const T = {
  de: {
    label: "Kontakt",
    display: "Schreib uns.",
    pilotLabel: "Zweites Pilotunternehmen",
    pilot: "Ein Unternehmen arbeitet bereits mit Raban. Wir suchen ein zweites, das das Wissen seiner Experten sichern will, bevor es mit ihnen geht, und das Raban dabei mitformt. Wenn das nach euch klingt, schreib uns.",
  },
  en: {
    label: "Contact",
    display: "Write to us.",
    pilotLabel: "Second pilot company",
    pilot: "One company is already working with Raban. We are looking for a second one that wants to secure its experts' knowledge before it leaves with them, and that shapes Raban along the way. If that sounds like you, write to us.",
  },
} as const;

export default async function ContactPage() {
  const locale = await getLocale();
  const t = T[locale];
  return (
    <main className="px-[var(--inset)] pb-[var(--inset)] pt-[var(--content-top)] text-ink">
      <section className="relative px-0 py-16 md:py-24">
        <Brackets inset="0px" />
        <p className={`${LABEL} mb-10`}>{t.label}</p>
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
