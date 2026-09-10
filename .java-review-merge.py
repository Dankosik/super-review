"""One-time integration with the TypeScript support merged during Java work."""
from pathlib import Path
import json
import subprocess

BASE = '930a2416eb0f5ff6b90f569e7db0a837f23686e2'
MAIN = '53b9b86956c963fbed74cb5cf84c66fff6503fa5'
ROOT = Path(__file__).resolve().parent

def git(*args, check=True):
    return subprocess.run(['git', *args], cwd=ROOT, check=check, capture_output=True, text=True)

def replace(path, old, new, count=1):
    file = ROOT / path
    text = file.read_text()
    assert text.count(old) == count, (path, old, text.count(old))
    file.write_text(text.replace(old, new))

# Keep the committed TypeScript implementation of shared plumbing and extend it
# with Java. The final merge records MAIN as a parent; no main ref is changed.
git('-c', 'user.name=github-actions[bot]', '-c', 'user.email=41898282+github-actions[bot]@users.noreply.github.com', 'merge', '--no-commit', '--no-ff', '-s', 'ours', MAIN)
for path in git('diff', '--name-only', '-z', BASE, MAIN).stdout.split('\0'):
    if not path:
        continue
    if git('cat-file', '-e', MAIN + ':' + path, check=False).returncode == 0:
        git('restore', '--source=' + MAIN, '--staged', '--worktree', '--', path)
    else:
        git('rm', '--ignore-unmatch', '--', path)

# Reuse the shared classifier introduced in main rather than a second Java-only
# classification layer. Existing Go and TypeScript classification stays intact.
(ROOT / 'adapters/opencode/lib/source-files.ts').write_text(r'''// Shared file classification for the inventory, source reader, and caller search.
// Configuration is readable context, not a review target or executable input.
const typeScriptExtension = /\.(?:ts|tsx|mts|cts)$/;
const typeScriptTest = /\.(?:test|spec)\.(?:ts|tsx|mts|cts)$/;
const testDirectories = new Set(["test", "tests", "__tests__", "__mocks__", "__snapshots__"]);
const javaTestRoot = /(?:^|\/)src\/(?:test|testFixtures|integrationTest|androidTest)\//;
const javaGeneratedRoot = /(?:^|\/)(?:target\/generated-(?:test-)?sources|build\/generated)\//;
const contextNames = new Set([
  "go.mod", "package.json", "package-lock.json", "npm-shrinkwrap.json",
  "pnpm-lock.yaml", "yarn.lock", "bun.lock",
  "pom.xml", "build.gradle", "build.gradle.kts", "settings.gradle",
  "settings.gradle.kts", "gradle.properties",
]);

export function sourceLanguage(path: string): "Go" | "Java" | "TypeScript" | undefined {
  if (path.endsWith(".go")) return "Go";
  if (path.endsWith(".java")) return "Java";
  if (typeScriptExtension.test(path)) return "TypeScript";
  return undefined;
}

export function isInternalPath(path: string): boolean {
  return path.split("/").some(part => ["vendor", "node_modules", ".git"].includes(part));
}

export function isGeneratedPath(path: string): boolean {
  return path.endsWith(".java") && javaGeneratedRoot.test(path);
}

export function isTestSource(path: string): boolean {
  if (path.endsWith("_test.go")) return true;
  if (path.endsWith(".java")) return javaTestRoot.test(path);
  if (sourceLanguage(path) !== "TypeScript") return false;
  return typeScriptTest.test(path) || path.split("/").slice(0, -1).some(part => testDirectories.has(part));
}

export function isReadableContext(path: string): boolean {
  const name = path.split("/").at(-1)!;
  return path.endsWith(".md") || contextNames.has(name) ||
    name.endsWith(".gradle") || name.endsWith(".gradle.kts") || name.endsWith(".versions.toml") ||
    /^tsconfig(?:\.[A-Za-z0-9_-]+)*\.jsonc?$/.test(name) ||
    /^[A-Za-z0-9_.-]+\.tsconfig\.jsonc?$/.test(name);
}

export function isGeneratedSource(path: string, content: string): boolean {
  const language = sourceLanguage(path);
  if (language === "Go") return /^\/\/ Code generated .* DO NOT EDIT\.$/m.test(content);
  if (language !== "TypeScript" && language !== "Java") return false;
  // Recognize markers in leading comments only, not strings or examples in code.
  const header = /^(?:\uFEFF)?(?:#![^\n]*\n)?\s*((?:(?:\/\/[^\n]*(?:\n|$)|\/\*[\s\S]*?\*\/)\s*)*)/.exec(content)?.[1] ?? "";
  if (language === "Java") return /\bgenerated\b/i.test(header) && /\bdo not edit\b/i.test(header);
  return /(?:@generated\b|\bCode generated\b[^\n]*\bDO NOT EDIT\b|\bauto[- ]generated\b)/i.test(header);
}
''')
(ROOT / 'adapters/opencode/lib/source-policy.ts').unlink()
reader = 'adapters/opencode/lib/github.ts'
replace(reader, 'isReadableContext, isGeneratedSource }', 'isReadableContext, isGeneratedSource, isGeneratedPath }')
replace(reader, '  if (isTestSource(path)) return "test file";', '  if (isTestSource(path)) return "test file";\n  if (isGeneratedPath(path)) return "generated source root";')
replace(reader, 'if (!allowed || isTestSource(path) || isInternalPath(path))', 'if (!allowed || isTestSource(path) || isInternalPath(path) || isGeneratedPath(path))')

