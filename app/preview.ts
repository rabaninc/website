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
      "Hakt ein Ablauf in der Produktion, sagst du Raban, was du siehst, und bekommst die Lösung eurer Erfahrenen. Die erzählen sie einmal, aufschreiben muss niemand etwas.",
    alt: "Raban. Behält Wissen wenn Leute gehen.",
    ogLocale: "de_DE",
  },
  en: {
    title: "Raban - Knowing what stays",
    description:
      "When a process in production stalls, tell Raban what you see and get the fix your experienced people use. They explain it once; nobody has to write anything down.",
    alt: "Raban. Keeps knowledge when people leave.",
    ogLocale: "en_US",
  },
} as const;
