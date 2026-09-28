import type { Metadata } from "next";
import { Inter_Tight, JetBrains_Mono } from "next/font/google";
import { getLocale } from "@/utils/locale-server";
import { Navbar } from "./components/navbar";
import { ScrollReset } from "./components/scroll-reset";
import "./globals.css";

export const metadata: Metadata = { title: "Raban" };

// Two typefaces, after typesafe.ai (the reference the founders chose for the
// 2026-09-28 rebuild): Inter Tight for every word, JetBrains Mono for the small
// labels. typesafe sets its type in Die Grotesk C, a paid face; Inter Tight is
// the closest free one measured side by side — the same cap height, about 3.5%
// wider, which the headings take back with negative tracking (globals.css).
// Self-hosted by next/font at build time (no request to Google at runtime, in
// keeping with the site's no-tracking stance); latin-ext for umlauts and ß.
const interTight = Inter_Tight({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter-tight",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400"],
  display: "swap",
  variable: "--font-jetbrains",
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // The visitor's language (a cookie, German by default — see utils/locale.ts)
  // names the document and drives the navbar; the pages read it themselves.
  const locale = await getLocale();
  return (
    // No inline script and no hydration exemption here any more: both served
    // the dark theme's stored override, gone 2026-09-06 (see app/globals.css).
    <html lang={locale} className={`${interTight.variable} ${jetbrainsMono.variable}`}>
      <body>
        <ScrollReset />
        <Navbar locale={locale} />
        {children}
      </body>
    </html>
  );
}
