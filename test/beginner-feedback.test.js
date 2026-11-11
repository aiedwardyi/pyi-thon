import assert from "node:assert/strict";

import { checkRep } from "../src/lib/beginnerFeedback.js";
import { SETS } from "../src/data/sets.js";
import { FIXTURES } from "./beginner-feedback-fixtures.js";

function run(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

const errorCases = [
  ["nameHello", { topic: 1, expected: "Hello" }, 1, "Line 1: Hello is text, so it needs quotes.", "1번째 줄: 글자 Hello에는 따옴표가 필요해요."],
  ["nameAlice", { topic: 2, expected: "Alice" }, 1, "Line 1: Alice is text, so it needs quotes.", "1번째 줄: 글자 Alice에는 따옴표가 필요해요."],
  ["typo", { topic: 2, expected: "x" }, 2, "Line 2: Python doesn't know nme. Check the spelling.", "2번째 줄: 파이썬이 nme 이름을 몰라요. 철자를 확인하세요."],
  ["typoCase", { topic: 2, expected: "x" }, 2, "Line 2: Python doesn't know Name. Check the spelling.", "2번째 줄: 파이썬이 Name 이름을 몰라요. 철자를 확인하세요."],
  ["undefinedVar", { topic: 2, expected: "1" }, 1, "Line 1: Python doesn't know total yet. Create it first.", "1번째 줄: 파이썬이 total 이름을 아직 몰라요. 먼저 만드세요."],
  ["useBeforeSet", { topic: 2, expected: "5" }, 1, "Line 1: Python doesn't know score yet. Create it first.", "1번째 줄: 파이썬이 score 이름을 아직 몰라요. 먼저 만드세요."],
  ["arithOperand", { topic: 2, expected: "11" }, 1, "Line 1: Python doesn't know total yet. Create it first.", "1번째 줄: 파이썬이 total 이름을 아직 몰라요. 먼저 만드세요."],
  ["concatOperand", { topic: 3, expected: "Hello, Sam" }, 1, "Line 1: Python doesn't know name yet. Create it first.", "1번째 줄: 파이썬이 name 이름을 아직 몰라요. 먼저 만드세요."],
  ["raisedSymbol", { topic: 2, expected: "Hi" }, 1, "Line 1: Python error: NameError. Read this line again.", "1번째 줄: Python 오류: NameError. 이 줄을 다시 읽어 보세요."],
  ["unquotedSam", { topic: 2, expected: "Hello, Sam" }, 1, "Line 1: Sam is text, so it needs quotes.", "1번째 줄: 글자 Sam에는 따옴표가 필요해요."],
  ["unquotedJane", { topic: 2, expected: "Jane" }, 1, "Line 1: Jane is text, so it needs quotes.", "1번째 줄: 글자 Jane에는 따옴표가 필요해요."],
  ["unquotedCat", { topic: 2, expected: "Cat" }, 1, "Line 1: Cat is text, so it needs quotes.", "1번째 줄: 글자 Cat에는 따옴표가 필요해요."],
  ["unquotedMay", { topic: 2, expected: "May" }, 1, "Line 1: May is text, so it needs quotes.", "1번째 줄: 글자 May에는 따옴표가 필요해요."],
  ["unquotedHi", { topic: 2, expected: "Hi" }, 1, "Line 1: Hi is text, so it needs quotes.", "1번째 줄: 글자 Hi에는 따옴표가 필요해요."],
  ["wrongCaseTotal", { topic: 2, expected: "Total: 10" }, 2, "Line 2: Python doesn't know Total. Check the spelling.", "2번째 줄: 파이썬이 Total 이름을 몰라요. 철자를 확인하세요."],
  ["typeConcat", { topic: 3, expected: "Alice is 25" }, 3, "Line 3: + can't join text and a number. Use str().", "3번째 줄: +로 글자와 숫자를 이을 수 없어요. str()을 쓰세요."],
  ["typeConcat", { topic: 2, expected: "Alice is 25" }, 3, "Line 3: + can't join text and a number.", "3번째 줄: +로 글자와 숫자를 이을 수 없어요."],
  ["typeConcatFloat", { topic: 3, expected: "a2.5" }, 1, "Line 1: + can't join text and a number. Use str().", "1번째 줄: +로 글자와 숫자를 이을 수 없어요. str()을 쓰세요."],
  ["typeIntStr", { topic: 3, expected: "5a" }, 1, "Line 1: + can't join text and a number. Use str().", "1번째 줄: +로 글자와 숫자를 이을 수 없어요. str()을 쓰세요."],
  ["typeIntStrFloat", { topic: 3, expected: "2.5a" }, 1, "Line 1: + can't join text and a number. Use str().", "1번째 줄: +로 글자와 숫자를 이을 수 없어요. str()을 쓰세요."],
  ["noColon", { topic: 5, expected: "pass" }, 2, "Line 2: this line needs a colon : at the end.", "2번째 줄: 이 줄 끝에 콜론 :이 필요해요."],
  ["goBang", { topic: 1, expected: "Ready?\nGo!" }, 2, "Line 2: Go! is text, so it needs quotes.", "2번째 줄: 글자 Go!에는 따옴표가 필요해요."],
  ["helloWorldBang", { topic: 1, expected: "Hello, World!" }, 1, "Line 1: Hello, World! is text, so it needs quotes.", "1번째 줄: 글자 Hello, World!에는 따옴표가 필요해요."],
  ["unterminated", { topic: 1, expected: "Hello" }, 1, "Line 1: a quote is missing at the end of the text.", "1번째 줄: 글자 끝에 따옴표가 빠졌어요."],
  ["paren", { topic: 1, expected: "Hello" }, 1, "Line 1: a ( is missing its ).", "1번째 줄: (에 맞는 )가 빠졌어요."],
  ["bracket", { topic: 15, expected: "[1, 2]" }, 1, "Line 1: a [ is missing its ].", "1번째 줄: [에 맞는 ]가 빠졌어요."],
  ["brace", { topic: 17, expected: "{}" }, 1, "Line 1: a { is missing its }.", "1번째 줄: {에 맞는 }가 빠졌어요."],
  ["expectedIndent", { topic: 5, expected: "x" }, 2, "Line 2: indent the line under the colon (4 spaces).", "2번째 줄: 콜론 아래 줄은 들여쓰기(공백 4칸)를 하세요."],
  ["expectedIndent", { topic: 4, expected: "x" }, 2, "Line 2: put 4 spaces before this line.", "2번째 줄: 이 줄 앞에 공백 4칸을 넣으세요."],
  ["unexpectedIndent", { topic: 5, expected: "a\nb" }, 2, "Line 2: this line shouldn't be indented.", "2번째 줄: 이 줄은 들여쓰기하면 안 돼요."],
  ["unexpectedIndent", { topic: 1, expected: "a\nb" }, 2, "Line 2: remove the spaces before this line.", "2번째 줄: 이 줄 앞의 공백을 지우세요."],
  ["unindent", { topic: 5, expected: "a\nb" }, 3, "Line 3: line this up with the lines above.", "3번째 줄: 위쪽 줄들과 줄을 맞추세요."],
  ["intLiteral", { topic: 4, expected: "5" }, 1, 'Line 1: int() needs digits, like "42".', '1번째 줄: int()에는 "42" 같은 숫자가 필요해요.'],
  ["zero", { topic: 11, expected: "1\n5" }, 2, "Line 2: you can't divide by zero.", "2번째 줄: 0으로 나눌 수 없어요."],
  ["index", { topic: 15, expected: "2" }, 2, "Line 2: that position is past the end of the list.", "2번째 줄: 그 위치는 리스트의 끝을 넘었어요."],
  ["key", { topic: 17, expected: "1" }, 2, "Line 2: the dict has no key 'k'.", "2번째 줄: 딕셔너리에 'k' 키가 없어요."],
  ["other", { topic: 22, expected: "5" }, 2, "Line 2: Python error: AttributeError. Read this line again.", "2번째 줄: Python 오류: AttributeError. 이 줄을 다시 읽어 보세요."],
  ["genericSyntax", { topic: 2, expected: "5" }, 1, "Line 1: Python error: SyntaxError. Read this line again.", "1번째 줄: Python 오류: SyntaxError. 이 줄을 다시 읽어 보세요."],
  ["inFunction", { topic: 13, expected: "1" }, 2, "Line 2: you can't divide by zero.", "2번째 줄: 0으로 나눌 수 없어요."],
];

for (const [key, extra, line, en, ko] of errorCases) {
  const { code, errorText } = FIXTURES[key];
  const args = { code, stdout: "", errorText, ...extra };
  for (const [lang, message] of [["en", en], ["ko", ko]]) {
    run(`checkRep ${key} topic ${extra.topic} (${lang})`, () => {
      const result = checkRep({ ...args, lang });
      assert.equal(result.passed, false);
      assert.equal(result.errorLine, line);
      assert.equal(result.message, message);
    });
  }
}

run("checkRep never leaks the Did you mean suggestion", () => {
  const { code, errorText } = FIXTURES.nameAlice;
  assert.ok(errorText.includes("Did you mean"));
  for (const lang of ["en", "ko"]) {
    assert.ok(!/did you mean|slice/i.test(checkRep({ code, stdout: "", errorText, expected: "Alice", lang }).message));
  }
});

run("checkRep reports the infinite-loop text without a line", () => {
  const errorText = "Infinite loop detected! Check your while loop - make sure the condition will eventually become False (e.g., increment your counter variable).";
  const base = { code: "while True:\n    pass\n", stdout: "", errorText, expected: "done", topic: 8 };
  const en = checkRep(base);
  assert.equal(en.message, "Your loop never stops. Change the counter inside it.");
  assert.equal(en.errorLine, null);
  assert.equal(checkRep({ ...base, lang: "ko" }).message, "반복이 끝나지 않아요. 안의 카운터를 바꾸세요.");
});

run("checkRep falls back to the detected-at line and drops the prefix when no line is known", () => {
  const detected = checkRep({ code: "a\nb\nc\nprint('x)", stdout: "", errorText: "SyntaxError: unterminated string literal (detected at line 4)", expected: "x" });
  assert.equal(detected.errorLine, 4);
  assert.equal(detected.message, "Line 4: a quote is missing at the end of the text.");
  const bare = checkRep({ code: "print(Hello)", stdout: "", errorText: "NameError: name 'Hello' is not defined", expected: "Hello" });
  assert.equal(bare.errorLine, null);
  assert.equal(bare.message, "Hello is text, so it needs quotes.");
});

run("checkRep keeps partial output while flagging the error", () => {
  const { code, errorText } = FIXTURES.zero;
  const result = checkRep({ code, stdout: "1", errorText, expected: "1\n5" });
  assert.deepEqual(result.lines, [{ text: "1", ok: true }]);
  assert.equal(result.missing, 1);
});

run("T4 r4 prints the wrong name", () => {
  const result = checkRep({ code: 'name = input("Name? ")\nprint("Hello, " + "name")\n', stdout: "Hello, name", errorText: null, expected: "Hello, Sam", topic: 4 });
  assert.equal(result.passed, false);
  assert.equal(result.errorLine, null);
  assert.equal(result.message, 'Line 1: expected "Hello, Sam", got "Hello, name".');
  assert.deepEqual(result.lines, [{ text: "Hello, name", ok: false }]);
  assert.equal(result.missing, 0);
  assert.equal(checkRep({ code: "", stdout: "Hello, name", errorText: "", expected: "Hello, Sam", topic: 4, lang: "ko" }).message, '1번째 줄: 기대 "Hello, Sam", 실제 "Hello, name".');
});

const outputCases = [
  ["nothing printed", "", "Hi", "Nothing printed yet. Use print().", "아직 출력된 게 없어요. print()를 쓰세요."],
  ["capital letters", "hello, world!", "Hello, World!", "Line 1: close! Check capital letters.", "1번째 줄: 거의 맞아요! 대소문자를 확인하세요."],
  ["punctuation", "Hello World", "Hello, World!", "Line 1: close! Check punctuation and spaces.", "1번째 줄: 거의 맞아요! 문장부호와 띄어쓰기를 확인하세요."],
  ["other difference", "Hi\nBye", "Hi\nCiao", 'Line 2: expected "Ciao", got "Bye".', '2번째 줄: 기대 "Ciao", 실제 "Bye".'],
  ["missing line", "a", "a\nb\nc", 'Missing line 2: "b".', '2번째 줄이 빠졌어요: "b".'],
  ["extra line", "a\nb\nc", "a\nb", "Line 3 wasn't expected.", "3번째 줄은 필요 없어요."],
];

for (const [name, stdout, expected, en, ko] of outputCases) {
  run(`checkRep output mismatch: ${name}`, () => {
    const base = { code: "print()", stdout, errorText: null, expected };
    const result = checkRep(base);
    assert.equal(result.passed, false);
    assert.equal(result.errorLine, null);
    assert.equal(result.message, en);
    assert.equal(checkRep({ ...base, lang: "ko" }).message, ko);
  });
}

run("checkRep reports lines, ok flags and missing count", () => {
  const result = checkRep({ code: "", stdout: "a\nX", errorText: null, expected: "a\nb\nc" });
  assert.deepEqual(result.lines, [{ text: "a", ok: true }, { text: "X", ok: false }]);
  assert.equal(result.missing, 1);
  const extra = checkRep({ code: "", stdout: "a\nb", errorText: null, expected: "a" });
  assert.deepEqual(extra.lines.map((line) => line.ok), [true, false]);
  assert.equal(extra.missing, 0);
});

run("checkRep ignores trailing spaces on each line", () => {
  const result = checkRep({ code: "", stdout: "a  \nb", errorText: null, expected: "a\nb  " });
  assert.equal(result.passed, true);
});

run("checkRep ignores the trailing newline from print()", () => {
  const result = checkRep({ code: 'print("Hi")', stdout: "Hi\n", errorText: null, expected: "Hi\n" });
  assert.equal(result.passed, true);
  assert.deepEqual(result.lines, [{ text: "Hi", ok: true }]);
});

run("checkRep passes a correct run with an empty message", () => {
  const result = checkRep({ code: 'print("Hi")', stdout: "Hi", errorText: null, expected: "Hi" });
  assert.deepEqual(result, { passed: true, lines: [{ text: "Hi", ok: true }], missing: 0, errorLine: null, message: "" });
});

const rules = {
  code: 'print("hi")',
  stdout: "hi",
  errorText: null,
  expected: "hi",
  mustUse: [{ pattern: "input\\(", message: "Use input()." }, { pattern: "if ", message: "Use if." }],
  mustNotUse: [{ pattern: "print", message: { en: "No print.", ko: "print 금지." } }],
};

for (const [topic, solution] of [
  [15, 'fruits = ["apple", "banana", "cherry"]\nprint(fruits[1])'],
  [17, 'person = {"name": "Alice", "age": 25}\nprint(person["name"])'],
]) {
  run(`checkRep finds topic ${topic} constructs after comments and strings`, () => {
    const rep = SETS.find((set) => set.id === topic).reps[0];
    for (const prefix of [`# ${solution.split("\n")[0]}\n`, `'''${solution}'''\n`, `f'''${topic === 15 ? "[example]" : "{{example}}"}'''\n`]) {
      for (const lang of ["en", "ko"]) {
        const input = { stdout: rep.expectedOutput, expected: rep.expectedOutput, mustUse: rep.mustUse, topic, lang };
        assert.equal(checkRep({ ...input, code: prefix + solution }).passed, true, prefix);
        assert.equal(checkRep({ ...input, code: `${prefix}print(${JSON.stringify(rep.expectedOutput)})` }).passed, false, prefix);
      }
    }
  });
}

run("checkRep reports the first failing mustUse before mustNotUse", () => {
  const result = checkRep(rules);
  assert.equal(result.passed, false);
  assert.equal(result.message, "Use input().");
  assert.equal(result.errorLine, null);
  assert.equal(checkRep({ ...rules, mustUse: rules.mustUse.slice(1) }).message, "Use if.");
});

run("checkRep picks { en, ko } messages by lang and falls back to en", () => {
  const only = { ...rules, mustUse: [] };
  assert.equal(checkRep(only).message, "No print.");
  assert.equal(checkRep({ ...only, lang: "ko" }).message, "print 금지.");
  const enOnly = { ...only, mustNotUse: [{ pattern: "print", message: { en: "No print." } }], lang: "ko" };
  assert.equal(checkRep(enOnly).message, "No print.");
});

run("checkRep passes when mustUse is present and mustNotUse is absent", () => {
  const result = checkRep({ ...rules, code: "if input():\n    pass", mustNotUse: [{ pattern: "print", message: "No print." }], mustUse: [{ pattern: "input\\(", message: "Use input()." }] });
  assert.equal(result.passed, true);
  assert.equal(result.message, "");
});

run("checkRep checks mustUse only when the output matches", () => {
  const result = checkRep({ ...rules, stdout: "bye" });
  assert.equal(result.message, 'Line 1: expected "hi", got "bye".');
  const withError = checkRep({ ...rules, ...FIXTURES.nameHello, stdout: "" });
  assert.equal(withError.message, "Line 1: Hello is text, so it needs quotes.");
});

run("boundary checks show the exception when output matches", () => {
  const check = { variables: { age: 17 }, expectedOutput: "kid", output: "kid\n", errorText: 'Traceback (most recent call last):\n  File "<exec>", line 5, in <module>\nZeroDivisionError: division by zero' };
  const result = checkRep({ code: "print('kid')", stdout: "kid", expected: "kid", checks: [check] });
  assert.equal(result.message, 'With age = 17: expected "kid", got "ZeroDivisionError: division by zero".');
});

run("construct checks accept whitespace in pilot and legacy calls", () => {
  for (const [topic, rep, code] of [
    [2, 1, 'name = "Alice"\nprint ( name )'],
    [2, 2, 'city = "Seoul"\nprint\t(\n city\n)'],
    [3, 3, 'score = 90\nprint ("Score: " + str ( score ))'],
    [4, 2, 'color = input ( "Color? " )\nprint ( color )'],
    [16, 1, 'nums = [1, 2, 3]\nnums.append (4)\nprint (len (nums))'],
    [18, 1, 'scores = {"math": 90, "science": 85}\nfor subject, score in scores.items ( ):\n    print (subject + ": " + str (score))'],
  ]) {
    const task = SETS[topic - 1].reps[rep - 1];
    assert.equal(checkRep({ ...task, code, stdout: task.expectedOutput, expected: task.expectedOutput }).passed, true, `${topic}/${rep}`);
  }
});

run("comments and strings cannot stand in for executable constructs", () => {
  const task = SETS[1].reps[1];
  for (const code of [
    '# city = "Seoul"\n# print(city)\nprint("Seoul")',
    'text = "city = print(city)"\nprint("Seoul")',
    'text = """city = "Seoul"\nprint(city)"""\nprint("Seoul")',
    'text = f"city = print(city)"\nprint("Seoul")',
  ]) {
    assert.equal(checkRep({ ...task, code, stdout: "Seoul", expected: "Seoul" }).passed, false);
  }
  const input = SETS[3].reps[1];
  assert.equal(checkRep({ ...input, code: '# blue\nprint(input())', stdout: "blue", expected: "blue" }).passed, true);
});

run("formatted string checks accept Python prefixes and reject plain text", () => {
  const task = SETS[27].reps[0];
  for (const prefix of ["f", "F", "rf", "Rf", "rF", "RF", "fr", "fR", "Fr", "FR"]) {
    const code = `language = "Python"\nversion = 3\nprint (${prefix}"{language} version {version} is awesome!")`;
    assert.equal(checkRep({ ...task, code, stdout: task.expectedOutput, expected: task.expectedOutput }).passed, true, prefix);
  }
  const code = 'text = "f\'example\'"\nprint("Python version 3 is awesome!")';
  assert.equal(checkRep({ ...task, code, stdout: task.expectedOutput, expected: task.expectedOutput }).passed, false);
});
