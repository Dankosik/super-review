<!-- model: claude-sonnet-5-5; native Claude Code subagent, fresh context; 2026-11-09 -->
## Task result: dup-jobs-worker

- Snapshot: whole-project review of the snapshot at commit 5d58c8bf, read from `<template-at-5d58c8bf>` (no git metadata).
- Instructions: `content identity unverified`. I read the super-review contract, Rust context, `rust.duplication.share-knowledge` and the finding template from the candidate instruction root.
- Assignment: lens duplication, profile `rust.duplication.share-knowledge`. Scope is `crates/jobs-worker` (`src/main.rs`, `cli.rs`, `lib.rs`, `bootstrap.rs`, `shutdown.rs`, `operator.rs`, `Cargo.toml`). No team override.
- Status: completed.
- Inspected evidence:
  - All of the above, in full, except the `#[cfg(test)]` modules and `tests/process.rs`, which are excluded as test-only.
  - Partners elsewhere in the snapshot: `crates/service/src/bootstrap/{mod.rs,postgres.rs,shutdown.rs}`, `crates/migrate/src/main.rs`, `crates/infra-postgres/src/pool.rs` (the `SessionBudgets` enum), and `crates/config/src/postgres.rs` (the `PostgresSessionBudgets` enum).
- Coverage:
  - Decisions searched: the `postgres.session_budgets` to `SessionBudgets` mapping; the `TracesSampler` to `ResolvedSampler` mapping; the `LogFormat` to `LoggingFormat` mapping; `ServerOptions` and `HardenOptions` field derivation; `RefreshPolicy` fields; the `Metrics::install` histogram name/bucket pairs; the rlimit nofile raise; replica instance id; the `-jobs-worker` suffix; the `RUNTIME_SHUTDOWN_TIMEOUT` of 1 s; exit code 3; the shutdown stage constants (`BACKGROUND_JOIN`, `DEPENDENCY_CLOSE`, `TELEMETRY_FLUSH`, `SHUTDOWN_TAIL`); the signal wait/pending logic; `GraceBudgetError`; the `next_action` string in operator receipts.
  - Keys used: `Startup`/`Server`, `always_on`, `Json`/`Text`, `http.*`, `health.*`, `postgres_pool_opened`, `postgres_password_refresh`, `open_file_limit_unchanged`, `shutdown_stage_panicked`, `trace_shutdown_completed`.
  - Missing evidence: none for the assigned question.
- New applicability signals: none.

## C-dup-jobs-worker-1: Config-to-infra-postgres session-budgets mapping and PoolOptions build copied across the worker, its operator and the service

- Change anchor:
  - `crates/jobs-worker/src/bootstrap.rs`, `open_pool`: `session_budgets: match config.postgres.session_budgets { Startup => SessionBudgets::Startup, Server => SessionBudgets::Server }`.
  - `crates/jobs-worker/src/operator.rs`, `serve`: the same match.
  - `crates/service/src/bootstrap/postgres.rs` lines 30-34: the same match.
  - Both worker sites also repeat `Dsn::admit_with(raw.expose_secret(), password_file)` followed by a `PoolOptions { default_isolation: ReadCommitted, ... }` literal.
  - Whole-project snapshot anchor.
- Basis: `rust.duplication.share-knowledge`. A key-set mapping that is not compile-connected: adding a third `PostgresSessionBudgets` variant fails each copy's match only after the `service-config` change, and each copy needs its own edit.
- Observation: `PostgresSessionBudgets` (`config/src/postgres.rs`) and `SessionBudgets` (`infra-postgres/src/pool.rs`) are a one-to-one pair. The match appears three times, in two crates and two files of the worker. Each call site that opens a pool from `PostgresConfig` redoes the same DSN admission and option assembly. The only per-site variation is `max_connections` and `application_name`, plus isolation (`ServerDefault` in the service, `ReadCommitted` in both worker sites). A coordinated edit across three files is needed for any change to the budgets mapping or DSN admission.
- Remedy: one conversion owned in a single place, called by the three sites. Candidates are `impl From<PostgresSessionBudgets> for SessionBudgets`, or a `PoolOptions` constructor taking `&PostgresConfig` and the per-site fields. Where it lives depends on the `service-config` to `infra-postgres` dependency direction. I did not check whether `service-config` may depend on `infra-postgres` (or the reverse), so the owner is unresolved. The conversion could instead live in a small adapter in `infra-postgres` that accepts the config enum if the config crate stays upstream.
- Preserve: the isolation difference between service and worker; `application_name` derived per process; the operator's `max_connections` of 1; bounded failure causes (the operator maps `Dsn` errors to the cause `"dsn"` without echoing parameters).
- Affected files: `crates/jobs-worker/src/bootstrap.rs`, `crates/jobs-worker/src/operator.rs`, `crates/service/src/bootstrap/postgres.rs`, `crates/config/src/postgres.rs`, `crates/infra-postgres/src/pool.rs`. The two configuration and infra-postgres files were inspected only for the enum pair.

