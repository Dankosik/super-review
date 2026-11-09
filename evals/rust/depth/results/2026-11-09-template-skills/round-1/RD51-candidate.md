<!-- model: claude-sonnet-5-5; arm: candidate; input: RD51; tool: native Claude Code subagent, fresh context -->
## Task result: RD51

- Snapshot: whole-project snapshot of the supplied packet RD51 (`Cargo.toml`, `src/lib.rs`); no PR or B/H/D.
- Instructions: super-review review-contract, rust language note and rust representation lens; content identity unverified.
- Assignment: lens `representation`, no profiles; scope is all production declarations in `src/lib.rs`, a private unreleased module. Compatibility baseline: edition 2021, rust-version 1.85.
- Status: completed
- Inspected evidence: `Cargo.toml`; `src/lib.rs` in full (`CustomerId`, `OrderId`, `Refund`, `Refund::new`, the three accessors, `refund_for`). No consumers outside the packet were supplied.
- Coverage: the representation base rule `rust.representation.express-concepts` is complete for the supplied declarations. No library note was needed. No other source is missing.
- New applicability signals: none

## C-RD51-1: `CustomerId` and `OrderId` are interchangeable aliases, and `refund_for` already swaps them

- Change anchor: `src/lib.rs`, `pub type CustomerId = u64; pub type OrderId = u64;`, `Refund::new(customer: CustomerId, order: OrderId, cents: u64)` and `refund_for`. The body of `refund_for` is `Refund::new(order, customer, cents)`.
- Basis: `rust.representation.express-concepts`. The advice rests on the rule's alias-versus-newtype guidance, not on a team convention.
- Observation:
  - Both aliases name `u64`. The context states that both ids are 64-bit numbers from the same database, so a caller could plausibly confuse them.
  - The aliases give each id a name but no separate type, so the compiler treats them as the same type.
  - The packet already shows the cost. `refund_for` declares `(order, customer, cents)`, while `Refund::new` takes `(customer, order, cents)`. The body forwards them in declaration order, so the first argument lands in the `customer` field.
  - A reader has to compare the two parameter orders to see that the stored identifiers are swapped relative to the names. Nothing in the representation records which number is which.
  - The code also has three adjacent same-typed parameters, `(u64, u64, u64)` after alias expansion. The ordering is a convention each caller must remember. Assuming the swap is intended, the burden is the same: the meaning lives in argument position.
- Remedy: make the two ids distinct newtypes and leave `cents` as is.

  ```rust
  pub struct CustomerId(pub u64);
  pub struct OrderId(pub u64);
  ```

  `Refund::new` and `refund_for` keep their signatures. Passing an `OrderId` where a `CustomerId` is expected then becomes a type mismatch, and the argument order is carried by the types. The swapped forwarding in `refund_for` is then visible at the call site, and a reader no longer has to check it against `Refund::new`. Add `Debug`, `Clone`, `Copy`, `PartialEq`, `Eq` and `Hash` derives as the consumers need. The newtypes still need conversions from the database's `u64`. Those conversions become the one place where an id is created.
  - Strongest keep alternative: the aliases are enough if every caller already passes named locals and nobody confuses the ids. The `refund_for` swap shows the aliases do not carry this.
  - `cents: u64` stays a primitive. A `Cents` newtype would be a separate decision, since this code never mixes it with another quantity.
- Preserve:
  - Known: `Refund` is passive data, and every combination of values is valid. Both ids are `u64`.
  - Known: the module is private and unreleased, with no external API commitment.
  - Unverified: consumers outside the packet, such as database row mapping or serialization of `u64` ids. A derived or transparent encoding would keep any wire format unchanged.
  - Unverified: `Copy` and `Hash` use at call sites.
  - Unverified: which argument order callers of `refund_for` expect. The remedy does not settle that. It only makes the order visible in the types.
- Affected files: `src/lib.rs` (inspected). Callers of `refund_for` and `Refund::new` were not supplied and are still needed.

## C-RD51-2: Private fields with trivial getters on passive data

- Change anchor: `src/lib.rs`, `pub struct Refund { customer, order, cents }` and `Refund::customer`, `Refund::order`, `Refund::cents`.
- Basis: `rust.representation.express-concepts`. The rule says a field that carries an invariant stays private behind its operations, while passive data needs no getter layer.
- Observation:
  - The context states that any combination of the three values is valid and nothing maintains a relationship between them.
  - `Refund::new` is a plain field-by-field constructor with no validation. Each accessor returns a field by copy.
  - The privacy therefore protects no invariant. It adds four members, a constructor and three getters, that restate the field list.
  - Adding or changing a field means editing the struct, the constructor and a getter together. That is the coordinated editing the passive data model does not need.
  - Together with C-RD51-1, the positional constructor is the place where `customer` and `order` get mixed.
- Remedy: make the fields `pub` and drop the constructor and getters. Callers then use struct-literal syntax, with named fields:

  ```rust
  pub struct Refund { pub customer: CustomerId, pub order: OrderId, pub cents: u64 }
  ```

  The three-argument constructor goes away, and named fields replace positional arguments. `refund_for` then builds the literal as `Refund { customer, order, cents }`, which also removes the reordering hazard from C-RD51-1 for this path.
  - Strongest keep alternative: keep private fields and `new` if `Refund` is expected to gain validation, for example a cents limit. No such requirement is in the source or the context, and a hypothetical rule is not evidence.
- Preserve:
  - Known: the data is passive and the module is private. Public fields would let callers mutate a `Refund` after construction, which no stated invariant forbids.
  - Unverified: whether callers outside the packet rely on `new` or on the getter method syntax, for example as function pointers, and whether a migration is acceptable.
- Affected files: `src/lib.rs` (inspected). Consumers of `Refund::new` and the accessors were not supplied and are still needed.
