import type { NextConfig } from "next";

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
};

export default nextConfig;
