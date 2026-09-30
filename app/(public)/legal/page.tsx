import { SectionIndex, type Section } from "../../components/section-index";
import { H1 as H1_CLASS, H2 } from "@/app/components/type";
import { getLocale } from "@/utils/locale-server";

import { ENTRIES, H1, INDEX_LABEL, INTRO } from "./copy";

export default async function LegalPage() {
  const locale = await getLocale();
  const sections: (Section & { body: React.ReactNode })[] = ENTRIES.map((e) => ({
    id: e.id,
    title: e.title[locale],
    body: e.body[locale],
  }));
  return (
    <main className="px-[var(--inset)] pb-[var(--inset)] pt-[var(--content-top)] max-xl:pt-[calc(var(--content-top)+var(--nav-h))]">
      <div className="grid grid-cols-[1fr_minmax(0,var(--measure))_1fr] items-baseline gap-y-[var(--header-gap)]">
        <h1 className={`col-start-2 row-start-1 ${H1_CLASS}`}>
          {H1[locale]}
        </h1>
        <SectionIndex sections={sections} label={INDEX_LABEL[locale]} />
        <div className="col-start-2 row-start-2 min-w-0 space-y-[var(--header-gap)] text-base text-ink">
          <p>{INTRO[locale]}</p>
          {sections.map((section, i) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-[var(--content-top)] space-y-2 max-xl:scroll-mt-[calc(var(--content-top)+var(--nav-h))]"
            >
              <h2 className={H2}>
                {i + 1}. {section.title}
              </h2>
              {section.body}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
