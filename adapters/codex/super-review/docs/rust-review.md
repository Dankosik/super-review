# Rust review support

Rust uses the same eight base questions, two conditional lenses and four owner
profiles as Go, with separate [Rust resources](../skills/super-review/references/languages/rust.md).
Each specialist receives its language context, assigned lens and selected profiles,
plus the shared contract and output format. Mixed PRs retain both language scopes.

Good code here means a readable, maintainable expression of an implemented solution,
not compliance with a lint catalog. Guidance covers ownership-visible APIs, borrowing
and consuming, recognizable conversions, control flow, cohesive functions/modules,
useful traits, explicit representations and supported rationale. Every lens can
favor retaining the code. Clones, loops, owned inputs and `dyn Trait` are not
findings by themselves.

## Sources and scope

The guidance is an original synthesis of the
[Rust API Guidelines](https://rust-lang.github.io/api-guidelines/),
[Cargo Book](https://doc.rust-lang.org/cargo/),
[Rust Reference](https://doc.rust-lang.org/reference/), and
[Clippy documentation](https://doc.rust-lang.org/clippy/usage.html).
External references supply context rather than mandatory team policy. No tutorial
lookup is required for each review.

The reader accepts `.rs` and narrowly named Cargo/toolchain/configuration context
while retaining pinned B/H/D, GET-only access, bounded windows, pagination, regular
file checks and binary/generated exclusions. No Rust toolchain is required during
a review: it never builds, runs, formats, lints or expands reviewed code.

Path/header filtering is not Rust parsing. Conventional test paths are filtered;
specialists resolve custom Cargo targets and test-only declarations from manifest
and source context. Mixed files remain in scope for production items. Incidental
test text is not reviewed coverage. Unknown generated inclusions and missing macro
expansions are explicit gaps. Cargo files are context, not a dependency audit.

Crate MSRV, edition, features and no_std constraints bound advice. A newer toolchain
does not authorize newer APIs. Public contracts, trait obligations, drop scopes
and evaluation order constrain related recommendations. Source reading does not
prove equivalence or soundness. Bugs, security, tests and business correctness
remain outside scope.

## Policy and validation

Existing `go.*` rule IDs are unchanged. Rust adds separate stable `rust.*` IDs
with no implicit cross-language migration. See the
[team convention example](../examples/team-rules/RUST.md). Disabling an owner rule
also governs its profiles in the declared language and scope.

`tests/rust-support.test.ts` checks source access and resource wiring, not model
judgment. `evals/rust/` separates raw packets from evaluator expectations; neither
is installed as reviewer guidance. Live model evaluations have not been run for
this addition. Mechanical checks do not establish recommendation precision/recall.
