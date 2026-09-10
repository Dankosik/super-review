from pathlib import Path
import json
import re

# One-shot authoring aid. The preparation workflow removes this file and itself
# before committing the ordinary sources and their generated native payloads.
def patch(name, old, new):
    path = Path(name)
    text = path.read_text()
    if text.count(old) != 1:
        raise RuntimeError(f'{name}: expected exactly one occurrence of {old!r}, found {text.count(old)}')
    path.write_text(text.replace(old, new))

reader = 'adapters/opencode/lib/github.ts'
patch(reader, 'import { randomUUID } from "node:crypto";', 'import { randomUUID } from "node:crypto";\nimport { sourceLanguage, isInternalPath, isTestSource, isReadableContext, isGeneratedSource } from "./source-files.ts";')
patch(reader, 'if (path.split("/").some(p => ["vendor", "node_modules", ".git"].includes(p))) return "vendored or repository internals";', 'if (isInternalPath(path)) return "vendored or repository internals";')
patch(reader, 'if (path.endsWith("_test.go")) return "test file";', 'if (isTestSource(path)) return "test file";')
patch(reader, 'if (!path.endsWith(".go")) return "unsupported language or non-source file";', 'if (!sourceLanguage(path)) return "unsupported language or non-source file";')
patch(reader, 'const allowed = path.endsWith(".go") || path.endsWith(".md") || path.split("/").at(-1) === "go.mod";', 'const allowed = Boolean(sourceLanguage(path)) || isReadableContext(path);')
patch(reader, 'if (!allowed || path.endsWith("_test.go") || path.split("/").some(p => ["vendor", ".git", "node_modules"].includes(p))) {', 'if (!allowed || isTestSource(path) || isInternalPath(path)) {')
patch(reader, 'Only non-test Go, go.mod, and Markdown policy context are readable.', 'Only non-test Go/TypeScript, supported compatibility files, and Markdown policy context are readable.')
patch(reader, r'if (path.endsWith(".go") && /^\/\/ Code generated .* DO NOT EDIT\.$/m.test(content)) {', 'if (isGeneratedSource(path, content)) {')
patch(reader, 'reason: "generated Go source"', 'reason: "generated source"')
patch(reader, r'if (/^\/\/ Code generated .* DO NOT EDIT\.$/m.test(content)) {', 'if (isGeneratedSource(entry.path, content)) {')

