import { pythonLanguage } from "@codemirror/lang-python";

const LOOP_RE = /infinite loop detected/i;
const ERROR_LINE_RE = /^([A-Za-z_][\w.]*(?:Error|Exception)):?\s*(.*)$/;

function lastErrorLine(errorText) {
  const execLines = [...errorText.matchAll(/File "<exec>", line (\d+)/g)];
  if (execLines.length) return Number(execLines[execLines.length - 1][1]);
  const fallback = errorText.match(/\(detected at line (\d+)\)/) || errorText.match(/\bline (\d+)\b/);
  return fallback ? Number(fallback[1]) : null;
}

function parseError(errorText) {
  const rows = errorText.split("\n").map((row) => row.trimEnd());
  for (let i = rows.length - 1; i >= 0; i--) {
    const match = rows[i].match(ERROR_LINE_RE);
    if (match) return { type: match[1].split(".").pop(), detail: match[2] };
  }
  return { type: "Error", detail: "" };
}

function editDistance(a, b) {
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    for (let j = 1; j <= b.length; j++) {
      row[j] = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = row;
  }
  return prev[b.length];
}

function assignedNames(code) {
  const names = new Set();
  for (const match of code.matchAll(/^\s*([A-Za-z_]\w*)\s*(?:[-+*/%]|\/\/|\*\*)?=(?!=)/gm)) names.add(match[1]);
  for (const match of code.matchAll(/^\s*for\s+([A-Za-z_]\w*)\s+in\b/gm)) names.add(match[1]);
  return names;
}

function hasWord(text, word) {
  return new RegExp(`(^|[^\\p{L}\\p{N}_])${word}($|[^\\p{L}\\p{N}_])`, "u").test(text);
}

const MESSAGES = {
  en: {
    line: (n, body) => `Line ${n}: ${body}`,
    noLine: (body) => body.charAt(0).toUpperCase() + body.slice(1),
    spelling: (x) => `Python doesn't know ${x}. Check the spelling.`,
    quotes: (x) => `${x} is text, so it needs quotes.`,
    create: (x) => `Python doesn't know ${x} yet. Create it first.`,
    unterminated: () => "a quote is missing at the end of the text.",
    unclosed: (open, close) => `a ${open} is missing its ${close}.`,
    colon: () => "this line needs a colon : at the end.",
    indentNeeded: (topic) => (topic >= 5 ? "indent the line under the colon (4 spaces)." : "put 4 spaces before this line."),
    indentExtra: (topic) => (topic >= 5 ? "this line shouldn't be indented." : "remove the spaces before this line."),
    unindent: () => "line this up with the lines above.",
    concat: (topic) => (topic >= 3 ? "+ can't join text and a number. Use str()." : "+ can't join text and a number."),
    intLiteral: () => 'int() needs digits, like "42".',
    zero: () => "you can't divide by zero.",
    index: () => "that position is past the end of the list.",
    key: (k) => `the dict has no key ${k}.`,
    other: (type) => `Python error: ${type}. Read this line again.`,
    loop: () => "Your loop never stops. Change the counter inside it.",
    nothing: () => "Nothing printed yet. Use print().",
    caseOnly: (n) => `Line ${n}: close! Check capital letters.`,
    punctuation: (n) => `Line ${n}: close! Check punctuation and spaces.`,
    mismatch: (n, exp, got) => `Line ${n}: expected "${exp}", got "${got}".`,
    missing: (n, exp) => `Missing line ${n}: "${exp}".`,
    extra: (n) => `Line ${n} wasn't expected.`,
    boundary: (values, expected, got) => `With ${values}: expected "${expected}", got "${got}".`,
  },
  ko: {
    line: (n, body) => `${n}번째 줄: ${body}`,
    noLine: (body) => body,
    spelling: (x) => `파이썬이 ${x} 이름을 몰라요. 철자를 확인하세요.`,
    quotes: (x) => `글자 ${x}에는 따옴표가 필요해요.`,
    create: (x) => `파이썬이 ${x} 이름을 아직 몰라요. 먼저 만드세요.`,
    unterminated: () => "글자 끝에 따옴표가 빠졌어요.",
    unclosed: (open, close) => `${open}에 맞는 ${close}가 빠졌어요.`,
    colon: () => "이 줄 끝에 콜론 :이 필요해요.",
    indentNeeded: (topic) => (topic >= 5 ? "콜론 아래 줄은 들여쓰기(공백 4칸)를 하세요." : "이 줄 앞에 공백 4칸을 넣으세요."),
    indentExtra: (topic) => (topic >= 5 ? "이 줄은 들여쓰기하면 안 돼요." : "이 줄 앞의 공백을 지우세요."),
    unindent: () => "위쪽 줄들과 줄을 맞추세요.",
    concat: (topic) => (topic >= 3 ? "+로 글자와 숫자를 이을 수 없어요. str()을 쓰세요." : "+로 글자와 숫자를 이을 수 없어요."),
    intLiteral: () => 'int()에는 "42" 같은 숫자가 필요해요.',
    zero: () => "0으로 나눌 수 없어요.",
    index: () => "그 위치는 리스트의 끝을 넘었어요.",
    key: (k) => `딕셔너리에 ${k} 키가 없어요.`,
    other: (type) => `Python 오류: ${type}. 이 줄을 다시 읽어 보세요.`,
    loop: () => "반복이 끝나지 않아요. 안의 카운터를 바꾸세요.",
    nothing: () => "아직 출력된 게 없어요. print()를 쓰세요.",
    caseOnly: (n) => `${n}번째 줄: 거의 맞아요! 대소문자를 확인하세요.`,
    punctuation: (n) => `${n}번째 줄: 거의 맞아요! 문장부호와 띄어쓰기를 확인하세요.`,
    mismatch: (n, exp, got) => `${n}번째 줄: 기대 "${exp}", 실제 "${got}".`,
    missing: (n, exp) => `${n}번째 줄이 빠졌어요: "${exp}".`,
    extra: (n) => `${n}번째 줄은 필요 없어요.`,
    boundary: (values, expected, got) => `${values}일 때: 기대 "${expected}", 실제 "${got}".`,
  },
};

