<!-- model: claude-sonnet-5-5; native Claude Code subagent, fresh context; 2026-11-09 -->
## Task result: rust.duplication.share-knowledge (jobs-worker)

- Snapshot: whole-project review of `<template-at-5d58c8bf>` (commit 5d58c8bf, no git metadata). The pinned snapshot is the only source. Review area is `<template-at-5d58c8bf>/crates/jobs-worker`.
- Instructions: `references/review-contract.md`, `references/languages/rust.md`, `references/lenses/rust/duplication.md` and `assets/finding-template.md` under the baseline `skills/super-review` root. Content identity unverified.
- Assignment: duplication lens, `rust.duplication.share-knowledge`, scope `crates/jobs-worker/src`. Partners were searched across the snapshot, mainly `crates/service/src/bootstrap`, `crates/service/src/grpc.rs` and `crates/config`.
- Status: completed.
- Inspected evidence:
  - jobs-worker: `main.rs`, `cli.rs`, `operator.rs`, `lib.rs` and `Cargo.toml` in full; `shutdown.rs` lines 1-760; `bootstrap.rs` lines 1-135, 540-625 and 730-1110.
  - service: `bootstrap/shutdown.rs` lines 1-700 and the `bootstrap/mod.rs` and `bootstrap/postgres.rs` slices listed below.
  - Excluded as test-only: the `#[cfg(test)]` modules in `lib.rs`, `shutdown.rs` and `bootstrap.rs`, and `tests/process.rs`.
  - Not read in full: `bootstrap.rs` lines 135-540 and 625-730 (the serve, prepare, engine and messaging orchestration).
- Coverage: the shutdown/signal mechanics, the pool and telemetry option building, and the HTTP option mapping were each compared against their partners. The registration and orchestration paths in `bootstrap.rs` that were not read (lines 135-540 and 625-730) are the main limit on coverage.
- New applicability signals: none.

## C-dup-1: Signal, budget and grace-period mechanics duplicated between the service and the worker

- Change anchor: `crates/jobs-worker/src/shutdown.rs` — `Signals` (`install`, `wait`, `pending`, `first_stop`), `Budget`, `validate_grace_budget`/`GraceBudgetError`, `Outcome`, `stage`, `SHUTDOWN_TAIL`. Partners: `crates/service/src/bootstrap/shutdown.rs` — the same-named items.
  - The two `Signals` structs have the same fields, the same cfg-split `install`, and a `wait` that logs the same `"stop requested"` message. They differ only in the error type: `SignalError` in the worker, `io::Error` in the service.
  - The two `validate_grace_budget` bodies are line-for-line the same check: `http.grace_period < http.drain_timeout.saturating_add(SHUTDOWN_TAIL)`. Only the message wording differs.
  - `Budget::until` and `remaining` are identical. `stage_deadline` is equivalent: the worker uses `now + remaining(want)`, the service uses `min(deadline, now + want)`.
  - `Outcome` and `stage` (the `catch_unwind` wrapper that logs `shutdown_stage_panicked`) are duplicated with only a trivial difference in the log fields.
- Basis: `rust.duplication.share-knowledge` (the whole-snapshot partner search found the service copy).
- Observation: one decision, "how a process turns signals into a stop and spends one retained deadline across stages", exists as two hand-maintained copies. A change to the signal set, the first-stop timestamp, the runtime reserve in `Budget`, or the grace-budget inequality must be made twice, and silent divergence is possible because nothing links the copies. Divergence has already started: the two `stage_deadline` bodies and the two `Signals::wait` error types differ.
- Remedy: move the shared, profile-neutral pieces into an existing crate both binaries already depend on, for example `infra-http` (already a dependency of both) or a small shared lifecycle module. Candidates are `Signals`, `Budget`, `Outcome`, `stage`, and a `validate_grace_budget(http, tail)` that takes the tail as a parameter. Each crate would keep its own `SHUTDOWN_TAIL` list, since the stage sets differ, and its own stage ordering. The tradeoff is a new shared owner or crate, and prior review notes record a shared lifecycle crate as previously rejected (`jobs-worker-review-2026-09-27`). The reopen condition would need checking against this evidence. If only the signal and budget primitives are shared, no abstraction over the stage order is needed.
- Preserve: the service's `Signals::wait` returns `io::Error` and the worker's returns `SignalError`, so one error type must be chosen. The worker's `pending` uses `now_or_never`, as does the service's. The `template:begin` markers and profile retention still need each crate's own regions. Stage ordering and the per-crate `SHUTDOWN_TAIL` composition stay local.
- Affected files: `crates/jobs-worker/src/shutdown.rs`, `crates/jobs-worker/src/operator.rs` (it uses `Signals`), `crates/service/src/bootstrap/shutdown.rs`, and the service's `bootstrap/mod.rs` consumers (not inspected).

