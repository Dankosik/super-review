import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const read = (path: string): string => readFileSync(resolve(root, path), "utf8");

// Static contract checks only: no external harness or model is executed here.
test("an explicit user request can route specialists to another harness", () => {
  const skill = read("skills/super-review/SKILL.md");
  expect(skill).toContain("[external specialists](references/harnesses/external.md)");
  expect(skill).not.toContain("Use only the active adapter");
  const external = read("skills/super-review/references/harnesses/external.md");
  for (const phrase of ["explicitly asks", "cannot.", "do not fall back silently", "fresh process per task", "../workflow.md#resolve-policy-and-coverage"]) {
    expect(external).toContain(phrase);
  }
  for (const adapter of ["claude", "codex", "cursor"]) {
    expect(read(`skills/super-review/references/harnesses/${adapter}.md`)).toContain("(external.md)");
  }
  expect(read("adapters/claude/orchestrator.md")).toContain("references/harnesses/external.md");
  expect(read("adapters/opencode/agents/super-review.md")).toContain("references/harnesses/external.md");
});

test("the external-harness reference reaches every generated package unchanged", () => {
  const source = read("skills/super-review/references/harnesses/external.md");
  for (const packageRoot of [
    "adapters/claude/plugin/resources/super-review",
    "adapters/codex/super-review/skills/super-review",
    "adapters/cursor/plugin/resources/super-review",
  ]) expect(read(packageRoot + "/references/harnesses/external.md")).toBe(source);
});
