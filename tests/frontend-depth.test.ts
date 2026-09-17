import { test } from "bun:test";
import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// No fixture code or model is executed; Python is already required for packaging.
test("frontend depth: owners, contrast packets and native delivery", async () => {
  const process = Bun.spawn(["python3", "tests/frontend_depth_test.py"], {
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