## C-dup-2: Telemetry-finish and diagnostics/pool close stage bodies repeated

- Change anchor: `crates/jobs-worker/src/shutdown.rs` — `finish_telemetry`, `close_diagnostics`, `close_pool`. Partners: `crates/service/src/bootstrap/shutdown.rs` — `finish_telemetry`, `stop_diagnostics`, `Dependencies::close` (postgres arm).
  - The worker's `finish_telemetry` and the service's share the same sequence: `logger.begin_shutdown`; a log reserve of `min(1s, remaining)`; a trace shutdown with `TELEMETRY_FLUSH - log_reserve`; the `ProviderShutdown` match with the same two log events and the same `delivery_confirmed = false` field; computing the `Outcome` and logging `shutdown_finishing`; then the `spawn_blocking` logger shutdown.
  - `close_diagnostics` and `stop_diagnostics` are the same `Drained` match with the same log messages: `diagnostics_stopped`, `diagnostics_forced` with `reason = "scrape_outlived_shutdown_budget"`, and `diagnostics_shutdown_failed`.
  - `close_pool` and the service's postgres close arm have the same `Closed` match and the same messages (`postgres_pool_closed`, "postgres pool outlived its close budget").
- Basis: `rust.duplication.share-knowledge`.
- Observation: the "one second for the logger inside the five-second telemetry stage" rule is expressed twice with comments that restate each other. The operator log events and field names (`trace_shutdown_incomplete`, `diagnostics_forced`, and so on) are an operational contract that dashboards and alerts may key on, and a change to them has to be made in both processes. The copies have already diverged in small ways: the service reads `signals.pending()` inside `finish_telemetry`, and the worker does it before the call.
- Remedy: expose a shared `finish_telemetry(tracer, logger, deadline, degraded) -> Outcome` and the `Drained` and `Closed` log mappings from one owner. A natural home is `infra-telemetry` for the telemetry part, and `infra-http` or `infra-postgres` for the diagnostics and pool mappings. Both crates already depend on them. The worker's and the service's stage callers then keep only their ordering. The tradeoff is that the `Outcome` type must live below both crates (see C-dup-1), and each log site gets a second caller to coordinate with.
- Preserve: the log event names, field names and levels (they are external observability); the `signals.pending()` check ordering in the service; and the `stage` unwind isolation per stage.
- Affected files: `crates/jobs-worker/src/shutdown.rs`, `crates/service/src/bootstrap/shutdown.rs`. The candidate shared owners were not inspected.

## C-dup-3: Bootstrap option mapping repeated across worker, operator and service

- Change anchor: three repeated mappings.
  1. The `PostgresSessionBudgets` → `SessionBudgets` match, at `crates/jobs-worker/src/bootstrap.rs` `open_pool` (lines 756-757), `crates/jobs-worker/src/operator.rs` `serve` (lines 217-218), and `crates/service/src/bootstrap/postgres.rs` (lines 32-33). Three copies.
  2. `tracing_options` (the `TracesSampler` → `ResolvedSampler` match, and the `TracingOptions` field copy) and `replica_instance_id` (hostname fallback). These are near-verbatim in `crates/jobs-worker/src/bootstrap.rs` (lines 999-1030) and `crates/service/src/bootstrap/mod.rs` (lines 730-755). The worker differs only by a `service_name` parameter. The copies already differ in how `ResolvedSampler` is imported.
  3. `server_options`/`harden_options`: `crates/jobs-worker/src/bootstrap.rs` (lines 965-981) and `crates/service/src/bootstrap/mod.rs` (lines 666-683) repeat the `usize::try_from(max_*_bytes.as_u64()).unwrap_or(usize::MAX)` conversion and the field mapping from `HttpConfig`.
