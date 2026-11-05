## Task result: T1

- Snapshot: local target `<template-at-5d58c8bf>`, whole source, commit 5d58c8bf7762875331e6a9933bb19e3df31f877d.
- Instructions: content identity unverified.
- Assignment: lens `duplication`, no profiles, scope `crates/jobs-worker`, no team override. Rust 1.99, edition 2024.
- Status: completed.
- Inspected evidence: all production items in `src/{lib,main,cli,operator,bootstrap,shutdown}.rs`. Context: service bootstrap, migrate `main.rs`, `docs/architecture/async.md`.
- Coverage: base lens complete. Excluded: `tests/process.rs`, `cfg(test)` modules. Nothing compiled or expanded.
- New applicability signals: none.

Considered and kept:
- `Signals`, `Budget`, grace validation (twin of service `bootstrap/shutdown.rs`): `async.md` keeps separate owners until a shared change offsets the cost.
- `close_health`/`close_diagnostics`: timeout semantics differ.
- `finish_attempts` info/warn field lists: a macro is no clearer.

## C-T1-1: Worker name suffix is written twice
- Change anchor: `bootstrap.rs`, `worker_identity` (985) and `APPLICATION_NAME_SUFFIX` (989).
- Basis: rust.duplication.share-knowledge.
- Observation: telemetry/NATS identity and the Postgres application name spell `-jobs-worker` separately. Renaming needs two edits.
- Remedy: move the const outside the `jobs` region and use it in `worker_identity`. Keep the length limit in the region.
- Preserve: profile removal must leave a used const; values unchanged.
- Affected files: `bootstrap.rs`.

## C-T1-2: Operator failure-receipt rule is written twice
- Change anchor: `operator.rs`, `Request::failed` (92-98) and `database_error` (114-123).
- Basis: rust.duplication.share-knowledge.
- Observation: both build a receipt, set `cause`, attach the identical `next_action` text when outcome is `unknown`, then wrap `Report { success: false }`. Changing the recovery guidance needs two edits.
- Remedy: add a private `failure(outcome, cause) -> Report`. `database_error` then adds `sqlstate`.
- Preserve: JSON fields and outcome selection. Workspace manifests do not enable `preserve_order`, so insertion order is unobservable.
- Affected files: `operator.rs`.

## C-T1-3: Retained-pool lookup and refusal repeat
- Change anchor: `bootstrap.rs`, `build_engines` (501-505), `outbox_publisher` (537-541), `activate_postgres_messages` (642-645).
- Basis: rust.duplication.share-knowledge.
- Observation: each spells `resources.pool.as_ref().ok_or(WorkerError::PostgresDisabled)?`, so the missing-pool refusal has three copies.
- Remedy: add `retained_pool(&Resources) -> Result<&PgPool, WorkerError>` in a `jobs` region; callers clone as needed. Small gain.
- Preserve: outbox regions already use `jobs`-gated imports (`Engine`), but profile closure was not verified.
- Affected files: `bootstrap.rs`.

## C-T1-4: `PostgresSessionBudgets` mapping repeats in the crate
- Change anchor: `bootstrap.rs` `open_pool` (755-758), `operator.rs` `serve` (216-219). A third copy is in service `bootstrap/postgres.rs` (31-34).
- Basis: rust.duplication.share-knowledge.
- Observation: identical matches. A new variant needs each edited, though exhaustiveness makes the compiler flag them.
- Remedy: one private crate function in a `jobs` region covers both worker sites. The service copy stays. Keeping it is defensible.
- Preserve: mapping semantics.
- Affected files: `bootstrap.rs`, `operator.rs`.

## C-T1-5: Config-to-adapter mappings are copied across binaries
- Change anchor: `bootstrap.rs` `tracing_options` (1005-1027), `replica_instance_id` (999), `server_options` (965), `harden_options` (975). Twins in service `bootstrap/mod.rs` (736, 730, 667, 676).
- Basis: rust.duplication.share-knowledge.
- Observation: these encode one config interpretation; only `service_name` differs. A semantic change, such as sampler or `unwrap_or(usize::MAX)` handling, needs coordinated edits the compiler will not prompt.
- Remedy: unresolved. `service-config` has no infra dependencies and the infra crates do not depend on it, so sharing needs a new crate or a new dependency edge. The evidence is duplicated mappings, not an accepted home. The keep alternative is supported: `async.md` records no decision on these mappings, but `AGENTS.md` demands a current constraint for a new crate.
- Preserve: worker `-jobs-worker` identity; profile removal.
- Affected files: `bootstrap.rs`, service `bootstrap/mod.rs`.
