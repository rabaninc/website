import Link from "next/link";

import { getLocale } from "@/utils/locale-server";
import { visitorGeo } from "@/utils/visitor-geo";

import { Globe } from "../components/globe";
import { Brackets } from "../components/home/brackets";
import { Faq } from "../components/home/faq";
import { Panel } from "../components/home/panel";
import { WINDOWS } from "../components/home/window/content";
import { AskScene, PlanScene, RecordScene, TaskScene } from "../components/home/window/scenes";
import { BARE, BODY, DISPLAY, LABEL, SECTION } from "../components/type";

// The home page carries the whole site since the rebuild of 2026-09-28, in
// typesafe.ai's style: the white hero with the globe, then on the sage the
// problem as one big statement, the app in four rows the way x.ai/build shows
// its product (a macOS window with the app drawn in it, left and right in
// turn, the text beside it), the prices, the questions, and the footer card. Every sentence is a draft until
// the founders sign it off; the app is addressed with "Du", as inside the app.
const T = {
  de: {
    lede: "Behält Wissen\nwenn Leute\ngehen.",
    ledeEm: 6.5,
    deck: "Frag Raban, und du bekommst die Antwort aus euren Unterlagen, mit Fundstelle. Steht sie nirgends, fragt Raban den Menschen, der es weiß.",
    why: {
      label: "Warum Raban",
      display: "Das Wichtigste steht in keinem Ordner.",
      sub: "Es steckt in den Köpfen weniger Menschen. Gehen sie in Rente oder wechseln sie, geht es mit. Raban hält es fest: aus den Unterlagen, wo es steht, und von den Menschen, wo es fehlt.",
      principles: [
        ["Mit Fundstelle", "Jede Antwort zeigt, woher sie kommt: Dokument und Stelle, oder die Person."],
        ["Kein Raten", "Weiß Raban etwas nicht, sagt Raban das offen und fragt nach."],
        ["Mit Namen", "Für jede Antwort steht ein Mensch ein, mit Namen und Datum."],
      ],
    },
    how: "So arbeitet Raban",
    rows: [
      {
        tag: "01 Aufzeichnen",
        panel: "Aufzeichnen per Sprache",
        scene: "record",
        alt: "Raban hört zu, wie jemand erklärt, was zu tun ist, wenn der Druck links schmiert, fragt nach und hält die Schritte in vier Phasen fest.",
        title: "Erzähl es einmal. Raban schreibt mit.",
        body: "Erklär eine Aufgabe, wie du sie einem Azubi erklären würdest. Raban hört zu, fragt nach, wo etwas fehlt, und hält die Schritte fest, während du sprichst.",
        points: [
          "Sprechen oder tippen, wie es gerade passt",
          "Raban fragt nach, bis es verstanden hat",
          "Du siehst sofort, was angekommen ist",
        ],
      },
      {
        tag: "02 Fragen",
        panel: "Plan mit Quellen",
        scene: "plan",
        alt: "Jemand fragt, was zu tun ist, wenn Schachteln an der Klebelasche aufgehen, und Raban antwortet mit einem Plan in fünf Schritten, jeder mit seiner Quelle.",
        title: "Frag, wie es geht, und Raban zeigt dir den Plan.",
        body: "Stell deine Frage in eigenen Worten. Raban antwortet in Schritten, zusammengesetzt aus Arbeitsanweisung, Bedienungsanleitung und dem, was Kollegen erzählt haben.",
        points: [
          "Schritt für Schritt statt langer Texte",
          "Jeder Schritt zeigt, woher er kommt",
          "Am Rechner und am Handy",
        ],
      },
      {
        tag: "03 Nachfragen",
        panel: "Bitte an eine Person",
        scene: "ask",
        alt: "Raban findet zu einer Frage nichts in den Unterlagen, schlägt vor, die Kollegin zu fragen, die die Zahl eingetragen hat, und schickt ihr die Bitte.",
        title: "Steht es nirgends, fragt Raban den Menschen, der es weiß.",
        body: "Raban rät nicht. Raban sagt offen, dass die Antwort fehlt, und schlägt vor, wen es fragen soll. Ein Tipp von dir, und die Bitte geht raus. Die Person antwortet einmal, und ab da gilt ihre Antwort für alle, mit Namen und Datum.",
        points: [
          "Raban schlägt die zuständige Person vor, du kannst sie ändern",
          "Jede Antwort zeigt, wer sie bestätigt hat und wann",
          "Stimmt etwas nicht mehr, korrigierst du es mit einem Tipp",
        ],
      },
      {
        tag: "04 Erledigen",
        panel: "Raban füllt den Bericht",
        scene: "task",
        alt: "Links eine festgehaltene Aufgabe in fünf Schritten, rechts füllt Raban beim vierten Schritt den Reklamationsbericht aus, mit Quelle je Feld.",
        title: "Was Raban selbst kann, erledigt Raban.",
        body: "Steht in einem Ablauf ein Bericht oder Formular an, füllt Raban es aus: aus euren Unterlagen und Protokollen, mit Quelle je Feld. Was Raban nicht weiß, geht an die richtige Person. Bevor etwas rausgeht, prüfst du.",
        points: [
          "Formulare und Berichte vorausgefüllt",
          "Quelle zu jedem Feld",
          "Nach außen gibt ein Mensch frei",
        ],
      },
    ],
    pricing: {
      label: "Preise",
      title: "Preise",
      stats: [
        ["1.000–9.000 €", "Einrichtung, einmalig, je nach Standort"],
        ["250 €", "Grundgebühr im Monat, für Wartung und Updates"],
        ["~25 €", "je Mitarbeiter und Monat, deckt die KI-Kosten"],
      ],
      note: "Euer Wissen gehört euch. Ihr bekommt eure Daten jederzeit als ZIP.",
      cta: "Pilot anfragen",
    },
    faq: {
      title: "Häufige Fragen",
      items: [
        {
          q: "Müssen wir Raban an unsere Systeme anschließen?",
          a: "Nein. Zum Start genügt ein Ordner mit euren Unterlagen.",
        },
        {
          q: "Was passiert, wenn Raban etwas nicht weiß?",
          a: "Raban sagt es offen und schlägt vor, die zuständige Person zu fragen. Ein Tipp von dir, und die Bitte geht raus.",
        },
        {
          q: "Wer entscheidet, was als Antwort gilt?",
          a: "Ein Mensch. Was jemand selbst sagt oder korrigiert, gilt mit Namen und Datum. Was Raban nur vorschlägt, steht als Vorschlag da.",
        },
        {
          q: "Wo liegen unsere Daten?",
          a: "Eure Unterlagen und Antworten liegen bei unserem Datenbank-Anbieter in Frankfurt. Welche KI-Dienste wo rechnen, legen wir vor dem Start offen.",
        },
        {
          q: "Wem gehört das Wissen?",
          a: "Euch. Ihr bekommt eure Daten jederzeit als ZIP.",
        },
        {
          q: "Wie fangen wir an?",
          a: "Schreib uns an humans@raban.ai. Wir suchen gerade ein zweites Pilotunternehmen.",
        },
      ],
    },
  },
  en: {
    lede: "Keeps knowledge\nwhen people\nleave.",
    ledeEm: 8.3,
    deck: "Ask Raban and get the answer from your company's documents, with the source. If it isn't written down anywhere, Raban asks the person who knows.",
    why: {
      label: "Why Raban",
      display: "What matters most isn't in any folder.",
      sub: "It lives in the heads of a few people. When they retire or move on, it leaves with them. Raban holds on to it: from your documents where it's written down, and from your people where it isn't.",
      principles: [
        ["With source", "Every answer shows where it comes from: the document and passage, or the person."],
        ["No guessing", "When Raban doesn't know, it says so and asks."],
        ["With a name", "A person vouches for every answer, with name and date."],
      ],
    },
    how: "How Raban works",
    rows: [
      {
        tag: "01 Record",
        panel: "Recording by voice",
        scene: "record",
        alt: "Raban listens to someone explaining what to do when the print smears on the left, asks back, and writes the steps down in four phases.",
        title: "Explain it once. Raban takes notes.",
        body: "Explain a task the way you'd explain it to a trainee. Raban listens, asks where something is missing, and writes the steps down while you talk.",
        points: [
          "Speak or type, whatever suits",
          "Raban asks until it has understood",
          "You see right away what came across",
        ],
      },
      {
        tag: "02 Ask",
        panel: "Plan with sources",
        scene: "plan",
        alt: "Someone asks what to do when cartons pop open at the glue flap, and Raban answers with a plan in five steps, each with its source.",
        title: "Ask how it's done, and Raban shows you the plan.",
        body: "Ask in your own words. Raban answers in steps, put together from work instructions, manuals and what colleagues have explained.",
        points: [
          "Step by step instead of long texts",
          "Every step shows where it comes from",
          "On the desktop and on the phone",
        ],
      },
      {
        tag: "03 Follow up",
        panel: "Request to a person",
        scene: "ask",
        alt: "Raban finds nothing in the documents for a question, suggests asking the colleague who entered the figure, and sends her the request.",
        title: "If it's nowhere, Raban asks the person who knows.",
        body: "Raban doesn't guess. It says the answer is missing and suggests who to ask. One tap from you and the request goes out. The person answers once, and from then on their answer holds for everyone, with name and date.",
        points: [
          "Raban suggests the person responsible, you can change it",
          "Every answer shows who confirmed it and when",
          "If something is no longer right, you correct it with one tap",
        ],
      },
      {
        tag: "04 Get it done",
        panel: "Raban fills in the report",
        scene: "task",
        alt: "On the left a recorded task in five steps, on the right Raban fills in the complaint report at step four, with a source for every field.",
        title: "What Raban can do itself, Raban does.",
        body: "When a process calls for a report or a form, Raban fills it in from your documents and logs, with a source for every field. What Raban doesn't know goes to the right person. You check before anything goes out.",
        points: [
          "Forms and reports pre-filled",
          "A source for every field",
          "A person signs off before anything goes out",
        ],
      },
    ],
    pricing: {
      label: "Pricing",
      title: "Pricing",
      stats: [
        ["€1,000–9,000", "Setup, one time, scoped by site"],
        ["€250", "Base fee per month, for maintenance and updates"],
        ["~€25", "Per employee per month, covers the AI costs"],
      ],
      note: "Your knowledge is yours. You can take your data out as a ZIP at any time.",
      cta: "Request a pilot",
    },
    faq: {
      title: "Questions",
      items: [
        {
          q: "Do we have to connect Raban to our systems?",
          a: "No. A folder of your documents is enough to start.",
        },
        {
          q: "What happens when Raban doesn't know something?",
          a: "Raban says so and suggests asking the person responsible. One tap from you and the request goes out.",
        },
        {
          q: "Who decides what counts as an answer?",
          a: "A person. What someone says or corrects holds with their name and date. What Raban only suggests is marked as a suggestion.",
        },
        {
          q: "Where does our data live?",
          a: "Your documents and answers are stored with our database provider in Frankfurt. Which AI services run where, we disclose before you start.",
        },
        {
          q: "Who owns the knowledge?",
          a: "You do. You can take your data out as a ZIP at any time.",
        },
        {
          q: "How do we start?",
          a: "Write to humans@raban.ai. We're looking for a second pilot company right now.",
        },
      ],
    },
  },
} as const;

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

