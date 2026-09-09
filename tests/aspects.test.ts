import { describe, expect, test } from "bun:test";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createServer } from "../src/mcp.ts";
import { resource as openCodeResource } from "../adapters/opencode/tools/super_review.ts";

const root = resolve(import.meta.dir, "..");
const skill = resolve(root, "skills/super-review");
const read = (path: string) => readFileSync(resolve(skill, path), "utf8");
const catalogPath = "references/aspects.md";
const expected = [
  "lenses/representation.md", "lenses/rationale.md",
  "profiles/lifecycle-ownership.md", "profiles/dependency-boundaries.md",
  "profiles/effects-separation.md", "profiles/error-expression.md",
];
const catalogRows = () => [...read(catalogPath).matchAll(
  /^\| \[([a-z-]+)\]\(([^)]+)\) \| (lens|profile) \| ([a-z-]+) \| (.+) \|$/gm,
)];

describe("contextual aspect wiring (not model judgment)", () => {
  test("catalog modules exist and profiles reference rules of their stated owners", () => {
    const rows = catalogRows();
    expect(rows.map(row => row[2])).toEqual(expected);
    const ids: string[] = JSON.parse(readFileSync(resolve(root, "evals/go/rule-ids.json"), "utf8"));
    for (const [, name, path, kind, owner, signal] of rows) {
      expect(signal.trim().length).toBeGreaterThan(0);
      const text = read("references/" + path);
      if (kind === "lens") {
        expect(name).toBe(owner);
        const rule = /^## (go\.[a-z0-9.-]+)$/m.exec(text)?.[1];
        expect(rule).toBeDefined();
        expect(ids).toContain(rule!);
      } else {
        expect(/^Owner: (.+)$/m.exec(text)?.[1]).toBe(owner);
        const rule = /^Rule: (go\.[a-z0-9.-]+)$/m.exec(text)?.[1];
        expect(rule).toBeDefined();
        expect(ids).toContain(rule!);
        expect(read("references/lenses/" + owner + ".md")).toContain("## " + rule);
        expect(text).not.toMatch(/^## go\./m);
      }
    }
  });

  test("OpenCode allows the same contextual resources without arbitrary paths", () => {
    for (const path of [catalogPath, ...expected.map(path => "references/" + path)]) {
      expect(openCodeResource.args.path.safeParse(path).success).toBe(true);
    }
    expect(openCodeResource.args.path.safeParse("../../auth.json").success).toBe(false);
    expect(openCodeResource.args.path.safeParse("evals/go/aspect-cases.json").success).toBe(false);
  });

  for (const relativeRoot of [
    "skills/super-review",
    "adapters/claude/plugin/resources/super-review",
    "adapters/codex/super-review/skills/super-review",
  ]) {
    test("reads catalog and selected resources exactly from " + relativeRoot, async () => {
      const server = await createServer(resolve(root, relativeRoot));
      const client = new Client({ name: "aspect-resource-test", version: "1" });
      const [serverTransport, clientTransport] = InMemoryTransport.createLinkedPair();
      try {
        await server.connect(serverTransport);
        await client.connect(clientTransport);
        // Asking for the catalog must not return every profile or any rubric.
        for (const paths of [
          [catalogPath],
          expected.map(path => "references/" + path),
          ["references/review-contract.md", "references/languages/go.md",
            "references/lenses/data-flow.md", "assets/finding-template.md",
            "references/profiles/lifecycle-ownership.md"],
        ]) {
          const response = await client.callTool({ name: "resources", arguments: { paths } });
          expect(response.isError).not.toBe(true);
          const content = response.content as Array<{ type: string; text: string }>;
          expect(content[0]?.type).toBe("text");
          const payload = JSON.parse(content[0]!.text) as { resources: Array<{ path: string; content: string }> };
          expect(payload.resources.map(resource => resource.path)).toEqual(paths);
          for (const resource of payload.resources) expect(resource.content).toBe(read(resource.path));
        }
        const outside = await client.callTool({ name: "resources", arguments: { paths: ["evals/go/aspect-cases.json"] } });
        expect(outside.isError).toBe(true);
      } finally {
        await client.close();
        await server.close();
      }
    });
  }

  test("evaluation expectations resolve to unique raw sections, without grading their answers", () => {
    const suite = JSON.parse(readFileSync(resolve(root, "evals/go/aspect-cases.json"), "utf8")) as {
      cases: Array<{ id: string; input: { packet: string; section: string }; expect: string[] }>;
    };
    const ids = suite.cases.map(item => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    const packet = readFileSync(resolve(root, "evals/go/packets/aspects.md"), "utf8");
    const sections = [...packet.matchAll(/^## ([JR]\d+)$/gm)].map(match => match[1]);
    expect(new Set(sections).size).toBe(sections.length);
    expect(sections.sort()).toEqual([...ids].sort());
    for (const item of suite.cases) {
      expect(item.input.packet).toBe("packets/aspects.md");
      expect(item.input.section).toBe(item.id);
      expect(item.expect.length).toBeGreaterThan(0);
    }
  });
});
