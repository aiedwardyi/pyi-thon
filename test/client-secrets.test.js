import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

function run(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

function getSourceFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return getSourceFiles(fullPath);
    if (/\.(js|jsx)$/.test(entry.name)) return [fullPath];
    return [];
  });
}

run("client source does not read build-time API key env vars", () => {
  const srcDir = fileURLToPath(new URL("../src/", import.meta.url));
  const sources = getSourceFiles(srcDir);

  for (const sourcePath of sources) {
    const source = readFileSync(sourcePath, "utf8");
    assert.doesNotMatch(
      source,
      /import\.meta\.env\.VITE_[A-Z0-9_]*API_KEY/,
      `Found a public API key env reference in ${sourcePath}`,
    );
  }
});
