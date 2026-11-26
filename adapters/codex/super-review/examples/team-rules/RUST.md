# Example Rust conventions

This is an optional example, not installed policy. In a reviewed repository,
explicitly link an adopted version from `SUPER_REVIEW.md` at the target revision.
A Go override never implicitly changes a Rust rule.

## team.rust.linear-flow
Language: Rust
Paths: crates/importer/src/
Lens: function-cohesion
Action: refine rust.functions.extract-for-clarity

Keep a linear conversion together unless a helper names a meaningful operation
or removes repeated knowledge. We value local reading; extra lifetime parameters
and trait bounds must be justified by the knowledge the extraction removes.

## team.rust.ubiquitous-vocabulary
Language: Rust
Paths: crates/domain/, crates/app/
Lens: naming
Action: add

Use the product glossary consistently across domain and application modules:
prefer `subscriber` over `account` for billing owners and `invoice` over `bill`.
Keep infrastructure names (`row`, `dto`, `client`) inside adapter modules so
domain signatures read in business terms.

## team.rust.pure-domain-boundary
Language: Rust
Paths: crates/domain/
Lens: abstractions
Action: add

Keep `crates/domain/` free of HTTP (`axum`), persistence (`sqlx`), and ambient
clock or random-generator calls. Repository adapters decode flat database rows
into domain types at the boundary, and application orchestration loads state,
calls synchronous domain transitions with explicit `now`, and persists the
resulting change.

Code reference: [order transitions](reference-order.rs), symbol `Order::cancel`.
It illustrates a pure synchronous transition taking explicit time and returning
a typed domain outcome rather than mixing database or HTTP types into domain
rules. Use this for the stated boundary rule, not as a requirement to wrap
unrelated plain fields or copy the example's exact error style.

## team.rust.domain-primitives-and-clock
Language: Rust
Paths: crates/domain/, crates/app/
Lens: representation
Action: refine rust.representation.express-concepts

Always select `representation` when files under `crates/domain/` or
`crates/app/` are in scope. Represent monetary totals with explicit currency or
minor-unit types, separate swappable entity IDs with newtypes, and pass wall
clock timestamps explicitly instead of reading ambient clocks inside domain
decisions. Keep plain strings for free-form descriptions without invariants and
avoid generic typestate markers on persisted entities.

## team.rust.pin-domain-aspects
Language: Rust
Paths: crates/domain/, crates/app/
Lens: logic
Action: add

Always select `logic` and the `effects-separation` profile (under
`function-cohesion`) whenever files under `crates/domain/` or `crates/app/` are
in scope so state-rule matrices and pure-decision vs I/O boundaries are checked
even when only orchestration code changed.
