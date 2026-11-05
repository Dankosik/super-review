## Task result: T1

- Snapshot: whole source, local target `<template-at-5d58c8bf>`, commit 5d58c8bf, no PR.
- Instructions: content identity unverified.
- Assignment: lens `duplication`, no profiles, area `crates/jobs-worker`, no team override. Baseline: edition 2024, Rust 1.99.
- Status: completed.
- Inspected evidence: all production source in `crates/jobs-worker/src`. Partners: `crates/service/src/bootstrap/{mod,postgres,shutdown}.rs`, `crates/migrate/src/main.rs`, `crates/config/src/messaging.rs`, `crates/infra-telemetry/src/metrics.rs`.
- Coverage: base lens complete. Excluded: `tests/process.rs`, `cfg(test)` modules.
- New applicability signals: none.

Not reported:
- Signals, Budget, task teardown: `docs/architecture/async.md:22-25` records their separation.
- Config-to-infra projections (sampler, log format, session budgets, Server/Harden options, RefreshPolicy): no shared crate sees both sides, and exhaustive matches or required fields fail compilation.

## C-T1-1: Histogram registrations copied per root

- Change anchor: `bootstrap.rs` `install_observability`, 581-603, 614-617. Partner: `service/src/bootstrap/mod.rs` `install_metrics`, 211-238.
- Basis: rust.duplication.share-knowledge.
- Observation: HTTP, four postgres and outbound pairs are repeated. A new `infra_postgres` histogram needs both edits, and a miss silently falls to `DEFAULT_BUCKETS` (`metrics.rs:126`).
- Remedy: each emitter exports `HISTOGRAMS: &[(&str, &[f64])]`; roots concatenate these per retained profile. Tradeoff: one extra allocation at startup.
- Preserve: `Metrics::install` signature, template regions.
- Affected files: both bootstraps, `infra-postgres`, `infra-http`, `infra-outbound-http`; optionally `infra-jobs`.

## C-T1-2: Telemetry closure duplicated with the service

- Change anchor: `shutdown.rs` `finish_telemetry`, 706-755. Partner: `service/.../shutdown.rs:565-616`.
- Basis: share-knowledge.
- Observation: the one-second log reserve, trace-result logging and `spawn_blocking` logger close are near-identical. The recorded decision names signals, deadlines and tasks, not this.
- Remedy: `infra-telemetry` (already owns `SHUTDOWN_JOIN_SLACK`) offers trace-close and logger-close operations returning completion. Roots keep `stage`, signal check and outcome.
- Preserve: `shutdown_finishing` logs between the two closes; the signal check's position differs per root.
- Affected files: both shutdown modules, `infra-telemetry`.

## C-T1-3: Startup facts copied silently

- Change anchor: `bootstrap.rs` `replica_instance_id` 999-1003; nofile block with rationale 335-342. Partners: `service/.../mod.rs:730-734`, `309-316`.
- Basis: share-knowledge.
- Observation: identical bodies. No compile error connects them, so the `service.instance.id` default can diverge.
- Remedy: partial. Instance id could become an `AppConfig` method, which adds `gethostname` to `service-config`. Home for the nofile block is unresolved: which existing crate should own a process-limit call.
- Preserve: warn-and-continue; logger installed first in both roots.
- Affected files: both bootstraps, `crates/config/src/app.rs`.

## C-T1-4: Pool opening repeats its maintenance rule

- Change anchor: `bootstrap.rs` `open_pool` 746-785. Partner: `service/.../postgres.rs:22-61`.
- Basis: share-knowledge.
- Observation: admission order, `postgres_pool_opened` fields, and the conditional password-refresh rule with its comment are repeated. Task names already differ (`postgres_pool_metrics`, `postgres_metrics`).
- Remedy: unresolved. The spawn APIs differ (worker closure, service future), and no helper shape is established; a shared form must accept both.
- Preserve: isolation and application name per root; pool retained before `admit_pool`.
- Affected files: both, `infra-postgres`.

## C-T1-5: Required messaging keys restated

- Change anchor: `bootstrap.rs` `messaging_options` 849-872, `MessagingConfigRequired` 100-101. Partner: `config/src/messaging.rs:123-161`.
- Basis: share-knowledge.
- Observation: the same four keys are checked by `validate_producer`/`validate_consumer` and again here, with a second error variant. Existing `required_source_stream` has no caller outside config.
- Remedy: config exposes accessors like `required_source_stream`; worker maps via `WorkerError::Config` and drops the variant.
- Preserve: refusal text changes; external consumers of it are unverified.
- Affected files: both.

## C-T1-6: Operator failure receipt built twice

- Change anchor: `operator.rs` `failed` 90-98, `database_error` 114-123.
- Basis: share-knowledge.
- Observation: cause, the literal `next_action` rule and `success: false` are repeated.
- Remedy: private `failure_report(outcome, cause) -> Report`; `database_error` adds `sqlstate`.
- Preserve: JSON keys.
- Affected files: this file only.

## C-T1-7: Worker suffix literal twice

- Change anchor: `bootstrap.rs:985`, `:989`.
- Basis: share-knowledge.
- Observation: `service.name` and `application_name` share one documented identity through two literals.
- Remedy: one constant outside the jobs template region.
- Preserve: messaging-only projection compiles; byte truncation.
- Affected files: this file only.
