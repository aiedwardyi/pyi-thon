import { createElement } from "react";
import { heatCells, heatLevel, streakStats } from "../lib/streak";
import { mix } from "../theme/themes";
import { Flame } from "./TopBar";

const SHADES = [45, 65, 85, 100];

export default function HistoryScreen({ C, days, lang, onBack, t, today }) {
  const stats = streakStats(days, today);
  const reps = (n) => t(n === 1 ? "repsOne" : "repsMany").replace("{n}", n);
  const clean = (n) => t("cleanCount").replace("{n}", n);
  const dateLabel = (key) => {
    const [y, m, d] = key.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString(lang === "ko" ? "ko-KR" : "en-US", { month: "short", day: "numeric" });
  };
  const cellLabel = (cell) => (cell.reps
    ? t("heatCell").replace("{date}", dateLabel(cell.key)).replace("{reps}", reps(cell.reps)).replace("{clean}", clean(cell.clean))
    : t("heatRest").replace("{date}", dateLabel(cell.key)));
  const big = (value, label, testId, color, showFlame) => (
    <div style={{ flex: 1, background: C.surface, border: `1px solid ${C.line}`, borderRadius: 14, padding: "16px 14px", textAlign: "center" }}>
      <div data-testid={testId} style={{ fontSize: 44, fontWeight: 900, lineHeight: 1, color, fontVariantNumeric: "tabular-nums", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
        {showFlame && <span style={{ display: "flex", transform: "scale(1.5)" }}>{createElement(Flame)}</span>}{value}
      </div>
      <div style={{ fontSize: 13, color: C.muted, fontWeight: 700, marginTop: 8 }}>{label}</div>
    </div>
  );
  return (
    <main style={{ flex: 1, width: "100%", maxWidth: 700, margin: "0 auto", padding: "20px 16px 64px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button type="button" className="ui-btn" aria-label={t("backFromHistory")} onClick={onBack} style={{
          color: C.muted, background: "none", border: `1px solid ${C.line}`, cursor: "pointer", padding: "8px 12px", borderRadius: 10, display: "flex",
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        </button>
        <h1 style={{ color: C.text, fontSize: 20, fontWeight: 800, margin: 0, flex: 1 }}>{t("history")}</h1>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        {big(stats.current, t("streakNow"), "streak-now", stats.current > 0 ? C.accentLine : C.dim, true)}
        {big(stats.best, t("streakBest"), "streak-best", C.text, false)}
      </div>
      <p data-testid="today-line" style={{ color: C.muted, fontWeight: 600, fontSize: 15, margin: "20px 0 24px" }}>
        {stats.today.reps ? t("todayLine").replace("{reps}", reps(stats.today.reps)).replace("{clean}", clean(stats.today.clean)) : t("todayNone")}
      </p>
      <h2 style={{ fontSize: 13, fontWeight: 800, color: C.muted, letterSpacing: 1, textTransform: "uppercase", margin: "0 0 10px" }}>{t("heatLabel")}</h2>
      <div role="group" aria-label={t("heatLabel")} data-testid="heatmap" style={{
        display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gridTemplateRows: "repeat(7, auto)", gridAutoFlow: "column", gap: 4, maxWidth: 420,
      }}>
        {heatCells(days, today).map((cell) => {
          if (cell.future) return <span key={cell.key} aria-hidden="true" style={{ aspectRatio: "1", visibility: "hidden" }} />;
          const level = heatLevel(cell.reps);
          const label = cellLabel(cell);
          return (
            <span key={cell.key} role="img" title={label} aria-label={label} data-testid="heat-cell" data-date={cell.key} data-level={level} style={{
              aspectRatio: "1", borderRadius: 4, background: level ? mix(C.accent, SHADES[level - 1]) : C.line,
              boxShadow: cell.key === today ? `0 0 0 2px ${C.text}` : "none",
            }} />
          );
        })}
      </div>
    </main>
  );
}
