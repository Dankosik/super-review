import { expect, test } from "bun:test";
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { tmpdir } from "node:os";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";

const root = resolve(import.meta.dir, "..");
const plugin = join(root, "adapters/antigravity/plugin");
function files(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry =>
    entry.isDirectory() ? files(join(directory, entry.name)) : [join(directory, entry.name)]
  ).sort();
}
function python(args: string[]): string {
  const result = spawnSync("python3", args, { cwd: root, encoding: "utf8" });
  if (result.status !== 0) throw new Error(result.stderr || result.error?.message || result.stdout);
  return result.stdout;
}

// Delivery contracts only: no model behavior is inferred from these checks.
test("Antigravity archive preserves the complete plugin and relocatable resources", () => {
  const version = JSON.parse(readFileSync(join(root, "package.json"), "utf8")).version;
  const name = `super-review-${version}-antigravity.zip`;
  python(["scripts/package.py"]);
  const archive = join(root, "dist", name);
  const checksum = createHash("sha256").update(readFileSync(archive)).digest("hex");
  const receipt = JSON.parse(readFileSync(join(root, "dist/manifest.json"), "utf8"));
  expect(receipt.assets.find((asset: { name: string }) => asset.name === name)?.sha256).toBe(checksum);
  expect(readFileSync(join(root, "dist/SHA256SUMS"), "utf8")).toContain(`${checksum}  ${name}\n`);
  const scratch = mkdtempSync(join(tmpdir(), "super review antigravity "));
  try {
    python(["-c", "import sys,zipfile; zipfile.ZipFile(sys.argv[1]).extractall(sys.argv[2])", archive, scratch]);
    const installed = join(scratch, "super-review");
    const names = files(plugin).map(file => relative(plugin, file));
    expect(files(installed).map(file => relative(installed, file))).toEqual(names);
    for (const path of names) expect(readFileSync(join(installed, path))).toEqual(readFileSync(join(plugin, path)));
    for (const name of ["super-review", "defect-review", "test-review", "perf-review"]) {
      const entry = join(installed, "skills", name, "SKILL.md");
      const links = [...readFileSync(entry, "utf8").matchAll(/\]\(([^)]+)\)/g)]
        .map(match => resolve(dirname(entry), match[1]));
      expect(links).toEqual([
        join(installed, "resources", name, "SKILL.md"),
        join(installed, "resources", name, "references/harnesses/antigravity.md"),
      ]);
      for (const link of links) expect(existsSync(link)).toBe(true);
    }
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
}, 20000);