skill = 'skills/super-review/'
patch(skill + 'SKILL.md', 'of a Go pull request', 'of a Go or TypeScript pull request')
patch(skill + 'SKILL.md', '[workflow](references/workflow.md), [Go context](references/languages/go.md),', '[workflow](references/workflow.md), [language routing](references/languages.md),')
patch(skill + 'references/review-contract.md', 'Review changed Go source and', 'Review changed Go and TypeScript source and')
patch(skill + 'references/review-contract.md', 'Exclude tests (`*_test.go`), generated files, vendor trees, binaries, and\nunsupported languages.', 'Exclude tests (`*_test.go`, TS `*.test.*`/`*.spec.*`, and established test\ndirectories), generated files, vendor trees, binaries, and unsupported languages.\nUse [language routing](languages.md) for included extensions and context boundaries.')
patch(skill + 'references/workflow.md', 'Inventory changed files, exclusions, Go modules, and `go` directives.', 'Inventory changed files, exclusions, languages, and owning packages/modules.\nApply [language routing](languages.md) and record each area\'s applicable baseline.')
patch(skill + 'references/workflow.md', 'Partition large changes by coherent areas.', 'Resolve the table\'s lens names to their language-specific resources using\n[language routing](languages.md); the links above are Go implementations, not\nmandatory resources for TypeScript. Partition mixed-language or large changes by\nlanguage and coherent areas.')
patch(skill + 'references/workflow.md', 'applicable Go versions/build constraints.', 'language, selected resource paths, applicable compiler/runtime and build constraints.')
patch(skill + 'references/workflow.md', 'Each child needs the [contract](review-contract.md), [Go context](languages/go.md),\nassigned lens,', 'Each child needs the [contract](review-contract.md), the matching language context\nand assigned lens from [language routing](languages.md),')
patch(skill + 'references/verification.md', 'using [Go context](languages/go.md): exact supported operation/signature, effects,\nAPI and method sets, ownership/mutation, error identity, absence, and defer/lifetime.', 'using the matching context from [language routing](languages.md): exact supported\noperation/signature, effects, API/type contracts, ownership/mutation, error identity,\nabsence, and resource lifetime. Keep Go and TypeScript preservation rules scoped\nto their own language; account for TypeScript inference and emitted module behavior.')
patch(skill + 'references/aspects.md', 'A lens owns a question; a profile deepens one existing lens.', 'Resolve resource paths through [language routing](languages.md) for each area;\nthe catalog links below are the original Go implementations.\n\nA lens owns a question; a profile deepens one existing lens.')
patch(skill + 'references/team-rules.md', 'No existing ID changes.', 'No existing ID changes. TypeScript uses the matching `ts.*` headings from\n[language routing](languages.md), including `ts.representation.express-concepts`\nand `ts.rationale.explain-constraints`. Write `Language: TypeScript` for these\nrules (`TS` is an alias). Resolve rule IDs within the declared language; a Go\noverride cannot disable or replace a TS default, or vice versa.')
patch(skill + 'references/team-rules.md', 'link to Go source as `Code reference`', 'link to supported Go or TypeScript source as `Code reference`')
patch(skill + 'assets/report-template.md', 'Go versions, team policy sources/revisions, overrides, disabled rules, and conflicts.', 'Languages and applicable compiler/runtime baselines, team policy sources/revisions,\noverrides, disabled rules, and conflicts. Keep language-specific coverage explicit.')
for name in ['references/harnesses/codex.md', 'references/harnesses/claude.md']:
    path = Path(skill + name)
    text = path.read_text().replace('contract, Go\ncontext, assigned lens', 'contract, applicable\nlanguage context, assigned lens').replace('Go context, candidate format', 'Applicable language context, candidate format')
    path.write_text(text)

for name in ['adapters/claude/specialist.md', 'adapters/opencode/agents/super-review-specialist.md']:
    path = Path(name)
    text = path.read_text().replace('pinned Go source', 'pinned Go or TypeScript source').replace('Go version', 'language baseline').replace('`references/languages/go.md`', 'the applicable language context from `references/languages.md`')
    path.write_text(text)
for name in ['adapters/claude/orchestrator.md', 'adapters/claude/skill.md', 'adapters/opencode/agents/super-review.md', 'adapters/opencode/commands/super-review.md']:
    path = Path(name)
    text = path.read_text().replace('a Go PR', 'a Go or TypeScript PR').replace('a Go pull request', 'a Go or TypeScript pull request')
    path.write_text(text)

paths = ['references/languages.md', 'references/languages/typescript.md']
paths += ['references/lenses/typescript/' + name + '.md' for name in ['naming', 'control-flow', 'function-cohesion', 'data-flow', 'abstractions', 'duplication', 'api-clarity', 'change-locality', 'representation', 'rationale']]
paths += ['references/profiles/typescript/' + name + '.md' for name in ['lifecycle-ownership', 'dependency-boundaries', 'effects-separation', 'error-expression']]
patch('adapters/opencode/tools/super_review.ts', '  "assets/finding-template.md", "assets/report-template.md",', ''.join('  ' + json.dumps(name) + ',\n' for name in paths) + '  "assets/finding-template.md", "assets/report-template.md",')
patch('adapters/opencode/tools/super_review.ts', 'Read exact committed Go, go.mod, or Markdown policy context', 'Read exact committed Go/TypeScript, supported compatibility files, or Markdown policy context')
patch('adapters/opencode/tools/super_review.ts', 'non-test Go source', 'non-test Go and TypeScript source')
patch('adapters/opencode/tools/super_review.ts', 'omit for all Go source', 'omit for all supported source')
patch('src/mcp.ts', 'non-test Go at H', 'non-test Go and TypeScript at H')

