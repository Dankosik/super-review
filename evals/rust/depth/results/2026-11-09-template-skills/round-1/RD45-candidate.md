<!-- model: claude-sonnet-5-5; arm: candidate; input: RD45; tool: native Claude Code subagent, fresh context -->
## Task result: RD45

- Snapshot: local packet RD45 (whole-project scope, supplied snapshot); source `src/lib.rs`, `Cargo.toml` (edition 2021, rust-version 1.85).
- Instructions: content identity unverified.
- Assignment: lens abstractions (`rust.abstractions.earn-the-boundary`), no profiles; scope is all supplied production declarations in a private, unreleased module, with no external API commitment or team override.
- Status: completed
- Inspected evidence: all of `src/lib.rs` (`OrderStore`, `Order`, `MemoryStore`, `DiscountManager::apply`) and `Cargo.toml`. The packet context states that `MemoryStore` is the only production store, that the only other `OrderStore` implementation is a call-recording test double, and that `DiscountManager` has no fields and is constructed only to call `apply`.
- Coverage: the base abstractions lens is complete over the supplied source. No test source was supplied or reviewed.
- New applicability signals: none

## C-RD45-1: `OrderStore` trait has one production implementation and a test double that only records call order

- Change anchor: `src/lib.rs`, `pub trait OrderStore { fn load(&self, id: u64) -> Option<Order>; fn save(&mut self, order: Order); }`, with `impl OrderStore for MemoryStore` and the `store: &mut impl OrderStore` parameter of `DiscountManager::apply`. Whole-project snapshot.
- Basis: `rust.abstractions.earn-the-boundary`.
- Observation: The context says the program keeps all orders in memory and `MemoryStore` is the only production implementation. The only other implementor is a test double that records the call sequence. That double checks the `load`-then-`save` choreography inside `apply`, so it does not stand in for a different storage backend. The trait hides no production variation. Its cost is that `apply` is generic over `impl OrderStore`, and the `load`/`save` pair is a contract that only mirrors `MemoryStore`'s two operations. `MemoryStore` has no constructor and its `orders` field is private, so nothing outside the module can build one or fill it with orders. This is part of the same boundary question, but it is not a separate finding.
- Remedy: Remove the trait and have `apply` take `&mut MemoryStore`. Better still, make it a method on `MemoryStore`, for example `fn apply_discount(&mut self, id: u64, percent: u64)`, which can edit the order in place through `get_mut` and so avoid the load/save round trip. If a durable store is later accepted, introduce the trait then, shaped by that store's real failure and async needs. Sketch: `impl MemoryStore { pub fn apply_discount(&mut self, id: u64, percent: u64) { if let Some(o) = self.orders.get_mut(&id) { o.total -= o.total * percent / 100; } } }`. The tradeoff is that the existing call-sequence test double and its test must be rewritten to assert the resulting order total. The strongest reason to keep the trait is a planned persistent backend, but nothing supplied shows one.
- Preserve: The saturating and underflow behavior of `total -= total * percent / 100` stays unchanged. For `percent > 100` it can underflow and panic in debug builds. This is a behavior question and not part of this review. `apply` does nothing when the id is missing. `Order` stays a plain struct with the same fields. Known: the module is private and unreleased. Unverified: the test source, which was not supplied.
- Affected files: `src/lib.rs` (inspected). The crate's test file with the recording double is still needed and was not supplied.

## C-RD45-2: `DiscountManager` is a field-less struct constructed only to call `apply`

- Change anchor: `src/lib.rs`, `pub struct DiscountManager;` with `impl DiscountManager { pub fn apply(&self, store: &mut impl OrderStore, id: u64, percent: u64) }`. Whole-project snapshot.
- Basis: `rust.abstractions.earn-the-boundary`.
- Observation: The struct has no state, and `apply` does not use `self`. Callers construct a `DiscountManager` only to invoke one action, so it is a function with a type wrapped around it. The name "manager" suggests a lifecycle or policy owner, but the struct owns nothing. Readers must look for owned state or configuration and find none. The discount rule `percent / 100` of the total is the only knowledge the type holds.
- Remedy: Replace it with a free function, or fold it into `MemoryStore` as in C-RD45-1. If the discount rule must be named, `pub fn apply_discount(order: &mut Order, percent: u64)` on `Order` or as a free function keeps the arithmetic with the data it changes. The caller then does its own lookup, which also removes the load/save pair. Tradeoff: a later discount policy with its own state or configuration would need a type again. Nothing supplied shows such a policy.
- Preserve: The arithmetic and the no-op for a missing id stay the same. The public path `DiscountManager::apply` goes away. Since the module is private and unreleased, no known consumer is affected. Unverified: callers outside the supplied source, which the context says are none beyond tests.
- Affected files: `src/lib.rs` (inspected). Call sites that construct `DiscountManager` are not supplied.

## C-RD45-3: `MemoryStore::load` rebuilds `Order` field by field to return an owned copy

- Change anchor: `src/lib.rs`, `impl OrderStore for MemoryStore`, `self.orders.get(&id).map(|o| Order { id: o.id, total: o.total })`. Whole-project snapshot.
- Basis: `rust.abstractions.earn-the-boundary`, which prefers a derive over field-by-field plumbing.
- Observation: `Order` has two `u64` fields and no `Clone` derive. The store therefore copies it by hand, and every new field to `Order` must also be added here. The `load` signature requires an owned `Order` because the trait has no borrowed form. This knowledge belongs to `Order`, and a derive would state it without repeating the field list.
- Remedy: Add `#[derive(Clone)]` to `Order` and write `self.orders.get(&id).cloned()`. If C-RD45-1 is adopted and `load` disappears, this problem disappears with it, so count it once. Tradeoff: `Clone` becomes part of `Order`'s capabilities. For a plain pair of `u64` this is harmless, and `Copy` is also possible. Nothing in the source suggests copying should be forbidden.
- Preserve: The returned value is a snapshot, as before, and later saves do not change it. Known: field types are `u64`, so a derived clone is equivalent. Unverified: whether tests rely on `Order` lacking `Clone`, which is unlikely.
- Affected files: `src/lib.rs` (inspected).
