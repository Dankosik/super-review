## Task result: T1

- Snapshot: local target `<template-at-5d58c8bf>`, whole source, commit 5d58c8bf.
- Instructions: content identity unverified.
- Assignment: lens `duplication`, no profiles, scope `crates/jobs-worker`, no team override.
- Status: completed.
- Inspected evidence: all of `src/` and `Cargo.toml`. Partners: `service/src/bootstrap/{mod,shutdown,postgres}.rs`, `migrate/src/main.rs`, `infra-telemetry` `Metrics::install`, `docs/architecture/{async,boundaries}.md`. Excluded: `tests/process.rs`, `cfg(test)` items.
- Coverage: base lens complete, no gaps. MSRV 1.99. Signals, Budget, stage, teardown and grace-budget copies not reported: `async.md:22-25` records them as separate owners.
- New applicability signals: none.

## C-T1-1: Postgres histogram registrations are copied per binary

- Change anchor: `bootstrap.rs` `install_observability` 587-602; `service/src/bootstrap/mod.rs` `install_metrics` 217-232.
- Basis: rust.duplication.share-knowledge.
- Observation: identical four pairs. `Metrics::install` falls back to `DEFAULT_BUCKETS` for an unlisted name, so a new infra-postgres histogram missed in one binary diverges with no compile error. The HTTP pairs repeat the same way.
- Remedy: export `infra_postgres::HISTOGRAMS`, and likewise for infra-http. Callers chain them into the `&[(&str, &[f64])]` argument. Tradeoff: template regions must wrap the chain.
- Preserve: profile retention, install-once behavior. Region manifest edits unverified.
- Affected files: both bootstraps, `infra-postgres/src/observe.rs`, `lib.rs`.

## C-T1-2: Startup policy blocks repeated without compiler linkage

- Change anchor: `bootstrap.rs` `open_pool` 746-784, `prepare` 335-342; `service/.../postgres.rs` `open` 22-61; `mod.rs` 309-316.
- Basis: rust.duplication.share-knowledge.
- Observation: same admit, log and metrics-task sequence, conditional password refresh and rationale comment. The rlimit block and its comment are verbatim. A new pool task or limit change needs two silent edits.
- Remedy: rlimit, `infra_http` owning a raise-limit helper (accept failure is its rationale). Pool sequence, unresolved: `Background::spawn` signatures differ, and which crate owns task wiring is undecided.
- Preserve: application name, isolation, task names differ; pool retained before admission.
- Affected files: as anchored, `infra-http`.

## C-T1-3: Config-to-adapter translations repeated across binaries

- Change anchor: `bootstrap.rs` `tracing_options`, `server_options`, `harden_options`, `refresh_policy`, `replica_instance_id`, session-budget match 755-758; `operator.rs` 216-219; `service/.../mod.rs` 561-565, 667-683, 730-756; `postgres.rs` 31-34; `migrate/src/main.rs` 65-68 (log format).
- Basis: rust.duplication.share-knowledge.
- Observation: matches and required fields fail compilation, so new variants or fields cost extra edits. Value policy (`usize::MAX` saturation) and `replica_instance_id` can diverge silently.
- Remedy: unresolved. `boundaries.md` excludes dependency wiring and telemetry construction from `service-config`, and configuration loading from infra crates. No current crate fits; a new one must justify itself against this modest cost.
- Preserve: worker identity override in `service_name`.
- Affected files: as anchored.

## C-T1-4: Operator failure reports assemble unknown-outcome guidance twice

- Change anchor: `operator.rs` `failed` 82-99, `database_error` 101-124.
- Basis: rust.duplication.share-knowledge.
- Observation: both set `cause`, repeat the `next_action` literal under `outcome == "unknown"`, and build `Report`. Changing the guidance needs two silent edits.
- Remedy: private `report(&self, outcome, cause, sqlstate)` called by both after each selects its outcome.
- Preserve: receipt fields and `success: false`.
- Affected files: `operator.rs`.

## C-T1-5: Worker first-failure latch and identity suffix each encoded twice

- Change anchor: `shutdown.rs` `record_failure` 220-226, `ReportUnlessCancelled::drop` 272-278; `bootstrap.rs` 985, 989.
- Basis: rust.duplication.share-knowledge.
- Observation: first-wins `send_if_modified` is written twice. `service` centralizes it in `BackgroundFailureReporter::record`. `-jobs-worker` is a literal and a constant.
- Remedy: one free latch function; move the constant outside the jobs region and format `worker_identity` with it.
- Preserve: first name stands; no-jobs projection compiles (unverified).
- Affected files: both files, `scripts/lib/template_profiles.json` if regions change.
