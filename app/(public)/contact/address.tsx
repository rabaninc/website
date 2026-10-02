"use client";

import { CopyButton } from "@/app/components/copy-button";
import { SECTION } from "@/app/components/type";

const ADDRESS = "humans@raban.ai";

const T = {
  de: { copy: "E-Mail-Adresse kopieren", copied: "Kopiert" },
  en: { copy: "Copy email address", copied: "Copied" },
} as const;

// The address as typesafe sets a call to action: heading-sized, underlined,
// a mail link — with a square button beside it that copies it, for anyone
// whose mail isn't in the browser. The button is as tall as the address
// reads, from the tops of its letters to the underline (0.855em, measured on
// SF at 76px), and set down 0.08em to sit on that span rather than on the
// line box; its icon grows with it (Johannes, 2026-10-02).
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
      <CopyButton
        text={ADDRESS}
        label={t.copy}
        done={t.copied}
        size="size-[0.855em]"
        className="translate-y-[0.08em] text-[length:var(--section)] [&_svg]:size-[0.38em]"
      />
    </div>
  );
}
