"use client";

import Image, { type StaticImageData } from "next/image";

import druckbogen from "@/public/fenster/druckbogen.jpg";
import schachtel from "@/public/fenster/schachtel.jpg";

import { AppWindow, CardHeader, Composer, DoneButton, Message } from "../app-window";

import type { WindowCopy } from "./content";
import { Icon, RabanFace } from "./icons";
import { Playback, Show, Typed, typedUntil, useAfter, useClock } from "./playback";

// The five scenes of "So arbeitet Raban", in the order Johannes set on
// 2026-09-30: knowledge going in (a recording), coming out (a plan), the gap
// (Raban asks the person who knows), Raban doing a step itself, and what
// that task draws on. Each
// plays once on its own clock (./playback.tsx); the times are milliseconds
// from the moment the window comes into view. Sizes are the app's own
// (app/components/home/app-window.tsx draws the app at its real size).

type Scene = { c: WindowCopy; label: string };

/** A card inside a conversation, as wide as the app lets its cards get. */
const CARD = "max-w-xl rounded-xl border border-app-line";

/* ── 01 Record: Johannes explains by voice, Raban draws the thread ──────── */

/** Milliseconds between two steps Raban hears. */
const STEP = 150;

/** When each phase is heard, when each of its steps is heard, and when Raban
 *  has summed it up (grey → ink) — counted from the steps themselves, so the
 *  timing follows the content. Phases 1–3 come first; then Raban asks back,
 *  and the answer lands as one more step in phase 3; phase 4 is still being
 *  told and stays grey. */
function recordTimeline(r: WindowCopy["record"]) {
  let at = 400;
  const phase = (count: number, summed: boolean) => {
    const heard = at;
    const steps = Array.from({ length: count }, (_, j) => heard + 100 + j * STEP);
    at = heard + 100 + count * STEP + 250;
    const done = summed ? at : undefined;
    at += 200;
    return { heard, steps, done };
  };
  const phases = r.phases.slice(0, 3).map((p) => phase(p.steps.length, true));
  const asked = at + 200;
  const added = asked + 1500; // the spoken answer isn't shown, only the step it becomes
  const addedDone = added + 400;
  at = addedDone + 300;
  phases.push(phase(r.phases[3].steps.length, false));
  return { phases, asked, added, addedDone, end: at + 600 };
}

