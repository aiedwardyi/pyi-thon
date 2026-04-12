export default function EditorPanel({
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
}) {
  const editorSharedStyle = {
    fontSize: 14,
    lineHeight: "1.75rem",
    fontFamily: monoFont,
    tabSize: 4,
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
    overflowWrap: "break-word",
    padding: "14px 16px",
    margin: 0,
  };

  return (
    <div style={{ flex: 1, position: "relative", minHeight: 240, animation: shakeEditor ? "shake 0.4s ease-in-out" : "none" }}>
      <div style={{
        position: "absolute",
        inset: 0,
        background: C.bgCard,
        border: `1px solid ${editorGlow ? C.green : C.border}`,
        borderRadius: 14,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow: editorGlow
          ? `0 8px 40px rgba(0,0,0,0.4), 0 0 30px rgba(16,185,129,0.2), inset 0 1px 0 rgba(255,255,255,0.03)`
          : "0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)",
        transition: "border-color 0.3s, box-shadow 0.3s",
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 14px",
          background: "rgba(255,255,255,0.02)",
          borderBottom: `1px solid ${C.borderLight}`,
        }}>
          <div style={{ display: "flex", gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: C.trafficRed }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: C.trafficYellow }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: C.trafficGreen }} />
          </div>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginLeft: 8,
            padding: "3px 10px",
            borderRadius: 6,
            background: C.bgPanel,
            border: `1px solid ${C.borderLight}`,
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round"><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" /><polyline points="13 2 13 9 20 9" /></svg>
            <span style={{ fontSize: 11, color: C.accentText, fontWeight: 600, fontFamily: monoFont }}>{filename}</span>
          </div>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 10, color: C.textDim }}>{t("python3")}</span>
        </div>

        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          <div style={{
            width: 48,
            background: "rgba(255,255,255,0.015)",
            borderRight: `1px solid ${C.borderLight}`,
            paddingTop: 14,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}>
            {code.split("\n").map((_, index) => (
              <span key={index} style={{ fontSize: 11, color: C.lineNum, lineHeight: "1.75rem", userSelect: "none", fontWeight: 500, fontFamily: monoFont }}>
                {index + 1}
              </span>
            ))}
          </div>

          <div style={{ flex: 1, position: "relative" }}>
            <pre
              ref={highlightRef}
              aria-hidden="true"
              style={{
                ...editorSharedStyle,
                position: "absolute",
                inset: 0,
                overflow: "hidden",
                pointerEvents: "none",
                background: "transparent",
                color: C.codeText,
                border: "none",
              }}
            >
              {syntaxTokens.map((token, index) => (
                token.color ? <span key={index} style={{ color: token.color }}>{token.text}</span> : token.text
              ))}
              {"\n"}
            </pre>
            <textarea
              ref={editorRef}
              value={code}
              onChange={(event) => setCode(event.target.value)}
              spellCheck={false}
              style={{
                ...editorSharedStyle,
                position: "relative",
                width: "100%",
                height: "100%",
                background: "transparent",
                color: "transparent",
                resize: "none",
                outline: "none",
                border: "none",
                caretColor: C.accent,
                zIndex: 1,
              }}
              placeholder={t("editorPlaceholder")}
              onScroll={(event) => {
                if (!highlightRef.current) return;
                highlightRef.current.scrollTop = event.currentTarget.scrollTop;
                highlightRef.current.scrollLeft = event.currentTarget.scrollLeft;
              }}
              onKeyDown={(event) => {
                if (event.key !== "Tab") return;
                event.preventDefault();
                const textarea = event.currentTarget;
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                setCode(`${code.substring(0, start)}    ${code.substring(end)}`);
                setTimeout(() => {
                  textarea.selectionStart = start + 4;
                  textarea.selectionEnd = start + 4;
                }, 0);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
