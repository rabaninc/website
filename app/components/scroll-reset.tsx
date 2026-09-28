"use client";

import { useEffect } from "react";

// Every page load starts at the top: the browser's own scroll restoration
// would drop a reload halfway down the globe. The exception is a link to an
// anchor (/#preise from the navbar on another page): that one goes to its
// section, below the sticky navbar thanks to the section's scroll margin.
export function ScrollReset() {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    const target = window.location.hash && document.getElementById(window.location.hash.slice(1));
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
  }, []);
  return null;
}
