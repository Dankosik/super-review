## Task result: T1

- Snapshot: local whole source, commit 5d58c8bf, at `<template-at-5d58c8bf>`.
- Instructions: content identity unverified.
- Assignment: lens `duplication`, no profiles, scope `crates/jobs-worker`, no team override. Rust edition 2024, MSRV 1.99.
- Status: completed.
- Inspected evidence: all of `src/{lib,main,cli,operator,shutdown,bootstrap}.rs` and `Cargo.toml`. Counterparts: `crates/service/src/bootstrap/{mod,postgres,shutdown}.rs`, `crates/migrate/src/main.rs`.
- Coverage: base lens complete. Excluded `tests/` and `cfg(test)` items.
- New applicability signals: correctness, `bootstrap.rs` `prepare`. The `open_file_limit_unchanged` warn (line 341) runs before `install_observability` (line 344), yet `docs/backend-library-selection.md:34` says the failure is logged. Delivery unverified at runtime.
- Kept deliberately: Signals/Budget/Background (`docs/architecture/async.md:23`, baseline P4). `close_health` and `close_diagnostics` differ in timeout policy. Sampler, session-budget and log-format maps fail to compile on divergence, and no shared owner exists.

## C-T1-1: Unknown-outcome receipt rule is written twice
- Change anchor: `operator.rs` `Request::failed` lines 90-98, `database_error` lines 114-123.
- Basis: `rust.duplication.share-knowledge`.
- Observation: the `next_action` literal, its `outcome == "unknown"` condition and `Report` assembly are copied. Editing the guidance needs two edits, and nothing connects them.
- Remedy: add `rejection(&self, outcome, cause) -> Report`. `failed` picks its outcome; `database_error` also sets `sqlstate`.
- Preserve: receipt fields, `sqlstate` only on database errors. `preserve_order` was not found in manifests.
- Affected files: `operator.rs`.

## C-T1-2: First-failure-wins recording is implemented twice
- Change anchor: `shutdown.rs` `Background::record_failure` lines 220-226, `ReportUnlessCancelled::drop` lines 272-278.
- Basis: `rust.duplication.share-knowledge`.
- Observation: two `send_if_modified` closures encode one rule, in different spellings, so readers must confirm they match.
- Remedy: one private `record_first(&watch::Sender<_>, name)` used by both.
- Preserve: the first name stands; a later call does not notify; drop remains panic-safe.
- Affected files: `shutdown.rs`.

## C-T1-3: Recovery and page arguments are repeated across subcommands
- Change anchor: `cli.rs` `Redrive`/`Discard` lines 40-54, `Failed`/`Unhandled` after/limit lines 24-27 and 34-37; `operator.rs` `try_new` lines 48-53.
- Basis: `rust.duplication.share-knowledge`.
- Observation: `default_value_t = 100` can diverge silently. Redrive and Discard name one inspected-version identity, also consumed by the same `RecoveryTarget::try_new` call twice.
- Remedy: flattened `RecoveryArgs` and `PageArgs` groups. Keep-alternative: explicit variants read well if the commands evolve separately.
- Preserve: flags, positional order, help text. Help output unverified.
- Affected files: `cli.rs`, `operator.rs`.

## C-T1-4: Process-startup knowledge is copied from the service
- Change anchor: `bootstrap.rs` `replica_instance_id` lines 999-1003 and the nofile block 335-342; `service/src/bootstrap/mod.rs` lines 730-734 and 311-316.
- Basis: `rust.duplication.share-knowledge`.
- Observation: identical bodies and comment, with no compile-time link. Placement has already diverged: the service raises the limit after installing logging, the worker before.
- Remedy: `unresolved`. Owner decision needed: neither `gethostname` nor `rlimit` is declared by `config`, `infra-http` or `infra-telemetry`, and sharing moves a dependency.
- Preserve: event name, hostname fallback.
- Affected files: both bootstrap modules, plus the chosen owner.

## C-T1-5: Small same-crate repeats
- Change anchor: `shutdown.rs` lines 448 and 484-488 (in-flight sum), lines 372-376 with `bootstrap.rs` 294-297 (engine failed), `bootstrap.rs` 985 with 989 (`-jobs-worker` suffix).
- Basis: `rust.duplication.share-knowledge`.
- Observation: each fact is restated, though tests pin the suffix.
- Remedy: `Resources::in_flight()`, `Resources::engine_failed()`, and one suffix const outside the jobs template region.
- Preserve: template-region removability, unverified for the moved const.
- Affected files: `shutdown.rs`, `bootstrap.rs`.