- Basis: `rust.duplication.share-knowledge`.
- Observation: each is a config-to-runtime-options mapping owned by the config crate's types. A new `TracesSampler` variant is a compile error in both matches, so the divergence risk is low and the cost is an extra edit. A new `PostgresSessionBudgets` variant is likewise a compile error in all three places. A new `HttpConfig` field that must reach `ServerOptions` or `HardenOptions` is a silent miss unless both mappings are edited. The sampler and `PostgresSessionBudgets` copies are the weaker case, since they are exhaustive matches.
- Remedy: put each mapping next to the config type or the target options type: `impl From<PostgresSessionBudgets> for SessionBudgets` (or a method on `PostgresConfig` returning `SessionBudgets`), `OtelConfig::tracing_options(identity, instance_id)`, and `HttpConfig`-derived `ServerOptions`/`HardenOptions` constructors. That requires the options types to be reachable from `service-config`. If `service-config` deliberately stays free of the infra crates (not verified), the mapping would live in an infra-side extension instead, which is a remaining decision. Item 1 is the lowest-risk start.
- Preserve: the worker's `application_name` suffix (`-jobs-worker`) and identity string, the `Isolation::ReadCommitted` vs `ServerDefault` choice, and `NonZeroU32::MIN` for the operator pool.
- Affected files: `crates/jobs-worker/src/bootstrap.rs`, `crates/jobs-worker/src/operator.rs`, `crates/service/src/bootstrap/mod.rs`, `crates/service/src/bootstrap/postgres.rs`. `crates/config` and `crates/infra-postgres` were not inspected for dependency direction.

## C-dup-4: Pool admission and background-task registration repeated between the service and the worker

- Change anchor: `crates/jobs-worker/src/bootstrap.rs` `open_pool`, lines 741-787. Partner: `crates/service/src/bootstrap/postgres.rs` (the whole pool-opening function).
- Basis: `rust.duplication.share-knowledge`.
- Observation: the sequence is identical in both files: `Dsn::admit_with(required_dsn, password_file)`, `PoolOptions`, `prepare_pool`, `admit_pool`, the `postgres_pool_opened` log with the same five fields, a periodic metrics task, and a password-refresh task spawned only when `dsn.password_file().is_some()`. The explanatory comment about "an ended background task is a failure" is also repeated. The differences are the application name, the isolation, and the background spawn API. A rule such as "log these fields at open" or "spawn the refresh only with a password file" needs two edits.
- Remedy: unresolved. A shared helper in `infra-postgres` would have to be generic over the background spawner (the worker spawns on a `TaskTracker`-based `Background`, the service on a `JoinSet`-based one), so it would return the pieces (pool, refresh future, metrics future) and leave spawning to the caller. Whether that is clearer than two short copies depends on the shared-lifecycle decision in C-dup-1. This finding is partly subsumed by C-dup-3 item 1 (the budgets match).
- Preserve: pool retention before admission, so that cleanup sees the pool (`resources.pool = Some(pool.clone())` in the worker); the fire-and-fail semantics of the refresh task.
- Affected files: `crates/jobs-worker/src/bootstrap.rs`, `crates/service/src/bootstrap/postgres.rs`.

Not reported as duplication: `Background` in the worker (`TaskTracker` plus an abort list) versus the service (`JoinSet`) are different ownership models, and `watch_listener` differs in structure and log text. They stay separate unless C-dup-1 reopens a shared owner.
