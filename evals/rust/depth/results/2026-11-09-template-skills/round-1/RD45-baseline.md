<!-- model: claude-sonnet-5-5; arm: baseline; input: RD45; tool: native Claude Code subagent, fresh context -->
## Task result: RD45

- Snapshot: supplied packet RD45, source files `Cargo.toml` and `src/lib.rs` (no commit identity).
- Instructions: content identity unverified.
- Assignment: lens `abstractions` (rust.abstractions.earn-the-boundary), no profiles. Scope is all supplied production declarations in a private, unreleased module, with no team override. The crate's MSRV is 1.85, edition 2021.
- Status: completed
- Inspected evidence: `OrderStore`, `Order`, `MemoryStore` and its impl, and `DiscountManager::apply`. I also read the context entry about the test double and the fieldless manager.
- Coverage: the base abstractions pass is complete over the supplied source. The test double is outside the supplied files, so I took its behavior from the context entry.
- New applicability signals: none

## C-RD45-1: `DiscountManager` is a fieldless struct that exists only to hold one function

- Change anchor: `src/lib.rs`, `pub struct DiscountManager;` and `impl DiscountManager { pub fn apply(&self, ...) }`. The `&self` receiver is never used.
- Basis: rust.abstractions.earn-the-boundary.
- Observation: the struct has no state and no variation, and the context says it is only constructed to call `apply`. Callers must create a value and learn a "Manager" noun that stands for no responsibility. The name also suggests a broader scope than a single discount operation. Nothing hides behind the boundary.
- Remedy: expose a free function `apply_discount(store: &mut impl OrderStore, id: u64, percent: u64)`. A caller then writes `apply_discount(&mut store, id, 10)`, and the dummy construction disappears.
- Preserve: the generic `impl OrderStore` bound, the `&mut` store borrow, and the no-op when the order is missing. The module is private and unreleased. Consumers beyond the supplied source were not inspected.
- Affected files: `src/lib.rs`. Call sites of `DiscountManager` are not supplied.

## C-RD45-2: `OrderStore` carries a by-value load and a manual field copy that hide what the abstraction is for

- Change anchor: `src/lib.rs`, `OrderStore::load(&self, id: u64) -> Option<Order>` and `MemoryStore::load`: `self.orders.get(&id).map(|o| Order { id: o.id, total: o.total })`.
- Basis: rust.abstractions.earn-the-boundary. The derive comparison in that rule applies to the manual copy.
- Observation: `Order` has no `Clone` derive, so the by-value `load` contract is met by rebuilding the struct field by field. Adding a field to `Order` means editing this copy as well, and the compiler will not flag a field left out of it. The trait is a load-then-save pair of snapshots. This is the read-modify-write shape in `apply`, and the copy exists to support it. The only other implementation is a test double that records call sequence, so the trait's variation is test observation, not a second storage. The abstraction is defensible as a seam for tests. Its cost is the copy plus the trait obligations that callers and `MemoryStore` carry.
- Remedy: derive `Clone` (and probably `Debug`) on `Order` and use `.cloned()` in `load`. This removes the field-by-field plumbing and the coordinated edit. Whether to keep the trait is a separate decision: it can stay as the test seam, or `DiscountManager` can work against `MemoryStore` directly. That choice needs knowledge of how the tests use the double, and the packet does not show it, so the second option is `unresolved`. The first, the derive, is supported.
- Preserve: `load` returns an owned snapshot, and `save` replaces the stored entry. If `Order` later gains non-cloneable fields, the derive stops working. The test double's call recording must keep working if the trait is retained.
- Affected files: `src/lib.rs`. The tests' use of the `OrderStore` double is not inspected.
