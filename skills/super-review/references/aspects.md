# Contextual aspects

Selection and coverage are shared by Go and Rust. Links below identify Go
implementations; for Rust resolve the selected question to its counterpart in
[Rust context](languages/rust.md), not the Go module.

A lens owns a question; a profile deepens one existing lens. Neither is an
extra agent by definition. Consider this small catalog after the eight base
lenses. Load a module's full text only when its subject is present in the
changed area, the user selects it, or a narrow read is needed to decide.

| Aspect | Kind | Owner | Source signal, not a finding |
| --- | --- | --- | --- |
| [representation](lenses/representation.md) | lens | representation | Changed data shapes, linked collections, intermediate results, or encodings of existing modes/state. |
| [rationale](lenses/rationale.md) | lens | rationale | Changed non-obvious choices, formulas, compatibility adaptations, caller obligations (including zero/nil, partial results, or ownership), or nearby contract/reason comments. No comment diff is required. |
| [lifecycle-ownership](profiles/lifecycle-ownership.md) | profile | data-flow | Changed acquisition, transfer, startup, shutdown, or multi-step use of a resource or background operation. |
| [dependency-boundaries](profiles/dependency-boundaries.md) | profile | abstractions | Changed package boundaries, construction dependencies, configuration sources, or types crossing a boundary. |
| [effects-separation](profiles/effects-separation.md) | profile | function-cohesion | A changed operation interleaves a meaningful computation with reads or writes to its environment. |
| [error-expression](profiles/error-expression.md) | profile | control-flow | Changed failure-path structure, error translation chains, or a custom error-handling mechanism. Ordinary Go `if err != nil` or Rust `?` alone is insufficient. |

Choose from inspected declarations and their diff, not from PR claims, keywords,
file names, line counts, or an already discovered defect. A signal invites a
question; clear code can complete the check with no candidates. When uncertain,
inspect the smallest relevant declaration or module rather than silently skip.
Missing source is an applicability gap, not evidence of absence.

Without user narrowing, retain the eight-base-lens applicability plan and select
each contextual aspect whose subject is present. Attach selected profiles to
their owner's task for that area; they do not replace the base question or
require separate workers. Several relevant profiles can share that owner;
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
