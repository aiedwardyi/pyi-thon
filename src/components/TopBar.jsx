import { createElement } from "react";
import { mix } from "../theme/themes";

const iconButton = (C) => ({
  width: 34, height: 34, display: "inline-flex", alignItems: "center", justifyContent: "center",
  background: "none", border: "none", borderRadius: 8, color: C.muted, cursor: "pointer", padding: 0, flexShrink: 0,
});

export function Logo({ color, size = 22 }) {
  return (
    <svg className="ui-head-logo" viewBox="0 0 200 200" width={size} height={size} aria-hidden="true" style={{ filter: `drop-shadow(0 0 6px ${mix(color, 45)})` }}>
      <g fill="none" stroke={color} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round">
        <path className="ui-head-logo-line" d="M60 160 L60 60 L30 90" /><path className="ui-head-logo-line" d="M90 160 L90 40 L60 70" /><path className="ui-head-logo-line" d="M120 160 L120 60 L90 90" /><path className="ui-head-logo-line" d="M150 160 L150 80 L120 110" />
      </g>
    </svg>
  );
}

export function Bolt() {
  return <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M13 2 4 14h7l-1 8 9-12h-7z" /></svg>;
}

export function Flame() {
  return <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M12 2c1 4 6 6 6 12a6 6 0 0 1-12 0c0-3 2-5 3-6 0 2 1 3 2 3 0-4-1-6 1-9z" /></svg>;
}

export function RepDots({ C, outcomes, current, label }) {
  return (
    <div role="list" aria-label={label} data-testid="rep-dots" style={{ display: "flex", gap: 6, alignItems: "center" }}>
      {outcomes.map((outcome, index) => (
        <span key={index} role="listitem" data-state={outcome ? "passed" : index === current ? "current" : "todo"} style={{
          width: 9, height: 9, borderRadius: "50%", flexShrink: 0,
          background: outcome ? C.pass : index === current ? C.accentLine : C.line,
          boxShadow: !outcome && index === current ? `0 0 0 3px ${mix(C.accentLine, 22)}` : "none",
        }} />
      ))}
    </div>
  );
}

export default function TopBar({ C, chip, combo, current, onOpenLevels, onOpenSettings, onToggleSound, outcomes, soundEnabled, t, xp, xpRef }) {
  return (
    <header style={{ height: 56, display: "flex", alignItems: "center", gap: 12, padding: "0 16px", borderBottom: `1px solid ${C.line}`, flexShrink: 0, minWidth: 0 }}>
      <button type="button" className="ui-btn" data-testid="open-level-select" aria-label={t("openLevelSelect")} onClick={onOpenLevels} style={{
        display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", color: C.text, cursor: "pointer", padding: 0, fontWeight: 800, fontSize: 17, flexShrink: 0,
      }}>
        {createElement(Logo, { color: C.accentLine })}
        <span className="ui-wide-only">Pyi-thon</span>
      </button>
      {chip && <span data-testid="set-chip" style={{
        fontSize: 13, color: C.muted, border: `1px solid ${C.line}`, borderRadius: 999, padding: "4px 10px", fontWeight: 600,
        minWidth: 0, flex: "0 1 auto", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
      }}>{chip}</span>}
      {outcomes && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {createElement(RepDots, { C, outcomes, current, label: t("repDotsLabel") })}
          <span data-testid="rep-count" style={{ fontSize: 13, color: C.muted, fontWeight: 700 }}>{Math.min(current + 1, outcomes.length)}/{outcomes.length}</span>
        </div>
      )}
      <div style={{ flex: 1 }} />
      <span ref={xpRef} data-testid="xp" aria-label={`${t("xpLabel")}: ${xp}`} style={{ display: "flex", alignItems: "center", gap: 5, fontWeight: 800, fontSize: 15, color: C.xp, fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>
        {createElement(Bolt)}{xp.toLocaleString("en-US")}
      </span>
      {combo >= 1 && (
        <span data-testid="combo" aria-label={`${t("comboLabel")}: ${combo}`} style={{ display: "flex", alignItems: "center", gap: 4, fontWeight: 800, fontSize: 15, color: C.xp, flexShrink: 0 }}>
          {createElement(Flame)}{combo}
        </span>
      )}
      <button type="button" className="ui-btn" aria-label={soundEnabled ? t("disableSound") : t("enableSound")} aria-pressed={soundEnabled} onClick={onToggleSound} style={iconButton(C)}>
        {soundEnabled
          ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5z" /><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" /></svg>
          : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5z" /><path d="m23 9-6 6M17 9l6 6" /></svg>}
      </button>
      <button type="button" className="ui-btn" data-testid="open-settings" aria-label={t("openSettings")} onClick={onOpenSettings} style={iconButton(C)}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
      </button>
    </header>
  );
}
