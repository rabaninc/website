"use client";

import { useState } from "react";

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
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard refused (permissions, old browser): the link still works.
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
      <a
        href={`mailto:${ADDRESS}`}
        className={`${SECTION} underline decoration-1 underline-offset-[0.12em] hover:text-ink/60 [&:lang(en)]:normal-case`}
      >
        {ADDRESS}
      </a>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? t.copied : t.copy}
        className="grid size-9 cursor-pointer place-items-center border border-ink hover:bg-ink/[0.06]"
      >
        {copied ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8.5l3.5 3.5L13 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <rect x="5.5" y="5.5" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.25" />
            <path d="M10.5 3.5v-.5a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h.5" stroke="currentColor" strokeWidth="1.25" />
          </svg>
        )}
      </button>
    </div>
  );
}
