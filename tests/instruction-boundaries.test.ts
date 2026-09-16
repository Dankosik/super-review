import { test } from "bun:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, isAbsolute, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const evaluation = resolve(root, "evals/instruction-boundaries");
const read = (path: string): string => readFileSync(resolve(evaluation, path), "utf8");
type Case = { id: string; stage: string;
  input: { packet: string; section: string; source: string[] }; expect: string[] };
const suite = JSON.parse(read("cases.json")) as {
  status: string; base_revision: string; source_manifest: string;
  contrast_pairs: string[][]; cases: Case[];
};
const manifest = JSON.parse(read(suite.source_manifest)) as {
  algorithm: string; files: Record<string, string>;
};

// These are fixture and packaging checks, not tests of a model's judgments.
test("instruction-boundary inputs map to distinct neutral sections", () => {
  const ids = suite.cases.map(item => item.id);
  const packet = read("packets.md");
  const sections = [...packet.matchAll(/^## (S\d+)$/gm)].map(match => match[1]);
  assert.equal(suite.status, "NOT RUN");
  assert.match(suite.base_revision, /^[0-9a-f]{40}$/);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual([...sections].sort(), [...ids].sort());
  for (const item of suite.cases) {
    assert.equal(item.input.packet, "packets.md");
    assert.equal(item.input.section, item.id);
    assert.ok(item.stage && item.expect.length);
    const body = packet.split("## " + item.id + "\n")[1]!.split("\n## ")[0]!;
    assert.ok(body.trim());
    assert.equal(/\bS\d{2}\b/.test(body), false);
    for (const expectation of item.expect) assert.equal(body.includes(expectation), false);
  }
});

test("contrasts identify existing cases without duplicate membership", () => {
  const members = suite.contrast_pairs.flat();
  assert.equal(new Set(members).size, members.length);
  assert.deepEqual([...members].sort(), suite.cases.map(item => item.id).sort());
  for (const pair of suite.contrast_pairs) assert.equal(pair.length, 2);
});

test("every fixture has a safe path and verified independent byte identity", () => {
  assert.equal(manifest.algorithm, "sha256");
  const visit = (directory: string): string[] => readdirSync(directory, { withFileTypes: true })
    .flatMap(entry => entry.isDirectory() ? visit(resolve(directory, entry.name))
      : [relative(evaluation, resolve(directory, entry.name)).replaceAll("\\", "/")]);
  assert.deepEqual(visit(resolve(evaluation, "fixtures")).sort(), Object.keys(manifest.files).sort());
  for (const [path, hash] of Object.entries(manifest.files)) {
    const local = relative(evaluation, resolve(evaluation, path));
    assert.equal(isAbsolute(local) || local === ".." || local.startsWith("../"), false);
    assert.match(hash, /^[0-9a-f]{64}$/);
    assert.equal(createHash("sha256").update(readFileSync(resolve(evaluation, path))).digest("hex"), hash);
  }
  for (const item of suite.cases) {
    assert.equal(new Set(item.input.source).size, item.input.source.length);
    for (const path of item.input.source) assert.ok(Object.hasOwn(manifest.files, path));
  }
});

test("evaluator materials do not enter generated review resources", () => {
  for (const path of ["skills/super-review", "adapters/claude/plugin", "adapters/codex/super-review"]) {
    const visit = (directory: string): void => {
      for (const entry of readdirSync(directory, { withFileTypes: true })) {
        assert.notEqual(entry.name, "instruction-boundaries");
        assert.notEqual(entry.name, "cases.json");
        assert.notEqual(entry.name, "packets.md");
        if (entry.isDirectory()) visit(resolve(directory, entry.name));
      }
    };
    visit(resolve(root, path));
  }
});
