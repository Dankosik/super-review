import { expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { resolve, relative } from "node:path";

const root = resolve(import.meta.dir, "..");
const read = (path: string) => readFileSync(resolve(root, path), "utf8");
function files(path: string): string[] {
  return readdirSync(path, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? files(resolve(path, entry.name)) : [resolve(path, entry.name)]);
}
function metadata(path: string) {
  return Bun.YAML.parse(/^---\n([\s\S]*?)\n---/.exec(read(path))![1]) as any;
}

test("native packages contain no custom server, tool runtime, dependencies or evaluator packets", () => {
  for (const packageRoot of ["adapters/claude/plugin", "adapters/codex/super-review", "adapters/opencode"]) {
    const names = files(resolve(root, packageRoot)).map(file => relative(resolve(root, packageRoot), file));
    expect(names.filter(name => /(^|\/)(runtime|tools|node_modules|evals)\//.test(name))).toEqual([]);
    expect(names.filter(name => /(^|\/)(\.?mcp\.json|package\.json)$/.test(name))).toEqual([]);
  }
  for (const path of [".mcp.json", "mcp.json", "src/mcp.ts", "scripts/configure-codex.mjs"]) expect(existsSync(resolve(root, path))).toBe(false);
  for (const path of [".codex-plugin/plugin.json", "adapters/codex/super-review/.codex-plugin/plugin.json"]) expect(JSON.parse(read(path)).mcpServers).toBeUndefined();
});

test("Claude native tools and plugin-relative entrypoint support file-based resources", () => {
  const skill = "adapters/claude/plugin/skills/review/SKILL.md";
  const command = metadata(skill);
  expect(command.agent).toBe("super-review:orchestrator");
  expect(command.context).toBe("fork");
  expect(read(skill)).toContain("${CLAUDE_PLUGIN_ROOT}/resources/super-review/SKILL.md");
  for (const role of ["orchestrator", "specialist"]) {
    const agent = metadata(`adapters/claude/plugin/agents/${role}.md`);
    const tools = agent.tools.split(", ");
    expect(tools.sort()).toEqual((role === "orchestrator" ? ["Agent", "Read", "Glob", "Grep", "Bash"] : ["Read", "Glob", "Grep", "Bash"]).sort());
  }
});

test("OpenCode permits native source access and limits specialist delegation", () => {
  for (const role of ["super-review", "super-review-specialist"]) {
    const agent = metadata(`adapters/opencode/agents/${role}.md`);
    expect(agent.permission["*"]).toBe("deny");
    for (const tool of ["read", "glob", "grep", "bash"]) expect(agent.permission[tool]).toBe("allow");
    if (role === "super-review") expect(agent.permission.task).toEqual({ "*": "deny", "super-review-specialist": "allow" });
    else expect(agent.permission.task).toBeUndefined();
  }
});
