import { createElement, useCallback, useEffect, useRef, useState } from "react";
import { pick } from "../data/sets";
import { formatHintText } from "../hintFormatting";
import { evaluateWithAI } from "../lib/aiEvaluation";
import { checkRep } from "../lib/beginnerFeedback";
import { floatXp, motionOK } from "../lib/motion";
import { runPython } from "../lib/pythonRunner";
import { sound } from "../lib/sound";
import { MONO_FONT, mix } from "../theme/themes";
import CodeEditor from "./CodeEditor";
import SeeCard from "./SeeCard";
import WinOverlay from "./WinOverlay";
import { CodeBlock, Kbd, ghostButton, primaryButton } from "./parts";

const HINT_BUTTON = ["hint", "hintExample", "hintAnswer"];
const HINT_LABEL = ["hintLabelNudge", "hintLabelExample", "hintLabelAnswer"];

const MAX_ROWS = 20;

function outputRows(result) {
  const rows = result.lines.map((line) => ({ ...line }));
  if (!result.passed) {
    const wrong = result.errorLine == null && !result.isError ? rows.findIndex((row) => !row.ok) : -1;
    if (wrong >= 0) rows[wrong].message = result.message;
    else rows.push({ text: "", ok: false, message: result.message });
  }
  if (rows.length <= MAX_ROWS) return rows;
  const tip = rows.findIndex((row) => row.message);
  const tail = tip >= MAX_ROWS ? [rows[tip]] : [];
  return [...rows.slice(0, MAX_ROWS), { more: rows.length - MAX_ROWS - tail.length }, ...tail];
}

