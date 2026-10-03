import type { Metadata } from "next";
import Link from "next/link";

import { getLocale } from "@/utils/locale-server";

import PublicLayout from "./(public)/layout";
import { LinkStyle } from "./components/link-style";
import { H1 } from "./components/type";

const T = {
  de: { name: "Seite nicht gefunden", home: "Zur Startseite" },
  en: { name: "Page not found", home: "Go to the home page" },
} as const;

export async function generateMetadata(): Promise<Metadata> {
  return { title: `Raban – ${T[await getLocale()].name}` };
}

// A wrong address stands in the same frame as every page since 2026-10-03:
// the (public) layout with the footer card and its switches, rendered here
// because this root not-found answers addresses outside every route group.
// Before, it was one bare line with no footer and no way back.
export default async function NotFound() {
  const t = T[await getLocale()];
  return (
    <PublicLayout>
      <main className="px-[var(--inset)] pb-[var(--inset)] pt-[var(--content-top)] text-ink">
        <h1 className={H1}>{t.name}.</h1>
        <p className="mt-[var(--header-gap)] text-base">
          <LinkStyle>
            <Link href="/" className="cursor-pointer no-underline">
              {t.home}
            </Link>
          </LinkStyle>
        </p>
      </main>
    </PublicLayout>
  );
}
