import assert from "node:assert/strict";

import { indentOnEnter } from "../src/lib/editorIndent.js";

function run(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

run("a colon indents the next line by four spaces", () => {
  const code = "for i in range:";
  const next = indentOnEnter(code, code.length, code.length);
  assert.equal(next.code, "for i in range:\n    ");
  assert.equal(next.cursor, next.code.length);
});

run("a colon with trailing spaces still indents", () => {
  const code = "for i in range:  ";
  const next = indentOnEnter(code, code.length, code.length);
  assert.equal(next.code, "for i in range:  \n    ");
});

run("an indented colon adds one more level", () => {
  const code = "    for i in range:";
  const next = indentOnEnter(code, code.length, code.length);
  assert.equal(next.code, "    for i in range:\n        ");
});

run("a normal line keeps its indent", () => {
  const code = "    x = 1";
  const next = indentOnEnter(code, code.length, code.length);
  assert.equal(next.code, "    x = 1\n    ");
});

run("enter replaces a selection", () => {
  const next = indentOnEnter("ab", 0, 2);
  assert.equal(next.code, "\n");
  assert.equal(next.cursor, 1);
});
