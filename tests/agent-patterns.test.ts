import { expect, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import { posix, resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const directory = resolve(root, "evals/agent-patterns");
const read = (name: string) => readFileSync(resolve(directory, name), "utf8");

type Packet = {
  id: string;
  skill: "super-review" | "defect-review" | "test-review" | "perf-review";
  language: "go" | "typescript" | "rust" | "java";
  lens?: string;
  question?: string;
  request: string;
  scope: string;
  diff?: string;
  files: Record<string, string>;
};

type GraderCase = {
  id: string;
  polarity: "report" | "retain";
  decision: string;
  checks: string[];
};

const { inputs } = JSON.parse(read("inputs.json")) as { inputs: Packet[] };
const suite = JSON.parse(read("cases.json")) as {
  kind: string;
  status: string;
  baseline_revision: string;
  contrast_pairs: [string, string][];
  cases: GraderCase[];
};

// Mechanical fixture and isolation integrity only; these do not measure model judgment.
test("agent-patterns packets and evaluator cases are isolated and symmetric across all four skills and languages", () => {
  expect(suite.kind).toBe("evaluator-only");
  expect(suite.status).toBe("PARTIAL");
  expect(suite.baseline_revision).toMatch(/^[0-9a-f]{40}$/);

  const ids = inputs.map(item => item.id);
  expect(new Set(ids).size).toBe(ids.length);
  expect(suite.cases.map(item => item.id).sort()).toEqual([...ids].sort());
  expect(suite.contrast_pairs.flat().sort()).toEqual([...ids].sort());

  expect(new Set(inputs.map(item => item.skill))).toEqual(
    new Set(["super-review", "defect-review", "test-review", "perf-review"]),
  );
  expect(new Set(inputs.map(item => item.language))).toEqual(
    new Set(["go", "typescript", "rust", "java"]),
  );

  const byId = new Map(suite.cases.map(item => [item.id, item]));
  const inputById = new Map(inputs.map(item => [item.id, item]));

  for (const [positive, negative] of suite.contrast_pairs) {
    expect(byId.get(positive)?.polarity).toBe("report");
    expect(byId.get(negative)?.polarity).toBe("retain");
    expect(inputById.get(positive)?.skill).toBe(inputById.get(negative)?.skill);
    expect(inputById.get(positive)?.language).toBe(inputById.get(negative)?.language);
  }

  for (const packet of inputs) {
    expect(packet.id).toMatch(/^AP\d{2}$/);
    expect(Object.keys(packet.files).length).toBeGreaterThan(0);
    for (const filePath of Object.keys(packet.files)) {
      expect(posix.isAbsolute(filePath)).toBe(false);
      expect(filePath.split("/").some(part => ["", ".", ".."].includes(part))).toBe(false);
      expect(posix.normalize(filePath)).toBe(filePath);
    }
    for (const forbidden of ["polarity", "decision", "checks", "contrast_pairs"]) {
      expect(Object.hasOwn(packet, forbidden)).toBe(false);
    }
    const grader = byId.get(packet.id)!;
    expect(grader.checks.length).toBeGreaterThan(0);
    const serialized = JSON.stringify(packet);
    expect(serialized.includes(grader.decision)).toBe(false);
    for (const check of grader.checks) expect(serialized.includes(check)).toBe(false);
  }
});

test("multi-language contexts exist in all four skills and agent-patterns stays out of packaged plugins", () => {
  for (const skill of ["super-review", "defect-review", "test-review", "perf-review"]) {
    for (const lang of ["go.md", "typescript.md", "rust.md", "java.md"]) {
      const text = readFileSync(resolve(root, "skills", skill, "references/languages", lang), "utf8");
      expect(text.length).toBeGreaterThan(200);
    }
  }
  const visit = (dir: string): void => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      expect(entry.name).not.toBe("agent-patterns");
      if (entry.isDirectory()) visit(resolve(dir, entry.name));
    }
  };
  for (const target of [
    "skills/super-review",
    "skills/defect-review",
    "skills/test-review",
    "skills/perf-review",
    "adapters/claude/plugin",
    "adapters/codex/super-review",
    "adapters/cursor/plugin",
    "adapters/antigravity/plugin",
  ]) {
    visit(resolve(root, target));
  }
});
