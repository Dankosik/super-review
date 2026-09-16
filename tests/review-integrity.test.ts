import { test } from "bun:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, posix, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const directory = resolve(root, "evals/review-integrity");
const read = (name: string): string => readFileSync(resolve(directory, name), "utf8");
type Source = { path: string; content: string; sha256: string };
type Receipt = { task_id: string; snapshot: string; inspected: string[] };
type Input = { id: string; stage: string; source_keys: string[]; request: string;
  state: { snapshot: string; inventory?: string[];
    plan?: { task_id: string; members: string[] }[]; collected_results?: Receipt[] } };
type Anchor = { snapshot: string; path: string; symbol: string; line: number; quote: string };
const { snapshots } = JSON.parse(read("sources.json")) as {
  snapshots: Record<string, { files: Source[] }>;
};
const inputs = JSON.parse(read("inputs.json")) as Input[];
const suite = JSON.parse(read("cases.json")) as {
  kind: string; baseline_revision: string; contrast_pairs: string[][];
  cases: { id: string; checks: string[]; expected_anchors: Anchor[] }[];
};
const files = (key: string): Source[] => {
  assert.ok(Object.hasOwn(snapshots, key), `Unknown snapshot ${key}`);
  return snapshots[key]!.files;
};

// These checks validate controlled inputs and delivery, not model behavior.
test("review-integrity probes have isolated input/grader identities and contrasts", () => {
  const ids = inputs.map(input => input.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(suite.kind, "evaluator-only");
  assert.match(suite.baseline_revision, /^[0-9a-f]{40}$/);
  assert.deepEqual(suite.cases.map(item => item.id).sort(), [...ids].sort());
  assert.deepEqual(suite.contrast_pairs.flat().sort(), [...ids].sort());
  for (const pair of suite.contrast_pairs) assert.equal(pair.length, 2);
  for (const input of inputs) {
    assert.match(input.id, /^I\d{2}$/);
    assert.ok(input.request && ["collection", "positioning"].includes(input.stage));
    assert.equal(new Set(input.source_keys).size, input.source_keys.length);
    assert.ok(input.source_keys.includes(input.state.snapshot));
    for (const key of input.source_keys) files(key);
    assert.equal(Object.hasOwn(input, "checks"), false);
    assert.equal(Object.hasOwn(input, "expected_anchors"), false);
    const grader = suite.cases.find(item => item.id === input.id)!;
    assert.ok(grader.checks.length);
    for (const check of grader.checks) assert.equal(JSON.stringify(input).includes(check), false);
  }
});

test("controlled snapshots have safe unique paths and exact UTF-8 byte identities", () => {
  for (const { files: entries } of Object.values(snapshots)) {
    assert.ok(entries.length);
    assert.equal(new Set(entries.map(file => file.path)).size, entries.length);
    for (const file of entries) {
      assert.equal(posix.isAbsolute(file.path), false);
      assert.equal(file.path.includes("\\") || file.path.includes(":"), false);
      assert.equal(file.path.split("/").some(part => ["", ".", ".."].includes(part)), false);
      assert.equal(posix.normalize(file.path), file.path);
      assert.match(file.sha256, /^[0-9a-f]{64}$/);
      assert.equal(createHash("sha256").update(file.content, "utf8").digest("hex"), file.sha256);
    }
  }
});

test("collection inputs reference real members without repairing intentional receipt gaps", () => {
  for (const input of inputs.filter(item => item.stage === "collection")) {
    const current = new Set(files(input.state.snapshot).map(file => file.path));
    assert.deepEqual([...current].sort(), [...input.state.inventory!].sort());
    const tasks = input.state.plan!;
    assert.equal(new Set(tasks.map(task => task.task_id)).size, tasks.length);
    assert.deepEqual([...new Set(tasks.flatMap(task => task.members))].sort(), [...current].sort());
    for (const receipt of input.state.collected_results!) {
      assert.ok(tasks.some(task => task.task_id === receipt.task_id));
      assert.ok(input.source_keys.includes(receipt.snapshot));
      const available = new Set(files(receipt.snapshot).map(file => file.path));
      for (const path of receipt.inspected) assert.ok(available.has(path));
    }
  }
});

test("grader anchor expectations match actual containing symbols and source lines", () => {
  for (const item of suite.cases) {
    const input = inputs.find(candidate => candidate.id === item.id)!;
    for (const anchor of item.expected_anchors) {
      assert.ok(input.source_keys.includes(anchor.snapshot));
      const source = files(anchor.snapshot).find(file => file.path === anchor.path)!;
      assert.ok(source, `Missing ${anchor.snapshot}:${anchor.path}`);
      const lines = source.content.split("\n");
      assert.ok(Number.isInteger(anchor.line) && anchor.line > 0 && anchor.line <= lines.length);
      assert.equal(lines[anchor.line - 1]!.trim(), anchor.quote);
      // These fixtures intentionally use simple top-level function declarations.
      const preceding = lines.slice(0, anchor.line).join("\n");
      const symbols = [...preceding.matchAll(/^export function (\w+)\(/gm)];
      assert.equal(symbols.at(-1)?.[1], anchor.symbol);
    }
  }
});

test("changed policy resources have byte-identical native delivery copies", () => {
  for (const path of ["references/workflow.md", "references/verification.md",
    "assets/finding-template.md", "assets/report-template.md"]) {
    const canonical = readFileSync(resolve(root, "skills/super-review", path));
    for (const target of ["adapters/claude/plugin/resources/super-review",
      "adapters/codex/super-review/skills/super-review"]) {
      assert.deepEqual(readFileSync(resolve(root, target, path)), canonical);
    }
  }
});

test("review-integrity inputs and graders stay outside installed packages", () => {
  const visit = (path: string): void => {
    for (const entry of readdirSync(path, { withFileTypes: true })) {
      assert.notEqual(entry.name, "review-integrity");
      if (entry.isDirectory()) visit(resolve(path, entry.name));
    }
  };
  for (const target of ["skills/super-review", "adapters/claude/plugin", "adapters/codex/super-review"]) {
    visit(resolve(root, target));
  }
});
