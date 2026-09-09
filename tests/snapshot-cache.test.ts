import { describe, expect, test } from "bun:test";
import { mkdtempSync, rmSync, symlinkSync, writeFileSync, chmodSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { SnapshotCache } from "../src/snapshot-cache.ts";
import { GitHubReader, type Snapshot } from "../adapters/opencode/lib/github.ts";

function withCache(run: (path: string) => unknown) {
  const path = mkdtempSync(join(tmpdir(), "super-review-cache-test-"));
  return Promise.resolve().then(() => run(path)).finally(() => rmSync(path, { recursive: true, force: true }));
}
function snapshot(): Snapshot {
  return { id: randomUUID(), url: "https://github.com/acme/service/pull/7", repository: "acme/service", headRepository: "author/service",
    B: "a".repeat(40), H: "b".repeat(40), D: "c".repeat(40), files: [{ path: "main.go", status: "modified", patchAvailable: true, patch: "@@ -1 +1 @@\n-old\n+new" }] };
}

describe("shared native snapshots", () => {
  test("another reader uses an issued immutable snapshot without repinning the PR", () => withCache(async path => {
    const original = snapshot();
    new SnapshotCache(path).save(original);
    const queried: string[] = [];
    const reader = new GitHubReader(async endpoint => { queried.push(endpoint); throw new Error("No remote lookup expected"); }, new SnapshotCache(path));
    expect(reader.diff(original.id, "main.go")).toMatchObject({ H: original.H, D: original.D, available: true });
    expect(reader.files(original.id).files[0].path).toBe("main.go");
    expect(queried).toHaveLength(0);
  }));

  test("expired, forged, and traversing receipts are unavailable", () => withCache(path => {
    let now = 1_000;
    const cache = new SnapshotCache(path, () => now), original = snapshot();
    cache.save(original);
    expect(cache.load(original.id)?.H).toBe(original.H);
    expect(cache.load("../outside")).toBeUndefined();
    expect(cache.load(randomUUID())).toBeUndefined();
    now += 24 * 60 * 60 * 1000;
    expect(cache.load(original.id)).toBeUndefined();
    expect(() => cache.save({ ...snapshot(), B: "main" })).toThrow("invalid");
  }));

  test("does not follow a symlink or read a publicly accessible receipt", () => withCache(path => {
    const cache = new SnapshotCache(path), original = snapshot();
    cache.save(original);
    const target = join(path, original.id + ".json"), link = randomUUID();
    symlinkSync(target, join(path, link + ".json"));
    expect(cache.load(link)).toBeUndefined();
    if (process.getuid) {
      chmodSync(target, 0o644);
      expect(cache.load(original.id)).toBeUndefined();
    }
  }));

  test("ignores malformed cache data and prunes its oldest valid receipts", () => withCache(path => {
    let now = 1_000;
    const cache = new SnapshotCache(path, () => now++), first = snapshot();
    cache.save(first);
    const broken = randomUUID();
    writeFileSync(join(path, broken + ".json"), "{", { mode: 0o600 });
    expect(cache.load(broken)).toBeUndefined();
    for (let i = 0; i < 128; i++) cache.save(snapshot());
    expect(cache.load(first.id)).toBeUndefined();
    expect(readdirSync(path)).toHaveLength(129); // 128 valid receipts plus the unrelated malformed file.
  }));
});
