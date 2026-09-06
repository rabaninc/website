"use client";

import { useState } from "react";

import { LinkStyle } from "@/app/components/link-style";
import { TrafficLights, WINDOW } from "@/app/components/pitch/window-card";
import type { Locale } from "@/utils/locale";

// TODO before launch: this mailbox has to actually exist and be monitored.
// Deliberately NOT a founder's personal address — a company address only.
const ADDRESS = "kontakt@raban.ai";

// The card's own words — the label and the copy button's accessible name.
const T = {
  de: { email: "E-Mail", copy: "E-Mail-Adresse kopieren", copied: "Kopiert" },
  en: { email: "Email", copy: "Copy email address", copied: "Copied" },
} as const;

export function ContactCard({ locale = "de" }: { locale?: Locale }) {
  const t = T[locale];
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard can be blocked (insecure context, denied permission); the
      // mailto link below is the fallback, so just leave the icon unchanged.
    }
  }

  return (
    <div className={`space-y-[var(--header-gap)] font-medium ${WINDOW}`}>
      {/* The same macOS window every graphic on the site sits in (see
          window-card.tsx): lights top-left, then the body after the header
          gap, the full width of the content like the slides. (Until
          2026-09-06 this was a hairline rounded-2xl card capped at max-w-sm.) */}
      <TrafficLights />
      {/* Header row: label left, copy action right — same shape as the canonical
          card (carried over from the source project). */}
      <div className="flex h-4 items-center justify-between">
        <span className="[text-box:trim-both_cap_alphabetic]">{t.email}</span>
        <LinkStyle icon>
          <button
            type="button"
            onClick={copy}
            aria-label={copied ? t.copied : t.copy}
            className="cursor-pointer"
          >
            {copied ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M3 8.5l3.5 3.5L13 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <rect
                  x="5.5"
                  y="5.5"
                  width="8"
                  height="8"
                  rx="1.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M10.5 2.5H3.5a1 1 0 0 0-1 1v7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </LinkStyle>
      </div>
      <hr className="mt-[var(--gutter)] border-t border-ink/10" />
      <p className="mt-[var(--gutter)]">
        <LinkStyle tone="dark">
          <a href={`mailto:${ADDRESS}`}>{ADDRESS}</a>
        </LinkStyle>
      </p>
    </div>
  );
}
