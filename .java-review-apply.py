"""One-time, checked Java integration edits; removed after the branch build."""
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parent

def replace(path, old, new, count=1):
    file = ROOT / path
    text = file.read_text()
    found = text.count(old)
    if found != count:
        raise RuntimeError(f"{path}: expected {count} occurrences, found {found}: {old[:100]!r}")
    file.write_text(text.replace(old, new))

reader = "adapters/opencode/lib/github.ts"
replace(reader, 'import { randomUUID } from "node:crypto";', 'import { randomUUID } from "node:crypto";\nimport { exclusion, generatedSourceReason, sourceReadExclusion } from "./source-policy.ts";\nexport { exclusion } from "./source-policy.ts";')
file = ROOT / reader
text = file.read_text()
start = text.index("export function exclusion(")
end = text.index("// A second boundary", start)
file.write_text(text[:start] + text[end:])
replace(reader, '''    const allowed = path.endsWith(".go") || path.endsWith(".md") || path.split("/").at(-1) === "go.mod";
    if (!allowed || path.endsWith("_test.go") || path.split("/").some(p => ["vendor", ".git", "node_modules"].includes(p))) {
      return { path, excluded: true, reason: "Only non-test Go, go.mod, and Markdown policy context are readable." };
    }''', '''    const excluded = sourceReadExclusion(path);
    if (excluded) return { path, excluded: true, reason: excluded };''')
replace(reader, r'''    if (path.endsWith(".go") && /^\/\/ Code generated .* DO NOT EDIT\.$/m.test(content)) {
      return { path, revision, commit: ref, excluded: true, reason: "generated Go source" };
    }''', '''    const generated = generatedSourceReason(path, content);
    if (generated) return { path, revision, commit: ref, excluded: true, reason: generated };''')
replace(reader, r'if (/^\/\/ Code generated .* DO NOT EDIT\.$/m.test(content)) {', 'if (generatedSourceReason(entry.path, content)) {')

replace("src/mcp.ts", "Find one literal substring in non-test Go at H", "Find one literal substring in non-test Go or Java at H")
replace("src/mcp.ts", "Read numbered source or policy at a pinned revision.", "Read numbered Go/Java source, supported build metadata or policy at a pinned revision.")
tools = "adapters/opencode/tools/super_review.ts"
replace(tools, "Read exact committed Go, go.mod, or Markdown policy context", "Read exact committed Go/Java source, supported build metadata, or Markdown policy context")
replace(tools, "Search a literal in non-test Go source", "Search a literal in non-test Go or Java source")
replace(tools, "omit for all Go source", "omit for all supported source")
paths = ["references/languages/index.md", "references/languages/java.md"]
for directory in ["lenses", "profiles"]:
    paths += [p.relative_to(ROOT / "skills/super-review").as_posix() for p in sorted((ROOT / f"skills/super-review/references/{directory}/java").glob("*.md"))]
assert len(paths) == 16
replace(tools, "] as const;", "".join("  " + json.dumps(path) + ",\n" for path in paths) + "] as const;")

skill = "skills/super-review/SKILL.md"
replace(skill, "[Go context](references/languages/go.md)", "[language routing](references/languages/index.md)")
workflow = "skills/super-review/references/workflow.md"
replace(workflow, "Inventory changed files, exclusions, Go modules, and `go` directives.", "Inventory changed files, exclusions, languages, modules, and supported baselines.\nResolve [language routing](languages/index.md) before selecting domain resources.")
replace(workflow, "| Lens | Question |", "The links below are Go resources; use the language router's Java counterparts\nfor Java tasks. The logical questions and default coverage remain the same.\n\n| Lens | Question |")
replace(workflow, "applicable Go versions/build constraints", "task language, applicable language/API baseline and build constraints")
replace(workflow, "Task ID, one lens,", "Task ID, one language, one lens,")
replace(workflow, "[Go context](languages/go.md)", "its assigned language context")
replace(workflow, "assigned lens, [candidate format]", "assigned language-specific lens, [candidate format]")

contract = "skills/super-review/references/review-contract.md"
replace(contract, "tests (`*_test.go`)", "tests (`*_test.go` and Java test source sets)")
verify = "skills/super-review/references/verification.md"
replace(verify, "[Go context](languages/go.md)", "[the applicable language context](languages/index.md)")
replace(verify, "API and method sets", "API and method contracts")
replace(verify, "error identity, absence, and defer/lifetime", "error identity, absence, and cleanup/lifetime")

