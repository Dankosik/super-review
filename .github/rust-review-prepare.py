"""One-time branch preparation; removed from the final PR after native build."""
from pathlib import Path

root = Path(__file__).resolve().parents[1]
def change(path, old, new):
    file = root / path
    text = file.read_text()
    if old not in text:
        raise RuntimeError(f"Expected source changed in {path}: {old[:90]!r}")
    file.write_text(text.replace(old, new))

reader = root / "adapters/opencode/lib/github.ts"
text = reader.read_text()
text = 'import { exclusion, generatedSource, readableSource, sourceLanguage, rustScopeNote, type SourceLanguage } from "./languages.ts";\nexport { exclusion } from "./languages.ts";\n' + text
text = text.replace('type ChangedFile = { path: string;', 'type ChangedFile = { path: string; language?: SourceLanguage;')
start = text.index('export function exclusion(')
end = text.index('// A second boundary', start)
text = text[:start] + text[end:]
text = text.replace('exclusion: exclusion(f.filename, f.status),', 'exclusion: exclusion(f.filename, f.status),\n      language: sourceLanguage(f.filename),')
start = text.index('    const allowed = path.endsWith(".go")')
end = text.index('    const { repo, ref } = this.revision', start)
text = text[:start] + '''    if (!readableSource(path)) {
      return { path, excluded: true, reason: "Only eligible Go/Rust source, supported manifest/configuration context, and Markdown are readable." };
    }
''' + text[end:]
text = text.replace('if (path.endsWith(".go") && /^\\/\\/ Code generated .* DO NOT EDIT\\.$/m.test(content))', 'if (generatedSource(path, content))')
text = text.replace('reason: "generated Go source"', 'reason: "generated source"')
text = text.replace('path, revision, commit: ref, blob: entry.sha, exists: true,', 'path, revision, commit: ref, blob: entry.sha, exists: true,\n      language: sourceLanguage(path), scopeNote: path.endsWith(".rs") ? rustScopeNote : undefined,')
text = text.replace('if (/^\\/\\/ Code generated .* DO NOT EDIT\\.$/m.test(content))', 'if (generatedSource(entry.path, content))')
text = text.replace('commit: snapshot.H, literal: needle, prefix,', 'commit: snapshot.H, literal: needle, prefix,\n      scopeNote: page.some(entry => entry.path.endsWith(".rs")) ? rustScopeNote : undefined,')
if 'Code generated' in text or 'const allowed =' in text:
    raise RuntimeError('Source-reader replacement did not complete')
reader.write_text(text)

change('src/mcp.ts', 'Find one literal substring in non-test Go at H, 20 files per page. Follow nextOffset for required remaining context.', 'Find one literal substring in candidate Go/Rust source at H, 20 files per page. Rust item/test scope still requires declaration context. Follow nextOffset for required remaining context.')

path = 'adapters/opencode/tools/super_review.ts'
resources = ['references/languages/rust.md']
resources += ['references/lenses/rust/' + name + '.md' for name in ['naming', 'control-flow', 'function-cohesion', 'data-flow', 'abstractions', 'duplication', 'api-clarity', 'change-locality', 'representation', 'rationale']]
resources += ['references/profiles/rust/' + name + '.md' for name in ['lifecycle-ownership', 'dependency-boundaries', 'effects-separation', 'error-expression']]
change(path, '  "assets/finding-template.md",', ''.join('  "' + name + '",\n' for name in resources) + '  "assets/finding-template.md",')
change(path, 'Read exact committed Go, go.mod, or Markdown policy context', 'Read exact committed Go/Rust source, supported manifest/configuration context, or Markdown')
change(path, 'Search a literal in non-test Go source at the pinned head, 20 files per call.', 'Search a literal in candidate Go/Rust source at the pinned head, 20 files per call. Rust item/test scope still requires declaration context.')
change(path, 'omit for all Go source', 'omit for all eligible Go/Rust source')

change('skills/super-review/SKILL.md', 'a Go pull request', 'a Go or Rust pull request')
change('skills/super-review/SKILL.md', '[workflow](references/workflow.md), [Go context](references/languages/go.md),\nand [team rules](references/team-rules.md).', '[workflow](references/workflow.md), the applicable language context\n([Go](references/languages/go.md) or [Rust](references/languages/rust.md)),\nand [team rules](references/team-rules.md).')
change('skills/super-review/references/review-contract.md', 'Review changed Go source and', 'Review changed Go or Rust production source and')
change('skills/super-review/references/review-contract.md', 'Exclude tests (`*_test.go`), generated files, vendor trees, binaries, and', 'Exclude tests (Go `*_test.go`; Rust test-only targets and items), generated files,\nvendor trees, binaries, and')

