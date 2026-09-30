import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { getLocale } from "@/utils/locale-server";
import { Navbar } from "./components/navbar";
import { ScrollReset } from "./components/scroll-reset";
import "./globals.css";

// The link preview (iMessage, WhatsApp, Slack, LinkedIn): Johannes' line as the
// title (2026-09-30), the hero's deck as the description, and a brand card
// drawn by werkzeuge/vorschau/ as the image. Every page shares it, /about
// included. The language follows the visitor's like the pages do, so a phone
// set to English gets the English card; a crawler that sends no language gets
// German.
const PREVIEW = {
  de: {
    title: "Raban – Wissen was bleibt",
    description:
      "Frag Raban, und du bekommst die Antwort aus euren Unterlagen, mit Fundstelle. Steht sie nirgends, fragt Raban den Menschen, der es weiß.",
    alt: "Raban. Behält Wissen wenn Leute gehen.",
    ogLocale: "de_DE",
  },
  en: {
    title: "Raban – Knowing what stays",
    description:
      "Ask Raban and get the answer from your company's documents, with the source. If it isn't written down anywhere, Raban asks the person who knows.",
    alt: "Raban. Keeps knowledge when people leave.",
    ogLocale: "en_US",
  },
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const p = PREVIEW[locale];
  const image = { url: `/vorschau/${locale}.png`, width: 1200, height: 630, alt: p.alt };
  return {
    metadataBase: new URL("https://raban.ai"),
    title: "Raban",
    description: p.description,
    openGraph: {
      type: "website",
      siteName: "Raban",
      title: p.title,
      description: p.description,
      locale: p.ogLocale,
      images: [image],
    },
    twitter: { card: "summary_large_image", title: p.title, description: p.description, images: [image] },
  };
}

// Apple's own typeface, the way apple.com sets it (Johannes, 2026-09-29): SF
// Pro for every word and SF Mono for the small labels. SF's licence covers
// Apple platforms only, so it is never served from here — the stack in
// globals.css asks the visitor's system for it (-apple-system), which on a
// Mac, iPhone or iPad IS SF, optical sizes included. Everyone else falls
// back to these two, self-hosted by next/font (no request to Google at
// runtime): Inter, the free face closest to SF, and JetBrains Mono. Not
// preloaded — an Apple device never uses them, so it should not download
// them either. (History: Inter Tight, 2026-09-28 to 2026-09-29, as the
// closest free twin of typesafe.ai's Die Grotesk.)
const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  preload: false,
  variable: "--font-inter",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  display: "swap",
  preload: false,
  variable: "--font-jetbrains",
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // The visitor's language (a cookie, German by default — see utils/locale.ts)
  // names the document and drives the navbar; the pages read it themselves.
  const locale = await getLocale();
  return (
    // No inline script and no hydration exemption here any more: both served
    // the dark theme's stored override, gone 2026-09-06 (see app/globals.css).
    <html lang={locale} className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <ScrollReset />
        <Navbar locale={locale} />
        {children}
      </body>
    </html>
  );
}