# The language router from main is the only catalog; no competing Java router.
(ROOT / 'skills/super-review/references/languages/index.md').unlink()
router = '''# Language routing

Select the language from included source at H, not the PR title or the language
used to implement this skill. Keep the shared contract, questions, and acceptance
criteria; use the matching language's context, lens, profiles, and rule namespace.
Do not translate one language's idioms into another or load multiple language
implementations into a specialist assigned to one language.

| Language | Included source, subject to the contract's exclusions | Context |
| --- | --- | --- |
| Go | `.go` | [Go](languages/go.md) |
| Java | `.java` | [Java](languages/java.md) |
| TypeScript | `.ts`, `.tsx`, `.mts`, `.cts`, including handwritten `.d.ts`, `.d.mts`, `.d.cts` | [TypeScript](languages/typescript.md) |

JavaScript/JSX and other languages remain unsupported; `allowJs` does not extend
coverage. A declaration file is not generated merely because it has no runtime
body. Known generated files and tests remain excluded. Build/package manifests,
lockfiles, and compiler configuration are compatibility evidence, not additional
review targets or executable input. Use committed source-set evidence for custom
Java test/generated layouts. Disclose unavailable configuration or supporting
source rather than silently applying another module or package's settings.

For a mixed PR, partition work by language and coherent area. Preserve the eight
base questions for each included area without duplicating completed work. A
cross-language boundary can supply context, not an excuse to claim unsupported
coverage. Record language, applicable baseline, selected resource paths, and
language-scoped rules in each task packet. Parent verification uses that same
language context. Missing language resources are a coverage gap, not a Go fallback.
No additional all-purpose idiom agent or language worker quota is introduced.

## Lens resources

The workflow and aspect catalog name questions. Their original resource links
are the Go implementations; resolve the actual resource using this table before
delegation. Load only the assigned implementation and selected owner profiles.
Existing `go.*` and `ts.*` IDs retain their meaning; Java uses separate `java.*` IDs.

| Lens | Go | Java | TypeScript |
| --- | --- | --- | --- |
'''
lenses = ['naming', 'control-flow', 'function-cohesion', 'data-flow', 'abstractions', 'duplication', 'api-clarity', 'change-locality', 'representation', 'rationale']
for lens in lenses:
    router += f'| {lens} | [Go](lenses/{lens}.md) | [Java](lenses/java/{lens}.md) | [TS](lenses/typescript/{lens}.md) |\n'
