import Image, { type StaticImageData } from "next/image";

import { TrafficLights } from "../pitch/window-card";
import { LABEL } from "../type";

// A light macOS window holding one screenshot of the real app, the way
// x.ai/build frames its product: title bar with the three lights, the app's
// address centred, the picture edge to edge below. The screenshots live in
// public/app/, shot from the real frontend against the mock with invented
// data (werkzeuge/app-bilder/); they are static imports, so the build knows
// each one's size and fails loudly if one goes missing.
export function AppWindow({ src, alt }: { src: StaticImageData; alt: string }) {
  return (
    <figure className="overflow-hidden rounded-[12px] bg-window-bar shadow-[var(--window-cast)]">
      <div className="relative flex h-8 items-center border-b border-window-line px-3 md:h-9">
        <span className="origin-left scale-[0.72]">
          <TrafficLights />
        </span>
        <span className={`${LABEL} absolute inset-x-0 text-center text-ink/60`}>app.raban.ai</span>
      </div>
      <Image src={src} alt={alt} sizes="(min-width: 1024px) 60vw, 100vw" className="block h-auto w-full" />
    </figure>
  );
}
