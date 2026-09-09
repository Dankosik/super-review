import { constants, closeSync, fstatSync, linkSync, lstatSync, mkdirSync, openSync, readFileSync, readdirSync, rmSync, unlinkSync, watch, writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { tmpdir } from "node:os";
import { join } from "node:path";

const uuid = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
const ttl = 24 * 60 * 60 * 1000;
const maxReportBytes = 64 * 1024;
export type BatchResult = { status: "completed" | "not_applicable" | "unfinished"; report: string };
type Assignment = { id: string; task: string };
type Batch = { id: string; snapshot: string; createdAt: number; deadline: number; assignments: Assignment[] };

function reportWindow(report: string, offset: number, byteLimit: number) {
  let end = offset, upper = Math.min(report.length, offset + byteLimit);
  while (end < upper) {
    const middle = Math.ceil((end + upper) / 2);
    if (Buffer.byteLength(JSON.stringify(report.slice(offset, middle))) <= byteLimit) end = middle;
    else upper = middle - 1;
  }
  // Keep a UTF-16 surrogate pair together; continuation offsets remain character offsets.
  if (end < report.length && /[\uD800-\uDBFF]/.test(report[end - 1] ?? "")) end--;
  return { report: report.slice(offset, end), nextOffset: end < report.length ? end : null };
}

function privateDirectory(path: string) {
  try { mkdirSync(path, { mode: 0o700 }); }
  catch (error: any) { if (error.code !== "EEXIST") throw error; }
  const info = lstatSync(path);
  if (!info.isDirectory() || info.isSymbolicLink() || (process.getuid && (info.uid !== process.getuid() || (info.mode & 0o077)))) throw new Error("Batch storage must be private and owned by this OS user.");
}

function readJSON(path: string): any {
  const fd = openSync(path, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0));
  try {
    const info = fstatSync(fd);
    if (!info.isFile() || info.size > 128 * 1024 || (process.getuid && (info.uid !== process.getuid() || (info.mode & 0o077)))) throw new Error("Invalid batch record.");
    return JSON.parse(readFileSync(fd, "utf8"));
  } finally { closeSync(fd); }
}

function writeOnce(path: string, value: unknown) {
  const temporary = path + "." + randomUUID() + ".tmp";
  const fd = openSync(temporary, constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL, 0o600);
  try {
    try { writeFileSync(fd, JSON.stringify(value)); }
    finally { closeSync(fd); }
    linkSync(temporary, path);
  }
  finally { unlinkSync(temporary); }
}

/** A result barrier for native children. No models, processes, or agent scheduling. */
export class CompletionBatches {
  constructor(private root = join(tmpdir(), "super-review-batches-" + (process.getuid?.() ?? "user"))) {
    privateDirectory(root);
  }

  private directory(id: string) {
    if (!uuid.test(id)) throw new Error("Unknown batch receipt.");
    const directory = join(this.root, id);
    const info = lstatSync(directory);
    if (!info.isDirectory() || info.isSymbolicLink() || (process.getuid && (info.uid !== process.getuid() || (info.mode & 0o077)))) throw new Error("Invalid batch directory.");
    return directory;
  }

  private load(id: string): Batch {
    const batch = readJSON(join(this.directory(id), "batch.json"));
    if (batch.id !== id || !uuid.test(batch.snapshot) || !Number.isFinite(batch.deadline) || !Number.isFinite(batch.createdAt) || Date.now() - batch.createdAt > ttl || !Array.isArray(batch.assignments) || batch.assignments.length < 1 || batch.assignments.length > 3 || batch.assignments.some((a: Assignment) => !uuid.test(a.id) || typeof a.task !== "string")) throw new Error("Invalid or expired batch receipt.");
    return batch;
  }

  open(snapshot: string, tasks: string[], timeoutMs = 10 * 60 * 1000) {
    if (!uuid.test(snapshot) || tasks.length < 1 || tasks.length > 3 || new Set(tasks).size !== tasks.length || tasks.some(t => !t || t.length > 120) || timeoutMs <= 0 || timeoutMs > 10 * 60 * 1000) throw new Error("Use one to three distinct tasks on an issued source snapshot.");
    for (const name of readdirSync(this.root)) {
      if (!uuid.test(name)) continue;
      try {
        const path = this.directory(name), previous = readJSON(join(path, "batch.json"));
        if (Number.isFinite(previous.createdAt) && Date.now() - previous.createdAt > ttl) rmSync(path, { recursive: true });
      } catch { /* Unknown or damaged entries are not cleanup authority. */ }
    }
    const batch: Batch = { id: randomUUID(), snapshot, createdAt: Date.now(), deadline: Date.now() + timeoutMs, assignments: tasks.map(task => ({ id: randomUUID(), task })) };
    const directory = join(this.root, batch.id);
    privateDirectory(directory);
    writeOnce(join(directory, "batch.json"), batch);
    return batch;
  }

