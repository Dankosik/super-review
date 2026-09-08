import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { cp, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const exec = promisify(execFile);
const root = resolve(import.meta.dir, "..");
const binary = process.argv[2] ?? "opencode";
const scratch = await mkdtemp(join(tmpdir(), "super-review-native-"));
const config = join(scratch, "config");
await cp(join(root, "dist/opencode"), config, { recursive: true });
await writeFile(join(config, "tools/untrusted_probe.ts"), 'import { tool } from "@opencode-ai/plugin"; export default tool({description:"Permission probe; must be unavailable to review roles.",args:{},async execute(){return "probe";}});\n');
const env = { ...process.env, OPENCODE_CONFIG_DIR: config };
async function json(args: string[]) {
  const result = await exec(binary, [...args, "--pure"], { cwd: scratch, env, maxBuffer: 8 * 1024 * 1024, timeout: 90_000 });
  return JSON.parse(result.stdout);
}
try {
  const { stdout: version } = await exec(binary, ["--version"], { cwd: scratch, env, timeout: 30_000 });
  const result: Record<string, unknown> = { version: version.trim(), roles: {} };
  for (const name of ["super-review", "super-review-specialist"]) {
    const agent = await json(["debug", "agent", name]);
    const allowed = Object.entries(agent.tools).filter(([, enabled]) => enabled).map(([tool]) => tool).sort();
    const forbidden = ["bash", "read", "glob", "grep", "edit", "write", "webfetch", "untrusted_probe"];
    if (name.endsWith("-specialist")) forbidden.push("task", "skill", "super_review_snapshot", "super_review_files");
    for (const tool of forbidden) if (agent.tools[tool] !== false) throw new Error(name + " unexpectedly exposes " + tool);
    for (const tool of ["super_review_diff", "super_review_source", "super_review_search", "super_review_resource"]) {
      if (!agent.tools[tool]) throw new Error(name + " lacks " + tool);
    }
    if (name === "super-review" && (!agent.tools.task || !agent.tools.skill || agent.mode !== "primary")) {
      throw new Error("Orchestration is not available to the primary role.");
    }
    (result.roles as Record<string, unknown>)[name] = { mode: agent.mode, allowed, forbiddenVerified: forbidden };
  }
  const configuration = await json(["debug", "config"]);
  const command = configuration.command?.["super-review"];
  if (command?.agent !== "super-review" || command?.subtask !== false || !command.template.includes("$ARGUMENTS")) {
    throw new Error("Native command routing differs from the documented launch.");
  }
  const skills = await json(["debug", "skill"]);
  const skill = skills.find((s: any) => s.name === "super-review");
  if (!skill || !skill.location.startsWith(config)) throw new Error("Native skill discovery missed the packaged skill.");
  const expected = await readFile(join(root, "skills/super-review/SKILL.md"), "utf8");
  if (!expected.includes(skill.description)) throw new Error("Native discovery uses another skill's metadata.");
  result.command = command;
  result.skill = { name: skill.name, packaged: true };
  console.log(JSON.stringify(result, null, 2));
} finally {
  await rm(scratch, { recursive: true, force: true });
}
