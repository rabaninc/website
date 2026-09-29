import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { getLocale } from "@/utils/locale-server";
import { Navbar } from "./components/navbar";
import { ScrollReset } from "./components/scroll-reset";
import "./globals.css";

export const metadata: Metadata = { title: "Raban" };

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
  weight: ["300", "400"],
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
