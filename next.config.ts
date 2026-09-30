import type { NextConfig } from "next";

// The agent view (utils/markdown.ts): an agent that asks for Markdown gets it
// at the page's own address, the way Cloudflare's Markdown for Agents serves
// cdata.com, and every page also has a .md twin (/index.md for the home page,
// /about.md, ...). Both go to the route in app/md/. beforeFiles, because the
// pages are files and would answer first otherwise. A path with a dot is a
// file (an image, llms.txt) and is left alone, and so are Next's own paths.
const ASKS_FOR_MARKDOWN = [{ type: "header" as const, key: "accept", value: "(.*)text/markdown(.*)" }];

const nextConfig: NextConfig = {
  devIndicators: false,
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "raban-website.vercel.app" }],
        destination: "https://raban.ai/:path*",
        permanent: true,
      },
      // /product was folded into the home page in the rebuild of 2026-09-28;
      // old links land on the rows that now carry it.
      { source: "/product", destination: "/#so-arbeitet-raban", permanent: false },
    ];
  },
  // Every page points an agent at its Markdown and at llms.txt, the way
  // cdata.com's pages do (rel="describedby").
  async headers() {
    return [
      {
        source: "/",
        headers: [{ key: "Link", value: '</index.md>; rel="alternate"; type="text/markdown", </llms.txt>; rel="describedby"' }],
      },
      {
        source: "/:seite((?!md(?:/|$)|_next/)[^.]+)",
        headers: [{ key: "Link", value: '</:seite.md>; rel="alternate"; type="text/markdown", </llms.txt>; rel="describedby"' }],
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", has: ASKS_FOR_MARKDOWN, destination: "/md" },
        { source: "/:seite((?!md(?:/|$)|_next/)[^.]+)", has: ASKS_FOR_MARKDOWN, destination: "/md/:seite" },
        { source: "/index.md", destination: "/md" },
        { source: "/:seite((?!md/)[^.]+)\\.md", destination: "/md/:seite" },
      ],
    };
  },
};

export default nextConfig;
