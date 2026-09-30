"use client";

import { AppWindow, CardHeader, Composer, DoneButton, Message } from "../app-window";

import type { WindowCopy } from "./content";
import { Icon, RabanFace } from "./icons";
import { Playback, Show, Typed, typedUntil, useAfter, useClock } from "./playback";

// The four scenes of "So arbeitet Raban", in the order Johannes set on
// 2026-09-30: knowledge going in (a recording), coming out (a plan), the gap
// (Raban asks the person who knows), and Raban doing a step itself. Each
// plays once on its own clock (./playback.tsx); the times are milliseconds
// from the moment the window comes into view.

type Scene = { c: WindowCopy; label: string };

/* ── 01 Record: Johannes explains by voice, Raban draws the thread ──────── */

// When each phase is heard, when its steps are heard, and when Raban has
// summed it up (grey → ink). Phase 4 is still being told: it stays grey.
const RECORD = [
  { heard: 400, steps: [500, 900], done: 1400 },
  { heard: 1600, steps: [1700, 2100], done: 2600 },
  { heard: 2800, steps: [2900, 3300], done: 3800 },
  { heard: 6400, steps: [6500, 6900] },
];
const ASKED = 4200; // Raban asks back
const ANSWERED = 5200; // Johannes answers
const ADDED = 5900; // the answer lands as step 7 in phase 3…
const ADDED_DONE = 6300; // …and is summed up
const RECORD_END = 7600;

export function RecordScene({ c, label }: Scene) {
  const r = c.record;
  let no = 0;
  return (
    <Playback length={RECORD_END}>
      <AppWindow label={label} menu={c.menu} open={0} running>
        <CardHeader icon="sparkles" title={r.title} />
        <div className="flex min-h-0 flex-1 flex-col px-5 pb-4 pt-1">
          <Show at={150}>
            <p className="text-xs font-medium text-app-grey">{r.hearing}</p>
            <p className="mt-1 text-lg font-medium tracking-tight">{r.topic}</p>
          </Show>
          <div className="mt-5 grid grid-cols-4">
            {r.phases.map((phase, i) => {
              const times = RECORD[i];
              const steps = phase.steps.map((text, j) => ({ text, heard: times.steps[j], done: times.done }));
              if (i === 2) steps.push({ text: r.added, heard: ADDED, done: ADDED_DONE });
              const numbered = steps.map((s) => ({ ...s, no: ++no }));
              return (
                <Phase
                  key={phase.title}
                  n={i + 1}
                  word={r.phase}
                  title={phase.title}
                  heard={times.heard}
                  done={times.done}
                  steps={numbered}
                  last={i === r.phases.length - 1}
                />
              );
            })}
          </div>
          <Show at={600} className="mt-5 text-xs text-app-grey">
            {r.legend}
          </Show>
          <div className="mt-auto flex items-end gap-3">
            <RabanFace className="size-12" />
            <div className="min-w-0 flex-1 space-y-2.5 pb-0.5">
              <Show at={ASKED}>
                <p className="text-2xs font-medium text-app-grey">{r.asks}</p>
                <p className="text-balance">{r.question}</p>
              </Show>
              <Show at={ANSWERED}>
                <p className="text-2xs font-medium text-app-grey">{c.me}</p>
                <p className="text-balance">{r.answer}</p>
              </Show>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <span className="flex size-8 items-center justify-center rounded-lg border border-app-line">
                <Icon name="mic" className="size-4" />
              </span>
              <span className="flex size-8 items-center justify-center rounded-lg border border-app-line">
                <Icon name="pause" className="size-4" />
              </span>
              <span className="flex h-8 items-center gap-1.5 rounded-lg bg-app-ink px-3 text-xs font-medium text-app-card">
                <span className="size-2.5 rounded-xs bg-app-card" />
                {r.end}
              </span>
            </div>
          </div>
        </div>
      </AppWindow>
    </Playback>
  );
}

