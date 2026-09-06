"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import type { Locale } from "@/utils/locale";

import { LinkStyle } from "./link-style";

// The right-hand navbar links (also stacked in the phone menu), per language.
// Drives both the rendered actions and their breadcrumb labels, so the two
// can't drift.
const NAV_LINKS: Record<Locale, [string, string][]> = {
  de: [
    ["/product", "Produkt"],
    ["/about", "Über uns"],
    ["/contact", "Kontakt"],
  ],
  en: [
    ["/product", "Product"],
    ["/about", "About"],
    ["/contact", "Contact"],
  ],
};

// Routes that render the globe and listen for "raban-refresh" to re-run it.
// Only the home page for now — the other project also ran it on /about, which
// here is an ordinary page.
const GLOBE_PAGES = new Set(["/"]);

// Breadcrumb labels: the nav links plus the routes that only appear in a path.
const CRUMBS: Record<Locale, Record<string, string>> = {
  de: {
    ...Object.fromEntries(NAV_LINKS.de),
    "/privacy": "Datenschutz",
    "/legal": "Impressum",
  },
  en: {
    ...Object.fromEntries(NAV_LINKS.en),
    "/privacy": "Privacy policy",
    "/legal": "Legal",
  },
};

// The chrome's own words — the phone menu button and the section-index row.
const UI = {
  de: { menu: "Menü", closeMenu: "Menü schließen", sections: "Abschnitte", closeSections: "Abschnitte schließen" },
  en: { menu: "Menu", closeMenu: "Close menu", sections: "Section index", closeSections: "Close section index" },
} as const;

