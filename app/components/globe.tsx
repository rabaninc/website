"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import type { Geo } from "./globe-map";

const GlobeMap = dynamic<Geo>(() => import("./globe-map").then((m) => m.GlobeMap), {
  ssr: false,
});

export function Globe({ geo }: { geo: Geo }) {
  // Location is resolved server-side (utils/visitor-geo.ts, which also falls
  // back to Germany when the edge geo headers are absent, e.g. local dev) and
  // passed in as a prop — no device storage, so no consent needed.
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    function onRefresh() {
      setRefreshKey((k) => k + 1);
    }
    window.addEventListener("raban-refresh", onRefresh);
    return () => window.removeEventListener("raban-refresh", onRefresh);
  }, []);

  return <GlobeMap key={refreshKey} {...geo} />;
}
