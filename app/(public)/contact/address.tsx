"use client";

import { CopyButton } from "@/app/components/copy-button";
import { SECTION } from "@/app/components/type";

const ADDRESS = "humans@raban.ai";

const T = {
  de: { copy: "E-Mail-Adresse kopieren", copied: "Kopiert" },
  en: { copy: "Copy email address", copied: "Copied" },
} as const;

// The address as typesafe sets a call to action: heading-sized, underlined,
// a mail link — with a small square button beside it that copies it, for
// anyone whose mail isn't in the browser.
export function Address({ locale }: { locale: "de" | "en" }) {
  const t = T[locale];
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
      <a
        href={`mailto:${ADDRESS}`}
        className={`${SECTION} underline decoration-1 underline-offset-[0.12em] hover:text-ink/60 [&:lang(en)]:normal-case`}
      >
        {ADDRESS}
      </a>
      <CopyButton text={ADDRESS} label={t.copy} done={t.copied} />
    </div>
  );
}
