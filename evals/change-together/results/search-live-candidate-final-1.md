<!-- model: claude-sonnet-5-5; native Claude Code subagent, fresh context; 2026-11-09 -->
## Task result: duplication / crates/jobs-worker

- Snapshot: whole-project snapshot at commit 5d58c8bf, extracted at `<template-at-5d58c8bf>` with no git metadata. Assigned area: `<template-at-5d58c8bf>/crates/jobs-worker`.
- Instructions: super-review `references/review-contract.md`, `languages/rust.md`, `lenses/rust/duplication.md` and `assets/finding-template.md`, read from the candidate instruction root. Content identity unverified.
- Assignment: duplication lens (`rust.duplication.share-knowledge`), all production source of `crates/jobs-worker`. Partners were searched across the whole snapshot. No team override.
- Status: completed.
- Inspected evidence:
  - Fully read: `crates/jobs-worker/src/{lib,main,cli,operator,bootstrap}.rs`, and `shutdown.rs` lines 1-175 and 395-660. I scanned the rest of `shutdown.rs` by symbol list only.
  - Partners read in `crates/service/src/bootstrap/{mod,postgres,shutdown}.rs`.
  - Excluded: the `#[cfg(test)]` modules in `lib.rs`, `bootstrap.rs` and `shutdown.rs`, and `tests/process.rs`.
  - Not inspected: `crates/jobs-worker/Cargo.toml` beyond the first 40 lines, so MSRV and dependency details are unchecked. No candidate depends on a library operation.
- Coverage: the searched decisions and their keys are listed here.
  - `PostgresSessionBudgets::{Startup,Server}` to `SessionBudgets::{Startup,Server}` mapping.
  - `TracesSampler` to `ResolvedSampler` mapping, with `traces_sampler_arg`.
  - `replica_instance_id` and `gethostname::gethostname`.
  - `HttpConfig` to `ServerOptions` and `HardenOptions` field mapping, with `header_read_timeout`, `max_header_bytes`, `connection_cap`, `in_flight_cap` and `access_log_health_probes`.
  - `RefreshPolicy` construction from `config.health.*`.
  - Metric histogram registration pairs, with the `HTTP_REQUESTS_DURATION_BUCKETS` and `infra_postgres::*_BUCKETS` constants.
  - `Signals`, `Budget` and the shutdown timing constants, with `SHUTDOWN_TAIL`, `RUNTIME_SHUTDOWN_TIMEOUT` and `EXIT_DEGRADED_SHUTDOWN = 3`.
  - The `"inspect the same id before any deliberate retry"` literal and the receipt `outcome` strings.
  - The Postgres identifier limit 63 and the `-jobs-worker` suffix.
  - `service_name` to `{name}-jobs-worker` identity.
  - The `PoolOptions` construction in the worker's `operator.rs` and `bootstrap.rs`.
- New applicability signals: none.

## C-dup-1: The `PostgresSessionBudgets` to `SessionBudgets` mapping is written three times

- Change anchor:
  - `crates/jobs-worker/src/bootstrap.rs`, `open_pool`: `session_budgets: match config.postgres.session_budgets { service_config::PostgresSessionBudgets::Startup => SessionBudgets::Startup, ... Server => ... }`.
  - `crates/jobs-worker/src/operator.rs`, `serve`: the same match with imported names.
  - Partner: `crates/service/src/bootstrap/postgres.rs`, the same match.
  - Whole-project snapshot, so the anchor is direct.
- Basis: rust.duplication.share-knowledge.
- Observation: one config-enum to infra-enum key set is spelled in three places across two crates. Both enums are exhaustive, so a new variant breaks all three at compile time. Each is still a separate edit, and the mapping lives only in the callers.
  - The same match sits in `PoolOptions { max_connections, application_name, default_isolation: ReadCommitted, session_budgets }` beside it in both worker files.
  - Admission differs: `bootstrap.rs` uses `prepare_pool` + `admit_pool`, `operator.rs` uses `connect`.
  - `default_isolation` also differs: the service uses `ServerDefault`, the worker uses `ReadCommitted`.
