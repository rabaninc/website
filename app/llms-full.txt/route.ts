import { getLocale } from "@/utils/locale-server";

import { llmsFull } from "../md/pages";

// Every page's Markdown in one file, for an agent that wants it all in one
// request (app/md/pages.ts).
export async function GET() {
  return new Response(llmsFull(await getLocale()), {
    headers: { "Content-Type": "text/plain; charset=utf-8", Vary: "Accept-Language, Cookie" },
  });
}
