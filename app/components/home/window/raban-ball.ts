// Raban's ball, the maths only — the same as the app's (frontend/src/bausteine/
// rabanKugel.ts in rabaninc/app, 2026-10-12), cut down to what a scene needs:
// the ball jumps in from the right when a scene starts, listens looking up to
// the top right (the pose of Johannes' picture), looks at you while it speaks,
// looks to the bottom left while it thinks, and settles into the picture pose
// the window rests on. raban-face.tsx draws it. Every measure is in units of
// the 0–100 window, fitted to Johannes' picture.

export type Mood = "away" | "listen" | "speak" | "think" | "rest";

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
/** Thinking, he leans back up to the right and looks to the bottom left, the
 *  same size — leaning is what keeps both eyes inside the window. */
const THINKING: Pose = { yaw: -18, pitch: -9, roll: 20, sink: -8, shut: 0, depth: 0, side: 12, squash: 1 };
/** Outside, past the window's right edge, looking left into it. */
const OUTSIDE: Pose = { yaw: -30, pitch: 10, roll: -8, sink: 0, shut: 0, depth: 1, side: 165, squash: 1 };

const POSES: Record<Mood, Pose> = { away: OUTSIDE, listen: PICTURE, speak: FACING, think: THINKING, rest: PICTURE };

/** The pose a mood comes to rest in. */
export const stillPose = (mood: Mood): Pose => ({ ...POSES[mood] });

const RAD = Math.PI / 180;
/** Half the angle between the eyes on the ball, and each eye as a capsule in
 *  parts of the radius, open and shut — fitted to the picture pixel by pixel. */
const EYE = { spread: 18.64 * RAD, long: 0.284, wide: 0.131, shutLong: 0.04, shutWide: 0.155 };
/** The jump in: seconds in the air and the arc's height in units at the front. */
const JUMP = { flight: 0.8, height: 42 };

const scale = (depth: number) => 1 / (1 + (1 / BACK - 1) * depth);

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
 *  sways a little, speaking it bobs, thinking it glances about; it blinks
 *  every 2.5–5.5 s. `rest` is the picture pose held still, for the end. */
export class Motion {
  private now: Pose = { ...OUTSIDE };
  private speed: Pose = { yaw: 0, pitch: 0, roll: 0, sink: 0, shut: 0, depth: 0, side: 0, squash: 0 };
  private mood: Mood = "away";
  private since = 0;
  private clock = 0;
  private last: number | null = null;
  private jump: { start: number; from: { depth: number; side: number; sink: number }; to: Pose } | null = null;
  private glance = { yaw: 0, pitch: 0, next: 0 };
  private nextBlink = 0;
  private blinkStart = -1;
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
    const blink = mood === "away" || mood === "rest" || this.jump ? 0 : this.blink(t);
    return { ...this.now, shut: Math.max(0, Math.min(1, Math.max(this.now.shut, blink))) };
  }

  private change(mood: Mood, t: number) {
    const wasAway = this.mood === "away";
    this.mood = mood;
    this.since = t;
    this.blinkStart = -1;
    this.nextBlink = t + 1.5 + this.random() * 2;
    this.glance.next = t;
    if (wasAway && mood !== "away") {
      const { depth, side, sink } = this.now;
      this.jump = { start: t, from: { depth, side, sink }, to: POSES[mood] };
    }
  }

  private target(mood: Mood, t: number): Pose {
    const u = t - this.since;
    // In the air it looks at you; landed, it turns to where the mood looks.
    if (this.jump) return { ...POSES[mood], yaw: FACING.yaw, pitch: FACING.pitch, roll: FACING.roll };
    if (mood === "think") {
      if (t >= this.glance.next) {
        this.glance = { yaw: (this.random() * 2 - 1) * 8, pitch: (this.random() * 2 - 1) * 4, next: t + 0.6 + this.random() * 1.1 };
      }
      return { ...THINKING, yaw: THINKING.yaw + this.glance.yaw, pitch: THINKING.pitch + this.glance.pitch };
    }
    if (mood === "speak") {
      const syllables = Math.max(0, Math.sin(u * 9.5)) * (0.55 + 0.45 * Math.sin(u * 1.9));
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

  /** The jump in: an arc from outside to where the mood wants the ball, then it lands and bounces. */
  private fly(t: number) {
    const { start, from, to } = this.jump!;
    const p = (t - start) / JUMP.flight;
    if (p >= 1) {
      this.jump = null;
      Object.assign(this.now, { depth: to.depth, side: to.side, sink: to.sink, squash: 0.93 });
      Object.assign(this.speed, { depth: 0, side: 0, sink: 35, squash: 0 });
      return;
    }
    Object.assign(this.now, {
      depth: from.depth + (to.depth - from.depth) * p,
      side: from.side + (to.side - from.side) * p,
      sink: from.sink + (to.sink - from.sink) * p - JUMP.height * 4 * p * (1 - p),
      squash: 1 + 0.08 * (1 - 2 * p) ** 2,
    });
    Object.assign(this.speed, { depth: 0, side: 0, sink: 0, squash: 0 });
  }

  private blink(t: number) {
    if (this.blinkStart < 0 && t >= this.nextBlink) {
      this.blinkStart = t;
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
