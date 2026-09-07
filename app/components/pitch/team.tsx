import Image from "next/image";

import type { Locale } from "@/utils/locale";

import heidelbergLogo from "@/app/assets/heidelberg-logo-full.png";
import rabanHead from "@/app/assets/raban-head.png";
import tuebingenLogo from "@/app/assets/tuebingen-logo.png";

import { CatBox } from "./cat-box";
import { WindowCard } from "./window-card";

// The team slide from the pitch deck (Raban Pitch v2, slide 8), on /about, as
// a window card (window-card.tsx): a short who-we-are, and under it the two
// founders as the drawn heads at the two edges, the cat in its box between
// them, the universities beneath — the slide's own arrangement. The PNGs are ink
// drawings on white, the paper's own colour. (History: they took an invert +
// hue-rotate filter under the dark theme, gone 2026-09-06.)
// The slide sizes itself to the card column it sits in, not to the viewport:
// the graphic's cell is a container (window-card.tsx), so the heads and the
// cat take a share of its width (cqw) between a floor and the deck's own
// size, and the row of three only forms once the column is 48rem wide
// (@3xl) — narrower than that the three stack, which is what the card's
// phone layout wants too. (History: heads at h-64/lg:h-80 and the row from
// sm up, sized for a full-width slide; in the card's column that row ran
// 56px past its edge at 1440px.) From @3xl each name-and-head row sits
// centred in its half rather than at the card's edge, so the two founders
// stand a little closer to the cat while the universities stay in the
// corners under them — the founders asked for that on 2026-09-07, after a
// fully centred group with the names under the heads read as too cramped.
const HEAD = "h-[clamp(10rem,24cqw,20rem)] w-auto";

const T = {
  de: {
    physics: "Physik",
    anthropology: "Anthropologie",
    headAlt: "Gezeichneter Kopf mit Wissen darin",
    para: "Raban wird von zwei Gründern gebaut. Simon Waiß (Physik, Universität Tübingen) entwickelt die Technik. Johannes Koch (Anthropologie, Universität Heidelberg) versteht Unternehmen als das, was sie zuerst sind: soziale Systeme. Gemeinsam holen wir Wissen aus den Köpfen — und machen es für alle im Betrieb zugänglich.",
  },
  en: {
    physics: "Physics",
    anthropology: "Anthropology",
    headAlt: "Line-drawn head with knowledge inside",
    para: "Raban is built by two founders. Simon Waiß (physics, University of Tübingen) builds the technology. Johannes Koch (anthropology, Heidelberg University) understands companies as what they are first: social systems. Together we get knowledge out of people's heads — and make it accessible to everyone in the company.",
  },
} as const;

export function TeamBlock({ locale = "de" }: { locale?: Locale }) {
  const t = T[locale];
  return (
    <WindowCard graphic={<TeamGraphic locale={locale} />}>
      <p className="text-lg">{t.para}</p>
    </WindowCard>
  );
}

function TeamGraphic({ locale }: { locale: Locale }) {
  const t = T[locale];
  return (
    <div className="grid w-full items-end gap-[var(--header-gap)] @3xl:grid-cols-[1fr_auto_1fr]">
      <div className="flex flex-col items-center gap-[var(--header-gap)] @3xl:items-start">
        <div className="flex items-center gap-8 @3xl:self-center">
          <div className="flex flex-col items-center gap-1">
            <p className="whitespace-nowrap font-semibold">Simon Waiß</p>
            <p className="text-[12px]">{t.physics}</p>
          </div>
          <Image
            src={rabanHead}
            alt={t.headAlt}
            className={`${HEAD} [transform:scaleX(-1)_rotate(-10deg)]`}
          />
        </div>
        <Image
          src={tuebingenLogo}
          alt="Eberhard Karls Universität Tübingen"
          className={`h-14 w-auto @3xl:h-20`}
        />
      </div>
      <CatBox
        className="w-[clamp(8rem,16cqw,14rem)] justify-self-center"
        locale={locale}
      />
      <div className="flex flex-col items-center gap-[var(--header-gap)] @3xl:items-end">
        <div className="flex items-center gap-8 @3xl:self-center">
          <Image
            src={rabanHead}
            alt={t.headAlt}
            className={`${HEAD} [transform:rotate(-10deg)]`}
          />
          <div className="flex flex-col items-center gap-1">
            <p className="whitespace-nowrap font-semibold">Johannes Koch</p>
            <p className="text-[12px]">{t.anthropology}</p>
          </div>
        </div>
        <Image
          src={heidelbergLogo}
          alt="Universität Heidelberg"
          className={`h-16 w-auto @3xl:h-24`}
        />
      </div>
    </div>
  );
}
