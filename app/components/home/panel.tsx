import { TAG } from "../type";

import { Brackets } from "./brackets";

// typesafe's product panel: a patch of dotted paper (--grid-dots) with a mono
// tag in its corner and bracket marks at its corners, the window floating on it.
export function Panel({ tag, children }: { tag: string; children: React.ReactNode }) {
  return (
    <div className="relative">
      <Brackets />
      <div className="relative bg-[image:var(--grid-dots)] bg-[size:6px_6px] px-[5%] pb-[6%] pt-[8%]">
        <span className={`${TAG} absolute left-2 top-2`}>{tag}</span>
        {children}
      </div>
    </div>
  );
}
