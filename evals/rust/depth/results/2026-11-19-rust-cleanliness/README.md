# Rust cleanliness comparison, 2026-11-19

Baseline: Super Review 3.36.5 at `237802743b94eda6baa9633ac43ae7f900a82231`.
Candidate: canonical Rust routing, context, lens, profile, and conditional
library note updates (`RD81-RD98`), including the new conditional `sqlx.md`
note and orchestrator-selected `rust/*.md` resource paths.

## Candidate canonical file digests (SHA-256)

| File | SHA-256 |
| --- | --- |
| `references/languages.md` | `a5c6b043f986a9b0a3eea455b1697215b62a56ee9dcf7723ce23af5184d2e163` |
| `references/languages/rust.md` | `ce9e820d12e90bccf8355567ed57b427e5bc11002d2bb0cb1a9b0d45a48a34b6` |
| `references/lenses/rust/control-flow.md` | `5d52eb63c910b7b0431a9df96132c0d9cdc02e1bed55e11da79a3952ffc1f7f1` |
| `references/lenses/rust/abstractions.md` | `e346e9745eb3df7035ca572e8e583659f5e8fd27fbf5e6fb610288eab516eb6e` |
| `references/lenses/rust/api-clarity.md` | `03a6b91eaeebcb857527203293ef2445cb1e7bef633bc2e850116827563d0869` |
| `references/profiles/rust/diagnostics.md` | `d64b56bc4825bf558386d2f0a8ac67384c3727e9d5c5bdce74548a9284a5cf6b` |
| `references/profiles/rust/error-expression.md` | `a645fd8dbf3068ac19914f4bab72b814bf71b9d664a2b7775d57cf2e568f8626` |
| `references/profiles/rust/existing-helpers.md` | `bb9089b1ea2763cdb7d0e5f4e2a28944905af17b7d71ee986d5a70799c70250a` |
| `references/profiles/rust/lifecycle-ownership.md` | `938b09085c77b3f829341fc26af0b545d136a9dc94440c651d157f8f222e9dac` |
| `references/profiles/rust/unused-surface.md` | `ca538bf9ca6f490f148f453c213fd87f6f251c56863b86e6e86de0da826474b6` |
| `references/rust/axum.md` | `4059c680c1b76812769cb513731f3408885bde07c926e975ea253bcbc7854144` |
| `references/rust/errors.md` | `6d02c39748c2190b0ec2f6e87cb7cebd9d0f2a2b27bb33384e1cc55c9980cffe` |
| `references/rust/serde.md` | `442743652274509facf8441c12f0108d23d7b2c995242b486c00084e6faacb32` |
| `references/rust/sqlx.md` | `a991055b580083170ab6e24ebd5059a133bbd94d42b76c75d8c7e717a9a1c149` |
| `references/rust/tracing.md` | `9fff7d3b7d078891dc9721649375741396ee20576bc30ba1d540d34fbaed7aa9` |

After the 28 runs completed, a primary-source factual audit clarified wording
(without changing any decision boundary) in six files; their post-audit digests
are:

| File | Post-audit SHA-256 | Clarification |
| --- | --- | --- |
| `references/languages/rust.md` | `b791f0bdd1fe3cb6e1f287553dba9218d58214935cf847237449f89d7cc9d4c8` | Note `publish = []` alongside `publish = false` and scope pre-Edition-2024 `else` temporary drop explicitly to `if let`. |
| `references/lenses/rust/control-flow.md` | `46a9d171eaaed7c5dbc83d185c6f8c6bfdf5869e308fc581b57e247110a434e3` | Scope pre-Edition-2024 `else` temporary drop explicitly to `if let`. |
| `references/profiles/rust/lifecycle-ownership.md` | `389b70787483b73ccfb96ceac7027bfa174950c5e7296faa8b5efbabaa9987ed` | Scope pre-Edition-2024 `else` temporary drop explicitly to `if let`. |
| `references/profiles/rust/unused-surface.md` | `34c8b73b68ae4647bdc337096a599f8d05f34514238a83c24b46af6b2cbab9bd` | Note `publish = []` alongside `publish = false`. |
| `references/rust/axum.md` | `9d0d9befb2bb6eb1bb365e8a3e800eb4447443613f98a477971eb5c87b51f52d` | State `Clone + Sync` inner-service bounds required by `axum::middleware::FromFn`. |
| `references/rust/sqlx.md` | `cdb993740c41a78c573367725ea2fd34e899bb288465bcad855ca28cac661d12` | Separate caller `&mut *tx`/`&mut **tx` from callee `&mut *conn` reborrow, and note `DatabaseError::constraint()` is Postgres-only. |

## Setup and isolation