- Remedy: add one `From<PostgresSessionBudgets> for SessionBudgets` or a `PostgresConfig` accessor.
  - The conversion would need to sit in the crate that depends on both types, or be a method in `service_config` if it can name `infra_postgres`. Dependency direction is unverified.
  - Keep the `PoolOptions` literals separate, because their other fields differ.
- Preserve: the per-caller fields (`application_name`, `default_isolation`, `max_connections`) and the exhaustive match.
- Affected files: `crates/jobs-worker/src/bootstrap.rs`, `crates/jobs-worker/src/operator.rs`, `crates/service/src/bootstrap/postgres.rs`. Inspected. `crates/config` and `crates/infra-postgres` manifests were not inspected, so the owner choice is open.

## C-dup-2: Sampler resolution, instance id and HTTP option mapping are copied from the service bootstrap

- Change anchor:
  - `crates/jobs-worker/src/bootstrap.rs`: `tracing_options` (the `TracesSampler` four-arm match to `ResolvedSampler`, plus the rest of `TracingOptions`), `replica_instance_id`, `server_options`, `harden_options`, `refresh_policy`.
  - Partners in `crates/service/src/bootstrap/mod.rs`:
    - `tracing_options` and `replica_instance_id`.
    - The inline `ServerOptions { header_read_timeout, max_header_bytes, max_connections, max_connection_age }` and `HardenOptions { max_body_bytes, request_timeout, max_in_flight, log_health_probes }` literals.
    - The inline `RefreshPolicy { interval, probe_budget, failure_threshold }`.
  - Whole-project snapshot, so the anchor is direct.
- Basis: rust.duplication.share-knowledge.
- Observation: these are the same config-to-runtime mappings in two crates.
  - `replica_instance_id` is byte-identical.
  - `tracing_options` differs only in that the worker passes `identity` as `service_name`.
  - The `usize::try_from(...).unwrap_or(usize::MAX)` clamps and the `connection_cap`/`in_flight_cap`/`connection_age` choices are repeated.
  - A new sampler variant, or a new `HttpConfig` field to forward, is edited twice. The `TracesSampler` match is exhaustive, so a missed arm fails the build. The struct literals are connected the same way only if the target structs are not `#[non_exhaustive]`.
  - Each of the five mappings carries the same config-field knowledge.
- Remedy: move these into a shared owner that both binaries already depend on. Candidates are `infra-telemetry` for tracing, `infra-http` for server and harden options, and `health` for the refresh policy.
  - The `service_config::Config` type is already a dependency of the worker and the service. A thin set of conversion methods on config types, or a `service_config`-side adapter, would remove the second copy.
  - Whether the owner is `service_config` or the infra crates depends on dependency direction, which I did not verify (the infra crates may not depend on `service_config`).
  - Keep the worker's `identity` and the `listener` wiring local.
- Preserve: the worker's `{name}-jobs-worker` identity, the service's use of `service_name` directly, and the diagnostics listener sharing `server_options`.
- Affected files: `crates/jobs-worker/src/bootstrap.rs`, `crates/service/src/bootstrap/mod.rs`. Inspected. The infra crate owner placement is unverified.

## C-dup-3: `Signals`, `Budget` and the exit-code and runtime-timeout constants are parallel copies of the service's

- Change anchor:
  - `crates/jobs-worker/src/shutdown.rs`: `Signals` (`install`, `wait`, `pending`, `first_stop`), `Budget` (`until`, `remaining`, `stage_deadline`), `validate_grace_budget`, `GraceBudgetError`, and the `DEPENDENCY_CLOSE` and `TELEMETRY_FLUSH` constants.
  - `crates/jobs-worker/src/lib.rs`: `EXIT_DEGRADED_SHUTDOWN = 3` and `RUNTIME_SHUTDOWN_TIMEOUT = 1s`.
  - Partners in `crates/service/src/bootstrap/{shutdown,mod}.rs`: the same structures and constants.
  - Whole-project snapshot, so the anchor is direct.
