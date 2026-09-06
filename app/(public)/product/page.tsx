import { FlowSection, LoopSection, PricingSection } from "@/app/components/pitch/sections";
import { getLocale } from "@/utils/locale-server";

// The product half of the pitch deck (Raban Pitch v2, slides 5–7): how it
// works, the verification loop, ownership and pricing, as three window cards
// under the page title. The same sections close the home page.
const H1 = { de: "Produkt", en: "Product" } as const;

export default async function ProductPage() {
  const locale = await getLocale();
  return (
    <main className="px-[var(--gutter)] pb-[var(--content-gap)] pt-[var(--content-top)]">
      <div className="space-y-[var(--content-gap)] text-base text-ink">
        <h1 className="text-[length:var(--h1)] font-black leading-[var(--h1-line)]">
          {H1[locale]}
        </h1>
        <FlowSection locale={locale} index={0} />
        <LoopSection locale={locale} index={1} />
        <PricingSection locale={locale} index={2} />
      </div>
    </main>
  );
}
