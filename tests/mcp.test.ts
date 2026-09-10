import { describe, expect, test } from "bun:test";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createServer } from "../src/mcp.ts";
import { resolve } from "node:path";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { CompletionBatches } from "../src/completion-batch.ts";
import { GitHubReader } from "../adapters/opencode/lib/github.ts";

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
      expect(content.version).toBe("2.3.0");
      expect(content.resources).toHaveLength(2);
      expect(content.resources[0].content).toContain("name: super-review");
      expect(content.resources[1].content).toContain("go.naming.intent");
      const sharedPaths = ["SKILL.md", "references/harnesses/codex.md", "references/review-contract.md", "references/workflow.md", "references/team-rules.md", "references/verification.md", "references/languages/go.md", "assets/finding-template.md", "assets/report-template.md"];
      const shared = await client.callTool({ name: "resources", arguments: { paths: sharedPaths } });
      expect(shared.isError).not.toBe(true);
      expect(JSON.parse((shared.content as any)[0].text).resources.map((r: any) => r.path)).toEqual(sharedPaths);
      const escaping = await client.callTool({ name: "resources", arguments: { paths: ["../../auth.json"] } });
      expect(escaping.isError).toBe(true);
      const unknown = await client.callTool({ name: "source", arguments: { snapshot: "invented", revision: "head", path: "main.go" } });
      expect(unknown.isError).toBe(true);
    } finally {
      await client.close();
      await server.close();
    }
  });

  test("native batch protocol requires an issued snapshot and returns both terminal reports", async () => {
    const temporary = mkdtempSync(resolve(tmpdir(), "super-review-mcp-batch-"));
    const reader = new GitHubReader(async endpoint => endpoint.includes("/pulls/")
      ? { base: { sha: "a".repeat(40), repo: { full_name: "acme/service" } }, head: { sha: "b".repeat(40), repo: { full_name: "acme/service" } }, state: "open" }
      : { merge_base_commit: { sha: "c".repeat(40) }, files: [] });
    const snapshot = await reader.pin("https://github.com/acme/service/pull/1");
    const server = await createServer(resolve(import.meta.dir, "../skills/super-review"), reader, new CompletionBatches(temporary), "submit");
    const waitServer = await createServer(resolve(import.meta.dir, "../skills/super-review"), undefined, new CompletionBatches(temporary), "wait");
    const client = new Client({ name: "batch-protocol-test", version: "1" });
    const waitClient = new Client({ name: "direct-wait-test", version: "1" });
    const [a, b] = InMemoryTransport.createLinkedPair();
    const [c, d] = InMemoryTransport.createLinkedPair();
    const payload = (r: any) => JSON.parse(r.content[0].text);
    try {
      await server.connect(a); await client.connect(b);
      await waitServer.connect(c); await waitClient.connect(d);
      expect((await client.callTool({ name: "batch_open", arguments: { snapshot: "unissued", tasks: ["naming"] } })).isError).toBe(true);
      const group = payload(await client.callTool({ name: "batch_open", arguments: { snapshot: snapshot.id, tasks: ["naming", "flow"] } }));
      let returned = false;
      const waiting = waitClient.callTool({ name: "batch_wait", arguments: { batch: group.id } }).then(r => { returned = true; return payload(r); });
      await client.callTool({ name: "batch_submit", arguments: { batch: group.id, assignment: group.assignments[0].id, status: "completed", report: "Naming complete." } });
      expect(returned).toBe(false);
      await client.callTool({ name: "batch_submit", arguments: { batch: group.id, assignment: group.assignments[1].id, status: "unfinished", report: "Missing caller context." } });
      const result = await waiting;
      expect(result.outcome).toBe("partial");
      expect(result.assignments.map((a: any) => a.report)).toEqual(["Naming complete.", "Missing caller context."]);
      const tools = await client.listTools();
      expect(tools.tools.find(t => t.name === "batch_submit")?.annotations?.readOnlyHint).toBe(false);
      expect(tools.tools.some(t => t.name === "batch_wait")).toBe(false);
      const waitTools = await waitClient.listTools();
      expect(waitTools.tools.map(t => t.name)).toEqual(["batch_wait"]);
      expect(waitTools.tools[0].inputSchema.properties).not.toHaveProperty("timeout_ms");
    } finally {
      await client.close(); await server.close();
      await waitClient.close(); await waitServer.close();
      rmSync(temporary, { recursive: true, force: true });
    }
  });
});
