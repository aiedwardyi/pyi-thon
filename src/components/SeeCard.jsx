import { createElement } from "react";
import { pick } from "../data/sets";
import { CodeBlock, Overlay, primaryButton } from "./parts";

export default function SeeCard({ C, lang, onStart, set, t }) {
  const { see } = set;
  const label = { fontSize: 12, fontWeight: 700, color: C.muted, margin: "0 0 6px" };
  return (
    createElement(Overlay, { C, label: pick(set.title, lang), onClose: onStart, testId: "see-card" }, <>
      <p style={{ fontSize: 13, fontWeight: 700, color: C.muted, margin: "0 0 8px" }}>{set.id} · {pick(set.title, lang)}</p>
      <p style={{ fontSize: 19, fontWeight: 700, lineHeight: 1.4, color: C.text, margin: "0 0 16px" }}>{pick(see.text, lang)}</p>
      {see.code && (
        <div style={{ display: "grid", gap: 12, marginBottom: 4 }}>
          <div>
            <p style={label}>{t("seeExample")}</p>
            {createElement(CodeBlock, { C, code: see.code })}
          </div>
          {see.input && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ ...label, margin: 0 }}>{t("seeYouType")}</span>
              <code style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 6, padding: "2px 8px", fontSize: 14, color: C.text }}>{see.input}</code>
            </div>
          )}
          <div>
            <p style={label}>{t("seePrints")}</p>
            {createElement(CodeBlock, { C, code: see.output })}
          </div>
        </div>
      )}
      <button type="button" className="ui-btn" data-autofocus onClick={onStart} style={primaryButton(C, { width: "100%", marginTop: 16 })}>{t("start")}</button>
    </>)
  );
}
