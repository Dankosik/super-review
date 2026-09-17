import { expect, test } from "bun:test";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { tmpdir } from "node:os";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";

const root = resolve(import.meta.dir, "..");
const cursor = resolve(root, "adapters/cursor/plugin");
const canonical = resolve(root, "skills/super-review");
const read = (path: string) => readFileSync(resolve(root, path), "utf8");
function metadata(path: string): Record<string, any> {
  const match = /^---\n([\s\S]*?)\n---/.exec(read(path));
  if (!match) throw new Error("Missing frontmatter: " + path);
  return Bun.YAML.parse(match[1]) as Record<string, any>;
}
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

test("Cursor activation is explicit and orchestration stays in the selected chat", () => {
  const entry = metadata("adapters/cursor/skill.md");
  expect(entry.name).toBe("super-review");
  expect(entry["disable-model-invocation"]).toBe(true);
  for (const field of ["model", "effort", "context", "agent", "background"]) expect(entry[field]).toBeUndefined();
  expect(readdirSync(join(cursor, "skills"))).toEqual(["super-review"]);
  expect(existsSync(join(cursor, "commands"))).toBe(false);
});

test("Cursor specialist uses native inheritance and read-only foreground configuration", () => {
  const role = metadata("adapters/cursor/specialist.md");
  expect(role.name).toBe("super-review-specialist");
  expect(role.model).toBe("inherit");
  expect(role.readonly).toBe(true);
  expect(role.is_background).toBe(false);
  expect(Object.keys(role).sort()).toEqual(["description", "is_background", "model", "name", "readonly"]);
  expect(readdirSync(join(cursor, "agents"))).toEqual(["super-review-specialist.md"]);
});

test("Cursor manifest declares only the native skill and specialist", () => {
  const manifest = JSON.parse(read("adapters/cursor/plugin/.cursor-plugin/plugin.json"));
  const source = JSON.parse(read("plugin.json"));
  expect(manifest.name).toBe(source.name);
  expect(manifest.version).toBe(JSON.parse(read("package.json")).version);
  expect(manifest.author).toEqual({ name: source.author.name });
  expect(manifest.skills).toBe("./skills/");
  expect(manifest.agents).toBe("./agents/");
  for (const field of ["mcpServers", "hooks", "commands", "rules", "model"]) expect(manifest[field]).toBeUndefined();
});

test("Cursor generated templates and the complete shared policy are byte-identical", () => {
  for (const [source, installed] of [
    ["adapters/cursor/skill.md", "skills/super-review/SKILL.md"],
    ["adapters/cursor/specialist.md", "agents/super-review-specialist.md"],
    ["docs/cursor.md", "README.md"],
    ["LICENSE", "LICENSE"],
    ["PRIVACY.md", "PRIVACY.md"],
    ["THIRD_PARTY_NOTICES.md", "THIRD_PARTY_NOTICES.md"],
  ]) expect(readFileSync(join(cursor, installed))).toEqual(readFileSync(resolve(root, source)));
  const installed = join(cursor, "resources/super-review");
  const paths = files(canonical).map(path => relative(canonical, path));
  expect(files(installed).map(path => relative(installed, path))).toEqual(paths);
  for (const path of paths) expect(readFileSync(join(installed, path))).toEqual(readFileSync(join(canonical, path)));
});

test("Cursor resource links survive project and user installs, including paths with spaces", () => {
  const scratch = mkdtempSync(join(tmpdir(), "super-review-cursor-"));
  try {
    for (const destination of [join(scratch, "project with spaces/.cursor"), join(scratch, "home/.cursor")]) {
      for (const path of ["skills/super-review", "resources/super-review", "agents/super-review-specialist.md"]) {
        mkdirSync(dirname(join(destination, path)), { recursive: true });
        cpSync(join(cursor, path), join(destination, path), { recursive: true });
      }
      const entry = join(destination, "skills/super-review/SKILL.md");
      const targets = [...readFileSync(entry, "utf8").matchAll(/\]\(([^)]+)\)/g)]
        .map(match => resolve(dirname(entry), match[1]));
      expect(targets).toEqual([
        join(destination, "resources/super-review/SKILL.md"),
        join(destination, "resources/super-review/references/harnesses/cursor.md"),
      ]);
      for (const target of targets) expect(existsSync(target)).toBe(true);
    }
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
});

test("Cursor package contains neither a custom runtime nor evaluator material", () => {
  const paths = files(cursor).map(path => relative(cursor, path));
  expect(paths.filter(path => /(^|\/)(runtime|tools|node_modules|evals)\//.test(path))).toEqual([]);
  expect(paths.filter(path => /(^|\/)(\.?mcp\.json|package\.json)$/.test(path))).toEqual([]);
});

test("Cursor routing instructions retain override and capability boundaries (static only)", () => {
  const harness = read("skills/super-review/references/harnesses/cursor.md");
  for (const phrase of ["Для subagent используй", "per-call model selector", "stop affected dispatch", "effective model is not exposed", "A new review defaults to inheritance"]) {
    expect(harness).toContain(phrase);
  }
  expect(read("skills/super-review/SKILL.md")).toContain("[Cursor](references/harnesses/cursor.md)");
});

test("Cursor stage inputs and separate graders have matching, unique contrast IDs", () => {
  const inputs: Array<{ id: string; request: string; host: { parent_model: string; selectable_models: string[] } }> = JSON.parse(read("evals/cursor/inputs.json"));
  const cases: Array<{ id: string; checks: string[] }> = JSON.parse(read("evals/cursor/cases.json"));
  const ids = inputs.map(input => input.id);
  expect(new Set(ids).size).toBe(inputs.length);
  expect(ids).toEqual(Array.from({ length: 12 }, (_, index) => "C" + String(index + 1).padStart(2, "0")));
  expect(cases.map(item => item.id)).toEqual(ids);
  for (const input of inputs) {
    expect(input.request.length).toBeGreaterThan(0);
    expect(input.host.parent_model).toBe("fixture-parent");
    expect(input.host.selectable_models.length).toBeGreaterThan(0);
    for (const field of ["checks", "expected", "expect"]) expect(field in input).toBe(false);
  }
  for (const item of cases) expect(item.checks.length).toBeGreaterThan(0);
  expect(read("evals/cursor/README.md")).toContain("NOT RUN in native Cursor");
});

test("Cursor archive is complete, checksummed and deterministic", () => {
  const version = JSON.parse(read("package.json")).version;
  const name = `super-review-${version}-cursor.zip`;
  const archive = join(root, "dist", name);
  python(["scripts/package.py"]);
  const first = createHash("sha256").update(readFileSync(archive)).digest("hex");
  const receipt = JSON.parse(read("dist/manifest.json"));
  expect(receipt.assets.find((asset: { name: string }) => asset.name === name)?.sha256).toBe(first);
  expect(read("dist/SHA256SUMS")).toContain(first + "  " + name + "\n");
  const names: string[] = JSON.parse(python([
    "-c", "import json,sys,zipfile; z=zipfile.ZipFile(sys.argv[1]); print(json.dumps(z.namelist()))", archive,
  ]));
  expect(names.sort()).toEqual(files(cursor).map(path => "super-review/" + relative(cursor, path).replaceAll("\\", "/")).sort());
  python(["scripts/package.py"]);
  expect(createHash("sha256").update(readFileSync(archive)).digest("hex")).toBe(first);
}, 20000);
