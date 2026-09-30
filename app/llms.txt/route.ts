import { getLocale } from "@/utils/locale-server";

import { llms } from "../md/pages";

// llmstxt.org's index for agents, in the visitor's language (app/md/pages.ts).
export async function GET() {
  return new Response(llms(await getLocale()), {
    headers: { "Content-Type": "text/plain; charset=utf-8", Vary: "Accept-Language, Cookie" },
  });
}
