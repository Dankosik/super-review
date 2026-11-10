import { expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { relative, resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const skill = resolve(root, "skills/defect-review");
const read = (path: string) => readFileSync(resolve(root, path), "utf8");
function files(path: string): string[] {
  return readdirSync(path, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? files(resolve(path, entry.name)) : [resolve(path, entry.name)]);
}
function metadata(path: string) {
  return Bun.YAML.parse(/^---\n([\s\S]*?)\n---/.exec(read(path))![1]) as any;
}
const tools = (role: string) => metadata(`adapters/claude/plugin/agents/${role}.md`).tools.split(", ").sort();
const lenses = ["results", "boundaries", "errors", "time", "lifecycle", "shared-state", "stated-facts", "team-rules"];

// File delivery and instruction integrity only; these do not measure model judgment.
test("the workflow's lens table and the lens resources name the same eight lenses", () => {
  const workflow = read("skills/defect-review/references/workflow.md");
  const linked = [...workflow.matchAll(/\| \[([a-z-]+)\]\(lenses\/([a-z-]+)\.md\) \|/g)];
  expect(linked.map(match => match[1])).toEqual(lenses);
  for (const match of linked) expect(match[2]).toBe(match[1]);
  expect(readdirSync(resolve(skill, "references/lenses")).sort()).toEqual(lenses.map(name => name + ".md").sort());
  for (const name of lenses) {
    const text = read(`skills/defect-review/references/lenses/${name}.md`);
    for (const heading of ["## Expect", "## Look for", "## Not a bug"]) expect(text).toContain(heading);
  }
});

test("a bug needs a traced effect, a stated basis, a harm and a survived challenge", () => {
  const contract = read("skills/defect-review/references/contract.md");
  for (const part of ["**The effect, traced.**", "**The expectation and its basis.**", "**The harm.**", "**A survived challenge.**"]) expect(contract).toContain(part);
  expect(contract).toContain("A candidate whose trace has a gap is **unproven**");
  expect(contract).toContain("For a library it is anything the public interface's types and\ndocumentation admit");
  expect(contract).toContain("Read the removed lines");
  const template = read("skills/defect-review/assets/finding-template.md");
  for (const basis of ["`written`", "`declared`", "`principle`"]) {
    expect(contract).toContain(basis);
    expect(template).toContain(basis);
  }
  for (const proof of ["`traced`", "`quoted`"]) expect(template).toContain(proof);
});

test("a written promise is not a gate and a document does not settle a claim", () => {
  expect(read("skills/defect-review/SKILL.md")).toContain("A written promise is one basis among several, not a precondition.");
  const contract = read("skills/defect-review/references/contract.md");
  expect(contract).toContain("Nothing has to be\nwritten down in advance for something to be a bug.");
  expect(contract).toContain("It does not settle the claim.");
  expect(contract).toContain("**disputed**");
});

test("the challenge is independent and its verdicts are arguments the orchestrator checks", () => {
  const challenge = read("skills/defect-review/references/challenge.md").replace(/\s+/g, " ");
  const template = read("skills/defect-review/assets/finding-template.md");
  for (const verdict of ["`stands`", "`falls`", "`disputed`"]) {
    expect(challenge).toContain(verdict);
    expect(template).toContain(verdict);
  }
  expect(challenge).toContain("It does not get the reader's reasoning");
  expect(challenge).toContain("Doubt is not a verdict.");
  const workflow = read("skills/defect-review/references/workflow.md");
  expect(workflow).toContain("Strip the reader's reasoning");
  expect(workflow).toContain("**Walk each trace yourself.**");
  expect(workflow).toContain("**Weigh the challenge as an argument, not a ruling.**");
  for (const outcome of ["| bug |", "| disputed |", "| drift |", "| rule violation |", "| unproven |", "| rejected |"]) expect(workflow).toContain(outcome);
  expect(workflow).toContain("Give it the same materials, lens included");
  expect(read("adapters/claude/plugin/agents/defect-challenger.md")).toContain("you are not told what\nanyone hopes for");
});

test("the review only reads: nothing is built or run and no role can write", () => {
  const contract = read("skills/defect-review/references/contract.md");
  expect(contract).toContain("This review reads. It does not build, run tests or any project code, write\nfiles, or clone, copy or check out the repository.");
  expect(tools("defect-orchestrator")).toEqual(["Agent", "Bash", "Glob", "Grep", "Read"]);
  for (const role of ["defect-specialist", "defect-challenger"]) expect(tools(role)).toEqual(["Bash", "Glob", "Grep", "Read"]);
  for (const role of ["defect-orchestrator", "defect-specialist", "defect-challenger"]) {
    const text = read(`adapters/claude/plugin/agents/${role}.md`).replace(/\s+/g, " ");
    expect(text).toContain("Never clone, copy, check out, build or run the reviewed project");
    expect(text).toContain("user's checkout");
  }
});

test("the Claude command runs the defect orchestrator on the packaged skill", () => {
  const path = "adapters/claude/plugin/skills/defects/SKILL.md";
  const command = metadata(path);
  expect(command.agent).toBe("super-review:defect-orchestrator");
  expect(command.context).toBe("fork");
  expect(command["disable-model-invocation"]).toBe(true);
  expect(read(path)).toContain("${CLAUDE_PLUGIN_ROOT}/resources/defect-review/SKILL.md");
});

test("delivery copies are identical and only the adapters that support it carry the skill", () => {
  const names = files(skill).map(file => relative(skill, file));
  for (const packageRoot of ["adapters/claude/plugin/resources/defect-review", "adapters/codex/super-review/skills/defect-review"]) {
    expect(files(resolve(root, packageRoot)).map(file => relative(resolve(root, packageRoot), file)).sort()).toEqual([...names].sort());
    for (const name of names) expect(read(`${packageRoot}/${name}`)).toBe(read(`skills/defect-review/${name}`));
  }
  expect(existsSync(resolve(root, "adapters/cursor/plugin/resources/defect-review"))).toBe(false);
  expect(files(resolve(root, "adapters/opencode")).some(file => file.includes("defect"))).toBe(false);
});
