import type { Metadata } from "next";
import { Brackets } from "@/app/components/home/brackets";
import { BatchCalendar } from "@/app/components/pitch/batch-calendar";
import { SlideStack } from "@/app/components/pitch/slide-stack";
import { BODY, SECTION } from "@/app/components/type";
import { titleAt } from "@/app/md/pages";
import { getLocale } from "@/utils/locale-server";

import { AWARD, slidesFor, T } from "./copy";

// The tab and search results name the page (app/md/pages.ts).
export async function generateMetadata(): Promise<Metadata> {
  return { title: titleAt("/about", await getLocale()) };
}

// /about is the pitch deck, exactly as the founders present it (the stage
// pitch, nine slides; English, and German on the German page since
// 2026-10-03), cut from its PDFs by werkzeuge/pitch-folien/
// and shown as a stack that builds up while you scroll (slide-stack.tsx),
// with what the founders say to each slide beside it: the stage pitch
// script as Johannes wrote it minus the [pause] cues and three typos
// (2026-09-29), in German on the German page (2026-10-03). Slide 8 is the
// team. After the deck, one section like the home page's: what this pitch
// won, with a drawn calendar of the programme (2026-10-06).

export default async function AboutPage() {
  const locale = await getLocale();
  const award = AWARD[locale];
  return (
    <main className="px-[var(--inset)] pb-[var(--inset)] text-ink">
      {/* The page's heading stands inside the deck's stage, so the stage can
          be stuck from the top of the page (slide-stack.tsx). */}
      <SlideStack title={T[locale].deck} slides={slidesFor(locale)} />
      <section className="relative">
        <div className="relative py-20 md:py-[120px]">
          <Brackets inset="0px" />
          <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-16">
            <div>
              <h2 className={`${SECTION} max-w-[11ch]`}>{award.title}</h2>
              <p className={`${BODY} mt-8 max-w-[26em] text-pretty`}>
                {award.text}
              </p>
            </div>
            <div className="w-full max-w-[640px] lg:max-w-none">
              <BatchCalendar {...award} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
