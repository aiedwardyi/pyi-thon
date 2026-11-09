import { pick } from "../data/sets";
import { doneCount, isUnlocked } from "../lib/progress";
import { mix } from "../theme/themes";

export default function LevelSelectScreen({ C, goToTopic, lang, onBack, progress, sets, t }) {
  const totalDone = sets.filter((set) => progress.topics[set.id]?.done).length;
  return (
    <main style={{ flex: 1, width: "100%", maxWidth: 700, margin: "0 auto", padding: "20px 16px 64px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button type="button" className="ui-btn" aria-label={t("backToCurrentLevel")} onClick={onBack} style={{
          color: C.muted, background: "none", border: `1px solid ${C.line}`, cursor: "pointer", padding: "8px 12px", borderRadius: 10, display: "flex",
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        </button>
        <h1 style={{ color: C.text, fontSize: 20, fontWeight: 800, margin: 0, flex: 1 }}>{t("allLevels")}</h1>
        <span style={{ fontSize: 13, color: C.muted, fontWeight: 700 }}>{totalDone}/{sets.length}</span>
      </div>

      {[1, 2, 3].map((phase) => (
        <section key={phase} style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 13, fontWeight: 800, color: C.muted, letterSpacing: 1, textTransform: "uppercase", margin: "0 0 10px" }}>{t("phaseName" + phase)}</h2>
          <div style={{ display: "grid", gap: 6 }}>
            {sets.map((set, index) => ({ set, index })).filter(({ set }) => set.phase === phase).map(({ set, index }) => {
              const unlocked = isUnlocked(progress, sets, index);
              const done = Boolean(progress.topics[set.id]?.done);
              const count = doneCount(progress, set);
              const isCurrent = index === progress.current;
              return (
                <button key={set.id} type="button" className="ui-btn" data-testid={`topic-${set.id}`} data-locked={!unlocked} disabled={!unlocked}
                  aria-current={isCurrent ? "true" : undefined} onClick={() => goToTopic(index)} style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12, textAlign: "left", fontFamily: "inherit", width: "100%",
                    border: `1px solid ${isCurrent ? C.accentLine : C.line}`, background: C.surface,
                    cursor: unlocked ? "pointer" : "not-allowed", opacity: unlocked ? 1 : 0.5, color: C.text,
                  }}>
                  <span style={{
                    width: 34, height: 34, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    fontSize: 13, fontWeight: 800, background: done ? mix(C.pass, 16) : C.raised, color: done ? C.pass : C.muted,
                  }}>
                    {unlocked ? set.id : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-label={t("locked")}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>}
                  </span>
                  <span style={{ flex: 1, minWidth: 0, fontSize: 15, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{pick(set.title, lang)}</span>
                  <span data-testid={`topic-${set.id}-count`} style={{ fontSize: 13, fontWeight: 700, color: done ? C.pass : C.muted, fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>{count}/{set.reps.length}</span>
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </main>
  );
}