## C-dup-jobs-worker-2: Process-bootstrap mappings and constants duplicated between the worker and the service

- Change anchor: `crates/jobs-worker/src/bootstrap.rs`; partner `crates/service/src/bootstrap/mod.rs`. Whole-project snapshot anchor.
  - `tracing_options`: the four-arm `TracesSampler` to `ResolvedSampler` match and the `TracingOptions` literal. The service copy is at `mod.rs` lines 736-757. Only `service_name` differs, and the service also threads the same `instance_id`.
  - `replica_instance_id`: a line-for-line copy (`mod.rs` line 730).
  - `install_observability`: `LogFormat::Json` to `LoggingFormat::Json` match, here and at `mod.rs` line 302, and at `crates/migrate/src/main.rs` line 66, which makes three production copies.
  - `Metrics::install` histogram list: the HTTP, admission-wait and four postgres name/bucket pairs are repeated verbatim at `mod.rs` lines 211-235. The worker adds jobs-specific pairs.
  - The rlimit nofile raise: an identical 10-line block with the same explanatory comment, including the `open_file_limit_unchanged` key.
- Basis: `rust.duplication.share-knowledge`: one decision (how configuration becomes telemetry/runtime options, which histograms exist for the shared crates) held in separate copies.
- Observation: each infra crate that owns histogram constants (`infra-postgres`, `infra-http`) gets re-enumerated in every binary. A new infra-postgres metric must be added to the service list, the worker list and any later binary, and a missed one registers with default buckets silently. The sampler match is a key-set mapping with exhaustive arms, so a new variant breaks both at compile time. The costs are the extra edit and the silent drift on the histogram list. `migrate` already carries a third `LogFormat` copy.
- Remedy: move the pure mappings (`tracing_options` core, log format, `replica_instance_id`) and the infra-owned histogram groups next to their owners. For example, `infra-telemetry` could expose `TracingOptions::from_config`-style helpers (dependency direction not verified), and `infra-postgres`/`infra-http` could export a `HISTOGRAMS: &[(&str, &[f64])]` constant that bins splice in. The service's retained-capability markers (`template:begin ...`) constrain how lists are composed, so the histogram part is partly unresolved: the marker regions may need to stay in each binary. The sampler, log-format and instance-id parts have no such constraint.
- Preserve: worker `service_name` uses the `-jobs-worker` identity; the order of `Metrics::install` entries is irrelevant to behavior (not verified in infra-telemetry); the template marker regions in `bootstrap.rs`.
- Affected files: `crates/jobs-worker/src/bootstrap.rs`, `crates/service/src/bootstrap/mod.rs`, `crates/migrate/src/main.rs` (inspected); `infra-telemetry`, `infra-http` and `infra-postgres` (owners, not inspected for current exports).

## C-dup-jobs-worker-3: HTTP and health option derivation copied from the service

- Change anchor: `crates/jobs-worker/src/bootstrap.rs`: `server_options` (965), `harden_options` (975), `refresh_policy` (551). Partners are at `crates/service/src/bootstrap/mod.rs` lines 667-681 and 561-565 as inline literals. Whole-project snapshot anchor.
- Basis: `rust.duplication.share-knowledge`.
- Observation: the mapping from `HttpConfig` fields to `ServerOptions` and `HardenOptions` is identical, including the `usize::try_from(max_*_bytes.as_u64()).unwrap_or(usize::MAX)` conversion. The `HealthConfig` to `RefreshPolicy` field mapping is also identical. `infra-grpc` has a separate `server_options(limits)`. A new `http.*` knob (or a change to the saturating conversion) must be wired twice, and a missed second copy silently leaves the worker on the old behavior.
- Remedy: expose `ServerOptions::from(&HttpConfig)`, `HardenOptions::from(&HttpConfig)` and `RefreshPolicy::from(&HealthConfig)`-style constructors in one crate that sees both types, or functions beside the config types. Direction is unresolved: `infra-http` and `health` do not necessarily depend on `service-config`. An adapter crate or the config crate behind a feature would work, and only a dependency check can settle which.
- Preserve: the service's `hotpath` wrapping stays outside; the `unwrap_or(usize::MAX)` saturation semantics.
- Affected files: `crates/jobs-worker/src/bootstrap.rs`, `crates/service/src/bootstrap/mod.rs`; `crates/config/src/http.rs` and `crates/health/src/lib.rs` not inspected.

## C-dup-jobs-worker-4: Shutdown scaffolding forked from the service with near-identical bodies

