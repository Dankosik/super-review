// Mechanical acquisition scope, not a complete Java source-set classifier.
const internalDirectories = new Set(["vendor", "node_modules", ".git"]);
const javaTestRoot = /(?:^|\/)src\/(?:test|testFixtures|integrationTest|androidTest)\//;
const javaGeneratedRoot = /(?:^|\/)(?:target\/generated-(?:test-)?sources|build\/generated)\//;
const buildFiles = new Set([
  "go.mod", "pom.xml", "build.gradle", "build.gradle.kts", "settings.gradle",
  "settings.gradle.kts", "gradle.properties",
]);

function excludedPath(path: string): string | undefined {
  if (path.split("/").some(part => internalDirectories.has(part))) return "vendored or repository internals";
  if (path.endsWith("_test.go")) return "test file";
  if (path.endsWith(".java")) {
    if (javaTestRoot.test(path)) return "Java test source root";
    if (javaGeneratedRoot.test(path)) return "generated Java source root";
  }
  return undefined;
}

export function exclusion(path: string, status?: string): string | undefined {
  if (status === "removed") return "deleted file: no head source";
  const excluded = excludedPath(path);
  if (excluded) return excluded;
  if (!path.endsWith(".go") && !path.endsWith(".java")) return "unsupported language or non-source file";
  return undefined;
}

export function sourceReadExclusion(path: string): string | undefined {
  const excluded = excludedPath(path);
  if (excluded) return excluded;
  const file = path.split("/").at(-1)!;
  const buildContext = buildFiles.has(file) || file.endsWith(".gradle") ||
    file.endsWith(".gradle.kts") || file.endsWith(".versions.toml");
  if (!exclusion(path) || path.endsWith(".md") || buildContext) return undefined;
  return "Only non-test Go/Java, supported build metadata, and Markdown policy context are readable.";
}

export function generatedSourceReason(path: string, content: string): string | undefined {
  if (path.endsWith(".go") && /^\/\/ Code generated .* DO NOT EDIT\.$/m.test(content)) return "generated Go source";
  if (!path.endsWith(".java")) return undefined;
  // Limit this heuristic to leading file comments. A generated method annotation
  // or a string inside handwritten source must not exclude the whole file.
  const header = /^\uFEFF?\s*((?:(?:\/\/[^\n]*(?:\n|$)|\/\*[\s\S]*?\*\/)\s*)*)/.exec(content)?.[1] ?? "";
  if (/\bgenerated\b/i.test(header) && /\bdo not edit\b/i.test(header)) return "generated Java source";
  return undefined;
}
