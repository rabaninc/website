import { TAG } from "../type";

import { Brackets } from "./brackets";

// typesafe's product panel: a patch of graph paper with a mono tag in its
// corner and bracket marks at its corners, the window floating on it.
export function Panel({ tag, children }: { tag: string; children: React.ReactNode }) {
  return (
    <div className="relative">
      <Brackets />
      <div className="relative bg-[image:linear-gradient(var(--grid-line)_1px,transparent_1px),linear-gradient(90deg,var(--grid-line)_1px,transparent_1px)] bg-[size:12px_12px] px-[6%] pb-[7%] pt-[9%]">
        <span className={`${TAG} absolute left-2 top-2`}>{tag}</span>
        {children}
      </div>
    </div>
  );
}
