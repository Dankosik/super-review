# Language routing

Select each included declaration's language before loading domain instructions.
Go and Java share the contract, workflow, logical lenses, applicability, and
report format, not language-specific advice. The Go links in the workflow and
aspect catalog are not defaults for Java tasks.

| Source | Context | Lens directory | Profile directory | Rule namespace |
| --- | --- | --- | --- | --- |
| `.go` | [Go](go.md) | `references/lenses/` | `references/profiles/` | `go.*` |
| `.java` | [Java](java.md) | `references/lenses/java/` | `references/profiles/java/` | `java.*` |

A task has one language, one logical lens, a coherent source area, and only its
selected owner profiles. Send that language's context and exact resource paths.
Do not send Go instructions to a Java specialist or load every language/lens as
background. Split mixed-language areas when necessary; this does not require an
extra idiom agent or a worker quota. Preserve the eight-base-lens applicability
plan per included area. Unsupported languages remain explicit exclusions.

## Lenses

| Logical lens | Go resource | Java resource |
| --- | --- | --- |
| naming | [Go](../lenses/naming.md) | [Java](../lenses/java/naming.md) |
| control-flow | [Go](../lenses/control-flow.md) | [Java](../lenses/java/control-flow.md) |
| function-cohesion | [Go](../lenses/function-cohesion.md) | [Java](../lenses/java/function-cohesion.md) |
| data-flow | [Go](../lenses/data-flow.md) | [Java](../lenses/java/data-flow.md) |
| abstractions | [Go](../lenses/abstractions.md) | [Java](../lenses/java/abstractions.md) |
| duplication | [Go](../lenses/duplication.md) | [Java](../lenses/java/duplication.md) |
| api-clarity | [Go](../lenses/api-clarity.md) | [Java](../lenses/java/api-clarity.md) |
| change-locality | [Go](../lenses/change-locality.md) | [Java](../lenses/java/change-locality.md) |
| representation (conditional) | [Go](../lenses/representation.md) | [Java](../lenses/java/representation.md) |
| rationale (conditional) | [Go](../lenses/rationale.md) | [Java](../lenses/java/rationale.md) |

## Profiles

Use the shared catalog's source signals and owner, then the matching language
resource. Profiles use their owner's effective rule; they cannot restore a
disabled rule. Keep `go.*` and `java.*` policy scopes separate. Existing Go IDs
and meanings are unchanged; Java IDs are headings in Java lenses.

| Profile | Owner | Go resource | Java resource |
| --- | --- | --- | --- |
| lifecycle-ownership | data-flow | [Go](../profiles/lifecycle-ownership.md) | [Java](../profiles/java/lifecycle-ownership.md) |
| dependency-boundaries | abstractions | [Go](../profiles/dependency-boundaries.md) | [Java](../profiles/java/dependency-boundaries.md) |
| effects-separation | function-cohesion | [Go](../profiles/effects-separation.md) | [Java](../profiles/java/effects-separation.md) |
| error-expression | control-flow | [Go](../profiles/error-expression.md) | [Java](../profiles/java/error-expression.md) |

Build metadata is supporting evidence, not another language to review or code to
execute. Establish compatibility at H; team policy remains at B. State unresolved
baselines and omitted source in the affected coverage.
