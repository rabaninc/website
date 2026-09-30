import { isValidElement, type ReactNode } from "react";

// The agent view (2026-09-30, after cdata.com): every page also exists as
// Markdown. An agent that asks for text/markdown gets it at the page's own
// address, /about.md and the like work too (next.config.ts, app/md/), and the
// switch in the footer shows a person exactly that text. Each page writes its
// Markdown from the same copy it renders (the copy.ts beside its page.tsx),
// so the two can't drift; this file holds the small pieces they share.

export const ORIGIN = "https://raban.ai";

/** Blocks of Markdown, one blank line between them; empty ones drop out. */
export function blocks(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join("\n\n");
}

/** A bulleted list, one line per item. */
export function list(items: readonly string[]): string {
  return items.map((item) => `- ${item}`).join("\n");
}

/** An image by its alt text, at its full address, so an agent can fetch it. */
export function image(alt: string, src: string): string {
  return `![${alt}](${new URL(src, ORIGIN)})`;
}

/** A link, relative paths made absolute on raban.ai. */
export function link(text: string, href: string): string {
  return `[${text}](${new URL(href, ORIGIN)})`;
}

/** Markdown from the JSX a page sets its longer texts in (/privacy, /legal,
 *  the pitch script on /about): paragraphs, line breaks, emphasis, links and
 *  bulleted lists. Any other element passes its children through. */
export function fromReact(node: ReactNode): string {
  return walk(node)
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function walk(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(walk).join("");
  if (!isValidElement(node)) return "";
  const { children, href } = node.props as { children?: ReactNode; href?: string };
  const inner = walk(children);
  switch (node.type) {
    case "p":
      return `\n\n${inner.trim()}\n\n`;
    case "br":
      return "  \n";
    case "em":
    case "i":
      return `*${inner}*`;
    case "strong":
    case "b":
      return `**${inner}**`;
    case "a":
      return href ? link(inner, href) : inner;
    case "ul":
      return `\n\n${inner.trimEnd()}\n\n`;
    case "li":
      return `- ${inner.trim()}\n`;
    default:
      return inner;
  }
}
