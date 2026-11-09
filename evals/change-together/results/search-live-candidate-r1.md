<!-- model: claude-sonnet-5-5; native Claude Code subagent, fresh context; 2026-11-09 -->
## Task result: dup/jobs-worker

- Snapshot: whole-project review of the pinned snapshot `<template-at-5d58c8bf>` (commit 5d58c8bf, no git metadata). Assigned area: `crates/jobs-worker`.
- Instructions: super-review instruction set under the candidate `skills/super-review` root. Content identity unverified.
- Assignment: lens duplication, profile `rust.duplication.share-knowledge`, scope `crates/jobs-worker` production source. Partners were searched across the whole snapshot.
- Status: completed
- Inspected evidence:
  - jobs-worker, read in full: `src/bootstrap.rs` (production part), `src/shutdown.rs` (lines 1–~700), `src/operator.rs`, `src/lib.rs`, `src/cli.rs` and `Cargo.toml`.
  - Partners read: `crates/service/src/bootstrap/{mod.rs,postgres.rs,shutdown.rs}` and `crates/config/src/{http.rs,postgres.rs}` (the relevant methods). I also checked the Cargo dependency edges of `crates/config`, `infra-http` and `infra-telemetry`.
  - `crates/jobs-worker/src/main.rs` was not read. The jobs-worker tests (`tests/process.rs`, the `#[cfg(test)]` modules) and the `main.rs` composition are excluded or out of scope.
- Coverage: the decisions below were searched snapshot-wide and every match was read.
  - HTTP server and harden option mapping, searched through `ServerOptions {`, `HardenOptions {`, `connection_cap`, `in_flight_cap`, `connection_age`. Matches: service `mod.rs` and jobs-worker `bootstrap.rs`. `infra-grpc/router.rs::server_options(Limits)` is a different input type and a different concept, so I left it out.
  - `RefreshPolicy {`. Matches: service and jobs-worker; the rest are tests.
  - `ResolvedSampler::` and `TracesSampler`. Matches: service and jobs-worker `tracing_options`; the rest are tests.
  - `replica_instance_id`. Matches: service and jobs-worker.
  - `PostgresSessionBudgets::Startup`. Matches: service, jobs-worker bootstrap and operator. The reverse direction does not exist, because each is an exhaustive forward `match`.
  - `Dsn::admit_with` and the `PoolOptions` pool-opening sequence. Matches: service `postgres.rs`, jobs-worker `open_pool` and `operator.rs`.
  - `METRICS_MAINTENANCE_INTERVAL = 10 s`. Matches: service and jobs-worker.
  - The four `infra_postgres::*_DURATION` histogram registrations. Matches: service and jobs-worker `install_metrics`.
  - `RUNTIME_SHUTDOWN_TIMEOUT = 1 s`, `EXIT_DEGRADED_SHUTDOWN = 3`, `GraceBudgetError`, `validate_grace_budget`, `Budget`, `Signals`. Matches: service `shutdown.rs` and `mod.rs`, jobs-worker `shutdown.rs` and `lib.rs`.
  - `start_progress` and `watch_listener`. Matches: service and jobs-worker.
  - `next_action` string. Matches: only `operator.rs`.
  - Not duplicated: `application_name` truncation (`POSTGRES_IDENTIFIER_LIMIT`, 63) appears only in jobs-worker. `crates/config` and the other infra crates contain no `floor_char_boundary` use.
- New applicability signals: none.

## C-dup-1: config-to-infra option mapping is copied between the service and jobs-worker bootstraps

- Change anchor: `<template-at-5d58c8bf>/crates/jobs-worker/src/bootstrap.rs`, fns `server_options`, `harden_options`, `refresh_policy`, `tracing_options`, `replica_instance_id`. Partners: `crates/service/src/bootstrap/mod.rs` (the inline `ServerOptions { header_read_timeout … max_connection_age }`, the `HardenOptions { max_body_bytes … log_health_probes }` block, the `RefreshPolicy { interval … failure_threshold }` block at ~L561, `tracing_options`, `replica_instance_id`).
- Basis: rust.duplication.share-knowledge (repeated mapping between two key sets).
- Observation:
  - The worker's `server_options` and `harden_options` are field-for-field copies of the service's inline blocks. That includes the `usize::try_from(..as_u64()).unwrap_or(usize::MAX)` clamp and the `connection_cap`/`in_flight_cap`/`connection_age` adapters.
  - The `RefreshPolicy` mapping is also a field-for-field copy.
  - `tracing_options` and `replica_instance_id` match line for line apart from `service_name` (`identity` versus `otel.service_name`). That includes the 4-arm `TracesSampler` to `ResolvedSampler` match.
  - Each one is an exhaustive struct literal or `match`, so a new field forces a compile-time edit in both places. What remains is a coordinated second edit, and silent divergence when a policy detail changes. Examples are the clamp-on-overflow policy and `connection_age` zero-means-off.
  - `crates/config` has no infra dependencies and `infra-http` does not depend on `service_config`, so no existing crate sits above both sides to host the mapping.
