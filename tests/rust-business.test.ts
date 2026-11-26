import { expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { posix, resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const read = (path: string) => readFileSync(resolve(root, path), "utf8");
const businessDir = resolve(root, "evals/rust/business");

type Packet = {
  id: string;
  lens: string;
  profiles: string[];
  request: string;
  scope: string;
  context: string;
  files: Record<string, string>;
};

type GraderCase = {
  id: string;
  polarity: "report" | "retain";
  rule: string;
  expect: string[];
  contrasts: string[];
};

const { inputs } = JSON.parse(read("evals/rust/business/inputs.json")) as { inputs: Packet[] };
const suite = JSON.parse(read("evals/rust/business/cases.json")) as {
  kind: string;
  status: string;
  baseline_revision: string;
  contrast_pairs: [string, string][];
  cases: GraderCase[];
};

// Mechanical fixture, boundary, and isolation checks only; these do not measure model judgment.
test("Rust business-logic packets and grader cases are isolated, multi-file, and symmetric", () => {
  expect(suite.kind).toBe("evaluator-only");
  expect(suite.baseline_revision).toMatch(/^[0-9a-f]{40}$/);

  const ids = inputs.map(item => item.id);
  expect(new Set(ids).size).toBe(ids.length);
  expect(suite.cases.map(item => item.id).sort()).toEqual([...ids].sort());
  expect(suite.contrast_pairs.flat().sort()).toEqual([...ids].sort());

  const byId = new Map(suite.cases.map(item => [item.id, item]));
  const inputById = new Map(inputs.map(item => [item.id, item]));
  const stableRules = new Set<string>(JSON.parse(read("evals/rust/rule-ids.json")));

  for (const [positive, negative] of suite.contrast_pairs) {
    const posCase = byId.get(positive)!;
    const negCase = byId.get(negative)!;
    const posIn = inputById.get(positive)!;
    const negIn = inputById.get(negative)!;
    expect(posCase.polarity).toBe("report");
    expect(negCase.polarity).toBe("retain");
    expect(posCase.contrasts).toContain(negative);
    expect(negCase.contrasts).toContain(positive);
    expect(posIn.lens).toBe(negIn.lens);
    expect(posIn.profiles).toEqual(negIn.profiles);
    expect(posCase.rule).toBe(negCase.rule);
  }

  for (const packet of inputs) {
    expect(packet.id).toMatch(/^RB\d{2}$/);
    expect(packet.request.length > 0 && packet.scope.length > 0 && packet.context.length > 0).toBe(true);
    for (const forbidden of ["polarity", "expect", "contrasts", "rule"]) {
      expect(Object.hasOwn(packet, forbidden)).toBe(false);
    }

    const filePaths = Object.keys(packet.files);
    expect(filePaths).toContain("Cargo.toml");
    expect(filePaths.filter(path => path.endsWith(".rs")).length).toBeGreaterThanOrEqual(3);
    expect(packet.files["Cargo.toml"]).toContain('edition = "2021"');
    expect(packet.files["Cargo.toml"]).toMatch(/rust-version = "1\.\d+"/);

    for (const [filePath, text] of Object.entries(packet.files)) {
      expect(posix.isAbsolute(filePath)).toBe(false);
      expect(filePath.split("/").some(part => ["", ".", ".."].includes(part))).toBe(false);
      expect(posix.normalize(filePath)).toBe(filePath);
      expect(text.endsWith("\n")).toBe(true);
    }

    const grader = byId.get(packet.id)!;
    expect(stableRules.has(grader.rule)).toBe(true);
    expect(grader.expect.length).toBeGreaterThan(0);

    const lensText = read(`skills/super-review/references/lenses/rust/${packet.lens}.md`);
    expect(lensText).toContain(`## ${grader.rule}`);
    for (const profile of packet.profiles) {
      const profileText = read(`skills/super-review/references/profiles/rust/${profile}.md`);
      expect(profileText).toContain(`Owner: ${packet.lens}`);
      expect(profileText).toContain(`Rule: ${grader.rule}`);
    }

    const serialized = JSON.stringify(packet);
    for (const expectation of grader.expect) {
      expect(serialized.includes(expectation)).toBe(false);
    }
  }

  const coveredLenses = new Set(inputs.map(item => item.lens));
  for (const requiredLens of ["representation", "function-cohesion", "logic", "control-flow", "placement", "naming", "conventions", "rationale", "change-locality"]) {
    expect(coveredLenses.has(requiredLens)).toBe(true);
  }
  const coveredProfiles = new Set(inputs.flatMap(item => item.profiles));
  for (const requiredProfile of ["effects-separation", "error-expression", "diagnostics"]) {
    expect(coveredProfiles.has(requiredProfile)).toBe(true);
  }
});

test("canonical instructions uphold Rust business-logic boundaries, spine-first synthesis, and length budgets", () => {
  const rustContext = read("skills/super-review/references/languages/rust.md");
  expect(rustContext.trimEnd().split("\n").length).toBeLessThanOrEqual(95);

  const skill = read("skills/super-review/SKILL.md");
  expect(skill).toContain("already-implemented business rules");

  const contract = read("skills/super-review/references/review-contract.md");
  expect(contract).toContain("unchanged domain or error type");
  expect(contract).toContain("already-implemented business rules");

  const workflow = read("skills/super-review/references/workflow.md");
  expect(workflow).toContain("neutral call-spine map");

  const verification = read("skills/super-review/references/verification.md");
  expect(verification).toContain("Spine-First Design It Twice");

  const teamRules = read("skills/super-review/references/team-rules.md");
  expect(teamRules).toContain("require selecting that conditional lens or");

  const findingTemplate = read("skills/super-review/assets/finding-template.md");
  expect(findingTemplate).toContain("Next change");
  const reportTemplate = read("skills/super-review/assets/report-template.md");
  expect(reportTemplate).toContain("Next change");

  const rustExample = read("examples/team-rules/RUST.md");
  expect(rustExample).toContain("reference-order.rs");
  expect(existsSync(resolve(root, "examples/team-rules/reference-order.rs"))).toBe(true);
});

test("Rust business-logic eval corpus stays outside skills and generated native packages", () => {
  expect(existsSync(resolve(businessDir, "README.md"))).toBe(true);
  const visit = (dir: string): void => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      expect(entry.name).not.toBe("business");
      if (entry.isDirectory()) visit(resolve(dir, entry.name));
    }
  };
  for (const target of [
    "skills/super-review",
    "adapters/claude/plugin",
    "adapters/codex/super-review",
    "adapters/cursor/plugin",
    "adapters/antigravity/plugin",
  ]) {
    visit(resolve(root, target));
  }
});
