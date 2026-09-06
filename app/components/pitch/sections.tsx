import type { Locale } from "@/utils/locale";

import { KnowledgeFlowChart } from "./knowledge-flow";
import { KnowledgeLivesChart } from "./knowledge-lives";
import { OwnershipPricingChart } from "./ownership-pricing";
import { VerificationLoopChart } from "./verification-loop";
import { WindowCard } from "./window-card";

// The pitch deck (Raban Pitch v2) as page sections, one per slide, each a
// WindowCard (window-card.tsx): the slide's title and two or three sentences
// of customer-facing copy — what a buyer needs from that slide, condensed
// from the founders' spoken script and addressed to the reader — and under
// them the slide's graphic across the card.
//
// The home page runs slides 2 and 5–7 (where knowledge lives, how it works,
// the verification loop, ownership and pricing); the two statistic slides (3
// and 4) and the investor-facing closer are left out, and the team slide lives
// on /about. /product repeats 5–7. (History: the home page grouped the slides
// under two chapter headings, Problem and Lösung; dropped with the cards —
// one card per slide, and the slide title is heading enough. The cards
// carried an `index` for a while, which set the side the copy took while
// copy and graphic sat side by side; gone with that layout, 2026-09-06.)
// Every graphic and every sentence here is outward communication and needs
// founder sign-off before it goes live.

type Props = { locale: Locale };

// The spoken text: a step up from body. The slide title goes to the card as
// a prop, which sets it as the h2 above the paragraph (see window-card.tsx).
const PARA = "text-lg";

const T = {
  de: {
    lives: {
      title: "Wo das Wissen im Unternehmen liegt",
      para: "Wissen liegt an zwei Orten: dokumentiert in verstreuten Systemen — und undokumentiert in den Menschen, die den Betrieb am Laufen halten. Wenn diese Menschen in Rente gehen, geht ihr Wissen mit.",
    },
    flow: {
      title: "So funktioniert Raban",
      para: "Ihr Experte erklärt — so, wie er es einem Azubi erklären würde: in Sprache, Bild und Text. Die KI fragt nach, bis sie sicher verstanden hat. Danach fragen alle anderen einfach — Azubi, Kollegen, HR — und bekommen die Antwort in dem Format, das sie brauchen.",
    },
    loop: {
      title: "Die Verifikationsschleife",
      para: "Nichts landet ungeprüft in Ihrer Wissensbasis. Die KI hört zu, fragt nach und leitet dann eine zweite Person durch dieselbe Aufgabe — Ihr Experte steht daneben und entscheidet, was gut genug ist. Jede Antwort nennt das Interview und die Person, von der sie stammt. Fehlt etwas, fragt das System die Person, die es weiß.",
    },
    pricing: {
      title: "Eigentum und Preis",
      para: "Ihr Wissen gehört Ihnen und bleibt in Deutschland oder Europa — wir bauen und pflegen die Architektur darum herum. Sie zahlen einmalig die Einrichtung, eine kleine Grundgebühr für Wartung und Updates, und darüber hinaus nur, was Sie tatsächlich nutzen.",
    },
  },
  en: {
    lives: {
      title: "Where company knowledge lives",
      para: "Knowledge lives in two places: documented, in scattered systems — and undocumented, in the people who keep the company running. When those people retire, their knowledge leaves with them.",
    },
    flow: {
      title: "How Raban works",
      para: "Your expert explains — the way they would to a trainee: in speech, images and text. The AI asks back until it is sure it has understood. From then on everyone else simply asks — trainees, colleagues, HR — and gets the answer in the format they need.",
    },
    loop: {
      title: "The verification loop",
      para: "Nothing enters your knowledge base unverified. The AI listens, asks back, then guides a second person through the same task — your expert stands by and decides what is good enough. Every answer names the interview and the person it came from. If something is missing, the system asks the person who knows.",
    },
    pricing: {
      title: "Ownership and pricing",
      para: "Your knowledge is yours and stays in Germany or Europe — we build and maintain the architecture around it. You pay a one-time setup, a small base fee for maintenance and updates, and beyond that only what you actually use.",
    },
  },
} as const;

type Slide = keyof (typeof T)["de"];

function Slide({
  slide,
  chart,
  locale,
}: Props & { slide: Slide; chart: React.ReactNode }) {
  const t = T[locale][slide];
  return (
    <WindowCard title={t.title} graphic={chart}>
      <p className={PARA}>{t.para}</p>
    </WindowCard>
  );
}

export function KnowledgeLivesSection(p: Props) {
  return (
    <Slide
      {...p}
      slide="lives"
      chart={<KnowledgeLivesChart locale={p.locale} />}
    />
  );
}

export function FlowSection(p: Props) {
  return (
    <Slide
      {...p}
      slide="flow"
      chart={<KnowledgeFlowChart locale={p.locale} />}
    />
  );
}

export function LoopSection(p: Props) {
  return (
    <Slide
      {...p}
      slide="loop"
      chart={<VerificationLoopChart locale={p.locale} />}
    />
  );
}

export function PricingSection(p: Props) {
  return (
    <Slide
      {...p}
      slide="pricing"
      chart={<OwnershipPricingChart locale={p.locale} />}
    />
  );
}
