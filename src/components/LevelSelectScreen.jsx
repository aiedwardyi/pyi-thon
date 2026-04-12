import { LEVELS, PHASE_ICONS, getLocalizedLevel } from "../data/levels";
import { getGlobalStyles } from "../theme/themes";

export default function LevelSelectScreen({
  C,
  completedLevels,
  currentLevel,
  goToLevel,
  lang,
  pageStyle,
  phaseColors,
  progressPercent,
  setShowLevelSelect,
  t,
  unlockedUpTo,
}) {
  return (
    <div style={{ ...pageStyle, padding: "20px 20px 100px", overflowY: "auto", position: "relative" }}>
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: 300, background: `linear-gradient(to bottom, ${C.accentGlowSoft}, transparent)`, pointerEvents: "none", zIndex: 0 }} />
      <div style={{ maxWidth: 640, margin: "0 auto", position: "relative", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <button type="button" aria-label="Back to current level" onClick={() => setShowLevelSelect(false)} style={{
            color: C.accentText, background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`,
            cursor: "pointer", padding: "8px 12px", borderRadius: 10, transition: "all 0.2s",
          }}
            onMouseEnter={(event) => { event.currentTarget.style.background = "rgba(255,255,255,0.06)"; event.currentTarget.style.borderColor = C.borderFocus; }}
            onMouseLeave={(event) => { event.currentTarget.style.background = "rgba(255,255,255,0.03)"; event.currentTarget.style.borderColor = C.border; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          </button>
          <h2 style={{ color: C.text, fontSize: 20, fontWeight: 700, letterSpacing: -0.5 }}>{t("allLevels")}</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: C.accentTextDim }}>{completedLevels.size}/{LEVELS.length}</span>
            <div style={{ width: 60, height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 4, width: `${progressPercent}%`, background: `linear-gradient(90deg, ${C.accentDeep}, ${C.accent})`, transition: "width 0.5s" }} />
            </div>
          </div>
        </div>

        {[1, 2, 3].map((phase) => (
          <div key={phase} style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 800, letterSpacing: 1,
                background: `linear-gradient(135deg, ${phaseColors[phase][0]}, ${phaseColors[phase][1]})`,
                color: C.btnText,
              }}>{PHASE_ICONS[phase]}</div>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.text, letterSpacing: -0.3 }}>{t("phaseName" + phase)}</span>
              <div style={{ flex: 1, height: 1, background: C.border }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {LEVELS.filter((level) => level.phase === phase).map((level) => {
                const idx = LEVELS.indexOf(level);
                const done = completedLevels.has(level.id);
                const unlocked = idx < unlockedUpTo || done;
                const isCurrent = idx === currentLevel;
                const localizedLevel = getLocalizedLevel(level, lang);
                return (
                  <button key={level.id} type="button" onClick={() => unlocked && goToLevel(idx)} disabled={!unlocked} aria-current={isCurrent ? "true" : undefined} style={{
                    display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderRadius: 14, textAlign: "left", fontFamily: "inherit",
                    border: `1px solid ${isCurrent ? C.accentBorder : done ? C.greenBorder : C.border}`,
                    background: isCurrent ? C.accentBg : done ? C.bgSubtle : "rgba(255,255,255,0.015)",
                    cursor: unlocked ? "pointer" : "not-allowed", opacity: unlocked ? 1 : 0.3,
                    transition: "all 0.2s ease",
                  }}
                    onMouseEnter={(event) => {
                      if (!unlocked) return;
                      event.currentTarget.style.background = isCurrent ? C.accentBg : done ? C.bgSubtle : "rgba(255,255,255,0.04)";
                      event.currentTarget.style.borderColor = isCurrent ? C.accent : done ? C.green : C.borderFocus;
                      event.currentTarget.style.transform = "translateX(4px)";
                      event.currentTarget.style.filter = "brightness(1.3)";
                    }}
                    onMouseLeave={(event) => {
                      if (!unlocked) return;
                      event.currentTarget.style.background = isCurrent ? C.accentBg : done ? C.bgSubtle : "rgba(255,255,255,0.015)";
                      event.currentTarget.style.borderColor = isCurrent ? C.accentBorder : done ? C.greenBorder : C.border;
                      event.currentTarget.style.transform = "translateX(0)";
                      event.currentTarget.style.filter = "none";
                    }}
                  >
                    <div style={{
                      width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 13, fontWeight: 700, flexShrink: 0,
                      background: done ? C.greenBg : isCurrent ? C.accentBg : "rgba(255,255,255,0.03)",
                      color: done ? C.green : isCurrent ? C.accent : C.textDim,
                      border: `1px solid ${done ? C.greenBorder : isCurrent ? C.accentBorder : "transparent"}`,
                    }}>
                      {done ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> : unlocked ? level.id : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: done ? C.greenLight : unlocked ? C.text : C.textDim, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{localizedLevel.title}</p>
                      <p style={{ fontSize: 11, color: C.accentTextDim, margin: "3px 0 0" }}>{localizedLevel.subtitle}</p>
                    </div>
                    {level.tags.includes("boss") && <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 20, background: C.amberBg, border: `1px solid ${C.amberBorder}`, color: C.amber, fontWeight: 700, letterSpacing: 0.5 }}>{t("boss")}</span>}
                    {isCurrent && <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent, boxShadow: `0 0 8px ${C.accentGlow}`, flexShrink: 0 }} />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <style>{getGlobalStyles(C)}</style>
    </div>
  );
}
