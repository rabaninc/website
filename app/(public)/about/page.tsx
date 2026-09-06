import { TeamBlock } from "@/app/components/pitch/team";
import { getLocale } from "@/utils/locale-server";

// The team slide from the pitch deck (Raban Pitch v2, slide 8); the same block
// also closes the home page. The page closes with --inset like every page:
// the card keeps the same distance to the page card's bottom edge as to the
// screen's sides.
const H1 = { de: "Über uns", en: "About us" } as const;

export default async function AboutPage() {
  const locale = await getLocale();
  return (
    <main className="px-[var(--inset)] pb-[var(--inset)] pt-[var(--content-top)]">
      <div className="space-y-[var(--header-gap)] text-base text-ink">
        <h1 className="text-[length:var(--h1)] font-black leading-[var(--h1-line)]">
          {H1[locale]}
        </h1>
        <TeamBlock locale={locale} />
      </div>
    </main>
  );
}
