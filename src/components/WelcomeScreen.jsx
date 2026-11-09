import { createElement, useState } from "react";
import { getIntroStyles } from "../theme/introTheme";

function makeSpecks() {
  let seed = 20261109;
  const rand = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
  const count = Math.min(300, Math.round((window.innerWidth * window.innerHeight) / 7000));
  return Array.from({ length: count }, () => {
    const accent = rand() < 0.14;
    const size = 1.2 + rand() * (accent ? 1.8 : 1.6);
    const o = accent ? 0.55 + rand() * 0.35 : rand();
    return { accent, size, o, left: rand() * 100, top: rand() * 100, d: 6 + rand() * 9, delay: -rand() * 10 };
  });
}

function Smoke({ id, matrix, frequency, octaves, seed, blur, opacity, className }) {
  const mask = "radial-gradient(ellipse 34% 40% at 50% 50%, rgba(0,0,0,0.4) 0%, #000 100%)";
  return (
    <svg className={className} preserveAspectRatio="none" aria-hidden="true" style={{ position: "absolute", top: "-10%", left: "-10%", width: "120%", height: "120%", opacity, pointerEvents: "none", willChange: "transform, opacity", WebkitMaskImage: mask, maskImage: mask }}>
      <filter id={id} x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency={frequency} numOctaves={octaves} seed={seed} />
        <feColorMatrix values={matrix} />
        <feGaussianBlur stdDeviation={blur} />
      </filter>
      <rect width="100%" height="100%" filter={`url(#${id})`} />
    </svg>
  );
}

export default function WelcomeScreen({
  C,
  monoFont,
  onConfigureApiKey,
  onStartLearning,
  pageStyle,
  t,
  tagline,
  typedChars,
}) {
  const [specks] = useState(makeSpecks);
  const [lo, span] = C.speckOpacity;
  return (
    <div style={{ ...pageStyle, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, position: "relative", overflow: "hidden" }}>
      {createElement(Smoke, { className: "intro-smoke-a", id: "introSmokeA", matrix: C.smokeA, frequency: "0.0016 0.0040", octaves: "4", seed: "11", blur: "5", opacity: C.smokeOpacity[0][0] })}
      {createElement(Smoke, { className: "intro-smoke-b", id: "introSmokeB", matrix: C.smokeB, frequency: "0.004 0.009", octaves: "3", seed: "4", blur: "3", opacity: C.smokeOpacity[1][0] })}
      <div className="intro-glow" style={{ position: "absolute", top: "25%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 700, background: C.glowSoft, borderRadius: "50%", filter: "blur(180px)", pointerEvents: "none" }} />
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {specks.map((s, index) => {
          const o = s.accent ? s.o : lo + s.o * span;
          return (
            <span key={index} className="intro-speck" style={{
              position: "absolute", left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, borderRadius: "50%",
              background: s.accent ? C.speckAccent : C.speck, boxShadow: s.accent ? C.speckGlow : "none",
              opacity: o, "--o": o, "--d": `${s.d}s`, "--delay": `${s.delay}s`,
            }} />
          );
        })}
      </div>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 45%, transparent 35%, ${C.vignette} 100%)`, pointerEvents: "none" }} />

      <div className="ui-bounce-in" style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <svg className="ui-logo-float" viewBox="0 0 200 200" style={{ width: 100, height: 100, marginBottom: 40, filter: `drop-shadow(0 0 36px ${C.glow})` }}>
          <defs><linearGradient id="aG" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor={C.logoFrom} /><stop offset="100%" stopColor={C.logoTo} /></linearGradient></defs>
          <path className="ui-logo-line" d="M60 160 L60 60 L30 90" fill="none" stroke="url(#aG)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <path className="ui-logo-line" d="M90 160 L90 40 L60 70" fill="none" stroke="url(#aG)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <path className="ui-logo-line" d="M120 160 L120 60 L90 90" fill="none" stroke="url(#aG)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <path className="ui-logo-line" d="M150 160 L150 80 L120 110" fill="none" stroke="url(#aG)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        <h1 style={{ fontSize: 44, fontWeight: 800, color: C.text, margin: "0 0 12px", letterSpacing: 0, background: `linear-gradient(135deg, ${C.text} 20%, ${C.accentLine})`, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Pyi-thon
        </h1>
        <p style={{ color: C.tagline, textAlign: "center", maxWidth: 320, marginBottom: 8, fontSize: 15, lineHeight: 1.6, fontWeight: 500, minHeight: 48, fontFamily: monoFont }}>
          {tagline.substring(0, typedChars).split("\n").map((line, index, arr) => <span key={index}>{line}{index < arr.length - 1 && <br />}</span>)}
          <span style={{ display: "inline-block", width: 2, height: "1em", background: C.accentLine, marginLeft: 2, animation: "blink 1s step-end infinite", verticalAlign: "text-bottom" }} />
        </p>
        <p style={{ color: C.subtitle, fontSize: 12, marginBottom: 48, letterSpacing: 0, textTransform: "uppercase" }}>{t("subtitle")}</p>

        {/* Paint the press before the heavy first render of the rep screen. */}
        <button type="button" className="ui-pop" onClick={() => requestAnimationFrame(() => setTimeout(onStartLearning))} style={{
          padding: "16px 52px", borderRadius: 14, fontWeight: 700, color: C.accentInk, fontSize: 16,
          border: "none", cursor: "pointer", fontFamily: "inherit",
          background: `linear-gradient(135deg, ${C.accentDeep}, ${C.accent})`,
          boxShadow: `0 8px 40px ${C.btnShadow}, inset 0 1px 0 ${C.btnInset}`,
        }}
          onMouseEnter={(event) => { event.currentTarget.style.boxShadow = `0 12px 48px ${C.btnShadowHover}, inset 0 1px 0 ${C.btnInset}`; }}
          onMouseLeave={(event) => { event.currentTarget.style.boxShadow = `0 8px 40px ${C.btnShadow}, inset 0 1px 0 ${C.btnInset}`; }}
        >{t("startLearning")}</button>

        <button type="button" className="ui-pop-soft" onClick={onConfigureApiKey} style={{
          marginTop: 16, color: C.link, fontSize: 13, background: "none",
          border: "none", cursor: "pointer", fontFamily: "inherit",
        }}
          onMouseEnter={(event) => { event.currentTarget.style.color = C.linkHover; }}
          onMouseLeave={(event) => { event.currentTarget.style.color = C.link; }}
        >{t("configureApiKey")}</button>
      </div>
      <style>{getIntroStyles(C)}</style>
    </div>
  );
}
