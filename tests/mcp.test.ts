import { describe, expect, test } from "bun:test";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createServer } from "../src/mcp.ts";
import { resolve } from "node:path";

describe("native source bridge", () => {
  test("exposes only read operations and reads the installed policy through MCP", async () => {
    const server = await createServer(resolve(import.meta.dir, "../skills/super-review"));
    const client = new Client({ name: "super-review-test", version: "1" });
    const [a, b] = InMemoryTransport.createLinkedPair();
    try {
      await server.connect(a);
      await client.connect(b);
      const list = await client.listTools();
      expect(list.tools.map(t => t.name).sort()).toEqual(["diff", "doctor", "files", "resources", "search", "snapshot", "source"]);
      expect(list.tools.every(t => t.annotations?.readOnlyHint && t.annotations?.destructiveHint === false)).toBe(true);
      const response = await client.callTool({ name: "resources", arguments: { paths: ["SKILL.md", "references/lenses/naming.md"] } });
      const content = JSON.parse((response.content as any)[0].text);
      expect(content.version).toBe("1.1.0");
      expect(content.resources).toHaveLength(2);
      expect(content.resources[0].content).toContain("name: super-review");
      expect(content.resources[1].content).toContain("go.naming.intent");
      const escaping = await client.callTool({ name: "resources", arguments: { paths: ["../../auth.json"] } });
      expect(escaping.isError).toBe(true);
      const unknown = await client.callTool({ name: "source", arguments: { snapshot: "invented", revision: "head", path: "main.go" } });
      expect(unknown.isError).toBe(true);
    } finally {
      await client.close();
      await server.close();
    }
  });
});
