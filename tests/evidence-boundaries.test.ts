import { test } from "bun:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, isAbsolute, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const evaluation = resolve(root, "evals/evidence-boundaries");
const read = (path: string): string => readFileSync(resolve(evaluation, path), "utf8");
type Case = {
  id: string; stage: string;
  input: { packet: string; section: string; observation: string;
    observation_key: string; source: string[] };
  expect: string[];
};
const suite = JSON.parse(read("cases.json")) as {
  status: string; base_revision: string; source_manifest: string;
  contrast_pairs: string[][]; cases: Case[];
};
const manifest = JSON.parse(read(suite.source_manifest)) as {
  algorithm: string; files: Record<string, string>;
};
const observations = JSON.parse(read("fixtures/observations.json")) as Record<string, unknown>;
const packets = read("packets.md");
const body = (id: string): string => packets.split("## " + id + "\n")[1]!.split("\n## ")[0]!.trim();
const filesUnder = (directory: string): string[] => readdirSync(directory, { withFileTypes: true })
  .flatMap(entry => entry.isDirectory() ? filesUnder(resolve(directory, entry.name))
    : [resolve(directory, entry.name)]);

// Integrity checks only: no model is executed or graded by this suite.
test("evidence stages have isolated inputs and complete contrast membership", () => {
  const ids = suite.cases.map(item => item.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(suite.status, "NOT RUN");
  assert.match(suite.base_revision, /^[a-f0-9]{40}$/);
  assert.deepEqual([...packets.matchAll(/^## (E\d+)$/gm)].map(match => match[1]).sort(), [...ids].sort());
  const members = suite.contrast_pairs.flat();
  assert.equal(new Set(members).size, members.length);
  assert.deepEqual([...members].sort(), [...ids].sort());
  for (const pair of suite.contrast_pairs) {
    assert.equal(pair.length, 2);
    assert.equal(body(pair[0]!), body(pair[1]!));
    const [a, b] = pair.map(id => suite.cases.find(item => item.id === id)!);
    assert.notDeepEqual(observations[a!.input.observation_key], observations[b!.input.observation_key]);
  }
  const keys = suite.cases.map(item => item.input.observation_key);
  assert.equal(new Set(keys).size, keys.length);
  assert.deepEqual([...keys].sort(), Object.keys(observations).sort());
  for (const item of suite.cases) {
    assert.equal(item.input.packet, "packets.md");
    assert.equal(item.input.section, item.id);
    assert.equal(item.input.observation, "fixtures/observations.json");
    assert.ok(item.stage && item.expect.length && body(item.id));
    assert.equal(/\bE\d{2}\b/.test(body(item.id)), false);
    const supplied = body(item.id) + JSON.stringify(observations[item.input.observation_key]);
    for (const expectation of item.expect) assert.equal(supplied.includes(expectation), false);
    assert.equal(new Set(item.input.source).size, item.input.source.length);
    for (const path of item.input.source) assert.ok(Object.hasOwn(manifest.files, path));
  }
});

test("every fixture has a portable safe path and matching content hash", () => {
  assert.equal(manifest.algorithm, "sha256");
  const actual = filesUnder(resolve(evaluation, "fixtures"))
    .map(path => relative(evaluation, path).replaceAll("\\", "/")).sort();
  assert.deepEqual(actual, Object.keys(manifest.files).sort());
  for (const [path, hash] of Object.entries(manifest.files)) {
    assert.equal(path.includes("\\") || /^[A-Za-z]:/.test(path), false);
    const local = relative(evaluation, resolve(evaluation, path));
    assert.equal(isAbsolute(local) || local === ".." || local.startsWith("../") || local.startsWith("..\\"), false);
    assert.match(hash, /^[a-f0-9]{64}$/);
    assert.equal(createHash("sha256").update(readFileSync(resolve(evaluation, path))).digest("hex"), hash);
  }
  const contentHash = manifest.files["fixtures/source/format.go"];
  const collection = observations["collection-a"] as {
    assignment: { snapshot: { path: string; sha256: string } };
    result: { snapshot: { path: string; sha256: string } };
  };
  for (const snapshot of [collection.assignment.snapshot, collection.result.snapshot]) {
    assert.equal(snapshot.path, "source/format.go");
    assert.equal(snapshot.sha256, contentHash);
  }
});

test("grader inputs remain outside the installed review resources", () => {
  for (const path of ["skills/super-review", "adapters/claude/plugin", "adapters/codex/super-review"]) {
    assert.ok(existsSync(resolve(root, path)));
    for (const file of filesUnder(resolve(root, path))) {
      const local = relative(resolve(root, path), file).replaceAll("\\", "/");
      assert.equal(/(?:^|\/)(?:evals|evidence-boundaries)(?:\/|$)/.test(local), false);
      assert.equal(/(?:^|\/)(?:cases|observations|source-manifest)\.json$/.test(local), false);
    }
  }
});
