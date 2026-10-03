import { SlideStack } from "@/app/components/pitch/slide-stack";
import { getLocale } from "@/utils/locale-server";

import { SLIDES, T } from "./copy";

// /about is the pitch deck, exactly as the founders present it (the stage
// pitch, nine slides, English), cut from its PDF by werkzeuge/pitch-folien/
// and shown as a stack that builds up while you scroll (slide-stack.tsx),
// with what the founders say to each slide beside it: the stage pitch
// script as Johannes wrote it minus the [pause] cues and three typos
// (2026-09-29), in German on the German page (2026-10-03). Nothing else on
// the page but its heading: slide 8 is the team.

export default async function AboutPage() {
  const locale = await getLocale();
  return (
    <main className="px-[var(--inset)] pb-[var(--inset)] text-ink">
      {/* The page's heading stands inside the deck's stage, so the stage can
          be stuck from the top of the page (slide-stack.tsx). */}
      <SlideStack title={T[locale].deck} slides={SLIDES.map((s) => ({ ...s, script: s.script[locale] }))} />
    </main>
  );
}
