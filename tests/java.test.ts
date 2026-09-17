import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const read = (path: string) => readFileSync(resolve(root, path), "utf8");
const lenses = ["naming", "control-flow", "function-cohesion", "data-flow", "abstractions", "duplication", "api-clarity", "change-locality", "representation", "rationale"];
const owners: Record<string, string> = {
  "lifecycle-ownership": "data-flow",
  "dependency-boundaries": "abstractions",
  "effects-separation": "function-cohesion",
  "error-expression": "control-flow",
};

test("Java routing, exclusions and owner identities stay in native instruction packages", () => {
  const routing = read("skills/super-review/references/languages.md");
  const contract = read("skills/super-review/references/review-contract.md");
  const context = read("skills/super-review/references/languages/java.md");
  expect(routing).toContain("languages/java.md");
  expect(routing).toContain(".java");
  expect(contract).toContain("src/test/java");
  expect(contract).toContain("target/generated-sources");
  expect(context).toContain("TestFactory.java");
  expect(context).toContain("../languages.md");
  expect(read("skills/super-review/SKILL.md")).toContain("references/languages.md");
  expect(read("skills/super-review/references/workflow.md")).toContain("languages.md");
});

test("Java language-specific rules and owner profiles retain stable identities", () => {
  const ids: string[] = JSON.parse(read("evals/java/rule-ids.json"));
  const actual = lenses.flatMap(lens => [...read(`skills/super-review/references/lenses/java/${lens}.md`).matchAll(/^## (java\.[a-z0-9.-]+)$/gm)].map(match => match[1]!));
  expect(new Set(actual).size).toBe(actual.length);
  expect(actual.sort()).toEqual([...ids].sort());
  for (const [profile, owner] of Object.entries(owners)) {
    const text = read(`skills/super-review/references/profiles/java/${profile}.md`);
    expect(/^Owner: (.+)$/m.exec(text)?.[1]).toBe(owner);
    const id = /^Rule: (java\.[a-z0-9.-]+)$/m.exec(text)?.[1];
    expect(id).toBeDefined();
    expect(read(`skills/super-review/references/lenses/java/${owner}.md`)).toContain("## " + id);
    expect(text).not.toMatch(/^## (?:java|go|ts|rust)\./m);
  }
});