- Basis: rust.duplication.share-knowledge.
- Observation: the two `Signals` types hold the same `cfg(unix)`/`cfg(windows)` field sets and the same wait logic.
  - The same SIGTERM/SIGINT select runs in both, with the same `"stop requested"` log.
  - The only difference is the error type: `std::io::Error` in the service, a unit `SignalError` in the worker.
  - `Budget` is the same as the service's, with `deadline - RUNTIME_SHUTDOWN_TIMEOUT`.
  - The exit code `3`, the 1 s runtime reserve and the 5 s dependency-close and telemetry-flush budgets are stated again. Divergence would silently change the process contract.
  - `validate_grace_budget` and `GraceBudgetError` follow the same arithmetic over different tails.
  - `SHUTDOWN_TAIL` terms differ legitimately: the service has `DIAGNOSTICS_SHUTDOWN` where the worker has `CLEANUP` and `LISTENERS`. `BACKGROUND_JOIN` differs (3 s in the worker, 5 s in the service), so those are separate decisions.
- Remedy: extract `Signals`, `Budget` and the exit-code and runtime-timeout constants to a crate both depend on, for example `infra-telemetry` or a small lifecycle crate. The worker would keep its own `SHUTDOWN_TAIL` and stage constants.
  - Introducing a new crate is a dependency decision. The project memory notes that a shared lifecycle crate was previously rejected, so the owner may want to retain the copies deliberately. That decision is not visible in the snapshot.
  - A smaller step is a shared `Signals` only, with an error-type adapter.
- Preserve: per-process `SHUTDOWN_TAIL`, `BACKGROUND_JOIN` and the error types.
- Affected files: `crates/jobs-worker/src/shutdown.rs`, `crates/jobs-worker/src/lib.rs`, `crates/service/src/bootstrap/shutdown.rs`, `crates/service/src/bootstrap/mod.rs`. Inspected.

## C-dup-4: The operator receipt rebuilds the same `unknown` outcome rule in two functions

- Change anchor: `crates/jobs-worker/src/operator.rs`, `Request::failed` and `Request::database_error`.
  - Both set `body["cause"]`.
  - Both add `body["next_action"] = "inspect the same id before any deliberate retry"` when `outcome == "unknown"`.
  - Both build the `Report { body, success: false }`.
  - The outcome selection differs: `failed` derives it from `mutation()` and `invoked`, and `database_error` derives it from the error variant and `is_commit_unknown()`.
- Basis: rust.duplication.share-knowledge.
- Observation: the string literal and the "unknown implies next_action" rule are written twice in one file. Changing the receipt contract means editing both. The two outcome derivations are independent, so only the tail should be shared.
- Remedy: one private `Request::report_failure(outcome, cause, sqlstate: Option<..>) -> Report`.
  - It would own `receipt(outcome)`, the `cause` field, the `next_action` text for `unknown`, and the optional `sqlstate`.
  - Both callers keep their own outcome selection.
- Preserve: the exact receipt keys and schema version, and the non-mutating `database_error` branch, which emits `unavailable` with `sqlstate` through `failed`.
- Affected files: `crates/jobs-worker/src/operator.rs` only. Inspected.

## C-dup-5: `close_health` and `close_diagnostics` are the same drain-and-classify routine with different log text

- Change anchor: `crates/jobs-worker/src/shutdown.rs`, `close_health` and `close_diagnostics`.
  - Both take `Option<Server>`, return early with `false` on `None`, call `server.drain(budget)`, and match `Complete`, `TimedOut` and `Err`.
  - The differences are the log names and levels.
  - `close_health` votes degraded on `TimedOut`, while `close_diagnostics` does not and only votes on `Err`.
- Basis: rust.duplication.share-knowledge, with the degraded-vote difference a deliberate policy.
- Observation: the shape is shared, but the `TimedOut` handling is a real decision difference. A scrape outliving shutdown is not degraded, while a probe connection outliving it is. Merging them risks hiding that policy behind a parameter.
- Remedy: unresolved. Keeping both is defensible. A shared `drain_listener(server, budget) -> Result<Drained, ServerError>` helper would remove only the `Option` and `drain` plumbing and leave the classification in each function. That is a small gain, so I report the observation without a firm recommendation.
- Preserve: the differing `TimedOut` degraded vote and the log event names (`health_listener_stopped`, `diagnostics_stopped`, `diagnostics_forced`).
- Affected files: `crates/jobs-worker/src/shutdown.rs` only. Inspected. The service's own listener drain was not compared.
