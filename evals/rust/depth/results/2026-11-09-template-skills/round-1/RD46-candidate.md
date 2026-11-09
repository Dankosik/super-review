<!-- model: claude-sonnet-5-5; arm: candidate; input: RD46; tool: native Claude Code subagent, fresh context -->
## Task result: RD46

- Snapshot: local packet RD46, supplied files `Cargo.toml` and `src/lib.rs`. No VCS endpoints. Source location is the packet at `.../scratchpad/eval/packets/RD46.json`.
- Instructions: `content identity unverified`.
- Assignment: lens `abstractions` (`rust.abstractions.earn-the-boundary`). No profiles. Scope is all supplied production declarations and uses in a private, unreleased module, with no team override.
- Status: completed
- Inspected evidence:
  - `Cargo.toml`: edition 2021, rust-version 1.85.
  - `src/lib.rs`: trait `OrderStore` (`load`, `save`), struct `Order`, and fn `apply_discount(store: &mut impl OrderStore, id, percent)`.
  - The packet context says the PostgreSQL and in-memory adapters live in separate crates that depend on this core. The core must not depend on either, and both adapters run in production.
  - Exclusions: no tests, generated files, or vendor trees were supplied.
- Coverage: the base lens is complete over every supplied declaration and use. Nothing required is missing. Consumers in the adapter crates were not supplied, and no finding depends on them.
- New applicability signals: none.

No candidates.

- **`OrderStore`:** it hides a real variation. There are two production implementations, PostgreSQL and in-memory. The dependency direction means the core can only name storage through a trait. Callers learn only `load` and `save`. It is not a test-double-only interface and not a forwarding twin, so it earns its boundary.
- **`apply_discount`:** `&mut impl OrderStore` is a plain capability bound. It uses static dispatch, which is fine here. Nothing suggests a heterogeneous or runtime-selected store. A free function over the trait is the right expression, with no hidden struct, manager or macro.
- **`Order`:** it is a plain data struct with no wrapper layering.

Behaviours I noticed fall outside this lens, so I raise no candidates for them. These are the silent no-op when the order is missing, the infallible `load`/`save` signatures, and unchecked arithmetic when `percent > 100`.