router += '''
## Contextual profiles

Use the existing source signals in [the aspect catalog](aspects.md). An ordinary
Java or TypeScript catch/null check alone is not an error-expression signal;
inspect translation or failure-path structure. Profiles retain their owner and
inherit its effective language-specific rules, including disables and overrides.
A rule for another language cannot revive disabled advice.

| Profile | Owner | Go | Java | TypeScript |
| --- | --- | --- | --- | --- |
'''
owners = {'lifecycle-ownership': 'data-flow', 'dependency-boundaries': 'abstractions', 'effects-separation': 'function-cohesion', 'error-expression': 'control-flow'}
for profile, owner in owners.items():
    router += f'| {profile} | {owner} | [Go](profiles/{profile}.md) | [Java](profiles/java/{profile}.md) | [TS](profiles/typescript/{profile}.md) |\n'
(ROOT / 'skills/super-review/references/languages.md').write_text(router)

# Extend only shared descriptions; leave language-specific rules and historical
# model studies untouched. Source references and policy still use pinned revisions.
shared = [
    'README.md', 'package.json', 'plugin.json', '.codex-plugin/plugin.json',
    '.agents/plugins/marketplace.json', '.claude-plugin/marketplace.json',
    'skills/super-review/SKILL.md', 'skills/super-review/agents/openai.yaml',
    'skills/super-review/references/review-contract.md',
    'skills/super-review/references/workflow.md', 'skills/super-review/references/aspects.md',
    'skills/super-review/references/team-rules.md', 'skills/super-review/references/verification.md',
    'skills/super-review/references/harnesses/codex.md', 'skills/super-review/references/harnesses/claude.md',
    'skills/super-review/assets/finding-template.md', 'skills/super-review/assets/report-template.md',
    'adapters/claude/skill.md', 'adapters/claude/orchestrator.md', 'adapters/claude/specialist.md',
    'adapters/opencode/agents/super-review.md', 'adapters/opencode/agents/super-review-specialist.md',
    'adapters/opencode/commands/super-review.md', 'adapters/opencode/tools/super_review.ts',
    'adapters/opencode/lib/github.ts', 'src/mcp.ts', 'evals/go/experiments/routing-first.json',
]
for path in shared:
    file = ROOT / path
    text = file.read_text()
    for old, new in [('Go or TypeScript', 'Go, Java, or TypeScript'), ('Go and TypeScript', 'Go, Java, and TypeScript'), ('Go/TypeScript', 'Go/Java/TypeScript')]:
        text = text.replace(old, new)
    file.write_text(text)

paths = ['references/languages/java.md'] + [f'references/lenses/java/{name}.md' for name in lenses] + [f'references/profiles/java/{name}.md' for name in owners]
replace('adapters/opencode/tools/super_review.ts', '] as const;', ''.join('  ' + json.dumps(path) + ',\n' for path in paths) + '] as const;')
for path in ['plugin.json', '.codex-plugin/plugin.json']:
    file = ROOT / path
    data = json.loads(file.read_text())
    if 'java' not in data.get('keywords', []):
        data.setdefault('keywords', []).append('java')
    file.write_text(json.dumps(data, indent=2) + '\n')

# Check Java identities alongside the existing unchanged Go/TypeScript checks.
validator = ROOT / 'scripts/validate.ts'
text = validator.read_text()
anchor = 'for (const role of ["super-review", "super-review-specialist"]) {'
assert text.count(anchor) == 1
block = '''const javaIDs: string[] = [];
for (const file of runtimeFiles.filter(path => path.includes("/lenses/java/") && path.endsWith(".md"))) {
  const text = await readFile(file, "utf8");
  for (const match of text.matchAll(/^## (java\\.[a-z0-9.-]+)$/gm)) javaIDs.push(match[1]);
}
const expectedJavaIDs: string[] = JSON.parse(await readFile(join(root, "evals/java/rule-ids.json"), "utf8"));
if (new Set(javaIDs).size !== javaIDs.length || JSON.stringify(javaIDs.sort()) !== JSON.stringify(expectedJavaIDs.sort())) errors.push("Java rule IDs changed: update migration documentation and rule-ids.json intentionally.");
'''
validator.write_text(text.replace(anchor, block + anchor))

