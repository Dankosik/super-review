## Task result: T1

- Snapshot: local target `<template-at-5d58c8bf>`, whole source, commit 5d58c8bf, no PR. Edition 2024, MSRV 1.99.
- Instructions: `content identity unverified`.
- Assignment: lens `duplication`, no profiles, `crates/jobs-worker`, no team override.
- Status: `completed`.
- Inspected evidence: all of `src/{bootstrap,shutdown,operator,lib,main,cli}.rs` and `Cargo.toml`; the matching service and migrate code; `Started::failed`, `ConsumerHandle::failed`, `Server::failure`; `docs/architecture/async.md`; `quality/duplication-baseline.json`.
- Coverage: base pass complete. Excluded `tests/process.rs` and `cfg(test)` modules. Initializer projection of moved template regions is unverified.
- New applicability signals: none.

Kept, not reported: `Signals`, `Budget` and `stage` copies (`async.md:22-25`, baseline P4 keep them per root); the `finish_attempts` warn/info branches; `close_health` vs `close_diagnostics` (different degradation policy).

## C-T1-1: Engine and consumer fault checks are written twice
- Change anchor: `bootstrap.rs`, `pending_failure` 293-308 and `wait_for_stop` 939-961.
- Basis: rust.duplication.share-knowledge.
- Observation: both encode the same fault order and the same `EngineStopped`/`ConsumerStopped` mapping, in paired template regions. Adding a native work type means editing both.
- Remedy: add `async fn native_failure(&Resources) -> WorkerError`. `wait_for_stop` awaits it; `pending_failure` calls `.now_or_never()`. Listeners and readiness stay pending-only. Tradeoff: one more function and moved region markers. Keep alternative: two short, visibly parallel forms.
- Preserve: engine-before-consumer priority, the empty-`select_all` guard, and the log at line 958 (waited path only).
- Affected files: `bootstrap.rs`; initializer region consumers not inspected.

## C-T1-2: Failure receipt assembly and retry guidance are copied
- Change anchor: `operator.rs`, `Request::failed` 90-98 and `database_error` 114-123.
- Basis: rust.duplication.share-knowledge.
- Observation: both set `cause`, repeat the `next_action` literal under the same `outcome == "unknown"` rule, and build `Report { success: false }`. Changing the operator retry contract takes two edits.
- Remedy: add `failure_report(&self, outcome, cause) -> Report`; `database_error` then adds `sqlstate`.
- Preserve: JSON keys and outcome selection.
- Affected files: `operator.rs`.

## C-T1-3: The worker suffix is declared twice
- Change anchor: `bootstrap.rs`, `worker_identity` 985 and `APPLICATION_NAME_SUFFIX` 989.
- Basis: rust.duplication.share-knowledge.
- Observation: the trace/NATS identity and the Postgres `application_name` spell the same `-jobs-worker` suffix independently.
- Remedy: move the constant outside the jobs region and use it in both.
- Preserve: template removal must still compile, and the 63-byte truncation stays.
- Affected files: `bootstrap.rs`.

## C-T1-4: The session-budget translation is copied inside the crate
- Change anchor: `bootstrap.rs:755-758`, `operator.rs:216-219`.
- Basis: rust.duplication.share-knowledge.
- Observation: identical two-arm match. The cost is small because exhaustiveness flags a new variant. The orphan rule blocks a `From` impl here.
- Remedy: one `pub(crate)` local function in a jobs region.
- Preserve: both call sites stay jobs-only.
- Affected files: `bootstrap.rs`, `operator.rs`.

## C-T1-5: Config-to-runtime translations repeat across composition roots
- Change anchor: `bootstrap.rs` `server_options`/`harden_options` 965-982, `refresh_policy` 551-557, `tracing_options` sampler 1007-1016, `replica_instance_id` 999-1003, `open_pool` 755-758, `LoggingOptions` format 574-577, `rlimit` block 335-342. Peers: `service/src/bootstrap/mod.rs` 668-681, 561-565, 739-746, 730-734, 302-305, 310-316; `service/src/bootstrap/postgres.rs` 31-34; `migrate/src/main.rs` 66 (format only).
- Basis: rust.duplication.share-knowledge.
- Observation: the same mappings live in separate roots. Struct literals catch new fields, but the `usize::MAX` saturation choice and the `rlimit` rationale do not get that protection, so changing them needs coordinated edits.
- Remedy: `unresolved`, a remaining owner decision. `service-config` excludes telemetry construction and dependency wiring (`boundaries.md:10`); no inspected infra manifest depends on it, so a shared form needs a new bridge. `async.md`'s no-lifecycle-crate rule doesn't cover these. Keep alternative: root-local translation.
- Preserve: worker's `identity` service name, and service's `ServerDefault` vs worker's `ReadCommitted` isolation.
- Affected files: as anchored.
