import { test } from "bun:test";
import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// Python is already required for packaging; this suite adds no dependency.
// It exercises disposable Git and fixture integrity, never model judgments.
test("source evidence: fixture integrity and native Git semantics", async () => {
  const process = Bun.spawn(["python3", "tests/source_evidence_test.py"], {
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
