import { expect, test } from "bun:test";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

// Fixture/routing/delivery integrity only. No model inference or Java execution.
const root = resolve(import.meta.dir, "..");
const skill = join(root, "skills/super-review");
const read = (path: string) => readFileSync(path, "utf8");
const profiles: Record<string, readonly [string, string]> = {
  "spring-bean-wiring": ["abstractions", "java.abstractions.earn-the-boundary"],
  "spring-application-operations": ["function-cohesion", "java.functions.coherent-purpose"],
  "spring-http-contracts": ["api-clarity", "java.api.express-the-call"],
  "spring-http-errors": ["control-flow", "java.flow.show-main-path"],
  "spring-managed-lifecycle": ["data-flow", "java.data.make-transformations-visible"],
  "spring-value-shapes": ["representation", "java.representation.express-concepts"],
};
const additions = ["references/spring.md", "references/spring/context.md",
  ...Object.keys(profiles).map(name => `references/profiles/java/${name}.md`)];
const packages = ["adapters/claude/plugin/resources/super-review",
  "adapters/codex/super-review/skills/super-review", "adapters/cursor/plugin/resources/super-review"];

function walk(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

test("Spring profiles deepen existing Java owners and are reachable", () => {
  const router = read(join(skill, "references/spring.md"));
  const ids: string[] = JSON.parse(read(join(root, "evals/java/rule-ids.json")));
  for (const [name, [owner, rule]] of Object.entries(profiles)) {
    const text = read(join(skill, `references/profiles/java/${name}.md`));
    expect(/^Owner: (.+)$/m.exec(text)?.[1]).toBe(owner);
    expect(/^Rule: (.+)$/m.exec(text)?.[1]).toBe(rule);
    expect(ids).toContain(rule);
    expect(read(join(skill, `references/lenses/java/${owner}.md`))).toContain("## " + rule);
    expect(text).not.toMatch(/^## (?:spring|java|go|ts|rust)\./m);
    expect(router).toContain(`[${name}](profiles/java/${name}.md) | ${owner} |`);
  }
  for (const path of ["references/languages.md", "references/aspects.md"]) {
    expect(read(join(skill, path))).toContain("](spring.md)");
  }
  expect(read(join(skill, "references/languages/java.md"))).toContain("](../spring.md)");
});

test("Spring additions preserve generic profile routing across languages", () => {
  const routing = read(join(skill, "references/languages.md"));
  for (const name of ["lifecycle-ownership", "dependency-boundaries", "effects-separation", "error-expression"]) {
    const row = routing.split("\n").find(line => line.startsWith(`| ${name} |`));
    expect(row).toBeDefined();
    for (const language of ["java", "typescript", "rust"]) {
      expect(row).toContain(`(profiles/${language}/${name}.md)`);
    }
    expect(row).toContain(`(profiles/${name}.md)`);
  }
});

test("Spring resource links remain inside the packaged skill", () => {
  for (const name of additions) {
    const path = join(skill, name);
    for (const match of read(path).matchAll(/\]\(([^)]+)\)/g)) {
      const target = match[1]!.split("#")[0]!;
      if (!target || /^[a-z]+:\/\//i.test(target)) continue;
      const destination = resolve(dirname(path), decodeURIComponent(target));
      expect(relative(skill, destination).startsWith("..")).toBe(false);
      expect(existsSync(destination)).toBe(true);
    }
  }
});

test("Spring resources and modified routing have byte-identical native copies", () => {
  const paths = [...additions, "references/languages.md", "references/languages/java.md", "references/aspects.md"];
  for (const path of paths) {
    for (const delivery of packages) {
      expect(readFileSync(join(root, delivery, path))).toEqual(readFileSync(join(skill, path)));
    }
  }
});

type Case = { id: string; packet: string; lens: string; profiles: string[];
  kind: "improvement" | "retain" | "guard"; expect: string[] };
const corpus = join(root, "evals/spring");
const cases: Case[] = JSON.parse(read(join(corpus, "cases.json"))).cases;

test("Spring neutral sections and evaluator-only cases match without orphan inputs", () => {
  expect(cases.length).toBeGreaterThan(0);
  expect(new Set(cases.map(item => item.id)).size).toBe(cases.length);
  const sections = new Map<string, { packet: string; source: string }>();
  for (const file of walk(join(corpus, "packets"))) {
    const packet = relative(corpus, file).replaceAll("\\", "/");
    const text = read(file);
    const markers = [...text.matchAll(/^## (S\d{2})$/gm)];
    expect(markers.length).toBeGreaterThan(0);
    for (let i = 0; i < markers.length; i++) {
      const marker = markers[i]!;
      const id = marker[1]!;
      expect(sections.has(id)).toBe(false);
      sections.set(id, { packet, source: text.slice(marker.index, markers[i + 1]?.index ?? text.length) });
    }
  }
  expect([...sections.keys()].sort()).toEqual(cases.map(item => item.id).sort());
  for (const item of cases) {
    const section = sections.get(item.id)!;
    expect(section.packet).toBe(item.packet);
    expect(section.source).toContain(`Snapshot: spring-fixture-${item.id}`);
    expect(section.source).toMatch(/^Baseline: .+/m);
    expect(section.source).toMatch(/^Request: .+/m);
    const fences = [...section.source.matchAll(/^```/gm)].length;
    expect(fences).toBeGreaterThan(0);
    expect(fences % 2).toBe(0);
    expect(section.source).not.toMatch(/(?:Expected outcome:|Grader:|cases\.json)/);
    expect(item.expect.length).toBeGreaterThan(0);
    expect(item.expect.every(value => typeof value === "string" && value.trim().length > 0)).toBe(true);
    for (const name of item.profiles) {
      expect(profiles[name]).toBeDefined();
      expect(profiles[name]![0]).toBe(item.lens);
    }
  }
  for (const name of Object.keys(profiles)) {
    const kinds = new Set(cases.filter(item => item.profiles.includes(name)).map(item => item.kind));
    expect(kinds.has("improvement")).toBe(true);
    expect(kinds.has("retain")).toBe(true);
  }
});

test("Spring evaluator material is not installed or linked from runtime policy", () => {
  for (const directory of [skill, ...packages.map(path => join(root, path))]) {
    expect(existsSync(join(directory, "evals"))).toBe(false);
    for (const file of walk(directory).filter(path => path.endsWith(".md"))) {
      const text = read(file);
      expect(text).not.toMatch(/\]\([^)]*evals\/spring/);
      expect(text).not.toContain("spring-fixture-S");
      expect(text).not.toContain("Evaluator-only contrasts.");
    }
  }
});