/** The four drawn windows, by the name each row gives its scene. */
const SCENES = { record: RecordScene, plan: PlanScene, ask: AskScene, task: TaskScene } as const;

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
  const geo = await visitorGeo();
  const locale = await getLocale();
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
            body's weight, like typesafe's; only headlines take medium. */}
        <p className="mt-auto mb-[var(--hero-bottom)] max-w-[min(100%,34ch)] self-end pt-6 text-[17px] leading-[1.3] md:text-xl">
          {t.deck}
        </p>
      </div>
      {/* height = 100vw * scale per breakpoint; scales must match getEndScale() in globe-map.tsx, else a gap appears.
          The globe centre (the visitor's own country marker) rests at --hero-marker, between the lede and the deck.
          Below the marker the globe dissolves (mask 65% → 90%; the sphere fills the section at every breakpoint, so
          the 90% line is the same point on the globe everywhere), and the section's negative bottom margin pulls the
          body up so the first label ("Warum Raban") sits a set distance below that line, where the globe has just
          faded out: 40px from lg, 60px on md, 100px on a phone (Johannes, 2026-09-30, after 85–90% and a flat 20px
          everywhere: on a phone the fade ends only just under the first screen, so the label sat right under the
          hero text and needs more air). So the margin is 0.10 of the globe's height, less that distance, plus the
          section's top padding (80px, 120px from md). The one exception: the label never comes closer than 120px to
          the first screen's bottom edge, so where the globe fades out above the fold (tall portrait screens) the
          label waits there, with about the air it has under the hero text on a phone — the margin then turns
          positive and pushes the body down, which is fine since the hero went sage (before, with a white hero, a
          gap would have shown white under the body). pointer-events-none so the overlapped strip belongs to the
          body, not the globe. */}
      <section className="pointer-events-none relative flex w-screen items-center justify-center mask-b-from-65% mask-b-to-90% h-[250vw] mt-[calc(var(--hero-marker)-125vw)] mb-[calc(-1*min(25vw-20px,var(--hero-marker)+125vw-40px-100svh))] md:h-[175vw] md:mt-[calc(var(--hero-marker)-87.5vw)] md:mb-[calc(-1*min(17.5vw+60px,var(--hero-marker)+87.5vw-100svh))] lg:h-[100vw] lg:mt-[calc(var(--hero-marker)-50vw)] lg:mb-[calc(-1*min(10vw+80px,var(--hero-marker)+50vw-100svh))]">
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

        {/* How: the app in four rows the way x.ai/build shows its product —
            knowledge going in, coming out, the gap, Raban doing a step
            itself (Johannes, 2026-09-30). The window stands left in the
            first row and swaps sides row by row; on narrow screens the text
            comes first, the window under it. */}
        <Section id="so-arbeitet-raban">
          <h2 className={`${SECTION} mb-16 max-w-[16ch] md:mb-24`}>{t.how}</h2>
          <div className="space-y-24 md:space-y-36">
            {t.rows.map((row, i) => {
              const Scene = SCENES[row.scene];
              const windowFirst = i % 2 === 0;
              return (
                <article
                  key={row.tag}
                  className={`grid items-center gap-10 lg:gap-16 ${
                    windowFirst
                      ? "lg:grid-cols-[minmax(0,9fr)_minmax(0,5fr)]"
                      : "lg:grid-cols-[minmax(0,5fr)_minmax(0,9fr)]"
                  }`}
                >
                  <div className={`max-w-[36rem] ${windowFirst ? "lg:order-2" : ""}`}>
                    <p className={`${LABEL} mb-5`}>{row.tag}</p>
                    <h3 className="text-[30px] font-medium leading-[1.02] tracking-[-0.022em] text-balance md:text-[40px] [&:lang(en)]:capitalize">
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
          <h2 className={`${SECTION} mb-16 md:mb-24`}>{t.pricing.title}</h2>
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
