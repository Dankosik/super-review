<!-- model: claude-sonnet-5-5; arm: baseline; input: RD51; round 2 after review fixes; tool: native Claude Code subagent, fresh context -->
## Task result: RD51

- Snapshot: whole-project snapshot from the packet (no PR or B/H/D); files `Cargo.toml` and `src/lib.rs` in the packet RD51.json. No commit or hash identity was available.
- Instructions: `content identity unverified`.
- Assignment: lens `representation` (rust.representation.express-concepts); no profiles; scope is all supplied production declarations and uses in a private, unreleased module. There is no external API commitment and no team override. Edition 2021, rust-version 1.85.
- Status: completed
- Inspected evidence: the whole of `Cargo.toml` and `src/lib.rs`: `CustomerId`, `OrderId`, `Refund`, `Refund::new`, the three accessors, and `refund_for`. No tests or generated files were in the packet. Callers outside `src/lib.rs` were not supplied.
- Coverage: the base representation lens is covered for all declarations. Consumers outside the packet are not available, so the effect of changing `Refund::new` or `refund_for` signatures on outside callers is unverified.
- New applicability signals: none

## C-RD51-1: Two identifier concepts share the same bare `u64` alias, and the entry points disagree on their order

- Change anchor: `src/lib.rs` in the whole-project snapshot. The declarations are `pub type CustomerId = u64;` and `pub type OrderId = u64;`. The construction points are `Refund::new(customer: CustomerId, order: OrderId, cents: u64)` and `refund_for(order: OrderId, customer: CustomerId, cents: u64) -> Refund`, whose body is `Refund::new(customer, order, cents)`.
- Basis: rust.representation.express-concepts. This is not convention-only advice.
- Observation: `CustomerId` and `OrderId` are type aliases, so both are plain `u64` to the compiler. The names are documentation only. `Refund::new` takes customer then order, while `refund_for` takes order then customer, so the two constructors carry opposite positional conventions for two values of the same type. `refund_for` exists only to reorder the arguments, so a reader must know that the swap is intentional and that the order is not a mistake. The reader has to hold two mappings (`new`: customer, order; `refund_for`: order, customer) in mind, and nothing in the representation says which one a caller means. The context confirms that both values are 64-bit numbers from the same database, so a swapped pair is indistinguishable from a valid one. The distinction between a customer and an order exists only in parameter names. `cents: u64` is a third bare `u64` in the same signatures. It stays a plain amount unless a money concept is adopted elsewhere. The strongest alternative is to keep the aliases, since the module is private and unreleased and has few call sites. That choice leaves the maintainer to preserve, at every call site, an argument order that the type system does not state.
- Remedy: give each identifier its own small newtype and remove the order disagreement between the two constructors.

  ```rust
  pub struct CustomerId(pub u64);
  pub struct OrderId(pub u64);
  // Refund::new(customer: CustomerId, order: OrderId, cents: u64)
  // refund_for either removed (callers use Refund::new) or given the same parameter order
  ```

  After this, passing an `OrderId` where a `CustomerId` is expected no longer matches the declared parameter types, and the two distinct concepts each have one named home. The remaining obligation is a choice between two supported options. The first is to delete `refund_for` if no caller needs the reordered form. The second is to keep it with the same order as `new` if it serves as a named entry point. Which one applies depends on callers outside the packet, so it stays open. A possible cost of the newtypes is some wrapping at the database boundary, since the ids come from a database.
- Preserve: `Refund` is module-internal, and `new` does no validation, so construction semantics do not change. The `customer()` and `order()` accessors would return the newtypes, and any caller that currently treats them as `u64` needs to adapt. Derives such as `Copy`, `Clone`, `Eq`, `Hash` and `Debug` would be needed so the ids stay usable as map keys and in logs. No serialization or FFI layout is visible in the packet, so none is claimed. Whether any exists is unverified.
- Affected files: `src/lib.rs` (inspected). Callers of `Refund::new`, `refund_for`, `customer()` and `order()` outside the packet are not inspected and are still needed.
