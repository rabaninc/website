"use client";

import { AppWindow, CardHeader, Composer, DoneButton, Message } from "../app-window";

import type { WindowCopy } from "./content";
import { Icon, RabanFace } from "./icons";
import { Playback, Show, Typed, typedUntil, useAfter, useClock } from "./playback";

// The four scenes of "So arbeitet Raban", in the order Johannes set on
// 2026-09-30: knowledge going in (a recording), coming out (a plan), the gap
// (Raban asks the person who knows), and Raban doing a step itself. Each
// plays once on its own clock (./playback.tsx); the times are milliseconds
// from the moment the window comes into view. Sizes are the app's own
// (app/components/home/app-window.tsx draws the app at its real size).

type Scene = { c: WindowCopy; label: string };

/** A card inside a conversation, as wide as the app lets its cards get. */
const CARD = "max-w-xl rounded-xl border border-app-line";

/* ── 01 Record: Johannes explains by voice, Raban draws the thread ──────── */

// When each phase is heard, when each of its steps is heard, and when Raban
// has summed it up (grey → ink). Phase 4 is still being told: it stays grey.
const RECORD = [
  { heard: 400, steps: [500, 900, 1300], done: 1800 },
  { heard: 2000, steps: [2100, 2500], done: 3000 },
  { heard: 3200, steps: [3300, 3700], done: 4200 },
  { heard: 6800, steps: [6900, 7300, 7700] },
];
const ASKED = 4600; // Raban asks back
const ANSWERED = 5600; // Johannes answers
const ADDED = 6200; // the answer lands as a new step in phase 3…
const ADDED_DONE = 6600; // …and is summed up
const RECORD_END = 8400;

