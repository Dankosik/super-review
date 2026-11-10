import { expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { relative, resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const skill = resolve(root, "skills/test-review");
const read = (path: string) => readFileSync(resolve(root, path), "utf8");
function files(path: string): string[] {
  return readdirSync(path, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? files(resolve(path, entry.name)) : [resolve(path, entry.name)]);
}
function metadata(path: string) {
  return Bun.YAML.parse(/^---\n([\s\S]*?)\n---/.exec(read(path))![1]) as any;
}
const tools = (role: string) => metadata(`adapters/claude/plugin/agents/${role}.md`).tools.split(", ").sort();
const questions = ["behavior", "failure-paths", "oracles", "determinism", "team-rules"];

// File delivery and instruction integrity only; these do not measure model judgment.
test("the workflow's question table and the question resources name the same five questions", () => {
  const workflow = read("skills/test-review/references/workflow.md");
  const linked = [...workflow.matchAll(/\| \[([a-z-]+)\]\(questions\/([a-z-]+)\.md\) \|/g)];
  expect(linked.map(match => match[1])).toEqual(questions);
  for (const match of linked) expect(match[2]).toBe(match[1]);
  expect(readdirSync(resolve(skill, "references/questions")).sort()).toEqual(questions.map(name => name + ".md").sort());
  for (const name of questions) {
    const text = read(`skills/test-review/references/questions/${name}.md`);
    for (const heading of ["## Promises", "## Look for", "## Not a finding"]) expect(text).toContain(heading);
  }
});

test("an unpinned behavior needs a mutant, the tests that reach it and a witness", () => {
  const contract = read("skills/test-review/references/contract.md");
  for (const kind of ["### Unpinned", "### Quoted", "### Unstable"]) expect(contract).toContain(kind);
  for (const part of ["**The promise**", "**The mutant**", "**The tests that reach it.**", "**The witness**"]) expect(contract).toContain(part);
  expect(contract).toContain("Anything less is an **unproven** candidate");
  const template = read("skills/test-review/assets/finding-template.md");
  for (const proof of ["`unpinned`", "`quoted`", "`unstable`"]) expect(template).toContain(proof);
  expect(read("skills/test-review/references/workflow.md")).toContain("look for one the specialist missed");
});

test("the review only reads: a mutant is never applied and no role can write", () => {
  const contract = read("skills/test-review/references/contract.md");
  expect(contract).toContain("This review reads. It does not build, run tests or any project code, write\nfiles, or clone, copy or check out the repository. A mutant is a described\nchange, never an applied one.");
  expect(tools("test-orchestrator")).toEqual(["Agent", "Bash", "Glob", "Grep", "Read"]);
  expect(tools("test-specialist")).toEqual(["Bash", "Glob", "Grep", "Read"]);
  for (const role of ["test-orchestrator", "test-specialist"]) {
    const text = read(`adapters/claude/plugin/agents/${role}.md`).replace(/\s+/g, " ");
    expect(text).toContain("Never clone, copy, check out, build or run the reviewed project");
    expect(text).toContain("user's checkout");
  }
});

test("the Claude command runs the test orchestrator on the packaged skill", () => {
  const path = "adapters/claude/plugin/skills/tests/SKILL.md";
  const command = metadata(path);
  expect(command.agent).toBe("super-review:test-orchestrator");
  expect(command.context).toBe("fork");
  expect(command["disable-model-invocation"]).toBe(true);
  expect(read(path)).toContain("${CLAUDE_PLUGIN_ROOT}/resources/test-review/SKILL.md");
});

test("delivery copies are identical and only the adapters that support it carry the skill", () => {
  const names = files(skill).map(file => relative(skill, file));
  for (const packageRoot of ["adapters/claude/plugin/resources/test-review", "adapters/codex/super-review/skills/test-review"]) {
    expect(files(resolve(root, packageRoot)).map(file => relative(resolve(root, packageRoot), file)).sort()).toEqual([...names].sort());
    for (const name of names) expect(read(`${packageRoot}/${name}`)).toBe(read(`skills/test-review/${name}`));
  }
  expect(existsSync(resolve(root, "adapters/cursor/plugin/resources/test-review"))).toBe(false);
  for (const role of ["test-review", "test-reader"]) expect(existsSync(resolve(root, `adapters/opencode/agents/${role}.md`))).toBe(true);
  expect(read("scripts/package.py")).toContain('"test-review"');
});

test("no role in the plugin can write files, and no execution machinery remains", () => {
  expect(existsSync(resolve(root, "shared"))).toBe(false);
  for (const file of readdirSync(resolve(root, "adapters/claude/plugin/agents"))) {
    const granted: string[] = metadata(`adapters/claude/plugin/agents/${file}`).tools.split(", ");
    expect(granted.some(tool => tool === "Write" || tool === "Edit")).toBe(false);
  }
  for (const name of ["defect-review", "test-review"]) {
    for (const file of files(resolve(root, "skills", name)).filter(file => file.endsWith(".md"))) {
      expect(readFileSync(file, "utf8")).not.toMatch(/working copy|pinned copy|CARGO_TARGET_DIR|cargo test|rerun protocol/i);
    }
  }
});

test("the three reviews keep separate policy: no skill reads another's resources", () => {
  const skills: Array<[string, RegExp]> = [
    ["super-review", /defect-review|Defect Review|test-review|Test Review/],
    ["defect-review", /resources\/super-review|skills\/super-review|Super Review|test-review|Test Review/],
    ["test-review", /resources\/super-review|skills\/super-review|Super Review|defect-review|Defect Review/],
  ];
  for (const [name, forbidden] of skills) {
    for (const file of files(resolve(root, "skills", name)).filter(file => file.endsWith(".md"))) {
      const text = readFileSync(file, "utf8");
      expect(text).not.toMatch(forbidden);
      if (name !== "super-review") expect(text).not.toMatch(/evals\//);
    }
  }
});
