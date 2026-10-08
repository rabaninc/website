import type { Locale } from "@/utils/locale";
import { blocks, fromReact } from "@/utils/markdown";

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

// „Datenschutz“, as the navbar and the footer call the page: „Datenschutzerklärung“
// is one word too wide for a phone at title size (Johannes, 2026-10-02, over
// breaking it or setting it smaller than „Impressum“).
export const H1: Record<Locale, string> = { de: "Datenschutz", en: "Privacy policy" };
export const INDEX_LABEL: Record<Locale, string> = { de: "Auf dieser Seite", en: "On this page" };

export const ENTRIES: Entry[] = [
  {
    id: "controller",
    title: { de: "Verantwortlicher", en: "Controller" },
    body: {
      de: (
        <p>
          Raban GbR, vertreten durch Simon Waiß und Johannes Koch, Fichtenweg 22, 72076
          Tübingen, Deutschland.
          <br />
          E-Mail: humans@raban.ai
        </p>
      ),
      en: (
        <p>
          Raban GbR, represented by Simon Waiß and Johannes Koch, Fichtenweg 22, 72076
          Tübingen, Germany.
          <br />
          Email: humans@raban.ai
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
          Globus auf der Startseite auf Ihr Land zu richten, die Besuche zu
          zählen (beides siehe unten) und, falls Sie uns schreiben, das, was
          Sie selbst in diese Nachricht schreiben. Wir setzen keine Tracking-
          oder Werbe-Cookies und erstellen kein Profil von Ihnen.
        </p>
      ),
      en: (
        <p>
          This site processes what it needs to serve pages, point the homepage
          globe at your country, count visits (both below), and, if you write
          to us, whatever you put in that message yourself. We set no tracking
          or advertising cookies, and we do not build a profile of you.
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
  // <Analytics /> in app/layout.tsx (Vercel Web Analytics, 2026-10-08). What it
  // sends, the cookieless request hash and its 24 hours are Vercel's own words
  // (vercel.com/docs/analytics/privacy-policy, updated 26.06.2026, read
  // 08.10.2026). Hobby: 50,000 events a month, one month of history.
  {
    id: "visit-statistics",
    title: { de: "Besuchsstatistik", en: "Visit statistics" },
    body: {
      de: (
        <p>
          Um zu sehen, wie viele Menschen diese Website besuchen und woher sie
          kommen, nutzen wir Vercel Web Analytics. Jeder Seitenaufruf übermittelt
          die aufgerufene Seite, den Zeitpunkt, die Seite, von der Sie kommen,
          Ihren ungefähren Standort (Land, Region, Stadt), Ihren Browser, Ihr
          Betriebssystem und die Art Ihres Geräts. Es wird kein Cookie gesetzt.
          Um Besucher zu zählen, bildet Vercel aus der Anfrage einen Hashwert
          und verwirft ihn nach 24 Stunden; wir sehen nur Summen, nie einzelne
          Besucher. Rechtsgrundlage ist unser berechtigtes Interesse, zu
          verstehen, wie unsere Website gefunden und genutzt wird (Art. 6 Abs. 1
          lit. f DSGVO).
        </p>
      ),
      en: (
        <p>
          To see how many people visit this site and where they come from, we
          use Vercel Web Analytics. Each page view sends the page, the time, the
          page you came from, your approximate location (country, region, city),
          your browser, your operating system, and the type of device. No cookie
          is set. To count visitors, Vercel derives a hash from the request and
          discards it after 24 hours; we only see totals, never individual
          visitors. The legal basis is our legitimate interest in understanding
          how our site is found and used (Art. 6(1)(f) GDPR).
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
  // Nothing else is stored: the view switch under it (Mensch | Agent) lives in
  // the page's memory only. (The light/dark sentence went with the dark theme,
  // 2026-10-01; the theme itself was removed 2026-09-06.)
  {
    id: "cookies",
    title: { de: "Cookies", en: "Cookies" },
    body: {
      de: (
        <p>
          Diese Website setzt ein einziges Cookie: Ihre Sprachwahl, sobald Sie
          den Schalter in der Fußzeile benutzen. Es enthält nur „de“ oder „en“,
          bleibt ein Jahr gespeichert und ist nötig, um die Seite in der von
          Ihnen gewählten Sprache anzuzeigen (§ 25 Abs. 2 TDDDG).
        </p>
      ),
      en: (
        <p>
          This site sets a single cookie: your language choice, once you use
          the switch in the footer. It holds only “de” or “en”, is kept for one
          year, and is needed to show the site in the language you chose
          (§ 25 (2) TDDDG).
        </p>
      ),
    },
  },
  // Mail to humans@raban.ai lands in iCloud Mail, provided in the EU by Apple
  // Distribution International Ltd., Cork (apple.com/legal/internet-services/icloud,
  // revised 14.09.2026, read 03.10.2026). Only iCloud since 03.10.2026: Migadu is
  // retired, Google Workspace is off the table, Microsoft 365 may come later —
  // when the mailbox moves, this section and "transfers" change with it.
  {
    id: "recipients",
    title: { de: "Empfänger und Auftragsverarbeiter", en: "Recipients and processors" },
    body: {
      de: (
        <p>
          Vercel Inc., unser Hosting-Anbieter, verarbeitet die Anfragen, um
          diese Website zu betreiben und die Besuche zu zählen. Schreiben Sie uns eine E-Mail, liegt sie
          in unserem Postfach bei iCloud Mail, einem Dienst der Apple
          Distribution International Ltd. (Cork, Irland). Weitere Empfänger
          gibt es nicht.
        </p>
      ),
      en: (
        <p>
          Vercel Inc., our hosting provider, processes requests to run this
          site and to count visits. If you email us, your message is kept in our mailbox at iCloud
          Mail, a service of Apple Distribution International Ltd. (Cork,
          Ireland). There are no other recipients.
        </p>
      ),
    },
  },
  // vercel.json pins the function region to fra1 (Frankfurt). Without it Vercel
  // defaults to iad1, Washington D.C. (vercel.com/docs/regions, "Compute
  // defaults", read 28.08.2026) — and the home page is dynamic, because it reads
  // the geo headers, so it would have run there. Change that region and this
  // section has to change with it. Apple's own privacy policy (updated
  // 30.07.2025, read 03.10.2026) bases its transfers out of the EEA on standard
  // contractual clauses; the iCloud terms name no storage location.
  {
    id: "transfers",
    title: { de: "Datenübermittlung in Drittländer", en: "International data transfers" },
    body: {
      de: (
        <p>
          Der serverseitige Code dieser Website läuft in Frankfurt am Main,
          sodass Anfragen innerhalb der EU verarbeitet werden. Vercel ist ein
          US-Unternehmen und kann die Besuchsstatistik auch außerhalb der EU
          speichern; dafür und für jeden Zugriff von außerhalb der EU stützen
          wir uns auf die Standardvertragsklauseln der Europäischen Kommission.
          Apple kann E-Mails auch auf Servern außerhalb der EU speichern und
          stützt solche Übermittlungen ebenfalls auf die
          Standardvertragsklauseln.
        </p>
      ),
      en: (
        <p>
          This site’s server-side code runs in Frankfurt, Germany, so requests
          are processed inside the EU. Vercel is a US company and may store
          the visit statistics outside the EU; for that, and for any access
          from outside the EU, we rely on the European Commission’s standard
          contractual clauses. Apple may store emails on servers
          outside the EU and bases such transfers on the standard contractual
          clauses as well.
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

/** /privacy in Markdown: the title and every section with
 *  its number, as the page numbers them. */
export function markdown(locale: Locale): string {
  return blocks(
    `# ${H1[locale]}`,
    ...ENTRIES.map((entry, i) => blocks(`## ${i + 1}. ${entry.title[locale]}`, fromReact(entry.body[locale]))),
  );
}
