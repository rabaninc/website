import Image, { type StaticImageData } from "next/image";

import { Brackets } from "../home/brackets";
import { LABEL, SECTION } from "../type";

// „Unser Team“ under the deck on /about (Johannes, 2026-10-08: "a team
// section underneath the slides … with our profile pictures from LinkedIn
// and our links to LinkedIn"): the two founders in slide 8's order, Simon
// left, each a flat square portrait in bracket marks, under it a hairline
// column with the name, the role, what they study where, and the link out.
// The pictures are their LinkedIn pictures exactly as they are there, nothing
// cut or blurred (werkzeuge/team-fotos). No motion: Johannes picked these
// portraits without the scan that played them in, over a sage duotone, ink
// badges and the two facing each other as on the slide (all four in the
// preview commit f6f9d10).

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
    <section aria-labelledby="team" className="pb-16 pt-24 md:pb-32 md:pt-40">
      <h2 id="team" className={`${SECTION} mb-12 text-center md:mb-20`}>
        {title}
      </h2>
      {/* Side by side on every screen, as on the slide; the gap leaves room
          for both photos' bracket marks, 8px outside each. */}
      <div className="mx-auto grid max-w-[1040px] grid-cols-2 gap-x-6 gap-y-10 md:gap-x-16">
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
              <Brackets inset="-8px" />
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
