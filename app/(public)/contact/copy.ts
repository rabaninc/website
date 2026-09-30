import type { Locale } from "@/utils/locale";
import { blocks, link } from "@/utils/markdown";

// The words of /contact in both languages: page.tsx sets them, markdown()
// below writes them for agents (utils/markdown.ts).
export const T = {
  de: {
    label: "Kontakt",
    display: "Schreib uns.",
    pilotLabel: "Zweites Pilotunternehmen",
    pilot: "Ein Unternehmen arbeitet bereits mit Raban. Wir suchen ein zweites, das das Wissen seiner Experten sichern will, bevor es mit ihnen geht, und das Raban dabei mitformt. Wenn das nach euch klingt, schreib uns.",
  },
  en: {
    label: "Contact",
    display: "Write to us.",
    pilotLabel: "Second pilot company",
    pilot: "One company is already working with Raban. We are looking for a second one that wants to secure its experts' knowledge before it leaves with them, and that shapes Raban along the way. If that sounds like you, write to us.",
  },
} as const;

const ADDRESS = "humans@raban.ai";

/** /contact in Markdown: the label as the title, the line, the address as
 *  a mail link, and the pilot call under its label. */
export function markdown(locale: Locale): string {
  const t = T[locale];
  return blocks(
    `# ${t.label}`,
    `**${t.display}**`,
    link(ADDRESS, `mailto:${ADDRESS}`),
    `## ${t.pilotLabel}`,
    t.pilot,
  );
}
