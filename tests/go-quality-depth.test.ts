import { test } from "bun:test";
import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// Fixture integrity only; Python is already used by the existing test suites.
test("Go quality depth: contrast packets and current language scope", async () => {
  const process = Bun.spawn(["python3", "tests/go_quality_depth_test.py"], {
    cwd: root,
    stdout: "pipe",
    stderr: "pipe",
  });
  const [exitCode, stdout, stderr] = await Promise.all([
    process.exited,
    new Response(process.stdout).text(),
    new Response(process.stderr).text(),
  ]);
  assert.equal(exitCode, 0, stdout + stderr);
}, 30_000);
