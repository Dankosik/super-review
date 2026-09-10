import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { GitHubReader, exclusion } from "../adapters/opencode/lib/github.ts";
import { isGeneratedSource, isReadableContext, sourceLanguage } from "../adapters/opencode/lib/source-files.ts";
import { resource } from "../adapters/opencode/tools/super_review.ts";
import { createServer } from "../src/mcp.ts";

const root = resolve(import.meta.dir, "..");
const read = (path: string) => readFileSync(resolve(root, path), "utf8");
const skill = (path: string) => read("skills/super-review/" + path);
const lenses = ["naming", "control-flow", "function-cohesion", "data-flow", "abstractions", "duplication", "api-clarity", "change-locality", "representation", "rationale"];
const profiles = ["lifecycle-ownership", "dependency-boundaries", "effects-separation", "error-expression"];
const resources = ["references/languages.md", "references/languages/typescript.md", ...lenses.map(lens => `references/lenses/typescript/${lens}.md`), ...profiles.map(profile => `references/profiles/typescript/${profile}.md`)];
const B = "a".repeat(40), H = "b".repeat(40), D = "c".repeat(40);

function fixture(files: Record<string, string>) {
  const calls: string[] = [];
  const blobs = new Map<string, string>();
  const entries = Object.entries(files).map(([path, content]) => {
    const sha = createHash("sha1").update(content).digest("hex");
    blobs.set(sha, content);
    return { path, sha, type: "blob", mode: "100644", size: Buffer.byteLength(content) };
  });
  const reader = new GitHubReader(async endpoint => {
    calls.push(endpoint);
    if (endpoint === "repos/acme/ts/pulls/1") return { base: { sha: B, repo: { full_name: "acme/ts" } }, head: { sha: H, repo: { full_name: "acme/ts" } }, state: "open", draft: false };
    if (endpoint === `repos/acme/ts/compare/${B}...${H}`) return { merge_base_commit: { sha: D }, files: entries.map(entry => ({ filename: entry.path, status: "modified", patch: "@@ -0,0 +1 @@\n+source" })) };
    if (endpoint === `repos/acme/ts/git/trees/${H}` || endpoint === `repos/acme/ts/git/trees/${H}?recursive=1`) return { tree: entries };
    if (endpoint === `repos/acme/ts/git/trees/${B}`) return { tree: [] };
    const content = blobs.get(endpoint.split("/").at(-1)!);
    if (endpoint.includes("/git/blobs/") && content !== undefined) return { encoding: "base64", content: Buffer.from(content).toString("base64"), size: Buffer.byteLength(content) };
    throw new Error("Unexpected endpoint: " + endpoint);
  });
  return { reader, calls, pin: () => reader.pin("https://github.com/acme/ts/pull/1") };
}

