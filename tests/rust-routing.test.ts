import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const read = (path: string) => readFileSync(resolve(root, path), "utf8");

test("Rust is reachable through entry, planning, specialist roles and verification", () => {
  for (const path of ["skills/super-review/SKILL.md", "skills/super-review/references/workflow.md", "skills/super-review/references/verification.md", "adapters/claude/specialist.md", "adapters/opencode/agents/super-review-specialist.md"]) {
    expect(read(path)).toContain("languages/rust.md");
  }
  const context = read("skills/super-review/references/languages/rust.md");
  expect((context.match(/\| base lens \|/g) ?? []).length).toBe(8);
  expect((context.match(/\| conditional lens \|/g) ?? []).length).toBe(2);
  expect((context.match(/\| profile \|/g) ?? []).length).toBe(4);
});
