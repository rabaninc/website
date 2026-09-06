"use client";

import { useEffect, useSyncExternalStore } from "react";

import type { Locale } from "@/utils/locale";

import { LinkStyle } from "./components/link-style";

const T = {
  de: { failed: "Etwas ist schiefgelaufen.", retry: "Erneut versuchen" },
  en: { failed: "Something went wrong.", retry: "Try again" },
} as const;

function subscribeNever() {
  return () => {};
}

function readDocumentLang(): Locale {
  return document.documentElement.lang === "en" ? "en" : "de";
}

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  // A client component can't read the cookie or the request headers, but the
  // root layout has already resolved the language and written it onto <html
  // lang>, so the error page takes its words from there — through
  // useSyncExternalStore so the server render (and the hydration pass) say
  // German and the client reads the real value on the same tick.
  const locale = useSyncExternalStore(subscribeNever, readDocumentLang, (): Locale => "de");
  const t = T[locale];

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="px-[var(--inset)] pb-[var(--content-gap)] pt-[var(--content-top)]">
      <p className="text-base">{t.failed}</p>
      <LinkStyle>
        <button
          type="button"
          onClick={() => unstable_retry()}
          className="mt-3 cursor-pointer bg-transparent text-base"
        >
          {t.retry}
        </button>
      </LinkStyle>
    </main>
  );
}
