import { getLocale } from "@/utils/locale-server";

import { Footer } from "../components/footer";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  // The language choice (a cookie, German default) is read once here for the
  // footer's switch; pages read it themselves for their copy.
  const locale = await getLocale();
  return (
    // The page is a card hanging from the top of the viewport: paper, square
    // where it meets the navbar, rounded where it ends. The radius sits on the
    // content block — the thing directly above the footer — never on the footer
    // itself, which is square. The slab is the surface the card hangs over, so
    // it's painted on the wrapper: that's what shows through the two corner
    // notches the curve cuts out of the paper, and the footer below is the same
    // slab continuing rather than a second block.
    <div className="relative flex min-h-[100vh] flex-col bg-slab">
      {/* The card's edge is its cast: --page-cast, the shadow a macOS window
          throws onto whatever is behind it, following the curve. No line on the
          edge itself. (History: a 0.5px --edge-line hairline sat on the card's
          sides and bottom for a while, the window's own half-point frame line;
          it was removed because at every alpha tried — 10% to 90% — it read as
          either nothing or too dark next to the red, and in Safari the card's
          fractional bottom edge smeared it over two device rows anyway. Don't
          bring it back; the cast is the edge.) relative z-10 so the
          cast paints over the footer that follows in the DOM. (History: an
          earlier cast, thrown from a static boundary element after <Footer />
          onto a black/white slab, read as a stain and was removed with an inset
          lip that read as a drawn band; the mid-toned slab is what makes a cast read
          as depth. The boundary element existed because a cast on the card
          itself once let the globe's composited layer flash a square through
          the corner notches — if that returns, that is where to look.)
          overflow-clip makes the card clip its descendants to that curve, which
          a border-radius alone does NOT do: the globe animates on a transform,
          so while it runs it sits on its own composited layer, and a composited
          layer is free to paint outside an ancestor's radius. Clip, not hidden —
          hidden would make the card a scroll container and re-anchor the sticky
          section index to it (same note as on html/body in globals.css). It
          costs nothing: the globe exactly fills its section at every breakpoint
          and is smaller than it while animating. */}
      <div className="relative z-10 grow overflow-clip rounded-b-[var(--radius)] bg-paper shadow-[var(--page-cast)]">
        {children}
      </div>
      <Footer locale={locale} />
    </div>
  );
}
