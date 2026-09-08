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
if (errors.length) throw new Error(errors.join("\n"));
console.log("Validated skill links, " + ids.size + " stable rule IDs, versions, and adapter routing.");
