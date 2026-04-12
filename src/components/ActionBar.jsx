export default function ActionBar({
  C,
  currentLevel,
  feedback,
  handleReset,
  handleSubmit,
  isCompactMobile,
  isEvaluating,
  isMac,
  onGoNextLevel,
  onToggleHint,
  showHint,
  t,
  totalLevels,
}) {
  return (
    <div style={{
      position: "sticky",
      bottom: 0,
      background: C.bgGlassStrong,
      backdropFilter: "blur(24px)",
      borderTop: `1px solid ${C.border}`,
      padding: isCompactMobile ? "12px 14px" : "12px 20px",
      display: "flex",
      alignItems: "center",
      gap: 8,
      zIndex: 30,
      flexWrap: isCompactMobile ? "wrap" : "nowrap",
    }}>
      <button
        type="button"
        onClick={onToggleHint}
        style={{
          padding: "10px 16px",
          borderRadius: 12,
          fontSize: 12,
          fontWeight: 600,
          background: C.amberBg,
          color: C.amber,
          border: `1px solid ${C.amberBorder}`,
          cursor: "pointer",
          fontFamily: "inherit",
          transition: "all 0.2s",
          flex: isCompactMobile ? "1 1 calc(50% - 4px)" : "0 0 auto",
        }}
        onMouseEnter={(event) => {
          event.currentTarget.style.background = "rgba(245,158,11,0.15)";
          event.currentTarget.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.background = C.amberBg;
          event.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {showHint ? t("hideHint") : t("hint")}
      </button>

      <button
        type="button"
        onClick={handleReset}
        style={{
          padding: "10px 16px",
          borderRadius: 12,
          fontSize: 12,
          fontWeight: 600,
          background: "rgba(255,255,255,0.03)",
          color: C.accentTextDim,
          border: `1px solid ${C.border}`,
          cursor: "pointer",
          fontFamily: "inherit",
          transition: "all 0.2s",
          flex: isCompactMobile ? "1 1 calc(50% - 4px)" : "0 0 auto",
        }}
        onMouseEnter={(event) => {
          event.currentTarget.style.background = "rgba(255,255,255,0.06)";
          event.currentTarget.style.borderColor = C.borderFocus;
          event.currentTarget.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.background = "rgba(255,255,255,0.03)";
          event.currentTarget.style.borderColor = C.border;
          event.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {t("reset")}
      </button>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isEvaluating}
        style={{
          flex: isCompactMobile ? "1 1 100%" : 1,
          padding: "12px 0",
          borderRadius: 12,
          fontSize: 14,
          fontWeight: 700,
          color: C.btnText,
          border: "none",
          fontFamily: "inherit",
          cursor: isEvaluating ? "not-allowed" : "pointer",
          background: `linear-gradient(135deg, ${C.accentDeep}, ${C.accent})`,
          boxShadow: `0 4px 24px ${C.accentGlow}`,
          opacity: isEvaluating ? 0.6 : 1,
          transition: "all 0.2s",
        }}
        onMouseEnter={(event) => {
          if (isEvaluating) return;
          event.currentTarget.style.transform = "translateY(-1px)";
          event.currentTarget.style.boxShadow = `0 6px 32px ${C.accentGlow}`;
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.transform = "translateY(0)";
          event.currentTarget.style.boxShadow = `0 4px 24px ${C.accentGlow}`;
        }}
      >
        {isEvaluating ? t("evaluating") : <>{`${t("runCode")} \u25B6`}<span style={{ fontSize: 10, opacity: 0.45, marginLeft: 10 }}>{isMac ? "\u2318" : "Ctrl"}+Enter</span></>}
      </button>

      {feedback?.correct && currentLevel < totalLevels - 1 && (
        <button
          type="button"
          onClick={onGoNextLevel}
          style={{
            padding: "12px 20px",
            borderRadius: 12,
            fontSize: 13,
            fontWeight: 700,
            background: C.greenBg,
            color: C.green,
            border: `1px solid ${C.greenBorder}`,
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "all 0.2s",
            animation: "fadeSlideUp 0.3s ease-out",
            flex: isCompactMobile ? "1 1 100%" : "0 0 auto",
          }}
          onMouseEnter={(event) => {
            event.currentTarget.style.background = "rgba(16,185,129,0.15)";
            event.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.background = C.greenBg;
            event.currentTarget.style.transform = "translateY(0)";
          }}
        >
          {t("next")} &rarr;
        </button>
      )}
    </div>
  );
}
