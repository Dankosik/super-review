<!-- model: claude-sonnet-5-5; arm: baseline; input: RD51; tool: native Claude Code subagent, fresh context -->
## Task result: RD51

- Snapshot: whole-project snapshot of the supplied packet (RD51.json); no PR or B/H/D. `Cargo.toml` and `src/lib.rs`, as supplied.
- Instructions: `content identity unverified`.
- Assignment: lens representation (`rust.representation.express-concepts`); no profiles; scope is all supplied production declarations and uses in a private, unreleased module with no external API commitment or team override.
- Status: completed
- Inspected evidence: `Cargo.toml` (edition 2021, rust-version 1.85). In `src/lib.rs`: `CustomerId`, `OrderId`, `Refund` with `new` and its three accessors, and `refund_for`. There are no other consumers in the packet.
- Coverage: base representation pass completed over every declaration. No library note was routed. Missing evidence: none for the observation. The set of downstream callers is unknown, which only limits the remedy's migration cost.
- New applicability signals: none.

## C-RD51-1: `CustomerId` and `OrderId` are interchangeable aliases of `u64`, so argument order is a convention each caller must remember, and `refund_for` already disagrees with `Refund::new`

- Change anchor: `src/lib.rs` (whole-project snapshot).
  - `pub type CustomerId = u64; pub type OrderId = u64;`
  - `Refund::new(customer: CustomerId, order: OrderId, cents: u64)`
  - `refund_for(order: OrderId, customer: CustomerId, cents: u64) -> Refund { Refund::new(order, customer, cents) }`
  - The `refund_for` body passes `order` into the `customer` slot and `customer` into the `order` slot. This is the supporting evidence that the aliases do not express the concept.
- Basis: `rust.representation.express-concepts`; not convention-only.
- Observation:
  - A type alias gives a name but no distinct concept. A reader sees `CustomerId` and `OrderId` in the signatures, but both are plain `u64`, and the compiler treats them as the same type.
  - The `customer`/`order` correspondence therefore lives only in positional convention across `Refund::new`, `refund_for` and the accessors.
  - `refund_for` takes `(order, customer, cents)` while `Refund::new` takes `(customer, order, cents)`. Its body forwards the values positionally, so the resulting `Refund` stores the order id in `customer` and the customer id in `order`.
  - A maintainer cannot tell from the representation whether this swap is deliberate. The context says the two identifiers are both 64-bit numbers from the same database, so any value fits either slot.
  - The reversed parameter order of two functions that build the same value also forces every reader to check the mapping.
  - `cents: u64` is a third adjacent `u64`. It stays a primitive: its name explains it locally, and the context gives it no relationship to the other two.
- Remedy: give each identifier its own type, so the concept has one home and the two functions can no longer be confused. Sketch:
  ```rust
  pub struct CustomerId(pub u64);
  pub struct OrderId(pub u64);
  // Refund::new(customer: CustomerId, order: OrderId, cents: u64)
  // refund_for(order: OrderId, customer: CustomerId, cents: u64)
  //     -> Refund::new(customer, order, cents)
  ```
  - Derive `Copy`, `Clone`, `Eq` and `Hash` to match the current `u64` behaviour.
  - What disappears: the positional convention between the two ids, and the need to compare `new` against `refund_for` by eye.
  - What remains: `refund_for` still takes its arguments in a different order from `Refund::new`. Decide whether to align them or keep the difference as an intentional call shape. That is an API decision, not a representation one.
  - Strongest keep alternative: leave the aliases and align the parameter order. This is smaller, but the aliases keep the "same type" reading and the swap stays undetectable.
  - Keep `Refund`'s fields as plain data. The context says no invariant relates them, so no validating constructor or enum is warranted.
- Preserve:
  - The `u64` value semantics of the ids, and `Refund`'s accessor return values (`Copy` ids).
  - If any consumer relies on the alias being a bare `u64` (arithmetic, database binding, serialization), the newtype needs conversions or derives. No such consumer is in the packet, and the module is private and unreleased.
  - The current behaviour of `refund_for` is not changed by this remedy beyond making the argument roles explicit.
- Affected files: `/src/lib.rs` (inspected); callers of `refund_for`, `Refund::new` and the id aliases are not in the packet, and any that exist are still needed.
