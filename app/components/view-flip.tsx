"use client";

import type { Locale } from "@/utils/locale";

import { useView } from "./agent-view";
import { LinkStyle } from "./link-style";

// The view switch, under the language switch in the footer card and built
// like it: a capsule with a knob behind the current word, the word on the
// knob inverted to the card so it stays legible. Mensch shows the page,
// Agent its Markdown (agent-view.tsx). Words instead of letters, so the
// capsule is as wide as the longer word needs: two equal halves (the grid's
// 1fr columns take the wider word's width), and the knob, a half less 2px of
// air on each side, travels exactly one half.
const T = {
  de: { human: "Mensch", agent: "Agent", label: "Seite als Agent ansehen" },
  en: { human: "Human", agent: "Agent", label: "View the page as an agent" },
} as const;

export function ViewFlip({ locale }: { locale: Locale }) {
  const { agent, setAgent } = useView();
  const t = T[locale];
  return (
    <LinkStyle tone="light" icon highlight={false}>
      <button type="button" onClick={() => setAgent(!agent)} aria-pressed={agent} className="cursor-pointer">
        <span
          aria-hidden="true"
          className="relative inline-grid h-7 grid-cols-[1fr_1fr] items-center rounded-full border border-current/40 text-[12px] leading-none"
        >
          <span
            className={`absolute left-[2px] top-[2px] h-[22px] w-[calc(50%-4px)] rounded-full bg-current transition-transform duration-150 ease-out ${
              agent ? "translate-x-[calc(100%+4px)]" : ""
            }`}
          />
          {/* Centred as glyphs, like the language switch's letters. */}
          <span className={`relative px-3 text-center [text-box:trim-both_cap_alphabetic] ${agent ? "" : "text-slab"}`}>
            {t.human}
          </span>
          <span className={`relative px-3 text-center [text-box:trim-both_cap_alphabetic] ${agent ? "text-slab" : ""}`}>
            {t.agent}
          </span>
        </span>
        <span className="sr-only">{t.label}</span>
      </button>
    </LinkStyle>
  );
}
