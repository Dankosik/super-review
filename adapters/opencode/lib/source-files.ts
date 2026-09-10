// Shared file classification for the inventory, source reader, and caller search.
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
