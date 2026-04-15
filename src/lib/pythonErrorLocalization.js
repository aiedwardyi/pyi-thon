const BRACKET_LABELS_KO = {
  "(": "여는 괄호 '('",
  "[": "여는 대괄호 '['",
  "{": "여는 중괄호 '{'",
};

function formatUnclosedTokenKo(token) {
  if (!token) return "기호";
  if (BRACKET_LABELS_KO[token]) return BRACKET_LABELS_KO[token];
  if (token === "'" || token === '"') return "따옴표";
  return `'${token}'`;
}

export function localizePythonError(errorMessage, lang) {
  if (!errorMessage || lang !== "ko") return errorMessage;

  let message = String(errorMessage).trim();

  const exactReplacements = [
    [
      "Infinite loop detected! Check your while loop - make sure the condition will eventually become False (e.g., increment your counter variable).",
      "무한 루프가 감지되었습니다. while 조건이 결국 False가 되도록 카운터 변수를 증가시키는지 확인하세요.",
    ],
    ["unexpected EOF while parsing", "코드가 끝나기 전에 구문이 먼저 끝났습니다"],
    ["invalid syntax", "문법이 올바르지 않습니다"],
    ["unexpected indent", "예상하지 못한 들여쓰기입니다"],
    ["expected an indented block", "들여쓰기된 코드 블록이 필요합니다"],
    ["unindent does not match any outer indentation level", "들여쓰기가 바깥 블록과 맞지 않습니다"],
    ["division by zero", "0으로 나눌 수 없습니다"],
    ["list index out of range", "리스트 인덱스 범위를 벗어났습니다"],
  ];

  const errorTypeReplacements = [
    ["SyntaxError:", "문법 오류:"],
    ["IndentationError:", "들여쓰기 오류:"],
    ["NameError:", "이름 오류:"],
    ["TypeError:", "타입 오류:"],
    ["ValueError:", "값 오류:"],
    ["ZeroDivisionError:", "0으로 나누기 오류:"],
    ["IndexError:", "인덱스 오류:"],
    ["KeyError:", "키 오류:"],
    ["AttributeError:", "속성 오류:"],
    ["ImportError:", "가져오기 오류:"],
    ["ModuleNotFoundError:", "모듈 찾기 오류:"],
  ];

  for (const [from, to] of errorTypeReplacements) {
    message = message.replace(from, to);
  }

  for (const [from, to] of exactReplacements) {
    message = message.replace(from, to);
  }

  message = message.replace(/['"](.+?)['"] was never closed/g, (_, token) => `${formatUnclosedTokenKo(token)}가 닫히지 않았습니다`);
  message = message.replace(/name ['"](.+?)['"] is not defined/g, (_, name) => `'${name}' 이름이 정의되지 않았습니다`);
  message = message.replace(/can only concatenate str \(not "(.+?)"\) to str/g, (_, typeName) => `문자열에는 문자열만 이어붙일 수 있습니다 ("${typeName}" 타입은 바로 이어붙일 수 없습니다)`);

  return message;
}
