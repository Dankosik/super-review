import { expect, test } from "bun:test";
import { readFileSync, readdirSync } from "node:fs";
import { resolve, relative, isAbsolute } from "node:path";

const root = resolve(import.meta.dir, "..");
const evaluation = resolve(root, "evals/go");
const suite = JSON.parse(readFileSync(resolve(evaluation, "prompt-context-cases.json"), "utf8")) as {
  fixture_root: string;
  contrast_pairs: string[][];
  cases: Array<{
    id: string;
    stage: string;
    input: { packet: string; section: string; initial_source: string[]; available_source: string[]; initial_excerpts?: Array<{ path: string; start_line: number; end_line: number }> };
    expect: string[];
  }>;
};
const fixture = resolve(evaluation, suite.fixture_root);

// These checks validate fixture and package integrity, never a model's judgment.
test("prompt/context expectations map one-to-one to raw stage sections", () => {
  const ids = suite.cases.map(item => item.id);
  expect(new Set(ids).size).toBe(ids.length);
  const packet = readFileSync(resolve(evaluation, "packets/prompt-context.md"), "utf8");
  const sections = [...packet.matchAll(/^## (P\d+)$/gm)].map(match => match[1]);
  expect([...sections].sort()).toEqual([...ids].sort());
  for (const item of suite.cases) {
    expect(item.input.packet).toBe("packets/prompt-context.md");
    expect(item.input.section).toBe(item.id);
    expect(item.stage.length).toBeGreaterThan(0);
    expect(item.expect.length).toBeGreaterThan(0);
  }
});

test("fixture access lists contain existing source without preloading required reads", () => {
  for (const item of suite.cases) {
    const initial = item.input.initial_source;
    const available = item.input.available_source;
    expect(new Set([...initial, ...available]).size).toBe(initial.length + available.length);
    for (const excerpt of item.input.initial_excerpts ?? []) {
      expect(available).toContain(excerpt.path);
      const lines = readFileSync(resolve(fixture, excerpt.path), "utf8").trimEnd().split("\n");
      expect(excerpt.start_line).toBeGreaterThan(0);
      expect(excerpt.end_line >= excerpt.start_line && excerpt.end_line < lines.length).toBe(true);
    }
    for (const source of [...initial, ...available]) {
      const target = resolve(fixture, source);
      const local = relative(fixture, target);
      expect(isAbsolute(local) || local === ".." || local.startsWith("../")).toBe(false);
      expect(source.endsWith(".go") && !source.endsWith("_test.go")).toBe(true);
      expect(readFileSync(target, "utf8").trim().length).toBeGreaterThan(0);
    }
  }
});

test("evaluator contrast pairs refer to distinct defined cases", () => {
  const ids = new Set(suite.cases.map(item => item.id));
  for (const pair of suite.contrast_pairs) {
    expect(pair.length).toBe(2);
    expect(new Set(pair).size).toBe(2);
    for (const id of pair) expect(ids.has(id)).toBe(true);
  }
});

test("all canonical skill bytes and Claude roles match generated payloads", () => {
  const skill = resolve(root, "skills/super-review");
  const visit = (directory: string): void => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const file = resolve(directory, entry.name);
      if (entry.isDirectory()) { visit(file); continue; }
      const path = relative(skill, file);
      for (const packageRoot of [
        "adapters/claude/plugin/resources/super-review",
        "adapters/codex/super-review/skills/super-review",
      ]) {
        expect(readFileSync(file).equals(readFileSync(resolve(root, packageRoot, path)))).toBe(true);
      }
    }
  };
  visit(skill);
  for (const role of ["orchestrator", "specialist"]) {
    expect(readFileSync(resolve(root, `adapters/claude/${role}.md`)).equals(
      readFileSync(resolve(root, `adapters/claude/plugin/agents/${role}.md`)),
    )).toBe(true);
  }
});
