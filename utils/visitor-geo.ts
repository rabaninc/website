// Visitor location for the globe, read from Vercel's edge geo headers.
//
// The globe shows the COUNTRY, never the city: city-level IP geolocation is
// routinely off by a whole region (a Frankfurt exit node for a Stuttgart
// visitor), and a wrong city name is the one thing a reader can check. So the
// marker sits on the country's own centre (utils/country-centroids.ts, derived
// from the same shapes the globe draws) rather than on the IP's coordinates —
// the label and the dot then agree, and both are right.
//
// The IP's own coordinates are still the fallback for the ~89 microstates and
// territories the 110m atlas has no shape for (Singapore, Malta, Hong Kong...),
// where a city point IS country-level precision.
//
// Derived per request and never stored: no cookie, nothing kept after the
// response, so this needs no consent banner under § 25 TDDDG (see /privacy).
// Reading headers opts the calling route into dynamic rendering.

import { headers } from "next/headers";

import { COUNTRY_CENTROIDS } from "./country-centroids";
import type { Locale } from "./locale";

export type VisitorGeo = { lat: number; lng: number; label: string | null };

// Where the globe rests when the edge sends no location at all (local dev, or
// a visitor it can't place): Germany, country-level like every other resting
// point, so a fallback looks like a real answer.
const FALLBACK = "DE";

export async function visitorGeo(locale: Locale): Promise<VisitorGeo> {
  const h = await headers();
  const code = h.get("x-vercel-ip-country");
  const centroid = code ? COUNTRY_CENTROIDS[code.toUpperCase()] : undefined;
  if (centroid) {
    return { lng: centroid[0], lat: centroid[1], label: countryName(code, locale) };
  }

  // No shape for this country (or no country header at all) — aim at the IP's
  // coordinates instead, still labelled with the country.
  const lat = h.get("x-vercel-ip-latitude");
  const lng = h.get("x-vercel-ip-longitude");
  if (lat && lng) return { lat: parseFloat(lat), lng: parseFloat(lng), label: countryName(code, locale) };
  const [fallbackLng, fallbackLat] = COUNTRY_CENTROIDS[FALLBACK];
  return { lng: fallbackLng, lat: fallbackLat, label: countryName(FALLBACK, locale) };
}

// ISO 3166-1 alpha-2 -> the country's name in the page's language („Deutschland“
// on the German page, "Germany" on the English one; until 2026-10-03 it was
// English on both), via the runtime's own ICU data (no table to maintain).
// Vercel also emits non-ISO placeholders such as "T1" for Tor exits; Intl
// throws on those, and "XX" resolves to nothing.
function countryName(code: string | null, locale: Locale): string | null {
  if (!code) return null;
  try {
    return new Intl.DisplayNames([locale], { type: "region", fallback: "none" }).of(code) ?? null;
  } catch {
    return null;
  }
}