export function RecordScene({ c, label }: Scene) {
  const r = c.record;
  const time = recordTimeline(r);
  let no = 0;
  return (
    <Playback length={time.end}>
      <AppWindow label={label} menu={c.menu} open={0} running>
        <CardHeader icon="sparkles" title={r.title} />
        <div className="flex min-h-0 flex-1 flex-col px-5 pb-5 pt-2">
          <Show at={150}>
            <p className="text-xs font-medium text-app-grey">{r.hearing}</p>
            <p className="mt-1 text-lg font-medium tracking-tight">{r.topic}</p>
          </Show>
          <div className="mt-6 grid grid-cols-4">
            {r.phases.map((phase, i) => {
              const times = time.phases[i];
              // The first step comes with the photo taken at the press: speech, text and pictures go in alike.
              const steps = phase.steps.map((text, j) => ({
                text,
                heard: times.steps[j],
                done: times.done,
                photo: i === 0 && j === 0 ? druckbogen : undefined,
              }));
              if (i === 2) steps.push({ text: r.added, heard: time.added, done: time.addedDone, photo: undefined });
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
          <div className="mt-auto flex items-end gap-5">
            <RabanFace className="size-16" />
            <div className="min-w-0 max-w-md flex-1 pb-1">
              <Show at={time.asked}>
                <p className="text-xs font-medium text-app-grey">{r.asks}</p>
                <p className="mt-0.5">{r.question}</p>
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
  steps: { text: string; heard: number; done?: number; no: number; photo?: StaticImageData }[];
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

function StepLine({
  text,
  heard,
  done,
  no,
  photo,
}: {
  text: string;
  heard: number;
  done?: number;
  no: number;
  photo?: StaticImageData;
}) {
  const summed = useAfter(done ?? Number.POSITIVE_INFINITY) && done !== undefined;
  return (
    <Show as="li" at={heard} className="flex gap-2">
      <span className="w-4 shrink-0 tabular-nums text-app-grey">{no}</span>
      <span className="min-w-0">
        <span className={`block leading-snug transition-colors duration-500 ${summed ? "" : "text-app-grey"}`}>{text}</span>
        {photo && (
          <Show as="span" at={heard + 250} className="mt-1.5 block w-24 overflow-hidden rounded-md border border-app-line">
            <Image src={photo} alt="" sizes="128px" className="block h-auto w-full" />
          </Show>
        )}
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
  return (
    <Playback length={step(p.steps.length) + 700}>
      <AppWindow label={label} menu={c.menu} open={1}>
        <CardHeader icon="search" title={p.title} right={<DoneButton text={c.done} />} />
        <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden px-2 pt-1">
          <Message who={c.me} initial={c.meInitial} time="09:14" mine at={sent}>
            {p.question}
            <span className="mt-2 block w-48 overflow-hidden rounded-xl border border-app-line bg-app-fill">
              <Image src={schachtel} alt="" sizes="256px" className="block h-auto w-full" />
            </span>
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
            </Show>
          </Message>
        </div>
        <Composer
          placeholder={c.placeholder}
          text={p.question}
          at={typed}
          sendAt={sent}
          photo={{ src: schachtel, remove: p.removePhoto }}
        />
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

/* ── 05 Inputs: everything the task from 04 draws on ───────────────────── */

// The firm connects its systems once; each task picks the ones it reads from
// (Johannes, 2026-09-30). The view keeps three kinds apart: systems, files
// someone uploaded, and what people told Raban that was written nowhere.

const SWITCHED = [1300, 1750, 2200]; // the task's three systems switch on, one by one

const FILES = SWITCHED[SWITCHED.length - 1] + 700; // then the uploaded files…
const HEADS = FILES + 1000; // …then what people told Raban

export function InputsScene({ c, label }: Scene) {
  const k = c.inputs;
  return (
    <Playback length={HEADS + 250 * k.heads.rows.length + 800}>
      <AppWindow label={label} menu={c.menu} nav="tasks">
        <CardHeader
          icon="tasks"
          title={k.title}
          right={<span className="rounded-full bg-app-fill px-2.5 py-1 text-xs text-app-grey">{k.state}</span>}
        />
        <Inputs k={k} />
      </AppWindow>
    </Playback>
  );
}

function Inputs({ k }: { k: WindowCopy["inputs"] }) {
  const t = useClock();
  let nth = -1;
  const systems = k.systems.rows.map((row) => ({ ...row, at: row.on ? SWITCHED[++nth] : undefined }));
  const chosen = systems.filter((row) => row.at !== undefined && t >= row.at).length;
  return (
    <div className="min-h-0 flex-1 border-t border-app-line px-6 pt-5">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-lg font-medium leading-snug tracking-tight">{k.name}</p>
          <p className="text-xs text-app-grey">{k.lead}</p>
        </div>
        <div className="flex rounded-lg bg-app-fill p-0.5 text-sm">
          <span className="rounded-md px-3 py-1 text-app-grey">{k.tabs[0]}</span>
          <span className="rounded-md bg-app-card px-3 py-1 font-medium shadow-xs">{k.tabs[1]}</span>
        </div>
      </div>

      <Group label={k.systems.label} right={k.systems.count.replace(/^\d+/, String(chosen))} at={200}>
        {systems.map((row, i) => {
          const on = row.at !== undefined && t >= row.at;
          return (
            <Show key={row.name} at={300 + i * 120} className="flex h-9 items-center gap-3 px-3">
              <Icon name={row.icon} className={`size-4 ${on ? "" : "text-app-grey/70"}`} />
              <span className={`w-44 shrink-0 font-medium transition-colors duration-300 ${on ? "" : "text-app-grey"}`}>
                {row.name}
              </span>
              <span className="min-w-0 flex-1 truncate text-app-grey">{row.what}</span>
              {row.read && (
                <Show as="span" at={(row.at ?? 0) + 300} className="text-xs text-app-grey">
                  {row.read}
                </Show>
              )}
              <Switch on={on} />
            </Show>
          );
        })}
      </Group>

      <Group
        label={k.files.label}
        right={
          <span className="flex items-center gap-3">
            {k.files.count}
            <span className="flex items-center gap-1 rounded-md border border-app-line px-2 py-0.5 text-app-ink">
              <Icon name="plus" className="size-3.5" />
              {k.files.add}
            </span>
          </span>
        }
        at={FILES}
      >
        {k.files.rows.map((row, i) => (
          <Show key={row.name} at={FILES + 100 + i * 180} className="flex h-9 items-center gap-3 px-3">
            <Icon name="file" className="size-4 text-app-grey" />
            <span className="min-w-0 flex-1 truncate">{row.name}</span>
            <span className="text-xs text-app-grey">{row.by}</span>
          </Show>
        ))}
      </Group>

      <Group label={k.heads.label} right={k.heads.count} at={HEADS}>
        {k.heads.rows.map((row, i) => (
          <Show key={row.what} at={HEADS + 100 + i * 250} className="flex h-9 items-center gap-3 px-3">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-app-ink text-2xs font-medium text-app-card">
              {row.who
                .split(" ")
                .map((part) => part[0])
                .join("")}
            </span>
            <span className="w-36 shrink-0 font-medium">{row.who}</span>
            <span className="min-w-0 flex-1 truncate">{row.what}</span>
            <span className="text-xs text-app-grey">{row.when}</span>
          </Show>
        ))}
      </Group>
    </div>
  );
}

/** One of the three kinds of input: its name and count, then its rows in a
 *  hairline box. */
function Group({
  label,
  right,
  at,
  children,
}: {
  label: string;
  right: React.ReactNode;
  at: number;
  children: React.ReactNode;
}) {
  return (
    <Show at={at} className="mt-5">
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="font-medium text-app-grey">{label}</span>
        <span className="text-app-grey">{right}</span>
      </div>
      <div className="divide-y divide-app-line rounded-xl border border-app-line">{children}</div>
    </Show>
  );
}

/** The app's switch: ink when a system feeds this task, a pale track when not. */
function Switch({ on }: { on: boolean }) {
  return (
    <span className={`relative h-[18px] w-8 shrink-0 rounded-full transition-colors duration-300 ${on ? "bg-app-ink" : "bg-app-line"}`}>
      <span
        className={`absolute top-[2px] size-[14px] rounded-full bg-app-card shadow-xs transition-[left] duration-300 ${
          on ? "left-4" : "left-[2px]"
        }`}
      />
    </span>
  );
}
