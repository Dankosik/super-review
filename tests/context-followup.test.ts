import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { isAbsolute, relative, resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const read = (path: string): string => readFileSync(resolve(root, path), "utf8");
type Source = { path: string; revision: "B" | "H" };
const suite = JSON.parse(read("evals/go/context-followup-cases.json")) as {
  packet: string;
  contrast_pairs: string[][];
  cases: Array<{ id: string; stage: string; initial_source: Source[];
    available_source: Source[]; expect: string[] }>;
};

// Integrity checks only: no test below measures the reviewer's decisions.
test("follow-up stage cases match raw sections without sharing expectations", () => {
  const ids = suite.cases.map(item => item.id);
  const packet = read("evals/go/" + suite.packet);
  const sections = [...packet.matchAll(/^## (C\d+)$/gm)]
    .map(match => match[1]);
  expect(new Set(ids).size).toBe(ids.length);
  expect([...sections].sort()).toEqual([...ids].sort());
  for (const item of suite.cases) {
    expect(item.stage.length).toBeGreaterThan(0);
    expect(item.expect.length).toBeGreaterThan(0);
    const body = packet.split("## " + item.id + "\n")[1]!.split("\n## ")[0]!;
    expect(body.match(/\bC\d{2}\b/g) ?? []).toEqual([]);
  }
  for (const pair of suite.contrast_pairs) {
    expect(pair.length).toBe(2);
    expect(new Set(pair).size).toBe(2);
    for (const id of pair) expect(ids).toContain(id);
  }
});

test("follow-up source setup preserves revision and retrieval boundaries", () => {
  for (const item of suite.cases) {
    const sources = [...item.initial_source, ...item.available_source];
    const identities = sources.map(source => source.revision + ":" + source.path);
    expect(new Set(identities).size).toBe(identities.length);
    for (const source of sources) {
      const local = relative(root, resolve(root, source.path));
      expect(isAbsolute(local) || local === ".." || local.startsWith("../")).toBe(false);
      expect(["B", "H"]).toContain(source.revision);
      expect(source.path.endsWith(".go") && !source.path.endsWith("_test.go")).toBe(true);
      expect(read(source.path).trim().length).toBeGreaterThan(0);
    }
  }
});
