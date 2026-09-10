import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve, join } from "node:path";

const root = resolve(import.meta.dir, "..");
const { version } = JSON.parse(await readFile(join(root, "package.json"), "utf8"));
// Generated native packages contain instructions and host configuration only.
const claude = join(root, "adapters/claude/plugin");
await rm(claude, { recursive: true, force: true });
await mkdir(join(claude, ".claude-plugin"), { recursive: true });
await mkdir(join(claude, "skills/review"), { recursive: true });
await mkdir(join(claude, "agents"), { recursive: true });
await cp(join(root, "skills/super-review"), join(claude, "resources/super-review"), { recursive: true });
await cp(join(root, "adapters/claude/skill.md"), join(claude, "skills/review/SKILL.md"));
for (const role of ["orchestrator", "specialist"]) {
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
console.log(`Built Super Review ${version}: native instruction packages, no plugin runtime.`);
