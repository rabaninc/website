// Raban's ball, the maths only — the same as the app's (frontend/src/bausteine/
// rabanKugel.ts in rabaninc/app, 2026-10-14), cut down to what a scene needs:
// the ball jumps in from just right of the window, a little from the back, in one leap, as
// under real gravity and out of the dark into the light, when a scene starts, listens looking up to the top right
// (the pose of Johannes' picture), looks at you while it speaks, blinking as
// it turns, and settles into the picture pose the window rests on. The app's thinking pose (looking to the bottom left) isn't here: on the
// site it was too much motion (Johannes, 2026-10-12). raban-face.tsx draws
// it. Every measure is in units of the 0–100 window, fitted to Johannes'
// picture.

export type Mood = "away" | "listen" | "speak" | "rest";

/** Turn in degrees (yaw to the right, pitch up, roll anticlockwise), sink
 *  down and side to the right in units at the front, depth from 0 at the
 *  front to 1 outside the window, eyes shut 0–1, squash = height over width. */
export type Pose = {
  yaw: number;
  pitch: number;
  roll: number;
  sink: number;
  shut: number;
  depth: number;
  side: number;
  squash: number;
};

/** The ball at the front, as big and as low in the window as in the picture. */
export const BALL = { x: 42.56, y: 74.29, r: 56.95 } as const;
/** Depth runs to the window's middle; outside (depth 1) the ball is 0.59 its size. */
const VANISH = { x: 50, y: 50 } as const;
const BACK = 0.59;

const FRONT = { sink: 0, shut: 0, depth: 0, side: 0, squash: 1 };
/** Johannes' picture: turned up to the top right, tilted — how Raban listens. */
const PICTURE: Pose = { yaw: 24.56, pitch: 28.05, roll: 23.96, ...FRONT };
/** Speaking, he looks at you. */
const FACING: Pose = { yaw: 5, pitch: 11, roll: 6, ...FRONT };
/** Outside, past the window's right edge, looking left into it. */
const OUTSIDE: Pose = { yaw: -30, pitch: 10, roll: -8, sink: 0, shut: 0, depth: 1, side: 165, squash: 1 };

const POSES: Record<Mood, Pose> = { away: OUTSIDE, listen: PICTURE, speak: FACING, rest: PICTURE };

/** The pose a mood comes to rest in. */
export const stillPose = (mood: Mood): Pose => ({ ...POSES[mood] });

const RAD = Math.PI / 180;
/** Half the angle between the eyes on the ball, and each eye as a capsule in
 *  parts of the radius, open and shut — fitted to the picture pixel by pixel. */
const EYE = { spread: 18.64 * RAD, long: 0.284, wide: 0.131, shutLong: 0.04, shutWide: 0.155 };
/** The jump in, as under real gravity (Johannes, 2026-10-12: "a bit more
 *  quicker … look realistic"): it falls with the same gravity as every jump
 *  in the app (units at the front per s²), flies straight at an even speed
 *  and brakes only at the front. One leap from just past the right edge, a
 *  little way back in the room (Johannes' pick, 2026-10-14: "One jump from
 *  the right", over the day before's "Halfway back"), its height in units
 *  at the front. */
const GRAVITY = 605;
const HOP = 18;
/** How long (seconds) it brakes after landing at the front. */
const SETTLE = 0.12;
/** Stretch in the air (more for a higher, faster jump) and the push of
 *  landing at the front: it sinks in, squashes and nods briefly — gentle and
 *  never from one frame to the next, since at the front the ball fills nearly
 *  the whole window (Johannes, 2026-10-12: "a bit smoother"). */
const STRETCH = 0.04;
const LANDING = { sink: 30, squash: -1, pitch: -40 };
type Spot = { depth: number; side: number; sink: number };
/** Where it jumps in from: just past the window's right edge, a little way
 *  back, a good four fifths of its size at the front; it gets there unseen. */
const IN_FROM: Spot = { depth: 0.3, side: 135, sink: 0 };
/** A piece of the jump, in the air (the jump's height) or braking on the
 *  ground (height 0); its speed changes evenly. */
type Piece = { from: number; until: number; start: Spot; v0: Spot; v1: Spot; height: number };

