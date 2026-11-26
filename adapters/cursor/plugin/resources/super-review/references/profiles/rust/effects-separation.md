# Rust effects separation

Owner: function-cohesion
Rule: rust.functions.coherent-purpose

**Pure decision core and thin I/O shell.** Does changed code interleave
non-trivial business rules, pricing or eligibility calculations, state
transitions, or formatting with async database/HTTP calls, clocks, random IDs,
or environment reads so neither the rules nor the orchestration read locally?
When the decision has a meaningful domain input and outcome, separate a
synchronous decision function (passing explicit facts and time values such as
`now`) from the thin async shell (`load -> decide -> persist`) so readers can
verify and evolve business rules without tracing I/O plumbing.

**Keep when:**
- Short CRUD or linear `?` orchestration already tells one story without
  non-trivial decision logic.
- Splitting would break a transaction or lock boundary (`SELECT ... FOR UPDATE`,
  read-after-write consistency, or guard drop scope across `.await`) or change
  when clock or database state is observed.
- Separation manufactures borrow-checker friction solved by extra `.clone()`,
  boxing, `Arc`, or threading borrowed fields and generic callbacks through a
  new helper.
- The extraction exists only to create a test seam or mock trait; test design
  is outside scope.

Preserve implicated effect order, read-time consistency, eager/lazy work, async
cancellation, and guard/drop lifetimes. Explain which environmental knowledge
the decision core no longer needs and what the caller supplies instead.
