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
      {/* One section, one frame (Johannes, 2026-10-07: "all one big
          section"): what the pitch won, and under it the pitch itself. */}
      <section className="relative pt-[var(--nav-h)]">
        {/* flow-root, so the deck's track can end the frame above its own
            foot on the phone (slide-stack.tsx: END). */}
        <div className="relative flow-root">
          <Brackets inset="0px" />
          {/* What it won fits the first screen, map and all (Johannes,
              2026-10-07, on his phone the map ran under the fold). */}
          <div
            className="relative flex min-h-[calc(100svh-var(--nav-h))] flex-col justify-center py-[var(--pad)] [--karte:min(500px,calc((100svh-var(--nav-h)-2*var(--pad))*0.772))] [--pad:32px] md:[--pad:96px] deck-squat:[--pad:16px]"
          >
            {/* On the desktop, and on a phone on its side, the heading takes
                what the map leaves, the map as tall as the screen allows (its
                box is 440 × 570). Heading and sentence stand together at the
                top, the tops of the heading's capitals on the map's top edge
                (`text-box` trims the line to its cap height). Johannes,
                2026-10-07: first the heading at the top and the sentence at
                the foot, on the baseline of the degrees under the map, left a
                hole between them; then both at the foot; then both at the
                top. On a phone held upright the map goes under the sentence
                and takes the height that is left, down in the right corner. */}
            <div className="flex flex-1 flex-col gap-8 deck-wide:grid deck-wide:flex-none deck-wide:grid-cols-[minmax(0,1fr)_auto] deck-wide:gap-16 deck-squat:gap-10">
              <div className="flex flex-col gap-6 @container md:gap-10 deck-squat:gap-6">
                <h1 className={`${DISPLAY_FIT} deck-wide:[text-box:trim-start_cap_alphabetic]`}>{award.title}</h1>
                <p className={`${BODY} max-w-[26em] text-pretty`}>{award.text}</p>
              </div>
              {/* The box the map fits is laid over its flex slot: a flex
                  item's own height is not yet known when Chrome resolves cqh
                  in it. */}
              <div className="relative min-h-[160px] flex-1 deck-wide:min-h-0 deck-wide:w-[var(--karte)] deck-wide:flex-none">
                <div className="absolute inset-0 flex items-end justify-end [container-type:size] deck-wide:static deck-wide:block deck-wide:[container-type:normal]">
                  <div className="w-[min(500px,100cqw,100cqh*0.772)] deck-wide:w-full">
                    <Karte {...award.map} opens />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* The deck's heading stands inside its stage, so the stage can
              be stuck from the top of its track (slide-stack.tsx). Its track
              starts a navbar higher, in the empty foot of the screen above,
              so the deck's heading follows the sentence at about the gap it
              keeps under the navbar once the deck is pinned. */}
          <div className="-mt-[var(--nav-h)]">
            <SlideStack title={T[locale].deck} slides={slidesFor(locale)} />
          </div>
        </div>
      </section>
    </main>
  );
}
