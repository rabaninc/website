import type { NextConfig } from "next";

// The agent view (utils/markdown.ts): an agent that asks for Markdown gets it
// at the page's own address, the way Cloudflare's Markdown for Agents serves
// cdata.com, and every page also has a .md twin (/index.md for the home page,
// /about.md, ...). Both go to the route in app/md/. beforeFiles, because the
// pages are files and would answer first otherwise. A path with a dot is a
// file (an image, llms.txt) and is left alone, and so are Next's own paths.
const ASKS_FOR_MARKDOWN = [{ type: "header" as const, key: "accept", value: "(.*)text/markdown(.*)" }];

// Rules every response hands the browser (2026-10-22): no other site may frame
// ours, files are only what their type says, a link out names our domain but
// not the page, and the site asks for no camera, microphone or location (the
// globe reads the country from Vercel's headers, not from the browser). HTTPS
// only comes from Vercel itself. No script policy (CSP beyond frame-ancestors):
// the globe and the window scenes would need testing against one first.
const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
];

const nextConfig: NextConfig = {
  devIndicators: false,
  // No "X-Powered-By: Next.js" telling every visitor what to look up.
  poweredByHeader: false,
  // Since Next 16.3, `next dev` run by a coding agent writes an English block
  // of its own into AGENTS.md and puts it back on every run; AGENTS.md here
  // is ours, in German, so that stays off.
  agentRules: false,
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
      { source: "/:path*", headers: SECURITY_HEADERS },
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
