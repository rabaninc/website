import { TITLE, TrafficLights, WINDOW } from "@/app/components/pitch/window-card";
import type { Locale } from "@/utils/locale";

// The second card on /contact (2026-09-07): why someone should write. Raban
// runs with one pilot company and is looking for a second; this says so in
// the reader's direction, under the address card, in the same window the
// slides sit in (window-card.tsx) — lights, a slide-scale title, a short
// paragraph held to --measure — with no graphic. The founders asked for it
// as the answer to a contact page that ended a third of the way down the
// screen with the grey slab filling the rest. (The pitch script's closer,
// "Pilot im September", stays out: that slide is investor-facing and dated;
// this one is a standing invitation.) Draft copy, like every sentence on
// the site: founder sign-off before it goes live.
const T = {
  de: {
    title: "Wir suchen ein zweites Pilotunternehmen",
    para: "Ein Unternehmen arbeitet bereits mit Raban. Wir suchen ein zweites, das das Wissen seiner Experten sichern will, bevor es mit ihnen geht — und das Raban dabei mitformt. Wenn das nach Ihnen klingt, schreiben Sie uns.",
  },
  en: {
    title: "We are looking for a second pilot company",
    para: "One company is already working with Raban. We are looking for a second one that wants to secure its experts' knowledge before it leaves with them — and that shapes Raban along the way. If that sounds like you, write to us.",
  },
} as const;

export function PilotCard({ locale = "de" }: { locale?: Locale }) {
  const t = T[locale];
  return (
    <section className={`space-y-[var(--header-gap)] ${WINDOW}`}>
      <TrafficLights />
      <div className="max-w-[var(--measure)] space-y-[var(--header-gap)]">
        <h2 className={TITLE}>{t.title}</h2>
        <p className="text-lg">{t.para}</p>
      </div>
    </section>
  );
}
