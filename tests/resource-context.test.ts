import { expect, test } from "bun:test";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createServer } from "../src/mcp.ts";
import { GitHubReader } from "../adapters/opencode/lib/github.ts";

const root = resolve(import.meta.dir, "..");
const canonical = resolve(root, "skills/super-review");
const roots = [
  "skills/super-review",
  "adapters/claude/plugin/resources/super-review",
  "adapters/codex/super-review/skills/super-review",
];
const taskResources = [
  "references/review-contract.md",
  "references/languages/go.md",
  "assets/finding-template.md",
  "references/lenses/function-cohesion.md",
  "references/profiles/effects-separation.md",
];
type ResourceResult = {
  version: string;
  resources: Array<{ path: string; content: string }>;
};

// Mechanical interface/delivery checks, not a model decision or reuse evaluation.
for (const skillRoot of roots) {
  test(`specialist resource context is complete and selective: ${skillRoot}`, async () => {
    const githubCalls: string[] = [];
    const reader = new GitHubReader(async endpoint => {
      githubCalls.push(endpoint);
      throw new Error("Installed resources must not acquire reviewed source.");
    });
    const server = await createServer(resolve(root, skillRoot), reader);
    const client = new Client({ name: "resource-context-test", version: "1" });
    const [serverTransport, clientTransport] = InMemoryTransport.createLinkedPair();
    try {
      await server.connect(serverTransport);
      await client.connect(clientTransport);
      const resourceTool = (await client.listTools()).tools.find(tool => tool.name === "resources");
      expect(resourceTool).toBeDefined();
      const description = resourceTool!.description ?? "";
      expect(description).toMatch(/missing.*resources.*batch/i);
      expect(description).toMatch(/reuse complete matching resources/i);
      expect(description).toMatch(/shared role resources/i);
      expect(description).toMatch(/assigned lens.*selected profiles/i);
      expect(description).not.toContain("specialists load only their assigned lens");
      expect(resourceTool!.annotations?.readOnlyHint).toBe(true);
      expect(resourceTool!.annotations?.openWorldHint).toBe(false);

      const response = await client.callTool({ name: "resources", arguments: { paths: taskResources } });
      expect(response.isError).not.toBe(true);
      const blocks = response.content as Array<{ type: string; text?: string }>;
      const text = blocks.find(block => block.type === "text")?.text;
      expect(typeof text).toBe("string");
      const result = JSON.parse(text!) as ResourceResult;
      expect(result.version).toBe(JSON.parse(readFileSync(resolve(root, "package.json"), "utf8")).version);
      expect(result.resources.map(resource => resource.path)).toEqual(taskResources);
      for (const resource of result.resources) {
        expect(resource.content).toBe(readFileSync(resolve(canonical, resource.path), "utf8"));
      }
      expect(githubCalls).toEqual([]);
    } finally {
      await client.close();
      await server.close();
    }
  });
}
