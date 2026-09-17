import { expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

test("Rust depth fixtures, owner references and generated delivery stay aligned", () => {
  const result = spawnSync("python3", ["-m", "unittest", "discover", "-s", "tests", "-p", "rust_depth_test.py"], {
    cwd: resolve(import.meta.dir, ".."), encoding: "utf8",
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(result.stdout + result.stderr);
  expect(result.status).toBe(0);
});
