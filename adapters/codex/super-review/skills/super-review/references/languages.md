# Language routing

Select the language from included source at H, not the PR title or the language
used to implement this skill. Keep the shared contract, questions, and acceptance
criteria; use the matching language's context, lens, profiles, and rule namespace.
Do not translate Go-specific advice into TypeScript or load both implementations
into a specialist assigned to one language.

| Language | Included source, subject to the contract's exclusions | Context |
| --- | --- | --- |
| Go | `.go` | [Go](languages/go.md) |
| TypeScript | `.ts`, `.tsx`, `.mts`, `.cts`, including handwritten `.d.ts`, `.d.mts`, `.d.cts` | [TypeScript](languages/typescript.md) |

JavaScript/JSX and other languages remain unsupported; `allowJs` does not extend
coverage. A declaration file is not generated merely because it has no runtime
body. Known generated files and tests remain excluded. Package manifests,
lockfiles, and compiler configuration are compatibility evidence, not additional
review targets. Disclose unavailable configuration or supporting source rather
than silently applying another package's settings.

For a mixed PR, partition work by language and coherent area. Preserve the eight
base questions for each included area without duplicating completed work. A
cross-language boundary can supply context, not an excuse to claim unsupported
coverage. Record language, applicable baseline, selected resource paths, and
language-scoped rules in each task packet. Parent verification uses that same
language context. Missing language resources are a coverage gap, not a Go fallback.

## Lens resources

The workflow and aspect catalog name questions. Their original resource links
are the Go implementations; resolve the actual resource using this table before
delegation. Load only the assigned implementation and selected owner profiles.
Existing `go.*` IDs retain their meaning; TypeScript uses separate `ts.*` IDs.

| Lens | Go | TypeScript |
| --- | --- | --- |
| naming | [Go](lenses/naming.md) | [TS](lenses/typescript/naming.md) |
| control-flow | [Go](lenses/control-flow.md) | [TS](lenses/typescript/control-flow.md) |
| function-cohesion | [Go](lenses/function-cohesion.md) | [TS](lenses/typescript/function-cohesion.md) |
| data-flow | [Go](lenses/data-flow.md) | [TS](lenses/typescript/data-flow.md) |
| abstractions | [Go](lenses/abstractions.md) | [TS](lenses/typescript/abstractions.md) |
| duplication | [Go](lenses/duplication.md) | [TS](lenses/typescript/duplication.md) |
| api-clarity | [Go](lenses/api-clarity.md) | [TS](lenses/typescript/api-clarity.md) |
| change-locality | [Go](lenses/change-locality.md) | [TS](lenses/typescript/change-locality.md) |
| representation | [Go](lenses/representation.md) | [TS](lenses/typescript/representation.md) |
| rationale | [Go](lenses/rationale.md) | [TS](lenses/typescript/rationale.md) |

## Contextual profiles

Use the existing source signals in [the aspect catalog](aspects.md). For
TypeScript, ordinary `try`/`catch` alone is not an error-expression signal;
inspect translation or failure-path structure. Profiles retain their owner and
inherit its effective language-specific rules, including disables and overrides.

| Profile | Owner | Go | TypeScript |
| --- | --- | --- | --- |
| lifecycle-ownership | data-flow | [Go](profiles/lifecycle-ownership.md) | [TS](profiles/typescript/lifecycle-ownership.md) |
| dependency-boundaries | abstractions | [Go](profiles/dependency-boundaries.md) | [TS](profiles/typescript/dependency-boundaries.md) |
| effects-separation | function-cohesion | [Go](profiles/effects-separation.md) | [TS](profiles/typescript/effects-separation.md) |
| error-expression | control-flow | [Go](profiles/error-expression.md) | [TS](profiles/typescript/error-expression.md) |
