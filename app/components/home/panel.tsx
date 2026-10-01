import { TAG } from "../type";

import { Brackets } from "./brackets";

// typesafe's product panel: a patch of dotted paper (--grid-dots) with a mono
// tag in its corner and bracket marks at its corners, the window floating on it.
// The brackets sit on the panel's own edge and the dots stand 8px inside them,
// so a panel's brackets share the vertical line of the section's brackets
// (Johannes, 2026-10-01: they stood 8px outside it).
export function Panel({ tag, children }: { tag: string; children: React.ReactNode }) {
  return (
    <div className="relative">
      <Brackets inset="0px" />
      <div className="relative m-2 bg-[image:var(--grid-dots)] bg-[size:6px_6px] px-[5%] pb-[6%] pt-[8%]">
        <span className={`${TAG} absolute left-2 top-2`}>{tag}</span>
        {children}
      </div>
    </div>
  );
}
