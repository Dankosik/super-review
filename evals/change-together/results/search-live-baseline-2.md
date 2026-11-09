<!-- model: claude-sonnet-5-5; native Claude Code subagent, fresh context; 2026-11-09 -->
## Task result: jobs-worker-duplication

- Snapshot: whole-project review of the Rust workspace snapshot at commit 5d58c8bf, rooted at `<template-at-5d58c8bf>` (no git metadata). Assigned area: `<template-at-5d58c8bf>/crates/jobs-worker`.
- Instructions: `content identity unverified` (the baseline `skills/super-review` files were read from the scratchpad). The files read were review-contract.md, languages/rust.md, lenses/rust/duplication.md and assets/finding-template.md.
- Assignment: lens duplication, profile `rust.duplication.share-knowledge`. Scope is the production source of `crates/jobs-worker`, with partners searched across the whole snapshot. No team override.
- Status: completed.
- Inspected evidence:
  - Read in full: `src/main.rs`, `src/cli.rs`, `src/operator.rs`, `src/lib.rs`.
  - Read in part: `src/bootstrap.rs` (admit_pool, connect_messaging, build_engines, outbox_publisher, open_pool, bind_listeners, watch_listener, messaging_options), `src/shutdown.rs` (Budget, Signals, Background, ReportUnlessCancelled).
  - `bootstrap.rs` has more private helpers I did not read, including `run_worker` and the `serve`/`prepare` startup, and `shutdown.rs` has more stages (`run`, `drain`, `finish_work`).
  - Partners read: `crates/service/src/bootstrap/postgres.rs`, `crates/service/src/bootstrap/shutdown.rs`, `crates/infra-postgres/src/pool.rs`, `crates/config/src/postgres.rs`.
  - Excluded: `tests/process.rs`, the `#[cfg(test)]` module in `lib.rs`, and any `bootstrap.rs` test module (for example the code around line 1214). `Cargo.toml` was read for context.
- Coverage: the assigned profile pass is complete over the code listed above. The remaining unread parts of `bootstrap.rs` and `shutdown.rs` are not covered, so coverage there is partial. I did not check MSRV or dependency resolution, because no remedy needs a new crate or a newer std API.
- New applicability signals: none.

## C-jobs-worker-dup-1: PostgresSessionBudgets to SessionBudgets mapping is hand-copied in three places

- Change anchor:
  - `<template-at-5d58c8bf>/crates/jobs-worker/src/bootstrap.rs`, `open_pool`: `session_budgets: match config.postgres.session_budgets { service_config::PostgresSessionBudgets::Startup => SessionBudgets::Startup, ...Server => SessionBudgets::Server }`.
  - `<template-at-5d58c8bf>/crates/jobs-worker/src/operator.rs`, `serve`: the same match.
  - Partner: `<template-at-5d58c8bf>/crates/service/src/bootstrap/postgres.rs`, around lines 30-34: the same match.
- Basis: rust.duplication.share-knowledge, with one domain decision (the config enum maps to the pool enum) copied three times.
- Observation:
  - The two enums have identical variants (`config/src/postgres.rs` and `infra-postgres/src/pool.rs:141-144`).
  - A new variant or a changed mapping needs three coordinated edits across two crates.
  - The exhaustive match turns a missed edit into a compile error, so the cost is extra edits, not silent divergence.
  - The `PoolOptions` block around the match is also partly repeated (`max_connections`, `application_name`, `default_isolation`). Those fields differ per caller, so only the mapping is shared knowledge.
- Remedy: one conversion with a single owner, for example `impl From<PostgresSessionBudgets> for SessionBudgets` or a `session_budgets_for(&PostgresConfig)` helper.
  - The owner could not be settled from source alone. `service-config` may not depend on `infra-postgres`, and the orphan rule constrains where the `From` impl can live.
  - The owner would have to be `infra-postgres` (if it can depend on `service-config`) or a small adapter used by both binaries.
  - I did not inspect the `Cargo.toml` dependency direction between `service-config` and `infra-postgres`. The remedy stays unresolved on that dependency-direction decision.
  - Keeping the copies is defensible, because three one-line matches that fail to compile on a new variant are cheap.
- Preserve: both enums' variants and the `SessionBudgets` behavior in `infra-postgres`; no change to startup ordering or admission.
- Affected files: inspected: `crates/jobs-worker/src/bootstrap.rs`, `crates/jobs-worker/src/operator.rs`, `crates/service/src/bootstrap/postgres.rs`, `crates/infra-postgres/src/pool.rs`. Still needed: the `Cargo.toml` files of `config` and `infra-postgres`.

## C-jobs-worker-dup-2: the jobs worker's Signals type is a near-copy of the service's

- Change anchor:
  - `<template-at-5d58c8bf>/crates/jobs-worker/src/shutdown.rs`, `Signals` (`install`, `wait`, `pending`, `first_stop`).
  - Partner: `<template-at-5d58c8bf>/crates/service/src/bootstrap/shutdown.rs`, `Signals` (`install` at line 97, plus `wait`, `pending`, `first_stop`).
- Basis: rust.duplication.share-knowledge.
- Observation:
  - Both types hold the SIGTERM/SIGINT (or Windows ctrl-c) streams and the `first_stop` instant.
  - Both log the signal name and implement the same `wait().now_or_never()` poll for a pending signal.
  - The signal names, the `cfg(unix)`/`cfg(windows)` split, the "stop requested" log and the first-stop bookkeeping are the same knowledge.
  - Only the error type differs: the worker uses a unit `SignalError`; the service uses `io::Error` from the `wait`/`pending` methods.
  - Another copy would raise the stop-signal handling to three places: `crates/migrate/src/main.rs:197` also builds a SIGTERM stream, although I did not compare it in detail.
  - A fix to the signal set, such as adding SIGHUP, the log field names or the Windows handling, must be made in each copy.
