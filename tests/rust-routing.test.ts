import { expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const read = (path: string) => readFileSync(resolve(root, path), "utf8");
const lenses = ["naming", "control-flow", "function-cohesion", "data-flow", "abstractions", "duplication", "api-clarity", "change-locality", "representation", "rationale"];
const profiles = ["lifecycle-ownership", "dependency-boundaries", "effects-separation", "error-expression"];

test("all languages share routing without loading a language-specific child fallback", () => {
  for (const path of ["skills/super-review/SKILL.md", "skills/super-review/references/workflow.md", "skills/super-review/references/verification.md", "adapters/claude/specialist.md", "adapters/opencode/agents/super-review-specialist.md"]) {
    expect(read(path)).toContain("languages.md");
  }
  const routing = read("skills/super-review/references/languages.md");
  for (const language of ["go", "typescript", "rust"]) {
    expect(routing).toContain("languages/" + language + ".md");
    const directory = language === "go" ? "" : language + "/";
    for (const lens of lenses) expect(routing).toContain("lenses/" + directory + lens + ".md");
    for (const profile of profiles) expect(routing).toContain("profiles/" + directory + profile + ".md");
  }
  const workflow = read("skills/super-review/references/workflow.md");
  expect((workflow.match(/^\| \[[a-z-]+\]\(lenses\//gm) ?? []).length).toBe(8);
  const catalog = read("skills/super-review/references/aspects.md");
  expect((catalog.match(/\| lens \|/g) ?? []).length).toBe(2);
  expect((catalog.match(/\| profile \|/g) ?? []).length).toBe(4);
  expect(read("skills/super-review/references/languages/rust.md")).toContain("../languages.md");
  expect(existsSync(resolve(root, "adapters/opencode/lib/languages.ts"))).toBe(false);
});