function humanize(segment: string): string {
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Opaque id segments (e.g. a person's UUID) don't humanize into anything
// readable, so they show a placeholder until the page supplies a real label
// via "raban-crumb" (see overrides below).
const ID_SEGMENT = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Breadcrumbs from the URL path: each parent segment, showing depth from home.
// overrides lets a page label a segment the path can't (an id → its name).
function pathCrumbs(
  pathname: string,
  overrides: Record<string, string>,
  locale: Locale,
): { href: string; label: string }[] {
  let href = "";
  return pathname
    .split("/")
    .filter(Boolean)
    .map((segment) => {
      href += `/${segment}`;
      const label =
        overrides[href] ??
        CRUMBS[locale][href] ??
        (ID_SEGMENT.test(segment) ? "…" : humanize(segment));
      return { href, label };
    });
}

export function Navbar({ locale = "de" }: { locale?: Locale }) {
  const pathname = usePathname();
  const ui = UI[locale];
  // Page-supplied labels for path segments the URL can't name (e.g. an id → its
  // person's name); pages dispatch "raban-crumb" once resolved.
  const [crumbOverrides, setCrumbOverrides] = useState<Record<string, string>>({});
  const crumbs = pathCrumbs(pathname, crumbOverrides, locale);
  const trailRef = useRef<HTMLDivElement>(null);
  const [overflowing, setOverflowing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // The section index of a long document (/privacy, /legal), published by
  // SectionIndex over "raban-sections". On a phone there's no margin to put
  // a column of it in, so the navbar grows a second row for it instead — the
  // same bar, a different job. Empty everywhere else, which is what keeps the
  // row off every other page.
  const [sections, setSections] = useState<{ id: string; title: string }[]>([]);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [sectionsOpen, setSectionsOpen] = useState(false);
  const hasSectionBar = sections.length > 0;
  const activeIndex = sections.findIndex((s) => s.id === activeSection);
  const activeLabel =
    activeIndex >= 0 ? `${activeIndex + 1}. ${sections[activeIndex].title}` : "";

  // Shared handler for every navbar/navcard link: always closes the navcard, and
  // for a link to the page you're already on re-triggers it instead of doing
  // nothing — scroll to top, and refresh the globe on globe pages.
  const onSamePageClick = (href: string) => (e: React.MouseEvent) => {
    setMenuOpen(false);
    if (href === pathname) {
      e.preventDefault();
      window.scrollTo(0, 0);
      if (GLOBE_PAGES.has(pathname)) {
        window.dispatchEvent(new Event("raban-refresh"));
      }
    }
  };

  // The right-hand actions, rendered both inline (desktop) and stacked in the
  // mobile menu. onNavigate closes the menu after a tap. Kept in one place so
  // the two layouts can't drift.
  const actions = (onNavigate?: () => void, block = false) => (
    <>
      {NAV_LINKS[locale].map(([href, label]) => (
        <LinkStyle key={href} chrome block={block}>
          <Link
            href={href}
            onClick={(e) => {
              onSamePageClick(href)(e);
              onNavigate?.();
            }}
            className={`cursor-pointer no-underline ${block ? "py-2.5" : ""}`}
          >
            {label}
          </Link>
        </LinkStyle>
      ))}
    </>
  );

  // Close the phone navcard whenever the path changes. Resetting state on a route
  // change is the intended use of this effect; the set-state-in-effect lint rule misfires.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- route-change cleanup, see above
    setMenuOpen(false);
    setSectionsOpen(false);
  }, [pathname]);

  // Collect page-supplied crumb labels (keyed by href, so stale entries are
  // simply never matched).
  useEffect(() => {
    const onCrumb = (e: Event) => {
      const { href, label } = (e as CustomEvent<{ href: string; label: string }>).detail;
      setCrumbOverrides((prev) => (prev[href] === label ? prev : { ...prev, [href]: label }));
    };
    window.addEventListener("raban-crumb", onCrumb);
    return () => window.removeEventListener("raban-crumb", onCrumb);
  }, []);

  // The published section index, same channel as the crumbs above.
  useEffect(() => {
    const onSections = (e: Event) => {
      const { sections: next, active } = (
        e as CustomEvent<{ sections: { id: string; title: string }[]; active: string | null }>
      ).detail;
      setSections(next);
      setActiveSection(active);
    };
    window.addEventListener("raban-sections", onSections);
    return () => window.removeEventListener("raban-sections", onSections);
  }, []);

  // When the path is too deep to fit, scroll to keep the deepest crumbs in view
  // and flag overflow so the trail's left edge fades the clipped crumbs into the
  // paper (a CSS mask, applied below) — no overlay, so nothing can smudge.
  useEffect(() => {
    const el = trailRef.current;
    if (!el) {
      setOverflowing(false);
      return;
    }
    const update = () => {
      const over = el.scrollWidth > el.clientWidth + 1;
      setOverflowing(over);
      el.scrollLeft = over ? el.scrollWidth : 0;
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [pathname]);

  // The participant flow (demographics → interview → survey) is a focused,
  // chrome-free surface: no navbar, so nothing competes with the task. Guarded
  // after every hook above so the hook order stays stable across renders.
  if (pathname.startsWith("/interview") || pathname.startsWith("/survey")) {
    return null;
  }

  // Sticky wrapper holds both the navbar and the phone menu. It's position:sticky,
  // not fixed, on purpose: a fixed bar is welded to the viewport and won't move,
  // so it can't ride the iOS rubber-band overscroll bounce — the bar must live in
  // the scrolling flow for the bounce to carry it (fling up and release at the top
  // and it bounces with the page). Crucially NO transform/will-change on <nav>:
  // a force-promoted compositor layer fights the sticky positioning on iOS and
  // produces a mid-page drift (bar slides up on scroll-down and stays). The
  // negative margin-bottom cancels the wrapper's flow height so content still
  // starts under the bar (pages add pt-[--content-top]); the wrapper has no
  // backdrop-filter so the menu card (a sibling of <nav>) still frosts the page.
  //
  // A drag moves whatever is on top where the finger lands, and NOT the wrapper:
  // touch-pinch-zoom goes on the two things that are actually a surface — <nav>
  // and the sheet — never here. The tap-outside backdrop is a full-viewport
  // fixed layer, so locking the wrapper locks the whole screen: below where the
  // sheet ends there is nothing on top of the page, and the page has to scroll
  // there like it always did. (History: this WAS on the wrapper for exactly one
  // commit, and it froze the entire viewport whenever the navcard was open.)
  return (
    <div className="sticky top-0 z-50 mb-[calc(var(--nav-h)*-1)]">
    <nav
      // On a phone the bar hands its surface to whichever sheet is below it —
      // the navcard, or the section bar — so the two never stack into a doubled
      // frost with a seam at the divider. Same handover either way.
      className={`relative z-20 flex h-[var(--nav-h)] touch-pinch-zoom items-center justify-between gap-[var(--gutter)] rounded-b-[var(--radius)] bg-gradient-to-b from-paper/40 to-paper/15 px-[var(--gutter)] text-base shadow-[var(--lift),var(--edge-polish)] frost ${
        menuOpen ? "max-sm:rounded-b-none max-sm:bg-none max-sm:shadow-none max-sm:frost-none" : ""
      } ${
        hasSectionBar
          ? "max-xl:rounded-b-none max-xl:bg-none max-xl:shadow-none max-xl:frost-none"
          : ""
      }`}
    >
      <div className="flex min-w-0 flex-1 items-center">
        <span className="flex-none">
          <LinkStyle chrome>
            <Link
              href="/"
              className="cursor-pointer no-underline"
              onClick={onSamePageClick("/")}
            >
              Raban
            </Link>
          </LinkStyle>
        </span>
        {crumbs.length > 0 && (
          <div
            ref={trailRef}
            // When overflowing, a left-edge gradient mask fades the clipped
            // crumbs to transparent so they dissolve into the frosted navbar —
            // the fade itself signals "there's more" (no overlay, no smudge).
            // Full bar height, not the text's: overflow-x:hidden forces
            // overflow-y to compute as auto, so once the crumb links grew a
            // touch-sized hit area (LinkStyle, below lg) their padding overflowed
            // a text-height box and Chrome painted a vertical scrollbar in the
            // bar. Tall enough to hold them and the scrollbar has nothing to do.
            className={`flex h-[var(--nav-h)] min-w-0 flex-1 items-center overflow-x-hidden ${
              overflowing
                ? "ml-[calc(0.5rem+1ch)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_2rem)] [mask-image:linear-gradient(to_right,transparent,black_2rem)]"
                : ""
            }`}
          >
            <div className="flex w-max items-center whitespace-nowrap">
              {crumbs.map((c) => (
                <span key={c.href} className="flex items-center">
                  <span className="px-1 text-base text-ink">/</span>
                  <LinkStyle chrome>
                    <Link
                      href={c.href}
                      className="cursor-pointer no-underline"
                      onClick={onSamePageClick(c.href)}
                    >
                      {c.label}
                    </Link>
                  </LinkStyle>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="hidden flex-none items-center gap-[var(--gutter)] sm:flex">
        {actions()}
      </div>
      {/* Phone: one button toggles the navcard, swapping + for × in place. */}
      <div className="flex h-[var(--nav-h)] flex-none items-center sm:hidden">
        <LinkStyle chrome>
          <button
            type="button"
            aria-label={menuOpen ? ui.closeMenu : ui.menu}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="cursor-pointer bg-transparent p-0"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {menuOpen ? (
                <>
                  <line x1="4" y1="4" x2="12" y2="12" />
                  <line x1="12" y1="4" x2="4" y2="12" />
                </>
              ) : (
                <>
                  <line x1="8" y1="3" x2="8" y2="13" />
                  <line x1="3" y1="8" x2="13" y2="8" />
                </>
              )}
            </svg>
          </button>
        </LinkStyle>
      </div>
    </nav>
      {/* The phone/tablet sheet — the navbar's surface unrolling downward: a
          full-width frosted veil from top:0 (behind the navbar, z-10 under the
          nav's z-20). Whenever it's showing, the navbar drops its own frost so
          this sheet is the single continuous surface across the whole card —
          no double-frost seam at a divider.
          ONE sheet, not one per feature. The page's section bar and the nav
          links both unroll from the same top:0 surface, so they STACK inside it
          and the sheet simply grows further down.
          Order is fixed: the site menu always sits directly under the top row,
          because it belongs to the bar itself; the page's section chrome is
          what moves down to make room for it. Everything below grows downward
          from there. (History:
          they were two absolute sheets, and opening the nav links had to hide
          the section bar because only one of them could own top:0. Keep them
          merged — the section row is the page's own chrome and shouldn't
          vanish because someone opened the site menu.)
          A sibling of <nav> in the sticky wrapper, so it rides the overscroll
          bounce and its frost still reaches the page. */}
      {(hasSectionBar || menuOpen) && (
        // Below xl when it carries a section bar — the complement of the sticky
        // column — and below sm otherwise, where only the navcard lives.
        <div className={hasSectionBar ? "xl:hidden" : "sm:hidden"}>
          {/* Tap-outside backdrop, only while something is expanded: the section
              row itself is permanent chrome, not a modal. */}
          {(menuOpen || sectionsOpen) && (
            <button
              type="button"
              aria-hidden
              tabIndex={-1}
              onClick={() => {
                setMenuOpen(false);
                setSectionsOpen(false);
              }}
              // Deliberately NOT touch-pinch-zoom, unlike the bar and the
              // sheet above it: this layer is invisible, so wherever it's the
              // topmost thing the page is what you can see and the page is what
              // a drag should move. Tap still closes (a tap isn't a pan), and
              // the sheet sits above it, so the only region this governs is the
              // one where nothing is covering the page.
              className="fixed inset-0 z-0 cursor-default bg-transparent"
            />
          )}
          <div className="absolute inset-x-0 top-0 z-10 touch-pinch-zoom rounded-b-[var(--radius)] bg-gradient-to-b from-paper/40 to-paper/15 px-[var(--gutter)] pt-[var(--nav-h)] text-base shadow-[var(--lift),var(--edge-polish)] frost">
            {menuOpen && (
              // sm:hidden as well as the wrapper: the + that opens this is gone
              // above sm, so if the viewport widens while the card is open its
              // list shouldn't linger.
              <div className="sm:hidden">
                {/* Inset divider under whatever it follows, à la the /contact card. */}
                <hr className="border-t border-ink/10" />
                {/* Full-width rows, same as the section list: the whole line is
                    the target, and the sheet's px-[--gutter] keeps the page's
                    margins out of it. The 20px between rows is py-2.5 on the
                    rows so they tile — same spacing the gap-5 here used to
                    render. */}
                <div className="flex flex-col py-[calc(var(--gutter)-0.625rem)] leading-none">
                  {actions(() => setMenuOpen(false), true)}
                </div>
              </div>
            )}
            {hasSectionBar && (
              <>
                <hr className="border-t border-ink/10" />
                {/* The row is --nav-h tall: it matches the bar above it, it's the
                    height the pages reserve, and it's a proper 48px tap target. */}
                <button
                  type="button"
                  aria-expanded={sectionsOpen}
                  aria-label={sectionsOpen ? ui.closeSections : ui.sections}
                  onClick={() => setSectionsOpen((open) => !open)}
                  className="flex h-[var(--nav-h)] w-full cursor-pointer items-center justify-between gap-[var(--gutter)] bg-transparent p-0 text-left text-ink"
                >
                  <span className="min-w-0 truncate">{activeLabel}</span>
                  {/* A single chevron, not the navbar's +: this row expands a list
                      in place rather than opening a menu, and it points at where
                      that list will appear. Flipped, not swapped, when open. */}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className={`flex-none ${sectionsOpen ? "rotate-180" : ""}`}
                  >
                    <polyline points="4,6 8,10 12,6" />
                  </svg>
                </button>
                {sectionsOpen && (
                  <>
                    <hr className="border-t border-ink/10" />
                    {/* Half ink, current at full — the desktop index's convention,
                        since these are its entries; at the navbar's 16px, so the
                        rows stay thumb-sized. */}
                    {/* No gap and no items-start: each row is a block filling the
                        sheet's content width, so a whole line is tappable rather
                        than just its text. The sheet's own px-[--gutter] is what
                        keeps the page's margins out of the target. The 20px between
                        rows is py-2.5 on the rows themselves, so they tile — same
                        rendered spacing as the gap-5 this replaces. */}
                    <ol className="flex flex-col py-[calc(var(--gutter)-0.625rem)] leading-none">
                      {sections.map((section, i) => (
                        <li key={section.id}>
                          <a
                            href={`#${section.id}`}
                            onClick={() => {
                              window.dispatchEvent(
                                new CustomEvent("raban-section-pin", {
                                  detail: { id: section.id },
                                }),
                              );
                              setSectionsOpen(false);
                            }}
                            aria-current={activeSection === section.id ? "true" : undefined}
                            className={`block cursor-pointer py-2.5 no-underline ${
                              activeSection === section.id ? "text-ink" : "text-ink/50"
                            }`}
                          >
                            {i + 1}. {section.title}
                          </a>
                        </li>
                      ))}
                    </ol>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
