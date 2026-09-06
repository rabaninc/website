import { SectionIndex, type Section } from "../../components/section-index";
import { getLocale } from "@/utils/locale-server";
import type { Locale } from "@/utils/locale";

// One list feeds both the sticky index and the headings, so the order and the
// numbering can't drift. Each entry carries its title and body as a `de`/`en`
// pair under ONE id — the ids are the anchors the index, the navbar's phone
// bar and shared links point at, so they stay the same in both languages.
//
// A privacy policy has to describe what THIS site actually does — nothing here
// is carried over from another site, because a policy that describes someone
// else's data handling is worse than none. Sections that only existed for the
// other site's features (account login, AI voice interviews) are deliberately
// not here; add sections as the site grows features that need them. The globe
// IS here — this site has one.
type Entry = {
  id: string;
  title: Record<Locale, string>;
  body: Record<Locale, React.ReactNode>;
};

const H1: Record<Locale, string> = { de: "Datenschutzerklärung", en: "Privacy policy" };
const INDEX_LABEL: Record<Locale, string> = { de: "Auf dieser Seite", en: "On this page" };

const ENTRIES: Entry[] = [
  {
    id: "controller",
    title: { de: "Verantwortlicher", en: "Controller" },
    body: {
      de: (
        <p>
          Simon Waiß, Fichtenweg 22, 72076 Tübingen, Deutschland.
          <br />
          E-Mail: simon@simonwaiss.de
        </p>
      ),
      en: (
        <p>
          Simon Waiß, Fichtenweg 22, 72076 Tübingen, Germany.
          <br />
          Email: simon@simonwaiss.de
        </p>
      ),
    },
  },
  {
    id: "what-we-process",
    title: { de: "Was wir verarbeiten und warum", en: "What we process and why" },
    body: {
      de: (
        <p>
          Diese Website verarbeitet, was nötig ist, um Seiten auszuliefern, den
          Globus auf der Startseite auf Ihr Land zu richten (siehe unten) und,
          falls Sie uns schreiben, das, was Sie selbst in diese Nachricht
          schreiben. Wir betreiben keine Analyse, keine Tracking-Skripte und
          keine Werbe-Cookies.
        </p>
      ),
      en: (
        <p>
          This site processes what it needs to serve pages, point the homepage
          globe at your country (see below), and, if you write to us, whatever
          you put in that message yourself. We run no analytics, no tracking
          scripts, and no advertising cookies.
        </p>
      ),
    },
  },
  // The home page resolves the visitor's COUNTRY from Vercel's edge geo headers
  // to point the globe (utils/visitor-geo.ts): per request, never stored, no
  // cookie. It still has to be declared here.
  {
    id: "globe-location",
    title: { de: "Standort für den Globus auf der Startseite", en: "Location of the homepage globe" },
    body: {
      de: (
        <p>
          Der Globus auf der Startseite zeigt auf Ihr Land. Es stammt aus
          Headern, die unser Hosting-Anbieter Vercel jeder Anfrage hinzufügt.
          Das geschieht bei jeder Anfrage neu — nichts wird gespeichert, und es
          wird kein Cookie gesetzt.
        </p>
      ),
      en: (
        <p>
          The homepage globe points to your country, read from headers our
          hosting provider, Vercel, adds to each request. This happens fresh on
          every request — nothing is stored, and no cookie is set.
        </p>
      ),
    },
  },
  // One hour is the Hobby plan's runtime log retention, which is what this
  // project runs on (vercel.com/docs/logs/runtime, read 28.08.2026). Pro keeps
  // logs for a day and Enterprise for three, so an upgrade makes this sentence
  // wrong — change it with the plan.
  {
    id: "server-logs",
    title: { de: "Server-Logs", en: "Server logs" },
    body: {
      de: (
        <p>
          Das Ausliefern einer Seite hinterlässt einen Eintrag in den Logs
          unseres Hosting-Anbieters: die aufgerufene Seite, den Zeitpunkt, den
          HTTP-Status, den User-Agent des Browsers und die Region, die die
          Anfrage bearbeitet hat. Vercel löscht diese Einträge nach einer
          Stunde. Wir kopieren sie nirgendwohin und erstellen daraus kein Profil
          von Ihnen.
        </p>
      ),
      en: (
        <p>
          Serving a page leaves an entry in our hosting provider’s logs: the
          page requested, the time, the HTTP status, the browser’s user agent,
          and the region that handled it. Vercel deletes these after one hour.
          We do not copy them anywhere else, and we do not use them to build a
          profile of you.
        </p>
      ),
    },
  },
  // The language switch in the footer writes ONE cookie (LOCALE_COOKIE in
  // utils/locale.ts): "de" or "en", one year, nothing else. It is set only
  // when the visitor uses the switch, and it is what the server reads to
  // render the chosen language — strictly necessary, so no consent banner.
  // The theme choice stays in localStorage and never leaves the device.
  {
    id: "cookies",
    title: { de: "Cookies", en: "Cookies" },
    body: {
      de: (
        <p>
          Diese Website setzt ein einziges Cookie: Ihre Sprachwahl, sobald Sie
          den Schalter in der Fußzeile benutzen. Es enthält nur „de“ oder „en“,
          bleibt ein Jahr gespeichert und ist nötig, um die Seite in der von
          Ihnen gewählten Sprache anzuzeigen (§ 25 Abs. 2 TDDDG). Ihre
          Hell-/Dunkel-Wahl liegt im lokalen Speicher Ihres Browsers, nur auf
          Ihrem eigenen Gerät, und wird nie an uns übertragen.
        </p>
      ),
      en: (
        <p>
          This site sets a single cookie: your language choice, once you use
          the switch in the footer. It holds only “de” or “en”, is kept for one
          year, and is needed to show the site in the language you chose
          (§ 25 (2) TDDDG). Your light/dark choice is saved in your browser’s
          local storage, on your own device only, and never sent to us.
        </p>
      ),
    },
  },
  {
    id: "recipients",
    title: { de: "Empfänger und Auftragsverarbeiter", en: "Recipients and processors" },
    body: {
      de: (
        <p>
          Vercel Inc., unser Hosting-Anbieter, verarbeitet die Anfragen, um
          diese Website zu betreiben. Kein anderer Auftragsverarbeiter hat
          Zugriff.
        </p>
      ),
      en: (
        <p>
          Vercel Inc., our hosting provider, processes requests to run this
          site. No other processor has access.
        </p>
      ),
    },
  },
  // vercel.json pins the function region to fra1 (Frankfurt). Without it Vercel
  // defaults to iad1, Washington D.C. (vercel.com/docs/regions, "Compute
  // defaults", read 28.08.2026) — and the home page is dynamic, because it reads
  // the geo headers, so it would have run there. Change that region and this
  // section has to change with it.
  {
    id: "transfers",
    title: { de: "Datenübermittlung in Drittländer", en: "International data transfers" },
    body: {
      de: (
        <p>
          Der serverseitige Code dieser Website läuft in Frankfurt am Main,
          sodass Anfragen innerhalb der EU verarbeitet werden. Vercel ist ein
          US-Unternehmen; für jeden Zugriff von außerhalb der EU stützen wir
          uns auf die Standardvertragsklauseln der Europäischen Kommission.
        </p>
      ),
      en: (
        <p>
          This site’s server-side code runs in Frankfurt, Germany, so requests
          are processed inside the EU. Vercel is a US company, and for any
          access from outside the EU we rely on the European Commission’s
          standard contractual clauses.
        </p>
      ),
    },
  },
  {
    id: "your-rights",
    title: { de: "Ihre Rechte", en: "Your rights" },
    body: {
      de: (
        <p>
          Nach der DSGVO können Sie Auskunft über die Daten verlangen, die wir
          über Sie gespeichert haben, sie berichtigen oder löschen lassen, eine
          Kopie davon erhalten, ihre Verarbeitung einschränken lassen und einer
          Verarbeitung auf Grundlage berechtigter Interessen widersprechen.
          Wenden Sie sich dafür an die unter „Verantwortlicher“ genannten
          Kontaktdaten.
        </p>
      ),
      en: (
        <p>
          Under the GDPR, you can ask to see the data we hold on you, have it
          corrected or deleted, get a copy of it, limit how we use it, and
          object to processing based on legitimate interest. Contact us using
          the details in Controller above to use any of these.
        </p>
      ),
    },
  },
  {
    id: "complaint",
    title: { de: "Beschwerderecht", en: "Right to lodge a complaint" },
    body: {
      de: (
        <p>
          Sie können sich jederzeit bei einer Datenschutz-Aufsichtsbehörde
          beschweren — insbesondere in dem Mitgliedstaat, in dem Sie wohnen, in
          dem Sie arbeiten oder in dem der mutmaßliche Verstoß stattgefunden
          hat.
        </p>
      ),
      en: (
        <p>
          You can complain to a data protection supervisory authority at any
          time — in particular in the state where you live, where you work, or
          where you believe a violation took place.
        </p>
      ),
    },
  },
  {
    id: "automated-decisions",
    title: { de: "Automatisierte Entscheidungen", en: "Automated decision-making" },
    body: {
      de: (
        <p>
          Auf dieser Website findet keine automatisierte Entscheidungsfindung
          einschließlich Profiling statt.
        </p>
      ),
      en: <p>No automated decision-making, including profiling, takes place on this site.</p>,
    },
  },
  {
    id: "changes",
    title: { de: "Änderungen dieser Erklärung", en: "Changes to this policy" },
    body: {
      de: (
        <p>
          Diese Erklärung kann sich ändern, wenn sich die Website ändert. Die
          Fassung auf dieser Seite ist stets die aktuelle.
        </p>
      ),
      en: <p>This policy may change as the site changes. The version on this page is always the current one.</p>,
    },
  },
];

export default async function PrivacyPage() {
  const locale = await getLocale();
  const sections: (Section & { body: React.ReactNode })[] = ENTRIES.map((e) => ({
    id: e.id,
    title: e.title[locale],
    body: e.body[locale],
  }));
  return (
    <main className="px-[var(--inset)] pb-[var(--content-gap)] pt-[var(--content-top)] max-xl:pt-[calc(var(--content-top)+var(--nav-h))]">
      <div className="grid grid-cols-[1fr_minmax(0,var(--measure))_1fr] items-baseline gap-y-[var(--header-gap)]">
        <h1 className="col-start-2 row-start-1 text-[length:var(--h1)] font-black leading-[var(--h1-line)]">
          {H1[locale]}
        </h1>
        <SectionIndex sections={sections} label={INDEX_LABEL[locale]} />
        <div className="col-start-2 row-start-2 min-w-0 space-y-[var(--header-gap)] text-base text-ink">
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
