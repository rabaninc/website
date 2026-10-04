// The link preview (iMessage, WhatsApp, Slack, LinkedIn): Johannes' line as the
// title (2026-09-30), the hero's deck as the description, and a brand card
// drawn by werkzeuge/vorschau/ as the image. Every page shares it, /about
// included. The language follows the visitor's like the pages do, so a phone
// set to English gets the English card; a crawler that sends no language gets
// German. The same title and description head every page's Markdown for
// agents (app/md/pages.ts).
export const PREVIEW = {
  de: {
    title: "Raban - Wissen was bleibt",
    description:
      "Frag Raban, und du bekommst die Antwort aus euren Unterlagen, mit Fundstelle. Steht sie nirgends, fragt Raban den Menschen, der es weiß.",
    alt: "Raban. Behält Wissen wenn Leute gehen.",
    ogLocale: "de_DE",
  },
  en: {
    title: "Raban - Knowing what stays",
    description:
      "Ask Raban and get the answers from your company's refined knowledge, with the source. If it isn't written down anywhere, Raban asks the person who knows.",
    alt: "Raban. Keeps knowledge when people leave.",
    ogLocale: "en_US",
  },
} as const;
