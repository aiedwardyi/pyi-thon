import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { formatHintText } from "../src/hintFormatting.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appSource = fs.readFileSync(path.join(__dirname, "..", "src", "App.jsx"), "utf8");

function run(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

function extractHintStrings(source) {
  const hints = [];
  const hintPattern = /hint:\s*(['"])((?:\\.|(?!\1).)*)\1,\s*(?:starterCode|explanation):/gs;
  let match;

  while ((match = hintPattern.exec(source)) !== null) {
    hints.push(match[2]);
  }

  return hints;
}

run("formatHintText converts escaped newlines into real line breaks", () => {
  assert.equal(
    formatHintText("count = 1\\nwhile count <= 5:\\n    print(count)"),
    "count = 1\nwhile count <= 5:\n    print(count)",
  );
});

run("all stored hints normalize without leaving raw escaped newlines behind", () => {
  const hints = extractHintStrings(appSource);

  assert.ok(hints.length >= 50, `expected to find many hints, found ${hints.length}`);

  for (const hint of hints) {
    const formatted = formatHintText(hint);
    assert.ok(!formatted.includes("\\n"), `hint still contains raw \\n after formatting: ${hint}`);
  }
});
