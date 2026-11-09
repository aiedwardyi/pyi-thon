import { createElement, useEffect, useRef, useState } from "react";
import { confetti, countUp } from "../lib/motion";
import { sound } from "../lib/sound";
import { mix } from "../theme/themes";
import { Flame } from "./TopBar";
import { Kbd, Overlay, ghostButton, primaryButton } from "./parts";

const WORD = { clean: "winClean", solved: "winSolved", done: "winDone" };
const PART = { solved: "partSolved", firstTry: "partFirstTry", done: "partDone" };

export default function WinOverlay({ C, isLast, onNext, onStay, repIndex, repTotal, reward, t }) {
  const totalRef = useRef(null);
  const [shown, setShown] = useState(0);
  const doneRef = useRef(false);
  const { outcome, parts, combo, dayStreak } = reward;

  const finish = (action) => {
    if (doneRef.current) return;
    doneRef.current = true;
    action();
  };

  useEffect(() => {
    if (outcome === "clean") {
      sound.clean(combo);
      confetti({ count: 150, colors: [C.accent, C.xp, C.pass, C.text], power: 1.2 });
    } else if (outcome === "solved") {
      sound.pass(1);
      confetti({ count: 40, colors: [C.accent, C.text], power: 0.7, spread: Math.PI / 2 });
    } else {
      sound.pass(1);
    }
    // Fire once per win; theme changes mid-overlay must not replay them.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      let sum = 0;
      for (let i = 0; i < parts.length; i++) {
        if (cancelled) return;
        setShown(i + 1);
        await countUp(totalRef.current, sum, sum + parts[i].xp, 320, "+");
        sum += parts[i].xp;
      }
    })();
    return () => { cancelled = true; };
  }, [parts]);

  useEffect(() => {
    let armed = false;
    // A held Enter from Ctrl+Enter must not skip the moment.
    const timer = window.setTimeout(() => { armed = true; }, 450);
    const onKey = (event) => {
      if (event.key !== "Enter" || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
      if (armed && event.target.closest?.("a, button, input, select, textarea")) return;
      event.preventDefault();
      event.stopPropagation();
      if (armed) finish(onNext);
    };
    window.addEventListener("keydown", onKey, true);
    return () => { window.clearTimeout(timer); window.removeEventListener("keydown", onKey, true); };
  }, [onNext]);

  const wordColor = outcome === "clean" ? C.accentLine : outcome === "solved" ? C.text : C.muted;
  return (
    createElement(Overlay, { C, label: t(WORD[outcome]), testId: "win-overlay" }, <>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, textAlign: "center" }}>
        <div className="ui-slam" data-testid="win-word" style={{ fontSize: "clamp(48px, 14vw, 72px)", fontWeight: 900, lineHeight: 0.95, letterSpacing: 1, color: wordColor }}>{t(WORD[outcome])}</div>
        <div style={{ width: 64, height: 5, borderRadius: 3, background: C.accentLine, margin: "2px 0 4px" }} />
        <p style={{ color: C.muted, fontWeight: 600, fontSize: 15, margin: 0 }}>
          {t("repOf").replace("{n}", repIndex + 1).replace("{total}", repTotal)}{outcome === "clean" ? ` · ${t("firstTryNote")}` : ""}
        </p>
        <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 6 }}>
          <span ref={totalRef} data-testid="win-xp" style={{ fontSize: 48, fontWeight: 900, color: C.xp, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>+0</span>
          <span style={{ fontSize: 16, color: C.muted, fontWeight: 700 }}>XP</span>
        </div>
        <ul style={{ width: "100%", maxWidth: 280, listStyle: "none", margin: "4px 0 0", padding: 0 }}>
          {parts.slice(0, shown).map((part) => (
            <li key={part.key} className="ui-pop" style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", fontWeight: 600, color: C.muted, borderBottom: `1px dashed ${C.line}`, fontSize: 15 }}>
              {t(PART[part.key])}<b style={{ color: C.xp }}>+{part.xp}</b>
            </li>
          ))}
        </ul>
        {dayStreak > 0 && (
          <div data-testid="win-day-streak" style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8, fontWeight: 700, color: C.text, fontSize: 14 }}>
            <span style={{ color: C.accentLine, display: "flex" }}>{createElement(Flame)}</span>{t("dayStreakWin").replace("{n}", dayStreak)}
          </div>
        )}
        {combo >= 2 && (
          <div data-testid="win-combo" style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8, fontWeight: 700, color: C.text, background: mix(C.accent, 16), borderRadius: 999, padding: "6px 14px", fontSize: 14 }}>
            <span style={{ color: C.xp, display: "flex" }}>{createElement(Flame)}</span>{t("cleanInARow").replace("{n}", combo)}
          </div>
        )}
        <div style={{ display: "flex", gap: 10, width: "100%", marginTop: 16 }}>
          <button type="button" className="ui-btn" onClick={() => finish(onStay)} style={ghostButton(C, { flex: 1, padding: "14px 10px" })}>{t("seeCode")}</button>
          <button type="button" className="ui-btn" autoFocus data-testid="win-next" onClick={() => finish(onNext)} style={primaryButton(C, { flex: 1, padding: "14px 10px" })}>
            {isLast ? t("setDone") : t("nextRep")}{createElement(Kbd, null, "Enter")}
          </button>
        </div>
      </div>
    </>)
  );
}
