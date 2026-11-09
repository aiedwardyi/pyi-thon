import { MONO_FONT } from "../theme/themes";

export function primaryButton(C, extra = {}) {
  return {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
    background: C.accent, color: C.accentInk, border: `1px solid ${C.accent}`, borderRadius: 10,
    padding: "12px 28px", fontWeight: 700, fontSize: 16, cursor: "pointer", fontFamily: "inherit", ...extra,
  };
}

export function ghostButton(C, extra = {}) {
  return {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
    background: "transparent", color: C.muted, border: `1px solid ${C.line}`, borderRadius: 10,
    padding: "12px 20px", fontWeight: 700, fontSize: 16, cursor: "pointer", fontFamily: "inherit", ...extra,
  };
}

export function Kbd({ children }) {
  return <kbd className="ui-kbd" style={{ fontFamily: "inherit", fontSize: 12, opacity: 0.75, fontWeight: 700 }}>{children}</kbd>;
}

export function CodeBlock({ C, code, testId }) {
  return (
    <pre data-testid={testId} style={{
      margin: 0, background: C.well, border: `1px solid ${C.line}`, borderRadius: 10, padding: "12px 16px",
      fontFamily: MONO_FONT, fontSize: 15, lineHeight: 1.6, color: C.text, whiteSpace: "pre-wrap", wordBreak: "break-word",
    }}>{code}</pre>
  );
}

export function Overlay({ C, children, label, testId }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 60, background: C.scrim, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, overflowY: "auto" }}>
      <div role="dialog" aria-modal="true" aria-label={label} data-testid={testId} className="ui-rise" style={{
        width: "100%", maxWidth: 480, maxHeight: "100%", overflowY: "auto", background: C.surface, border: `1px solid ${C.line}`, borderRadius: 18,
        padding: "24px 20px 20px", boxShadow: C.shadow,
      }}>
        {children}
      </div>
    </div>
  );
}
