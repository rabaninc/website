import { footerMarkdown } from "@/app/components/footer";
import { PREVIEW } from "@/app/preview";
import type { Locale } from "@/utils/locale";
import { ORIGIN, blocks, link, list } from "@/utils/markdown";

import * as about from "../(public)/about/copy";
import * as contact from "../(public)/contact/copy";
import * as home from "../(public)/copy";
import * as legal from "../(public)/legal/copy";
import * as privacy from "../(public)/privacy/copy";

// Every page of the site as Markdown, for agents (utils/markdown.ts): the
// pages in the order llms.txt lists them, each with its name and the writer
// beside its copy. A page's Markdown lives at its own address (asked with
// Accept: text/markdown) and at its .md twin — /index.md for the home page —
// both routed to app/md/ by next.config.ts. A new page goes in this list.
type Page = { path: string; name: (locale: Locale) => string; markdown: (locale: Locale) => string };

export const PAGES: Page[] = [
  { path: "/", name: (l) => ({ de: "Startseite", en: "Home" })[l], markdown: home.markdown },
  { path: "/about", name: (l) => about.T[l].label, markdown: about.markdown },
  { path: "/contact", name: (l) => contact.T[l].label, markdown: contact.markdown },
  { path: "/privacy", name: (l) => privacy.H1[l], markdown: privacy.markdown },
  { path: "/legal", name: (l) => legal.H1[l], markdown: legal.markdown },
];

export function pageAt(path: string): Page | undefined {
  return PAGES.find((page) => page.path === path);
}

/** Where a page's Markdown can be fetched without the Accept header. */
function twin(page: Page): string {
  return page.path === "/" ? "/index.md" : `${page.path}.md`;
}

/** A page's title: the link preview's line on the home page, „Raban - <name>“
 *  on the others. The browser tab and search results show it (each page's
 *  generateMetadata reads it here, since 2026-10-03; before, every tab said
 *  „Raban“), and its Markdown's frontmatter carries the same. */
export function titleAt(path: string, locale: Locale): string {
  const page = pageAt(path);
  return !page || page.path === "/" ? PREVIEW[locale].title : `Raban - ${page.name(locale)}`;
}

/** The frontmatter an agent reads first, as Cloudflare's Markdown for Agents
 *  writes it: title, description and image of the page's link preview, plus
 *  its address and language. */
function frontmatter(page: Page, locale: Locale): string {
  return [
    "---",
    `title: ${JSON.stringify(titleAt(page.path, locale))}`,
    `description: ${JSON.stringify(PREVIEW[locale].description)}`,
    `url: ${new URL(page.path, ORIGIN)}`,
    `language: ${locale}`,
    `image: ${new URL(`/vorschau/${locale}.png`, ORIGIN)}`,
    "---",
  ].join("\n");
}

/** One page as an agent gets it: frontmatter, the page, and the footer card. */
export function document(page: Page, locale: Locale): string {
  return blocks(frontmatter(page, locale), page.markdown(locale), "---", footerMarkdown(locale)) + "\n";
}

const LLMS = {
  de: {
    how: "Jede Seite gibt es auch als Markdown: an ihrer eigenen Adresse mit `Accept: text/markdown` oder unter ihrem Pfad mit `.md` (die Startseite unter `/index.md`). Die Sprache folgt `Accept-Language`; ohne Angabe Deutsch.",
    pages: "Seiten",
    full: "Alle Seiten in einer Datei",
  },
  en: {
    how: "Every page is also available as Markdown: at its own address with `Accept: text/markdown`, or at its path plus `.md` (the home page at `/index.md`). The language follows `Accept-Language`; without one, German.",
    pages: "Pages",
    full: "All pages in one file",
  },
} as const;

/** /llms.txt (llmstxt.org): what Raban is, in the hero's words, and where
 *  each page's Markdown is. */
export function llms(locale: Locale): string {
  const t = LLMS[locale];
  return (
    blocks(
      "# Raban",
      `> ${home.T[locale].lede.replace(/\n/g, " ")} ${PREVIEW[locale].description}`,
      t.how,
      `## ${t.pages}`,
      list(PAGES.map((page) => link(page.name(locale), twin(page)))),
      "## Optional",
      list([link(t.full, "/llms-full.txt")]),
    ) + "\n"
  );
}

/** /llms-full.txt: every page's Markdown in one file, each under its own
 *  frontmatter, and the footer card once at the end. */
export function llmsFull(locale: Locale): string {
  return (
    blocks(
      ...PAGES.map((page) => blocks(frontmatter(page, locale), page.markdown(locale))),
      "---",
      footerMarkdown(locale),
    ) + "\n"
  );
}
