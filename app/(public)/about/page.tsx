import type { Metadata } from "next";
import { Brackets } from "@/app/components/home/brackets";
import { Karte } from "@/app/components/pitch/karte";
import { SlideStack } from "@/app/components/pitch/slide-stack";
import { BODY, DISPLAY_FIT } from "@/app/components/type";
import { titleAt } from "@/app/md/pages";
import { getLocale } from "@/utils/locale-server";

import { AWARD, slidesFor, T } from "./copy";

// The tab and search results name the page (app/md/pages.ts).
export async function generateMetadata(): Promise<Metadata> {
  return { title: titleAt("/about", await getLocale()) };
}

// /about opens with what the pitch won (2026-10-06; Johannes: "maybe we
// should put the pitch deck second", then picked the map): one of the
// winning teams at AI Start, the heading at the display size its column
// allows, his sentence under it, and beside it the map that finds Heilbronn
// (karte.tsx), a screen high, as the page opens. Then the pitch deck, exactly
// as the founders present it (the stage pitch, nine slides; English, and
// German on the German page since 2026-10-03), cut from its PDFs by
// werkzeuge/pitch-folien/ and shown as a stack that builds up while you
// scroll (slide-stack.tsx), with what the founders say to each slide beside
// it: the stage pitch script as Johannes wrote it minus the [pause] cues and
// three typos (2026-09-29), in German on the German page (2026-10-03).
// Slide 8 is the team.

export default async function AboutPage() {
  const locale = await getLocale();
  const award = AWARD[locale];
  return (
    <main className="px-[var(--inset)] pb-[var(--inset)] text-ink">
      <section className="relative pt-[var(--nav-h)]">
        <div className="relative flex min-h-[calc(100svh-var(--nav-h))] flex-col justify-center py-20 md:py-24">
          <Brackets inset="0px" />
          {/* On the desktop the heading takes what the map leaves, the map
              as tall as the screen allows (its box is 440 × 570), the
              heading at the top and the sentence at the foot of it. */}
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
            <div className="flex flex-col justify-between gap-10 @container">
              <h1 className={DISPLAY_FIT}>{award.title}</h1>
              <p className={`${BODY} max-w-[26em] text-pretty`}>{award.text}</p>
            </div>
            <div className="w-full max-w-[500px] lg:w-[min(500px,calc((100svh-248px)*0.772))]">
              <Karte {...award.map} opens />
            </div>
          </div>
        </div>
      </section>
      {/* The deck's heading stands inside its stage, so the stage can be
          stuck from the top of its track (slide-stack.tsx). */}
      <SlideStack title={T[locale].deck} slides={slidesFor(locale)} />
    </main>
  );
}
