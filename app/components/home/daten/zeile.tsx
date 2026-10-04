import Link from "next/link";

import { BODY, LABEL } from "../../type";

// Variant C of "Eure Daten" (preview, 2026-10-04): typesafe's closing line
// ("Come Build With Us ▶▶▶ Open Roles") — the statement, three triangles and
// the call to action on one line, the sentence under it. In the corner, as
// typesafe hides base64 on its page, a real ZIP written out in base64: decoded
// it unpacks to a README that says "Euer Wissen gehört euch."

/** A 180-byte ZIP holding README.txt ("Euer Wissen gehört euch. / Your
 *  knowledge is yours. / raban.ai"), in base64. Made with Python's zipfile. */
const ZIP_B64 =
  "UEsDBBQAAAAIAABgRF3v6Bu9PgAAAD0AAAAKAAAAUkVBRE1FLnR4dHMtTS1SCM8sLk7NU0hPzTi8rahEIbU0OUOPKzK/tEghOy+/PCc1JT1VIbNYoRIoUqzHxVWUmJSYp5eYyQUAUEsBAhQDFAAAAAgAAGBEXe/oG70+AAAAPQAAAAoAAAAAAAAAAAAAAIABAAAAAFJFQURNRS50eHRQSwUGAAAAAAEAAQA4AAAAZgAAAAAA";

const LINE = "text-[clamp(34px,4vw,56px)] font-medium leading-[0.95] tracking-[-0.03em] [&:lang(en)]:capitalize";

function Triangles() {
  return (
    <svg viewBox="0 0 58 22" aria-hidden className="h-[0.42em] w-auto shrink-0">
      {[0, 20, 40].map((x) => (
        <polygon key={x} points={`${x},0 ${x + 18},11 ${x},22`} fill="var(--ink)" />
      ))}
    </svg>
  );
}

export function ClosingLine({ label, display, sub, cta }: { label: string; display: string; sub: string; cta: string }) {
  return (
    <div className="relative">
      <div className="flex items-start justify-between gap-10">
        <p className={LABEL}>{label}</p>
        <figure aria-hidden className="w-[13.5rem] max-sm:hidden">
          <figcaption className={LABEL}>[ZIP.B64]</figcaption>
          <p className={`${LABEL} mt-3 break-all text-[10px] leading-[1.3]`}>{ZIP_B64}</p>
        </figure>
      </div>
      <div className={`${LINE} mt-10 flex flex-wrap items-center gap-x-[0.45em] gap-y-[0.2em] md:mt-6`}>
        <h2 className="text-balance">{display}</h2>
        <Triangles />
        <Link href="/contact" className="underline decoration-[0.04em] underline-offset-[0.12em] hover:text-ink/60">
          {cta}
        </Link>
      </div>
      <p className={`${BODY} mt-8 max-w-[46ch]`}>{sub}</p>
      <figure aria-hidden className="mt-12 sm:hidden">
        <figcaption className={LABEL}>[ZIP.B64]</figcaption>
        <p className={`${LABEL} mt-3 break-all text-[10px] leading-[1.3]`}>{ZIP_B64}</p>
      </figure>
    </div>
  );
}
