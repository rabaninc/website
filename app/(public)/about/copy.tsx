import folie01 from "@/public/pitch/folie-01.png";
import folie02 from "@/public/pitch/folie-02.png";
import folie03 from "@/public/pitch/folie-03.png";
import folie04 from "@/public/pitch/folie-04.png";
import folie05 from "@/public/pitch/folie-05.png";
import folie06 from "@/public/pitch/folie-06.png";
import folie07 from "@/public/pitch/folie-07.png";
import folie08 from "@/public/pitch/folie-08.png";
import folie09 from "@/public/pitch/folie-09.png";
import folie01De from "@/public/pitch/de/folie-01.png";
import folie02De from "@/public/pitch/de/folie-02.png";
import folie03De from "@/public/pitch/de/folie-03.png";
import folie04De from "@/public/pitch/de/folie-04.png";
import folie05De from "@/public/pitch/de/folie-05.png";
import folie06De from "@/public/pitch/de/folie-06.png";
import folie07De from "@/public/pitch/de/folie-07.png";
import folie08De from "@/public/pitch/de/folie-08.png";
import folie09De from "@/public/pitch/de/folie-09.png";
import type { Locale } from "@/utils/locale";
import { blocks, fromReact, image } from "@/utils/markdown";

// The words of /about: the page's name (the title for agents, app/md; the
// page itself shows it only in the navbar since 2026-10-01) and the deck's
// heading in both languages, then the nine slides with what the founders
// say to each, in both languages since 2026-10-03: the German slides are
// the same deck switched to German in Claude Design, cut from its own PDF
// (werkzeuge/pitch-folien), their alts read off them. page.tsx shows them
// through slidesFor(), markdown() below writes them for agents
// (utils/markdown.ts).
export const T = {
  de: { label: "Über uns", deck: "Unser Pitch-Deck" },
  en: { label: "About", deck: "Our Pitch Deck" },
} as const;

// What this pitch won, first on the page since 2026-10-06, before the deck
// (Johannes picked the map over a split-flap board, a seal and a calendar).
// The heading says it was one of several winners (Johannes: "make sure that
// it is clear that we were one of the winning teams"); the sentence is his,
// as he approved it. The map's words are for the drawing
// (components/pitch/karte.tsx), its alt for whoever can't see it.
export const AWARD = {
  de: {
    title: "Unter den Gewinnern.",
    text: "Mit diesem Pitch waren wir eines der Gewinnerteams bei AI Start von Campus Founders, Heilbronn, 2. September 2026.",
    map: {
      place: "Heilbronn",
      finals: "Finale · 02.09.2026",
      win: "Gewinnerteam",
      alt: "Eine Punktkarte von Deutschland; zwei Linien finden Heilbronn, wo am 2. September 2026 das Finale von AI Start war. Daneben: Gewinnerteam.",
    },
  },
  en: {
    title: "Among the winners.",
    text: "The pitch that made us one of the winning teams at Campus Founders' AI Start, Heilbronn, 2 September 2026.",
    map: {
      place: "Heilbronn",
      finals: "Finals · 2 Sep 2026",
      win: "Winning team",
      alt: "A dot map of Germany; two lines find Heilbronn, where the AI Start finals took place on 2 September 2026. Beside it: winning team.",
    },
  },
} as const;

