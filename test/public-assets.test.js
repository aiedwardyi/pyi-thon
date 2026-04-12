import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL("..", import.meta.url));
const publicDir = path.join(rootDir, "public");

function run(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

run("web manifest is valid and references existing public assets", () => {
  const manifestPath = path.join(publicDir, "manifest.webmanifest");
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

  assert.equal(manifest.name, "Pyi-thon");
  assert.ok(Array.isArray(manifest.icons));
  assert.ok(manifest.icons.length >= 3);

  for (const icon of manifest.icons) {
    assert.ok(icon.src.startsWith("/"), `Icon src should be root-relative: ${icon.src}`);
    const assetPath = path.join(publicDir, icon.src.slice(1));
    assert.equal(existsSync(assetPath), true, `Missing manifest asset: ${icon.src}`);
  }
});
