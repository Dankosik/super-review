import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { resolve, join, dirname } from "node:path";

const root = resolve(import.meta.dir, "..");
const { version } = JSON.parse(await readFile(join(root, "package.json"), "utf8"));
const runtime = join(root, "runtime");
await mkdir(runtime, { recursive: true });
const built = await Bun.build({
  entrypoints: [join(root, "src/mcp.ts")], target: "node", format: "esm",
  outdir: runtime, naming: "mcp.mjs", minify: false, metafile: true,
});
if (!built.success) throw new Error(built.logs.join("\n"));
const licenses = new Map<string, string>();
for (const input of Object.keys(built.metafile!.inputs)) {
  if (!input.includes("node_modules/")) continue;
  let directory = dirname(resolve(root, input));
  while (directory !== dirname(directory)) {
    let pkg: any;
    try { pkg = JSON.parse(await readFile(join(directory, "package.json"), "utf8")); } catch {}
    if (pkg?.name && pkg?.version) {
      const identity = pkg.name + "@" + pkg.version;
      if (!licenses.has(identity)) {
        const entries = await readdir(directory, { withFileTypes: true });
        const files = entries.filter(e => e.isFile() && /^licen[sc]e(?:[.-]|$)/i.test(e.name));
        if (!files.length) throw new Error("Bundled dependency has no license file: " + identity);
        const texts = await Promise.all(files.map(file => readFile(join(directory, file.name), "utf8")));
        licenses.set(identity, identity + " (" + pkg.license + ")\n\n" + texts.join("\n"));
      }
      break;
    }
    directory = dirname(directory);
  }
}
await writeFile(join(runtime, "THIRD_PARTY_LICENSES.txt"), [...licenses].sort(([a], [b]) => a.localeCompare(b)).map(([, text]) => text).join("\n\n---\n\n") + "\n");

// This install tree is generated so each host gets its native entrypoint while
// the review policy and source reader remain single-source.
const claude = join(root, "adapters/claude/plugin");
await rm(claude, { recursive: true, force: true });
await mkdir(join(claude, ".claude-plugin"), { recursive: true });
await mkdir(join(claude, "skills/review"), { recursive: true });
await mkdir(join(claude, "agents"), { recursive: true });
await cp(runtime, join(claude, "runtime"), { recursive: true });
await cp(join(root, "skills/super-review"), join(claude, "resources/super-review"), { recursive: true });
await cp(join(root, "adapters/claude/skill.md"), join(claude, "skills/review/SKILL.md"));
for (const agent of ["orchestrator", "specialist"]) {
  await cp(join(root, "adapters/claude/" + agent + ".md"), join(claude, "agents/" + agent + ".md"));
}
await cp(join(root, "LICENSE"), join(claude, "LICENSE"));
await cp(join(root, "PRIVACY.md"), join(claude, "PRIVACY.md"));
await cp(join(root, "THIRD_PARTY_NOTICES.md"), join(claude, "THIRD_PARTY_NOTICES.md"));
const portable = JSON.parse(await readFile(join(root, "plugin.json"), "utf8"));
const { extensions, $schema, ...identity } = portable;
await writeFile(join(claude, ".claude-plugin/plugin.json"), JSON.stringify(identity, null, 2) + "\n");
await writeFile(join(claude, ".mcp.json"), JSON.stringify({ mcpServers: { reader: {
  command: "node", args: ["${CLAUDE_PLUGIN_ROOT}/runtime/mcp.mjs", "${CLAUDE_PLUGIN_ROOT}/resources/super-review"],
} } }, null, 2) + "\n");
console.log(`Built Super Review ${version}: shared Node reader and native Claude plugin.`);

// Native Codex currently needs its legacy MCP schema for a long tool timeout.
// The portable MCP schema has no timeout field; it cannot carry this barrier.
const codex = join(root, "adapters/codex/super-review");
await rm(codex, { recursive: true, force: true });
await mkdir(join(codex, ".codex-plugin"), { recursive: true });
for (const directory of ["skills", "runtime", "assets", "docs", "examples"]) {
  await cp(join(root, directory), join(codex, directory), { recursive: true });
}
for (const file of ["README.md", "LICENSE", "PRIVACY.md", "CONTRIBUTING.md", "CHANGELOG.md", "THIRD_PARTY_NOTICES.md"]) await cp(join(root, file), join(codex, file));
await mkdir(join(codex, "scripts"), { recursive: true });
await cp(join(root, "scripts/configure-codex.mjs"), join(codex, "scripts/configure-codex.mjs"));
const codexManifest = JSON.parse(await readFile(join(root, ".codex-plugin/plugin.json"), "utf8"));
await writeFile(join(codex, ".codex-plugin/plugin.json"), JSON.stringify(codexManifest, null, 2) + "\n");
await writeFile(join(codex, ".mcp.json"), JSON.stringify({ mcpServers: { super_review: {
  command: "node", args: ["runtime/mcp.mjs"], cwd: ".",
  env: { SUPER_REVIEW_COMPLETION_BATCHES: "1", SUPER_REVIEW_COMPLETION_MODE: "submit" },
}, super_review_wait: {
  command: "node", args: ["runtime/mcp.mjs"], cwd: ".",
  env: { SUPER_REVIEW_COMPLETION_BATCHES: "1", SUPER_REVIEW_COMPLETION_MODE: "wait" }, tool_timeout_sec: 660,
} } }, null, 2) + "\n");
await mkdir(join(codex, ".agents/plugins"), { recursive: true });
await writeFile(join(codex, ".agents/plugins/marketplace.json"), JSON.stringify({ name: "super-review", plugins: [{ name: "super-review", source: { source: "local", path: "./" }, policy: { installation: "AVAILABLE", authentication: "ON_INSTALL" }, category: "Productivity" }] }, null, 2) + "\n");
console.log("Built native Codex result barrier with a 660-second MCP timeout.");
