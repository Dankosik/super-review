# Contextual aspects

Resolve resource paths through [language routing](languages.md) for each area;
the catalog links below are the original Go implementations.

A lens owns a question; a profile deepens one existing lens. Neither is an
extra agent by definition. Consider this small catalog after the eight base
lenses. Load a module's full text only when its subject is present in the
changed area, the user selects it, or a narrow read is needed to decide.

| Aspect | Kind | Owner | Source signal, not a finding |
| --- | --- | --- | --- |
| [representation](lenses/representation.md) | lens | representation | Changed data shapes, primitives or strings carrying domain units/states/IDs, tuples or parallel collections, boolean/mode flags paired with other fields, `Option` or nullable fields valid only in certain phases, or cached/derived projections held apart from their source. |
| [rationale](lenses/rationale.md) | lens | rationale | Non-obvious choices, formulas, lint suppressions, `expect`/`assert`/`SAFETY` invariants, custom mechanics kept where a standard or dependency API differs, compatibility adaptations, caller obligations, or contract/reason/workaround comments. |
| [conventions](lenses/conventions.md) | lens | conventions | Recurring cross-codebase concerns in changed code: error types, absence, logging, configuration, wiring, layer mapping, HTTP/storage access, validation, time, IDs, encoding, async/background work, shared state, or a newly added dependency for one of them. |
| [placement](lenses/placement.md) | lens | placement | Added, moved or renamed files/modules/packages; a declaration placed in a file or package named for another concept; a file growing a second responsibility; or code added to a `util`, `common`, `helpers` or `shared` home. |
| [logic](lenses/logic.md) | lens | logic | Special-case or edge branches (empty, single, zero, first/last, boundary index) beside a general path; condition combinations (`if`/`match`/`switch` products); or multi-pass computations, intermediate collections, sorts, or inverse conversions. |
| [unused-surface](profiles/unused-surface.md) | profile | abstractions | Changed parameters, options, builders, config fields, results, exports, trait/interface methods, overloads, type parameters, `throws` clauses, features, variants, compatibility paths, or removed calls that may leave an item without callers. |
| [defensive-checks](profiles/defensive-checks.md) | profile | control-flow | Guards, `unwrap_or_default`/fallback defaults, wildcard arms, catches, or repeated checks on values whose origin, constructor or type sits inside reviewed source. |
| [diagnostics](profiles/diagnostics.md) | profile | rationale | Log calls, error/exception/panic/`expect` messages, error responses, wrapping context, or failures logged and also returned/rethrown. |
| [existing-helpers](profiles/existing-helpers.md) | profile | duplication | Handwritten parsing, formatting, conversion, retry/backoff, coordination, query/header/URL/unit glue, single-purpose wrappers or guards, or manual standard trait/interface impls, whether in a private helper or inline inside domain code alongside standard or declared libraries. |
| [lifecycle-ownership](profiles/lifecycle-ownership.md) | profile | data-flow | Resource acquisition, transfer, guards, startup, shutdown, background tasks, or multi-step stateful lifecycles. |
| [dependency-boundaries](profiles/dependency-boundaries.md) | profile | abstractions | Package/module visibility (`pub` vs `pub(crate)`/internal), construction dependencies, configuration injection, or types crossing a seam. |
| [effects-separation](profiles/effects-separation.md) | profile | function-cohesion | Pure decisions, calculations or formatting interleaved with I/O, clock, environment or state reads/writes. |
| [error-expression](profiles/error-expression.md) | profile | control-flow | Failure-path structure, error conversion chains (`From`, `map_err`, wrapping), or custom error-handling plumbing. |

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
