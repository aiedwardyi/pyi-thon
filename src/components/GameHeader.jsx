export default function GameHeader({
  C,
  completedCount,
  isCompactMobile,
  isWide,
  levelId,
  onOpenLevelSelect,
  onOpenSettings,
  onToggleSound,
  progressPercent,
  showOfflineBadge,
  showXPFloat,
  soundEnabled,
  streak,
  t,
  totalLevels,
  totalXP,
}) {
  return (
    <header style={{
      position: "sticky",
      top: 0,
      zIndex: 40,
      background: C.bgGlassStrong,
      backdropFilter: "blur(24px)",
      borderBottom: `1px solid ${C.border}`,
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: isCompactMobile ? "wrap" : "nowrap",
        rowGap: isCompactMobile ? 10 : 0,
        columnGap: isCompactMobile ? 8 : 0,
        padding: isCompactMobile ? "10px 14px" : "10px 20px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: isCompactMobile ? 6 : 8, minWidth: 0 }}>
          <button
            type="button"
            aria-label={t("openLevelSelect")}
            data-testid="open-level-select"
            onClick={onOpenLevelSelect}
            style={{
              color: C.accentText,
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${C.border}`,
              cursor: "pointer",
              padding: isCompactMobile ? "7px 9px" : "7px 10px",
              borderRadius: 10,
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.background = "rgba(255,255,255,0.06)";
              event.currentTarget.style.borderColor = C.borderFocus;
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.background = "rgba(255,255,255,0.03)";
              event.currentTarget.style.borderColor = C.border;
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>
            <span style={{ fontSize: 11, fontWeight: 600, display: isCompactMobile ? "none" : "inline" }}>{t("levels")}</span>
          </button>
          <svg viewBox="0 0 200 200" style={{ width: 20, height: 20, flexShrink: 0, filter: `drop-shadow(0 0 6px ${C.accentGlow})` }}>
            <defs><linearGradient id="pyithonHeaderLogoGradient" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor={C.accentDeep} /><stop offset="100%" stopColor={C.accentLight} /></linearGradient></defs>
            <path d="M60 160 L60 60 L30 90" fill="none" stroke="url(#pyithonHeaderLogoGradient)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M100 160 L100 40 L70 70" fill="none" stroke="url(#pyithonHeaderLogoGradient)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M140 160 L140 60 L110 90" fill="none" stroke="url(#pyithonHeaderLogoGradient)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M175 160 L175 80 L145 110" fill="none" stroke="url(#pyithonHeaderLogoGradient)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: 14, fontWeight: 800, color: C.accent, letterSpacing: -0.5, display: isWide && !isCompactMobile ? "inline" : "none" }}>Pyi-thon</span>
        </div>

        <div style={{
          flex: isCompactMobile ? "1 1 100%" : 1,
          order: isCompactMobile ? 3 : 0,
          width: isCompactMobile ? "100%" : "auto",
          margin: isCompactMobile ? 0 : "0 20px",
          maxWidth: isCompactMobile ? "none" : 280,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ fontSize: 11, color: C.accentTextDim, fontWeight: 600 }}>{t("levels")} {levelId}</span>
            <span style={{ fontSize: 11, color: C.accentTextDim }}>{completedCount}/{totalLevels}</span>
          </div>
          <div style={{ height: 5, background: "rgba(255,255,255,0.04)", borderRadius: 8, overflow: "hidden" }}>
            <div style={{
              height: "100%",
              borderRadius: 8,
              transition: "width 0.7s ease-out",
              width: `${progressPercent}%`,
              background: `linear-gradient(90deg, ${C.accentDeep}, ${C.accent}, ${C.accentLight})`,
              boxShadow: `0 0 12px ${C.accentGlow}`,
            }} />
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: isCompactMobile ? 8 : 14, flexShrink: 0, marginLeft: "auto" }}>
          {showOfflineBadge && (
            <div
              data-testid="offline-badge"
              title={t("offlineFallback")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                color: C.accentText,
                background: "rgba(255,255,255,0.04)",
                padding: isCompactMobile ? "4px 8px" : "4px 10px",
                borderRadius: 8,
                border: `1px solid ${C.border}`,
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 700 }}>{t("localBadge")}</span>
            </div>
          )}
          {streak > 0 && (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              color: C.amber,
              background: C.amberBg,
              padding: isCompactMobile ? "4px 8px" : "4px 10px",
              borderRadius: 8,
              border: `1px solid ${C.amberBorder}`,
            }}>
              <span style={{ fontSize: 13 }}>&#x1F525;</span>
              <span style={{ fontSize: 12, fontWeight: 700 }}>{streak}</span>
            </div>
          )}
          <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 5, color: C.accentText, background: C.accentBg, padding: isCompactMobile ? "4px 8px" : "4px 10px", borderRadius: 8, border: `1px solid ${C.accentBorder}` }}>
            <span style={{ fontSize: 13 }}>&#x26A1;</span>
            <span style={{ fontSize: 12, fontWeight: 700 }}>{totalXP}</span>
            {showXPFloat && (
              <span style={{ position: "absolute", top: -8, right: -4, color: C.amber, fontSize: 12, fontWeight: 700, animation: "xpFloat 1.5s ease-out forwards", pointerEvents: "none" }}>
                +100
              </span>
            )}
          </div>
          <button
            type="button"
            aria-label={soundEnabled ? t("disableSound") : t("enableSound")}
            aria-pressed={soundEnabled}
            onClick={onToggleSound}
            style={{
              color: soundEnabled ? C.accent : C.textDim,
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 14,
              padding: 4,
              transition: "color 0.2s",
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.color = C.accentText;
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.color = soundEnabled ? C.accent : C.textDim;
            }}
          >
            {soundEnabled
              ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" /></svg>
              : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>}
          </button>
          <button
            type="button"
            aria-label={t("openSettings")}
            data-testid="open-settings"
            onClick={onOpenSettings}
            style={{
              color: C.textDim,
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 14,
              padding: 4,
              transition: "color 0.2s",
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.color = C.accentText;
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.color = C.textDim;
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>
          </button>
        </div>
      </div>
    </header>
  );
}
