import { expect, test } from "bun:test";
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { dirname, join, posix, relative, resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const skill = resolve(root, "skills/clickhouse-review");
const read = (path: string) => readFileSync(resolve(root, path), "utf8");
const flat = (path: string) => read(path).replace(/\s+/g, " ");
function files(path: string): string[] {
  return readdirSync(path, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? files(resolve(path, entry.name)) : [resolve(path, entry.name)]);
}
function metadata(path: string) {
  return Bun.YAML.parse(/^---\n([\s\S]*?)\n---/.exec(read(path))![1]) as any;
}
const tools = (role: string) => metadata(`adapters/claude/plugin/agents/${role}.md`).tools.split(", ").sort();
const lenses = ["storage-keys", "mutations-lifecycle", "views-projections", "queries-distributed", "cluster-ddl", "ingestion-client"];
const deployments = ["self-managed", "cloud"] as const;
const roles = ["clickhouse-orchestrator", "clickhouse-reader", "clickhouse-challenger"];

// File delivery, instruction boundaries and fixture integrity only; these do not measure model judgment.
test("the workflow's lens table and lens resources name the same six lenses with safe small-change pairing", () => {
  const workflow = read("skills/clickhouse-review/references/workflow.md");
  const linked = [...workflow.matchAll(/\| \[([a-z-]+)\]\(lenses\/([a-z-]+)\.md\) \|/g)];
  expect(linked.map(match => match[1])).toEqual(lenses);
  for (const match of linked) expect(match[2]).toBe(match[1]);
  expect(readdirSync(resolve(skill, "references/lenses")).sort()).toEqual(lenses.map(name => name + ".md").sort());
  for (const name of lenses) {
    const text = read(`skills/clickhouse-review/references/lenses/${name}.md`);
    expect(text).toMatch(/^# .+\n\n\*\*[^*]+\?\*\*\n/);
    for (const heading of ["## Expect", "## Look for", "## Not a finding"]) expect(text).toContain(heading);
    const bullets = text.split(/\n(?=- )/).slice(1);
    for (const bullet of bullets) {
      const bulletLines = bullet.split(/\n\n/)[0]!.split("\n").length;
      expect(bulletLines).toBeLessThanOrEqual(6);
    }
  }
  const flatWorkflow = flat("skills/clickhouse-review/references/workflow.md");
  expect(flatWorkflow).toContain("pair `storage-keys` with `mutations-lifecycle`, pair `views-projections` with `cluster-ddl`, keep `queries-distributed` solo, and keep `ingestion-client` solo");
  const viewsProj = flat("skills/clickhouse-review/references/lenses/views-projections.md");
  expect(viewsProj).not.toContain("JOIN/WHERE");
  expect(viewsProj).toContain("filtered projections");
  expect(viewsProj).toContain("needs confirmation");
  const mutationsLife = flat("skills/clickhouse-review/references/lenses/mutations-lifecycle.md");
  expect(mutationsLife).toContain("25.8+");
  expect(mutationsLife).toContain("needs confirmation");
  expect(mutationsLife).toContain("tradeoff");
  const queriesDist = flat("skills/clickhouse-review/references/lenses/queries-distributed.md");
  expect(queriesDist).toContain("25.8+");
  expect(queriesDist).toContain("UNKNOWN_SETTING");
  expect(queriesDist).not.toContain("alters output order");
  expect(queriesDist).toContain("needs confirmation");
  const ingestionClient = flat("skills/clickhouse-review/references/lenses/ingestion-client.md");
  expect(ingestionClient).not.toContain("skip MVs attached only to");
  expect(ingestionClient).toContain("attach MVs to the destination");
  const storageKeys = flat("skills/clickhouse-review/references/lenses/storage-keys.md");
  expect(storageKeys).toContain("tradeoff");
  expect(storageKeys).toContain("needs confirmation");
  const clusterDdl = flat("skills/clickhouse-review/references/lenses/cluster-ddl.md");
  expect(clusterDdl).toContain("tradeoff");
  for (const path of [
    ...files(skill).filter(file => file.endsWith(".md")).map(file => relative(root, file)),
    "docs/clickhouse-review.md",
    "docs/review-family.md",
  ]) {
    expect({ path, hasStale257: read(path).includes("25.7+") }).toEqual({ path, hasStale257: false });
  }
});

test("deployment contexts use the five-section baseline template and keep anti-encyclopedia bounds", () => {
  expect(readdirSync(resolve(skill, "references/deployments")).sort()).toEqual(deployments.map(name => name + ".md").sort());
  const titles: Record<(typeof deployments)[number], string> = {
    "self-managed": "Self-managed ClickHouse",
    cloud: "ClickHouse Cloud",
  };
  for (const deployment of deployments) {
    const path = `skills/clickhouse-review/references/deployments/${deployment}.md`;
    const text = read(path);
    const title = titles[deployment];
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
    const bullets = text.split(/\n(?=- )/).slice(1);
    for (const bullet of bullets) {
      const bulletLines = bullet.split(/\n\n/)[0]!.split("\n").length;
      expect(bulletLines).toBeLessThanOrEqual(6);
    }
  }
  const selfManaged = flat("skills/clickhouse-review/references/deployments/self-managed.md");
  expect(selfManaged).toContain("DatabaseReplicated");
  expect(selfManaged).toContain("internal_replication");
  expect(selfManaged).toContain("query_plan_join_swap_table");
  expect(selfManaged).toContain("filtered projections");
  const selfManagedNotFinding = read("skills/clickhouse-review/references/deployments/self-managed.md").split("## Not a finding in Self-managed ClickHouse")[1] ?? "";
  expect(selfManagedNotFinding).not.toContain("FINAL");
  expect(selfManagedNotFinding).not.toContain("Monotonic functions");
  const cloud = flat("skills/clickhouse-review/references/deployments/cloud.md");
  expect(cloud).toContain("SharedMergeTree");
  expect(cloud).toContain("wait_for_async_insert");
  expect(cloud).toContain("CREATE SETTINGS PROFILE");
  expect(cloud).toContain("insert_quorum");
  const cloudNotFinding = read("skills/clickhouse-review/references/deployments/cloud.md").split("## Not a finding in ClickHouse Cloud")[1] ?? "";
  expect(cloudNotFinding).not.toContain("FINAL");
  expect(cloudNotFinding).not.toContain("skipping-index");
});

test("a finding requires four checkable parts, explicit bases, passive diagnostics evidence, and clean scope boundaries", () => {
  const contract = read("skills/clickhouse-review/references/contract.md");
  const flatContract = flat("skills/clickhouse-review/references/contract.md");
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
    expect(read("skills/clickhouse-review/assets/finding-template.md")).toContain(basis);
  }
  for (const evidence of ["EXPLAIN indexes = 1", "system.parts", "system.query_log"]) {
    expect(flatContract).toContain(evidence);
  }
  expect(flatContract).toContain("Read the removed lines");
  expect(flatContract).toContain("A candidate with a missing trace step");
  expect(flatContract).toContain("**unproven**");
  expect(flatContract).toContain("**needs confirmation**");
  expect(flatContract).toContain("**Tradeoff**");
  expect(flatContract).toContain("**Disputed**");
  expect(flatContract).toContain("cosmetic SQL formatting");
  expect(flatContract).toContain("broken query parameterization");
  expect(flatContract).toContain("schema-evolution fragility");
  expect(flatContract).toContain("never reviewed by analogy");
  expect(flatContract).toContain("Statically provable correctness, replication, boundary, and rolling-deploy (`D -> H`) failures do not require `EXPLAIN indexes = 1`, `system.parts`, or `system.query_log`");
  expect(flatContract).toContain("A self-ratifying comment added in the same change, a false premise, or a decision omitting the shown cost is not disputed.");
  expect(flatContract).toContain("split any minimal behavior-keeping fix");
  expect(flatContract).toContain("up to `HEAD`");
  expect(flatContract).toContain("~/.gradle/caches");
  expect(flatContract).toContain("never code-visible SQL, DDL, or explicit setting failures");
  expect(read("skills/clickhouse-review/assets/finding-template.md")).toContain("- Confirmation (if runtime-dependent):");
  expect(flat("skills/clickhouse-review/references/harnesses/antigravity.md")).toContain("effective settings profiles");
  expect(flat("skills/clickhouse-review/references/harnesses/antigravity.md")).toContain("`local -> Distributed` and `source -> MV -> target` dependency maps");
});

test("the challenge is independent and the orchestrator owns all six decision outcomes", () => {
  const challenge = flat("skills/clickhouse-review/references/challenge.md");
  const template = read("skills/clickhouse-review/assets/finding-template.md");
  for (const verdict of ["`stands`", "`falls`", "`tradeoff`", "`disputed`"]) {
    expect(challenge).toContain(verdict);
    expect(template).toContain(verdict);
  }
  expect(template).toContain("no verdict");
  for (const line of [
    "**The mechanism does not hold on this ClickHouse version and deployment.**",
    "**The trigger or data-dependent condition is prevented or unestablished.**",
    "**The safer form is invalid or changes semantics or tradeoffs.**",
    "**The behavior is a deliberate, reasoned choice or out of scope.**",
  ]) {
    expect(challenge).toContain(line);
  }
  expect(challenge).toContain("It does not get the reader's reasoning");
  expect(challenge).toContain("Doubt is not a verdict.");
  expect(challenge).toContain("return `falls` naming the missing check");
  expect(challenge).toContain("filtered projections");
  expect(challenge).toContain("does not make a claim `disputed`: it `stands`");
  const challengeItems = read("skills/clickhouse-review/references/challenge.md").split(/\n(?=\d+\. )/).slice(1);
  expect(challengeItems.length).toBe(4);
  for (const item of challengeItems) {
    const itemLines = item.split(/\n\n/)[0]!.split("\n").length;
    expect(itemLines).toBeLessThanOrEqual(6);
  }
  const workflow = read("skills/clickhouse-review/references/workflow.md");
  const flatWorkflow = flat("skills/clickhouse-review/references/workflow.md");
  expect(flatWorkflow).toContain("Strip the reader's reasoning");
  expect(workflow).toContain("**Walk each trace yourself.**");
  expect(workflow).toContain("**Emit one coherent per-table/pipeline DDL sequence.**");
  expect(workflow).toContain("**Weigh the challenge as an argument, not a ruling.**");
  expect(flatWorkflow).toContain("refute `falls` demanding `EXPLAIN` or `system.parts` on static correctness, replication, boundary, or `D -> H` bugs");
  expect(flatWorkflow).toContain("when `falls` rests only on unconfirmed server version, deployment mode, volume, cardinality, ingest rate, or missing `EXPLAIN indexes = 1` / `system.parts` / `system.query_log` while the static mechanism holds, route to `needs confirmation`");
  for (const outcome of ["| finding |", "| tradeoff |", "| disputed |", "| needs confirmation |", "| unproven |", "| rejected |"]) {
    expect(workflow).toContain(outcome);
  }
  expect(read("adapters/claude/plugin/agents/clickhouse-challenger.md")).toContain("you are not told what anyone hopes for");
});

test("the report template keeps compact fragility, confirmation questions, and zero em-dashes across the skill", () => {
  const report = read("skills/clickhouse-review/assets/report-template.md");
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
  for (const evidence of ["EXPLAIN indexes = 1", "system.parts", "system.query_log"]) {
    expect(report).toContain(evidence);
  }
  const mdTargets = [
    ...files(skill).filter(path => path.endsWith(".md")).map(path => relative(root, path)),
    ...roles.map(role => `adapters/claude/${role}.md`),
    "adapters/claude/clickhouse-skill.md",
    ...["clickhouse-review", "clickhouse-reader", "clickhouse-challenger"].map(role => `adapters/opencode/agents/${role}.md`),
    "adapters/opencode/commands/clickhouse-review.md",
    "adapters/antigravity/clickhouse-review.md",
    "adapters/antigravity/agents/clickhouse-reader.md",
    "adapters/antigravity/agents/clickhouse-challenger.md",
  ];
  for (const rel of mdTargets) {
    const content = read(rel);
    expect({ file: rel, hasEmDash: content.includes("—") }).toEqual({ file: rel, hasEmDash: false });
    expect({ file: rel, hasLatexMath: /\$N\^2\$/.test(content) }).toEqual({ file: rel, hasLatexMath: false });
    // Every bullet or numbered item stays within the 6-line AGENTS.md bound.
    let itemStart = -1;
    let itemLines = 0;
    const lines = content.split("\n");
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

test("the review only reads: no ClickHouse execution, no write tools, and no runnable ClickHouse CLI commands", () => {
  const contract = flat("skills/clickhouse-review/references/contract.md");
  expect(contract).toContain("This review reads. It does not connect to a ClickHouse cluster, run ClickHouse CLIs, send HTTP queries, apply migrations, execute queries, build or run project code, write files, or clone, copy or check out the repository.");
  expect(tools("clickhouse-orchestrator")).toEqual(["Agent", "Bash", "Glob", "Grep", "Read"]);
  for (const role of ["clickhouse-reader", "clickhouse-challenger"]) expect(tools(role)).toEqual(["Bash", "Glob", "Grep", "Read"]);
  for (const role of roles) {
    const text = flat(`adapters/claude/plugin/agents/${role}.md`);
    expect(text).toContain("Never connect to ClickHouse, run ClickHouse CLIs, apply migrations, execute queries");
    expect(text).toContain("user's checkout");
  }
  // Forbid runnable ClickHouse CLI, HTTP, or migration commands while allowing passive EXPLAIN/system.* mentions.
  const chLaunch = /\bclickhouse-client\s+|\bclickhouse-local\s+|\bclickhouse-benchmark\s+|\bclickhouse\s+(?:client|local)\b|\bcurl\s+[^\n]*(?:8123|8443)|\bdocker\s+exec\b[^\n]*\bclickhouse\b|\bgoose\s+up\b|\bclickhouse-migrator\b|\batlas\s+migrate\s+apply\b/;
  const instructions = [
    ...files(skill).filter(file => file.endsWith(".md")).map(file => relative(root, file)),
    ...roles.map(role => `adapters/claude/${role}.md`),
    "adapters/claude/clickhouse-skill.md",
    ...["clickhouse-review", "clickhouse-reader", "clickhouse-challenger"].map(role => `adapters/opencode/agents/${role}.md`),
    "adapters/opencode/commands/clickhouse-review.md",
    "adapters/antigravity/clickhouse-review.md",
    "adapters/antigravity/agents/clickhouse-reader.md",
    "adapters/antigravity/agents/clickhouse-challenger.md",
  ];
  for (const path of instructions) {
    expect({ path, match: read(path).match(chLaunch)?.[0] ?? null }).toEqual({ path, match: null });
  }
});

test("the Claude command runs the ClickHouse orchestrator on the packaged skill", () => {
  const path = "adapters/claude/plugin/skills/clickhouse/SKILL.md";
  const command = metadata(path);
  expect(command.agent).toBe("super-review:clickhouse-orchestrator");
  expect(command.context).toBe("fork");
  expect(command.background).toBe(false);
  expect(command["disable-model-invocation"]).toBe(true);
  expect(read(path)).toContain("${CLAUDE_PLUGIN_ROOT}/resources/clickhouse-review/SKILL.md");
});

test("delivery copies are identical across supported hosts and absent in Cursor", () => {
  const names = files(skill).map(file => relative(skill, file));
  for (const packageRoot of [
    "adapters/claude/plugin/resources/clickhouse-review",
    "adapters/codex/super-review/skills/clickhouse-review",
    "adapters/antigravity/plugin/resources/clickhouse-review",
  ]) {
    expect(files(resolve(root, packageRoot)).map(file => relative(resolve(root, packageRoot), file)).sort()).toEqual([...names].sort());
    for (const name of names) expect(read(`${packageRoot}/${name}`)).toBe(read(`skills/clickhouse-review/${name}`));
  }
  for (const role of roles) expect(read(`adapters/claude/plugin/agents/${role}.md`)).toBe(read(`adapters/claude/${role}.md`));
  expect(existsSync(resolve(root, "adapters/cursor/plugin/resources/clickhouse-review"))).toBe(false);
  for (const role of ["clickhouse-review", "clickhouse-reader", "clickhouse-challenger"]) expect(existsSync(resolve(root, `adapters/opencode/agents/${role}.md`))).toBe(true);
  expect(read("scripts/package.py")).toContain('"clickhouse-review"');
  const skillMeta = metadata("skills/clickhouse-review/SKILL.md");
  expect(skillMeta.metadata.version).toBe("0.2.0");
  expect(skillMeta["disable-model-invocation"]).toBe(true);
  const openAi = Bun.YAML.parse(read("skills/clickhouse-review/agents/openai.yaml")) as any;
  expect(openAi.policy.allow_implicit_invocation).toBe(false);
});

test("clickhouse-review evaluator packets are isolated, symmetric across all lenses, deployments and outcomes, syntactically valid, and stay out of packaged plugins", () => {
  type Outcome = "finding" | "finding+tradeoff" | "tradeoff" | "disputed" | "needs confirmation" | "retain";
  type Packet = {
    id: string;
    skill: string;
    deployment: string;
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
  const { inputs } = JSON.parse(read("evals/clickhouse-review/inputs.json")) as { inputs: Packet[] };
  const suite = JSON.parse(read("evals/clickhouse-review/cases.json")) as {
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
  expect(new Set(inputs.map(item => item.deployment))).toEqual(new Set(deployments));
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
    expect(inputById.get(positive)?.deployment).toBe(inputById.get(contrast)?.deployment);
  }

  const scratch = mkdtempSync(join(tmpdir(), "clickhouse-eval-verify-"));
  try {
    for (const packet of inputs) {
      expect(packet.id).toMatch(/^CH\d{2}$/);
      expect(packet.skill).toBe("clickhouse-review");
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
          // Strip -- and /* */ comments outside single quotes, then verify balanced parens/quotes and quote-aware statements.
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
            if (!inQuote && ch === "/" && content[i + 1] === "*") {
              const closeIdx = content.indexOf("*/", i + 2);
              expect(closeIdx).toBeGreaterThan(-1);
              i = closeIdx + 1;
              current += " ";
              continue;
            }
            if (ch === "'") {
              if (inQuote && content[i + 1] === "'") {
                current += "''";
                i++;
                continue;
              }
              let backslashes = 0;
              for (let j = i - 1; j >= 0 && content[j] === "\\"; j--) backslashes++;
              if (backslashes % 2 === 0) inQuote = !inQuote;
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
            expect(stmt).toMatch(/^(?:CREATE|ALTER|SELECT|INSERT|UPDATE|DELETE|DROP|ATTACH|DETACH|EXCHANGE|SYSTEM|SET)\b/i);
            // ClickHouse forbids combining TO [db.]table with POPULATE in a single CREATE MATERIALIZED VIEW statement.
            expect(stmt).not.toMatch(/^CREATE\s+MATERIALIZED\s+VIEW[\s\S]*\bTO\b[\s\S]*\bPOPULATE\b/i);
          }
          const polarity = byId.get(packet.id)?.polarity;
          if (polarity === "retain" || polarity === "calibrate") {
            expect({ packet: packet.id, filePath, invalidTypeWrapper: /Nullable\s*\(\s*LowCardinality\s*\(/i.test(content) }).toEqual({
              packet: packet.id,
              filePath,
              invalidTypeWrapper: false,
            });
          }
          if (packet.deployment === "self-managed" && (polarity === "retain" || polarity === "calibrate")) {
            for (const match of content.matchAll(/Replicated\w*MergeTree\(\s*'([^']+)'/g)) {
              expect({ packet: packet.id, filePath, path: match[1] }).toEqual({
                packet: packet.id,
                filePath,
                path: match[1]!.includes("{uuid}") ? match[1] : `${match[1]} (missing {uuid})`,
              });
            }
          }
          if (packet.deployment === "self-managed") {
            const xmlContent = Object.entries(packet.files).filter(([k]) => k.endsWith(".xml")).map(([, v]) => v).join("\n");
            for (const match of content.matchAll(/\bON\s+CLUSTER\s+([A-Za-z0-9_]+)/gi)) {
              const cluster = match[1]!;
              expect({ packet: packet.id, filePath, cluster, declaredInXml: xmlContent.includes(`<${cluster}>`) }).toEqual({
                packet: packet.id,
                filePath,
                cluster,
                declaredInXml: true,
              });
            }
          }
        }
        if (filePath.endsWith(".json")) {
          expect(() => JSON.parse(content)).not.toThrow();
        }
        if (filePath.endsWith(".md")) {
          for (const match of content.matchAll(/`(EXPLAIN [^`]+)`/g)) {
            const quoteCount = (match[1]!.match(/'/g) ?? []).length;
            expect({ packet: packet.id, filePath, snippet: match[1], quoteCount: quoteCount % 2 }).toEqual({
              packet: packet.id,
              filePath,
              snippet: match[1],
              quoteCount: 0,
            });
          }
        }
        if (filePath.endsWith(".xml")) {
          const xmlCheck = spawnSync("python3", ["-c", "import sys, xml.etree.ElementTree as ET; ET.parse(sys.argv[1])", dest], { encoding: "utf8" });
          expect({ packet: packet.id, filePath, status: xmlCheck.status, stderr: xmlCheck.stderr }).toEqual({ packet: packet.id, filePath, status: 0, stderr: "" });
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

      // Typecheck TypeScript client fixtures strictly using the repository's tsc.
      if (Object.keys(packet.files).some(f => f.endsWith(".ts"))) {
        const dir = join(scratch, packet.id);
        writeFileSync(join(dir, "clickhouse-client.d.ts"), [
          'declare module "@clickhouse/client" {',
          "  export interface Row { json<T = unknown>(): T; text: string; }",
          "  export interface ResultSet { json<T = unknown>(): Promise<T[]>; stream(): AsyncIterable<Row[]>; close(): void; }",
          "  export interface ClickHouseClient {",
          "    insert(params: { table: string; values: unknown[]; format?: string; clickhouse_settings?: Record<string, string | number | boolean> }): Promise<void>;",
          "    query(params: { query: string; query_params?: Record<string, unknown>; format?: string; clickhouse_settings?: Record<string, string | number | boolean> }): Promise<ResultSet>;",
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
          include: ["src/**/*.ts", "clickhouse-client.d.ts"],
        }));
        const tsc = spawnSync(resolve(root, "node_modules/.bin/tsc"), ["-p", join(dir, "tsconfig.json")], { encoding: "utf8" });
        expect({ packet: packet.id, status: tsc.status, out: tsc.stdout + tsc.stderr }).toEqual({ packet: packet.id, status: 0, out: "" });
        for (const [filePath, content] of Object.entries(packet.files)) {
          if (filePath.endsWith(".ts")) expect(content).not.toContain("await resultSet.close(");
        }
      }

      // Vet Go client fixtures when go is available on PATH.
      if (Object.keys(packet.files).some(f => f.endsWith(".go")) && Bun.which("go")) {
        const dir = join(scratch, packet.id);
        const stubDir = join(dir, "stubs/ch");
        mkdirSync(stubDir, { recursive: true });
        writeFileSync(join(stubDir, "go.mod"), "module github.com/ClickHouse/clickhouse-go/v2\ngo 1.23\n");
        writeFileSync(join(stubDir, "clickhouse.go"), [
          "package clickhouse",
          'import "context"',
          "func Named(name string, value any) any { return nil }",
          "type Batch interface { Append(v ...any) error; Send() error; Abort() error; Close() error; IsSent() bool }",
          "type Conn interface { Exec(ctx context.Context, query string, args ...any) error; PrepareBatch(ctx context.Context, query string, opts ...any) (Batch, error) }",
        ].join("\n"));
        writeFileSync(join(dir, "go.mod"), readFileSync(join(dir, "go.mod"), "utf8") + "\nreplace github.com/ClickHouse/clickhouse-go/v2 => ./stubs/ch\n");
        const govet = spawnSync("go", ["vet", "./..."], { cwd: dir, encoding: "utf8" });
        expect({ packet: packet.id, status: govet.status, out: govet.stdout + govet.stderr }).toEqual({ packet: packet.id, status: 0, out: "" });
      }
    }
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }

  for (const target of [
    "skills/clickhouse-review",
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