  submit(batchID: string, assignmentID: string, result: BatchResult) {
    const batch = this.load(batchID);
    if (!batch.assignments.some(a => a.id === assignmentID)) throw new Error("Unknown assignment in this batch.");
    if (!["completed", "not_applicable", "unfinished"].includes(result.status) || !result.report.trim() || Buffer.byteLength(result.report) > maxReportBytes) throw new Error("Submit an explicit status and a report of at most 64 KiB; never truncate findings silently.");
    const path = join(this.directory(batchID), assignmentID + ".json");
    if (Date.now() >= batch.deadline) {
      try {
        const previous = readJSON(path);
        if (previous.status === result.status && previous.report === result.report) return { recorded: true, assignment: assignmentID };
      } catch { /* A missing result cannot be added after the fixed deadline. */ }
      throw new Error("The batch deadline elapsed; late results cannot change its outcome.");
    }
    try { writeOnce(path, result); }
    catch (error: any) {
      if (error.code !== "EEXIST") throw error;
      const previous = readJSON(path);
      if (previous.status !== result.status || previous.report !== result.report) throw new Error("This assignment already has a different terminal result.");
    }
    return { recorded: true, assignment: assignmentID };
  }

  private state(batch: Batch) {
    const directory = this.directory(batch.id);
    return batch.assignments.map(assignment => {
      try {
        const result = readJSON(join(directory, assignment.id + ".json"));
        if (!["completed", "not_applicable", "unfinished"].includes(result.status) || typeof result.report !== "string") throw new Error("Invalid submitted result.");
        return { ...assignment, status: result.status as BatchResult["status"], reportCharacters: result.report.length, ...reportWindow(result.report, 0, 2000) };
      } catch (error: any) {
        if (error.code !== "ENOENT") throw error;
        return { ...assignment, status: "pending" as const, reportCharacters: 0, report: "", nextOffset: null };
      }
    });
  }

  async wait(batchID: string, signal?: AbortSignal) {
    const batch = this.load(batchID);
    if (signal?.aborted) throw new Error("Batch wait cancelled.");
    return new Promise<{ batch: string; outcome: "ready" | "partial" | "timed_out"; assignments: ReturnType<CompletionBatches["state"]> }>((resolve, reject) => {
      let watcher: ReturnType<typeof watch> | undefined;
      let timer: ReturnType<typeof setTimeout> | undefined;
      let settled = false;
      const finish = (error?: Error) => {
        if (settled) return;
        settled = true;
        watcher?.close();
        clearTimeout(timer);
        signal?.removeEventListener("abort", cancel);
        if (error) { reject(error); return; }
        try {
          const assignments = this.state(batch);
          resolve({ batch: batch.id, outcome: assignments.some(a => a.status === "pending") ? "timed_out" : assignments.some(a => a.status === "unfinished") ? "partial" : "ready", assignments });
        } catch (error) { reject(error); }
      };
      const cancel = () => finish(new Error("Batch wait cancelled."));
      const inspect = () => {
        try {
          if (this.state(batch).every(a => a.status !== "pending") || Date.now() >= batch.deadline) finish();
        } catch (error) { finish(error as Error); }
      };
      // Subscribe before inspection, so a result cannot arrive in a check/watch gap.
      watcher = watch(this.directory(batchID), inspect);
      watcher.on("error", finish);
      signal?.addEventListener("abort", cancel, { once: true });
      timer = setTimeout(inspect, Math.max(1, batch.deadline - Date.now()));
      inspect();
      if (signal?.aborted) cancel();
    });
  }

  result(batchID: string, assignmentID: string, offset = 0) {
    const batch = this.load(batchID);
    if (!batch.assignments.some(a => a.id === assignmentID) || !Number.isInteger(offset) || offset < 0) throw new Error("Invalid result request.");
    const result = readJSON(join(this.directory(batchID), assignmentID + ".json")) as BatchResult;
    return { assignment: assignmentID, status: result.status, ...reportWindow(result.report, offset, 6000) };
  }
}
