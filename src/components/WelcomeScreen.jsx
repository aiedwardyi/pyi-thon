import { getGlobalStyles } from "../theme/themes";

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
  return (
    <div style={{ ...pageStyle, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "25%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 700, background: C.accentGlowSoft, borderRadius: "50%", filter: "blur(180px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", right: "20%", width: 300, height: 300, background: "rgba(16,185,129,0.06)", borderRadius: "50%", filter: "blur(120px)", pointerEvents: "none" }} />

      <div className="ui-bounce-in" style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <svg className="ui-logo-float" viewBox="0 0 200 200" style={{ width: 100, height: 100, marginBottom: 40, filter: `drop-shadow(0 0 40px ${C.accentGlow})` }}>
          <defs><linearGradient id="aG" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor={C.accentDeep} /><stop offset="100%" stopColor={C.accentLight} /></linearGradient></defs>
          <path className="ui-logo-line" d="M60 160 L60 60 L30 90" fill="none" stroke="url(#aG)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <path className="ui-logo-line" d="M90 160 L90 40 L60 70" fill="none" stroke="url(#aG)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <path className="ui-logo-line" d="M120 160 L120 60 L90 90" fill="none" stroke="url(#aG)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <path className="ui-logo-line" d="M150 160 L150 80 L120 110" fill="none" stroke="url(#aG)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        <h1 style={{ fontSize: 44, fontWeight: 800, color: C.text, margin: "0 0 12px", letterSpacing: 0, background: `linear-gradient(135deg, ${C.text}, ${C.accentLight})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Pyi-thon
        </h1>
        <p style={{ color: C.accentText, textAlign: "center", maxWidth: 320, marginBottom: 8, fontSize: 15, lineHeight: 1.6, fontWeight: 500, minHeight: 48, fontFamily: monoFont }}>
          {tagline.substring(0, typedChars).split("\n").map((line, index, arr) => <span key={index}>{line}{index < arr.length - 1 && <br />}</span>)}
          <span style={{ display: "inline-block", width: 2, height: "1em", background: C.accent, marginLeft: 2, animation: "blink 1s step-end infinite", verticalAlign: "text-bottom" }} />
        </p>
        <p style={{ color: C.accentTextDim, fontSize: 12, marginBottom: 48, letterSpacing: 0, textTransform: "uppercase" }}>{t("subtitle")}</p>

        <button type="button" className="ui-pop" onClick={onStartLearning} style={{
          padding: "16px 52px", borderRadius: 14, fontWeight: 700, color: C.btnText, fontSize: 16,
          border: "none", cursor: "pointer", fontFamily: "inherit",
          background: `linear-gradient(135deg, ${C.accentDeep}, ${C.accent})`,
          boxShadow: `0 8px 40px ${C.accentGlow}, inset 0 1px 0 rgba(255,255,255,0.1)`,
          animation: "gentlePulse 2.5s ease-in-out infinite",
        }}
          onMouseEnter={(event) => { event.currentTarget.style.boxShadow = `0 12px 48px ${C.accentGlow}, inset 0 1px 0 rgba(255,255,255,0.15)`; }}
          onMouseLeave={(event) => { event.currentTarget.style.boxShadow = `0 8px 40px ${C.accentGlow}, inset 0 1px 0 rgba(255,255,255,0.1)`; }}
        >{t("startLearning")}</button>

        <button type="button" className="ui-pop-soft" onClick={onConfigureApiKey} style={{
          marginTop: 16, color: C.accentTextDim, fontSize: 13, background: "none",
          border: "none", cursor: "pointer", fontFamily: "inherit",
        }}
          onMouseEnter={(event) => { event.currentTarget.style.color = C.accentText; }}
          onMouseLeave={(event) => { event.currentTarget.style.color = C.accentTextDim; }}
        >{t("configureApiKey")}</button>
      </div>
      <style>{getGlobalStyles(C)}</style>
    </div>
  );
}
