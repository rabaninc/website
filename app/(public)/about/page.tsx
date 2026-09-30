import { SlideStack } from "@/app/components/pitch/slide-stack";
import { H1 } from "@/app/components/type";
import folie01 from "@/public/pitch/folie-01.png";
import folie02 from "@/public/pitch/folie-02.png";
import folie03 from "@/public/pitch/folie-03.png";
import folie04 from "@/public/pitch/folie-04.png";
import folie05 from "@/public/pitch/folie-05.png";
import folie06 from "@/public/pitch/folie-06.png";
import folie07 from "@/public/pitch/folie-07.png";
import folie08 from "@/public/pitch/folie-08.png";
import folie09 from "@/public/pitch/folie-09.png";
import { getLocale } from "@/utils/locale-server";

// /about is the pitch deck, exactly as the founders present it (the stage
// pitch, nine slides, English), cut from its PDF by werkzeuge/pitch-folien/
// and shown on a big wheel that turns as you scroll (slide-stack.tsx),
// with what the founders say to each slide beside it: the stage pitch
// script, English like the slides, as Johannes wrote it minus the [pause]
// cues and three typos (2026-09-29). Nothing else on the page but its
// heading: slide 8 is the team.
// The slides are pictures, so each one's text is written out as its alt.
const T = {
  de: { h1: "Über uns", deck: "Unser Pitch-Deck" },
  en: { h1: "About us", deck: "Our Pitch Deck" },
} as const;

const SLIDES = [
  {
    src: folie01,
    alt: "Raban. Keeps knowledge inside the company when the experts who carry it leave.",
    speaker: "Johannes",
    script: (
      <>
        Hey, welcome! Now even if AGI would arrive tomorrow — its effects, the trickle-down into our physical world,
        into the moving parts of a company — its processes and people still take an enormous amount of effort to
        integrate. Because at the core of each company lies its <em>specific knowledge</em>. How to do stuff.
      </>
    ),
  },
  {
    src: folie02,
    alt: "Where company knowledge lives: documented, in unconnected systems; undocumented, in people.",
    speaker: "Johannes",
    script:
      "And that knowledge lives in two places. Documented, in scattered systems. And undocumented, in the people who make the company run. And one of those two walks out the door when it's time for retirement.",
  },
  {
    src: folie03,
    alt: "1 in 3 industrial companies lose knowledge they cannot replace when their people retire. Source: DIHK Fachkräftereport 2025.",
    speaker: "Johannes",
    script:
      "Last year, the DIHK Fachkräftereport asked twenty-two thousand German companies. And one in three industrial companies said: when our people retire, we lose company-specific knowledge we cannot replace.",
  },
  {
    src: folie04,
    alt: "The next four years: 3,000,000 people will leave small and mid-sized companies within four years, in Germany alone. Source: IW-Kurzbericht 2026.",
    speaker: "Johannes",
    script:
      "Now the timing. Fourteen million baby boomers are still working today. By 2030 — half of them are gone. This means that three million workers will be walking out of Mittelstand companies within the next four years — in Germany alone.",
  },
  {
    src: folie05,
    alt: "How Raban works: the expert explains in speech, image and text; an AI layer turns it into knowledge that trainees, peers and HR can ask for in the format they need.",
    speaker: "Simon",
    script:
      "Raban keeps knowledge inside the company when the experts who carry it leave. Writing things down means friction — so people don't do it. The expert, on the left, simply talks — the way they'd explain it to an Azubi. The AI talks back until it is sure it has understood. And when the expert says 'you see this bit here' — it stops them and asks to actually see it. Humans explain multimodally through speech, vision and writing — so that's the way we capture it. It all lands in the knowledge base in the middle. On the right, the same conversation runs the other way: the Azubi, the colleague, HR simply ask — and the AI leads the way. Giving each person the type of knowledge they need, accessible in the type of format they want to use.",
  },
  {
    src: folie06,
    alt: "The verification loop: Raban listens, the answer is corrected, refined and used to instruct someone; the expert decides when it is good enough.",
    speaker: "Simon",
    script:
      "The hard part is knowing whether what you captured is right. So we don't trust the first pass. The AI listens while the expert explains, with the model in the background trying to ask contextually relevant questions. During refinement we build a plan of the process and its steps, we label and condense the information. Then the model needs to prove it understood: it guides, ideally, a second person through the same task, the expert standing by, and wherever it misguides, the expert steps back in. We note down what we got wrong, and reason why. Only what the expert calls good enough enters the knowledge base. And it never comes back anonymous: every answer references the actual interview and the person who gave it. Where it reasons across a gap, it says so — and points to the relevant part of the transcript. And if something isn't documented yet but someone needs it, the system sends a request to the person who knows.",
  },
  {
    src: folie07,
    alt: "Ownership and pricing: their knowledge, they own it, it stays in Europe/Germany; our architecture, a human-native interface for input and output. One time: €1–9k setup, scoped by site. Base: €250 per month for maintenance and upgrades. Usage: about €25 per employee per month to cover AI costs.",
    speaker: "Simon",
    script:
      "We want the company to remain in full control of their knowledge. They own it, it never leaves Europe/Germany, depending on their needs. We build and update the architecture around it — and the app it all runs through. We charge for one-time setup and a base fee for maintenance and upgrades — as the models get better, their system gets better — and per usage: keeping it fair, they pay as much as they actually use. They own the knowledge. We own the architecture.",
  },
  {
    src: folie08,
    alt: "About us: Simon Waiß, Physics, Universität Tübingen; Johannes Koch, Anthropology, Universität Heidelberg.",
    speaker: "Johannes",
    script:
      "I study anthropology. We try to understand a system from within, and make out what the units of relevance are — because a company is, foremost, a social system. Simon studies physics. They take those units of relevance and make them concrete, measurable and transformable. And our investment in this is not just reflected by our Claude Max plans. Simon and I are aligned in purpose and intention. We appreciate each other's thinking. Together, we capture knowledge that is not yet documented and transform it into an output that is easy to understand and simple to access — through our human-native interface.",
  },
  {
    src: folie09,
    alt: "Pilot this September: a packaging factory, one hundred people, one skilled worker about to retire.",
    speaker: "Johannes",
    script:
      "In September we start our first pilot — at a packaging factory with about a hundred people. And one of their experts is about to retire.",
  },
];

export default async function AboutPage() {
  const locale = await getLocale();
  return (
    <main className="px-[var(--inset)] pb-[var(--inset)] pt-[var(--content-top)] text-ink">
      <h1 className={H1}>{T[locale].h1}</h1>
      <SlideStack title={T[locale].deck} slides={SLIDES} />
    </main>
  );
}
