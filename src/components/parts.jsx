import { useEffect, useRef } from "react";
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

export function Dialog({ children, label, labelledBy, onClose, style }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    const dialog = dialogRef.current;
    dialog.showModal();
    dialog.querySelector("[data-autofocus]")?.focus();
    return () => {
      dialog.close();
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, []);

  const onKeyDown = (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
    }
    if (event.key !== "Tab") return;
    const buttons = [...dialogRef.current.querySelectorAll('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])')]
      .filter((el) => !el.disabled && el.getClientRects().length);
    const first = buttons[0];
    const last = buttons[buttons.length - 1];
    if (event.shiftKey ? document.activeElement === first : document.activeElement === last) {
      event.preventDefault();
      (event.shiftKey ? last : first)?.focus();
    }
  };

  return (
    <dialog ref={dialogRef} aria-modal="true" aria-label={label} aria-labelledby={labelledBy} onCancel={(event) => { event.preventDefault(); onClose?.(); }} onKeyDown={onKeyDown} style={{
      position: "fixed", inset: 0, zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, overflowY: "auto",
      margin: 0, border: "none", width: "100%", height: "100%", maxWidth: "none", maxHeight: "none", ...style,
    }}>{children}</dialog>
  );
}

export function Overlay({ C, children, label, onClose, testId }) {
  return (
    <Dialog label={label} onClose={onClose} style={{ background: C.scrim }}>
      <div data-testid={testId} className="ui-rise" style={{
        width: "100%", maxWidth: 480, maxHeight: "100%", overflowY: "auto", background: C.surface, border: `1px solid ${C.line}`, borderRadius: 18,
        padding: "24px 20px 20px", boxShadow: C.shadow,
      }}>
        {children}
      </div>
    </Dialog>
  );
}
