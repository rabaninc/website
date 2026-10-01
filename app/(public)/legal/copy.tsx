import type { Locale } from "@/utils/locale";
import { blocks, fromReact } from "@/utils/markdown";

// Same data-driven shape as /privacy: one list feeds both the sticky index and
// the headings, the numbering falls out of the order rather than being typed
// in, and each entry carries its text as a `de`/`en` pair under one id.
//
// The provider is the GbR of both founders; its name and address match the
// contracts Raban signs, and the privacy policy's controller names the same.
type Entry = {
  id: string;
  title: Record<Locale, string>;
  body: Record<Locale, React.ReactNode>;
};

export const H1: Record<Locale, string> = { de: "Impressum", en: "Legal" };
export const INDEX_LABEL: Record<Locale, string> = { de: "Auf dieser Seite", en: "On this page" };
export const INTRO: Record<Locale, string> = {
  de: "Angaben gemäß § 5 DDG.",
  en: "Information pursuant to § 5 DDG (German Digital Services Act).",
};

export const ENTRIES: Entry[] = [
  {
    id: "provider",
    title: { de: "Anbieter", en: "Provider" },
    body: {
      de: (
        <p>
          Raban GbR, vertreten durch die Gesellschafter Simon Waiß und Johannes Koch.
          <br />
          Fichtenweg 22, 72076 Tübingen, Deutschland.
        </p>
      ),
      en: (
        <p>
          Raban GbR (German civil-law partnership), represented by its partners Simon Waiß and
          Johannes Koch.
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
          E-Mail: humans@raban.ai
        </p>
      ),
      en: (
        <p>
          Phone: +49 162 2091542
          <br />
          Email: humans@raban.ai
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

/** /legal in Markdown: the title, the note under it and every section with
 *  its number, as the page numbers them. */
export function markdown(locale: Locale): string {
  return blocks(
    `# ${H1[locale]}`,
    INTRO[locale],
    ...ENTRIES.map((entry, i) => blocks(`## ${i + 1}. ${entry.title[locale]}`, fromReact(entry.body[locale]))),
  );
}
