import { getLocale } from "@/utils/locale-server";

import { PageOrMarkdown, ViewProvider } from "../components/agent-view";
import { Footer } from "../components/footer";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  // The language choice (a cookie, German default) is read once here for the
  // footer's card; pages read it themselves for their copy.
  const locale = await getLocale();
  return (
    // Every page stands on the sage (--paper) and ends in the footer card, which
    // sits inset on it like Personio's (rebuild 2026-09-28). overflow-clip on the
    // content, not hidden: the globe animates on a transform and must not paint
    // past the page, and hidden would make this a scroll container and re-anchor
    // the sticky section index to it (same note as on html/body in globals.css).
    // (History: until then the page was a white card hanging from the top with a
    // window's cast onto a grey footer slab behind it.)
    // The footer's view switch can swap the page for its Markdown (the agent
    // view, app/components/agent-view.tsx); the provider holds that choice
    // across pages, since this layout stays mounted while you navigate.
    <ViewProvider>
      <div className="flex min-h-[100vh] flex-col bg-paper">
        <div className="relative grow overflow-clip">
          <PageOrMarkdown locale={locale}>{children}</PageOrMarkdown>
        </div>
        <Footer locale={locale} />
      </div>
    </ViewProvider>
  );
}
