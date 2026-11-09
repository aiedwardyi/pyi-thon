import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { Compartment, EditorState, RangeSet, StateEffect, StateField } from "@codemirror/state";
import {
  Decoration, EditorView, GutterMarker, drawSelection, gutterLineClass, highlightActiveLine,
  highlightActiveLineGutter, keymap, lineNumbers,
} from "@codemirror/view";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { HighlightStyle, LanguageSupport, bracketMatching, indentOnInput, indentUnit, syntaxHighlighting } from "@codemirror/language";
import { pythonLanguage } from "@codemirror/lang-python";
import { Tag, styleTags, tags as t } from "@lezer/highlight";
import { MONO_FONT, mix } from "../theme/themes";

// Error mark: a doc position, so it survives edits above it until the next run clears it.
const setErrorPos = StateEffect.define();
const errorPos = StateField.define({
  create: () => null,
  update(value, tr) {
    for (const e of tr.effects) if (e.is(setErrorPos)) return e.value;
    return value === null ? null : tr.changes.mapPos(value);
  },
});

const errLine = Decoration.line({ class: "cm-errline" });
const errDecos = EditorView.decorations.compute([errorPos], (state) => {
  const pos = state.field(errorPos);
  if (pos === null) return Decoration.none;
  return Decoration.set([errLine.range(state.doc.lineAt(pos).from)]);
});

class ErrMarker extends GutterMarker { elementClass = "cm-errgutter"; }
const errMarker = new ErrMarker();
const errGutter = gutterLineClass.compute([errorPos], (state) => {
  const pos = state.field(errorPos);
  if (pos === null) return RangeSet.empty;
  return RangeSet.of([errMarker.range(state.doc.lineAt(pos).from)]);
});

// The stock grammar tags `list` in `items: list` as a plain variable.
const annotation = Tag.define();
const python = new LanguageSupport(pythonLanguage.configure({ props: [styleTags({ "TypeDef/VariableName": annotation })] }));

function themeFor(C) {
  const view = EditorView.theme({
    "&": { backgroundColor: C.well, color: C.text, fontSize: "16px", borderRadius: "10px" },
    ".cm-content": { fontFamily: MONO_FONT, padding: "12px 0", caretColor: C.accentLine, minHeight: "132px" },
    ".cm-line": { padding: "0 14px 0 8px" },
    ".cm-gutters": { backgroundColor: C.well, color: C.dim, border: "none", fontFamily: MONO_FONT, paddingLeft: "6px" },
    ".cm-activeLineGutter": { backgroundColor: "transparent", color: C.text },
    ".cm-activeLine": { backgroundColor: mix(C.dim, 10) },
    "&.cm-focused": { outline: "none" },
    "&.cm-focused .cm-cursor": { borderLeftColor: C.accentLine, borderLeftWidth: "2px" },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection": { backgroundColor: mix(C.accent, 25) },
    ".cm-matchingBracket": { backgroundColor: mix(C.pass, 25), outline: `1px solid ${C.pass}` },
    ".cm-nonmatchingBracket": { backgroundColor: mix(C.miss, 30) },
    ".cm-errline": { backgroundColor: mix(C.miss, 14) },
    ".cm-errgutter": { color: C.miss, fontWeight: "700" },
    ".cm-errgutter::before": { content: '"\\25CF"', position: "absolute", left: "-2px", fontSize: "9px", lineHeight: "inherit" },
    ".cm-lineNumbers .cm-gutterElement": { position: "relative", minWidth: "30px" },
  }, { dark: C.scheme === "dark" });
  const highlight = HighlightStyle.define([
    { tag: [t.keyword, t.controlKeyword, t.definitionKeyword], color: C.syntaxKeyword },
    { tag: [t.function(t.variableName), t.function(t.definition(t.variableName))], color: C.syntaxFunction },
    { tag: [t.definition(t.variableName), t.variableName], color: C.syntaxVariable },
    { tag: [t.string, t.special(t.string)], color: C.syntaxString },
    { tag: [t.number, t.bool, t.null], color: C.syntaxNumber },
    { tag: t.comment, color: C.syntaxComment, fontStyle: "italic" },
    { tag: [t.operator, t.punctuation], color: C.syntaxOperator },
    { tag: [t.typeName, t.className, annotation], color: C.syntaxType },
    { tag: t.propertyName, color: C.syntaxNumber },
  ]);
  return [view, syntaxHighlighting(highlight)];
}

const CodeEditor = forwardRef(function CodeEditor({ C, initialCode, label, onChange, onRun }, ref) {
  const hostRef = useRef(null);
  const viewRef = useRef(null);
  const themeRef = useRef(new Compartment());
  const handlers = useRef({ onChange, onRun });
  handlers.current = { onChange, onRun };

  useEffect(() => {
    const state = EditorState.create({
      doc: initialCode,
      extensions: [
        lineNumbers(), highlightActiveLine(), highlightActiveLineGutter(), drawSelection(), history(),
        indentUnit.of("    "), EditorState.tabSize.of(4), indentOnInput(), bracketMatching(),
        python, themeRef.current.of(themeFor(C)),
        errorPos, errDecos, errGutter,
        keymap.of([
          { key: "Mod-Enter", run: () => { handlers.current.onRun(); return true; }, preventDefault: true },
          indentWithTab, ...defaultKeymap, ...historyKeymap,
        ]),
        EditorView.updateListener.of((u) => { if (u.docChanged) handlers.current.onChange(u.state.doc.toString()); }),
        EditorView.lineWrapping,
        EditorView.contentAttributes.of({ autocapitalize: "off", autocorrect: "off", autocomplete: "off", spellcheck: "false", "aria-label": label }),
      ],
    });
    const view = new EditorView({ state, parent: hostRef.current });
    viewRef.current = view;
    return () => { view.destroy(); viewRef.current = null; };
    // The editor is created once per rep; the parent remounts it with a new key.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    viewRef.current?.dispatch({ effects: themeRef.current.reconfigure(themeFor(C)) });
  }, [C]);

  useImperativeHandle(ref, () => ({
    markError(line) {
      const view = viewRef.current;
      if (!view) return;
      const pos = line != null && line >= 1 && line <= view.state.doc.lines ? view.state.doc.line(line).from : null;
      view.dispatch({ effects: setErrorPos.of(pos) });
    },
    focus() {
      const view = viewRef.current;
      if (!view) return;
      view.focus();
      view.dispatch({ selection: { anchor: view.state.doc.length } });
    },
    blur() { viewRef.current?.contentDOM.blur(); },
  }), []);

  return <div ref={hostRef} data-testid="code-editor" style={{ border: `1px solid ${C.line}`, borderRadius: 10, overflow: "hidden", background: C.well }} />;
});

export default CodeEditor;
