import { expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { relative, resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const skill = resolve(root, "skills/perf-review");
const read = (path: string) => readFileSync(resolve(root, path), "utf8");
const flat = (path: string) => read(path).replace(/\s+/g, " ");
function files(path: string): string[] {
  return readdirSync(path, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? files(resolve(path, entry.name)) : [resolve(path, entry.name)]);
}
function metadata(path: string) {
  return Bun.YAML.parse(/^---\n([\s\S]*?)\n---/.exec(read(path))![1]) as any;
}
const tools = (role: string) => metadata(`adapters/claude/plugin/agents/${role}.md`).tools.split(", ").sort();
const lenses = ["complexity", "allocation", "async", "io", "contention", "repeated-work"];
const roles = ["perf-orchestrator", "perf-reader", "perf-challenger"];

// File delivery and instruction integrity only; these do not measure model judgment.
test("the workflow's lens table and the lens resources name the same six lenses", () => {
  const workflow = read("skills/perf-review/references/workflow.md");
  const linked = [...workflow.matchAll(/\| \[([a-z-]+)\]\(lenses\/([a-z-]+)\.md\) \|/g)];
  expect(linked.map(match => match[1])).toEqual(lenses);
  for (const match of linked) expect(match[2]).toBe(match[1]);
  expect(readdirSync(resolve(skill, "references/lenses")).sort()).toEqual(lenses.map(name => name + ".md").sort());
  for (const name of lenses) {
    const text = read(`skills/perf-review/references/lenses/${name}.md`);
    expect(text).toMatch(/^# .+\n\n\*\*[^*]+\?\*\*\n/);
    for (const heading of ["## Expect", "## Look for", "## Not a finding"]) expect(text).toContain(heading);
  }
  expect(workflow).toContain("complexity with allocation,\nasync with contention, io with repeated-work");
});

test("a finding needs a hot path, a cost trace, a cheaper form and a resource", () => {
  const contract = read("skills/perf-review/references/contract.md");
  for (const part of ["**The hot path.**", "**The cost, traced.**", "**The cheaper form.**", "**The resource.**"]) expect(contract).toContain(part);
  for (const section of ["## Hot path", "## Cost trace", "## Cheaper form", "## Resource"]) expect(contract).toContain(section);
  expect(contract).toContain("A candidate whose trace has a gap is **unproven**");
  expect(contract).toContain("**tradeoff**");
  expect(contract).toContain("Do not invent milliseconds or percentages.");
  expect(contract).toContain("Read the removed lines");
  expect(contract).toContain("Hot is relative to the program's unit of work");
  expect(contract).toContain("within the `rust-version`, edition, dependencies and enabled\nfeatures in `Cargo.toml`");
  for (const outside of ["memory footprint", "build profiles", "the global allocator", "compile time"]) expect(contract).toContain(outside);
  expect(read("skills/perf-review/references/workflow.md")).toContain("For whole-project source, also locate where work enters the program");
  const template = read("skills/perf-review/assets/finding-template.md");
  for (const basis of ["`source`", "`document`", "`measurement`", "`user`"]) expect(template).toContain(basis);
  expect(template).toContain("`traced`");
});

test("the challenge is independent and its verdicts are arguments the orchestrator checks", () => {
  const challenge = flat("skills/perf-review/references/challenge.md");
  const template = read("skills/perf-review/assets/finding-template.md");
  for (const verdict of ["`stands`", "`falls`", "`tradeoff`"]) {
    expect(challenge).toContain(verdict);
    expect(template).toContain(verdict);
  }
  for (const line of ["**The path is not hot.**", "**The work is not done.**", "**The cheaper form changes behavior.**", "**A larger cost swallows the saving (Amdahl).**"]) expect(challenge).toContain(line);
  expect(challenge).toContain("It does not get the reader's reasoning");
  expect(challenge).toContain("Doubt is not a verdict.");
  const workflow = read("skills/perf-review/references/workflow.md");
  expect(workflow).toContain("Strip the reader's reasoning");
  expect(workflow).toContain("**Walk each trace yourself.**");
  expect(workflow).toContain("**Weigh the challenge as an argument, not a ruling.**");
  for (const outcome of ["| finding |", "| tradeoff |", "| unproven |", "| rejected |"]) expect(workflow).toContain(outcome);
  expect(workflow).toContain("Give it the same\nmaterials, lens included");
  expect(read("adapters/claude/plugin/agents/perf-challenger.md")).toContain("you are not told what anyone hopes for");
});

test("the report ranks by work removed, asks the user what only they know, and hands measurement to whoever applies it", () => {
  const report = flat("skills/perf-review/assets/report-template.md");
  for (const section of ["## Findings", "### Constant work per request", "## Tradeoffs", "## Needs your confirmation", "## Unproven and rejected", "## Before applying"]) expect(report).toContain(section);
  expect(report).toContain("in the workflow's ranking by the work they remove");
  expect(flat("skills/perf-review/references/workflow.md")).toContain("a change of complexity class first, then a round trip, system call or blocking wait per element, then an allocation or copy per element, then constant work per request");
  expect(report).toContain("Measure a release build on the same machine and workload, before and after, in the way the saved resource demands");
  expect(report).toContain("A single-threaded benchmark shows nothing here.");
  expect(report).toContain("Keep the existing tests passing");
  expect(report).toContain("Apply a change only when the measurement shows the gain.");
  expect(report).toContain("Do not adjust the measurement");
});

test("the review only reads: nothing is built or run and no role can write", () => {
  expect(read("skills/perf-review/references/contract.md")).toContain("This review reads. It does not build, run tests, benchmarks, profilers or\nany project code, write files, or clone, copy or check out the repository.");
  expect(tools("perf-orchestrator")).toEqual(["Agent", "Bash", "Glob", "Grep", "Read"]);
  for (const role of ["perf-reader", "perf-challenger"]) expect(tools(role)).toEqual(["Bash", "Glob", "Grep", "Read"]);
  for (const role of roles) {
    const text = flat(`adapters/claude/plugin/agents/${role}.md`);
    expect(text).toContain("Never clone, copy, check out, build or run the reviewed project, its benchmarks or a profiler");
    expect(text).toContain("user's checkout");
  }
  // No instruction that a role reads gives a command that builds, tests, benchmarks or profiles the project.
  const launch = /\bcargo\s+(?:\+\S+\s+)?[a-z-]+|\brustc\b|\bperf\s+(?:record|stat|top)\b|\bhyperfine\b|\bvalgrind\b|\bflamegraph\s+--|\bsamply\b/;
  const instructions = [
    ...files(skill).filter(file => file.endsWith(".md")).map(file => relative(root, file)),
    ...roles.map(role => `adapters/claude/${role}.md`),
    "adapters/claude/perf-skill.md",
    ...["perf-review", "perf-reader", "perf-challenger"].map(role => `adapters/opencode/agents/${role}.md`),
    "adapters/opencode/commands/perf-review.md",
  ];
  for (const path of instructions) expect({ path, match: read(path).match(launch)?.[0] ?? null }).toEqual({ path, match: null });
});

test("the Claude command runs the performance orchestrator on the packaged skill", () => {
  const path = "adapters/claude/plugin/skills/perf/SKILL.md";
  const command = metadata(path);
  expect(command.agent).toBe("super-review:perf-orchestrator");
  expect(command.context).toBe("fork");
  expect(command["disable-model-invocation"]).toBe(true);
  expect(read(path)).toContain("${CLAUDE_PLUGIN_ROOT}/resources/perf-review/SKILL.md");
});

test("delivery copies are identical and only the adapters that support it carry the skill", () => {
  const names = files(skill).map(file => relative(skill, file));
  for (const packageRoot of ["adapters/claude/plugin/resources/perf-review", "adapters/codex/super-review/skills/perf-review"]) {
    expect(files(resolve(root, packageRoot)).map(file => relative(resolve(root, packageRoot), file)).sort()).toEqual([...names].sort());
    for (const name of names) expect(read(`${packageRoot}/${name}`)).toBe(read(`skills/perf-review/${name}`));
  }
  for (const role of roles) expect(read(`adapters/claude/plugin/agents/${role}.md`)).toBe(read(`adapters/claude/${role}.md`));
  expect(existsSync(resolve(root, "adapters/cursor/plugin/resources/perf-review"))).toBe(false);
  for (const role of ["perf-review", "perf-reader", "perf-challenger"]) expect(existsSync(resolve(root, `adapters/opencode/agents/${role}.md`))).toBe(true);
  expect(read("scripts/package.py")).toContain('"perf-review"');
  expect(metadata("skills/perf-review/SKILL.md").metadata.version).toBe("0.2.0");
});
