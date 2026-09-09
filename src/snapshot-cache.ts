import { constants, closeSync, fstatSync, lstatSync, mkdirSync, openSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parsePR, safePath, type Snapshot, type SnapshotStore } from "../adapters/opencode/lib/github.ts";

const uuid = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
const sha = /^[a-f0-9]{40}$/;
const repo = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;
const maxFileBytes = 16 * 1024 * 1024;
const maxCacheBytes = 64 * 1024 * 1024;
const lifetime = 24 * 60 * 60 * 1000;

function valid(snapshot: Snapshot, id: string): boolean {
  try {
    return snapshot.id === id && parsePR(snapshot.url).repository === snapshot.repository &&
      repo.test(snapshot.repository) && repo.test(snapshot.headRepository) &&
      [snapshot.B, snapshot.H, snapshot.D].every(value => sha.test(value)) &&
      Array.isArray(snapshot.files) && snapshot.files.length <= 300 && snapshot.files.every(file =>
        safePath(file.path) && (!file.previousPath || safePath(file.previousPath)) &&
        typeof file.status === "string" && typeof file.patchAvailable === "boolean" &&
        (file.patch === undefined || typeof file.patch === "string"));
  } catch { return false; }
}

/** Shared only by this OS user, so native child processes can read an issued
 * snapshot without consulting a PR's now-mutable head. Never stores credentials. */
export class SnapshotCache implements SnapshotStore {
  constructor(
    private root = join(tmpdir(), "super-review-" + (process.getuid?.() ?? "user")),
    private now = Date.now,
  ) {
    try { mkdirSync(root, { mode: 0o700 }); }
    catch (error: any) { if (error.code !== "EEXIST") throw error; }
    const stat = lstatSync(root);
    if (!stat.isDirectory() || stat.isSymbolicLink() || (process.getuid && (stat.uid !== process.getuid() || (stat.mode & 0o077) !== 0))) {
      throw new Error("Super Review's snapshot cache must be a private directory owned by the current user.");
    }
  }

  private read(id: string): { createdAt: number; snapshot: Snapshot; size: number } | undefined {
    if (!uuid.test(id)) return undefined;
    let fd: number | undefined;
    try {
      fd = openSync(join(this.root, id + ".json"), constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0));
      const stat = fstatSync(fd);
      if (!stat.isFile() || stat.size > maxFileBytes || (process.getuid && (stat.uid !== process.getuid() || (stat.mode & 0o077) !== 0))) return undefined;
      const value = JSON.parse(readFileSync(fd, "utf8"));
      if (value.format !== "super-review-snapshot-1" || !Number.isSafeInteger(value.createdAt) || !valid(value.snapshot, id)) return undefined;
      return { createdAt: value.createdAt, snapshot: value.snapshot, size: stat.size };
    } catch { return undefined; }
    finally { if (fd !== undefined) closeSync(fd); }
  }

  load(id: string): Snapshot | undefined {
    const value = this.read(id);
    if (!value || value.createdAt > this.now() || this.now() - value.createdAt >= lifetime) return undefined;
    return value.snapshot;
  }

  save(snapshot: Snapshot): void {
    if (!uuid.test(snapshot.id) || !valid(snapshot, snapshot.id)) throw new Error("Cannot cache an invalid source snapshot.");
    const content = JSON.stringify({ format: "super-review-snapshot-1", createdAt: this.now(), snapshot });
    const size = Buffer.byteLength(content);
    if (size > maxFileBytes) throw new Error("Snapshot exceeds the shared 16 MiB receipt limit.");
    const entries = readdirSync(this.root).filter(name => name.endsWith(".json")).flatMap(name => {
      const id = name.slice(0, -5), entry = this.read(id);
      return entry ? [{ id, ...entry }] : [];
    }).sort((a, b) => a.createdAt - b.createdAt);
    let total = entries.reduce((sum, entry) => sum + entry.size, size);
    let count = entries.length;
    for (const entry of entries) {
      if (this.now() - entry.createdAt < lifetime && total <= maxCacheBytes && count < 128) continue;
      try { unlinkSync(join(this.root, entry.id + ".json")); total -= entry.size; count--; }
      catch (error: any) { if (error.code !== "ENOENT") throw error; }
    }
    const fd = openSync(join(this.root, snapshot.id + ".json"), constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | (constants.O_NOFOLLOW ?? 0), 0o600);
    try { writeFileSync(fd, content); }
    finally { closeSync(fd); }
  }
}
