import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import { getLocale } from "@/utils/locale-server";
import { Navbar } from "./components/navbar";
import { ScrollReset } from "./components/scroll-reset";
import "./globals.css";

export const metadata: Metadata = { title: "Raban" };

// The one typeface, for every word on the site and every label inside the
// graphics: Archivo — the face the pitch deck is set in (its "Modernist"
// design system runs Archivo for headings at 800 and body at 400), so the
// site and the deck read as one thing. A grotesque with a slightly wider
// stance than Helvetica, which suits the wide, flat graphics. Self-hosted by
// next/font at build time (no request to Google at runtime, in keeping with
// the site's no-tracking stance) and published as the --font-sans variable
// that globals.css puts on body, with the system Helvetica stack behind it.
// latin-ext for the German umlauts and ß; the variable font carries every
// weight, so headings keep their black.
const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-sans",
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // The visitor's language (a cookie, German by default — see utils/locale.ts)
  // names the document and drives the navbar; the pages read it themselves.
  const locale = await getLocale();
  return (
    // No inline script and no hydration exemption here any more: both served
    // the dark theme's stored override, gone 2026-09-06 (see app/globals.css).
    <html lang={locale} className={archivo.variable}>
      <body>
        <ScrollReset />
        <Navbar locale={locale} />
        {children}
      </body>
    </html>
  );
}
