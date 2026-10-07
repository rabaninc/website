import Image, { type StaticImageData } from "next/image";

// Johannes' three photos from Heilbronn (AI Start; cut by
// werkzeuge/auszeichnung-fotos) in the room the map leaves under the
// sentence on /about (Johannes, 2026-10-07: "to fill up the space underneath
// the first text block"; he picked these columns over split-flap tiles and
// prints dealt out of Heilbronn, both in the preview commit c61941e). Side
// by side, flat and square-cornered as typesafe sets its pictures, the
// room's full width, their feet on the foot of the map's frame; under each a
// hairline drops from its left edge to a mono date on the baseline of the
// map's degrees, so the dates and the degrees read as one axis across the
// page. No motion. On a phone, upright or on its side, they come after the
// map, under the first screen, before the deck.

export type Foto = {
  key: "treppenhaus" | "bruecke" | "finaltag";
  src: StaticImageData;
  date: string;
  day: string;
  alt: string;
};

/** Where each photo's subject sits, for the crops `object-cover` makes. */
const FOKUS = { treppenhaus: "50% 62%", bruecke: "58% 30%", finaltag: "52% 42%" } as const;

function Photo({ p, sizes }: { p: Foto; sizes: string }) {
  return (
    <Image
      src={p.src}
      alt={p.alt}
      fill
      sizes={sizes}
      placeholder="blur"
      className="object-cover"
      style={{ objectPosition: FOKUS[p.key] }}
    />
  );
}

export function Fotos({ photos, where }: { photos: readonly Foto[]; where: "spalte" | "unten" }) {
  if (where === "spalte")
    return (
      // The room under the sentence, a size container laid over its flex
      // slot (as the map's box on the phone). --foot is the strip under the
      // map's frame where its degrees stand, their baseline 18 below the
      // frame (karte.tsx, in the map's 440 across). A window too low to give
      // the photos a useful height shows none.
      <div className="relative hidden flex-1 deck-wide:block deck-squat:hidden">
        <div className="absolute inset-0 [container-type:size] [--foot:calc(var(--karte)*32/440)]">
          <div className="grid h-full grid-cols-3 gap-x-6 [@container(max-height:120px)]:hidden">
            {photos.map((p) => (
              <figure key={p.key} className="flex min-w-0 flex-col">
                <div className="relative min-h-0 flex-1">
                  <Photo p={p} sizes="(min-width: 1024px) 26vw, 30vw" />
                </div>
                <figcaption className="relative h-[var(--foot)] shrink-0">
                  <span
                    aria-hidden
                    className="absolute left-0 top-0 h-[calc(var(--karte)*18/440)] border-l border-ink"
                  />
                  <span className="absolute left-[calc(var(--karte)*7/440)] top-[calc(var(--karte)*18/440)] -translate-y-full whitespace-nowrap font-mono text-[length:calc(var(--karte)*11/440)] uppercase leading-none [text-box:trim-both_cap_alphabetic]">
                    {p.date}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    );
  // The deck's track starts a navbar higher and its heading 80px into it
  // (page.tsx), so 16px here leave 40px between the photos and the heading.
  return (
    <div className="grid grid-cols-3 gap-x-3 pb-4 deck-wide:hidden deck-squat:grid deck-squat:gap-x-6">
      {photos.map((p) => (
        <figure key={p.key} className="min-w-0">
          <div className="relative aspect-[3/4] max-h-[54svh] w-full">
            <Photo p={p} sizes="30vw" />
          </div>
          <figcaption className="relative h-[34px]">
            <span aria-hidden className="absolute left-0 top-0 h-[19px] border-l border-ink" />
            {/* „02.09. · FINALE“ is a little wider than its photo on a
                narrow phone and runs on past it rather than break. */}
            <span className="absolute left-[7px] top-[19px] -translate-y-full whitespace-nowrap font-mono text-[11px] uppercase leading-none [text-box:trim-both_cap_alphabetic]">
              {p.day}
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