- Change anchor: `crates/jobs-worker/src/shutdown.rs`; partner `crates/service/src/bootstrap/shutdown.rs`. Whole-project snapshot anchor.
  - `Signals`: the struct, `install`, `wait` and `pending` are near copies. They differ in the return type (`SignalError` vs `io::Error`) and in `first_stop` placement.
  - `Budget`: `until`, `remaining` and `stage_deadline`. The worker's `stage_deadline` is `now + remaining(want)`, the service's is `min(async_deadline, now + want)`, which is the same value.
  - `stage`: the `catch_unwind` wrapper.
  - `validate_grace_budget`, `GraceBudgetError` and its message, the `Outcome` enum, and the `SHUTDOWN_TAIL` sum.
  - `finish_telemetry`: the body of the log-reserve split, the `ProviderShutdown` match, the `spawn_blocking` logger close and the `Outcome` upgrade.
  - Constants: `DEPENDENCY_CLOSE` is 5 s in both, `TELEMETRY_FLUSH` is 5 s in both, and `RUNTIME_SHUTDOWN_TIMEOUT` (1 s) and `EXIT_DEGRADED_SHUTDOWN` (3) are declared in each crate.
  - `close_diagnostics` / `stop_diagnostics`: the same three-arm drain match with the same log keys.
- Basis: `rust.duplication.share-knowledge`. The two copies already diverge: `BACKGROUND_JOIN` is 3 s here and 5 s in the service, and the worker adds `CLEANUP` and `LISTENERS` stages.
- Observation: the telemetry-flush and logger-close policy is one decision (budget split, 1 s log reserve, outcome upgrade on an incomplete logger). It is copied byte-for-byte in places. A fix to the shutdown ordering of the logger or tracer provider must be applied in both files. The doc comments already say "as the service does". The divergent constants are legitimate per process, but the shared ones look like one budget policy.
- Remedy: a shared module owning `Signals`, `Budget`, `stage`, `Outcome`, `finish_telemetry` and the grace-budget validator, parameterized by each process's stage list and tail constants. One candidate owner is `infra-telemetry` (which already exports `SHUTDOWN_JOIN_SLACK`, `LoggerGuard`, `TracerProviderHandle`) or a new small crate. A new crate must carry its own justification, so this is a named structural decision. Sketch: `pub async fn finish_telemetry(provider, logger, budget, degraded) -> Outcome` with `Budget` and `Signals` moved alongside.
- Preserve: the differing return and error types (`SignalError` vs `io::Error`) as seen by `bootstrap.rs` and `lib.rs`; the worker-only stages; the stage ordering and budgets of each process; the marker regions. These are known from reading both files; the effect on the service's tests is unverified.
- Affected files: `crates/jobs-worker/src/shutdown.rs`, `crates/jobs-worker/src/lib.rs`, `crates/jobs-worker/src/operator.rs` (uses `Signals` and `DEPENDENCY_CLOSE`), `crates/service/src/bootstrap/shutdown.rs`, `crates/service/src/bootstrap/mod.rs`.

## C-dup-jobs-worker-5: Operator receipt construction repeats the unknown-outcome tail in two methods

- Change anchor: `crates/jobs-worker/src/operator.rs`, `Request::failed` and `Request::database_error`. Whole-project snapshot anchor.
- Basis: `rust.duplication.share-knowledge`.
- Observation: both build `body = self.receipt(outcome)`, set `body["cause"]`, and, when `outcome == "unknown"`, set the literal `next_action = "inspect the same id before any deliberate retry"`. Then both wrap it in `Report { body, success: false }`. The "unknown" wire value and the `next_action` text are spelled in several places. Changing the instruction text, or adding a `next_action` for another outcome, needs a coordinated edit in both methods. In `database_error`, the non-mutation branch also delegates to `failed` while the mutation branch re-implements it.
- Remedy: have `database_error` compute only the outcome and the `sqlstate`, then reuse one finishing function that adds `cause`, the optional `next_action` and the `Report`. A sketch is `fn finish(&self, outcome: &str, cause: &str) -> Report`, with `failed` choosing the outcome and `database_error` extending the body with `sqlstate`.
- Preserve: the receipt JSON shape, including `sqlstate` only on database errors and `schema_version` on every receipt; the `Inspect` path reporting `unavailable` rather than `failed`.
- Affected files: `crates/jobs-worker/src/operator.rs` only.

## C-dup-jobs-worker-6: The `-jobs-worker` identity suffix is spelled twice in one file

- Change anchor: `crates/jobs-worker/src/bootstrap.rs`: `worker_identity` (`format!("{service_name}-jobs-worker")`) and `const APPLICATION_NAME_SUFFIX: &str = "-jobs-worker"` used by `application_name`. Whole-project snapshot anchor.
- Basis: `rust.duplication.share-knowledge`. The suffix is a small decision in one file, so this is minor.
- Observation: the process identity suffix is repeated as a literal in the format string and in the constant. A rename of the identity (for example in telemetry or dashboards) has to touch both, and `operator.rs` additionally hard-codes `application_name: "jobs-worker-operator"`. The 63-byte Postgres identifier limit is only applied to the second spelling.
- Remedy: define the suffix constant once, use it in `worker_identity` and `application_name`, and keep the operator name next to it. This is a local edit.
- Preserve: telemetry `service.name`/messaging `connection_name` unchanged. The Postgres name stays truncated with `floor_char_boundary`, and the untruncated identity stays for telemetry.
- Affected files: `crates/jobs-worker/src/bootstrap.rs`, `crates/jobs-worker/src/operator.rs`.
