import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const read = (path: string): string => readFileSync(resolve(root, path), "utf8");
const resourcePaths = [
  "references/workflow.md",
  "references/harnesses/codex.md",
  "references/harnesses/cursor.md",
];

// Static contract/fixture checks only: no scheduler or model is executed here.
test("concurrency has one shared default and no smaller Codex/Cursor cap", () => {
  const workflow = read("skills/super-review/references/workflow.md");
  expect(workflow).toContain("eight active child tasks by default");
  expect(workflow).toContain("An explicit user concurrency limit overrides");
  expect(workflow).toContain("refill from the pending queue without waiting");
  expect(workflow).toContain("When native calls only return as a complete batch");
  for (const adapter of ["codex", "cursor"]) {
    const text = read(`skills/super-review/references/harnesses/${adapter}.md`);
    expect(text).toContain("../workflow.md#resolve-policy-and-coverage");
    expect(text).not.toMatch(/at most (?:three|3)|groups of (?:three|3)/i);
  }
  expect(workflow).not.toContain("four simultaneous tasks");
});

test("concurrency changes reach all generated native packages unchanged", () => {
  for (const path of resourcePaths) {
    const source = read("skills/super-review/" + path);
    for (const packageRoot of [
      "adapters/claude/plugin/resources/super-review",
      "adapters/codex/super-review/skills/super-review",
      "adapters/cursor/plugin/resources/super-review",
    ]) expect(read(packageRoot + "/" + path)).toBe(source);
  }
});

test("scheduling inputs and private graders match without leaking expectations", () => {
  const inputs = JSON.parse(read("evals/native-host/concurrency-inputs.json")) as Array<{
    id: string; request: string; host: { available_child_slots: number | null };
    active: string[]; ready: string[];
  }>;
  const cases = JSON.parse(read("evals/native-host/concurrency-cases.json")) as Array<{
    id: string; checks: string[];
  }>;
  const ids = inputs.map(input => input.id);
  expect(new Set(ids).size).toBe(inputs.length);
  expect(cases.map(item => item.id)).toEqual(ids);
  for (const input of inputs) {
    expect(input.request.length).toBeGreaterThan(0);
    const tasks = [...input.active, ...input.ready];
    expect(new Set(tasks).size).toBe(tasks.length);
    const slots = input.host.available_child_slots;
    expect(slots === null || (Number.isInteger(slots) && slots >= 0)).toBe(true);
  }
  expect(JSON.stringify(inputs)).not.toMatch(/"(?:checks|expected|expect)"\s*:/);
  for (const item of cases) expect(item.checks.length).toBeGreaterThan(0);
  expect(read("evals/native-host/concurrency.md")).toContain("Behavioral comparison: NOT RUN");
});
