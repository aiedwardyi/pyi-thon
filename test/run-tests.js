import assert from "node:assert/strict";

import { buildDiffFeedback, buildMismatchFeedback } from "../src/offlineEvaluation.js";
import "./ai-evaluation.test.js";
import "./client-secrets.test.js";
import "./hint-formatting.test.js";
import "./public-assets.test.js";

const STRINGS = {
  offlineLineDiff: 'Line {line}: got "{got}" but expected "{exp}".',
  offlineExtraLines: "Your output has {n} extra line(s).",
  offlineMissingLines: "Your output is missing {n} line(s).",
  sampleInputUsed: "Sample input used for this run",
  offlineInputMismatch: "This lesson is checked with built-in sample input, so you will not type interactively in the runner.",
};

const t = (key) => STRINGS[key];

function run(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

run("buildDiffFeedback reports the first changed line", () => {
  const message = buildDiffFeedback("Hello, Alice", "Hello, Sam", t);
  assert.equal(message, 'Line 1: got "Hello, Alice" but expected "Hello, Sam".');
});

run("buildMismatchFeedback includes sample input context", () => {
  const message = buildMismatchFeedback({
    actual: "Hello, Alice",
    expected: "Hello, Sam",
    sampleInput: "Sam",
    t,
    prefix: "Your code uses the right concept! But the output doesn't match.",
  });

  assert.match(message, /built-in sample input/);
  assert.match(message, /Sample input used for this run:\nSam/);
  assert.match(message, /Hello, Alice/);
  assert.match(message, /Hello, Sam/);
});

run("buildMismatchFeedback skips sample input note when absent", () => {
  const message = buildMismatchFeedback({
    actual: "14",
    expected: "15",
    sampleInput: "",
    t,
    prefix: "Almost!",
  });

  assert.equal(message, 'Almost!\n\nLine 1: got "14" but expected "15".');
});