export default function RepScreen({ ai, C, hidden, isLast, lang, onMiss, onNext, onPass, rep, repIndex, set, startWithSee, t, xpEl }) {
  const editorRef = useRef(null);
  const outputRef = useRef(null);
  const shakeRef = useRef(null);
  const codeRef = useRef(rep.starterCode);
  const missesRef = useRef(0);
  const aliveRef = useRef(true);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [hintStep, setHintStep] = useState(0);
  const [passed, setPassed] = useState(false);
  const [win, setWin] = useState(null);
  const [seeOpen, setSeeOpen] = useState(startWithSee);
  const [aiLine, setAiLine] = useState(null);
  const [shake, setShake] = useState(0);

  const hints = rep.hints;
  const answerShown = hints.length === 3 && hintStep >= 3;

  const run = useCallback(async () => {
    if (busy || passed || win || seeOpen) return;
    const code = codeRef.current;
    editorRef.current?.markError(null);
    setAiLine(null);
    if (!code.trim()) {
      setResult({ passed: false, lines: [], errorLine: null, message: t("writeCodeFirst") });
      setShake((n) => n + 1);
      return;
    }
    setBusy(true);
    sound.tick();
    let verdict;
    try {
      const res = await runPython(code, rep.simulatedInput || "");
      verdict = checkRep({
        code, stdout: res.output, errorText: res.errorText, expected: rep.expectedOutput,
        mustUse: rep.mustUse, mustNotUse: rep.mustNotUse, topic: set.id, lang,
      });
      verdict.isError = Boolean(res.errorText);
    } catch {
      verdict = { passed: false, lines: [], errorLine: null, message: t("pythonLoadError"), isError: true };
    }
    if (!aliveRef.current) return;
    setBusy(false);
    setResult(verdict);
    editorRef.current?.markError(verdict.errorLine);
    if (verdict.passed) {
      const outcome = answerShown ? "done" : missesRef.current === 0 && hintStep === 0 ? "clean" : "solved";
      const reward = onPass(outcome);
      setPassed(true);
      floatXp(`+${reward.total} XP`, xpEl);
      editorRef.current?.blur();
      setWin(reward);
      return;
    }
    missesRef.current += 1;
    onMiss();
    sound.fail();
    setShake((n) => n + 1);
    if (ai.enabled) {
      const level = { concept: pick(set.see.text, lang), task: pick(rep.goal, lang), expectedOutput: rep.expectedOutput, simulatedInput: rep.simulatedInput, hint: hints[2] || pick(hints[0], lang) };
      evaluateWithAI(code, level, ai.apiKey, lang, ai.provider)
        .then((res) => setAiLine(res.fallbackToLocal ? { text: res.sourceMessage, source: true } : { text: res.feedback || "", source: false }))
        .catch(() => {});
    }
  }, [ai, answerShown, busy, hintStep, hints, lang, onMiss, onPass, passed, rep, seeOpen, set, t, win, xpEl]);

  useEffect(() => {
    aliveRef.current = true;
    return () => { aliveRef.current = false; };
  }, []);

  useEffect(() => {
    if (hidden) return;
    const onKey = (event) => {
      if (event.defaultPrevented || !(event.ctrlKey || event.metaKey) || event.key !== "Enter") return;
      event.preventDefault();
      void run();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hidden, run]);

  useEffect(() => {
    if (!result || win || window.innerWidth >= 900) return;
    outputRef.current?.scrollIntoView({ behavior: motionOK() ? "smooth" : "auto", block: "nearest" });
  }, [result, win]);

  useEffect(() => {
    const el = shakeRef.current;
    if (!shake || !el || !motionOK()) return;
    el.classList.remove("ui-shake");
    void el.offsetWidth;
    el.classList.add("ui-shake");
  }, [shake]);

  useEffect(() => {
    if (seeOpen || !window.matchMedia?.("(pointer: fine)").matches) return;
    const focused = document.activeElement;
    // A late frame must not pull focus from anything opened since (e.g. Settings).
    requestAnimationFrame(() => { if (document.activeElement === focused) editorRef.current?.focus(); });
  }, [seeOpen]);

  const rows = result ? outputRows(result) : [];
  const hintLabel = hintStep >= hints.length ? t("noMoreHints") : t(HINT_BUTTON[hintStep]);

  return (
    <main style={{ flex: 1, width: "100%", maxWidth: 732, margin: "0 auto", padding: "28px 16px 0", display: hidden ? "none" : "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <h1 data-testid="rep-goal" style={{ margin: 0, fontSize: "clamp(20px, 5.4vw, 26px)", fontWeight: 800, lineHeight: 1.3, color: C.text, flex: 1, minWidth: 0 }}>{pick(rep.goal, lang)}</h1>
        <button type="button" className="ui-btn" data-testid="open-see" aria-label={t("showLesson")} onClick={() => setSeeOpen(true)} style={{
          width: 30, height: 30, borderRadius: "50%", border: `1px solid ${C.line}`, background: "none", color: C.muted, fontWeight: 700, fontSize: 15, cursor: "pointer", flexShrink: 0, marginTop: 2,
        }}>?</button>
      </div>

      {hintStep > 0 && (
        <div data-testid="hint-panel" style={{ display: "grid", gap: 8 }}>
          {hints.slice(0, hintStep).map((hint, index) => {
            const text = index === 0 ? formatHintText(pick(hint, lang)) : hint;
            const isCode = index > 0 || text.includes("\n");
            return (
              <div key={index} className="ui-rise" style={{ background: C.surface, border: `1px dashed ${C.line}`, borderRadius: 10, padding: "10px 12px", display: "grid", gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: C.muted }}>{t(HINT_LABEL[index])}</span>
                {isCode ? createElement(CodeBlock, { C, code: text }) : <p style={{ margin: 0, fontSize: 15, color: C.text }}>{text}</p>}
              </div>
            );
          })}
        </div>
      )}

      <div style={{ display: "grid", gap: 8 }}>
        <pre data-testid="expected-output" aria-label={t("expectedOutput")} style={{
          margin: 0, background: C.well, border: `1px solid ${C.line}`, borderRadius: 10, padding: "12px 16px",
          fontFamily: MONO_FONT, fontSize: 16, lineHeight: 1.6, color: C.text, whiteSpace: "pre-wrap", wordBreak: "break-word",
        }}>{rep.expectedOutput}</pre>
        {rep.simulatedInput && (
          <span data-testid="typed-chip" style={{ justifySelf: "start", fontSize: 12, fontWeight: 600, color: C.muted, border: `1px solid ${C.line}`, borderRadius: 999, padding: "3px 10px" }}>
            {t("typedForYou").replace("{input}", rep.simulatedInput.split("\n").join(", "))}
          </span>
        )}
      </div>

      <div ref={shakeRef}>
        {createElement(CodeEditor, { ref: editorRef, C, initialCode: rep.starterCode, label: t("editor"), onChange: (code) => { codeRef.current = code; }, onRun: () => void run() })}
      </div>

      <div data-testid="action-row" style={{ position: "sticky", bottom: 0, zIndex: 4, display: "flex", alignItems: "center", gap: 12, padding: "10px 0", background: C.base }}>
        <button type="button" className="ui-btn" data-testid="hint-button" disabled={hintStep >= hints.length} onClick={() => setHintStep((n) => n + 1)} style={ghostButton(C, { opacity: hintStep >= hints.length ? 0.5 : 1 })}>{hintLabel}</button>
        <div style={{ flex: 1 }} />
        {passed
          ? <button type="button" className="ui-btn" data-testid="next-rep" onClick={onNext} style={primaryButton(C)}>{isLast ? t("setDone") : t("nextRep")}</button>
          : (
            <button type="button" className="ui-btn" data-testid="run-button" disabled={busy} onClick={() => void run()} style={primaryButton(C, { opacity: busy ? 0.8 : 1 })}>
              {busy ? t("running") : t("run")}{createElement(Kbd, null, "Ctrl+Enter")}
            </button>
          )}
      </div>

      {result && (
        <section ref={outputRef} data-testid="output" aria-live="polite" style={{ display: "grid", gap: 8, paddingBottom: 32, scrollMarginBottom: 80 }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: C.muted, letterSpacing: 1, textTransform: "uppercase" }}>{t("yourOutput")}</span>
          <div style={{ border: `1px solid ${C.line}`, borderRadius: 10, overflow: "hidden" }}>
            {rows.map((row, index) => row.more ? (
              <div key={index} data-testid="output-more" style={{ padding: "10px 16px", borderTop: `1px solid ${C.line}`, fontSize: 14, color: C.muted }}>
                … {t("moreLines").replace("{n}", row.more.toLocaleString(lang === "ko" ? "ko-KR" : "en-US"))}
              </div>
            ) : (
              <div key={index} data-testid="output-row" data-ok={row.ok} style={{
                display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 16px",
                borderTop: index ? `1px solid ${C.line}` : "none", background: row.ok ? "transparent" : mix(C.miss, 9),
              }}>
                <span aria-hidden="true" style={{ color: row.ok ? C.pass : C.miss, fontWeight: 800, lineHeight: 1.5 }}>{row.ok ? "✓" : "✗"}</span>
                <div style={{ minWidth: 0, display: "grid", gap: 2 }}>
                  {row.text !== "" && <span style={{ fontFamily: MONO_FONT, fontSize: 16, color: C.text, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{row.text}</span>}
                  {row.message && <span data-testid="feedback-message" style={{ fontSize: 15, fontWeight: 600, color: C.text }}>{row.message}</span>}
                </div>
              </div>
            ))}
          </div>
          {aiLine?.text && <p data-testid={aiLine.source ? "feedback-source-message" : "ai-feedback"} style={{ margin: 0, fontSize: 13, color: C.muted }}>{aiLine.text}</p>}
        </section>
      )}

      {!hidden && seeOpen && createElement(SeeCard, { C, lang, onStart: () => setSeeOpen(false), set, t })}
      {!hidden && win && (
        createElement(WinOverlay, { C, isLast, onNext, onStay: () => setWin(null), repIndex, repTotal: set.reps.length, reward: win, t })
      )}
    </main>
  );
}
