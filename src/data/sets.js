import { LEVELS, getLocalizedLevel } from "./levels.js";
import { PILOT_SETS } from "./pilotSets.js";

const rule = (pattern, en, ko) => ({ pattern, message: { en, ko } });
const LEGACY_ANSWERS = new Set([7, 8, 9, 10, 11, 12, 13, 14, 16, 18, 19, 21, 22, 24, 26, 27, 28, 29, 30]);

// Today's construct checks for topics 6-30, as mustUse rules.
const LEGACY_MUST_USE = {
  6: [rule("elif", "Use elif for multiple conditions.", "여러 조건에는 elif를 사용하세요.")],
  7: [rule("for ", "Use a for loop with range().", "range()와 함께 for 반복문을 사용하세요."), rule("range", "Use a for loop with range().", "range()와 함께 for 반복문을 사용하세요.")],
  8: [rule("while ", "Use a while loop for this task.", "이 과제에는 while 반복문을 사용하세요.")],
  9: [rule("while ", "Use a while loop with input().", "input()과 함께 while 반복문을 사용하세요."), rule("input\\(", "Use a while loop with input().", "input()과 함께 while 반복문을 사용하세요.")],
  10: [rule("for |while ", "Use a loop to calculate the sum.", "합계를 계산하려면 반복문을 사용하세요.")],
  11: [rule("/", "Use / to divide for the average.", "평균을 구하려면 /를 사용하세요.")],
  12: [rule("while", 'Use "while True" with "break".', '"while True"와 "break"를 사용하세요.'), rule("break", 'Use "while True" with "break".', '"while True"와 "break"를 사용하세요.'), rule("input\\(", "Use input() to read values.", "input()을 사용하여 값을 읽으세요.")],
  13: [rule("def ", "Define a function using def.", "def를 사용하여 함수를 정의하세요."), rule("return", "Use return to send back the result.", "return을 사용하여 결과를 반환하세요.")],
  14: [rule("def ", "Define a function using def.", "def를 사용하여 함수를 정의하세요."), rule("def\\s+greet\\s*\\(", 'Name your function "greet".', '함수 이름을 "greet"로 지정하세요.'), rule("return", "Use return.", "return을 사용하세요.")],
  15: [rule("\\[[\\s\\S]*\\]", "Create a list using [ ] brackets.", "[ ] 괄호를 사용하여 리스트를 만드세요.")],
  16: [rule("append", "Use .append().", ".append()를 사용하세요."), rule("len\\(", "Use len().", "len()을 사용하세요.")],
  17: [rule("\\{[\\s\\S]*\\}|dict\\(", "Create a dictionary using { } or dict().", "{ } 또는 dict()를 사용하여 딕셔너리를 만드세요.")],
  18: [rule("\\.items\\(\\)", "Use .items() to loop through key-value pairs.", ".items()를 사용하여 키-값 쌍을 순회하세요."), rule("for ", "Use a for loop.", "for 반복문을 사용하세요.")],
  19: [rule("while", "Use a while loop with input() and .append().", "while 반복문, input(), .append()를 사용하세요."), rule("input\\(", "Use a while loop with input() and .append().", "while 반복문, input(), .append()를 사용하세요."), rule("append", "Use a while loop with input() and .append().", "while 반복문, input(), .append()를 사용하세요.")],
  20: [rule("open\\(", "Use open() to work with files.", "open()을 사용하여 파일을 다루세요.")],
  21: [rule("try", "Use try/except to handle the error.", "try/except를 사용하여 에러를 처리하세요."), rule("except", "Use try/except to handle the error.", "try/except를 사용하여 에러를 처리하세요.")],
  22: [rule("class ", "Use the class keyword.", "class 키워드를 사용하세요."), rule("__init__", "Add an __init__ method.", "__init__ 메서드를 추가하세요."), rule("self", "Use self.", "self를 사용하세요.")],
  23: [rule("import json", "Import json first.", "먼저 json을 임포트하세요."), rule("json\\.dumps", "Use json.dumps() and json.loads().", "json.dumps()와 json.loads()를 사용하세요."), rule("json\\.loads", "Use json.dumps() and json.loads().", "json.dumps()와 json.loads()를 사용하세요.")],
  24: [rule("import math", "Import math.", "math를 임포트하세요."), rule("def ", "Define a function.", "함수를 정의하세요."), rule("math\\.pi", "Use math.pi.", "math.pi를 사용하세요.")],
  25: [rule("def ", "Define a function.", "함수를 정의하세요."), rule("sum\\(", "Use sum() and len().", "sum()과 len()을 사용하세요."), rule("len\\(", "Use sum() and len().", "sum()과 len()을 사용하세요.")],
  26: [rule("\\[.+for .+ in .+\\]", "Use a list comprehension: [expr for x in iterable].", "리스트 컴프리헨션을 사용하세요: [표현식 for x in 반복가능].")],
  27: [rule("\\.split\\(", "Use .split() and .join().", ".split()과 .join()을 사용하세요."), rule("\\.join\\(", "Use .split() and .join().", ".split()과 .join()을 사용하세요.")],
  28: [rule("f\"|f'", 'Use an f-string: f"...{variable}..."', 'f-string을 사용하세요: f"...{변수}..."')],
  29: [rule("lambda", "Use a lambda function.", "lambda 함수를 사용하세요."), rule("map\\(", "Use map().", "map()을 사용하세요.")],
  30: [rule("for ", "Use a for loop.", "for 반복문을 사용하세요."), rule("if ", "Use an if statement to filter.", "if문을 사용하여 필터링하세요.")],
};

function legacySet(level) {
  const ko = getLocalizedLevel(level, "ko");
  return {
    id: level.id,
    phase: level.phase,
    legacy: true,
    title: { en: level.title, ko: ko.title },
    see: { text: { en: level.concept, ko: ko.concept } },
    reps: [{
      kind: "write",
      goal: { en: level.task, ko: ko.task },
      starterCode: level.starterCode,
      expectedOutput: level.expectedOutput,
      simulatedInput: level.simulatedInput || null,
      hints: [{ type: LEGACY_ANSWERS.has(level.id) ? "answer" : "nudge", text: { en: level.hint, ko: ko.hint } }],
      starterError: null,
      mustUse: LEGACY_MUST_USE[level.id] || [],
      mustNotUse: [],
    }],
  };
}

export const SETS = LEVELS.map((level) => {
  const pilot = PILOT_SETS.find((set) => set.id === level.id);
  return pilot ? {
    ...pilot, phase: level.phase, legacy: false,
    reps: pilot.reps.map((rep) => ({ ...rep, hints: [
      { type: "nudge", text: rep.hints[0] },
      { type: "example", text: rep.hints[1] },
      { type: "answer", text: rep.hints[2] },
    ] })),
  } : legacySet(level);
});

export function pick(value, lang) {
  if (value == null || typeof value === "string") return value ?? "";
  return value[lang] ?? value.en;
}