# Tests exercise the actual shared classifier and all three supported languages.
tests = 'tests/java.test.ts'
replace(tests, 'import { GitHubReader }', 'import { GitHubReader, exclusion }')
replace(tests, 'import { exclusion, generatedSourceReason, sourceReadExclusion } from "../adapters/opencode/lib/source-policy.ts";', 'import { sourceLanguage, isInternalPath, isReadableContext, isGeneratedSource } from "../adapters/opencode/lib/source-files.ts";')
replace(tests, 'expect(sourceReadExclusion(path)).toBeUndefined();', 'expect(sourceLanguage(path)).toBeDefined();', count=2)
# The second loop is metadata, not production source.
replace(tests, 'expect(sourceLanguage(path)).toBeDefined();\n      expect(exclusion(path)).toBeDefined();', 'expect(isReadableContext(path)).toBe(true);\n      expect(exclusion(path)).toBeDefined();')
replace(tests, '      expect(sourceReadExclusion(path)).toBeDefined();\n', '')
replace(tests, 'expect(sourceReadExclusion("arbitrary.xml")).toBeDefined();', 'expect(isReadableContext("arbitrary.xml")).toBe(false);')
replace(tests, 'expect(sourceReadExclusion(".git/config.md")).toBeDefined();', 'expect(isInternalPath(".git/config.md")).toBe(true);')
file = ROOT / tests
text = file.read_text().replace('generatedSourceReason(', 'isGeneratedSource(')
text = text.replace('.toBe("generated Java source")', '.toBe(true)').replace('.toBe("generated Go source")', '.toBe(true)')
text = '\n'.join(line.replace('.toBeUndefined()', '.toBe(false)') if 'isGeneratedSource(' in line else line for line in text.split('\n'))
text = text.replace('references/languages/index.md', 'references/languages.md').replace('"languages/index.md"', '"languages.md"')
text = text.replace('      "Example.java":', '      "Example.ts": "export const needle = 1;\\n",\n      "Example.java":')
text = text.replace('["Example.java", "main.go"]', '["Example.java", "Example.ts", "main.go"]')
file.write_text(text)

# Main now supplies generic policy mechanics; add only Java adoption details.
team = ROOT / 'skills/super-review/references/team-rules.md'
text = team.read_text()
heading, rest = text.split('\n', 1)
team.write_text(heading + '\n\nJava rules use `Language: Java` and the `java.*` IDs in the matching lenses.\nTheir disables and refinements are language-scoped; neither `go.*` nor `ts.*`\ncan be used to reintroduce disabled Java advice. Profiles inherit their owner\nrule in the same language.\n' + rest)

docs = ROOT / 'docs/java-review.md'
docs.write_text(docs.read_text().replace('references/languages/index.md', 'references/languages.md'))
readme = ROOT / 'README.md'
readme.write_text(readme.read_text() + '''

## Java support

Java uses the same eight base lenses, two conditional lenses and four owner
profiles, with separate `java.*` rules. Maven/Gradle module and source-set baselines
constrain advice; records, streams, Optional, builders and interfaces are not
mandatory upgrades. Mixed Go/Java/TypeScript PRs keep each language's rules and
coverage distinct. Existing `go.*` and `ts.*` rule IDs are unchanged.

The reader accepts production `.java` and supporting build metadata, excluding
known test/generated roots without executing project code. Custom source sets
and unavailable framework/build contracts remain explicit context gaps. See
[Java design and sources](docs/java-review.md) and the
[Java team-rule example](examples/team-rules/java.md).
''')
changelog = ROOT / 'CHANGELOG.md'
text = changelog.read_text()
entry = '- Add Java review context, ten lens modules and four owner profiles with stable `java.*` IDs.\n- Extend the shared Go/TypeScript language router and source classifier for Java and read-only Maven/Gradle context.\n- Add 18 contrasting Java judgment fixtures, acquisition/resource tests, and regenerated native packages.\n'
if '## Unreleased\n' in text:
    text = text.replace('## Unreleased\n', '## Unreleased\n\n' + entry, 1)
else:
    heading, rest = text.split('\n', 1)
    text = heading + '\n\n## Unreleased\n\n' + entry + '\n' + rest.lstrip('\n')
changelog.write_text(text)
print('Integrated Java on top of the committed TypeScript implementation; existing language rules retained.')
