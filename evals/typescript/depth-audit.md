# TypeScript contract-depth audit

Authoring/evaluator material only. Baseline:
`f5a67021bbc54995648fe032d07bccdb88a32fa6` (2026-09-17). The audit read the shared
contract, TS context, all ten TS lenses, four generic TS profiles and relevant
language/frontend routing and evals. It does not repeat React/Next profiles.

The existing rules already protect inference, discriminated alternatives,
nullish/falsy distinctions, assertions at established boundaries, public contracts,
independent representations and type/runtime imports. Absence of an API name is
not a coverage defect. Keep eight base questions, contextual selection, existing
`ts.*` IDs and owners, team conventions and the read-only review contract.

## Decision map

| Decision and concrete gap | Reader burden and useful change | Retain / limits | Owner and cases |
| --- | --- | --- | --- |
| A generic can preserve an input contract even without a generic result; T01/T02 lacked this third case. | Avoid looking for a nonexistent relationship, but check the actual role before removing T. | Fresh literals, explicit type arguments and contextual typing may require it; structural assignability is not identical excess-property checking. | abstractions; T01/T02, TD01; [objects][objects], [functions][functions] |
| Standard inference can replace a hand-maintained type bridge; satisfies had only negative/gating cases. | Remove a local shape-checking identity helper, repetitive const assertions or a parameter used solely to control inference. | Preserve deliberate widening, both-input inference, mutable results and real helpers with effects or independent contracts. No upgrades. | api-clarity / abstractions; T09/T10, TD02-TD07; [4.9][ts49], [5.0][ts50], [5.4][ts54] |
| Narrowing precision is version-sensitive and not always desirable. | Remove a duplicated predicate contract when the supported compiler can infer the existing result. | Keep explicit predicates on 5.4 and boolean annotations used for wider mutable results. An annotation does not prove runtime validation. | data-flow / api-clarity; TD08-TD10; [5.5][ts55] |
| Overload consumers include extracted types and function values, not just calls. | Remove genuinely redundant alternatives while preserving understandable input/result relationships. | ReturnType/Parameters use the last overload; an inferred wrapper can lose alternatives. Local acceptance of more forms is not permission to expand a public API. | api-clarity / duplication; TD11-TD13; [functions][functions], [conditional types][conditional] |
| Mapped/conditional type clarity lacked paired inputs, not a general rule. | Keep key-specific payload mappings; expose an independent small shape instead of requiring mental utility expansion. | Preserve optional/readonly modifiers, structural compatibility and union distribution. | abstractions; TD14-TD16; [mapped types][mapped], [conditional types][conditional] |
| Schema/value derivation lacked an explicit direction and input/output distinction. | Remove a second owner of an existing schema output or complete registry key set. | Input and transformed output differ. Preserve independent DTOs and partial tables; deriving a type does not authorize parsing/defaulting/coercion. | duplication; T16, TD17-TD20; [Zod][zod], [keyof][keyof] |
| Public-module advice needs source, runtime entry and consumer-selected declaration evidence. | Replace opaque forwarding with direct type/value re-exports where they express the same boundary. | Keep runtime constructors, registration, augmentation and intentional ESM/CJS contracts. Missing artifacts limit that remedy, not unrelated work. | dependency-boundaries under abstractions; T11, TD21-TD24; [module reference][modules], [module options][options] |
| Presence and partial outcomes lacked concrete counterexamples. | Clarify already established states without inventing forbidden combinations or collapsing meaningful absence. | Retain omitted/null/empty distinctions and data with diagnostics. Neither XOR unions nor truthiness checks are defaults. | data-flow / representation / control-flow; T05-T07, TD25-TD27; [narrowing][narrowing], [exact optional properties][optional] |

Only the first, fourth, sixth and seventh decisions need short technical additions
to their defining instructions; the abstractions addition also sharpens the existing
transformation question. Version-specific API examples stay here and in evals,
rather than becoming a feature checklist loaded by every specialist. Naming,
cohesion, rationale, error-expression and React/Next profiles remain unchanged.

## Compatibility gates, not modernization policy