describe("TypeScript source boundaries", () => {
  test("all supported extensions and handwritten declarations participate", () => {
    for (const path of ["src/a.ts", "src/View.tsx", "src/a.mts", "src/a.cts", "types/a.d.ts", "types/a.d.mts", "types/a.d.cts"]) {
      expect(sourceLanguage(path)).toBe("TypeScript");
      expect(exclusion(path)).toBeUndefined();
    }
    expect(sourceLanguage("a.go")).toBe("Go");
    expect(sourceLanguage("a.rs")).toBe("Rust");
    expect(exclusion("a.rs")).toBeUndefined();
    expect(exclusion("a.go")).toBeUndefined();
    for (const path of ["a.js", "a.jsx", "a.ts.map", "a.ts.bak", "package.json"]) expect(exclusion(path)).toBeDefined();
    expect(exclusion("a.ts", "removed")).toContain("deleted");
  });

  test("tests and internal files remain excluded consistently", async () => {
    const f = fixture({ "a.ts": "export const a = 1;" });
    const snapshot = await f.pin();
    for (const path of ["a.test.ts", "a.spec.tsx", "a.test.mts", "a.spec.cts", "__tests__/a.ts", "tests/a.ts", "test/a.tsx", "__mocks__/a.ts", "node_modules/pkg/a.d.ts", "vendor/a.ts", ".git/a.ts", "a_test.go"]) {
      expect(exclusion(path)).toBeDefined();
      expect(await f.reader.source(snapshot.id, "head", path)).toMatchObject({ excluded: true });
    }
    expect(f.calls.filter(call => call.includes("/git/"))).toHaveLength(0);
  });

  test("compatibility context is readable but never included as source", async () => {
    const names = ["package.json", "package-lock.json", "npm-shrinkwrap.json", "pnpm-lock.yaml", "yarn.lock", "bun.lock", "tsconfig.json", "tsconfig.build.json", "tsconfig.base.jsonc", "app.tsconfig.json", "go.mod"];
    const f = fixture(Object.fromEntries(names.map(name => [name, "{}\n"])));
    const snapshot = await f.pin();
    for (const name of names) {
      expect(isReadableContext(name)).toBe(true);
      expect(exclusion(name)).toBeDefined();
      expect(await f.reader.source(snapshot.id, "head", name)).toMatchObject({ exists: true, commit: H });
    }
    for (const name of ["auth.json", ".env", "bun.lockb", "tsconfig.json.js", "base.json"]) {
      expect(isReadableContext(name)).toBe(false);
      expect(await f.reader.source(snapshot.id, "head", name)).toMatchObject({ excluded: true });
    }
    expect((await f.reader.search(snapshot.id, "{}")).matches).toEqual([]);
  });

  test("generated markers are recognized without mistaking strings or declarations", () => {
    for (const header of ["// @generated\n", "/** @generated by tool */\n", "// Code generated by tool. DO NOT EDIT.\n", "/* This file is auto-generated. */\n"]) expect(isGeneratedSource("a.ts", header + "export type A = string;")).toBe(true);
    expect(isGeneratedSource("a.d.ts", "export interface A { name: string }\n")).toBe(false);
    expect(isGeneratedSource("a.ts", 'const note = "@generated";\n')).toBe(false);
    expect(isGeneratedSource("a.ts", 'const note = 1;\n// @generated example\n')).toBe(false);
    expect(isGeneratedSource("a.go", "// Code generated by tool. DO NOT EDIT.\npackage a")).toBe(true);
  });

  test("pinned read and paginated search include TS, TSX, module and declaration source", async () => {
    const files: Record<string, string> = Object.fromEntries(Array.from({ length: 21 }, (_, index) => [`f${index}.ts`, `export const marker${index} = ${index};\n`]));
    Object.assign(files, { "View.tsx": "export const marker = <div />;\n", "api.d.ts": "export declare const marker: string;\n", "esm.mts": "export const marker = 1;\n", "cjs.cts": "export const marker = 1;\n", "legacy.go": "package p // marker\n", "skip.spec.ts": "const marker = 1;", "generated.ts": "// @generated\nconst marker = 1;", "other.js": "const marker = 1;" });
    const f = fixture(files);
    const snapshot = await f.pin();
    expect(snapshot.files.find(file => file.path === "View.tsx")?.exclusion).toBeUndefined();
    expect(snapshot.files.find(file => file.path === "skip.spec.ts")?.exclusion).toBeDefined();
    const source = await f.reader.source(snapshot.id, "head", "api.d.ts", 1, 1);
    expect(source).toMatchObject({ commit: H, content: "1: export declare const marker: string;", nextLine: null });
    expect(await f.reader.source(snapshot.id, "head", "generated.ts")).toMatchObject({ excluded: true });
    const matches: string[] = [], unread: string[] = [];
    let offset: number | null = 0;
    do {
      const page = await f.reader.search(snapshot.id, "marker", "", offset);
      matches.push(...page.matches.map(match => match.path));
      unread.push(...page.unread.map(item => item.path));
      offset = page.nextOffset;
    } while (offset !== null);
    expect(matches).toHaveLength(26);
    expect(matches).toContain("View.tsx");
    expect(matches).toContain("api.d.ts");
    expect(matches).not.toContain("skip.spec.ts");
    expect(matches).not.toContain("other.js");
    expect(matches).not.toContain("generated.ts");
    expect(unread).toContain("generated.ts");
    expect((await f.reader.search(snapshot.id, "marker", "esm.mts")).matches.map(match => match.path)).toEqual(["esm.mts"]);
    expect((await f.reader.search(snapshot.id, "marker.*")).matches).toEqual([]);
    expect(await f.reader.source(snapshot.id, "base", "package.json")).toMatchObject({ exists: false, commit: B });
  });
});

