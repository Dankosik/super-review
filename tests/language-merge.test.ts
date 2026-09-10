import { expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { GitHubReader } from "../adapters/opencode/lib/github.ts";

// Exercise the integrated reader, not parallel language-specific predicates.
test("one pinned PR retains Go, TypeScript variants and Rust with their exclusions", async () => {
  const B = "a".repeat(40), H = "b".repeat(40), D = "c".repeat(40);
  const production = {
    "worker.go": "package work\nfunc marker() {}\n",
    "handler.ts": "export function marker() {}\n",
    "View.tsx": "export function marker() { return <div />; }\n",
    "esm.mts": "export const marker = 1;\n",
    "cjs.cts": "export const marker = 1;\n",
    "api.d.ts": "export declare function marker(): void;\n",
    "engine.rs": "pub fn marker() {}\n#[cfg(test)] mod tests {}\n",
  };
  const contexts = { "Cargo.toml": '[package]\nname = "engine"\n', "tsconfig.json": '{"compilerOptions":{"strict":true}}\n', "package.json": '{"name":"web"}\n' };
  const files = { ...production, ...contexts, "worker_test.go": "marker", "skip.spec.ts": "marker", "tests/smoke.rs": "marker", "generated.ts": "// @generated\nexport const marker = 1;", "generated.rs": "// @generated\npub fn marker() {}" };
  const blobs = new Map<string, string>();
  const entries = Object.entries(files).map(([path, content]) => {
    const sha = createHash("sha1").update(content).digest("hex");
    blobs.set(sha, content);
    return { path, sha, type: "blob", mode: "100644", size: Buffer.byteLength(content) };
  });
  const reader = new GitHubReader(async endpoint => {
    if (endpoint === "repos/acme/mixed/pulls/1") return { base: { sha: B, repo: { full_name: "acme/mixed" } }, head: { sha: H, repo: { full_name: "acme/mixed" } }, state: "open", draft: false };
    if (endpoint === `repos/acme/mixed/compare/${B}...${H}`) return { merge_base_commit: { sha: D }, files: entries.map(entry => ({ filename: entry.path, status: "modified", patch: "@@ -0,0 +1 @@\n+source" })) };
    if (endpoint === `repos/acme/mixed/git/trees/${H}` || endpoint === `repos/acme/mixed/git/trees/${H}?recursive=1`) return { tree: entries };
    const text = blobs.get(endpoint.split("/").at(-1)!);
    if (endpoint.includes("/git/blobs/") && text !== undefined) return { encoding: "base64", content: Buffer.from(text).toString("base64"), size: Buffer.byteLength(text) };
    throw new Error("Unexpected endpoint: " + endpoint);
  });
  const snapshot = await reader.pin("https://github.com/acme/mixed/pull/1");
  for (const path of Object.keys(production)) {
    expect(snapshot.files.find(file => file.path === path)?.exclusion).toBeUndefined();
    const language = path.endsWith(".go") ? "Go" : path.endsWith(".rs") ? "Rust" : "TypeScript";
    expect(await reader.source(snapshot.id, "head", path)).toMatchObject({ exists: true, commit: H, language });
  }
  for (const path of Object.keys(contexts)) {
    expect(snapshot.files.find(file => file.path === path)?.exclusion).toBeDefined();
    expect(await reader.source(snapshot.id, "head", path)).toMatchObject({ exists: true, commit: H });
  }
  for (const path of ["worker_test.go", "skip.spec.ts", "tests/smoke.rs", "generated.ts", "generated.rs", ".cargo/credentials.toml", ".env"]) {
    expect(await reader.source(snapshot.id, "head", path)).toMatchObject({ excluded: true });
  }
  const result = await reader.search(snapshot.id, "marker");
  expect(result.matches.map(match => match.path).sort()).toEqual(Object.keys(production).sort());
  expect(result.unread.map(item => item.path).sort()).toEqual(["generated.rs", "generated.ts"]);
  expect(result.scopeNote).toContain("not Rust items");
  expect(result.nextOffset).toBeNull();
});
