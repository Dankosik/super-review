// Shared file classification for the inventory, source reader, and caller search.
// Configuration is readable context, not a review target or executable input.
const typeScriptExtension = /\.(?:ts|tsx|mts|cts)$/;
const typeScriptTest = /\.(?:test|spec)\.(?:ts|tsx|mts|cts)$/;
const testDirectories = new Set(["test", "tests", "__tests__", "__mocks__", "__snapshots__"]);
const contextNames = new Set([
  "go.mod", "package.json", "package-lock.json", "npm-shrinkwrap.json",
  "pnpm-lock.yaml", "yarn.lock", "bun.lock",
]);

export function sourceLanguage(path: string): "Go" | "TypeScript" | undefined {
  if (path.endsWith(".go")) return "Go";
  if (typeScriptExtension.test(path)) return "TypeScript";
  return undefined;
}

export function isInternalPath(path: string): boolean {
  return path.split("/").some(part => ["vendor", "node_modules", ".git"].includes(part));
}

export function isTestSource(path: string): boolean {
  if (path.endsWith("_test.go")) return true;
  if (sourceLanguage(path) !== "TypeScript") return false;
  return typeScriptTest.test(path) || path.split("/").slice(0, -1).some(part => testDirectories.has(part));
}

export function isReadableContext(path: string): boolean {
  const name = path.split("/").at(-1)!;
  return path.endsWith(".md") || contextNames.has(name) ||
    /^tsconfig(?:\.[A-Za-z0-9_-]+)*\.jsonc?$/.test(name) ||
    /^[A-Za-z0-9_.-]+\.tsconfig\.jsonc?$/.test(name);
}

export function isGeneratedSource(path: string, content: string): boolean {
  if (sourceLanguage(path) === "Go") return /^\/\/ Code generated .* DO NOT EDIT\.$/m.test(content);
  if (sourceLanguage(path) !== "TypeScript") return false;
  // Recognize markers in leading comments only, not strings or examples in code.
  const header = /^(?:\uFEFF)?(?:#![^\n]*\n)?\s*((?:(?:\/\/[^\n]*(?:\n|$)|\/\*[\s\S]*?\*\/)\s*)*)/.exec(content)?.[1] ?? "";
  return /(?:@generated\b|\bCode generated\b[^\n]*\bDO NOT EDIT\b|\bauto[- ]generated\b)/i.test(header);
}
