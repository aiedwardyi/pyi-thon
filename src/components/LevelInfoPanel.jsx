export default function LevelInfoPanel({
  C,
  conceptCollapsed,
  level,
  levelT,
  monoFont,
  onToggleConcept,
  phaseColors,
  t,
}) {
  const phasePalette = phaseColors[level.phase];

  return (
    <div style={{ padding: "16px 20px 12px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <div className="ui-badge-pop" style={{
          fontSize: 10,
          fontWeight: 700,
          padding: "3px 10px",
          borderRadius: 20,
          background: `linear-gradient(135deg, ${phasePalette[0]}, ${phasePalette[1]})`,
          color: C.btnText,
          letterSpacing: 0,
        }}>{t("phase")} {level.phase}</div>
        <span style={{ color: C.textDim, fontSize: 11 }}>{t("day")} {level.day}</span>
        {level.tags.includes("boss") && (
          <span className="ui-badge-pop" style={{ fontSize: 10, padding: "3px 10px", borderRadius: 20, background: C.amberBg, border: `1px solid ${C.amberBorder}`, color: C.amber, fontWeight: 700 }}>
            {t("boss")}
          </span>
        )}
      </div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: "0 0 4px", letterSpacing: 0 }}>{levelT.title}</h1>
      <p style={{ color: C.accentTextDim, fontSize: 12, margin: "0 0 14px" }}>{levelT.subtitle}</p>

      <button
        type="button"
        className="ui-pop-subtle"
        aria-expanded={!conceptCollapsed}
        onClick={onToggleConcept}
        style={{
          width: "100%",
          background: C.accentBg,
          border: `1px solid ${C.accentBorder}`,
          borderRadius: 12,
          padding: conceptCollapsed ? "10px 14px" : "14px 16px",
          cursor: "pointer",
          fontFamily: "inherit",
          textAlign: "left",
          transition: "all 0.3s ease",
          marginBottom: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: 0 }}>{t("concept")}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.accentTextDim} strokeWidth="2" strokeLinecap="round" style={{ transition: "transform 0.3s", transform: conceptCollapsed ? "rotate(0deg)" : "rotate(180deg)" }}><polyline points="6 9 12 15 18 9" /></svg>
        </div>
        <div style={{ overflow: "hidden", maxHeight: conceptCollapsed ? 0 : 200, opacity: conceptCollapsed ? 0 : 1, transition: "max-height 0.3s ease-in-out, opacity 0.3s ease-in-out" }}>
          <p style={{ color: C.accentText, fontSize: 13, lineHeight: 1.7, margin: "8px 0 0" }}>{levelT.concept}</p>
        </div>
      </button>

      <div className="ui-panel-subtle" style={{ background: "rgba(255,255,255,0.015)", border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 16px" }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: 0, margin: "0 0 6px" }}>{t("task")}</p>
        <p style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.7, margin: 0 }}>{levelT.task}</p>
        {level.simulatedInput && (
          <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.borderLight}` }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: C.textDim, textTransform: "uppercase", letterSpacing: 0, margin: "0 0 6px" }}>{t("sampleInput")}</p>
            <pre style={{
              margin: 0,
              whiteSpace: "pre-wrap",
              fontSize: 12,
              lineHeight: 1.6,
              color: C.codeText,
              fontFamily: monoFont,
              background: C.codeBg,
              borderRadius: 10,
              padding: "10px 12px",
              border: `1px solid ${C.borderLight}`,
            }}>{level.simulatedInput}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
