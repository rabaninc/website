"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";

import type { Locale } from "@/utils/locale";

import { CopyButton } from "./copy-button";
import { BARE } from "./type";

// The page as an agent reads it (2026-09-30, after cdata.com). The switch in
// the footer (view-flip.tsx) swaps the page for its Markdown, fetched from the
// page's own address with Accept: text/markdown — so a person sees exactly
// what an agent gets there (next.config.ts, app/md/). The navbar and the
// footer stay. The choice lives in the layout's state: it holds while you go
// from page to page, and a reload starts over as a person — no cookie,
// nothing stored.
const T = {
  de: {
    copy: "Markdown kopieren",
    copied: "Kopiert",
    failed: "Die Markdown-Fassung dieser Seite ließ sich nicht laden.",
  },
  en: {
    copy: "Copy Markdown",
    copied: "Copied",
    failed: "The Markdown version of this page could not be loaded.",
  },
} as const;

const View = createContext<{ agent: boolean; setAgent: (agent: boolean) => void }>({
  agent: false,
  setAgent: () => {},
});

export function useView() {
  return useContext(View);
}

export function ViewProvider({ children }: { children: React.ReactNode }) {
  const [agent, setAgent] = useState(false);
  return <View value={{ agent, setAgent }}>{children}</View>;
}

/** The page, or in the agent view its Markdown. */
export function PageOrMarkdown({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const { agent } = useView();
  const pathname = usePathname();
  // The Markdown shows only on the page it was fetched for: a new page's view
  // stays empty for the moment its text takes to arrive rather than show the
  // last page's. A new language keeps the old text in place until the new one
  // replaces it, so the page keeps its height and you stay by the switch.
  const [fetched, setFetched] = useState<{ pathname: string; text: string } | null>(null);

  useEffect(() => {
    if (!agent) return;
    const request = new AbortController();
    fetch(pathname, { headers: { Accept: "text/markdown" }, cache: "no-store", signal: request.signal })
      .then((response) => {
        const markdown = response.headers.get("content-type")?.startsWith("text/markdown");
        if (!response.ok || !markdown) throw new Error(`${response.status}`);
        return response.text();
      })
      .then((text) => setFetched({ pathname, text }))
      .catch(() => {
        if (!request.signal.aborted) setFetched({ pathname, text: T[locale].failed });
      });
    return () => request.abort();
  }, [agent, pathname, locale]);

  // Flipping the view starts at the top of what's shown now, and so does a
  // new page in the agent view (Next scrolls only a page it renders). The
  // first render leaves the scroll to ScrollReset, which honours #anchors.
  const last = useRef({ agent, pathname });
  useLayoutEffect(() => {
    const was = last.current;
    last.current = { agent, pathname };
    if (was.agent !== agent || (agent && was.pathname !== pathname)) window.scrollTo(0, 0);
  }, [agent, pathname]);

  if (!agent) return children;
  const text = fetched?.pathname === pathname ? fetched.text : null;
  return (
    <main className="px-[var(--inset)] pb-[var(--inset)] pt-[var(--content-top)] text-ink">
      {/* The reading measure of /privacy and /legal, centred. The copy button
          rides along under the navbar: its row takes no room (the negative
          margin gives its height back) and passes clicks through to the text,
          which keeps a column free for the button — out in the margin from
          xl, where the margin has room. The row is as tall as the button, so
          at the end of the text the button stops with it instead of hanging
          into the footer card. */}
      <div className="mx-auto max-w-[var(--measure)]">
        {text !== null && (
          <>
            <div className="pointer-events-none sticky top-[var(--content-top)] z-10 -mb-9 flex h-9 justify-end xl:-mr-[calc(36px+var(--gutter))]">
              <CopyButton
                text={text}
                label={T[locale].copy}
                done={T[locale].copied}
                className="pointer-events-auto"
              />
            </div>
            {/* Without the page's half-pixel outline, like the FAQ answers: a
                page of small mono type reads too heavy with it. */}
            <pre
              className={`${BARE} whitespace-pre-wrap break-words pr-12 font-mono text-[13px] font-[400] leading-[1.6] xl:pr-0`}
            >
              {text}
            </pre>
          </>
        )}
      </div>
    </main>
  );
}
