import {
  FlowSection,
  KnowledgeLivesSection,
  LoopSection,
  PricingSection,
} from "@/app/components/pitch/sections";
import { TeamBlock } from "@/app/components/pitch/team";
import { H1 } from "@/app/components/type";
import { getLocale } from "@/utils/locale-server";

// The team slide from the pitch deck (Raban Pitch v2, slide 8), then the
// deck's other slides as window cards — kept exactly as they were drawn,
// deck red included (founders' decision, 2026-09-28): the home page shows
// the app now, and the pitch lives here. The page closes with --inset like
// every page.
const T = {
  de: { h1: "Über uns" },
  en: { h1: "About us" },
} as const;

export default async function AboutPage() {
  const locale = await getLocale();
  return (
    <main className="px-[var(--inset)] pb-[var(--inset)] pt-[var(--content-top)]">
      <div className="space-y-[var(--content-gap)] text-base text-ink">
        <h1 className={H1}>{T[locale].h1}</h1>
        <TeamBlock locale={locale} />
        <KnowledgeLivesSection locale={locale} />
        <FlowSection locale={locale} />
        <LoopSection locale={locale} />
        <PricingSection locale={locale} />
      </div>
    </main>
  );
}
