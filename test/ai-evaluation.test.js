import assert from "node:assert/strict";

import { evaluateWithAI } from "../src/lib/aiEvaluation.js";

async function run(name, fn) {
  try {
    await fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

await run("evaluateWithAI rejects an unknown provider before fetching", async () => {
  const originalFetch = globalThis.fetch;
  let fetchCalled = false;
  globalThis.fetch = async () => {
    fetchCalled = true;
    throw new Error("fetch should not be called for an unknown provider");
  };

  try {
    const result = await evaluateWithAI(
      "print('Hello')",
      { concept: "print()", task: "Print Hello", expectedOutput: "Hello", hint: "print('Hello')" },
      "test-key",
      "en",
      "unknown-provider",
    );

    assert.equal(fetchCalled, false);
    assert.equal(result.correct, false);
    assert.equal(result.feedback, "Something went wrong with the API. Try again, or switch to Offline mode.");
    assert.equal(result.fallbackToLocal, true);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

await run("evaluateWithAI marks authentication failures as local-fallback eligible", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => ({
    ok: false,
    status: 401,
  });

  try {
    const result = await evaluateWithAI(
      "print('Hello')",
      { concept: "print()", task: "Print Hello", expectedOutput: "Hello", hint: "print('Hello')" },
      "bad-key",
      "en",
      "openai",
    );

    assert.equal(result.correct, false);
    assert.equal(result.feedback, "Your API key is invalid or expired. Go to Settings to enter a new key, or switch to Offline mode.");
    assert.equal(result.fallbackToLocal, true);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