export function RecordScene({ c, label }: Scene) {
  const r = c.record;
  let no = 0;
  return (
    <Playback length={RECORD_END}>
      <AppWindow label={label} menu={c.menu} open={0} running>
        <CardHeader icon="sparkles" title={r.title} />
        <div className="flex min-h-0 flex-1 flex-col px-5 pb-5 pt-2">
          <Show at={150}>
            <p className="text-xs font-medium text-app-grey">{r.hearing}</p>
            <p className="mt-1 text-lg font-medium tracking-tight">{r.topic}</p>
          </Show>
          <div className="mt-6 grid grid-cols-4">
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
          <Show at={600} className="mt-6 text-xs text-app-grey">
            {r.legend}
          </Show>
          <div className="mt-auto flex items-end gap-5">
            <RabanFace className="size-16" />
            <div className="min-w-0 max-w-md flex-1 space-y-3 pb-1">
              <Show at={ASKED}>
                <p className="text-xs font-medium text-app-grey">{r.asks}</p>
                <p className="mt-0.5">{r.question}</p>
              </Show>
              <Show at={ANSWERED}>
                <p className="text-xs font-medium text-app-grey">{c.me}</p>
                <p className="mt-0.5">{r.answer}</p>
              </Show>
            </div>
            <div className="ml-auto flex shrink-0 items-center gap-2">
              <span className="flex h-9 items-center gap-2 rounded-lg border border-app-line px-3 text-sm font-medium">
                <Icon name="mic" className="size-4" />
                {r.mute}
              </span>
              <span className="flex h-9 items-center gap-2 rounded-lg border border-app-line px-3 text-sm font-medium">
                <Icon name="pause" className="size-4" />
                {r.pause}
              </span>
              <span className="flex h-9 items-center gap-2 rounded-lg bg-app-ink px-3 text-sm font-medium text-app-card">
                <span className="size-3.5 rounded-[3px] bg-app-card" />
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
      <div className="flex items-center pt-1">
        <span
          className={`size-2.5 shrink-0 rounded-full ${
            summed ? "bg-app-ink" : "border border-dashed border-app-grey bg-app-card"
          }`}
        />
        {!last && <span className="h-px flex-1 bg-app-line" />}
      </div>
      <div className="pr-8 pt-3">
        <p className="text-2xs font-medium uppercase tracking-wide text-app-grey">
          {word} {n}
        </p>
        <p className={`text-sm font-medium transition-colors duration-500 ${summed ? "" : "text-app-grey"}`}>{title}</p>
        <ol className="mt-2 flex flex-col gap-1.5">
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
    <Show as="li" at={heard} className="flex gap-2">
      <span className="w-4 shrink-0 tabular-nums text-app-grey">{no}</span>
      <span className={`min-w-0 leading-snug transition-colors duration-500 ${summed ? "" : "text-app-grey"}`}>
        {text}
      </span>
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
  const basis = step(p.steps.length) + 150;
  const source = (i: number) => basis + 200 + i * 200;
  return (
    <Playback length={source(p.sources.length) + 700}>
      <AppWindow label={label} menu={c.menu} open={1}>
        <CardHeader icon="search" title={p.title} right={<DoneButton text={c.done} />} />
        <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden px-2 pt-1">
          <Message who={c.me} initial={c.meInitial} time="09:14" mine at={sent}>
            {p.question}
          </Message>
          <Message who="Raban" initial="R" time="09:14" at={raban}>
            <Show at={lead}>{p.lead}</Show>
            <Show at={card} className={`${CARD} mt-2.5 px-4 pb-3 pt-3.5`}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-xs font-medium">{p.head}</span>
                <span className="text-xs text-app-grey">{p.from}</span>
              </div>
              <ol className="mt-2">
                {p.steps.map((s, i) => (
                  <Show
                    key={s.text}
                    as="li"
                    at={step(i)}
                    className="flex items-center gap-3 border-t border-app-line py-2 first:border-t-0"
                  >
                    <span className="w-3 shrink-0 text-xs tabular-nums text-app-grey">{i + 1}</span>
                    <span className="min-w-0 flex-1">{s.text}</span>
                    <span className="shrink-0 rounded-md bg-app-fill px-1.5 py-0.5 text-xs text-app-grey">{s.source}</span>
                  </Show>
                ))}
              </ol>
              <Show at={basis} className="mt-1 border-t border-app-line pt-3.5">
                <p className="mb-2 text-xs font-medium">{p.basis}</p>
                <ul className="flex flex-col gap-2.5">
                  {p.sources.map((s, i) => (
                    <Show key={s.title} as="li" at={source(i)} className="border-l border-app-line pl-3">
                      <p className="font-medium underline decoration-app-line underline-offset-4">{s.title}</p>
                      <p className="text-xs text-app-grey">{s.detail}</p>
                    </Show>
                  ))}
                </ul>
              </Show>
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
  const typed = 400;
  const sent = typedUntil(typed, a.question, 28) + 300;
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
        <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden px-2 pt-1">
          {/* The exchange before: already there when the window comes in. */}
          <Message who={c.me} initial={c.meInitial} time="09:26" mine at={0}>
            {a.before}
          </Message>
          <Message who="Raban" initial="R" time="09:26" at={0}>
            {a.beforeAnswer}
            <span className="mt-1.5 flex w-fit items-center gap-1.5 rounded-md bg-app-fill px-1.5 py-0.5 text-xs text-app-grey">
              <Icon name="file" className="size-3.5" />
              {a.beforeSource}
            </span>
          </Message>
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
      className={`mt-2.5 max-w-xl rounded-xl border px-4 pb-3.5 pt-3.5 transition-colors duration-500 ${
        sent ? "border-app-line" : "border-app-ink"
      }`}
    >
      <p className="flex items-center gap-1.5 text-xs">
        <span className={`size-1.5 rounded-full ${sent ? "bg-app-grey" : "bg-app-ink"}`} />
        <span className="font-medium">{a.status}</span>
        <span className="text-app-grey">· {sent ? a.sent : a.waiting}</span>
      </p>
      <p className="mt-2.5 border-l-2 border-app-line pl-3">{a.request}</p>
      <Show at={person} className="mt-3.5 flex items-center gap-3 rounded-lg border border-app-line px-3 py-2.5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-app-ink text-xs font-medium text-app-card">
          {a.initials}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-medium leading-tight">{a.person}</span>
          <span className="block text-xs text-app-grey">{sent ? a.asked : a.suggested}</span>
        </span>
        {!sent && (
          <span className="flex items-center gap-1 text-sm text-app-grey">
            {a.change}
            <Icon name="chevronDown" className="size-4" />
          </span>
        )}
      </Show>
      {sent ? (
        <p className="mt-3.5 flex min-h-9 items-center gap-2 text-xs text-app-grey">
          <Icon name="check" className="size-4 text-app-ink" />
          <span className="min-w-0">{a.sentNote}</span>
        </p>
      ) : (
        <Show at={buttons} className="mt-3.5 flex gap-2">
          <span
            className={`flex h-9 flex-[1.7] items-center justify-center rounded-lg text-sm font-medium text-app-card transition-[scale,background-color] duration-150 ${
              pressed ? "scale-[0.97] bg-app-ink/80" : "bg-app-ink"
            }`}
          >
            {a.send}
          </span>
          <span className="flex h-9 flex-1 items-center justify-center rounded-lg border border-app-line text-sm font-medium">
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
    at += f.open ? 500 : f.value.length * FIELD_PACE + 400;
  }
  const submit = at + 200;
  const waiting = submit + 300;
  return (
    <Playback length={waiting + 700}>
      <AppWindow label={label} menu={c.menu} nav="tasks">
        <CardHeader
          icon="tasks"
          title={k.title}
          right={<span className="rounded-full bg-app-fill px-2.5 py-1 text-xs text-app-grey">{k.state}</span>}
        />
        <div className="grid min-h-0 flex-1 grid-cols-[380px_1fr] border-t border-app-line">
          <div className="border-r border-app-line px-4 py-5">
            <p className="px-1 text-lg font-medium leading-snug tracking-tight">{k.name}</p>
            <p className="mt-1 px-1 text-xs text-app-grey">{k.meta}</p>
            <ol className="mt-5 flex flex-col gap-1">
              {k.steps.map((text, i) => (
                <TaskStep key={text} n={i + 1} text={text} k={k} waiting={waiting} />
              ))}
            </ol>
          </div>
          <div className="min-w-0 px-6 py-5">
            <p className="flex items-center gap-1.5 text-xs font-medium text-app-grey">
              <RabanFace className="size-4 text-app-ink" />
              {k.raban}
            </p>
            <p className="mt-1 text-lg font-medium tracking-tight">{k.form}</p>
            <dl className="mt-4">
              {k.fields.map((f, i) => (
                <Field key={f.label} f={f} at={starts[i]} sourceWord={k.source} />
              ))}
            </dl>
            <Show at={submit} className="mt-4 flex items-center justify-between gap-4 border-t border-app-line pt-4">
              <span className="text-xs text-app-grey">{k.count}</span>
              <span className="flex h-9 items-center whitespace-nowrap rounded-lg bg-app-ink px-4 text-sm font-medium text-app-card">
                {k.submit}
              </span>
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
    <li className={`flex gap-3 rounded-lg px-2.5 py-2 ${state === "raban" ? "bg-app-fill" : ""}`}>
      <span className="mt-0.5">
        <StepMark state={state} working={state === "raban" && t < waiting} />
      </span>
      <span className="min-w-0">
        <span className={`block ${state === "open" ? "text-app-grey" : ""}`}>{text}</span>
        {state === "raban" && (
          <span className="block text-xs text-app-grey">{t < waiting ? k.working : k.waiting}</span>
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
    <div className="grid grid-cols-[150px_1fr] gap-4 border-t border-app-line py-2.5">
      <dt className="text-app-grey">{f.label}</dt>
      <dd className="min-w-0">
        <span className={`block ${f.open ? "text-app-signal" : ""}`}>
          {f.open ? (
            <Show as="span" at={at}>
              {f.value}
            </Show>
          ) : (
            <>
              <Typed at={at} text={f.value} pace={FIELD_PACE} />
              {/* The rest of the text holds the line's width from the start, so rows never jump. */}
              {t < typedEnd && (
                <span className="invisible">{f.value.slice(Math.max(0, Math.floor((t - at) / FIELD_PACE)))}</span>
              )}
            </>
          )}
        </span>
        {f.source && (
          <Show at={typedEnd + 100} className="text-xs text-app-grey">
            {sourceWord}: {f.source}
          </Show>
        )}
      </dd>
    </div>
  );
}
