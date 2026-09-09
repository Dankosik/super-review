import { describe, expect, test } from "bun:test";
import { mkdtempSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { CompletionBatches } from "../src/completion-batch.ts";

async function fixture(run: (batch: CompletionBatches, path: string) => Promise<void> | void) {
  const root = mkdtempSync(join(tmpdir(), "super-review-barrier-test-"));
  try { await run(new CompletionBatches(root), root); }
  finally { rmSync(root, { recursive: true, force: true }); }
}
const completed = { status: "completed" as const, report: "Complete review; no candidates." };

describe("completion barrier", () => {
  test("one pending call waits for all submitted results across reader instances", () => fixture(async (first, path) => {
    const second = new CompletionBatches(path);
    const batch = first.open(randomUUID(), ["naming", "flow"]);
    let returned = false;
    const wait = first.wait(batch.id).then(value => { returned = true; return value; });
    second.submit(batch.id, batch.assignments[0].id, completed);
    await new Promise(resolve => setTimeout(resolve, 20));
    expect(returned).toBe(false);
    second.submit(batch.id, batch.assignments[1].id, completed);
    const result = await wait;
    expect(result.outcome).toBe("ready");
    expect(result.assignments.map(a => a.status)).toEqual(["completed", "completed"]);
    expect(result.assignments[0].report).toBe(completed.report);
    expect(result.assignments[0].nextOffset).toBeNull();
  }));

  test("completed-before-wait is not lost; same result retries are idempotent", () => fixture(async cache => {
    const batch = cache.open(randomUUID(), ["naming"]), assignment = batch.assignments[0].id;
    cache.submit(batch.id, assignment, completed);
    cache.submit(batch.id, assignment, completed);
    expect(() => cache.submit(batch.id, assignment, { ...completed, report: "different" })).toThrow("different terminal");
    expect((await cache.wait(batch.id)).outcome).toBe("ready");
  }));

  test("failed and missing assignments stay partial rather than becoming clean", () => fixture(async cache => {
    const failed = cache.open(randomUUID(), ["naming", "flow"]);
    cache.submit(failed.id, failed.assignments[0].id, completed);
    cache.submit(failed.id, failed.assignments[1].id, { status: "unfinished", report: "Source was unavailable." });
    expect((await cache.wait(failed.id)).outcome).toBe("partial");
    const missing = cache.open(randomUUID(), ["naming", "flow"], 25);
    cache.submit(missing.id, missing.assignments[0].id, completed);
    const result = await cache.wait(missing.id);
    expect(result.outcome).toBe("timed_out");
    expect(result.assignments[1].status).toBe("pending");
    expect(() => cache.submit(missing.id, missing.assignments[1].id, completed)).toThrow("deadline");
    expect((await cache.wait(missing.id)).outcome).toBe("timed_out");
  }));

  test("cancellation closes the wait without fabricating completion", () => fixture(async cache => {
    const batch = cache.open(randomUUID(), ["naming"]), controller = new AbortController();
    const wait = cache.wait(batch.id, controller.signal);
    controller.abort();
    await expect(wait).rejects.toThrow("cancelled");
    cache.submit(batch.id, batch.assignments[0].id, completed);
    expect((await cache.wait(batch.id)).outcome).toBe("ready");
  }));

  test("unissued assignment, path traversal, and oversized reports are rejected", () => fixture(async cache => {
    const batch = cache.open(randomUUID(), ["naming"]);
    expect(() => cache.submit(batch.id, randomUUID(), completed)).toThrow("Unknown assignment");
    await expect(cache.wait("../other")).rejects.toThrow("Unknown batch");
    expect(() => cache.submit(batch.id, batch.assignments[0].id, { ...completed, report: "x".repeat(70_000) })).toThrow("64 KiB");
    expect(() => cache.open(randomUUID(), ["same", "same"])).toThrow("distinct");
  }));

  test("result windows preserve every byte and another batch cannot supply a result", () => fixture(async cache => {
    const first = cache.open(randomUUID(), ["naming"]), second = cache.open(randomUUID(), ["flow"]);
    const report = "Candidate details.\n".repeat(2000);
    cache.submit(first.id, first.assignments[0].id, { ...completed, report });
    const ready = await cache.wait(first.id);
    expect(Buffer.byteLength(JSON.stringify(ready.assignments[0].report))).toBeLessThanOrEqual(2000);
    expect(ready.assignments[0].nextOffset).toBe(ready.assignments[0].report.length);
    let offset: number | null = 0, joined = "";
    do { const result = cache.result(first.id, first.assignments[0].id, offset); joined += result.report; offset = result.nextOffset; } while (offset !== null);
    expect(joined).toBe(report);
    expect(() => cache.result(second.id, first.assignments[0].id)).toThrow("Invalid result");
  }));

  test("non-ASCII reports stay within response windows without losing characters", () => fixture(async cache => {
    const batch = cache.open(randomUUID(), ["naming"]);
    const report = "Имена понятны. 🧭\n".repeat(1000);
    cache.submit(batch.id, batch.assignments[0].id, { ...completed, report });
    const first = (await cache.wait(batch.id)).assignments[0];
    expect(Buffer.byteLength(JSON.stringify(first.report))).toBeLessThanOrEqual(2000);
    let joined = first.report, offset = first.nextOffset;
    while (offset !== null) {
      const window = cache.result(batch.id, batch.assignments[0].id, offset);
      expect(Buffer.byteLength(JSON.stringify(window.report))).toBeLessThanOrEqual(6000);
      joined += window.report; offset = window.nextOffset;
    }
    expect(joined).toBe(report);
  }));

  test("refuses symlinked batch directories", () => fixture(async (cache, path) => {
    const batch = cache.open(randomUUID(), ["naming"]), alias = randomUUID();
    symlinkSync(join(path, batch.id), join(path, alias));
    await expect(cache.wait(alias)).rejects.toThrow("Invalid batch directory");
  }));
});
