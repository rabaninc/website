import type { Metadata } from "next";
import { Brackets } from "@/app/components/home/brackets";
import { Anzeigetafel } from "@/app/components/pitch/anzeigetafel";
import { BatchCalendar } from "@/app/components/pitch/batch-calendar";
import { Karte } from "@/app/components/pitch/karte";
import { Siegel } from "@/app/components/pitch/siegel";
import { SlideStack } from "@/app/components/pitch/slide-stack";
import { BODY, SECTION, TAG } from "@/app/components/type";
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
// team.
//
// PREVIEW (2026-10-06): what this pitch won comes first now, the deck
// second (Johannes: "maybe we should put the pitch deck second"), in four
// graphics one under the other, each a screen of its own, for Johannes to
// pick from; the one he picks stays, the others go.

/** One variant, a screen high, its name in the top left corner. */
function Variant({ tag, first = false, children }: { tag: string; first?: boolean; children: React.ReactNode }) {
  return (
    <section className={`relative [section+&]:-mt-px ${first ? "pt-[var(--nav-h)]" : ""}`}>
      <div
        className={`relative flex flex-col justify-center py-20 md:py-24 ${
          first ? "min-h-[calc(100svh-var(--nav-h))]" : "min-h-[100svh]"
        }`}
      >
        <Brackets inset="0px" />
        <p className={`${TAG} absolute left-4 top-4`}>{tag}</p>
        {children}
      </div>
    </section>
  );
}

/** The heading and the sentence beside a graphic, as „Eure Daten“ sets them. */
function Beside({ title, text, children }: { title: string; text: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-16">
      <div>
        <h2 className={`${SECTION} max-w-[11ch]`}>{title}</h2>
        <p className={`${BODY} mt-8 max-w-[26em] text-pretty`}>{text}</p>
      </div>
      <div className="w-full max-w-[640px] lg:max-w-none">{children}</div>
    </div>
  );
}

export default async function AboutPage() {
  const locale = await getLocale();
  const award = AWARD[locale];
  return (
    <main className="px-[var(--inset)] pb-[var(--inset)] text-ink">
      <Variant tag="Variante A · Anzeigetafel" first>
        <h2 className="sr-only">{award.title}</h2>
        <Anzeigetafel {...award.board} opens />
        <p className={`${BODY} mt-10 max-w-[30em] text-pretty md:mt-14`}>{award.text}</p>
      </Variant>
      <Variant tag="Variante B · Siegel">
        <Beside title={award.title} text={award.text}>
          <Siegel {...award.seal} />
        </Beside>
      </Variant>
      <Variant tag="Variante C · Karte">
        <Beside title={award.title} text={award.text}>
          <Karte {...award.map} />
        </Beside>
      </Variant>
      <Variant tag="Variante D · Kalender (bisher)">
        <Beside title={award.title} text={award.text}>
          <BatchCalendar {...award} />
        </Beside>
      </Variant>
      {/* The page's heading stands inside the deck's stage, so the stage can
          be stuck from the top of its track (slide-stack.tsx). */}
      <SlideStack title={T[locale].deck} slides={slidesFor(locale)} />
    </main>
  );
}
