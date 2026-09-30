import { getLocale } from "@/utils/locale-server";
import { ORIGIN } from "@/utils/markdown";

import { document, pageAt } from "../pages";

// One page as Markdown (app/md/pages.ts). next.config.ts sends two kinds of
// request here: a page's own address asked with Accept: text/markdown, and
// its .md twin. The language is the visitor's, as on the page: the cookie the
// footer switch writes, else Accept-Language, else German.
const NOT_FOUND = {
  de: "# Seite nicht gefunden\n\nAlle Seiten: https://raban.ai/llms.txt\n",
  en: "# Page not found\n\nAll pages: https://raban.ai/llms.txt\n",
} as const;

export async function GET(_: Request, { params }: { params: Promise<{ seite?: string[] }> }) {
  const { seite = [] } = await params;
  const page = pageAt(`/${seite.join("/")}`);
  const locale = await getLocale();
  const headers = new Headers({
    "Content-Type": "text/markdown; charset=utf-8",
    // The same address answers HTML or Markdown, in German or English.
    Vary: "Accept, Accept-Language, Cookie",
  });
  if (!page) return new Response(NOT_FOUND[locale], { status: 404, headers });
  // Search engines should keep the page itself, not its Markdown.
  headers.set("Link", `<${new URL(page.path, ORIGIN)}>; rel="canonical"`);
  return new Response(document(page, locale), { headers });
}