| Mechanism | Minimum relevant compiler | Preservation check |
| --- | --- | --- |
| satisfies | TS 4.9 | Contextual typing, exact inferred fields and later writes; not a widening annotation, assertion or runtime validator. |
| const type parameters | TS 5.0 | Existing literal-sensitive relationship, constraint, readonly/mutable results and accepted calls; not object freezing. |
| NoInfer | TS 5.4 | Which argument owns inference, explicit type arguments and accepted alternatives; not a ban on co-inference. |
| Inferred type predicates | TS 5.5 | Actual inferable body, resulting filter type, deliberate boolean contracts and subsequent mutations. |
| Zod input/output inference in these cases | Existing Zod 4.0.0, TS 5.5+ | Existing schema and phase, parsing/coercion/transforms, independent public contracts; no dependency addition to Super Review. |

Version facts are established by the linked release notes and library documentation,
not by the newest toolchain in the review host. Language syntax, lib declarations,
emit and runtime support are separate. ES2022 in these fixtures does not authorize
an ES2024 API or polyfill. No compiler, target, lib, module or dependency change is
included in this proposal.

For a library, inspect what crosses the boundary. New syntax used by the author
can disappear in emitted JS and declarations; syntax retained in distributed source
or declarations must be understood by consumers. TD03 supplies that evidence; T10
ships source and therefore has a different limit. A working alias under `paths`
or Bundler resolution is not proof that a runtime understands the emitted specifier.
Unknown consumer context remains a scoped gap, never a guessed migration.

## Corrections to existing evaluation expectations

T07 accepts string or null. Its null and empty-string branches have the same
result; whitespace is truthy and remains formatted. A truthiness guard is therefore
not inherently a preservation violation in this fixture. Grade the resulting
expression and outputs, not a mandated spelling. TD27 supplies the opposite case:
zero has a distinct result. This is a source-backed rubric correction, not an
observed model failure.

The original T10 showed a handwritten function declaration with no value to which
satisfies would naturally apply. It could not distinguish baseline awareness from
rejecting irrelevant advice. Its replacement shows a value and the source shipping
boundary; TD03 gives the opposite boundary. Both changes retain the stable case ID,
and the other original cases remain intact.

## Separate future runtime investigations

Do not infer Node.js, Bun, Deno or a backend framework from TypeScript or installed
ambient types. Runtime-specific profiles are not introduced or auto-selected here.
A future Node study would first identify compiled JS, a loader or native TS
execution; a Bun study would distinguish application execution from test/build
use; a Deno study would establish its actual configuration, execution and checking
path. Each needs its own concrete source signals and contrasts under existing
owners, not a migration of general TS advice. Backend-framework mechanisms require
evidence of that framework in the owning area before a separate investigation.

## Evidence and replay

This is a sequential author audit, not an independent multi-agent result. Native
independent agent execution was unavailable. Behavioral baseline/candidate runs:
**NOT RUN**. No claim of measured recommendation-quality improvement is made.

Use the existing evaluation protocol with identical source, scope, model/effort
and tool availability. Select only affected pairs and holdouts. Keep grader
expectations and peer answers out of each fresh reviewer context. Record raw
failures, uncertain remedies, coverage and tool traces separately from accepted
observations. Mechanical mapping, stable IDs, byte-identical delivery or a compiler
probe do not measure model judgment. No new evaluator runtime or service is added.

Local preparation used pinned GitHub file contents; Git cloning failed because the
container could not resolve github.com, and Bun was unavailable. Source/fixture
structural checks and optional checks with the available TS 5.8.3 compiler are
auxiliary only, not a run on the fixtures' exact 4.8/5.4/5.5 or Zod baselines.
Generated policy copies follow the existing build.ts copy map for Claude, Codex
and Cursor, sharing the same Git blobs. Full build/test/typecheck/validate/package
and native integration status must be taken from the PR's actual CI results.

[objects]: https://www.typescriptlang.org/docs/handbook/2/objects.html
[functions]: https://www.typescriptlang.org/docs/handbook/2/functions.html
[ts49]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html
[ts50]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html
[ts54]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-4.html
[ts55]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-5.html
[conditional]: https://www.typescriptlang.org/docs/handbook/2/conditional-types.html
[mapped]: https://www.typescriptlang.org/docs/handbook/2/mapped-types.html
[keyof]: https://www.typescriptlang.org/docs/handbook/2/keyof-types.html
[zod]: https://zod.dev/basics
[modules]: https://www.typescriptlang.org/docs/handbook/modules/reference.html
[options]: https://www.typescriptlang.org/docs/handbook/modules/guides/choosing-compiler-options.html
[narrowing]: https://www.typescriptlang.org/docs/handbook/2/narrowing.html
[optional]: https://www.typescriptlang.org/tsconfig/exactOptionalPropertyTypes.html
