import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { resolve } from "node:path";

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
