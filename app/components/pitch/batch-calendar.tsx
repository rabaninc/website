"use client";

import { Panel } from "../home/panel";
import { Playback, Show, useAfter } from "../home/window/playback";
import { LABEL, TAG } from "../type";

// Under the deck on /about: the four weeks of AI Start, Batch 6 (Monday
// 10 August to Thursday 3 September 2026) as a wall calendar on a panel of
// dotted paper, drawn in the site's ink hairlines (Johannes, 2026-10-06: the
// win goes after the deck, with a graphic in the style of the site and
// typesafe). The first time it comes into view the days are crossed off one
// by one, and the finals, 2 September, land as a solid ink block, like a
// stamp; it plays once, as the app windows on the home page do (Playback),
// and the server, reduced motion and a calendar already on screen show it
// finished.

const FIRST = Date.UTC(2026, 7, 10); // Monday, 10 August 2026
const DAYS = Array.from(
  { length: 25 },
  (_, i) => new Date(FIRST + i * 86_400_000),
);
const FINALS = 23; // Wednesday, 2 September

// One day crossed off every STEP ms from START; a beat after the last one
// before the finals, the finals' block lands, and the last day after it.
const START = 250;
const STEP = 60;
const at = (i: number) =>
  i < FINALS
    ? START + i * STEP
    : START + (FINALS - 1) * STEP + (i - FINALS + 1) * 380;
const LENGTH = at(DAYS.length - 1) + 400;

type Words = {
  tag: string;
  weekdays: readonly string[];
  months: readonly string[];
  finals: string;
  alt: string;
};

export function BatchCalendar({ tag, weekdays, months, finals, alt }: Words) {
  return (
    <div role="img" aria-label={alt}>
      <div aria-hidden>
        <Playback length={LENGTH}>
          <Panel tag={tag}>
            <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
              {weekdays.map((w) => (
                <p key={w} className={`${LABEL} pb-1`}>
                  {w}
                </p>
              ))}
              {DAYS.map((d, i) => {
                const day = d.getUTCDate();
                // The month by the first day shown of each.
                const month =
                  i === 0 || day === 1
                    ? months[d.getUTCMonth() - 7]
                    : undefined;
                return i === FINALS ? (
                  <Finals key={i} day={day} at={at(i)} />
                ) : (
                  <Day key={i} day={day} month={month} at={at(i)} />
                );
              })}
              {/* The finals' tag, hanging from a hairline under its day. */}
              <div className="relative col-start-3 h-12">
                <Show at={at(FINALS)} className="absolute inset-0">
                  <span className="absolute left-1/2 top-0 h-4 w-px bg-ink" />
                  <span
                    className={`${TAG} absolute left-1/2 top-4 whitespace-nowrap`}
                  >
                    {finals}
                  </span>
                </Show>
              </div>
            </div>
          </Panel>
        </Playback>
      </div>
    </div>
  );
}

/** A day of the batch: a hairline square with its date, crossed off at `at`. */
function Day({ day, month, at }: { day: number; month?: string; at: number }) {
  const done = useAfter(at);
  return (
    <div className="relative aspect-square border border-ink bg-paper">
      <span className={`${LABEL} absolute left-1 top-1 sm:left-1.5 sm:top-1.5`}>
        {day}
        {month && <span className="max-sm:hidden"> {month}</span>}
      </span>
      <span
        className="absolute bottom-[12%] left-[24%] h-px w-[90.5%] origin-left bg-ink transition-transform duration-200 ease-out"
        style={{ transform: `rotate(-45deg) scaleX(${done ? 1 : 0})` }}
      />
    </div>
  );
}

/** The finals: the same square, filled in ink at `at`, landing like a stamp. */
function Finals({ day, at }: { day: number; at: number }) {
  const on = useAfter(at);
  return (
    <div className="relative aspect-square border border-ink bg-paper">
      <span
        className={`absolute -inset-px bg-ink transition-[opacity,scale] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
          on ? "scale-100 opacity-100" : "scale-125 opacity-0"
        }`}
      />
      <span
        className={`${LABEL} absolute left-1 top-1 transition-colors duration-300 sm:left-1.5 sm:top-1.5 ${on ? "text-paper" : ""}`}
      >
        {day}
      </span>
    </div>
  );
}
