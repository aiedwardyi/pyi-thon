// All sounds are synthesized. The AudioContext is created on the first user gesture, never before.
let ctx = null;
let master = null;
let enabled = false;
let unlocked = false;

export function setSoundEnabled(on) { enabled = on; }

export function unlockAudio() {
  if (unlocked) return;
  unlocked = true;
  const on = () => {
    if (!ctx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      ctx = new Ctx();
      master = ctx.createGain();
      master.gain.value = 0.5;
      master.connect(ctx.destination);
    }
    if (ctx.state === "suspended") void ctx.resume();
  };
  window.addEventListener("pointerdown", on, { capture: true });
  window.addEventListener("keydown", on, { capture: true });
}

function live() { return enabled && ctx && master && ctx.state === "running" ? ctx : null; }

function note(freq, at, dur, o = {}) {
  const audio = live();
  if (!audio) return;
  const t0 = audio.currentTime + at;
  const osc = audio.createOscillator();
  osc.type = o.type ?? "sine";
  osc.frequency.setValueAtTime(freq, t0);
  if (o.detune) osc.detune.value = o.detune;
  if (o.slideTo) osc.frequency.exponentialRampToValueAtTime(o.slideTo, t0 + dur);
  const g = audio.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(o.gain ?? 0.18, t0 + (o.attack ?? 0.012));
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(master);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

const semi = (base, n) => base * Math.pow(2, n / 12);
const C5 = 523.25;

export const sound = {
  tick() { note(1100, 0, 0.045, { type: "triangle", gain: 0.07 }); note(1650, 0.01, 0.03, { type: "sine", gain: 0.03 }); },
  // Rises two semitones per combo step, capped an octave up.
  pass(combo) {
    const base = semi(C5, Math.min(Math.max(combo - 1, 0), 6) * 2);
    note(base, 0, 0.28, { gain: 0.16 });
    note(base * 1.5, 0.09, 0.34, { gain: 0.14 });
  },
  clean(combo) {
    this.pass(combo);
    const top = semi(C5, 12);
    [0, 4, 7, 12].forEach((n, i) => note(semi(top, n), 0.16 + i * 0.055, 0.22, { type: "triangle", gain: 0.06 }));
  },
  fail() { note(260, 0, 0.38, { slideTo: 170, gain: 0.1, attack: 0.03 }); note(130, 0.02, 0.3, { type: "triangle", slideTo: 95, gain: 0.05, attack: 0.04 }); },
  setDone() {
    [-5, 0, 4, 7, 12].forEach((n, i) => note(semi(C5, n), i * 0.1, 0.32, { gain: 0.14 }));
    [12, 16, 19, 24].forEach((n) => note(semi(C5, n), 0.55, 1.2, { gain: 0.07, attack: 0.06 }));
    note(semi(C5, -12), 0.55, 1.2, { type: "triangle", gain: 0.06, attack: 0.06 });
  },
};
