import type { Metadata } from "next";
import Link from "next/link";

import { titleAt } from "@/app/md/pages";
import { getLocale } from "@/utils/locale-server";
import { visitorGeo } from "@/utils/visitor-geo";

import { Globe } from "../components/globe";
import { Brackets } from "../components/home/brackets";
import { Faq } from "../components/home/faq";
import { Panel } from "../components/home/panel";
import { WINDOWS } from "../components/home/window/content";
import { AskScene, InputsScene, PlanScene, RecordScene, TaskScene } from "../components/home/window/scenes";
import { BARE, BODY, DISPLAY, LABEL, SECTION } from "../components/type";
import { T } from "./copy";

// The tab and search results name the page (app/md/pages.ts).
export async function generateMetadata(): Promise<Metadata> {
  return { title: titleAt("/", await getLocale()) };
}

// The home page carries the whole site since the rebuild of 2026-09-28, in
// typesafe.ai's style: the hero with the globe (sage since 2026-09-30), then the
// problem as one big statement, the app in five rows the way x.ai/build shows
// its product (a macOS window with the app drawn in it, left and right in
// turn, the text beside it), the prices, the questions, and the footer card.
// The words are in ./copy.ts, which also writes them as Markdown for the
// agent view.

/** One section of the sage body: the page inset to the sides, typesafe's
 *  generous 120px above and below, bracket marks on its corners. A section
 *  that follows another moves up 1px, so its top brackets land on the same
 *  pixel row as the bottom brackets above instead of stacking under them into
 *  a double-weight line. */
function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`relative scroll-mt-[var(--nav-h)] px-[var(--inset)] [section+&]:-mt-px ${className}`}>
      <div className="relative py-20 md:py-[120px]">
        <Brackets inset="0px" />
        {children}
      </div>
    </section>
  );
}

/** The five drawn windows, by the name each row gives its scene. */
const SCENES = { record: RecordScene, plan: PlanScene, ask: AskScene, task: TaskScene, inputs: InputsScene } as const;

