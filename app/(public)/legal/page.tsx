import { SectionIndex, type Section } from "../../components/section-index";
import { getLocale } from "@/utils/locale-server";
import type { Locale } from "@/utils/locale";

// Same data-driven shape as /privacy: one list feeds both the sticky index and
// the headings, the numbering falls out of the order rather than being typed
// in, and each entry carries its text as a `de`/`en` pair under one id.
//
// Filled with Simon Waiß's sole proprietorship as an interim provider: Raban
// has a second founder (Johannes Koch), and whether the two of them running
// the business together already forms a GbR under German law is still open.
// Revisit this section once that is resolved.
type Entry = {
  id: string;
  title: Record<Locale, string>;
  body: Record<Locale, React.ReactNode>;
};

const H1: Record<Locale, string> = { de: "Impressum", en: "Legal" };
const INDEX_LABEL: Record<Locale, string> = { de: "Auf dieser Seite", en: "On this page" };
const INTRO: Record<Locale, string> = {
  de: "Angaben gemäß § 5 DDG.",
  en: "Information pursuant to § 5 DDG (German Digital Services Act).",
};

const ENTRIES: Entry[] = [
  {
    id: "provider",
    title: { de: "Anbieter", en: "Provider" },
    body: {
      de: (
        <p>
          Simon Waiß, Einzelunternehmen.
          <br />
          Fichtenweg 22, 72076 Tübingen, Deutschland.
        </p>
      ),
      en: (
        <p>
          Simon Waiß, sole proprietorship (Einzelunternehmen).
          <br />
          Fichtenweg 22, 72076 Tübingen, Germany.
        </p>
      ),
    },
  },
  {
    id: "contact",
    title: { de: "Kontakt", en: "Contact" },
    body: {
      de: (
        <p>
          Telefon: +49 162 2091542
          <br />
          E-Mail: simon@simonwaiss.de
        </p>
      ),
      en: (
        <p>
          Phone: +49 162 2091542
          <br />
          Email: simon@simonwaiss.de
        </p>
      ),
    },
  },
  {
    id: "dispute-resolution",
    title: { de: "Verbraucherstreitbeilegung", en: "Consumer dispute resolution" },
    body: {
      de: (
        <p>
          Wir sind nicht verpflichtet und nicht bereit, an
          Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
          teilzunehmen.
        </p>
      ),
      en: (
        <p>
          We are not obligated to participate in dispute resolution proceedings
          before a consumer arbitration board, and do not intend to.
        </p>
      ),
    },
  },
];

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
        <h1 className="col-start-2 row-start-1 text-[length:var(--h1)] font-black leading-[var(--h1-line)]">
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
              <h2 className="text-[length:var(--h2)] font-bold leading-[var(--h2-line)]">
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
