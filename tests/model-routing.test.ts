import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const read = (path: string) => readFileSync(resolve(root, path), "utf8");

test("routing inputs and private judgments have matching distinct IDs", () => {
  const inputs = JSON.parse(read("evals/model-selection/routing-inputs.json")) as Array<{ id: string; task: string }>;
  const judgments = JSON.parse(read("evals/model-selection/routing-judgment.json")) as Array<{ id: string; model: string; effort: string }>;
  expect(inputs.map(x => x.id)).toEqual(judgments.map(x => x.id));
  expect(new Set(inputs.map(x => x.id)).size).toBe(inputs.length);
  expect(inputs.every(x => x.task.length > 0)).toBe(true);
  expect(JSON.stringify(inputs)).not.toMatch(/"(?:model|effort|expected|reason)"\s*:/);
});

test("active adapters expose the selected model family and native effort controls", () => {
  const codex = read("skills/super-review/references/harnesses/codex.md");
  expect(codex).toContain("`gpt-6-luna`");
  expect(codex).toContain("`gpt-6-sol`");
  expect(codex).toContain("An explicit user specialist model/effort choice overrides");
  expect(codex).not.toContain("gpt-5.6-terra");
  for (const path of ["adapters/claude/skill.md", "adapters/claude/orchestrator.md", "adapters/claude/specialist.md"]) {
    const match = /^---\n([\s\S]*?)\n---/.exec(read(path));
    const role = Bun.YAML.parse(match![1]) as Record<string, unknown>;
    expect(role.model).toBe("opus");
    expect(role.effort).toBeUndefined();
  }
});
