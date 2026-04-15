import assert from "node:assert/strict";

import { localizePythonError } from "../src/lib/pythonErrorLocalization.js";

function run(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

run("localizePythonError keeps English errors unchanged outside Korean mode", () => {
  const message = "SyntaxError: '(' was never closed";
  assert.equal(localizePythonError(message, "en"), message);
});

run("localizePythonError translates common Korean syntax errors", () => {
  const message = localizePythonError("SyntaxError: '(' was never closed", "ko");
  assert.equal(message, "문법 오류: 여는 괄호 '('가 닫히지 않았습니다");
});

run("localizePythonError translates common Korean name errors", () => {
  const message = localizePythonError("NameError: name 'value' is not defined", "ko");
  assert.equal(message, "이름 오류: 'value' 이름이 정의되지 않았습니다");
});
