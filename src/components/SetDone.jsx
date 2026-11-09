import { createElement, useEffect, useRef } from "react";
import { pick } from "../data/sets";
import { confetti, countUp } from "../lib/motion";
import { sound } from "../lib/sound";
import { RepDots } from "./TopBar";
import { Kbd, primaryButton } from "./parts";

export default function SetDone({ C, bonus, lang, nextSet, onNext, outcomes, set, t }) {
  const xpRef = useRef(null);

  useEffect(() => {
    sound.setDone();
    confetti({ count: 200, colors: [C.pass, C.xp, C.accent, C.text], power: 1.4, spread: Math.PI * 1.2 });
    // Celebrate once on arrival.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { void countUp(xpRef.current, 0, bonus, 600, "+"); }, [bonus]);

  useEffect(() => {
    let armed = false;
    const timer = window.setTimeout(() => { armed = true; }, 450);
    const onKey = (event) => {
      if (event.key !== "Enter" || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
      event.preventDefault();
      if (armed) onNext();
    };
    window.addEventListener("keydown", onKey, true);
    return () => { window.clearTimeout(timer); window.removeEventListener("keydown", onKey, true); };
  }, [onNext]);

  return (
    <main data-testid="set-done" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, padding: "32px 16px", textAlign: "center" }}>
      <p style={{ margin: 0, color: C.muted, fontWeight: 700, fontSize: 15 }}>{set.id} · {pick(set.title, lang)}</p>
      <h1 className="ui-slam" style={{ margin: 0, fontSize: "clamp(48px, 14vw, 88px)", fontWeight: 900, lineHeight: 0.95, letterSpacing: 1, color: C.pass }}>{t("setDoneTitle")}</h1>
      <div style={{ transform: "scale(1.6)", margin: "10px 0" }}>{createElement(RepDots, { C, outcomes, current: -1, label: t("repDotsLabel") })}</div>
      {bonus > 0 && (
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span ref={xpRef} data-testid="set-bonus" style={{ fontSize: 48, fontWeight: 900, color: C.xp, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>+0</span>
          <span style={{ fontSize: 16, color: C.muted, fontWeight: 700 }}>XP · {t("setBonus")}</span>
        </div>
      )}
      <p data-testid="unlocked" style={{ margin: 0, fontSize: 17, fontWeight: 600, color: C.text }}>
        {nextSet ? t("unlockedTopic").replace("{title}", `${nextSet.id} · ${pick(nextSet.title, lang)}`) : t("allTopicsDone")}
      </p>
      <button type="button" className="ui-btn" autoFocus onClick={onNext} style={primaryButton(C, { marginTop: 10, padding: "14px 36px" })}>
        {nextSet ? t("nextTopic") : t("allLevels")}{createElement(Kbd, null, "Enter")}
      </button>
    </main>
  );
}
