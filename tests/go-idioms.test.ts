import { describe, expect, test } from "bun:test";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createServer } from "../src/mcp.ts";

type Case = { id: string; lens: string; profile: string | null; stage: string; pair: string | null; input: string; expect: string[] };
const root = resolve(import.meta.dir, "..");
const read = (path: string) => readFile(resolve(root, path), "utf8");

describe("Go judgment resources (not model quality)", () => {
  test("each evaluator case resolves to one isolated input and an installed owner", async () => {
    const suite: { status: string; cases: Case[] } = JSON.parse(await read("evals/go/go-idioms-cases.json"));
    const packet = await read("evals/go/packets/go-idioms.md");
    const sectionIDs = [...packet.matchAll(/^## (G\d+)$/gm)].map(m => m[1]);
    expect(suite.status).toBe("proposed-not-model-executed");
    expect(new Set(sectionIDs).size).toBe(sectionIDs.length);
    expect(suite.cases.map(c => c.id)).toEqual(sectionIDs);
    const pairs = new Map<string, number>();
    for (const c of suite.cases) {
      expect(c.input).toBe(`packets/go-idioms.md#${c.id.toLowerCase()}`);
      expect(["specialist", "verification"]).toContain(c.stage);
      expect(c.expect.length).toBeGreaterThan(0);
      const section = packet.split(`## ${c.id}\n`)[1].split(/^## /m)[0];
      expect(section).toContain(`Lens: ${c.lens}`);
      expect(section.match(/^```go$/gm)).toHaveLength(1);
      expect(await read(`skills/super-review/references/lenses/${c.lens}.md`)).toContain("## go.");
      if (c.profile) {
        expect(section).toContain(`Profile: ${c.profile}`);
        expect(await read(`skills/super-review/references/profiles/${c.profile}.md`)).toContain(`Owner: ${c.lens}`);
      }
      if (c.pair) pairs.set(c.pair, (pairs.get(c.pair) ?? 0) + 1);
    }
    expect([...pairs.values()].every(n => n === 2)).toBe(true);
  });

  for (const path of ["skills/super-review", "adapters/claude/plugin/resources/super-review", "adapters/codex/super-review/skills/super-review"]) {
    test(`loads exact shared Go context and selected judgment from ${path}`, async () => {
      const server = await createServer(resolve(root, path));
      const client = new Client({ name: "go-judgment-resource-test", version: "1" });
      const [a, b] = InMemoryTransport.createLinkedPair();
      const paths = ["references/review-contract.md", "references/languages/go.md", "references/lenses/control-flow.md", "references/profiles/error-expression.md", "assets/finding-template.md"];
      try {
        await server.connect(a);
        await client.connect(b);
        const response = await client.callTool({ name: "resources", arguments: { paths } });
        expect(response.isError).not.toBe(true);
        const content = response.content as { type: string; text: string }[];
        const result: { resources: { path: string; content: string }[] } = JSON.parse(content[0].text);
        expect(result.resources.map(r => r.path)).toEqual(paths);
        for (const resource of result.resources) {
          expect(resource.content).toBe(await read(`skills/super-review/${resource.path}`));
        }
      } finally {
        await client.close();
        await server.close();
      }
    });
  }
});