const scale =(depth: number) => 1 / (1 + (1 / BACK - 1) * depth);
/** Light comes in through the window only (Johannes, 2026-10-13: "darker at
 *  the back"): the further back in the room, the darker the ball — 1 at the
 *  front, 0.45 outside (depth 1). Drawn as the ball's opacity over the dark
 *  of the opening. */
export const brightness = (depth: number) => Math.exp(-0.8 * Math.max(0, depth));
const smooth = (u: number) => (u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u));
const spot = (value: (k: keyof Spot) => number): Spot => ({ depth: value("depth"), side: value("side"), sink: value("sink") });
const airTime = (height: number) => Math.sqrt((8 * height) / GRAVITY);
/** How stretched it flies: the higher the jump, the faster it takes off and lands. */
const stretchOf = (height: number) => STRETCH * Math.sqrt(height / 16);

/** The way in from `from` to `to` in pieces: one jump at an even speed, so
 *  fast that with its braking it comes to rest right at the goal, then
 *  braking at the front. Its sink runs to the ground at the goal during the
 *  jump; the jump lifts it above that. */
function path(from: Spot, to: Spot): Piece[] {
  const time = airTime(HOP);
  const v = spot((k) => (to[k] - from[k]) / (k === "sink" ? time : time + SETTLE / 2));
  const front = spot((k) => from[k] + v[k] * time);
  return [
    { from: 0, until: time, start: from, v0: v, v1: v, height: HOP },
    { from: time, until: time + SETTLE, start: front, v0: { ...v, sink: 0 }, v1: spot(() => 0), height: 0 },
  ];
}

/** Whether its look moves far from one mood to the next (say from listening
 *  to looking at you); it blinks as it turns, the way people do — unless it
 *  blinked just now (less than `JUST_BLINKED` seconds ago). */
const JUST_BLINKED = 0.8;
const farTurn = (from: Mood, to: Mood) =>
  ![from, to].some((m) => m === "away" || m === "rest") &&
  Math.hypot(POSES[from].yaw - POSES[to].yaw, POSES[from].pitch - POSES[to].pitch) > 12;

/** Where the ball stands: the matrix that takes it from the front (where it
 *  is drawn) to its place, squashed from below, where it sits. */
export function placement({ depth, side, sink, squash }: Pose) {
  const m = scale(depth);
  const x = VANISH.x + (BALL.x + side - VANISH.x) * m;
  const foot = VANISH.y + (BALL.y + BALL.r + sink - VANISH.y) * m;
  const across = 1 / Math.sqrt(squash);
  return [across * m, 0, 0, squash * m, x - across * m * BALL.x, foot - squash * m * (BALL.y + BALL.r)];
}

type V = [number, number, number];
const cross = (a: V, b: V): V => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const times = (a: V, s: number): V => [a[0] * s, a[1] * s, a[2] * s];
const plus = (a: V, b: V): V => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];

function frame({ yaw, pitch, roll }: Pose) {
  const y = yaw * RAD, p = pitch * RAD, r = roll * RAD;
  const ahead: V = [Math.sin(y) * Math.cos(p), Math.sin(p), Math.cos(y) * Math.cos(p)];
  const l = Math.hypot(ahead[2], ahead[0]) || 1;
  const right0: V = [ahead[2] / l, 0, -ahead[0] / l];
  const up0 = cross(ahead, right0);
  return {
    ahead,
    right: plus(times(right0, Math.cos(r)), times(up0, Math.sin(r))),
    up: plus(times(up0, Math.cos(r)), times(right0, -Math.sin(r))),
  };
}

/** One eye: a capsule on the ball, projected straight on; what lies behind
 *  the ball goes onto its edge. */