- Remedy: unresolved on placement. The mapping needs one owner that sees both `service_config` and the infra option types. The existing candidates are a small adapter crate or module in the template (not a new abstraction beyond one function per option struct), or a `From`/`Config::…_options()` hosted by whichever crate may depend on both. Missing decision: which crate may take on both dependencies, since `config` is deliberately infra-free. Keep alternative: leave as is, since these are two composition roots and each copy is compile-checked.
- Preserve: field values and the clamp behavior. Worker `tracing_options` takes `identity` (`<name>-jobs-worker`), so the shared form must take `service_name` as a parameter, as the worker already does.
- Affected files: `crates/jobs-worker/src/bootstrap.rs`, `crates/service/src/bootstrap/mod.rs` (inspected). Possible new owner: not inspected.

## C-dup-2: PostgreSQL pool admission mapping is written three times

- Change anchor: `crates/jobs-worker/src/bootstrap.rs::open_pool` (`Dsn::admit_with(required_dsn…, password_file)`, `PoolOptions { … session_budgets: match … }`, `prepare_pool`, `admit_pool`, "postgres_pool_opened" log, the `record_metrics_periodically` task, and the conditional `refresh_password_periodically` task). Partners: `crates/service/src/bootstrap/postgres.rs::open` (the same sequence and log keys, including the same comment about the rotation task) and `crates/jobs-worker/src/operator.rs::serve` (`Dsn::admit_with` plus the same `match config.session_budgets`).
- Basis: rust.duplication.share-knowledge.
- Observation:
  - The `PostgresSessionBudgets` to `SessionBudgets` match appears three times. The enum lives in `service_config` and its target in `infra_postgres`.
  - The `Dsn::admit_with(required_dsn().expose_secret(), password_file)` expression appears three times.
  - `open_pool` and the service's `open` carry the same startup log field set (`postgres.host/port/database/sslmode/max_connections`) and the same metrics and password-refresh tasks. They differ only in:
    - `application_name` (the worker derives it with a suffix, the service uses `service_name` as is);
    - `default_isolation` (`ReadCommitted` versus `ServerDefault`);
    - the `background.spawn` API;
    - `max_connections.get()` versus the bare `max_connections`, a log-value type difference.
  - Adding a session-budget mode or a DSN source touches three sites. `operator.rs` shows that the mapping is wanted without the rest of `open_pool`.
- Remedy: at least the budget-mode conversion and the DSN admission have a clear single form, `fn session_budgets(&PostgresConfig) -> SessionBudgets` and `fn admit_dsn(&PostgresConfig) -> Result<Dsn, _>`, in the same owner as C-dup-1. Whether the log and background-task sequence is also shared is less clear, because of the isolation and spawn-API differences. Sharing it would need parameters for those. Keep alternative: share only the two small functions and leave `open_pool` as is.
- Preserve: `operator.rs` deliberately maps all `DsnError`s to the cause `"dsn"` without repeating the URL (its comment), so the shared admission must hand back the error unchanged and not log it.
- Affected files: `crates/jobs-worker/src/bootstrap.rs`, `crates/jobs-worker/src/operator.rs`, `crates/service/src/bootstrap/postgres.rs` (inspected).

## C-dup-3: the set of histograms registered with `Metrics::install` is copied

