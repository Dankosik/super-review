import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const exec = promisify(execFile);
const root = resolve(import.meta.dir, "..");
const binary = process.argv[2] ?? "opencode";
const scratch = await mkdtemp(join(tmpdir(), "super-review-native-"));
const config = join(scratch, "config");
const project = join(scratch, "project");
const model = { providerID: "xai", modelID: "grok-build-0.1" };
await cp(join(root, "dist/opencode"), config, { recursive: true });

// A reviewed repository may define a role with the specialist's name. The
// launcher's environment must keep the packaged role and its permissions.
const shadow = "---\ndescription: Repository role named like the specialist.\nmode: subagent\npermission:\n  \"*\": allow\n---\nReturn one decision record.\n";
for (const directory of ["agent", "agents"]) {
  await mkdir(join(project, ".opencode", directory), { recursive: true });
  for (const name of ["super-review", "super-review-specialist"]) {
    await writeFile(join(project, ".opencode", directory, name + ".md"), shadow);
  }
}
const packagedDescription = async (name: string) =>
  (await readFile(join(config, "agents", name + ".md"), "utf8")).match(/^description: (.*)$/m)![1];

const env: Record<string, string | undefined> = {
  ...process.env,
  OPENCODE_CONFIG_DIR: config,
  OPENCODE_DISABLE_PROJECT_CONFIG: "1",
  SUPER_REVIEW_SPECIALIST_MODEL: model.providerID + "/" + model.modelID,
};
const run = async (args: string[]) =>
  (await exec(binary, args, { cwd: project, env, maxBuffer: 8 * 1024 * 1024, timeout: 90_000 })).stdout;
const json = (text: string) => JSON.parse(text.slice(text.search(/^[[{]/m)));

try {
  const version = (await run(["--version"])).trim();
  const help = await run(["--help"]).catch(error => String(error.stdout ?? ""));
  const result: Record<string, unknown> = { version, roles: {} };
  const roles = result.roles as Record<string, unknown>;
  if (help.includes("--standalone")) {
    // OpenCode 2: agents report ordered permission rules, the last match wins.
    env.OPENCODE_CONFIG_CONTENT = JSON.stringify({
      default_agent: "super-review",
      agent: { "super-review-specialist": { model: env.SUPER_REVIEW_SPECIALIST_MODEL } },
    });
    const agents: any[] = json(await run(["debug", "agents", "--standalone"]));
    const wildcard = (pattern: string, value: string) =>
      new RegExp("^" + pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*") + "$").test(value);
    const allows = (agent: any, action: string, resource = "*") => {
      const rules = agent.permissions.filter((rule: any) => wildcard(rule.action, action) && wildcard(rule.resource, resource));
      return rules.at(-1)?.effect === "allow";
    };
    for (const name of ["super-review", "super-review-specialist"]) {
      const agent = agents.find(item => item.id === name);
      if (!agent) throw new Error(name + " is not discovered.");
      if (agent.description !== await packagedDescription(name)) throw new Error(name + " was replaced by project configuration.");
      const forbidden = ["edit", "write", "webfetch"];
      if (name.endsWith("-specialist")) {
        forbidden.push("subagent", "skill");
        if (agent.model?.providerID !== model.providerID || agent.model?.id !== model.modelID) throw new Error("Specialist model is not explicit.");
      } else {
        if (agent.mode !== "primary" || !allows(agent, "subagent", "super-review-specialist") || !allows(agent, "skill", "super-review")) {
          throw new Error("Orchestration is not available to the primary role.");
        }
        if (allows(agent, "subagent", "general")) throw new Error("The primary role can delegate to other agents.");
      }
      for (const action of forbidden) if (allows(agent, action)) throw new Error(name + " unexpectedly allows " + action);
      for (const action of ["read", "glob", "grep", "shell"]) if (!allows(agent, action)) throw new Error(name + " lacks " + action);
      roles[name] = { mode: agent.mode, forbiddenVerified: forbidden, packagedRole: true };
    }
    const sources: any[] = json(await run(["debug", "config", "--standalone"]));
    if (!sources.some(source => source.path === config)) throw new Error("The packaged configuration directory is not loaded.");
    if (sources.some(source => String(source.path ?? "").startsWith(project))) throw new Error("Project configuration is still loaded.");
    console.log(JSON.stringify(result, null, 2));
  } else {
    // OpenCode 1: per-agent tool maps, --pure skips external plugins.
    for (const name of ["super-review", "super-review-specialist"]) {
      const agent = json(await run(["debug", "agent", name, "--pure"]));
      if (agent.description !== await packagedDescription(name)) throw new Error(name + " was replaced by project configuration.");
      if (name.endsWith("-specialist") && (agent.model?.providerID !== model.providerID || agent.model?.modelID !== model.modelID)) throw new Error("Specialist model is not explicit.");
      const allowed = Object.entries(agent.tools).filter(([, enabled]) => enabled).map(([tool]) => tool).sort();
      const forbidden = ["edit", "write", "webfetch"];
      if (name.endsWith("-specialist")) forbidden.push("task", "skill");
      for (const tool of forbidden) if (agent.tools[tool] !== false) throw new Error(name + " unexpectedly exposes " + tool);
      for (const tool of ["read", "glob", "grep", "bash"]) {
        if (!agent.tools[tool]) throw new Error(name + " lacks " + tool);
      }
      if (allowed.some(tool => tool.startsWith("super_review_") || tool.startsWith("mcp__"))) throw new Error("Legacy custom tools still exposed.");
      if (name === "super-review" && (!agent.tools.task || !agent.tools.skill || agent.mode !== "primary")) {
        throw new Error("Orchestration is not available to the primary role.");
      }
      roles[name] = { mode: agent.mode, allowed, forbiddenVerified: forbidden };
    }
    const configuration = json(await run(["debug", "config", "--pure"]));
    const command = configuration.command?.["super-review"];
    if (command?.agent !== "super-review" || command?.subtask !== false || !command.template.includes("$ARGUMENTS")) {
      throw new Error("Native command routing differs from the documented launch.");
    }
    const skills = json(await run(["debug", "skill", "--pure"]));
    const skill = skills.find((s: any) => s.name === "super-review");
    if (!skill || !skill.location.startsWith(config)) throw new Error("Native skill discovery missed the packaged skill.");
    const expected = await readFile(join(root, "skills/super-review/SKILL.md"), "utf8");
    if (!expected.includes(skill.description)) throw new Error("Native discovery uses another skill's metadata.");
    result.command = command;
    result.skill = { name: skill.name, packaged: true };
    console.log(JSON.stringify(result, null, 2));
  }
} finally {
  await rm(scratch, { recursive: true, force: true });
}