function Phase({
  n,
  word,
  title,
  heard,
  done,
  steps,
  last,
}: {
  n: number;
  word: string;
  title: string;
  heard: number;
  done?: number;
  steps: { text: string; heard: number; done?: number; no: number }[];
  last: boolean;
}) {
  const summed = useAfter(done ?? Number.POSITIVE_INFINITY) && done !== undefined;
  return (
    <Show at={heard} className="min-w-0">
      <div className="flex items-center">
        <span
          className={`size-2.5 shrink-0 rounded-full ${
            summed ? "bg-app-ink" : "border border-dashed border-app-grey bg-app-card"
          }`}
        />
        {!last && <span className="h-px flex-1 bg-app-line" />}
      </div>
      <div className="pr-4 pt-2.5">
        <p className="text-2xs font-medium uppercase tracking-wide text-app-grey">
          {word} {n}
        </p>
        <p className={`font-medium transition-colors duration-500 ${summed ? "" : "text-app-grey"}`}>{title}</p>
        <ol className="mt-1.5 flex flex-col gap-1.5">
          {steps.map((s) => (
            <StepLine key={s.no} {...s} />
          ))}
        </ol>
      </div>
    </Show>
  );
}

function StepLine({ text, heard, done, no }: { text: string; heard: number; done?: number; no: number }) {
  const summed = useAfter(done ?? Number.POSITIVE_INFINITY) && done !== undefined;
  return (
    <Show as="li" at={heard} className="flex gap-1.5 text-xs">
      <span className="w-3.5 shrink-0 tabular-nums text-app-grey">{no}</span>
      <span className={`min-w-0 transition-colors duration-500 ${summed ? "" : "text-app-grey"}`}>{text}</span>
    </Show>
  );
}

/* ── 02 Plan: someone asks how, Raban answers with the steps ────────────── */

export function PlanScene({ c, label }: Scene) {
  const p = c.plan;
  const typed = 300;
  const sent = typedUntil(typed, p.question, 22) + 300;
  const raban = sent + 500;
  const lead = raban + 350;
  const card = lead + 350;
  const step = (i: number) => card + 200 + i * 260;
  return (
    <Playback length={step(p.steps.length) + 700}>
      <AppWindow label={label} menu={c.menu} open={1}>
        <CardHeader icon="search" title={p.title} right={<DoneButton text={c.done} />} />
        <div className="flex min-h-0 flex-1 flex-col gap-3.5 overflow-hidden px-4">
          <Message who={c.me} initial={c.meInitial} time="09:14" mine at={sent}>
            {p.question}
          </Message>
          <Message who="Raban" initial="R" time="09:14" at={raban}>
            <Show at={lead}>{p.lead}</Show>
            <Show at={card} className="mt-2.5 rounded-xl border border-app-line px-3.5 pb-2.5 pt-3">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-xs font-medium">{p.head}</span>
                <span className="text-2xs text-app-grey">{p.from}</span>
              </div>
              <ol className="mt-1.5">
                {p.steps.map((s, i) => (
                  <Show
                    key={s.text}
                    as="li"
                    at={step(i)}
                    className="flex items-center gap-2.5 border-t border-app-line py-[calc(var(--u)*5)] first:border-t-0"
                  >
                    <span className="w-3 shrink-0 text-xs tabular-nums text-app-grey">{i + 1}</span>
                    <span className="min-w-0 flex-1">{s.text}</span>
                    <span className="shrink-0 rounded-md bg-app-fill px-1.5 py-0.5 text-2xs text-app-grey">{s.source}</span>
                  </Show>
                ))}
              </ol>
            </Show>
          </Message>
        </div>
        <Composer placeholder={c.placeholder} text={p.question} at={typed} sendAt={sent} />
      </AppWindow>
    </Playback>
  );
}

/* ── 03 Follow up: it isn't written anywhere, Raban asks the person ─────── */