- Change anchor: `crates/jobs-worker/src/bootstrap.rs::install_observability`, the `Metrics::install(&[ … ])` array, with the HTTP pair plus four `infra_postgres::*_METRIC/_BUCKETS` entries and the `outbound-http` entry. Partner: `crates/service/src/bootstrap/mod.rs::install_metrics`, the same list.
- Basis: rust.duplication.share-knowledge (repeated key set with a paired bucket constant).
- Observation:
  - Each metric constant is paired with its bucket constant, and the pairs are listed twice. They are the HTTP request duration, HTTP admission wait, and `infra_postgres` connection wait, transaction, operation and cleanup durations. The `infra_outbound_http::REQUEST_DURATION_METRIC` pair is listed twice as well.
  - A new histogram, or a changed bucket constant name, in an infra crate needs the entry in both lists.
  - A missed entry is not a compile error. The histogram silently falls back to the default exporter buckets (inference from `Metrics::install`'s explicit-bucket contract, not verified).
  - The jobs-only entries (`ATTEMPT_DURATION`, `CLAIM_DURATION`, `QUEUE_WAIT`) are legitimately worker-specific.
- Remedy: a `pub const`/`fn` listing next to each infra crate's metric definitions (for example `infra_postgres::HISTOGRAMS: &[(&str, &[f64])]`) that both roots splice into `install`. The owning crate then states the pairing once. Missing evidence: the `Metrics::install` parameter type and how `infra_http` and `infra_outbound_http` expose their constants; I did not read `infra-telemetry/src/metrics.rs`. Keep alternative: leave the lists, because each root composes only the histograms of the capabilities it carries (see the `template:begin` markers).
- Preserve: capability gating by `template:begin/end` regions.
- Affected files: `crates/jobs-worker/src/bootstrap.rs`, `crates/service/src/bootstrap/mod.rs` (inspected). `crates/infra-postgres`, `infra-http`, `infra-outbound-http`: not inspected.

## C-dup-4: lifecycle primitives are duplicated between `jobs-worker/shutdown.rs` and `service/bootstrap/shutdown.rs`

- Change anchor: `crates/jobs-worker/src/shutdown.rs`: `GraceBudgetError` and `validate_grace_budget`, `Budget` (`until`/`remaining`/`stage_deadline`), `Signals::install`. `crates/jobs-worker/src/lib.rs`: `RUNTIME_SHUTDOWN_TIMEOUT = 1 s` and `EXIT_DEGRADED_SHUTDOWN = 3`. Partners: service `shutdown.rs` (same names and bodies) and service `mod.rs` (the same two constants, with a doc comment on the exit code). The jobs-worker `bootstrap.rs` also repeats `METRICS_MAINTENANCE_INTERVAL = 10 s`, `start_progress` (arm progress, the progress-loss watcher, the refresher) and `watch_listener`; each has a service twin.
- Basis: rust.duplication.share-knowledge.
- Observation:
  - `validate_grace_budget` is the same inequality (`grace_period < drain_timeout + SHUTDOWN_TAIL`) and the same error shape. Only the tail components and the message wording differ.
  - `Budget` is the same computation. The worker's `now + min(want, deadline − now)` equals the service's `min(deadline, now + want)`, and its `remaining` is identical.
  - `Signals::install` and its `Signals` fields and cfg arms are identical.
  - Exit codes and the runtime-shutdown bound are the same values stated in two crates. The process tests use 3 as the "degraded" contract.
  - The worker's own doc comment says it mirrors the service ("as the service does").
  - The tails differ (the worker adds `CLEANUP` and `LISTENERS`, and `BACKGROUND_JOIN` is 3 s versus 5 s), so only the shape is shared, not the constant sum.
  - A change to the arithmetic, for example whether the runtime reserve counts toward the grace budget, must be made twice.
- Remedy: unresolved. A shared module would hold `Budget`, `Signals`, the grace-check as `fn(grace, drain, tail)` and the two constants, with each root keeping its own tail and message. Missing decision: the owning crate; the existing review memory records that a shared lifecycle crate was previously considered and not adopted, so adoption is a deliberate reopening. Keep alternative: two small independent roots whose teardown stages differ.
- Preserve: the stage ceilings and the tail sum, which differ per process.
- Affected files: `crates/jobs-worker/src/{shutdown,lib,bootstrap}.rs`, `crates/service/src/bootstrap/{shutdown,mod}.rs` (inspected).

## C-dup-5: the "unknown outcome" receipt text is built twice in `operator.rs`

- Change anchor: `crates/jobs-worker/src/operator.rs`, `Request::failed` and `Request::database_error`.
- Basis: rust.duplication.share-knowledge (one domain message in two places).
- Observation:
  - Both functions compute an `outcome`, build `self.receipt(outcome)`, set `body["cause"]`, and set the same `next_action` string "inspect the same id before any deliberate retry" under `if outcome == "unknown"`. The rule "an unknown outcome carries `next_action`" is stated twice.
  - `database_error` additionally derives `Missing/Stale/Conflict/commit-unknown` outcomes and adds `sqlstate`.
  - If `"unknown"` guidance changes, or another outcome gets one, there are two sites. No compile error ties them together.
- Remedy: a private `fn report(&self, outcome: &str, cause: &str) -> Report` that sets `cause` and the `unknown` `next_action`, called by both. This removes the duplicate string and the condition. Alternatively, a const for the sentence only. The tradeoff is small, as the two classifiers stay separate.
- Preserve: `sqlstate` is set only by `database_error`. In `failed` the success flag is always false.
- Affected files: `crates/jobs-worker/src/operator.rs` only (inspected in full).