const CLOSERS = { "(": ")", "[": "]", "{": "}" };

function nameErrorMessage(name, { code, expected, codeLine }) {
  const assigned = assignedNames(code);
  if (assigned.has(name)) return { key: "create", args: [name] };
  const lower = name.toLowerCase();
  const known = [...assigned].map((item) => item.toLowerCase());
  if (known.includes(lower)) return { key: "spelling", args: [name] };
  if (hasWord(expected, name)) return { key: "quotes", args: [name] };
  if (known.some((item) => editDistance(lower, item) <= 2)) return { key: "spelling", args: [name] };
  const inCall = codeLine !== null && new RegExp(`print\\(\\s*${name}\\s*\\)|=\\s*${name}\\s*(?:#.*)?$`).test(codeLine);
  if (/^[A-Z]/.test(name) || inCall) return { key: "quotes", args: [name] };
  return { key: "create", args: [name] };
}

function errorMessage(ctx) {
  const { errorText, code, expected, topic, codeLine } = ctx;
  if (LOOP_RE.test(errorText)) return { key: "loop", args: [], bare: true };
  const { type, detail } = parseError(errorText);

  if (type === "NameError") {
    const name = detail.match(/name '([\p{L}\p{N}_]+)' is not defined/u)?.[1];
    if (name) return nameErrorMessage(name, { code, expected, codeLine });
  }
  if (type === "SyntaxError") {
    if (/^invalid syntax/.test(detail) && codeLine !== null) {
      const text = codeLine.match(/\bprint\(\s*([^"'()]+?)\s*\)\s*(?:#.*)?$/)?.[1];
      if (text && /^[A-Za-z\p{L}]/u.test(text)) return { key: "quotes", args: [text] };
    }
    if (/unterminated string literal/.test(detail)) return { key: "unterminated", args: [] };
    const open = detail.match(/^'([([{])' was never closed/)?.[1];
    if (open) return { key: "unclosed", args: [open, CLOSERS[open]] };
    if (/^expected ':'/.test(detail)) return { key: "colon", args: [] };
  }
  if (type === "IndentationError") {
    if (/^expected an indented block/.test(detail)) return { key: "indentNeeded", args: [topic] };
    if (/^unexpected indent/.test(detail)) return { key: "indentExtra", args: [topic] };
    if (/^unindent does not match/.test(detail)) return { key: "unindent", args: [] };
  }
  if (type === "TypeError" && /can only concatenate str \(not "(int|float)"\) to str|unsupported operand type\(s\) for \+: '(int|float)' and 'str'/.test(detail)) {
    return { key: "concat", args: [topic] };
  }
  if (type === "ValueError" && /^invalid literal for int\(\)/.test(detail)) return { key: "intLiteral", args: [] };
  if (type === "ZeroDivisionError") return { key: "zero", args: [] };
  if (type === "IndexError") return { key: "index", args: [] };
  if (type === "KeyError") return { key: "key", args: [detail] };
  return { key: "other", args: [type] };
}

function pickMessage(message, lang) {
  if (typeof message === "string") return message;
  return message?.[lang] || message?.en || "";
}

export function checkRep({ code, stdout, errorText, expected, mustUse = [], mustNotUse = [], checks = [], topic = 1, lang = "en" }) {
  const text = MESSAGES[lang] || MESSAGES.en;
  const expectedLines = expected ? expected.trimEnd().split(/\r?\n/) : [];
  const gotLines = stdout ? stdout.trimEnd().split(/\r?\n/) : [];
  const lines = gotLines.map((line, i) => ({ text: line, ok: i < expectedLines.length && line.trimEnd() === expectedLines[i].trimEnd() }));
  const missing = Math.max(0, expectedLines.length - gotLines.length);
  const result = (passed, message, errorLine = null) => ({ passed, lines, missing, errorLine, message });

  if (errorText && errorText.trim()) {
    const errorLine = lastErrorLine(errorText);
    const codeLine = errorLine === null ? null : (code.split("\n")[errorLine - 1] ?? null);
    const { key, args, bare } = errorMessage({ errorText, code, expected, topic, codeLine });
    const body = text[key](...args);
    if (bare) return result(false, body);
    return result(false, errorLine === null ? text.noLine(body) : text.line(errorLine, body), errorLine);
  }

  if (!gotLines.length && expectedLines.length) return result(false, text.nothing());

  for (let i = 0; i < Math.min(gotLines.length, expectedLines.length); i++) {
    const got = gotLines[i].trimEnd();
    const exp = expectedLines[i].trimEnd();
    if (got === exp) continue;
    const strip = (s) => s.replace(/[^\p{L}\p{N}]/gu, "");
    if (got.toLowerCase() === exp.toLowerCase()) return result(false, text.caseOnly(i + 1));
    if (strip(got) === strip(exp)) return result(false, text.punctuation(i + 1));
    return result(false, text.mismatch(i + 1, exp, got));
  }
  if (gotLines.length < expectedLines.length) return result(false, text.missing(gotLines.length + 1, expectedLines[gotLines.length]));
  if (gotLines.length > expectedLines.length) return result(false, text.extra(expectedLines.length + 1));

  const tree = pythonLanguage.parser.parse(code);
  for (const rule of [...mustUse.map((r) => [r, true]), ...mustNotUse.map((r) => [r, false])]) {
    const [{ pattern, message }, wanted] = rule;
    const spaced = pattern.replaceAll("\\(", "\\s*\\(\\s*").replaceAll("\\)", "\\s*\\)").replaceAll(" ", "\\s+");
    // Rejected comments and strings must not consume later executable matches.
    const found = [...code.matchAll(new RegExp(`(?=${spaced})`, "g"))].some((match) => {
      for (let node = tree.resolveInner(match.index, 1); node; node = node.parent) {
        if (node.name === "Comment" || (wanted && node.name === "String")) return false;
        if (node.name === "FormatReplacement") break;
        if (wanted && node.name === "FormatString" && match.index !== node.from) return false;
      }
      return true;
    });
    if (found !== wanted) return result(false, pickMessage(message, lang));
  }
  for (const check of checks) {
    if (check.errorText || check.output.trimEnd() !== check.expectedOutput) {
      const values = Object.entries(check.variables).map(([name, value]) => `${name} = ${value}`).join(", ");
      return result(false, text.boundary(values, check.expectedOutput, check.output.trimEnd()));
    }
  }
  return result(true, "");
}