function eye(mid: V, up: V, halfLong: number, halfWide: number) {
  if (mid[2] < -0.35) return { d: "", seen: 0 };
  const side = cross(up, mid);
  const round = Math.min(halfLong, halfWide);
  const gs = halfWide - round, gl = halfLong - round;
  const corners: [number, number, number][] = [[gs, gl, 0], [-gs, gl, 90], [-gs, -gl, 180], [gs, -gl, 270]];
  let d = "";
  for (const [ms, ml, start] of corners) {
    for (let k = 0; k <= 14; k++) {
      const w = (start + (90 * k) / 14) * RAD;
      const b = ms + round * Math.cos(w), a = ml + round * Math.sin(w);
      const th = Math.hypot(a, b);
      let q = mid;
      if (th > 1e-6) q = plus(times(mid, Math.cos(th)), times(plus(times(up, a / th), times(side, b / th)), Math.sin(th)));
      let [x, y] = q;
      if (q[2] < 0) {
        const l = Math.hypot(x, y) || 1;
        x /= l;
        y /= l;
      }
      d += `${d ? "L" : "M"}${(BALL.x + BALL.r * x).toFixed(2)} ${(BALL.y - BALL.r * y).toFixed(2)}`;
    }
  }
  // The white rim fades before the eye reaches the edge — or a bright arc would stay on it.
  return { d: `${d}Z`, seen: Math.max(0, Math.min(1, (mid[2] - 0.12) * 4)) };
}

/** Both eyes (left, right) as SVG paths on the ball at the front; `seen` 0–1 for the rim. */
export function eyePaths(s: Pose) {
  const { ahead, right, up } = frame(s);
  const long = EYE.long + (EYE.shutLong - EYE.long) * s.shut;
  const wide = EYE.wide + (EYE.shutWide - EYE.wide) * s.shut;
  return [-1, 1].map((side) => eye(plus(times(ahead, Math.cos(EYE.spread)), times(right, side * Math.sin(EYE.spread))), up, long, wide));
}

const KEYS = ["yaw", "pitch", "roll", "sink", "shut", "depth", "side", "squash"] as const;
/** A spring per value: stiffness and damping (1 = no overshoot); the squash wobbles. */
const SPRING: Record<(typeof KEYS)[number], [number, number]> = {
  yaw: [42, 1], pitch: [42, 1], roll: [42, 1], sink: [42, 1], shut: [120, 1], depth: [30, 1], side: [30, 1], squash: [150, 0.3],
};

/** The motion: springs pull the pose towards what the mood asks for. It starts
 *  outside and jumps in at the first mood that isn't `away`. Listening it
 *  sways a little, speaking it bobs; it blinks every 2.5–5.5 s. `rest` is the
 *  picture pose held still, for the end. */
export class Motion {
  private now: Pose = { ...OUTSIDE };
  private speed: Pose = { yaw: 0, pitch: 0, roll: 0, sink: 0, shut: 0, depth: 0, side: 0, squash: 0 };
  private mood: Mood = "away";
  private since = 0;
  private clock = 0;
  private last: number | null = null;
  private jump: { start: number; to: Spot; pieces: Piece[]; touched: number } | null = null;
  private nextBlink = 0;
  private blinkStart = -1;
  private lastBlink = Number.NEGATIVE_INFINITY;
  private double = false;
  private readonly random: () => number;

  constructor(random: () => number = Math.random) {
    this.random = random;
  }

  /** The pose at `seconds` (rising), as this frame should draw it. Its own
   *  clock only runs while frames come, so a hidden tab doesn't make it whirl. */
  step(mood: Mood, seconds: number): Pose {
    const dt = this.last === null ? 0 : Math.min(0.05, Math.max(0, seconds - this.last));
    this.last = seconds;
    this.clock += dt;
    const t = this.clock;
    if (mood !== this.mood) this.change(mood, t);
    const target = this.target(mood, t);
    for (const k of KEYS) {
      const [stiff, damping] = SPRING[k];
      this.speed[k] += ((target[k] - this.now[k]) * stiff - this.speed[k] * 2 * damping * Math.sqrt(stiff)) * dt;
      this.now[k] += this.speed[k] * dt;
    }
    if (this.jump) this.fly(t);
    // A blink that has begun runs to its end, even while the mood changes.
    const open = mood !== "away" && mood !== "rest" && !this.jump;
    const blink = open || this.blinkStart >= 0 ? this.blink(t, open) : 0;
    return { ...this.now, shut: Math.max(0, Math.min(1, Math.max(this.now.shut, blink))) };
  }

  private change(mood: Mood, t: number) {
    const before = this.mood;
    this.mood = mood;
    this.since = t;
    if (this.blinkStart < 0) {
      const turn = farTurn(before, mood) && t - this.lastBlink > JUST_BLINKED;
      this.nextBlink = turn ? t : t + 1.5 + this.random() * 2;
    }
    if (before === "away" && mood !== "away") {
      // It sets off from just past the right edge, a little way back; it gets there unseen.
      const pose = POSES[mood];
      const to = { depth: pose.depth, side: pose.side, sink: pose.sink };
      this.jump = { start: t, to, pieces: path(IN_FROM, to), touched: 0 };
    }
  }

