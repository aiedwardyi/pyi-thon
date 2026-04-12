import { AI_PROVIDERS } from "../data/appConfig";

export default function OutputPanel({
  C,
  editorRef,
  feedback,
  isEvaluating,
  level,
  levelT,
  monoFont,
  provider,
  setFeedback,
  setTab,
  t,
}) {
  const providerLabel = AI_PROVIDERS[provider]?.name || AI_PROVIDERS.gemini.name;

  if (isEvaluating) {
    return (
      <div style={{ flex: 1, minHeight: 200 }}>
        <div className="ui-panel-pop" style={{
          height: "100%",
          borderRadius: 14,
          border: `1px solid ${C.accentBorder}`,
          background: C.accentBg,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
        }}>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontSize: 24, color: C.accent, animation: "bracketPulse 1.2s ease-in-out infinite", display: "inline-block" }}>{`{`}</span>
            <div style={{ display: "flex", gap: 4 }}>
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: C.accent,
                    animation: "dotBounce 1.4s ease-in-out infinite",
                    animationDelay: `${index * 0.2}s`,
                  }}
                />
              ))}
            </div>
            <span style={{ fontSize: 24, color: C.accent, animation: "bracketPulse 1.2s ease-in-out infinite 0.1s", display: "inline-block" }}>{`}`}</span>
          </div>
          <p style={{ color: C.accentTextDim, fontSize: 13, fontWeight: 600, margin: 0, letterSpacing: 0 }}>
            {providerLabel} {t("isEvaluatingMsg")}
          </p>
        </div>
      </div>
    );
  }

  if (!feedback) {
    return (
      <div style={{ flex: 1, minHeight: 200 }}>
        <div className="ui-panel-pop" style={{
          height: "100%",
          borderRadius: 14,
          border: `1px solid ${C.border}`,
          background: C.bgSubtle,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.textDim} strokeWidth="1.5" strokeLinecap="round"><polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" /></svg>
          <p style={{ color: C.textDim, fontSize: 13 }}>{t("runToSee")}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, minHeight: 200 }}>
      <div className="ui-panel-pop" style={{
        height: "100%",
        borderRadius: 14,
        padding: 20,
        overflowY: "auto",
        border: `1px solid ${C.border}`,
        background: C.bgCard,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, paddingBottom: 16, borderBottom: `1px solid ${C.border}` }}>
          <button
            type="button"
            className="ui-icon-pop"
            onClick={() => {
              if (!feedback.correct) setTab("editor");
            }}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              background: feedback.correct ? C.green : C.red,
              cursor: feedback.correct ? "default" : "pointer",
              border: "none",
              padding: 0,
            }}
          >
            {feedback.correct
              ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>}
          </button>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{feedback.correct ? t("correct") : t("notQuite")}</span>
            <p style={{ fontSize: 13, color: C.textMuted, margin: "4px 0 0", lineHeight: 1.6 }}>{feedback.aiExplanation || feedback.message}</p>
          </div>
          {feedback.correct && (
            <span className="ui-badge-pop" style={{ fontSize: 12, color: C.amber, fontWeight: 700, background: C.amberBg, padding: "4px 10px", borderRadius: 8, border: `1px solid ${C.amberBorder}`, flexShrink: 0 }}>
              +100 XP
            </span>
          )}
        </div>

        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: C.textDim, textTransform: "uppercase", letterSpacing: 0, margin: "0 0 8px" }}>{t("expectedOutput")}</p>
          <pre style={{
            background: C.codeBg,
            borderRadius: 10,
            padding: 14,
            color: C.codeText,
            fontSize: 12,
            overflowX: "auto",
            fontFamily: monoFont,
            margin: 0,
            whiteSpace: "pre-wrap",
            border: `1px solid ${C.borderLight}`,
          }}>{feedback.expected}</pre>
        </div>

        {level.simulatedInput && (
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: C.textDim, textTransform: "uppercase", letterSpacing: 0, margin: "0 0 8px" }}>{t("sampleInputUsed")}</p>
            <pre style={{
              background: C.codeBg,
              borderRadius: 10,
              padding: 14,
              color: C.codeText,
              fontSize: 12,
              overflowX: "auto",
              fontFamily: monoFont,
              margin: 0,
              whiteSpace: "pre-wrap",
              border: `1px solid ${C.borderLight}`,
            }}>{level.simulatedInput}</pre>
          </div>
        )}

        <div style={{ paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: C.textDim, textTransform: "uppercase", letterSpacing: 0, margin: "0 0 6px" }}>{t("concept")}</p>
          <p style={{ color: C.textDim, fontSize: 12, lineHeight: 1.7, margin: 0 }}>{levelT.explanation}</p>
        </div>

        {!feedback.correct && (
          <button
            type="button"
            className="ui-pop"
            onClick={() => {
              setFeedback(null);
              setTab("editor");
              setTimeout(() => editorRef.current?.focus(), 50);
            }}
            style={{
              width: "100%",
              marginTop: 16,
              padding: "12px 0",
              borderRadius: 10,
              background: C.accentBg,
              border: `1px solid ${C.accentBorder}`,
              color: C.accentText,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.background = C.accentBorder;
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.background = C.accentBg;
            }}
          >
            {t("tryAgain")}
          </button>
        )}
      </div>
    </div>
  );
}
