import type { MetadataRoute } from "next";

// The public pages, for search engines and the assistants that read their
// indexes. A new page goes in here too.
export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/about", "/contact", "/legal", "/privacy"].map((path) => ({
    url: `https://raban.ai${path}`,
  }));
}
