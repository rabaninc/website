import folie01 from "@/public/pitch/folie-01.png";
import folie02 from "@/public/pitch/folie-02.png";
import folie03 from "@/public/pitch/folie-03.png";
import folie04 from "@/public/pitch/folie-04.png";
import folie05 from "@/public/pitch/folie-05.png";
import folie06 from "@/public/pitch/folie-06.png";
import folie07 from "@/public/pitch/folie-07.png";
import folie08 from "@/public/pitch/folie-08.png";
import folie09 from "@/public/pitch/folie-09.png";
import type { Locale } from "@/utils/locale";
import { blocks, fromReact, image } from "@/utils/markdown";

// The words of /about: the page's name (the title for agents, app/md; the
// page itself shows it only in the navbar since 2026-10-01) and the deck's
// heading in both languages, then the nine slides with what the founders
// say to each, in both languages (German since 2026-10-03; the slides
// themselves are still English). page.tsx shows them, markdown() below
// writes them for agents (utils/markdown.ts).
export const T = {
  de: { label: "Über uns", deck: "Unser Pitch-Deck" },
  en: { label: "About us", deck: "Our Pitch Deck" },
} as const;

// The slides are pictures, so each one's text is written out as its alt.
// Each picture sits in a white box; `ground` paints that box in the slide's
// own colour where the slide isn't white. While a slide moves, Safari can
// draw the picture a fraction of a pixel short of its box, and on the red
// last slide the box's white showed as a hairline down its right edge
// (Johannes, 2026-10-01); in the slide's own red, nothing shows.
export const SLIDES = [
  {
    src: folie01,
    alt: "Raban. Keeps knowledge inside the company when the experts who carry it leave.",
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
    src: folie02,
    alt: "Where company knowledge lives: documented, in unconnected systems; undocumented, in people.",
    speaker: "Johannes",
    script: {
      en: "And that knowledge lives in two places. Documented, in scattered systems. And undocumented, in the people who make the company run. And one of those two walks out the door when it's time for retirement.",
      de: "Und dieses Wissen steckt an zwei Orten. Dokumentiert, in verstreuten Systemen. Und undokumentiert, in den Menschen, die das Unternehmen am Laufen halten. Und einer dieser beiden Orte geht zur Tür hinaus, sobald die Rente kommt.",
    },
  },
  {
    src: folie03,
    alt: "1 in 3 industrial companies lose knowledge they cannot replace when their people retire. Source: DIHK Fachkräftereport 2025.",
    speaker: "Johannes",
    script: {
      en: "Last year, the DIHK Fachkräftereport asked twenty-two thousand German companies. And one in three industrial companies said: when our people retire, we lose company-specific knowledge we cannot replace.",
      de: "Letztes Jahr hat der DIHK-Fachkräftereport 22.000 deutsche Unternehmen befragt. Und jedes dritte Industrieunternehmen sagte: Wenn unsere Leute in Rente gehen, verlieren wir betriebsspezifisches Wissen, das wir nicht ersetzen können.",
    },
  },
  {
    src: folie04,
    alt: "The next four years: 3,000,000 people will leave small and mid-sized companies within four years, in Germany alone. Source: IW-Kurzbericht 2026.",
    speaker: "Johannes",
    script: {
      en: "Now the timing. Fourteen million baby boomers are still working today. By 2030 — half of them are gone. This means that three million workers will be walking out of Mittelstand companies within the next four years — in Germany alone.",
      de: "Jetzt zum Timing. 14 Millionen Babyboomer arbeiten heute noch. Bis 2030 ist die Hälfte von ihnen weg. Das heißt: In den nächsten vier Jahren verlassen drei Millionen Beschäftigte den Mittelstand — allein in Deutschland.",
    },
  },
  {
    src: folie05,
    alt: "How Raban works: the expert explains in speech, image and text; an AI layer turns it into knowledge that trainees, peers and HR can ask for in the format they need.",
    speaker: "Simon",
    script: {
      en: "Raban keeps knowledge inside the company when the experts who carry it leave. Writing things down means friction — so people don't do it. The expert, on the left, simply talks — the way they'd explain it to an Azubi. The AI talks back until it is sure it has understood. And when the expert says 'you see this bit here' — it stops them and asks to actually see it. Humans explain multimodally through speech, vision and writing — so that's the way we capture it. It all lands in the knowledge base in the middle. On the right, the same conversation runs the other way: the Azubi, the colleague, HR simply ask — and the AI leads the way. Giving each person the type of knowledge they need, accessible in the type of format they want to use.",
      de: "Raban hält das Wissen im Unternehmen, wenn die Experten gehen, die es tragen. Aufschreiben ist mühsam — also lassen die Leute es. Der Experte, links, redet einfach — so, wie er es einem Azubi erklären würde. Die KI fragt zurück, bis sie sicher ist, dass sie verstanden hat. Und wenn der Experte sagt: ‚Siehst du das Teil hier?‘ — hält sie ihn an und will es wirklich sehen. Menschen erklären multimodal, mit Sprache, Bild und Schrift — also erfassen wir es genau so. Alles landet in der Wissensbasis in der Mitte. Rechts läuft dasselbe Gespräch in die andere Richtung: Der Azubi, der Kollege, HR fragen einfach — und die KI führt sie. Jeder bekommt das Wissen, das er braucht, in dem Format, das er nutzen will.",
    },
  },
  {
    src: folie06,
    alt: "The verification loop: Raban listens, the answer is corrected, refined and used to instruct someone; the expert decides when it is good enough.",
    speaker: "Simon",
    script: {
      en: "The hard part is knowing whether what you captured is right. So we don't trust the first pass. The AI listens while the expert explains, with the model in the background trying to ask contextually relevant questions. During refinement we build a plan of the process and its steps, we label and condense the information. Then the model needs to prove it understood: it guides, ideally, a second person through the same task, the expert standing by, and wherever it misguides, the expert steps back in. We note down what we got wrong, and reason why. Only what the expert calls good enough enters the knowledge base. And it never comes back anonymous: every answer references the actual interview and the person who gave it. Where it reasons across a gap, it says so — and points to the relevant part of the transcript. And if something isn't documented yet but someone needs it, the system sends a request to the person who knows.",
      de: "Schwierig ist zu wissen, ob das Erfasste stimmt. Deshalb trauen wir dem ersten Durchgang nicht. Die KI hört zu, während der Experte erklärt, und das Modell versucht im Hintergrund, passende Fragen zu stellen. Beim Verfeinern bauen wir einen Plan des Prozesses und seiner Schritte, wir beschriften und verdichten. Dann muss das Modell zeigen, dass es verstanden hat: Es führt, im Idealfall, eine zweite Person durch dieselbe Aufgabe, der Experte steht daneben, und wo es falsch anleitet, greift er ein. Wir halten fest, was falsch war, und warum. Nur was der Experte für gut genug hält, kommt in die Wissensbasis. Und keine Antwort kommt anonym: Jede verweist auf das Interview und die Person, von der sie stammt. Wo die KI eine Lücke überbrückt, sagt sie das — und zeigt auf die Stelle im Transkript. Und fehlt etwas, das jemand braucht, geht eine Anfrage an die Person, die es weiß.",
    },
  },
  {
    src: folie07,
    alt: "Ownership and pricing: their knowledge, they own it, it stays in Europe/Germany; our architecture, a human-native interface for input and output. One time: €1–9k setup, scoped by site. Base: €250 per month for maintenance and upgrades. Usage: about €25 per employee per month to cover AI costs.",
    speaker: "Simon",
    script: {
      en: "We want the company to remain in full control of their knowledge. They own it, it never leaves Europe/Germany, depending on their needs. We build and update the architecture around it — and the app it all runs through. We charge for one-time setup and a base fee for maintenance and upgrades — as the models get better, their system gets better — and per usage: keeping it fair, they pay as much as they actually use. They own the knowledge. We own the architecture.",
      de: "Unternehmen sollen die volle Kontrolle über ihr Wissen behalten. Es gehört ihnen, und es verlässt nie Europa oder Deutschland, je nachdem, was sie brauchen. Wir bauen und pflegen die Architektur drumherum — und die App, über die alles läuft. Wir berechnen eine einmalige Einrichtung, eine Grundgebühr für Wartung und Upgrades — werden die Modelle besser, wird ihr System besser — und die Nutzung: Das bleibt fair, sie zahlen so viel, wie sie wirklich nutzen. Das Wissen gehört ihnen. Die Architektur gehört uns.",
    },
  },
  {
    src: folie08,
    alt: "About us: Simon Waiß, Physics, Universität Tübingen; Johannes Koch, Anthropology, Universität Heidelberg.",
    speaker: "Johannes",
    script: {
      en: "I study anthropology. We try to understand a system from within, and make out what the units of relevance are — because a company is, foremost, a social system. Simon studies physics. They take those units of relevance and make them concrete, measurable and transformable. And our investment in this is not just reflected by our Claude Max plans. Simon and I are aligned in purpose and intention. We appreciate each other's thinking. Together, we capture knowledge that is not yet documented and transform it into an output that is easy to understand and simple to access — through our human-native interface.",
      de: "Ich studiere Anthropologie. Wir versuchen, ein System von innen zu verstehen und herauszufinden, was darin die relevanten Einheiten sind — denn ein Unternehmen ist vor allem ein soziales System. Simon studiert Physik. Physiker nehmen diese Einheiten und machen sie konkret, messbar und veränderbar. Und wie ernst es uns ist, zeigen nicht nur unsere Claude-Max-Abos. Simon und ich sind uns in Ziel und Absicht einig. Wir schätzen, wie der andere denkt. Gemeinsam erfassen wir Wissen, das noch nicht dokumentiert ist, und machen daraus etwas, das leicht zu verstehen und einfach zu finden ist — über unsere menschennahe Oberfläche.",
    },
  },
  {
    src: folie09,
    ground: "#ec2f12", // the slide's red, read off its picture's edge
    alt: "Pilot this September: a packaging factory, one hundred people, one skilled worker about to retire.",
    speaker: "Johannes",
    script: {
      en: "In September we start our first pilot — at a packaging factory with about a hundred people. And one of their experts is about to retire.",
      de: "Im September starten wir unser erstes Pilotprojekt — in einer Verpackungsfertigung mit rund hundert Leuten. Und einer ihrer Experten geht bald in Rente.",
    },
  },
];

/** /about in Markdown: each slide under the label the page gives it
 *  (slide-stack.tsx), its picture by its alt text, then the script. */
export function markdown(locale: Locale): string {
  const pad = (k: number) => String(k).padStart(2, "0");
  return blocks(
    `# ${T[locale].label}`,
    `## ${T[locale].deck}`,
    ...SLIDES.map((slide, i) =>
      blocks(
        `### ${pad(i + 1)} / ${pad(SLIDES.length)} · ${slide.speaker}`,
        image(slide.alt, slide.src.src),
        fromReact(slide.script[locale]),
      ),
    ),
  );
}
