# Rust review support

Rust uses the same eight base questions, five conditional lenses and eight owner
profiles as Go, with separate [Rust resources](../skills/super-review/references/languages/rust.md).
Each specialist receives its language context, assigned lens and selected profiles,
plus the shared contract and output format. Mixed Go/TypeScript/Rust/Java PRs retain every included language scope through the
[shared routing catalog](../skills/super-review/references/languages.md).

Good code here means a readable, maintainable expression of an implemented solution,
not compliance with a lint catalog. Guidance covers ownership-visible APIs, borrowing
and consuming, recognizable conversions, control flow, cohesive functions/modules,
pure synchronous business decisions separated from thin I/O shells where earned,
useful traits, explicit domain representations and state transitions, and supported
rationale. Every lens can favor retaining the code. Clones, loops, owned inputs,
passive structs and `dyn Trait` are not findings by themselves; generic typestate
on persisted entities, over-newtyping plain strings, and single-implementation
ceremony traits are explicitly avoided.

The Rust context states the standard reviewers compare source against: domain
types that own states, units, validity and transitions, pure decisions readable
apart from I/O where earned, ownership that tells the story, values bound once,
the compiler as co-maintainer, standard vocabulary and the least machinery. It
assigns each kind of idiom to the lens that owns it, so idiomatic expression is
reviewed inside the eight questions and not as a ninth pass. Each lens names
the forms it looks for beside the case for keeping the code. For multi-file
flows (`entry -> usecase -> domain -> store`), the orchestrator passes a neutral
call-spine map in task materials and runs a Spine-First Design It Twice check
during verification so overlapping local symptoms collapse into coherent
structural fixes. Conditional notes
cover Tokio, Serde, clap, Axum, SQLx, thiserror/anyhow and tracing; the
orchestrator includes implicated notes in the matching owner's selected resource
paths from crate manifests and source rather than relying on specialist
self-discovery alone.

## Sources and scope

The guidance is an original synthesis of the
[Rust API Guidelines](https://rust-lang.github.io/api-guidelines/),
[Cargo Book](https://doc.rust-lang.org/cargo/),
[Rust Reference](https://doc.rust-lang.org/reference/), and
[Clippy documentation](https://doc.rust-lang.org/clippy/usage.html).
External references supply context rather than mandatory team policy. No tutorial
lookup is required for each review.

Native host tools read `.rs` and Cargo/toolchain/configuration context at pinned
B/H/D or local snapshot views, with regular-file checks and binary/generated
exclusions. No Rust toolchain is required during a review: it never builds,
runs, formats, lints or expands reviewed code.

Path/header filtering is not Rust parsing. Conventional test paths are filtered;
specialists resolve custom Cargo targets and test-only declarations from manifest
and source context. Mixed files remain in scope for production items, and
partitioning sizes work by production lines rather than inline `#[cfg(test)]`
modules while keeping vertical call spines intact across workspace-internal
crates. Incidental test text is not reviewed coverage. Unknown generated
inclusions and missing macro expansions are explicit gaps. Cargo files are
context, not a dependency audit.

Crate MSRV, edition, `publish` status, features, committed lints and `no_std`
constraints bound advice. A newer toolchain does not authorize newer APIs.
Public contracts, trait obligations, drop scopes (including `if let` / `match`
scrutinee temporaries) and evaluation order constrain related recommendations.
Source reading does not prove equivalence or soundness. Validating bugs,
security, test coverage, and product requirements belongs to separate reviews;
making already-implemented business rules, invariants, and state transitions
explicit and easy to evolve is core scope.

## Policy and validation

Existing `go.*` rule IDs are unchanged. Rust adds separate stable `rust.*` IDs
with no implicit cross-language migration. See the
[team convention example](../examples/team-rules/RUST.md). Disabling an owner rule
also governs its profiles in the declared language and scope.

`tests/rust-routing.test.ts`, `tests/rust-depth.test.ts`,
`tests/rust-business.test.ts` and `tests/resources.test.ts` check resource
wiring, rule stability, fixture integrity and delivery alignment, not model
judgment. `evals/rust/` separates raw packets from evaluator expectations
(`R01-R12`, `RD01-RD98`, `RM01-RM06`, and multi-file business-logic pairs
`RB01-RB18`); none is installed as reviewer guidance. Bounded specialist
comparisons are recorded under `evals/rust/depth/results/` and
`evals/rust/maintenance/results/`.
Mechanical checks do not establish recommendation precision/recall.
