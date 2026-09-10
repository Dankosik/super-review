import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const read = (path: string) => readFileSync(resolve(root, path), "utf8");
const lenses = ["naming", "control-flow", "function-cohesion", "data-flow", "abstractions", "duplication", "api-clarity", "change-locality", "representation", "rationale"];
const profiles = ["lifecycle-ownership", "dependency-boundaries", "effects-separation", "error-expression"];

// File delivery and evaluation integrity only; these do not measure model judgment.
for (const [language, prefix, directory] of [["go", "go", ""], ["typescript", "ts", "typescript/"], ["rust", "rust", "rust/"]]) {
  test(`${language}: every rule and owner remains present in all native packages`, () => {
    const ids: string[] = JSON.parse(read(`evals/${language}/rule-ids.json`));
    const paths = ["references/review-contract.md", "assets/finding-template.md", `references/languages/${language}.md`, ...lenses.map(lens => `references/lenses/${directory}${lens}.md`), ...profiles.map(profile => `references/profiles/${directory}${profile}.md`)];
    const actual = lenses.flatMap(lens => [...read(`skills/super-review/references/lenses/${directory}${lens}.md`).matchAll(/^## ((?:go|ts|rust)\.[a-z0-9.-]+)$/gm)].map(match => match[1]));
    expect(new Set(actual).size).toBe(actual.length);
    expect(actual.sort()).toEqual([...ids].sort());
    expect(actual.every(id => id.startsWith(prefix + "."))).toBe(true);
    for (const profile of profiles) {
      const text = read(`skills/super-review/references/profiles/${directory}${profile}.md`);
      const owner = /^Owner: (.+)$/m.exec(text)![1];
      const rule = /^Rule: (.+)$/m.exec(text)![1];
      expect(ids).toContain(rule);
      expect(read(`skills/super-review/references/lenses/${directory}${owner}.md`)).toContain("## " + rule);
    }
    for (const path of paths) for (const packageRoot of ["adapters/claude/plugin/resources/super-review", "adapters/codex/super-review/skills/super-review"]) {
      expect(read(`${packageRoot}/${path}`)).toBe(read(`skills/super-review/${path}`));
    }
  });
}

for (const [suite, packet, pattern] of [
  ["evals/go/go-idioms-cases.json", "evals/go/packets/go-idioms.md", /^## (G\d+)$/gm],
  ["evals/go/aspect-cases.json", "evals/go/packets/aspects.md", /^## ([JR]\d+)$/gm],
  ["evals/rust/cases.json", "evals/rust/packets/idioms.md", /^## (R\d+)$/gm],
  ["evals/typescript/cases.json", "evals/typescript/packets/contrasts.md", /^## (T\d+)$/gm],
] as const) {
  test(`${suite}: expectations have distinct raw sections`, () => {
    const data = JSON.parse(read(suite));
    const cases: Array<{ id: string; expect: string[] }> = Array.isArray(data) ? data : data.cases;
    const sections = [...read(packet).matchAll(pattern)].map(match => match[1]);
    expect(new Set(sections).size).toBe(sections.length);
    expect(sections.sort()).toEqual(cases.map(item => item.id).sort());
    for (const item of cases) expect(item.expect.length).toBeGreaterThan(0);
  });
}
