import { expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, posix, relative, resolve } from "node:path";

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
  expect(flat("skills/sql-review/references/dialects/mysql.md")).toContain("antijoin");
  expect(flat("skills/sql-review/references/dialects/mysql.md")).toContain("InnoDB automatically creates");
  expect(flat("skills/sql-review/references/dialects/postgresql.md")).toContain("skip scan");
  expect(flat("skills/sql-review/references/dialects/postgresql.md")).toContain("separate transactions");
  expect(flat("skills/sql-review/references/dialects/sqlite.md")).toContain("IEEE-754");
  expect(read("skills/sql-review/references/dialects/mysql.md")).not.toMatch(/8\.0\.(?:13|16|29)\+/);
  expect(read("skills/sql-review/references/dialects/sqlite.md")).not.toMatch(/3\.(?:35|37|39)\.0\+/);
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
  expect(flatContract).toContain("migration runner transactional mode");
  expect(flatContract).toContain("RESET lock_timeout");
  expect(flatContract).toContain("report that safe part as its own finding beside the tradeoff");
  expect(flatContract).toContain("~/.gradle/caches");
  expect(flatContract).toContain("Never download packages");
});

test("the challenge is independent and the orchestrator owns all six decision outcomes", () => {
  const challenge = flat("skills/sql-review/references/challenge.md");
  const template = read("skills/sql-review/assets/finding-template.md");
  for (const verdict of ["`stands`", "`falls`", "`tradeoff`", "`disputed`"]) {
    expect(challenge).toContain(verdict);
    expect(template).toContain(verdict);
  }
  expect(template).toContain("no verdict");
  expect(template).toContain("Confirmation (if runtime-dependent):");
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
  expect(challenge).toContain("Never dismiss statically provable");
  expect(challenge).toContain("does not make a claim `disputed`: it `stands`");
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
  expect(flatWorkflow).toContain("When `falls` rests only on unconfirmed server version, runner tx mode, live-traffic status, scale, cardinality, or missing `EXPLAIN` while the static mechanism holds, route to `needs confirmation`");
  expect(flatWorkflow).toContain("ordered migration manifest and per-table file chains");
  expect(flatWorkflow).toContain("never widen `UNIQUE (a, b)` into `UNIQUE (a, b, c)`");
  expect(flatWorkflow).toContain("split any behavior-keeping safe part into its own `finding`");
  for (const outcome of ["| finding |", "| tradeoff |", "| disputed |", "| needs confirmation |", "| unproven |", "| rejected |"]) {
    expect(workflow).toContain(outcome);
  }
  expect(read("adapters/claude/plugin/agents/sql-challenger.md")).toContain("you are not told what anyone hopes for");
  expect(flat("adapters/antigravity/agents/sql-reader.md")).toContain("route runtime-dependent claims to confirmation");
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
  const mdTargets = [
    ...files(skill).filter(path => path.endsWith(".md")).map(path => relative(root, path)),
    ...roles.map(role => `adapters/claude/${role}.md`),
    "adapters/claude/sql-skill.md",
    ...["sql-review", "sql-reader", "sql-challenger"].map(role => `adapters/opencode/agents/${role}.md`),
    "adapters/opencode/commands/sql-review.md",
    "adapters/antigravity/sql-review.md",
    "adapters/antigravity/agents/sql-reader.md",
    "adapters/antigravity/agents/sql-challenger.md",
  ];
  for (const rel of mdTargets) {
    const text = read(rel);
    expect({ file: rel, hasEmDash: text.includes("—") }).toEqual({ file: rel, hasEmDash: false });
    // Every bullet or numbered item stays within the 6-line AGENTS.md bound.
    let itemStart = -1;
    let itemLines = 0;
    const lines = text.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]!;
      if (/^\s*(?:- |\d+\. )/.test(line)) {
        if (itemStart !== -1) expect({ file: rel, line: itemStart, itemLines }).toEqual({ file: rel, line: itemStart, itemLines: Math.min(itemLines, 6) });
        itemStart = i + 1;
        itemLines = 1;
      } else if (itemStart !== -1 && line.trim() !== "" && !line.startsWith("#") && !line.startsWith("|")) {
        itemLines++;
      } else {
        if (itemStart !== -1) expect({ file: rel, line: itemStart, itemLines }).toEqual({ file: rel, line: itemStart, itemLines: Math.min(itemLines, 6) });
        itemStart = -1;
        itemLines = 0;
      }
    }
    if (itemStart !== -1) expect({ file: rel, line: itemStart, itemLines }).toEqual({ file: rel, line: itemStart, itemLines: Math.min(itemLines, 6) });
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
  expect(skillMeta.metadata.version).toBe("0.2.0");
  expect(skillMeta["disable-model-invocation"]).toBe(true);
  const openAi = Bun.YAML.parse(read("skills/sql-review/agents/openai.yaml")) as any;
  expect(openAi.policy.allow_implicit_invocation).toBe(false);
});

