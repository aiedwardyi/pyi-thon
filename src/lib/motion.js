let canvas = null;
let ctx = null;
let particles = [];
let raf = 0;
let last = 0;

export function motionOK() {
  return !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

function ensureCanvas() {
  if (canvas) return;
  canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText = "position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:70";
  document.body.appendChild(canvas);
  ctx = canvas.getContext("2d");
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener("resize", resize);
}

export function confetti({ colors, count = 120, x, y, power = 1, spread = Math.PI } = {}) {
  if (!motionOK() || !colors?.length) return;
  ensureCanvas();
  if (!ctx) return;
  const ox = x ?? window.innerWidth / 2;
  const oy = y ?? window.innerHeight * 0.4;
  for (let i = 0; i < count; i++) {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * spread;
    const speed = (380 + Math.random() * 520) * power;
    particles.push({
      x: ox, y: oy, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
      rot: Math.random() * Math.PI * 2, vr: (Math.random() - 0.5) * 14,
      w: 6 + Math.random() * 7, h: 4 + Math.random() * 5,
      color: colors[Math.floor(Math.random() * colors.length)], life: 1.6 + Math.random() * 1.2, round: Math.random() < 0.25,
    });
  }
  if (!raf) { last = performance.now(); raf = requestAnimationFrame(step); }
}

function step(now) {
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  const alive = [];
  for (const p of particles) {
    p.life -= dt;
    if (p.life <= 0 || p.y > window.innerHeight + 40) continue;
    p.vy += 900 * dt;
    p.vx *= 1 - 1.6 * dt;
    p.vy *= 1 - 0.6 * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.rot += p.vr * dt;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.globalAlpha = Math.min(1, p.life);
    ctx.fillStyle = p.color;
    if (p.round) { ctx.beginPath(); ctx.arc(0, 0, p.h / 2, 0, Math.PI * 2); ctx.fill(); }
    else ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.rot * 0.7)) + 1);
    ctx.restore();
    alive.push(p);
  }
  particles = alive;
  if (particles.length) raf = requestAnimationFrame(step);
  else { raf = 0; ctx.clearRect(0, 0, window.innerWidth, window.innerHeight); }
}

// Counts a number up over `ms`; jumps straight to the end under reduced motion.
export function countUp(el, from, to, ms = 320, prefix = "") {
  return new Promise((resolve) => {
    if (!el) { resolve(); return; }
    if (!motionOK() || to === from) { el.textContent = `${prefix}${to}`; resolve(); return; }
    const start = performance.now();
    const tick = (now) => {
      const k = Math.min(1, (now - start) / ms);
      const eased = 1 - Math.pow(1 - k, 3);
      el.textContent = `${prefix}${Math.round(from + (to - from) * eased)}`;
      if (k < 1) requestAnimationFrame(tick); else resolve();
    };
    requestAnimationFrame(tick);
  });
}

export function floatXp(text, anchor) {
  if (!motionOK() || !anchor) return;
  const r = anchor.getBoundingClientRect();
  const el = document.createElement("div");
  el.className = "ui-float-xp";
  el.style.left = `${r.left + r.width / 2}px`;
  el.style.top = `${r.top}px`;
  el.textContent = text;
  document.body.appendChild(el);
  el.addEventListener("animationend", () => el.remove());
  window.setTimeout(() => el.remove(), 1800);
}
