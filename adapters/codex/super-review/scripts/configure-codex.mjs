#!/usr/bin/env node
import { spawn } from "node:child_process";
import { createInterface } from "node:readline";

const apply = process.argv.slice(2).join(" ") === "--apply";
if (!apply && !["", "--check"].includes(process.argv.slice(2).join(" "))) {
  console.error("Usage: node configure-codex.mjs [--check|--apply]");
  process.exit(64);
}
const namespace = "mcp__super_review_wait";
const child = spawn("codex", ["app-server", "--listen", "stdio://"], { stdio: ["pipe", "pipe", "ignore"] });
const pending = new Map();
let nextID = 0;
const lines = createInterface({ input: child.stdout });
const stop = error => { for (const { reject } of pending.values()) reject(error); pending.clear(); };
child.on("error", stop);
child.on("exit", () => stop(new Error("Codex app-server exited before completing configuration.")));
lines.on("line", line => {
  let message;
  try { message = JSON.parse(line); } catch { return; }
  const request = pending.get(message.id);
  if (!request) return;
  pending.delete(message.id);
  if (message.error) request.reject(new Error(message.error.message));
  else request.resolve(message.result);
});
function call(method, params) {
  const id = ++nextID;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    child.stdin.write(JSON.stringify({ id, method, params }) + "\n");
  });
}
const timeout = setTimeout(() => { stop(new Error("Codex configuration timed out.")); child.kill(); }, 20_000);
try {
  await call("initialize", { clientInfo: { name: "super-review-setup", version: "2.1.0" } });
  const current = await call("config/read", { includeLayers: true });
  const effective = current.config.features?.code_mode;
  const configured = typeof effective === "object" ? effective?.direct_only_tool_namespaces ?? [] : [];
  if (configured.includes(namespace)) {
    console.log("Super Review completion waiting is configured for direct tool calls.");
  } else if (!apply) {
    console.log("Setup required: run this command with --apply, then start a new Codex task.");
    process.exitCode = 2;
  } else {
    const user = current.layers.find(layer => layer.name.type === "user" && !layer.name.profile);
    if (!user) throw new Error("No user configuration layer was returned; no configuration was changed.");
    const original = user.config.features?.code_mode;
    const value = typeof original === "boolean" ? { enabled: original } : { ...original };
    value.direct_only_tool_namespaces = [...new Set([...configured, ...(value.direct_only_tool_namespaces ?? []), namespace])];
    await call("config/value/write", {
      keyPath: "features.code_mode", value, mergeStrategy: "replace",
      filePath: user.name.file, expectedVersion: user.version,
    });
    const after = await call("config/read", { includeLayers: false });
    if (!after.config.features?.code_mode?.direct_only_tool_namespaces?.includes(namespace)) throw new Error("Codex did not expose the written setting; inspect configuration precedence.");
    console.log("Configured direct completion waiting for Super Review. Start a new Codex task.");
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  clearTimeout(timeout);
  lines.close();
  child.kill();
}