function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden className="mt-[3px] flex-none">
      <path d="M2.5 7.5l3 3 6-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default async function HomePage() {
  // Seed the globe with the visitor's country, derived server-side from Vercel's
  // edge geo headers for this request only (see utils/visitor-geo.ts). The globe
  // falls back to a default when the headers are absent (e.g. local dev).
  const locale = await getLocale();
  const geo = await visitorGeo(locale);
  const t = T[locale];

  return (
    // The whole page stands on the sage, the hero included (2026-09-30), and
    // what sits on the hero — lede, deck, globe — is in the page's ink.
    <main className="relative bg-paper" style={{ display: "flow-root" }}>
      {/* The hero keeps its layout from before the rebuild: the lede top left,
          the deck pinned to the bottom right of the first screen, the globe
          behind both. inset-x gives the absolute box a real width; min-h runs
          it to the bottom of the first screen as a flex column. */}
      <div className="absolute inset-x-[var(--gutter)] top-[var(--tagline-top)] z-10 flex min-h-[calc(100svh-var(--tagline-top))] flex-col">
        {/* Lede: typesafe's display type — medium weight, leading under 1,
            tight tracking — sized to the viewport between 48px and 136px. It
            is set in three fixed lines (Johannes, 2026-09-30), so on a narrow
            phone the size also stops where the longest line still fits the
            width: ledeEm is that line in em, measured in Inter, the wider of
            the two faces (SF needs about 9% less). */}
        <h1
          className="text-[length:min(clamp(3rem,8.6vw,8.5rem),calc((100vw-2*var(--gutter))/var(--lede-em)))] font-medium leading-[0.86] tracking-[-0.035em] whitespace-pre-line [&:lang(en)]:capitalize"
          style={{ "--lede-em": t.ledeEm } as React.CSSProperties}
        >
          {t.lede}
        </h1>
        {/* Deck: pinned to the bottom-right corner of the first screen, set
            ragged right, --hero-bottom above the fold. Running text, so the
            body's weight, like typesafe's; only headlines take medium. On a
            phone held upright it is narrower and sits lower, 40px above the
            fold, so it reads as set to the right instead of filling the
            width (Johannes, 2026-10-04; hung right under the globe marker it
            looked odd). */}
        <p className="mt-auto mb-[var(--hero-bottom)] max-w-[min(100%,34ch)] self-end pt-6 text-[17px] leading-[1.3] max-md:portrait:mb-10 max-md:portrait:max-w-[14em] md:text-xl">
          {t.deck}
        </p>
      </div>
      {/* height = 100vw * scale per breakpoint; scales must match getEndScale() in globe-map.tsx, else a gap appears.
          The globe centre (the visitor's own country marker) rests at --hero-marker, between the lede and the deck.
          Below the marker the globe dissolves (mask 65% → 90%). The sphere fills the section at every breakpoint,
          so a line in percent is the same point on the globe everywhere, and measured on retina renders from 375 to
          2560px wide its lines stop being visible on the 85% line at every size. That is where the first section's
          frame (its corner brackets) begins, with "Warum Raban" one section padding below — but never closer than
          200px under the deck: on phones and tall screens the globe fades out right under the deck, and the section
          needs that much air from the hero (Johannes and Claude, 2026-10-01, after a day of trying fixed distances
          from the fade, which put the label too close on phones and far too low on an iPad mini). The section's
          negative bottom margin does it: the globe's bottom half minus whichever of the two lines is lower, the 85%
          line (0.35 of the height below the marker) or 200px under the deck (whose bottom is --hero-bottom above
          the fold). On a very tall screen that turns positive and pushes the body down, which is fine on the sage.
          pointer-events-none so the overlapped strip belongs to the body, not the globe. */}
      <section className="pointer-events-none relative flex w-screen items-center justify-center mask-b-from-65% mask-b-to-90% h-[250vw] mt-[calc(var(--hero-marker)-125vw)] mb-[calc(-1*min(37.5vw,var(--hero-marker)+125vw+var(--hero-bottom)-200px-100svh))] md:h-[175vw] md:mt-[calc(var(--hero-marker)-87.5vw)] md:mb-[calc(-1*min(26.25vw,var(--hero-marker)+87.5vw+var(--hero-bottom)-200px-100svh))] lg:h-[100vw] lg:mt-[calc(var(--hero-marker)-50vw)] lg:mb-[calc(-1*min(15vw,var(--hero-marker)+50vw+var(--hero-bottom)-200px-100svh))]">
        <Globe geo={geo} />
      </section>

      {/* The sage body, no fill of its own: its top overlaps the globe's fading tail, and the globe should fade out
          behind it rather than be cut off at its edge. relative so it paints above the globe. */}
      <div className="relative text-ink">
        {/* Why: the problem as one statement, then three principles in
            typesafe's hairline columns. */}
        <Section>
          <p className={`${LABEL} mb-10 text-center`}>{t.why.label}</p>
          <h2 className={`${DISPLAY} mx-auto max-w-[14ch] text-center`}>{t.why.display}</h2>
          <p className={`${BODY} mx-auto mt-10 max-w-[44ch] text-center`}>{t.why.sub}</p>
          <div className="mx-auto mt-20 grid max-w-5xl gap-8 sm:grid-cols-3">
            {t.why.principles.map(([label, text]) => (
              <div key={label} className="border-l border-ink/30 pl-3">
                <p className={`${LABEL} mb-6`}>{label}</p>
                <p className="text-[17px] leading-[1.25]">{text}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* How: the app in five rows the way x.ai/build shows its product —
            knowledge going in, coming out, the gap, Raban doing a step
            itself, and what that task draws on (Johannes, 2026-09-30). The window stands left in the
            first row and swaps sides row by row; on narrow screens the text
            comes first, the window under it. A phone turned sideways (768px
            and up, landscape) gets the rows side by side too, 3:2 with the
            phone's heading size, since stacked the window stood taller than
            its screen (Johannes, 2026-10-02); tablets upright stay stacked. */}
        <Section id="so-arbeitet-raban">
          <h2 className={`${SECTION} mb-16 max-w-[16ch] md:mb-24`}>{t.how}</h2>
          <div className="space-y-24 md:space-y-36">
            {t.rows.map((row, i) => {
              const Scene = SCENES[row.scene];
              const windowFirst = i % 2 === 0;
              return (
                <article
                  key={row.tag}
                  className={`grid items-center gap-10 md:landscape:gap-8 lg:gap-16 lg:landscape:gap-16 ${
                    windowFirst
                      ? "md:landscape:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:grid-cols-[minmax(0,9fr)_minmax(0,5fr)] lg:landscape:grid-cols-[minmax(0,9fr)_minmax(0,5fr)]"
                      : "md:landscape:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:grid-cols-[minmax(0,5fr)_minmax(0,9fr)] lg:landscape:grid-cols-[minmax(0,5fr)_minmax(0,9fr)]"
                  }`}
                >
                  <div className={`max-w-[36rem] ${windowFirst ? "md:landscape:order-2 lg:order-2" : ""}`}>
                    <p className={`${LABEL} mb-5`}>{row.tag}</p>
                    <h3 className="text-[30px] font-medium leading-[1.02] tracking-[-0.022em] text-balance md:portrait:text-[40px] lg:text-[40px] [&:lang(en)]:capitalize">
                      {row.title}
                    </h3>
                    <p className={`${BODY} mt-5`}>{row.body}</p>
                    <ul className="mt-6 space-y-2.5">
                      {row.points.map((point) => (
                        <li key={point} className={`${BARE} flex gap-2.5 text-[15px] leading-[1.35]`}>
                          <Check />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Panel tag={row.panel}>
                    <Scene c={WINDOWS[locale]} label={row.alt} />
                  </Panel>
                </article>
              );
            })}
          </div>
        </Section>

        {/* Pricing: typesafe's big numbers, each with a small line under it. */}
        <Section id="preise">
          {/* The pilot line is a footnote to the heading: it starts right
              after the star on "Preise", in the mono, its first capitals
              level with the top of the star (0.139em into the heading's line
              box, 4px into the line's — measured in SF), running the full
              width to the page edge. */}
          <div className="mb-16 flex items-start gap-1 md:mb-24">
            <h2 className={`${SECTION} shrink-0`}>{t.pricing.title}*</h2>
            <p className={`${LABEL} mt-[calc(var(--section)*0.139_-_4px)] min-w-0 flex-1 text-[13px] leading-[1.4]`}>
              {t.pricing.pilot}
            </p>
          </div>
          <div className="grid gap-12 md:grid-cols-[1.7fr_1fr_1fr] md:gap-8">
            {t.pricing.stats.map(([value, label]) => (
              <div key={value} className="border-l border-ink/30 pl-3">
                <p className="whitespace-nowrap text-[clamp(44px,4.8vw,80px)] font-medium leading-[0.9] tracking-[-0.035em]">
                  {value}
                </p>
                <p className={`${BARE} mt-4 max-w-[26ch] text-[15px] leading-[1.3]`}>{label}</p>
              </div>
            ))}
          </div>
          <div className="mt-20 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <p className={`${BODY} max-w-[40ch]`}>{t.pricing.note}</p>
            {/* typesafe's call to action: a heading-sized link, underlined. */}
            <Link
              href="/contact"
              className="text-[28px] font-medium leading-none tracking-[-0.02em] underline decoration-1 underline-offset-[6px] hover:text-ink/60"
            >
              {t.pricing.cta}
            </Link>
          </div>
        </Section>

        {/* Questions. */}
        <Section className="pb-[var(--inset)]">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,8fr)] lg:gap-16">
            <h2 className={`${SECTION} max-w-[10ch]`}>{t.faq.title}</h2>
            <Faq items={t.faq.items} />
          </div>
        </Section>
      </div>
    </main>
  );
}
