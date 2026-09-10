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
const entry = frontmatter(await readFile(join(skill, "SKILL.md"), "utf8"));
if (entry.name !== "super-review" || !entry.description || entry.metadata?.version !== manifest.version) errors.push("Skill identity/version mismatch.");
const ids = new Set<string>();
const runtimeFiles = await walk(skill);
for (const file of runtimeFiles.filter(p => p.endsWith(".md"))) {
  const text = await readFile(file, "utf8");
  if (/\[TODO[:\]]/.test(text)) errors.push("Unfinished scaffold: " + file);
  for (const match of text.matchAll(/\]\(([^)]+)\)/g)) {
    const target = match[1].split("#")[0];
    if (!target || /^[a-z]+:\/\//i.test(target)) continue;
    const path = resolve(dirname(file), decodeURIComponent(target));
    if (relative(skill, path).startsWith("..") || !runtimeFiles.includes(path)) errors.push("Missing or unpackaged link: " + relative(root, file) + " -> " + target);
  }
  if (file.includes("/lenses/")) for (const match of text.matchAll(/^## (go\.[a-z0-9.-]+)$/gm)) {
    if (ids.has(match[1])) errors.push("Duplicate rule ID: " + match[1]);
    ids.add(match[1]);
  }
}
if (ids.size === 0) errors.push("No stable Go rule IDs.");
const expectedIDs: string[] = JSON.parse(await readFile(join(root, "evals/go/rule-ids.json"), "utf8"));
if (JSON.stringify([...ids].sort()) !== JSON.stringify(expectedIDs.sort())) errors.push("Rule IDs changed: update migration documentation and rule-ids.json intentionally.");
const tsIDs: string[] = [];
for (const file of runtimeFiles.filter(path => path.includes("/lenses/typescript/") && path.endsWith(".md"))) {
  const text = await readFile(file, "utf8");
  for (const match of text.matchAll(/^## (ts\.[a-z0-9.-]+)$/gm)) tsIDs.push(match[1]);
}
const expectedTSIDs: string[] = JSON.parse(await readFile(join(root, "evals/typescript/rule-ids.json"), "utf8"));
if (new Set(tsIDs).size !== tsIDs.length || JSON.stringify(tsIDs.sort()) !== JSON.stringify(expectedTSIDs.sort())) errors.push("TypeScript rule IDs changed: update migration documentation and rule-ids.json intentionally.");
const javaIDs: string[] = [];
for (const file of runtimeFiles.filter(path => path.includes("/lenses/java/") && path.endsWith(".md"))) {
  const text = await readFile(file, "utf8");
  for (const match of text.matchAll(/^## (java\.[a-z0-9.-]+)$/gm)) javaIDs.push(match[1]);
}
const expectedJavaIDs: string[] = JSON.parse(await readFile(join(root, "evals/java/rule-ids.json"), "utf8"));
if (new Set(javaIDs).size !== javaIDs.length || JSON.stringify(javaIDs.sort()) !== JSON.stringify(expectedJavaIDs.sort())) errors.push("Java rule IDs changed: update migration documentation and rule-ids.json intentionally.");
for (const role of ["super-review", "super-review-specialist"]) {
  const config = frontmatter(await readFile(join(root, "adapters/opencode/agents/" + role + ".md"), "utf8"));
  if (config.permission?.["*"] !== "deny") errors.push(role + " does not deny unlisted tools.");
  if (config.model) errors.push(role + " unexpectedly pins a user model.");
  if (config.mode !== (role === "super-review" ? "primary" : "subagent")) errors.push(role + " runs at the wrong level.");
}
const command = frontmatter(await readFile(join(root, "adapters/opencode/commands/super-review.md"), "utf8"));
if (command.agent !== "super-review" || command.subtask !== false) errors.push("Command would prevent primary orchestration.");
const plugin = JSON.parse(await readFile(join(root, "adapters/opencode/package.json"), "utf8"));
if (plugin.dependencies["@opencode-ai/plugin"] !== manifest.devDependencies["@opencode-ai/plugin"]) errors.push("Adapter package and development dependency differ.");
for (const path of ["plugin.json", ".codex-plugin/plugin.json", "adapters/claude/plugin/.claude-plugin/plugin.json", "adapters/codex/super-review/.codex-plugin/plugin.json"]) {
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
  if (role === "orchestrator" && (agent.model !== "inherit" || agent.effort)) errors.push("Claude orchestrator must inherit the user selection.");
  if (role === "specialist" && (agent.model !== "sonnet" || agent.effort !== "medium")) errors.push("Claude specialist profile changed without updating validation.");
  const allowed = agent.tools.split(",").map((s: string) => s.trim());
  if (allowed.some((name: string) => !name.startsWith("mcp__plugin_super-review_reader__") && !(role === "orchestrator" && name === "Agent"))) errors.push("Unexpected Claude tool: " + role);
}
if (claudeEntry.model !== "inherit" || claudeEntry.effort) errors.push("Claude command must inherit the user model and effort.");
const openCodeModels = JSON.parse(await readFile(join(root, "adapters/opencode/opencode.json"), "utf8"));
if (openCodeModels.agent?.["super-review-specialist"]?.model !== "{env:SUPER_REVIEW_SPECIALIST_MODEL}" || openCodeModels.model) errors.push("OpenCode must require an explicit specialist without overriding the orchestrator.");
const catalog = JSON.parse(await readFile(join(root, ".agents/plugins/marketplace.json"), "utf8"));
if (catalog.plugins[0]?.source?.path !== "./adapters/codex/super-review") errors.push("The project catalog must point at the native Codex package.");
const nativeMCP = JSON.parse(await readFile(join(root, "adapters/codex/super-review/.mcp.json"), "utf8"));
if (nativeMCP.mcpServers.super_review_wait.tool_timeout_sec < 660 || nativeMCP.mcpServers.super_review_wait.env.SUPER_REVIEW_COMPLETION_MODE !== "wait" || nativeMCP.mcpServers.super_review.env.SUPER_REVIEW_COMPLETION_MODE !== "submit") errors.push("Native Codex completion wait is not isolated with a sufficient timeout.");
if (nativeMCP.mcpServers.super_review.cwd !== "." || JSON.stringify(nativeMCP.mcpServers.super_review.args) !== JSON.stringify(["runtime/mcp.mjs"])) errors.push("Native Codex must resolve the reader from its plugin working directory.");
for (const file of runtimeFiles) {
  const packaged = join(root, "adapters/codex/super-review/skills/super-review", relative(skill, file));
  if (!(await readFile(file)).equals(await readFile(packaged))) errors.push("Stale Codex policy: " + relative(skill, file));
}
if (!(await readFile(join(root, "runtime/mcp.mjs"))).equals(await readFile(join(root, "adapters/claude/plugin/runtime/mcp.mjs")))) errors.push("Native readers differ.");
await readFile(join(root, "runtime/THIRD_PARTY_LICENSES.txt"));
if (errors.length) throw new Error(errors.join("\n"));
console.log("Validated skill links, " + (ids.size + tsIDs.length) + " stable rule IDs, native payloads, versions, and adapter routing.");
