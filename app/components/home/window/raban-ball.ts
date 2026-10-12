// Raban's ball, the maths only — the same as the app's (frontend/src/bausteine/
// rabanKugel.ts in rabaninc/app, 2026-10-12), cut down to what a scene needs:
// the ball hops in from the right and from the back in two small, smooth
// jumps when a scene starts, listens looking up to the top right (the pose of
// Johannes' picture), looks
// at you while it speaks, and settles into the picture pose the window rests
// on. The app's thinking pose (looking to the bottom left) isn't here: on the
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
/** The jump in: two small hops (Johannes, 2026-10-12: "two small jumps
 *  instead of one big"), each with its start and end in seconds and its
 *  height in units at the front, touching down briefly between them; the
 *  second is lower. */
const HOPS: readonly (readonly [from: number, until: number, height: number])[] = [
  [0, 0.5, 20],
  [0.62, 1.12, 9],
];
/** Stretch in the air, squash on touching down between the hops, and the push
 *  it sinks in with when it lands — gentle and never from one frame to the
 *  next, since at the front the ball fills nearly the whole window
 *  (Johannes, 2026-10-12: "a bit smoother"). */
const STRETCH = 0.04;
const GROUND = 0.08;
const PUSH = -0.8;
type Spot = { depth: number; side: number; sink: number };

const scale = (depth: number) => 1 / (1 + (1 / BACK - 1) * depth);
const smooth = (u: number) => (u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u));
/** Where the middle of the ball stands across the window. */
const middleX = ({ depth, side }: Spot) => VANISH.x + (BALL.x + side - VANISH.x) * scale(depth);

/** On the way in at `p` (0–1), from the right and from the back without
 *  stopping (Johannes, 2026-10-12: "the scale up is a bit like rapid"): it
 *  grows evenly, slowly at first and at the end, and comes in quickly, then
 *  ever more slowly to its place — so it doesn't grow all at once in the last
 *  hop. */
function closer(from: Spot, to: Spot, p: number): Spot {
  const m = scale(from.depth) ** (1 - smooth(p)) * scale(to.depth) ** smooth(p);
  const x = middleX(from) + (middleX(to) - middleX(from)) * (1 - (1 - p) ** 2);
  return {
    depth: (1 / m - 1) / (1 / BACK - 1),
    side: (x - VANISH.x) / m + VANISH.x - BALL.x,
    sink: from.sink + (to.sink - from.sink) * smooth(p),
  };
}

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
 *  outside and hops in at the first mood that isn't `away`. Listening it
 *  sways a little, speaking it bobs; it blinks every 2.5–5.5 s. `rest` is the
 *  picture pose held still, for the end. */
export class Motion {
  private now: Pose = { ...OUTSIDE };
  private speed: Pose = { yaw: 0, pitch: 0, roll: 0, sink: 0, shut: 0, depth: 0, side: 0, squash: 0 };
  private mood: Mood = "away";
  private since = 0;
  private clock = 0;
  private last: number | null = null;
  private jump: { start: number; from: Spot; to: Spot } | null = null;
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
    if (wasAway && mood !== "away") {
      const { depth, side, sink } = this.now;
      const to = POSES[mood];
      this.jump = { start: t, from: { depth, side, sink }, to: { depth: to.depth, side: to.side, sink: to.sink } };
    }
  }

  private target(mood: Mood, t: number): Pose {
    const u = t - this.since;
    // In the air it looks at you; landed, it turns to where the mood looks.
    if (this.jump) return { ...POSES[mood], yaw: FACING.yaw, pitch: FACING.pitch, roll: FACING.roll };
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

  /** The jump in: the hops lift it above its way in, a short squash on the
   *  ground between them (it keeps coming on), then it lands where the mood
   *  wants the ball, sinks in a little and bounces back. */
  private fly(t: number) {
    const { start, from, to } = this.jump!;
    const u = t - start;
    const end = HOPS[HOPS.length - 1][1];
    if (u >= end) {
      this.jump = null;
      Object.assign(this.now, { depth: to.depth, side: to.side, sink: to.sink });
      Object.assign(this.speed, { depth: 0, side: 0, sink: 25, squash: PUSH });
      return;
    }
    const spot = closer(from, to, u / end);
    const i = HOPS.findIndex(([, until]) => u < until);
    const [hopFrom, until, height] = HOPS[i];
    if (u < hopFrom) {
      // On the ground between two hops: squashed, and straight off again.
      const q = (u - HOPS[i - 1][1]) / (hopFrom - HOPS[i - 1][1]);
      Object.assign(this.now, { ...spot, squash: 1 + STRETCH - GROUND * Math.sin(Math.PI * q) });
    } else {
      const q = (u - hopFrom) / (until - hopFrom);
      const stretch = 1 + STRETCH * (1 - 2 * q) ** 2;
      Object.assign(this.now, {
        ...spot,
        sink: spot.sink - height * 4 * q * (1 - q),
        squash: i === 0 ? 1 + (stretch - 1) * smooth(q / 0.12) : stretch,
      });
    }
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