export function AskScene({ c, label }: Scene) {
  const a = c.ask;
  const typed = 300;
  const sent = typedUntil(typed, a.question, 22) + 300;
  const raban = sent + 500;
  const reply = raban + 350;
  const card = reply + 600;
  const person = card + 300;
  const buttons = person + 250;
  const press = buttons + 1400;
  const done = press + 260;
  return (
    <Playback length={done + 700}>
      <AppWindow label={label} menu={c.menu} open={2}>
        <CardHeader icon="search" title={a.title} right={<DoneButton text={c.done} />} />
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden px-4 pt-1">
          <Message who={c.me} initial={c.meInitial} time="09:28" mine at={sent}>
            {a.question}
          </Message>
          <Message who="Raban" initial="R" time="09:28" at={raban}>
            <Show at={reply}>{a.reply}</Show>
            <Show at={card}>
              <Request a={a} person={person} buttons={buttons} press={press} done={done} />
            </Show>
          </Message>
        </div>
        <Composer placeholder={c.placeholder} text={a.question} at={typed} sendAt={sent} />
      </AppWindow>
    </Playback>
  );
}

function Request({
  a,
  person,
  buttons,
  press,
  done,
}: {
  a: WindowCopy["ask"];
  person: number;
  buttons: number;
  press: number;
  done: number;
}) {
  const t = useClock();
  const pressed = t >= press && t < done;
  const sent = t >= done;
  return (
    <div
      className={`mt-2.5 rounded-xl border px-3.5 pb-3 pt-3 transition-colors duration-500 ${
        sent ? "border-app-line" : "border-app-ink"
      }`}
    >
      <p className="flex items-center gap-1.5 text-xs">
        <span className={`size-1.5 rounded-full ${sent ? "bg-app-grey" : "bg-app-ink"}`} />
        <span className="font-medium">{a.status}</span>
        <span className="text-app-grey">· {sent ? a.sent : a.waiting}</span>
      </p>
      <p className="mt-2 border-l-2 border-app-line pl-3">{a.request}</p>
      <Show at={person} className="mt-3 flex items-center gap-2.5 rounded-lg border border-app-line px-3 py-2">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-app-ink text-2xs font-medium text-app-card">
          {a.initials}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-medium leading-tight">{a.person}</span>
          <span className="block text-xs text-app-grey">{sent ? a.asked : a.suggested}</span>
        </span>
        {!sent && (
          <span className="flex items-center gap-1 text-xs text-app-grey">
            {a.change}
            <Icon name="chevronDown" className="size-3.5" />
          </span>
        )}
      </Show>
      {sent ? (
        <p className="mt-3 flex min-h-8 items-center gap-2 text-xs text-app-grey">
          <Icon name="check" className="size-4 text-app-ink" />
          <span className="min-w-0">{a.sentNote}</span>
        </p>
      ) : (
        <Show at={buttons} className="mt-3 flex gap-2">
          <span
            className={`flex h-8 flex-[1.7] items-center justify-center rounded-lg text-xs font-medium text-app-card transition-[scale,background-color] duration-150 ${
              pressed ? "scale-[0.97] bg-app-ink/80" : "bg-app-ink"
            }`}
          >
            {a.send}
          </span>
          <span className="flex h-8 flex-1 items-center justify-center rounded-lg border border-app-line text-xs font-medium">
            {a.discard}
          </span>
        </Show>
      )}
    </div>
  );
}

/* ── 04 Get it done: the recorded task on the left, Raban at step 4 ─────── */

const FIELD_PACE = 14;