// The slides are pictures, so each one's text is written out as its alt.
// Each picture sits in a white box; `ground` paints that box in the slide's
// own colour where the slide isn't white. While a slide moves, Safari can
// draw the picture a fraction of a pixel short of its box, and on the red
// last slide the box's white showed as a hairline down its right edge
// (Johannes, 2026-10-01); in the slide's own red, nothing shows.
export const SLIDES = [
  {
    src: { en: folie01, de: folie01De },
    alt: {
      en: "Raban. Keeps knowledge inside the company when the experts who carry it leave.",
      de: "Raban. Hält Wissen im Unternehmen, wenn die Experten, die es tragen, gehen.",
    },
    speaker: "Johannes",
    script: {
      en: (
        <>
          Hey, welcome! Now even if AGI would arrive tomorrow — its effects, the trickle-down into our physical world,
          into the moving parts of a company — its processes and people still take an enormous amount of effort to
          integrate. Because at the core of each company lies its <em>specific knowledge</em>. How to do stuff.
        </>
      ),
      de: (
        <>
          Hey, willkommen! Selbst wenn AGI morgen da wäre — bis sie in unserer physischen Welt ankommt, in den
          beweglichen Teilen eines Unternehmens, in seinen Abläufen und bei seinen Menschen, ist es noch ein enormer
          Aufwand. Denn im Kern jedes Unternehmens liegt sein <em>spezifisches Wissen</em>. Wie man die Dinge macht.
        </>
      ),
    },
  },
  {
    src: { en: folie02, de: folie02De },
    alt: {
      en: "Where company knowledge lives: documented, in unconnected systems; undocumented, in people.",
      de: "Wo Unternehmenswissen steckt: dokumentiert, in isolierten Systemen; undokumentiert, in den Köpfen.",
    },
    speaker: "Johannes",
    script: {
      en: "And that knowledge lives in two places. Documented, in scattered systems. And undocumented, in the people who make the company run. And one of those two walks out the door when it's time for retirement.",
      de: "Und dieses Wissen steckt an zwei Orten. Dokumentiert, in verstreuten Systemen. Und undokumentiert, in den Menschen, die das Unternehmen am Laufen halten. Und einer dieser beiden Orte geht zur Tür hinaus, sobald die Rente kommt.",
    },
  },
  {
    src: { en: folie03, de: folie03De },
    alt: {
      en: "1 in 3 industrial companies lose knowledge they cannot replace when their people retire. Source: DIHK Fachkräftereport 2025.",
      de: "1 von 3 Industrieunternehmen verliert unersetzbares Wissen, wenn Beschäftigte in Rente gehen. Quelle: DIHK Fachkräftereport 2025.",
    },
    speaker: "Johannes",
    script: {
      en: "Last year, the DIHK Fachkräftereport asked twenty-two thousand German companies. And one in three industrial companies said: when our people retire, we lose company-specific knowledge we cannot replace.",
      de: "Letztes Jahr hat der DIHK-Fachkräftereport 22.000 deutsche Unternehmen befragt. Und jedes dritte Industrieunternehmen sagte: Wenn unsere Leute in Rente gehen, verlieren wir betriebsspezifisches Wissen, das wir nicht ersetzen können.",
    },
  },
  {
    src: { en: folie04, de: folie04De },
    alt: {
      en: "The next four years: 3,000,000 people will leave small and mid-sized companies within four years, in Germany alone. Source: IW-Kurzbericht 2026.",
      de: "Die nächsten vier Jahre: 3.000.000 Menschen verlassen kleine und mittlere Unternehmen innerhalb von vier Jahren, allein in Deutschland. Quelle: IW-Kurzbericht 2026.",
    },
    speaker: "Johannes",
    script: {
      en: "Now the timing. Fourteen million baby boomers are still working today. By 2030 — half of them are gone. This means that three million workers will be walking out of Mittelstand companies within the next four years — in Germany alone.",
      de: "Jetzt zum Timing. 14 Millionen Babyboomer arbeiten heute noch. Bis 2030 ist die Hälfte von ihnen weg. Das heißt: In den nächsten vier Jahren verlassen drei Millionen Beschäftigte den Mittelstand — allein in Deutschland.",
    },
  },
  {
    src: { en: folie05, de: folie05De },
    alt: {
      en: "How Raban works: the expert explains in speech, image and text; an AI layer turns it into knowledge that trainees, peers and HR can ask for in the format they need.",
      de: "So funktioniert Raban: Der Experte erklärt in Sprache, Bild und Text; eine KI-Ebene macht daraus Wissen, das Azubi, Kollege und HR in dem Format abfragen, das sie brauchen.",
    },
    speaker: "Simon",
    script: {
      en: "Raban keeps knowledge inside the company when the experts who carry it leave. Writing things down means friction — so people don't do it. The expert, on the left, simply talks — the way they'd explain it to an Azubi. The AI talks back until it is sure it has understood. And when the expert says 'you see this bit here' — it stops them and asks to actually see it. Humans explain multimodally through speech, vision and writing — so that's the way we capture it. It all lands in the knowledge base in the middle. On the right, the same conversation runs the other way: the Azubi, the colleague, HR simply ask — and the AI leads the way. Giving each person the type of knowledge they need, accessible in the type of format they want to use.",
      de: "Raban hält das Wissen im Unternehmen, wenn die Experten gehen, die es tragen. Aufschreiben ist mühsam — also lassen die Leute es. Der Experte, links, redet einfach — so, wie er es einem Azubi erklären würde. Die KI fragt zurück, bis sie sicher ist, dass sie verstanden hat. Und wenn der Experte sagt: ‚Siehst du das Teil hier?‘ — hält sie ihn an und will es wirklich sehen. Menschen erklären multimodal, mit Sprache, Bild und Schrift — also erfassen wir es genau so. Alles landet in der Wissensbasis in der Mitte. Rechts läuft dasselbe Gespräch in die andere Richtung: Der Azubi, der Kollege, HR fragen einfach — und die KI führt sie. Jeder bekommt das Wissen, das er braucht, in dem Format, das er nutzen will.",
    },
  },
  {
    src: { en: folie06, de: folie06De },
    alt: {
      en: "The verification loop: Raban listens, the answer is corrected, refined and used to instruct someone; the expert decides when it is good enough.",
      de: "Die Prüfschleife: Raban hört zu, das Erfasste wird korrigiert, verfeinert und zum Anleiten genutzt; der Experte entscheidet, wann es gut genug ist.",
    },
    speaker: "Simon",
    script: {
      en: "The hard part is knowing whether what you captured is right. So we don't trust the first pass. The AI listens while the expert explains, with the model in the background trying to ask contextually relevant questions. During refinement we build a plan of the process and its steps, we label and condense the information. Then the model needs to prove it understood: it guides, ideally, a second person through the same task, the expert standing by, and wherever it misguides, the expert steps back in. We note down what we got wrong, and reason why. Only what the expert calls good enough enters the knowledge base. And it never comes back anonymous: every answer references the actual interview and the person who gave it. Where it reasons across a gap, it says so — and points to the relevant part of the transcript. And if something isn't documented yet but someone needs it, the system sends a request to the person who knows.",
      de: "Schwierig ist zu wissen, ob das Erfasste stimmt. Deshalb trauen wir dem ersten Durchgang nicht. Die KI hört zu, während der Experte erklärt, und das Modell versucht im Hintergrund, passende Fragen zu stellen. Beim Verfeinern bauen wir einen Plan des Prozesses und seiner Schritte, wir beschriften und verdichten. Dann muss das Modell zeigen, dass es verstanden hat: Es führt, im Idealfall, eine zweite Person durch dieselbe Aufgabe, der Experte steht daneben, und wo es falsch anleitet, greift er ein. Wir halten fest, was falsch war, und warum. Nur was der Experte für gut genug hält, kommt in die Wissensbasis. Und keine Antwort kommt anonym: Jede verweist auf das Interview und die Person, von der sie stammt. Wo die KI eine Lücke überbrückt, sagt sie das — und zeigt auf die Stelle im Transkript. Und fehlt etwas, das jemand braucht, geht eine Anfrage an die Person, die es weiß.",
    },
  },
  {
    src: { en: folie07, de: folie07De },
    alt: {
      en: "Ownership and pricing: their knowledge, they own it, it stays in Europe/Germany; our architecture, a human-native interface for input and output. One time: €1–9k setup, scoped by site. Base: €250 per month for maintenance and upgrades. Usage: about €25 per employee per month to cover AI costs.",
      de: "Eigentum und Preismodell: Ihr Wissen gehört ihnen und bleibt in Europa/Deutschland; unsere Architektur, eine natürliche Schnittstelle für Ein- und Ausgabe. Einmalig: 1.000–9.000 € Einrichtung, je nach Standort. Grundgebühr: 250 € im Monat für Wartung und Upgrades. Nutzung: rund 25 € pro Person und Monat, deckt die KI-Kosten.",
    },
    speaker: "Simon",
    script: {
      en: "We want the company to remain in full control of their knowledge. They own it, it never leaves Europe/Germany, depending on their needs. We build and update the architecture around it — and the app it all runs through. We charge for one-time setup and a base fee for maintenance and upgrades — as the models get better, their system gets better — and per usage: keeping it fair, they pay as much as they actually use. They own the knowledge. We own the architecture.",
      de: "Unternehmen sollen die volle Kontrolle über ihr Wissen behalten. Es gehört ihnen, und es verlässt nie Europa oder Deutschland, je nachdem, was sie brauchen. Wir bauen und pflegen die Architektur drumherum — und die App, über die alles läuft. Wir berechnen eine einmalige Einrichtung, eine Grundgebühr für Wartung und Upgrades — werden die Modelle besser, wird ihr System besser — und die Nutzung: Das bleibt fair, sie zahlen so viel, wie sie wirklich nutzen. Das Wissen gehört ihnen. Die Architektur gehört uns.",
    },
  },
  {
    src: { en: folie08, de: folie08De },
    alt: {
      en: "About us: Simon Waiß, Physics, Universität Tübingen; Johannes Koch, Anthropology, Universität Heidelberg.",
      de: "Über uns: Simon Waiß, Physik, Universität Tübingen; Johannes Koch, Anthropologie, Universität Heidelberg.",
    },
    speaker: "Johannes",
    script: {
      en: "I study anthropology. We try to understand a system from within, and make out what the units of relevance are — because a company is, foremost, a social system. Simon studies physics. They take those units of relevance and make them concrete, measurable and transformable. And our investment in this is not just reflected by our Claude Max plans. Simon and I are aligned in purpose and intention. We appreciate each other's thinking. Together, we capture knowledge that is not yet documented and transform it into an output that is easy to understand and simple to access — through our human-native interface.",
      de: "Ich studiere Anthropologie. Wir versuchen, ein System von innen zu verstehen und herauszufinden, was darin die relevanten Einheiten sind — denn ein Unternehmen ist vor allem ein soziales System. Simon studiert Physik. Physiker nehmen diese Einheiten und machen sie konkret, messbar und veränderbar. Und wie ernst es uns ist, zeigen nicht nur unsere Claude-Max-Abos. Simon und ich sind uns in Ziel und Absicht einig. Wir schätzen, wie der andere denkt. Gemeinsam erfassen wir Wissen, das noch nicht dokumentiert ist, und machen daraus etwas, das leicht zu verstehen und einfach zu finden ist — über unsere natürliche Schnittstelle.",
    },
  },
  {
    src: { en: folie09, de: folie09De },
    ground: "#ec2f12", // the slide's red, read off its picture's edge
    alt: {
      en: "Pilot this September: a packaging factory, one hundred people, one skilled worker about to retire.",
      de: "Pilot im September: eine Verpackungsfabrik, hundert Menschen, eine Fachkraft kurz vor der Rente.",
    },
    speaker: "Johannes",
    script: {
      en: "In September we start our first pilot — at a packaging factory with about a hundred people. And one of their experts is about to retire.",
      de: "Im September starten wir unser erstes Pilotprojekt — in einer Verpackungsfertigung mit rund hundert Leuten. Und einer ihrer Experten geht bald in Rente.",
    },
  },
];

/** The slides in one language: its picture, alt and script for each. */
export function slidesFor(locale: Locale) {
  return SLIDES.map((slide) => ({
    ...slide,
    src: slide.src[locale],
    alt: slide.alt[locale],
    script: slide.script[locale],
  }));
}

/** /about in Markdown: what the pitch won, the map by its alt text, then
 *  each slide under the label the page gives it (slide-stack.tsx), its
 *  picture by its alt text, then the script. */
export function markdown(locale: Locale): string {
  const pad = (k: number) => String(k).padStart(2, "0");
  return blocks(
    `# ${T[locale].label}`,
    `## ${AWARD[locale].title}`,
    AWARD[locale].text,
    `*${AWARD[locale].map.alt}*`,
    `## ${T[locale].deck}`,
    ...slidesFor(locale).map((slide, i) =>
      blocks(
        `### ${pad(i + 1)} / ${pad(SLIDES.length)} · ${slide.speaker}`,
        image(slide.alt, slide.src.src),
        fromReact(slide.script),
      ),
    ),
  );
}