test("sql-review evaluator packets are isolated, symmetric across all lenses, dialects and outcomes, and stay out of packaged plugins", () => {
  type Outcome = "finding" | "finding+tradeoff" | "tradeoff" | "disputed" | "needs confirmation" | "retain";
  type Packet = {
    id: string;
    skill: string;
    dialect: string;
    lens: string;
    lenses?: string[];
    request: string;
    scope: string;
    files: Record<string, string>;
  };
  type GraderCase = {
    id: string;
    polarity: "report" | "retain" | "calibrate";
    expected_outcome: Outcome;
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
  expect(new Set(suite.cases.map(item => item.expected_outcome))).toEqual(
    new Set(["finding", "finding+tradeoff", "tradeoff", "disputed", "needs confirmation", "retain"]),
  );

  const byId = new Map(suite.cases.map(item => [item.id, item]));
  const inputById = new Map(inputs.map(item => [item.id, item]));
  for (const [positive, contrast] of suite.contrast_pairs) {
    const pos = byId.get(positive)!;
    const neg = byId.get(contrast)!;
    expect(pos.polarity).toBe("report");
    expect(["finding", "finding+tradeoff"]).toContain(pos.expected_outcome);
    if (neg.expected_outcome === "retain") {
      expect(neg.polarity).toBe("retain");
    } else {
      expect(neg.polarity).toBe("calibrate");
      expect(["tradeoff", "disputed", "needs confirmation"]).toContain(neg.expected_outcome);
    }
    expect(pos.expected_outcome).not.toBe(neg.expected_outcome);
    expect(inputById.get(positive)?.lens).toBe(inputById.get(contrast)?.lens);
    expect(inputById.get(positive)?.lenses).toEqual(inputById.get(contrast)?.lenses);
    expect(inputById.get(positive)?.dialect).toBe(inputById.get(contrast)?.dialect);
  }
  const scratch = mkdtempSync(join(tmpdir(), "sql-eval-verify-"));
  try {
    for (const packet of inputs) {
      expect(packet.id).toMatch(/^SQL\d{2}$/);
      expect(packet.skill).toBe("sql-review");
      if (packet.lenses) {
        expect(packet.lenses.length).toBeGreaterThan(1);
        expect(packet.lenses).toContain(packet.lens);
        for (const extraLens of packet.lenses) expect(lenses).toContain(extraLens);
      }
      expect(Object.keys(packet.files).length).toBeGreaterThan(0);
      for (const [filePath, content] of Object.entries(packet.files)) {
        expect(posix.isAbsolute(filePath)).toBe(false);
        expect(filePath.split("/").some(part => ["", ".", ".."].includes(part))).toBe(false);
        expect(posix.normalize(filePath)).toBe(filePath);
        const dest = join(scratch, packet.id, filePath);
        mkdirSync(dirname(dest), { recursive: true });
        writeFileSync(dest, content);

        if (filePath.endsWith(".sql")) {
          // Strip -- line comments outside single-quoted literals, then verify balanced parens/quotes and quote-aware statements.
          let current = "";
          const statements: string[] = [];
          let depth = 0;
          let inQuote = false;
          let endsWithSemicolon = false;
          for (let i = 0; i < content.length; i++) {
            const ch = content[i];
            if (!inQuote && ch === "-" && content[i + 1] === "-") {
              while (i < content.length && content[i] !== "\n") i++;
              current += "\n";
              continue;
            }
            if (ch === "'") {
              if (inQuote && content[i + 1] === "'") {
                current += "''";
                i++;
                continue;
              }
              if (content[i - 1] !== "\\") inQuote = !inQuote;
            } else if (!inQuote && ch === "(") {
              depth++;
            } else if (!inQuote && ch === ")") {
              depth--;
            } else if (!inQuote && ch === ";") {
              const trimmed = current.trim();
              if (trimmed) statements.push(trimmed);
              current = "";
              endsWithSemicolon = true;
              continue;
            }
            expect(depth).toBeGreaterThanOrEqual(0);
            if (ch && !/\s/.test(ch)) endsWithSemicolon = false;
            current += ch;
          }
          expect(inQuote).toBe(false);
          expect(depth).toBe(0);
          expect(endsWithSemicolon).toBe(true);
          expect(current.trim()).toBe("");
          expect(statements.length).toBeGreaterThan(0);
          for (const stmt of statements) {
            expect(stmt).toMatch(/^(?:CREATE|ALTER|SELECT|INSERT|UPDATE|DELETE|SET|RESET|DROP)\b/i);
          }
        }
        if (filePath.endsWith(".json")) {
          expect(() => JSON.parse(content)).not.toThrow();
        }
      }
      for (const forbidden of ["polarity", "expected_outcome", "decision", "checks", "contrast_pairs"]) {
        expect(Object.hasOwn(packet, forbidden)).toBe(false);
      }
      const grader = byId.get(packet.id)!;
      expect(grader.checks.length).toBeGreaterThan(0);
      const serialized = JSON.stringify(packet);
      expect(serialized.includes(grader.decision)).toBe(false);
      for (const check of grader.checks) expect(serialized.includes(check)).toBe(false);

      // Typecheck TypeScript fixtures strictly using the repository's tsc.
      if (Object.keys(packet.files).some(f => f.endsWith(".ts"))) {
        const dir = join(scratch, packet.id);
        writeFileSync(join(dir, "db-stubs.d.ts"), [
          'declare module "better-sqlite3" {',
          "  interface Statement { all(...params: unknown[]): unknown[]; }",
          "  class Database { constructor(path: string); pragma(sql: string): unknown; prepare(sql: string): Statement; }",
          "  namespace Database { export type Database = InstanceType<typeof Database>; }",
          "  export default Database;",
          "}",
          'declare module "pg" {',
          "  export interface QueryResult<R = unknown> { rows: R[]; }",
          "  export interface Pool { query<R = unknown>(text: string, values?: readonly unknown[]): Promise<QueryResult<R>>; }",
          "}",
          'declare module "mysql2/promise" {',
          "  export type RowDataPacket = Record<string, unknown>;",
          "  export interface Pool {",
          "    query<R = unknown>(sql: string, values?: readonly unknown[]): Promise<[R, unknown]>;",
          "    execute<R = unknown>(sql: string, values?: readonly unknown[]): Promise<[R, unknown]>;",
          "  }",
          "}",
        ].join("\n"));
        writeFileSync(join(dir, "tsconfig.json"), JSON.stringify({
          compilerOptions: {
            strict: true,
            noUnusedLocals: true,
            noUnusedParameters: true,
            noEmit: true,
            target: "ES2022",
            module: "ESNext",
            moduleResolution: "bundler",
            skipLibCheck: true,
          },
          include: ["**/*.ts"],
        }));
        const tsc = spawnSync(resolve(root, "node_modules/.bin/tsc"), ["-p", join(dir, "tsconfig.json")], { encoding: "utf8" });
        expect({ packet: packet.id, status: tsc.status, out: tsc.stdout + tsc.stderr }).toEqual({ packet: packet.id, status: 0, out: "" });
      }

      // Vet Go fixtures when go is available on PATH.
      if (Object.keys(packet.files).some(f => f.endsWith(".go")) && Bun.which("go")) {
        const dir = join(scratch, packet.id);
        const stubDir = join(dir, "stubs/pgx");
        mkdirSync(join(stubDir, "pgxpool"), { recursive: true });
        writeFileSync(join(stubDir, "go.mod"), "module github.com/jackc/pgx/v5\ngo 1.23\n");
        writeFileSync(join(stubDir, "pgx.go"), [
          "package pgx",
          'import ("context"; "errors")',
          'var ErrNoRows = errors.New("no rows in result set")',
          "type Row interface { Scan(dest ...any) error }",
          "type CommandTag struct{}",
          "type Tx interface {",
          "  QueryRow(ctx context.Context, sql string, args ...any) Row",
          "  Exec(ctx context.Context, sql string, args ...any) (CommandTag, error)",
          "  Commit(ctx context.Context) error",
          "  Rollback(ctx context.Context) error",
          "}",
        ].join("\n"));
        writeFileSync(join(stubDir, "pgxpool/pgxpool.go"), [
          "package pgxpool",
          'import ("context"; "github.com/jackc/pgx/v5")',
          "type Pool struct{}",
          "func (*Pool) Begin(ctx context.Context) (pgx.Tx, error) { return nil, nil }",
          "func (*Pool) QueryRow(ctx context.Context, sql string, args ...any) pgx.Row { return nil }",
          "func (*Pool) Exec(ctx context.Context, sql string, args ...any) (pgx.CommandTag, error) { return pgx.CommandTag{}, nil }",
        ].join("\n"));
        writeFileSync(join(dir, "go.mod"), readFileSync(join(dir, "go.mod"), "utf8") + "\nreplace github.com/jackc/pgx/v5 => ./stubs/pgx\n");
        const govet = spawnSync("go", ["vet", "./..."], { cwd: dir, encoding: "utf8" });
        expect({ packet: packet.id, status: govet.status, out: govet.stdout + govet.stderr }).toEqual({ packet: packet.id, status: 0, out: "" });
      }
    }
  } finally {
    rmSync(scratch, { recursive: true, force: true });
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
}, 20000);
