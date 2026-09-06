import { getLocale } from "@/utils/locale-server";

const T = { de: "Seite nicht gefunden.", en: "Page not found." } as const;

export default async function NotFound() {
  const locale = await getLocale();
  return (
    <main className="px-[var(--inset)] pb-[var(--inset)] pt-[var(--content-top)]">
      <p className="text-base">{T[locale]}</p>
    </main>
  );
}
