import Image, { type StaticImageData } from "next/image";

import { Brackets } from "../home/brackets";
import { LABEL, SECTION } from "../type";

// „Unser Team“ under the deck on /about (Johannes, 2026-10-08: "a team
// section underneath the slides … with our profile pictures from LinkedIn
// and our links to LinkedIn"): the two founders in slide 8's order, Simon
// left, each a flat square portrait, under it a hairline column with the
// name, the role, what they study where, and the link out. No bracket marks
// round the photos (Johannes, same day: „Und entferne die Chevrons.“).
// The pictures are their LinkedIn pictures exactly as they are there, nothing
// cut or blurred (werkzeuge/team-fotos). No motion: Johannes picked these
// portraits without the scan that played them in, over a sage duotone, ink
// badges and the two facing each other as on the slide (all four in the
// preview commit f6f9d10).
// Between the deck and the team stands the home page's mark between two
// sections, pointing up and down at both sides (Johannes, 2026-10-13: "the
// separation sort of chevrons that we use on homepage"), with the home
// page's section air on either side: 120px, 80px on a phone. The deck's
// section ends a little under its last slide (slide-stack.tsx: END, under the
// text on a phone, under the stage's foot beside it on the desktop, which
// leaves 77px at 1280 × 720, 96px on Johannes' 1512 × 857, 125px at 1920 ×
// 1080), so the margin above makes up the rest: 120px from the slide on his
// screen, measured.

export type Person = {
  key: string;
  name: string;
  photo: StaticImageData;
  linkedin: string;
  role: string;
  study: string;
  uni: string;
  alt: string;
  label: string;
};

/** A founder's name: the home page's call to action in size, a step down on
 *  a phone so „Johannes Koch“ keeps one line in its half of the screen. */
const NAME = "text-[18px] font-medium leading-none tracking-[-0.02em] md:text-[28px]";

export function Team({ title, people }: { title: string; people: readonly Person[] }) {
  return (
    <section aria-labelledby="team" className="relative mt-12 pb-16 pt-20 md:mt-6 md:pb-32 md:pt-[120px]">
      <Brackets inset="0px" up bottom={false} />
      {/* Heading and portraits stand left, the heading flush with Simon's
          photo (Johannes, 2026-10-08: „Lass unser Team links stehen, nicht
          mittig.“; first both were centred, as the deck's heading is). */}
      <h2 id="team" className={`${SECTION} mb-12 md:mb-20`}>
        {title}
      </h2>
      {/* Side by side on every screen, as on the slide. */}
      <div className="grid max-w-[1040px] grid-cols-2 gap-x-6 gap-y-10 md:gap-x-16">
        {people.map((p) => (
          <figure key={p.key} className="min-w-0">
            <div className="relative aspect-square">
              <Image
                src={p.photo}
                alt={p.alt}
                fill
                sizes="(min-width: 1100px) 490px, 45vw"
                placeholder="blur"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-6 border-l border-ink/30 pl-3 md:mt-8">
              <h3 className={NAME}>{p.name}</h3>
              <p className={`${LABEL} mt-3 uppercase`}>{p.role}</p>
              <p className={`${LABEL} mt-1 uppercase`}>{p.study}</p>
              <p className={`${LABEL} mt-1 uppercase`}>{p.uni}</p>
              <a
                href={p.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={p.label}
                className="mt-5 inline-block cursor-pointer text-[17px] leading-none underline decoration-1 underline-offset-4 hover:text-ink/60"
              >
                LinkedIn ↗
              </a>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