- Remedy: unresolved on the owner. A shared owner could be an existing infra crate such as `infra-http` or `health`, or a small new one. Placing it is a crate-boundary decision.
  - The error type would have to be unified (for example `io::Error`, or the worker's `SignalError`).
  - The service's `Signals` is `pub(crate)` inside the service's bootstrap module, so no consumer outside these two crates exists.
  - The jobs-worker's `operator.rs` also uses `Signals` through `bounded`.
- Preserve: the first-stop timestamp semantics, the stop-signal log line, and each binary's exit-code mapping.
- Affected files: inspected: `crates/jobs-worker/src/shutdown.rs`, `crates/service/src/bootstrap/shutdown.rs`. Still needed: `crates/migrate/src/main.rs` and a decision on the owning crate.

## C-jobs-worker-dup-3: the operator receipt repeats the unknown-outcome rule in two failure builders

- Change anchor: `<template-at-5d58c8bf>/crates/jobs-worker/src/operator.rs`, `Request::failed` and `Request::database_error`.
  - Both set `body["next_action"] = "inspect the same id before any deliberate retry".into()` when `outcome == "unknown"`.
  - Both build the body with `self.receipt(outcome)`, add `cause`, and return `Report { body, success: false }`.
- Basis: rust.duplication.share-knowledge.
- Observation:
  - The rule "an unknown outcome carries the next-action guidance" is expressed twice with a repeated string literal.
  - `database_error` also reaches the `unknown` outcome through `error.is_commit_unknown()`, while `failed` reaches it through `invoked`. A change to the wording or the field needs two edits, and the literal has no named owner.
  - The duplication is small and local. A third string at `operator.rs:179` ("inspect the same identity before retrying") is a stderr message with different wording, not the receipt field, so I do not count it.
- Remedy: have both paths decide an `outcome` and share one finishing step that adds `cause` and the unknown-outcome `next_action`.
  - `database_error`'s non-mutation branch already delegates to `failed`. The mutation branch could compute the outcome and call a shared `fn with_cause(&self, outcome, cause) -> Report`.
  - Keeping the two methods is also reasonable: they differ in how `outcome` is derived (and `database_error` adds `sqlstate`), and the duplicated part is two lines.
- Preserve: the exact JSON fields and values of the receipt (`schema_version`, `outcome`, `cause`, `sqlstate`, `next_action`), which operators and scripts may parse.
- Affected files: inspected: `crates/jobs-worker/src/operator.rs`. Still needed: none for the observation. The consumers of the receipt JSON are external operator tooling not in this snapshot.

## C-jobs-worker-dup-4: `watch_listener` is a copy of the service's `Background::watch_listener`

- Change anchor: `<template-at-5d58c8bf>/crates/jobs-worker/src/bootstrap.rs`, `watch_listener(name, server, background)`.
  - Partner: `<template-at-5d58c8bf>/crates/service/src/bootstrap/shutdown.rs`, `Background::watch_listener(&mut self, name, listener)`.
  - Both take `server.failure()`, wait on `tokio::select! { biased; failure = failure => error log, () = cancel.cancelled() => {} }`, and spawn the result as a background task.
- Basis: rust.duplication.share-knowledge.
- Observation:
  - Both implement "a listener that fails stops the process" over two different `Background` types.
  - The log event differs: the worker logs `listener_failed` and the service logs `listener failed`, so the same failure reads differently in logs. That divergence already exists.
  - The `Background` types themselves differ in design: a `TaskTracker` plus a `watch<Option<&str>>` against a `JoinSet` plus `BackgroundFailure { name, panicked }`.
  - Only the listener-watching step is the same. A shared `Background` would add flags, and the divergence in lifecycle-ownership design looks deliberate, so I do not claim that.
- Remedy: unresolved. A small shared helper such as `infra_http::watch_failure(server, cancel) -> impl Future<Output = ()>` would give both crates one body and one log event name. Each caller would still spawn it on its own `Background`.
  - This depends on the decision about whether the log event name should be unified. A sensible alternative is to keep both, since the body is five lines.
- Preserve: the `biased` select order (cancellation loses to an already observed failure) and each caller's spawn and failure-latching behavior.
- Affected files: inspected: `crates/jobs-worker/src/bootstrap.rs`, `crates/service/src/bootstrap/shutdown.rs`. Still needed: `crates/infra-http` (the `Server::failure` owner), if a helper is placed there.

## Considered and not reported

- `Dsn::admit_with(config.postgres.required_dsn()?.expose_secret(), config.postgres.password_file.as_deref())` appears in `jobs-worker/src/bootstrap.rs` (`open_pool`) and in `service/src/bootstrap/postgres.rs`. The `operator.rs` copy matches only partly: its `required_dsn` and `admit_with` calls sit in separate `let`-`else` statements. It is a two-call idiom with different error handling in each place, so I did not report it separately. It would be removed with C-1 if a shared pool-options builder were chosen.
- The template-region markers and the repeated `#[allow(unused_variables)]` blocks in `admit_pool` and `main.rs` are the template's profile-removal mechanism, so they are not duplication.
- The `Budget` and the shutdown stage constants are specific to the worker's teardown and have no partner of the same shape.
