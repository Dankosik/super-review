import { expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { posix, relative, resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const skill = resolve(root, "skills/sql-review");
const read = (path: string) => readFileSync(resolve(root, path), "utf8");
const flat = (path: string) => read(path).replace(/\s+/g, " ");
function files(path: string): string[] {
  return readdirSync(path, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? files(resolve(path, entry.name)) : [resolve(path, entry.name)]);
}
function metadata(path: string) {
  return Bun.YAML.parse(/^---\n([\s\S]*?)\n---/.exec(read(path))![1]) as any;
}
const tools = (role: string) => metadata(`adapters/claude/plugin/agents/${role}.md`).tools.split(", ").sort();
const lenses = ["schema", "migrations", "queries", "transactions", "indexing", "app-boundary"];
const dialects = ["postgresql", "mysql", "sqlite"] as const;
const roles = ["sql-orchestrator", "sql-reader", "sql-challenger"];

// File delivery, instruction boundaries and fixture integrity only; these do not measure model judgment.
test("the workflow's lens table and lens resources name the same six lenses with safe small-change pairing", () => {
  const workflow = read("skills/sql-review/references/workflow.md");
  const linked = [...workflow.matchAll(/\| \[([a-z-]+)\]\(lenses\/([a-z-]+)\.md\) \|/g)];
  expect(linked.map(match => match[1])).toEqual(lenses);
  for (const match of linked) expect(match[2]).toBe(match[1]);
  expect(readdirSync(resolve(skill, "references/lenses")).sort()).toEqual(lenses.map(name => name + ".md").sort());
  for (const name of lenses) {
    const text = read(`skills/sql-review/references/lenses/${name}.md`);
    expect(text).toMatch(/^# .+\n\n\*\*[^*]+\?\*\*\n/);
    for (const heading of ["## Expect", "## Look for", "## Not a finding"]) expect(text).toContain(heading);
    const bullets = text.split(/\n(?=- )/).slice(1);
    for (const bullet of bullets) {
      const bulletLines = bullet.split(/\n\n/)[0]!.split("\n").length;
      expect(bulletLines).toBeLessThanOrEqual(6);
    }
  }
  const flatWorkflow = flat("skills/sql-review/references/workflow.md");
  expect(flatWorkflow).toContain("pair `schema` with `migrations`, pair `queries` with `transactions`, keep `indexing` solo, and keep `app-boundary` solo");
});

test("dialect contexts use the five-section baseline template and keep anti-encyclopedia bounds", () => {
  expect(readdirSync(resolve(skill, "references/dialects")).sort()).toEqual(dialects.map(name => name + ".md").sort());
  const titles: Record<(typeof dialects)[number], string> = {
    postgresql: "PostgreSQL",
    mysql: "MySQL",
    sqlite: "SQLite",
  };
  for (const dialect of dialects) {
    const path = `skills/sql-review/references/dialects/${dialect}.md`;
    const text = read(path);
    const title = titles[dialect];
    for (const heading of [
      `## Where ${title} projects state their baseline`,
      "## Verify in source and baseline",
      "## Questions to settle before claiming",
      `## ${title} boundaries`,
      `## Not a finding in ${title}`,
    ]) {
      expect(text).toContain(heading);
    }
    const lineCount = text.trimEnd().split("\n").length;
    expect(lineCount).toBeGreaterThanOrEqual(45);
    expect(lineCount).toBeLessThanOrEqual(90);
    // No bullet exceeds 6 lines.
    const bullets = text.split(/\n(?=- )/).slice(1);
    for (const bullet of bullets) {
      const bulletLines = bullet.split(/\n\n/)[0]!.split("\n").length;
      expect(bulletLines).toBeLessThanOrEqual(6);
    }
  }
  expect(flat("skills/sql-review/references/dialects/mysql.md")).toContain("MariaDB");
  expect(flat("skills/sql-review/references/dialects/postgresql.md")).toContain("skip scan");
  expect(flat("skills/sql-review/references/dialects/postgresql.md")).toContain("separate transactions");
  expect(flat("skills/sql-review/references/dialects/sqlite.md")).toContain("IEEE-754");
});

test("a finding requires four checkable parts, explicit bases, safer-form proof and clean scope boundaries", () => {
  const contract = read("skills/sql-review/references/contract.md");
  const flatContract = flat("skills/sql-review/references/contract.md");
  for (const part of [
    "**The mechanism, traced or quoted.**",
    "**The expectation and its basis.**",
    "**The impact.**",
    "**The safer form.**",
  ]) {
    expect(contract).toContain(part);
  }
  for (const section of ["## Scope", "## Reading only", "## What a finding is", "## Mechanism and baseline", "## Basis", "## Impact and confirmation", "## Safer form"]) {
    expect(contract).toContain(section);
  }
  for (const basis of ["`written`", "`schema`", "`engine`"]) {
    expect(contract).toContain(basis);
    expect(read("skills/sql-review/assets/finding-template.md")).toContain(basis);
  }
  expect(flatContract).toContain("Read the removed lines");
  expect(flatContract).toContain("A candidate with a missing trace step");
  expect(flatContract).toContain("**unproven**");
  expect(flatContract).toContain("**needs confirmation**");
  expect(flatContract).toContain("**Tradeoff**");
  expect(flatContract).toContain("**Disputed**");
  expect(flatContract).toContain("cosmetic SQL formatting");
  expect(flatContract).toContain("broken parameterization");
  expect(flatContract).toContain("SECURITY DEFINER");
  expect(flatContract).toContain("schema-evolution fragility");
  expect(flatContract).toContain("never reviewed by analogy");
});

test("the challenge is independent and the orchestrator owns all six decision outcomes", () => {
  const challenge = flat("skills/sql-review/references/challenge.md");
  const template = read("skills/sql-review/assets/finding-template.md");
  for (const verdict of ["`stands`", "`falls`", "`tradeoff`", "`disputed`"]) {
    expect(challenge).toContain(verdict);
    expect(template).toContain(verdict);
  }
  expect(template).toContain("no verdict");
  for (const line of [
    "**The mechanism does not hold on this dialect and version.**",
    "**The trigger or runtime condition is prevented or unestablished.**",
    "**The safer form is invalid or changes semantics or tradeoffs.**",
    "**The behavior is a deliberate, reasoned choice or out of scope.**",
  ]) {
    expect(challenge).toContain(line);
  }
  expect(challenge).toContain("It does not get the reader's reasoning");
  expect(challenge).toContain("Doubt is not a verdict.");
  expect(challenge).toContain("return `falls` naming the missing runtime check");
  const challengeItems = read("skills/sql-review/references/challenge.md").split(/\n(?=\d+\. )/).slice(1);
  expect(challengeItems.length).toBe(4);
  for (const item of challengeItems) {
    const itemLines = item.split(/\n\n/)[0]!.split("\n").length;
    expect(itemLines).toBeLessThanOrEqual(6);
  }
  const workflow = read("skills/sql-review/references/workflow.md");
  const flatWorkflow = flat("skills/sql-review/references/workflow.md");
  expect(flatWorkflow).toContain("Strip the reader's reasoning");
  expect(workflow).toContain("**Walk each trace yourself.**");
  expect(workflow).toContain("**Weigh the challenge as an argument, not a ruling.**");
  expect(flatWorkflow).toContain("when `falls` rests only on unconfirmed server version, scale, cardinality, or missing `EXPLAIN` while the static mechanism holds, route to `needs confirmation`");
  for (const outcome of ["| finding |", "| tradeoff |", "| disputed |", "| needs confirmation |", "| unproven |", "| rejected |"]) {
    expect(workflow).toContain(outcome);
  }
  expect(read("adapters/claude/plugin/agents/sql-challenger.md")).toContain("you are not told what anyone hopes for");
});

test("the report template keeps compact fragility, confirmation questions, and zero em-dashes across the skill", () => {
  const report = read("skills/sql-review/assets/report-template.md");
  for (const section of [
    "## Outcome",
    "## Findings",
    "### Schema-evolution fragility",
    "## Tradeoffs",
    "## Disputed",
    "## Needs your confirmation",
    "## Outside the scope",
    "## Unproven and rejected",
    "## Before applying",
  ]) {
    expect(report).toContain(section);
  }
  for (const file of files(skill).filter(path => path.endsWith(".md"))) {
    expect({ file: relative(root, file), hasEmDash: read(relative(root, file)).includes("—") }).toEqual({
      file: relative(root, file),
      hasEmDash: false,
    });
  }
});

test("the review only reads: no database execution, no write tools, and no runnable DB CLI commands", () => {
  const contract = flat("skills/sql-review/references/contract.md");
  expect(contract).toContain("This review reads. It does not connect to a database, run database CLIs, apply migrations, execute queries, build or run project code, write files, or clone, copy or check out the repository.");
  expect(tools("sql-orchestrator")).toEqual(["Agent", "Bash", "Glob", "Grep", "Read"]);
  for (const role of ["sql-reader", "sql-challenger"]) expect(tools(role)).toEqual(["Bash", "Glob", "Grep", "Read"]);
  for (const role of roles) {
    const text = flat(`adapters/claude/plugin/agents/${role}.md`);
    expect(text).toContain("Never connect to a database, run database CLIs, apply migrations, execute queries");
    expect(text).toContain("user's checkout");
  }
  // Forbid runnable database CLI commands while allowing passive EXPLAIN output or dump format mentions.
  const dbLaunch = /\bpsql\s+|\bmysql\s+-\w|\bsqlite3\s+|\bpg_restore\b|\bpg_dump\s+-|\bmysqldump\s+-|\bdocker\s+exec\b[^\n]*\b(?:psql|mysql|sqlite3)\b|\bprisma\s+migrate\b|\bflyway\s+migrate\b|\bliquibase\s+update\b|\batlas\s+migrate\s+apply\b|\bdiesel\s+migration\b|\bsqlx\s+migrate\b/;
  const instructions = [
    ...files(skill).filter(file => file.endsWith(".md")).map(file => relative(root, file)),
    ...roles.map(role => `adapters/claude/${role}.md`),
    "adapters/claude/sql-skill.md",
    ...["sql-review", "sql-reader", "sql-challenger"].map(role => `adapters/opencode/agents/${role}.md`),
    "adapters/opencode/commands/sql-review.md",
    "adapters/antigravity/sql-review.md",
    "adapters/antigravity/agents/sql-reader.md",
    "adapters/antigravity/agents/sql-challenger.md",
  ];
  for (const path of instructions) {
    expect({ path, match: read(path).match(dbLaunch)?.[0] ?? null }).toEqual({ path, match: null });
  }
});

test("the Claude command runs the SQL orchestrator on the packaged skill", () => {
  const path = "adapters/claude/plugin/skills/sql/SKILL.md";
  const command = metadata(path);
  expect(command.agent).toBe("super-review:sql-orchestrator");
  expect(command.context).toBe("fork");
  expect(command.background).toBe(false);
  expect(command["disable-model-invocation"]).toBe(true);
  expect(read(path)).toContain("${CLAUDE_PLUGIN_ROOT}/resources/sql-review/SKILL.md");
});

test("delivery copies are identical across supported hosts and absent in Cursor", () => {
  const names = files(skill).map(file => relative(skill, file));
  for (const packageRoot of [
    "adapters/claude/plugin/resources/sql-review",
    "adapters/codex/super-review/skills/sql-review",
    "adapters/antigravity/plugin/resources/sql-review",
  ]) {
    expect(files(resolve(root, packageRoot)).map(file => relative(resolve(root, packageRoot), file)).sort()).toEqual([...names].sort());
    for (const name of names) expect(read(`${packageRoot}/${name}`)).toBe(read(`skills/sql-review/${name}`));
  }
  for (const role of roles) expect(read(`adapters/claude/plugin/agents/${role}.md`)).toBe(read(`adapters/claude/${role}.md`));
  expect(existsSync(resolve(root, "adapters/cursor/plugin/resources/sql-review"))).toBe(false);
  for (const role of ["sql-review", "sql-reader", "sql-challenger"]) expect(existsSync(resolve(root, `adapters/opencode/agents/${role}.md`))).toBe(true);
  expect(read("scripts/package.py")).toContain('"sql-review"');
  const skillMeta = metadata("skills/sql-review/SKILL.md");
  expect(skillMeta.metadata.version).toBe("0.1.0");
  expect(skillMeta["disable-model-invocation"]).toBe(true);
  const openAi = Bun.YAML.parse(read("skills/sql-review/agents/openai.yaml")) as any;
  expect(openAi.policy.allow_implicit_invocation).toBe(false);
});

test("sql-review evaluator packets are isolated, symmetric across all lenses and dialects, and stay out of packaged plugins", () => {
  type Packet = {
    id: string;
    skill: string;
    dialect: string;
    lens: string;
    request: string;
    scope: string;
    files: Record<string, string>;
  };
  type GraderCase = {
    id: string;
    polarity: "report" | "retain";
    decision: string;
    checks: string[];
  };
  const { inputs } = JSON.parse(read("evals/sql-review/inputs.json")) as { inputs: Packet[] };
  const suite = JSON.parse(read("evals/sql-review/cases.json")) as {
    kind: string;
    status: string;
    baseline_revision: string;
    contrast_pairs: [string, string][];
    cases: GraderCase[];
  };
  expect(suite.kind).toBe("evaluator-only");
  expect(suite.status).toBe("NOT RUN");
  expect(suite.baseline_revision).toMatch(/^[0-9a-f]{40}$/);

  const ids = inputs.map(item => item.id);
  expect(new Set(ids).size).toBe(ids.length);
  expect(suite.cases.map(item => item.id).sort()).toEqual([...ids].sort());
  expect(suite.contrast_pairs.flat().sort()).toEqual([...ids].sort());

  expect(new Set(inputs.map(item => item.lens))).toEqual(new Set(lenses));
  expect(new Set(inputs.map(item => item.dialect))).toEqual(new Set(dialects));

  const byId = new Map(suite.cases.map(item => [item.id, item]));
  const inputById = new Map(inputs.map(item => [item.id, item]));
  for (const [positive, negative] of suite.contrast_pairs) {
    expect(byId.get(positive)?.polarity).toBe("report");
    expect(byId.get(negative)?.polarity).toBe("retain");
    expect(inputById.get(positive)?.lens).toBe(inputById.get(negative)?.lens);
    expect(inputById.get(positive)?.dialect).toBe(inputById.get(negative)?.dialect);
  }
  for (const packet of inputs) {
    expect(packet.id).toMatch(/^SQL\d{2}$/);
    expect(packet.skill).toBe("sql-review");
    expect(Object.keys(packet.files).length).toBeGreaterThan(0);
    for (const filePath of Object.keys(packet.files)) {
      expect(posix.isAbsolute(filePath)).toBe(false);
      expect(filePath.split("/").some(part => ["", ".", ".."].includes(part))).toBe(false);
      expect(posix.normalize(filePath)).toBe(filePath);
    }
    for (const forbidden of ["polarity", "decision", "checks", "contrast_pairs"]) {
      expect(Object.hasOwn(packet, forbidden)).toBe(false);
    }
    const grader = byId.get(packet.id)!;
    expect(grader.checks.length).toBeGreaterThan(0);
    const serialized = JSON.stringify(packet);
    expect(serialized.includes(grader.decision)).toBe(false);
    for (const check of grader.checks) expect(serialized.includes(check)).toBe(false);
  }
  for (const target of [
    "skills/sql-review",
    "adapters/claude/plugin",
    "adapters/codex/super-review",
    "adapters/cursor/plugin",
    "adapters/antigravity/plugin",
  ]) {
    for (const file of files(resolve(root, target))) {
      expect(file.includes("/evals/")).toBe(false);
    }
  }
});
