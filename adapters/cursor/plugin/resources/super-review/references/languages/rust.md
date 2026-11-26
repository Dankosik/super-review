# Rust context

**Baseline and verification roots.** Read the owning crate's `Cargo.toml` at H
and resolve inherited `edition`, `rust-version`, `publish` status, features,
`no_std`/`alloc` or target `cfg` branches, and committed lints (`[lints]`,
`[workspace.lints]`, `clippy.toml`, `rustfmt.toml`) through its workspace
(`package.workspace` when present). Record that baseline in each task packet so
specialists do not re-derive manifest state. The crate's MSRV (not a newer local
toolchain, edition, or sibling crate) bounds syntax and `std` recommendations;
verify stabilization, const use, and dependency contracts against `Cargo.lock`
and locally present sysroot (`rust-src`) or locked registry source
(`~/.cargo/registry/src`, `vendor/`) rather than memory. Missing baseline or
feature evidence limits that specific advice; never upgrade or run Cargo,
`rustc`, Clippy, `rustfmt`, build scripts, or proc macros.

**Library context.** Resolve dependency versions and enabled features for the
owning crate before selecting a note below; include implicated notes in the
matching owner's `selected resource paths` during planning, and consult any
newly implicated note for your assigned owner while reading. A workspace-only
dependency is not an applicability signal on its own, though it informs
`existing-helpers` tradeoffs. These conditional notes are not new profiles, rule
IDs, or extra passes.

| Mechanism | Existing owners | Reference |
| --- | --- | --- |
| Tokio task groups, shutdown, selection, state notifications or waiting for a condition | data-flow/lifecycle-ownership; control-flow | [Tokio](../rust/tokio.md) |
| Serde wire shape, deserialization lifetime, two-step `Value` plumbing or repeated `with` adapters | representation; api-clarity; duplication | [Serde](../rust/serde.md) |
| clap argument grammar or repeated command knowledge | api-clarity; change-locality | [clap](../rust/clap.md) |
| Axum HTTP contract, Tower/Axum middleware, state or adapter/application boundary | api-clarity; function-cohesion/effects-separation | [Axum](../rust/axum.md) |
| SQLx row decoding, connection/transaction executors or database error classification | representation; api-clarity; duplication/existing-helpers; control-flow/error-expression | [SQLx](../rust/sqlx.md) |
| thiserror or anyhow error types, conversions, context chains or error formatting | control-flow/error-expression; api-clarity; rationale/diagnostics | [error crates](../rust/errors.md) |
| tracing spans, events, instrumentation or error reporting | function-cohesion/effects-separation; control-flow/error-expression; rationale/diagnostics | [tracing](../rust/tracing.md) |

**Craft.** Read source against how an experienced Rust author writes the same
business or systems operation today under the same contract and baseline. Domain
types own their states, units, validity, and transitions so callers do not
reconstruct rules by hand; pure decisions stay readable apart from I/O where
that simplifies the story; ownership reads directly (borrow to read, own to
keep, share only what is shared); values bind once from the deciding expression;
exhaustive matches, privacy, and typed outcomes keep the compiler as a
co-maintainer; and code uses standard vocabulary with the least machinery that
owns the job (a function before a type, a concrete type before a single-use
generic, `pub(crate)` before `pub`, no ceremony wrappers or generic typestate on
persistent records).

**Idiom owners and judgment.** Idiom is evidence inside the assigned lens, never
a separate pass: patterns, `?`, and failure paths belong to `control-flow` (and
redundant guards to `defensive-checks`); bindings, moves, and iteration to
`data-flow`; standard or declared-dependency operations to `duplication`;
signatures and standard traits to `api-clarity`; fact-carrying types and state
models to `representation`; name forms to `naming`; helpers, pure decision cores,
and boundaries to `function-cohesion` and `abstractions`; crate-wide approaches
to `conventions`; module homes to `placement`; case counts and rule matrices to
`logic`. An idiom earns acceptance only by what it removes (a branch, a binding,
a second check, a coordinated edit). Local mutation, an ordinary loop, an
explicit match, an owned value, or a concrete type is often already best; shorter
or more functional is not the measure. Respect committed lint configuration
without recommending what it denies or auditing its violations.

**Preservation.** Check every property implicated by a proposed change:
1. Ownership and mutation: borrowing vs consuming, aliasing, `Arc::clone`
   shared ownership, and snapshot collections that end borrows.
2. Evaluation and failure order: accepted inputs, error identity, first-error
   precedence, short-circuiting, eager vs lazy effects, and time precision.
3. Lifetimes and drop timing: cancellation and lock/guard drop scopes, including
   `if let` and `match` scrutinee temporaries (alive through matched arms, and
   through `if let` `else` before Edition 2024).
4. Contracts and visibility: public signatures, traits, auto traits (`Send`/
   `Sync`), lifetime captures, wire/FFI layouts, and hidden consumers via
   `pub use ... as ...`, blanket impls, or `?`/`From`. Visibility bounds doubt:
   private/`pub(crate)` items have no outside callers, and `pub` items in a
   workspace-internal crate (`publish = false` or `publish = []`, no external
   contract) have their full consumer set across workspace targets and features.

**Production scope.** Use manifests and declarations to exclude test/benchmark
targets and `#[cfg(test)]` items while keeping production items in mixed files.
Size partitions by production lines (not inline `#[cfg(test)]` modules), read
tests selectively only for affected callers, and keep vertical call spines
(`entry -> domain -> store`) intact across workspace-internal crates rather than
slicing by crate. Resolve Rust lenses and profiles through
[language routing](../languages.md); missing macro expansions or generated
source remain explicit gaps.