describe("TypeScript instruction wiring (not model judgment)", () => {
  test("routing resolves every lens and profile with separate stable rule IDs", () => {
    const ids: string[] = JSON.parse(read("evals/typescript/rule-ids.json"));
    const actual = lenses.flatMap(lens => [...skill(`references/lenses/typescript/${lens}.md`).matchAll(/^## (ts\.[a-z0-9.-]+)$/gm)].map(match => match[1]));
    expect(new Set(actual).size).toBe(actual.length);
    expect(actual.sort()).toEqual([...ids].sort());
    for (const path of resources) {
      expect(resource.args.path.safeParse(path).success).toBe(true);
      if (path !== "references/languages.md") expect(skill("references/languages.md")).toContain(path.replace("references/", ""));
    }
    for (const profile of profiles) {
      const text = skill(`references/profiles/typescript/${profile}.md`);
      const owner = /^Owner: (.+)$/m.exec(text)![1];
      const rule = /^Rule: (ts\.[a-z0-9.-]+)$/m.exec(text)![1];
      expect(ids).toContain(rule);
      expect(skill(`references/lenses/typescript/${owner}.md`)).toContain("## " + rule);
      expect(text).not.toMatch(/^## ts\./m);
    }
    expect(skill("SKILL.md")).toContain("references/languages.md");
    expect(skill("references/workflow.md")).toContain("languages.md");
    for (const path of ["adapters/claude/specialist.md", "adapters/opencode/agents/super-review-specialist.md"]) expect(read(path)).not.toContain("references/languages/go.md");
    expect(resource.args.path.safeParse("evals/typescript/cases.json").success).toBe(false);
    expect(resource.args.path.safeParse("../../auth.json").success).toBe(false);
  });

  for (const directory of ["skills/super-review", "adapters/claude/plugin/resources/super-review", "adapters/codex/super-review/skills/super-review"]) {
    test("MCP serves exact selected TS resources without holdouts from " + directory, async () => {
      const server = await createServer(resolve(root, directory));
      const client = new Client({ name: "typescript-resources", version: "1" });
      const [serverTransport, clientTransport] = InMemoryTransport.createLinkedPair();
      try {
        await server.connect(serverTransport);
        await client.connect(clientTransport);
        for (let index = 0; index < resources.length; index += 8) {
          const paths = resources.slice(index, index + 8);
          const response = await client.callTool({ name: "resources", arguments: { paths } });
          expect(response.isError).not.toBe(true);
          const content = response.content as Array<{ type: string; text: string }>;
          const payload = JSON.parse(content[0].text) as { resources: Array<{ path: string; content: string }> };
          expect(payload.resources.map(item => item.path)).toEqual(paths);
          for (const item of payload.resources) expect(item.content).toBe(skill(item.path));
        }
        const outside = await client.callTool({ name: "resources", arguments: { paths: ["evals/typescript/packets/contrasts.md"] } });
        expect(outside.isError).toBe(true);
      } finally {
        await client.close();
        await server.close();
      }
    });
  }

  test("contrast expectations reference unique raw inputs and existing rules", () => {
    const cases = JSON.parse(read("evals/typescript/cases.json")) as Array<{ id: string; rule: string; outcome: string; expect: string[] }>;
    const sections = [...read("evals/typescript/packets/contrasts.md").matchAll(/^## (T\d+)$/gm)].map(match => match[1]);
    expect(new Set(cases.map(item => item.id)).size).toBe(cases.length);
    expect(sections.sort()).toEqual(cases.map(item => item.id).sort());
    const ids: string[] = JSON.parse(read("evals/typescript/rule-ids.json"));
    for (const item of cases) {
      expect(ids).toContain(item.rule);
      expect(["change", "retain", "defer"]).toContain(item.outcome);
      expect(item.expect.length).toBeGreaterThan(0);
    }
  });
});
