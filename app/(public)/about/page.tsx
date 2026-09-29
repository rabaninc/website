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
// and shown as a stack that builds up while you scroll (slide-stack.tsx).
// Nothing else on the page but its heading: slide 8 is the team (Johannes,
// 2026-09-29).
// The slides are pictures, so each one's text is written out as its alt.
const T = {
  de: { h1: "Über uns", deck: "Unser Pitch-Deck" },
  en: { h1: "About us", deck: "Our Pitch Deck" },
} as const;

const SLIDES = [
  { src: folie01, alt: "Raban. Keeps knowledge inside the company when the experts who carry it leave." },
  { src: folie02, alt: "Where company knowledge lives: documented, in unconnected systems; undocumented, in people." },
  { src: folie03, alt: "1 in 3 industrial companies lose knowledge they cannot replace when their people retire. Source: DIHK Fachkräftereport 2025." },
  { src: folie04, alt: "The next four years: 3,000,000 people will leave small and mid-sized companies within four years, in Germany alone. Source: IW-Kurzbericht 2026." },
  { src: folie05, alt: "How Raban works: the expert explains in speech, image and text; an AI layer turns it into knowledge that trainees, peers and HR can ask for in the format they need." },
  { src: folie06, alt: "The verification loop: Raban listens, the answer is corrected, refined and used to instruct someone; the expert decides when it is good enough." },
  { src: folie07, alt: "Ownership and pricing: their knowledge, they own it, it stays in Europe/Germany; our architecture, a human-native interface for input and output. One time: €1–9k setup, scoped by site. Base: €250 per month for maintenance and upgrades. Usage: about €25 per employee per month to cover AI costs." },
  { src: folie08, alt: "About us: Simon Waiß, Physics, Universität Tübingen; Johannes Koch, Anthropology, Universität Heidelberg." },
  { src: folie09, alt: "Pilot this September: a packaging factory, one hundred people, one skilled worker about to retire." },
] as const;

export default async function AboutPage() {
  const locale = await getLocale();
  return (
    <main className="px-[var(--inset)] pb-[var(--inset)] pt-[var(--content-top)] text-ink">
      <h1 className={H1}>{T[locale].h1}</h1>
      <SlideStack title={T[locale].deck} slides={SLIDES} />
    </main>
  );
}