for path, addition in [
    ("skills/super-review/references/aspects.md", "Resolve resource paths through [language routing](languages/index.md) before\nloading a lens/profile. Table links below are Go resources; Java uses the matching\nJava modules with the same logical owners and source-driven applicability. An\nordinary Java catch or null check alone is not an error-expression signal.\n"),
    ("skills/super-review/references/team-rules.md", "Java rules use `Language: Java`, the same logical lens names, and `java.*` IDs\nfrom the [language-specific lenses](languages/index.md). Go IDs and meanings stay\nunchanged. A Java disable/refinement applies only to its declared Java scope; a\nGo rule is not an alternative way to emit disabled Java advice. Selected profiles\ninherit the effective owner rule in their own language.\n"),
]:
    file = ROOT / path
    heading, rest = file.read_text().split("\n", 1)
    file.write_text(heading + "\n\n" + addition + rest)

shared = [
    skill, contract, "README.md", "package.json", "plugin.json", ".codex-plugin/plugin.json",
    ".agents/plugins/marketplace.json", ".claude-plugin/marketplace.json",
    "skills/super-review/agents/openai.yaml",
    "adapters/claude/skill.md", "adapters/claude/orchestrator.md", "adapters/claude/specialist.md",
    "adapters/opencode/agents/super-review.md", "adapters/opencode/agents/super-review-specialist.md",
    "adapters/opencode/commands/super-review.md",
    "skills/super-review/references/harnesses/codex.md", "skills/super-review/references/harnesses/claude.md",
    "skills/super-review/references/team-rules.md",
    "skills/super-review/assets/finding-template.md", "skills/super-review/assets/report-template.md",
]
phrases = {
    "Go pull request": "Go or Java pull request", "Go PR": "Go or Java PR",
    "Go source": "Go or Java source", "Go code": "Go or Java code",
    "Go review": "Go and Java review", "idiomatic Go": "idiomatic Go and Java",
    "Go versions": "language baselines", "Go version": "language baseline",
}
for path in shared:
    file = ROOT / path
    text = file.read_text()
    for old, new in phrases.items():
        text = text.replace(old, new)
    text = re.sub(r"\bGo\s+context\b", "assigned language context", text)
    if path in ["adapters/claude/specialist.md", "adapters/opencode/agents/super-review-specialist.md"]:
        text = text.replace("`references/languages/go.md`", "the task's assigned language context")
    file.write_text(text)

for path in ["plugin.json", ".codex-plugin/plugin.json"]:
    file = ROOT / path
    data = json.loads(file.read_text())
    if "go" in data.get("keywords", []) and "java" not in data["keywords"]:
        data["keywords"].insert(data["keywords"].index("go") + 1, "java")
    file.write_text(json.dumps(data, indent=2) + "\n")

readme = ROOT / "README.md"
text = readme.read_text().replace("Other languages and GitHub Enterprise are not supported.", "Languages other than Go and Java, and GitHub Enterprise, are not supported.")
text += "\n## Java support\n\nJava uses the same eight base lenses, two conditional lenses and four owner\nprofiles as Go, with separate `java.*` rules and language-specific task packets.\nMaven/Gradle module and source-set baselines constrain advice; records, streams,\nOptional, builders and interfaces are not mandatory upgrades. Mixed Go/Java PRs\nkeep each language's rules and coverage distinct.\n\nThe reader accepts production `.java` and supporting build metadata, excluding\nknown test/generated roots without executing project code. Custom source sets\nand unavailable framework/build contracts remain explicit context gaps. See\n[Java design and sources](docs/java-review.md) and the\n[Java team-rule example](examples/team-rules/java.md).\n"
readme.write_text(text)

changelog = ROOT / "CHANGELOG.md"
text = changelog.read_text()
entry = "- Add Java-specific review context, ten lens modules and four owner profiles with stable `java.*` IDs; preserve existing Go rules.\n- Route Java source and build context through the shared read-only reader and all three adapters.\n- Add contrasting Java judgment fixtures and mechanical acquisition/resource checks; regenerate native packages.\n"
if "## Unreleased\n" in text:
    text = text.replace("## Unreleased\n", "## Unreleased\n\n" + entry, 1)
else:
    heading, rest = text.split("\n", 1)
    text = heading + "\n\n## Unreleased\n\n" + entry + "\n" + rest.lstrip("\n")
changelog.write_text(text)

validator = "scripts/validate.ts"
replace(validator, r'/^## (go\.[a-z0-9.-]+)$/gm', r'/^## ((?:go|java)\.[a-z0-9.-]+)$/gm')
replace(validator, "No stable Go rule IDs.", "No stable language rule IDs.")
replace(validator, 'const expectedIDs: string[] = JSON.parse(await readFile(join(root, "evals/go/rule-ids.json"), "utf8"));', 'const expectedIDs: string[] = [];\nfor (const language of ["go", "java"]) {\n  expectedIDs.push(...JSON.parse(await readFile(join(root, "evals/" + language + "/rule-ids.json"), "utf8")));\n}')
replace("docs/java-review.md", "The [Java evaluation suite](../evals/java/README.md)", "The Java evaluation suite (`evals/java/README.md` in the source repository)")
print("Applied Java reader, routing, policy, metadata and validation integration.")