path = 'skills/super-review/references/workflow.md'
change(path, 'Inventory changed files, exclusions, Go modules, and `go` directives. Read each', 'Inventory changed files, languages, exclusions, Go modules/`go` directives, and\nRust crates/workspaces with their effective edition, MSRV, targets and features.\nManifests are context, not additional review targets. Read each')
change(path, '| Lens | Question |', 'The table links Go implementations. For Rust, use the corresponding modules in\n[Rust context](languages/rust.md); keep the same eight questions and select\nconditional aspects under [the shared catalog](aspects.md). Partition mixed-language\nareas when needed so a child receives only applicable language rules. Go rule IDs\nand profiles never implicitly govern Rust.\n\n| Lens | Question |')
change(path, 'applicable Go versions/build constraints.', 'applicable language, supported version/edition and build constraints.')
change(path, 'Each child needs the [contract](review-contract.md), [Go context](languages/go.md),\nassigned lens,', 'Each child needs the [contract](review-contract.md), its language context\n([Go](languages/go.md) or [Rust](languages/rust.md)), assigned language-specific lens,')
change('skills/super-review/references/aspects.md', '# Contextual aspects\n', '# Contextual aspects\n\nSelection and coverage are shared by Go and Rust. Links below identify Go\nimplementations; for Rust resolve the selected question to its counterpart in\n[Rust context](languages/rust.md), not the Go module.\n')
change('skills/super-review/references/aspects.md', 'Ordinary `if err != nil` alone is insufficient.', 'Ordinary Go `if err != nil` or Rust `?` alone is insufficient.')
change('skills/super-review/references/team-rules.md', 'No existing ID changes.', 'No existing Go ID changes. Rust uses the same lens names with the corresponding\n`rust.*` IDs in its own lens resources. Set `Language: Rust` explicitly; there is\nno implicit mapping from Go overrides to Rust rules. A profile inherits the\neffective owner rule of its own language.')
change('skills/super-review/references/team-rules.md', 'link to Go source', 'link to Go or Rust source')

# Independent host roles must not force Go resources into a Rust child packet.
for file in [root / 'adapters/claude/skill.md', root / 'adapters/claude/orchestrator.md', root / 'adapters/claude/specialist.md', *list((root / 'adapters/opencode/agents').glob('*.md')), *list((root / 'adapters/opencode/commands').glob('*.md')), *list((root / 'skills/super-review/references/harnesses').glob('*.md'))]:
    text = file.read_text()
    for old, new in [('Go pull request', 'Go or Rust pull request'), ('Go PR', 'Go/Rust PR'), ('Go source', 'Go or Rust source'), ('Go version', 'language baseline'), ('contract, Go\ncontext', 'contract, applicable language\ncontext'), ('Go context', 'applicable language context')]:
        text = text.replace(old, new)
    text = text.replace('`references/languages/go.md`', 'the applicable `references/languages/go.md` or `references/languages/rust.md`')
    file.write_text(text)

for name in ['package.json', 'plugin.json', '.codex-plugin/plugin.json', 'skills/super-review/agents/openai.yaml', 'README.md']:
    file = root / name
    text = file.read_text()
    for old, new in [('focused Go PR', 'focused Go/Rust PR'), ('Go pull request', 'Go or Rust pull request'), ('idiomatic Go', 'idiomatic Go and Rust'), ('changed Go area', 'changed Go or Rust area'), ('read-only Go review', 'read-only Go/Rust review')]:
        text = text.replace(old, new)
    file.write_text(text)
change('README.md', 'Other languages and GitHub Enterprise\nare not supported.', 'Languages other than Go and Rust, and GitHub Enterprise,\nare not supported. See [Rust support and source limits](docs/rust-review.md)\nand the [Rust team-rule example](examples/team-rules/RUST.md).')

file = root / 'scripts/validate.ts'
text = file.read_text().replace(r'/^## (go\.[a-z0-9.-]+)$/gm', r'/^## ((?:go|rust)\.[a-z0-9.-]+)$/gm')
start = text.index('if (ids.size === 0)')
end = text.index('for (const role of', start)
text = text[:start] + '''for (const language of ["go", "rust"]) {
  const expectedIDs: string[] = JSON.parse(await readFile(join(root, "evals/" + language + "/rule-ids.json"), "utf8"));
  const actual = [...ids].filter(id => id.startsWith(language + ".")).sort();
  if (!actual.length || JSON.stringify(actual) !== JSON.stringify(expectedIDs.sort())) errors.push(language + " rule IDs changed: document migration and update the manifest intentionally.");
}
''' + text[end:]
file.write_text(text)

file = root / 'CHANGELOG.md'
text = file.read_text()
heading, rest = text.split('\n', 1)
file.write_text(heading + '\n\n## Unreleased\n\n- Add Rust review through language-specific base/conditional lenses and owner profiles; preserve all Go rule IDs.\n- Read pinned Rust source and scoped Cargo context with explicit test/generated-item limitations.\n- Add Rust policy examples, contrasting evaluation packets and mechanical reader/resource tests. Live model quality has not been evaluated.\n' + rest)
print('Prepared Rust source access, language routing, policy metadata, validation and changelog.')
