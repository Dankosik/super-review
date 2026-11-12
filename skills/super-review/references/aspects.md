# Contextual aspects

Resolve resource paths through [language routing](languages.md) for each area;
the catalog links below are the original Go implementations.

A lens owns a question; a profile deepens one existing lens. Neither is an
extra agent by definition. Consider this small catalog after the eight base
lenses. Load a module's full text only when its subject is present in the
changed area, the user selects it, or a narrow read is needed to decide.

| Aspect | Kind | Owner | Source signal, not a finding |
| --- | --- | --- | --- |
| [representation](lenses/representation.md) | lens | representation | Changed data shapes, linked collections, intermediate results, or encodings of existing modes/state. |
| [rationale](lenses/rationale.md) | lens | rationale | Changed non-obvious choices, formulas, compatibility adaptations, caller obligations (including zero/nil, partial results, or ownership), or nearby contract/reason comments. No comment diff is required. |
| [conventions](lenses/conventions.md) | lens | conventions | Changed code handles a recurring concern, such as errors, absence, logging, configuration, dependency construction, mapping between layers, value classes, HTTP or storage access, validation, time, identifiers, encoding, async or background work, shared state, or a project mechanism, or the change adds a dependency for such a concern. A rename or a purely local edit alone is insufficient. |
| [placement](lenses/placement.md) | lens | placement | The change adds, moves or renames files, modules, packages or directories; adds a declaration to a file or package whose name or role describes another concept; grows a file with another responsibility; or adds code to a `util`, `common`, `helpers` or `shared` location. An edit inside an existing function alone is insufficient. |
| [unused-surface](profiles/unused-surface.md) | profile | abstractions | Changed parameters, options, configuration fields, results, exports, interface or trait methods, overloads, type parameters, `throws` clauses, Cargo features, variants or modes, a compatibility path, or a change that removes a use of an item that may have been its last. |
| [defensive-checks](profiles/defensive-checks.md) | profile | control-flow | A changed guard for absence, emptiness, type, range or failure of a value whose origin is in reviewed source; a catch that only rethrows or that catches what nothing in the `try` throws; a fallback or default branch; validation repeated after parsing, or the same check repeated across functions that receive one value. Ordinary propagation of an error the callee can return is insufficient. |
| [diagnostics](profiles/diagnostics.md) | profile | rationale | Changed log calls, error or exception messages, panic or `expect` messages, error responses, wrapping context, or a failure that is logged and also returned or rethrown. |
| [existing-helpers](profiles/existing-helpers.md) | profile | duplication | The change adds a small function or private helper for a general operation on strings, collections, numbers, time, paths, retries, parsing or comparison, often at the bottom of a file; a helper whose body matches one elsewhere in the repository; or a hand-written mechanism or implementation that the standard library, a declared or documented dependency or code generation provides. A function that carries domain logic alone is insufficient. |
| [lifecycle-ownership](profiles/lifecycle-ownership.md) | profile | data-flow | Changed acquisition, transfer, startup, shutdown, or multi-step use of a resource or background operation. |
| [dependency-boundaries](profiles/dependency-boundaries.md) | profile | abstractions | Changed package boundaries, construction dependencies, configuration sources, or types crossing a boundary. |
| [effects-separation](profiles/effects-separation.md) | profile | function-cohesion | A changed operation interleaves a meaningful computation with reads or writes to its environment. |
| [error-expression](profiles/error-expression.md) | profile | control-flow | Changed failure-path structure, error translation chains, or a custom error-handling mechanism. Ordinary `if err != nil` alone is insufficient. |

Choose from inspected declarations and their diff, not from PR claims, keywords,
file names, line counts, or an already discovered defect. A signal invites a
question; clear code can complete the check with no candidates. When uncertain,
inspect the smallest relevant declaration or module rather than silently skip.
Missing source is an applicability gap, not evidence of absence.

For established frontend TypeScript, also select from the owner profiles in
[frontend routing](frontend.md). For established Spring mechanisms in Java, use
[Spring routing](spring.md). Both catalogs use these same selection, policy and
coverage rules; neither is an alternative eight-question plan.

Without user narrowing, retain the eight-base-lens applicability plan and select
each contextual aspect whose subject is present. Attach selected profiles to
their owner's task for that area; they do not replace the base question or
require separate workers. A selected profile whose owner is a conditional lens,
such as diagnostics under rationale, selects that owner for the area. Several relevant profiles can share that owner;
never add unrelated questions to a task. Do not load the whole profile library
into every specialist.

Honor ordinary-language inclusions and exclusions before automatic selection.
A lens-only request considers profiles of that lens, not unrelated lenses.
A profile-only request selects its owner for that narrower question; do not
claim a full owner-lens review. An explicit exclusion wins over an automatic
signal. A request to add an aspect does not discard the rest of the plan.

Record each decision with scope and a source anchor: `selected`, `not applicable`
(structural reason), `not requested` (user scope), or `not checked` (missing
context/capability or a real budget limit). Group identical reasons compactly.
Selected work later receives the usual completed/not-applicable/unfinished
result; selection is not completion. A skipped applicable check or unresolved
applicability makes affected coverage partial. Record disabled rules separately;
a profile cannot revive its disabled owner rule or evade an override/conflict.
Effective policy defines the required guideline scope: disabled rules are policy
exclusions, not missing execution or a structural absence.

A specialist may return a new signal with its path/symbol and missing question,
not another lens's verdict. The parent checks scope and the existing plan, then
adds only an uncovered aspect or a focused continuation. Do not rerun completed
areas, create recursive discovery waves, or fill a worker/finding quota. Stop
when the source inventory, applicability decisions, and selected tasks are resolved.
