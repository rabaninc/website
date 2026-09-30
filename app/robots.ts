import type { MetadataRoute } from "next";

// Every crawler is welcome, the AI ones included (GPTBot, ClaudeBot,
// PerplexityBot …): an assistant that cannot read the site cannot name Raban
// when someone asks it about knowledge walking out of the door.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://raban.ai/sitemap.xml",
  };
}
