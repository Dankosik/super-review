import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { resolve } from "node:path";
import { readFile } from "node:fs/promises";

const root = resolve(import.meta.dir, "..");
const client = new Client({ name: "super-review-stdio-check", version: "1" });
const transport = new StdioClientTransport({ command: "node", args: [resolve(root, "runtime/mcp.mjs")] });
try {
  await client.connect(transport);
  const tools = await client.listTools();
  const response = await client.callTool({ name: "resources", arguments: { paths: ["SKILL.md"] } });
  if (response.isError) throw new Error(JSON.stringify(response));
  const payload = JSON.parse((response.content as any)[0].text);
  if (!payload.resources[0].content.includes("name: super-review")) throw new Error("Wrong installed skill.");
  console.log(JSON.stringify({ nodeTransport: "passed", version: payload.version, tools: tools.tools.map(t => t.name) }));
} finally {
  await client.close();
}

const pluginRoot = resolve(root, "adapters/codex/super-review");
const native = JSON.parse(await readFile(resolve(pluginRoot, ".mcp.json"), "utf8"));
for (const [name, config] of Object.entries(native.mcpServers) as [string, any][]) {
  const client = new Client({ name: "native-codex-check", version: "1" });
  try {
    await client.connect(new StdioClientTransport({ command: config.command, args: config.args, cwd: resolve(pluginRoot, config.cwd), env: { ...process.env, ...config.env } }));
    const names = (await client.listTools()).tools.map(t => t.name);
    if (name === "super_review_wait" ? names.length !== 1 || names[0] !== "batch_wait" : names.includes("batch_wait") || !names.includes("batch_submit")) throw new Error("Incorrect direct wait tool isolation: " + name);
    console.log(JSON.stringify({ nativeCodex: name, tools: names }));
  } finally { await client.close(); }
}