- Host and role: native Antigravity read-only `super-review-specialist`
  subagents (`tools: [view_file, grep_search]`, `commandExecutionPolicy: off`,
  `model: inherit` from the parent session's configured model). Exact backend
  telemetry and token counts were not exposed.
- Isolation: baseline (`2378027`) and candidate `skills/super-review/` trees
  were staged under neutral paths (`res-a`, `res-b`) and packets under neutral
  paths (`snap-01`..`snap-18`). Each fresh specialist received only its own
  arm's contract, Rust context, assigned lens/profiles, finding template, and
  one neutral packet (plus implicated `rust/sqlx.md` or `rust/axum.md` in
  candidate `T-13`/`T-16`/`T-25`/`T-26` per the updated orchestrator routing);
  never `cases.json`, `README.md`, contrasts, or peer outputs.
- Dispatch order alternated baseline-first and candidate-first across positive
  pairs. All 28 runs completed with zero delivery errors.

## Decisions

| Input | Lens / profiles | Baseline (`2378027`) | Candidate | Notes |
| --- | --- | --- | --- | --- |
| RD81 | `control-flow` | `T-02`: rewrote `resolve_port` into a 7-stage combinator chain (`filter`/`map`/`transpose`?/`filter`/`unwrap_or`); flattened `select_banner` with `if let` chain | `T-01`: unwound `resolve_port` into flat `let else` + `if` + `?` (preserving duplicate-key semantics); flattened `select_banner` with `if let` chain | Candidate win on unwinding opaque combinator chains |
| RD83 | `abstractions` | `T-03`: flagged `AccountDto`, `AccountStore`/`Clock` single-impl generics, `AccountController`, `AccountService` | `T-04`: flagged all four cleanly | Tie (both find all burdens) |
| RD85 | `abstractions` | `T-06`: flagged `#[async_trait]`, `CounterHandle` actor, `resolve_token` forwarder | `T-05`: flagged all three cleanly | Tie (both find all burdens) |
| RD87 | `api-clarity` | `T-07`: flagged `ClientBuilder` `Option<String>` mandatory field, `ClientConfigError`, and never-failing `Result` | `T-08`: flagged same cleanly | Tie |
| RD89 | `abstractions` | `T-10`: flagged `require_non_empty!` hidden `return` and `str_getter!` macro DSL | `T-09`: flagged both cleanly | Tie |
| RD91 | `control-flow` + `error-expression` | `T-11`: flagged blanket manual `From<io::Error>` erasing path/operation | `T-12`: flagged blanket manual `From<io::Error>` erasing path/operation | Tie |
| RD93 | `duplication` + `existing-helpers` | `T-14`: flagged pool/tx twins (`PgExecutor`) and `"23505"` (`is_unique_violation`) | `T-13` (with `rust/sqlx.md`): flagged both cleanly | Tie on isolated packet; `sqlx.md` encodes the boundary and multi-query/Other-code guardrails explicitly |
| RD95 | `function-cohesion` + `effects-separation` | `T-15` (self-loaded `rust/axum.md`): replaced hand-rolled `Layer`/`Service` with `from_fn_with_state` | `T-16` (routed `rust/axum.md`): replaced hand-rolled `Layer`/`Service` with `from_fn_with_state` | Tie |
| RD97 | `abstractions` + `unused-surface` | `T-18`: recommended concrete removal of `include_trace` (and dependent `Record::trace`), updating `cli/src/lib.rs` | `T-17`: recommended concrete removal of `include_trace` and `Record::trace`, updating `cli/src/lib.rs` | Tie |
| RD82 | `control-flow` | Not run | `T-19`: retained (0 candidates; explicitly preserved `MutexGuard` drop before `if let`) | Clean retain |
| RD84 | `abstractions` | Not run | `T-20`: retained (0 candidates) | Clean retain |
| RD86 | `abstractions` | Not run | `T-21`: retained (0 candidates; kept `#[async_trait]` for `dyn Notifier` and autonomous periodic actor) | Clean retain |
| RD88 | `api-clarity` | Not run | `T-22`: retained (0 candidates) | Clean retain |
| RD90 | `abstractions` | Not run | `T-23`: retained (0 candidates; kept 7-type uniform macro) | Clean retain |
| RD92 | `control-flow` + `error-expression` | Not run | `T-24`: retained (0 candidates) | Clean retain |
| RD94 | `duplication` + `existing-helpers` | Not run | `T-25` (with `rust/sqlx.md`): retained (0 candidates; kept `&mut PgConnection` multi-query and `"40001"`) | Clean retain |
| RD96 | `function-cohesion` + `effects-separation` | Not run | `T-26` (with `rust/axum.md`): retained (0 candidates; kept `poll_ready` `PollSemaphore` backpressure) | Clean retain |
| RD98 | `abstractions` + `unused-surface` | Not run | Round 1 `T-27`: 0 `unused-surface` candidates, flagged 2 real base-`abstractions` smells in initial fixture (`ParseFailure` 1:1 error wrapper + unencapsulated `mod internal`). Round 2 `T-28` (after fixture tightening): retained (0 candidates across both `abstractions` and `unused-surface`) | Fixture audit caught unintended leak in r1; clean retain in r2 |

## Compiler verification

All 18 packets (`RD81-RD98`, including the revised `RD98`) compiled offline via
`cargo +1.98.1 check --offline --all-targets` (and `--workspace` for `RD97`)
with `RUSTFLAGS="-D warnings"` against local cached dependencies
(`async-trait 0.1.92`, `tokio 1.54.1`, `tokio-util 0.7.20`, `sqlx 0.8.6`,
`axum 0.8.9`, `http 1.x`, `tower-layer 0.3.x`, `tower-service 0.3.x`).

## Limits

One run per arm and input (except `RD98` r1/r2), one model family, nonblind
grading by the author of the change, baseline retain contrasts not run, and
authored fixtures rather than full multi-crate production repositories. As in
`RD53-RD68`, isolated packets with supplied context facts show reachability and
zero false positives on retain controls, not measured end-to-end recall across
large workspaces.
