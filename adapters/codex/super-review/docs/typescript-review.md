# TypeScript review support

TypeScript uses the existing skill workflow, eight base questions, two contextual
lenses, and four owner profiles. It is not a new agent, compiler pass, bug checker,
or frontend-only mode. The orchestrator resolves the language-specific resources
before delegation; a TypeScript task never needs the Go implementations.

## Supported source and context

The shared reader includes `.ts`, `.tsx`, `.mts`, `.cts`, and handwritten declaration
files in pinned source reads and literal caller searches. Conventional test files
(`*.test.*`, `*.spec.*`) and TS source inside `test`, `tests`, `__tests__`, `__mocks__`,
or `__snapshots__` directories are excluded, as are vendor/node_modules/.git files.
Generated Go markers remain recognized. TS generation markers such as `@generated`
and `auto-generated` are recognized in leading comments, not executable strings.
Generator-specific exclusions without those markers remain an explicit source
inventory decision by the reviewer. Handwritten `.d.ts` is not automatically excluded.

Compatibility context includes `package.json`, conventional tsconfig JSON/JSONC
names, `go.mod`, and committed text npm/pnpm/Yarn/Bun lockfiles. These are not added
to review coverage or caller search. Arbitrary JSON, `.env`, executable config
loading, binary lockfiles, symlinks, and submodules remain outside the reader.
Custom inherited config filenames outside that allowlist, external consumers, and
unsupported-language callers can leave a disclosed gap. Existing 1 MiB blob,
window, pagination, and immutable B/H/D boundaries are unchanged.

## Judgment and preservation

The language guidance asks whether types and abstractions make existing contracts
easier to understand. It favors useful inference, meaningful generic relationships,
explicit data ownership, and clear existing state representations over style churn.
It neither mandates `type` over `interface`, removes every assertion, replaces every
loop with a pipeline, nor upgrades syntax by default. It preserves public type-level
contracts as well as runtime effects: contextual typing, accepted calls, overload
relationships, property presence, shallow aliasing, async order, and module evaluation.
TSX uses the framework established by the package and imports, not an assumption of React.

The context and individual TS lenses contain the runtime guidance. Research was
checked against the official TypeScript Handbook on types, functions, narrowing,
object types, modules, and declaration files; the following focused references
explain the compatibility constraints rather than introduce extra mandatory style:

- [TypeScript 4.9: satisfies](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html).
- [verbatimModuleSyntax](https://www.typescriptlang.org/tsconfig/verbatimModuleSyntax.html).
- [exactOptionalPropertyTypes](https://www.typescriptlang.org/tsconfig/exactOptionalPropertyTypes.html).
- [TypeScript JSX](https://www.typescriptlang.org/docs/handbook/jsx.html).

No web lookup is required at review time. An unavailable version-sensitive fact
limits that recommendation rather than authorizing a compiler, installer, or upgrade.

## Team rules and verification

Use `Language: TypeScript` (`TS` is an alias), an existing lens name, and the stable
`ts.*` ID in `SUPER_REVIEW.md` at B. For example:

```markdown
## team.ts.inferred-locals
Language: TypeScript
Paths: src/
Lens: api-clarity
Action: refine ts.api.express-the-call

Keep inferred local types when their initializer states the shape clearly.
Use explicit boundary types where readers need a stable exported contract.
```

Go IDs retain their meaning; profiles inherit their TS owner's rule, so a disable
or override cannot be bypassed by selecting a profile. Mixed-language reports keep
baselines, policy and coverage distinct. Native Claude and Codex copies are generated
from the canonical skill; OpenCode packages that same skill and shared source reader.

`tests/typescript.test.ts` checks source selection/exclusions, pinned context,
search pagination, resource delivery in all three layouts, stable IDs, and evaluation
input integrity. `evals/typescript` contains twenty independent contrasts and a
separate evaluator rubric. The new behavioral evaluation has not been run; mechanical
success is not evidence of recommendation quality or tested refactoring equivalence.
