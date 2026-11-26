import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve, join } from "node:path";

const root = resolve(import.meta.dir, "..");
const { version } = JSON.parse(await readFile(join(root, "package.json"), "utf8"));
// Generated native packages contain instructions and host configuration only.
const claude = join(root, "adapters/claude/plugin");
await rm(claude, { recursive: true, force: true });
await mkdir(join(claude, ".claude-plugin"), { recursive: true });
await mkdir(join(claude, "skills/review"), { recursive: true });
await mkdir(join(claude, "skills/defects"), { recursive: true });
await mkdir(join(claude, "skills/tests"), { recursive: true });
await mkdir(join(claude, "skills/perf"), { recursive: true });
await mkdir(join(claude, "skills/sql"), { recursive: true });
await mkdir(join(claude, "agents"), { recursive: true });
await cp(join(root, "skills/super-review"), join(claude, "resources/super-review"), { recursive: true });
await cp(join(root, "adapters/claude/skill.md"), join(claude, "skills/review/SKILL.md"));
// Defect Review, Test Review, Performance Review and SQL Review are separate skills with their own contracts; they share only the plugin.
for (const [skill, command] of [["defect-review", "defects"], ["test-review", "tests"], ["perf-review", "perf"], ["sql-review", "sql"]]) {
  await cp(join(root, "skills", skill), join(claude, "resources", skill), { recursive: true });
  await cp(join(root, `adapters/claude/${command}-skill.md`), join(claude, `skills/${command}/SKILL.md`));
}
for (const role of ["orchestrator", "specialist", "defect-orchestrator", "defect-specialist", "defect-challenger", "test-orchestrator", "test-specialist", "perf-orchestrator", "perf-reader", "perf-challenger", "sql-orchestrator", "sql-reader", "sql-challenger"]) {
  await cp(join(root, `adapters/claude/${role}.md`), join(claude, `agents/${role}.md`));
}
for (const file of ["LICENSE", "PRIVACY.md", "THIRD_PARTY_NOTICES.md"]) await cp(join(root, file), join(claude, file));
const { extensions, $schema, ...identity } = JSON.parse(await readFile(join(root, "plugin.json"), "utf8"));
await writeFile(join(claude, ".claude-plugin/plugin.json"), JSON.stringify(identity, null, 2) + "\n");

const codex = join(root, "adapters/codex/super-review");
await rm(codex, { recursive: true, force: true });
await mkdir(join(codex, ".codex-plugin"), { recursive: true });
for (const directory of ["skills", "assets", "docs", "examples"]) {
  await cp(join(root, directory), join(codex, directory), { recursive: true });
}
for (const file of ["README.md", "LICENSE", "PRIVACY.md", "CONTRIBUTING.md", "CHANGELOG.md", "THIRD_PARTY_NOTICES.md"]) await cp(join(root, file), join(codex, file));
await cp(join(root, ".codex-plugin/plugin.json"), join(codex, ".codex-plugin/plugin.json"));
await mkdir(join(codex, ".agents/plugins"), { recursive: true });
await writeFile(join(codex, ".agents/plugins/marketplace.json"), JSON.stringify({ name: "super-review", plugins: [{ name: "super-review", source: { source: "local", path: "./" }, policy: { installation: "AVAILABLE", authentication: "ON_INSTALL" }, category: "Productivity" }] }, null, 2) + "\n");

const cursor = join(root, "adapters/cursor/plugin");
await rm(cursor, { recursive: true, force: true });
await mkdir(join(cursor, ".cursor-plugin"), { recursive: true });
await mkdir(join(cursor, "skills/super-review"), { recursive: true });
await mkdir(join(cursor, "agents"), { recursive: true });
await cp(join(root, "skills/super-review"), join(cursor, "resources/super-review"), { recursive: true });
await cp(join(root, "adapters/cursor/skill.md"), join(cursor, "skills/super-review/SKILL.md"));
await cp(join(root, "adapters/cursor/specialist.md"), join(cursor, "agents/super-review-specialist.md"));
await cp(join(root, "docs/cursor.md"), join(cursor, "README.md"));
for (const file of ["LICENSE", "PRIVACY.md", "THIRD_PARTY_NOTICES.md"]) await cp(join(root, file), join(cursor, file));
await writeFile(join(cursor, ".cursor-plugin/plugin.json"), JSON.stringify({
  ...identity,
  author: { name: identity.author.name },
  keywords: [...identity.keywords, "cursor"],
  skills: "./skills/",
  agents: "./agents/",
}, null, 2) + "\n");
const antigravity = join(root, "adapters/antigravity/plugin");
await rm(antigravity, { recursive: true, force: true });
await mkdir(join(antigravity, "agents"), { recursive: true });
for (const name of ["super-review", "defect-review", "test-review", "perf-review", "sql-review"]) {
  await cp(join(root, "skills", name), join(antigravity, "resources", name), { recursive: true });
  await mkdir(join(antigravity, "skills", name), { recursive: true });
  await cp(join(root, "adapters/antigravity", `${name}.md`), join(antigravity, "skills", name, "SKILL.md"));
}
await cp(join(root, "adapters/antigravity/agents"), join(antigravity, "agents"), { recursive: true });
await cp(join(root, "docs/antigravity.md"), join(antigravity, "README.md"));
await mkdir(join(antigravity, "assets"), { recursive: true });
await cp(join(root, "assets/logo.svg"), join(antigravity, "assets/logo.svg"));
for (const file of ["LICENSE", "PRIVACY.md", "THIRD_PARTY_NOTICES.md"]) await cp(join(root, file), join(antigravity, file));
await writeFile(join(antigravity, "plugin.json"), JSON.stringify({
  $schema: "https://antigravity.google/schemas/v1/plugin.json",
  ...identity,
  displayName: "Super Review",
  logo: "assets/logo.svg",
  keywords: [...identity.keywords, "antigravity"],
  suggestedPrompts: ["Use Super Review on my local changes.", "Use Defect Review on this Rust PR.", "Use Performance Review on this Rust module."],
}, null, 2) + "\n");
console.log(`Built Super Review ${version}: native instruction packages, no plugin runtime.`);