validation = '''const tsIDs: string[] = [];
for (const file of runtimeFiles.filter(path => path.includes("/lenses/typescript/") && path.endsWith(".md"))) {
  const text = await readFile(file, "utf8");
  for (const match of text.matchAll(/^## (ts\\.[a-z0-9.-]+)$/gm)) tsIDs.push(match[1]);
}
const expectedTSIDs: string[] = JSON.parse(await readFile(join(root, "evals/typescript/rule-ids.json"), "utf8"));
if (new Set(tsIDs).size !== tsIDs.length || JSON.stringify(tsIDs.sort()) !== JSON.stringify(expectedTSIDs.sort())) errors.push("TypeScript rule IDs changed: update migration documentation and rule-ids.json intentionally.");
'''
patch('scripts/validate.ts', 'for (const role of ["super-review", "super-review-specialist"]) {', validation + 'for (const role of ["super-review", "super-review-specialist"]) {')
patch('scripts/validate.ts', 'ids.size + " stable rule IDs', '(ids.size + tsIDs.length) + " stable rule IDs')

for name in ['package.json', 'plugin.json', '.codex-plugin/plugin.json']:
    path = Path(name)
    data = json.loads(path.read_text())
    def describe(value):
        if isinstance(value, str):
            return re.sub(r'\bGo\b', 'Go and TypeScript', value)
        if isinstance(value, list):
            return [describe(item) for item in value]
        if isinstance(value, dict):
            return {key: describe(item) for key, item in value.items()}
        return value
    path.write_text(json.dumps(describe(data), indent=2) + '\n')

patch('README.md', 'readability, idiomatic Go, and maintainability', 'readability, idiomatic Go/TypeScript, and maintainability')
patch('README.md', 'every changed Go area', 'every changed Go or TypeScript area')
patch('README.md', 'same read-only Go review scope', 'same read-only review scope')
patch('README.md', '## Install once', '## Supported languages\n\nGo and TypeScript (`.ts`, `.tsx`, `.mts`, `.cts`, including handwritten declaration\nfiles) use language-specific instructions under the same eight review questions.\nMixed PRs are partitioned by language; Go rules are not applied to TS. Tests,\ngenerated code, and JavaScript/JSX remain excluded. Compiler/package files are\nread-only compatibility context. See [TypeScript support](docs/typescript-review.md)\nfor judgment, boundaries, and evaluation limits.\n\n## Install once')
patch('README.md', 'Other languages and GitHub Enterprise\nare not supported.', 'Languages other than Go/TypeScript and GitHub Enterprise\nare not supported.')
patch('README.md', 'and [examples](examples/team-rules/SUPER_REVIEW.md).', 'and [examples](examples/team-rules/SUPER_REVIEW.md). TypeScript rules use\n`Language: TypeScript` and the stable `ts.*` IDs, for example\n`Action: refine ts.abstractions.earn-the-boundary`; existing Go IDs do not change.')
changelog = Path('CHANGELOG.md')
text = changelog.read_text()
first, rest = text.split('\n', 1)
changelog.write_text(first + '\n\n## Unreleased — TypeScript review\n\n- Add language routing, TypeScript context, ten TS lens resources and four owner profiles with eleven stable `ts.*` rules; preserve all Go IDs.\n- Support TS/TSX/MTS/CTS and handwritten declarations in pinned source reads and caller search, with compatibility metadata and existing read-only boundaries.\n- Add contrasting evaluation inputs and mechanical source/resource tests; behavioral model evaluation remains separate and has not been run.\n- Regenerate native Claude/Codex payloads without changing models, permissions, or dependencies.\n' + rest)
print('Integrated TypeScript policy, reader, routing, validation, and descriptions.')
