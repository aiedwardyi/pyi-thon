import { createElement } from "react";
import EditorPanel from "./EditorPanel";
import OutputPanel from "./OutputPanel";

export default function WorkspacePanel({
  C,
  code,
  editorGlow,
  editorRef,
  feedback,
  filename,
  formattedHint,
  highlightRef,
  isCompactMobile,
  isEvaluating,
  isWide,
  level,
  levelT,
  monoFont,
  provider,
  setCode,
  setFeedback,
  setTab,
  shakeEditor,
  showHint,
  syntaxTokens,
  t,
  tab,
}) {
  const editorPanel = createElement(EditorPanel, {
    C,
    code,
    editorGlow,
    editorRef,
    filename,
    highlightRef,
    monoFont,
    setCode,
    shakeEditor,
    syntaxTokens,
    t,
  });

  const outputPanel = createElement(OutputPanel, {
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
  });

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "0 20px 16px", minHeight: 0 }}>
      {isWide ? (
        <div style={{ flex: 1, display: "flex", gap: 12, minHeight: 280 }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>{editorPanel}</div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>{outputPanel}</div>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
            {["editor", "output"].map((panelKey) => (
              <button
                key={panelKey}
                type="button"
                className="ui-pop-soft"
                aria-pressed={tab === panelKey}
                onClick={() => setTab(panelKey)}
                style={{
                  padding: "8px 20px",
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 600,
                  border: `1px solid ${tab === panelKey ? C.accentBorder : "transparent"}`,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  background: tab === panelKey ? C.accentBg : "transparent",
                  color: tab === panelKey ? C.accentText : C.accentTextDim,
                }}
                onMouseEnter={(event) => {
                  if (tab !== panelKey) event.currentTarget.style.color = C.accentText;
                }}
                onMouseLeave={(event) => {
                  if (tab !== panelKey) event.currentTarget.style.color = C.accentTextDim;
                }}
              >
                {panelKey === "editor" ? t("editor") : `${t("output")} ${isEvaluating ? "" : feedback ? (feedback.correct ? " \u2713" : " \u2717") : ""}`}
                {panelKey === "output" && isEvaluating && <span style={{ display: "inline-block", marginLeft: 6, width: 6, height: 6, borderRadius: "50%", background: C.accent, animation: "dotBounce 1.4s ease-in-out infinite" }} />}
              </button>
            ))}
          </div>
          {tab === "editor" ? editorPanel : outputPanel}
        </>
      )}

      {showHint && !isCompactMobile && (
        <div className="ui-panel-pop" data-testid="hint-panel" style={{
          marginTop: 10,
          background: C.amberBg,
          border: `1px solid ${C.amberBorder}`,
          borderRadius: 12,
          padding: "12px 16px",
        }}>
          <p style={{ color: C.amberText, fontSize: 12, lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>
            <span style={{ fontWeight: 700, marginRight: 6 }}>{t("hint")}:</span>
            {formattedHint}
          </p>
        </div>
      )}
    </div>
  );
}