  private target(mood: Mood, t: number): Pose {
    const u = t - this.since;
    // In the air it looks at you; landed, it turns to where the mood looks.
    if (this.jump) return { ...POSES[mood], yaw: FACING.yaw, pitch: FACING.pitch, roll: FACING.roll };
    if (mood === "speak") {
      // It bobs with the syllables, not to a beat: now quicker, now slower, now more, now hardly.
      const syllables = Math.max(0, Math.sin(u * 9.5 + 1.3 * Math.sin(u * 2.3))) * (0.5 + 0.3 * Math.sin(u * 1.9) + 0.2 * Math.sin(u * 3.7 + 1));
      return {
        ...FACING,
        yaw: FACING.yaw + 3 * Math.sin(u * 0.8),
        pitch: FACING.pitch + 4 * syllables,
        roll: FACING.roll + 3 * Math.sin(u * 1.1),
        sink: -2.2 * syllables,
      };
    }
    if (mood === "listen") {
      return {
        ...PICTURE,
        yaw: PICTURE.yaw + 3 * Math.sin(u * 0.7),
        pitch: PICTURE.pitch + 2 * Math.sin(u * 0.5),
        roll: PICTURE.roll + 3 * Math.sin(u * 0.9),
      };
    }
    return { ...POSES[mood] };
  }

  /** The jump in, piece by piece: the jump lifts it above its way in, then
   *  it lands where the mood wants the ball and brakes; the springs take its
   *  sinking in, squashing and nodding from there. */
  private fly(t: number) {
    const jump = this.jump!;
    const { start, to, pieces } = jump;
    const u = t - start;
    if (u >= pieces[pieces.length - 1].until) {
      this.jump = null;
      Object.assign(this.now, { depth: to.depth, side: to.side });
      Object.assign(this.speed, { depth: 0, side: 0 });
      // Landed, it turns to where the mood looks, blinking if that is far.
      if (farTurn("speak", this.mood) && t - this.lastBlink > JUST_BLINKED) this.nextBlink = t;
      return;
    }
    const i = pieces.findIndex(({ until }) => u < until);
    const { from, until, start: begin, v0, v1, height } = pieces[i];
    const s = u - from, q = s / (until - from);
    const here = spot((k) => begin[k] + v0[k] * s + ((v1[k] - v0[k]) * s * q) / 2);
    const push = jump.touched < i;
    jump.touched = i;
    if (height > 0) {
      const stretch = 1 + stretchOf(height) * (1 - 2 * q) ** 2;
      Object.assign(this.now, { ...here, sink: here.sink - height * 4 * q * (1 - q), squash: 1 + (stretch - 1) * smooth(q / 0.12) });
    } else {
      // Landed: it brakes; sinking in, squashing and nodding spring back by themselves.
      Object.assign(this.now, { depth: here.depth, side: here.side });
      Object.assign(this.speed, { depth: 0, side: 0 });
      if (push) {
        this.now.sink = here.sink;
        Object.assign(this.speed, { sink: LANDING.sink, squash: LANDING.squash, pitch: this.speed.pitch + LANDING.pitch });
      }
      return;
    }
    Object.assign(this.speed, { depth: 0, side: 0, sink: 0, squash: 0 });
  }

  /** How far the eyes are shut (0–1); a new blink only starts when it may `begin`. */
  private blink(t: number, begin: boolean) {
    if (this.blinkStart < 0 && begin && t >= this.nextBlink) {
      this.blinkStart = t;
      this.lastBlink = t;
      this.double = this.random() < 0.18;
    }
    if (this.blinkStart < 0) return 0;
    const u = t - this.blinkStart;
    if (u > (this.double ? 0.5 : 0.22)) {
      this.blinkStart = -1;
      this.nextBlink = t + 2.5 + this.random() * 3;
      return 0;
    }
    const v = this.double && u > 0.25 ? u - 0.25 : u;
    if (v < 0.07) return v / 0.07;
    if (v < 0.11) return 1;
    if (v < 0.22) return 1 - (v - 0.11) / 0.11;
    return 0;
  }
}
