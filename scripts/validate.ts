import { readdir, readFile } from "node:fs/promises";
import { resolve, dirname, relative, join } from "node:path";

const root = resolve(import.meta.dir, "..");
const skill = join(root, "skills/super-review");
const manifest = JSON.parse(await readFile(join(root, "package.json"), "utf8"));
const errors: string[] = [];
async function walk(path: string): Promise<string[]> {
  const entries = await readdir(path, { withFileTypes: true });
  return (await Promise.all(entries.map(e => e.isDirectory() ? walk(join(path, e.name)) : [join(path, e.name)]))).flat();
}
function frontmatter(text: string): any {
  const match = /^---\n([\s\S]*?)\n---/.exec(text);
  if (!match) throw new Error("Missing frontmatter");
  return Bun.YAML.parse(match[1]);
}
// A skill is self-contained: finished text, and links that stay inside its own files.
function checkMarkdown(skillRoot: string, files: string[], file: string, text: string) {
  if (/\[TODO[:\]]/.test(text)) errors.push("Unfinished scaffold: " + file);
  for (const match of text.matchAll(/\]\(([^)]+)\)/g)) {
    const target = match[1].split("#")[0];
    if (!target || /^[a-z]+:\/\//i.test(target)) continue;
    const path = resolve(dirname(file), decodeURIComponent(target));
    if (relative(skillRoot, path).startsWith("..") || !files.includes(path)) errors.push("Missing or unpackaged link: " + relative(root, file) + " -> " + target);
  }
}
const entry = frontmatter(await readFile(join(skill, "SKILL.md"), "utf8"));
if (entry.name !== "super-review" || !entry.description || entry.metadata?.version !== manifest.version) errors.push("Skill identity/version mismatch.");
const ids = new Set<string>();
const runtimeFiles = await walk(skill);
for (const file of runtimeFiles.filter(p => p.endsWith(".md"))) {
  const text = await readFile(file, "utf8");
  checkMarkdown(skill, runtimeFiles, file, text);
  if (file.includes("/lenses/")) for (const match of text.matchAll(/^## ((?:go|ts|rust|java)\.[a-z0-9.-]+)$/gm)) {
    if (ids.has(match[1])) errors.push("Duplicate rule ID: " + match[1]);
    ids.add(match[1]);
  }
}
for (const [language, prefix] of [["go", "go"], ["typescript", "ts"], ["rust", "rust"], ["java", "java"]]) {
  const expected: string[] = JSON.parse(await readFile(join(root, "evals/" + language + "/rule-ids.json"), "utf8"));
  const actual = [...ids].filter(id => id.startsWith(prefix + ".")).sort();
  if (!actual.length || JSON.stringify(actual) !== JSON.stringify(expected.sort())) errors.push(language + " rule IDs changed: document migration and update the manifest intentionally.");
}
const openCodeRoles: Record<string, string[]> = {
  "super-review": ["super-review-specialist"],
  "defect-review": ["defect-reader", "defect-challenger"],
  "test-review": ["test-reader"],
  "perf-review": ["perf-reader", "perf-challenger"],
};
for (const [primary, children] of Object.entries(openCodeRoles)) {
  for (const role of [primary, ...children]) {
    const config = frontmatter(await readFile(join(root, "adapters/opencode/agents/" + role + ".md"), "utf8"));
    if (config.permission?.["*"] !== "deny") errors.push(role + " does not deny unlisted tools.");
    if (config.model) errors.push(role + " unexpectedly pins a user model.");
    if (config.mode !== (role === primary ? "primary" : "subagent")) errors.push(role + " runs at the wrong level.");
    const delegates = Object.keys(config.permission?.task ?? {}).filter(name => config.permission.task[name] === "allow").sort();
    if (JSON.stringify(delegates) !== JSON.stringify(role === primary ? [...children].sort() : [])) errors.push(role + " delegates to unexpected roles.");
  }
  const command = frontmatter(await readFile(join(root, "adapters/opencode/commands/" + primary + ".md"), "utf8"));
  if (command.agent !== primary || command.subtask !== false) errors.push("Command would prevent primary orchestration: " + primary);
}
for (const path of ["plugin.json", ".codex-plugin/plugin.json", "adapters/claude/plugin/.claude-plugin/plugin.json", "adapters/codex/super-review/.codex-plugin/plugin.json", "adapters/cursor/plugin/.cursor-plugin/plugin.json"]) {
  const native = JSON.parse(await readFile(join(root, path), "utf8"));
  if (native.name !== "super-review" || native.version.split("+")[0] !== manifest.version) errors.push("Native identity/version mismatch: " + path);
}
for (const file of runtimeFiles) {
  const packaged = join(root, "adapters/claude/plugin/resources/super-review", relative(skill, file));
  if (!(await readFile(file)).equals(await readFile(packaged))) errors.push("Stale Claude policy: " + relative(skill, file));
}
const claudeEntry = frontmatter(await readFile(join(root, "adapters/claude/plugin/skills/review/SKILL.md"), "utf8"));
if (claudeEntry.context !== "fork" || claudeEntry.background !== false || claudeEntry.agent !== "super-review:orchestrator" || claudeEntry["disable-model-invocation"] !== true) errors.push("Claude command routing differs from the explicit isolated review.");
for (const role of ["orchestrator", "specialist"]) {
  const agent = frontmatter(await readFile(join(root, "adapters/claude/plugin/agents/" + role + ".md"), "utf8"));
  const [model, effort] = role === "orchestrator" ? ["inherit", undefined] : ["sonnet", "medium"];
  if (agent.model !== model || agent.effort !== effort) errors.push("Claude " + role + " must run on " + model + (effort ? "/" + effort : " with session effort") + ".");
  const allowed = agent.tools.split(",").map((s: string) => s.trim());
  const expectedTools = role === "orchestrator" ? ["Agent", "Read", "Glob", "Grep", "Bash"] : ["Read", "Glob", "Grep", "Bash"];
  if (JSON.stringify(allowed.sort()) !== JSON.stringify(expectedTools.sort())) errors.push("Unexpected Claude native tools: " + role);
}
if ("model" in claudeEntry || "effort" in claudeEntry) errors.push("Claude command must leave the orchestrator on the session model and effort.");
const openCodeModels = JSON.parse(await readFile(join(root, "adapters/opencode/opencode.json"), "utf8"));
for (const role of Object.values(openCodeRoles).flat()) {
  if (openCodeModels.agent?.[role]?.model !== "{env:SUPER_REVIEW_SPECIALIST_MODEL}") errors.push("OpenCode must require an explicit model for " + role + ".");
}
if (openCodeModels.model) errors.push("OpenCode must not override the orchestrator model.");
const catalog = JSON.parse(await readFile(join(root, ".agents/plugins/marketplace.json"), "utf8"));
if (catalog.plugins[0]?.source?.path !== "./adapters/codex/super-review") errors.push("The project catalog must point at the native Codex package.");
const cursorMarketplace = JSON.parse(await readFile(join(root, ".cursor-plugin/marketplace.json"), "utf8"));
if (cursorMarketplace.name !== "super-review" || cursorMarketplace.plugins?.[0]?.name !== "super-review" || cursorMarketplace.plugins?.[0]?.source !== "adapters/cursor/plugin") {
  errors.push("The Cursor marketplace manifest must point at the native Cursor package.");
}
for (const file of runtimeFiles) {
  const packaged = join(root, "adapters/codex/super-review/skills/super-review", relative(skill, file));
  if (!(await readFile(file)).equals(await readFile(packaged))) errors.push("Stale Codex policy: " + relative(skill, file));
}
const cursor = join(root, "adapters/cursor/plugin");
const cursorEntry = frontmatter(await readFile(join(cursor, "skills/super-review/SKILL.md"), "utf8"));
if (cursorEntry.name !== "super-review" || cursorEntry["disable-model-invocation"] !== true || ["model", "effort", "context", "agent"].some(key => key in cursorEntry)) errors.push("Cursor must run explicitly in the existing chat without overriding its model.");
const cursorAgent = frontmatter(await readFile(join(cursor, "agents/super-review-specialist.md"), "utf8"));
if (cursorAgent.name !== "super-review-specialist" || cursorAgent.model !== "inherit" || cursorAgent.readonly !== true || cursorAgent.is_background !== false || "effort" in cursorAgent) errors.push("Cursor specialist must inherit the parent model and stay read-only.");
for (const [source, target] of [["adapters/cursor/skill.md", "skills/super-review/SKILL.md"], ["adapters/cursor/specialist.md", "agents/super-review-specialist.md"], ["docs/cursor.md", "README.md"]]) {
  if (!(await readFile(join(root, source))).equals(await readFile(join(cursor, target)))) errors.push("Stale Cursor template: " + source);
}
for (const file of runtimeFiles) {
  const packaged = join(cursor, "resources/super-review", relative(skill, file));
  if (!(await readFile(file)).equals(await readFile(packaged))) errors.push("Stale Cursor policy: " + relative(skill, file));
}
for (const directory of ["skills/super-review", "adapters/claude/plugin", "adapters/codex/super-review", "adapters/opencode", "adapters/cursor/plugin"]) {
  const files = await walk(join(root, directory));
  if (files.some(file => /(?:^|\/)(?:\.?mcp\.json|mcp\.mjs)$/.test(file) || file.includes("/runtime/"))) errors.push("Legacy runtime shipped in " + directory);
}
for (const file of [".codex-plugin/plugin.json", "adapters/codex/super-review/.codex-plugin/plugin.json", "adapters/cursor/plugin/.cursor-plugin/plugin.json"]) {
  if (JSON.parse(await readFile(join(root, file), "utf8")).mcpServers) errors.push("Legacy server declaration in " + file);
}
// Defect Review, Test Review and Performance Review: separate skills with their own contracts, versions and roles.
// All read only: no role may hold Write or Edit.
for (const [name, command, title, reader, challenger] of [
  ["defect-review", "defects", "Defect Review", "specialist", true],
  ["test-review", "tests", "Test Review", "specialist", false],
  ["perf-review", "perf", "Performance Review", "reader", true],
] as const) {
  const skillRoot = join(root, "skills", name);
  const files = await walk(skillRoot);
  const identity = frontmatter(await readFile(join(skillRoot, "SKILL.md"), "utf8"));
  if (identity.name !== name || !identity.description || !/^\d+\.\d+\.\d+$/.test(identity.metadata?.version ?? "")) errors.push(title + " skill identity is incomplete.");
  for (const file of files.filter(p => p.endsWith(".md"))) checkMarkdown(skillRoot, files, file, await readFile(file, "utf8"));
  for (const file of files) for (const packageRoot of ["adapters/claude/plugin/resources/" + name, "adapters/codex/super-review/skills/" + name]) {
    const packaged = join(root, packageRoot, relative(skillRoot, file));
    if (!(await readFile(file)).equals(await readFile(packaged).catch(() => Buffer.alloc(0)))) errors.push("Stale " + title + " policy: " + packageRoot + "/" + relative(skillRoot, file));
  }
  const role = name.split("-")[0];
  const route = frontmatter(await readFile(join(root, "adapters/claude/plugin/skills/" + command + "/SKILL.md"), "utf8"));
  if (route.context !== "fork" || route.background !== false || route.agent !== "super-review:" + role + "-orchestrator" || route["disable-model-invocation"] !== true || "model" in route || "effort" in route) errors.push("Claude " + command + " command routing differs from the explicit isolated review.");
  const tools = ["Read", "Glob", "Grep", "Bash"];
  const roles: Array<[string, readonly string[]]> = [["orchestrator", ["Agent", ...tools]], [reader, tools]];
  if (challenger) roles.push(["challenger", tools]);
  for (const [suffix, expectedTools] of roles) {
    const agent = frontmatter(await readFile(join(root, "adapters/claude/plugin/agents/" + role + "-" + suffix + ".md"), "utf8"));
    const [model, effort] = suffix === "orchestrator" ? ["inherit", undefined] : ["sonnet", "medium"];
    if (agent.model !== model || agent.effort !== effort) errors.push("Claude " + role + "-" + suffix + " must run on " + model + (effort ? "/" + effort : " with session effort") + ".");
    const allowed = agent.tools.split(",").map((s: string) => s.trim()).sort();
    if (JSON.stringify(allowed) !== JSON.stringify([...expectedTools].sort())) errors.push("Unexpected Claude native tools: " + role + "-" + suffix);
  }
}
if (errors.length) throw new Error(errors.join("\n"));
console.log("Validated skill links, " + ids.size + " stable rule IDs, native payloads, versions, and adapter routing.");
