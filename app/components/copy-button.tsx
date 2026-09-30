"use client";

import { useState } from "react";

// A small square button that copies a text — the address on /contact, the
// Markdown in the agent view — and shows a check for a moment once it has.
// Its fill is solid (the page's sage, and on hover the 6% ink tint mixed into
// it rather than laid over it), so it can ride over the Markdown as it
// scrolls by and still look the same as a bare button on the page.
export function CopyButton({
  text,
  label,
  done,
  className = "",
}: {
  text: string;
  /** What the button does, for screen readers. */
  label: string;
  /** What it says once it has. */
  done: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard refused (permissions, old browser): nothing to show.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? done : label}
      className={`grid size-9 cursor-pointer place-items-center border border-ink bg-paper hover:bg-[color-mix(in_srgb,var(--ink)_6%,var(--paper))] ${className}`}
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
  );
}