export function TaskScene({ c, label }: Scene) {
  const k = c.task;
  // Each field types in, then its source shows, then a short pause.
  const starts: number[] = [];
  let at = 500;
  for (const f of k.fields) {
    starts.push(at);
    at += f.open ? 500 : f.value.length * FIELD_PACE + 450;
  }
  const submit = at + 200;
  const waiting = submit + 300;
  return (
    <Playback length={waiting + 700}>
      <AppWindow label={label} menu={c.menu} nav="tasks">
        <CardHeader
          icon="tasks"
          title={k.title}
          right={<span className="rounded-full bg-app-fill px-2 py-0.5 text-xs text-app-grey">{k.state}</span>}
        />
        <div className="grid min-h-0 flex-1 grid-cols-[236fr_332fr] border-t border-app-line">
          <div className="border-r border-app-line px-3 py-3.5">
            <p className="px-1 text-base font-medium leading-snug">{k.name}</p>
            <p className="mt-1 px-1 text-2xs text-app-grey">{k.meta}</p>
            <ol className="mt-4 flex flex-col gap-1">
              {k.steps.map((text, i) => (
                <TaskStep key={text} n={i + 1} text={text} k={k} waiting={waiting} />
              ))}
            </ol>
          </div>
          <div className="min-w-0 px-4 py-3.5">
            <p className="flex items-center gap-1.5 text-2xs font-medium text-app-grey">
              <RabanFace className="size-3.5 text-app-ink" />
              {k.raban}
            </p>
            <p className="mt-1 text-base font-medium">{k.form}</p>
            <dl className="mt-2.5">
              {k.fields.map((f, i) => (
                <Field key={f.label} f={f} at={starts[i]} sourceWord={k.source} />
              ))}
            </dl>
            <Show at={submit} className="mt-3 flex items-center justify-between gap-3">
              <span className="text-2xs text-app-grey">{k.count}</span>
              <span className="whitespace-nowrap rounded-lg bg-app-ink px-3 py-1.5 text-xs font-medium text-app-card">{k.submit}</span>
            </Show>
          </div>
        </div>
      </AppWindow>
    </Playback>
  );
}

function TaskStep({ n, text, k, waiting }: { n: number; text: string; k: WindowCopy["task"]; waiting: number }) {
  const t = useClock();
  const state = n < 4 ? "done" : n === 4 ? "raban" : "open";
  return (
    <li className={`flex gap-2.5 rounded-lg px-2 py-1.5 ${state === "raban" ? "bg-app-fill" : ""}`}>
      <span className="mt-0.5">
        <StepMark state={state} working={state === "raban" && t < waiting} />
      </span>
      <span className="min-w-0">
        <span className={`block ${state === "open" ? "text-app-grey" : ""}`}>{text}</span>
        {state === "raban" && (
          <span className="block text-2xs text-app-grey">{t < waiting ? k.working : k.waiting}</span>
        )}
      </span>
    </li>
  );
}

/** A step's mark: ticked, half full while Raban has it, an empty ring still to come. */
function StepMark({ state, working }: { state: "done" | "raban" | "open"; working: boolean }) {
  if (state === "done")
    return (
      <span className="flex size-4 items-center justify-center rounded-full bg-app-ink text-app-card">
        <Icon name="check" className="size-2.5 [stroke-width:3]" />
      </span>
    );
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden
      className={`size-4 ${state === "open" ? "text-app-grey/60" : ""} ${working ? "motion-safe:animate-pulse" : ""}`}
    >
      <circle cx="8" cy="8" r="6.75" fill="none" stroke="currentColor" strokeWidth="1.5" />
      {state === "raban" && <path d="M8 3.5 A4.5 4.5 0 0 1 8 12.5 Z" fill="currentColor" />}
    </svg>
  );
}

function Field({
  f,
  at,
  sourceWord,
}: {
  f: WindowCopy["task"]["fields"][number];
  at: number;
  sourceWord: string;
}) {
  const t = useClock();
  const typedEnd = at + f.value.length * FIELD_PACE;
  return (
    <div className="border-t border-app-line py-1.5">
      <dt className="flex justify-between gap-3 text-2xs text-app-grey">
        {f.label}
        {f.source && (
          <Show as="span" at={typedEnd + 100}>
            {sourceWord}: {f.source}
          </Show>
        )}
      </dt>
      <dd className={f.open ? "text-app-signal" : ""}>
        {f.open ? (
          <Show as="span" at={at}>
            {f.value}
          </Show>
        ) : (
          <>
            <Typed at={at} text={f.value} pace={FIELD_PACE} />
            {/* The finished text holds the line's height from the start, so the rows never jump. */}
            {t < typedEnd && <span className="invisible">{f.value.slice(Math.max(0, Math.floor((t - at) / FIELD_PACE)))}</span>}
          </>
        )}
      </dd>
    </div>
  );
}
