## Task result: T2

- Snapshot: local target `<template-at-5d58c8bf>`, whole source, commit 5d58c8bf.
- Instructions: content identity unverified.
- Assignment: `change-locality`, no profiles, `crates/infra-webhooks`, no team override.
- Status: completed.
- Inspected evidence: production items in `src/{lib,protocol,inbound,outbound}.rs`, `Cargo.toml`. Context: idempotency and jobs `maintenance.rs`, `infra-messaging/src/outbox.rs`, `docs/outbound-webhooks.md`, `quality/duplication-baseline.json`, consumer grep.
- Coverage: base lens complete. Excluded: `test_metrics.rs`, `cfg(test)` modules. `with_client` (`test-support`) treated as test-only.
- New applicability signals: `outbound.rs:290-293`, the `clock_unavailable` path emits no `webhook_delivery_finished`, though docs say each attempt does. Correctness owner: is this intended?

## C-T2-1: One delivery failure is spelled in parallel places
- Change anchor: `outbound.rs`, `Dispatcher::dispatch`, `classify_response`, `DeliveryOutcome` Display.
- Basis: rust.change.localize-existing-variation.
- Observation: `"invalid_payload"` appears in the event, `count_failure`, and Display. `"permanent"` is restated beside `JobError::permanent`. Adding or renaming a reason means three to four edits per branch. The clock path has already diverged, and `missing_endpoint` hand-writes its counter.
- Remedy: give `DeliveryOutcome` `reason()` and `is_permanent()`, plus one helper that logs, counts, and builds `JobError`. Tradeoff: the helper must carry level differences. Keep alternative: explicit branches.
- Preserve: log levels; `http.status`; no `endpoint` label for missing endpoints; `response_status` label versus `response_status_503` history; `retry_after`. Whether the clock path should gain an event is undecided.
- Affected files: `outbound.rs`.

## C-T2-2: Observation session limits restated per crate
- Change anchor: `inbound.rs`, `sample_population:486-501`.
- Basis: rust.change.localize-existing-variation.
- Observation: the `2000ms`/`100ms`/`5000ms` `SET LOCAL` triple is identical in idempotency `maintenance.rs:294-309` and jobs `maintenance.rs:244-259`. `infra-postgres` already owns the matching 8 s `MAINTENANCE_OBSERVATION_BUDGET`, so retuning the limits takes three crates, away from that budget.
- Remedy: an `infra_postgres` helper applying the limits on `Tx`, beside the budget constant. Baseline P2/P3 records keeping the cleanup error and loop scaffolding separate, so this excludes them.
- Preserve: `observed` labels differ per crate; their consumers are unverified. Root `.sqlx` metadata needs regenerating. Jobs' other `2000ms` sites (`maintenance.rs:387`, `operator.rs`) were not traced.
- Affected files: `infra-postgres/src/observe.rs`, the three maintenance owners.

## C-T2-3: Preflight restates `Delivery`'s wire shape away from it
- Change anchor: `outbound.rs`, `Outbound::preflight:119-127`; `struct Delivery:337`.
- Basis: rust.change.localize-existing-variation.
- Observation: adding a `Delivery` field means editing the struct, the envelope literal, the `fields` array and base64 sizing, in a function mixing validation with counting. `infra-messaging/src/outbox.rs:172-202` holds a near-identical fragment-counting poll loop, so yield policy changes in two crates.
- Remedy: move envelope sizing into `impl Delivery`. Sharing the counter is `unresolved`: webhooks validates each fragment's header bytes, and I did not evaluate a shared owner such as `infra-jobs`. Keep alternative: `preflight_matches_delivery_json_at_the_jobs_limit` pins size drift, which limits the risk but not the edits.
- Preserve: check order, invalid-tail precedence, 4096-byte yield and self-wake, no owned allocation before admission.
- Affected files: `outbound.rs`; `outbox.rs` only if shared.
