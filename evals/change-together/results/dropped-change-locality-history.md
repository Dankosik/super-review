## Task result: T2

- Snapshot: local target `<template-at-5d58c8bf>`, whole source at 5d58c8bf; full history (not shallow).
- Instructions: `content identity unverified`.
- Assignment: `change-locality`, no profiles, `crates/infra-webhooks`, no team override.
- Status: `completed`.
- Inspected evidence: all production items in `protocol.rs`, `outbound.rs`, `inbound.rs`, `lib.rs`, `Cargo.toml`; partners `infra-idempotency-store/src/maintenance.rs`, `infra-jobs/src/maintenance.rs` (through line 280), `infra-postgres/src/observe.rs` signatures, `service/src/bootstrap/webhooks.rs`; co-change log. Edition 2024, MSRV 1.99.
- Coverage: base complete. `test_metrics.rs` excluded (test-only).
- New applicability signals: none.

## C-T2-1: Inbound receipt maintenance is a parallel copy of the idempotency store's

- Change anchor: `inbound.rs` `remove_expired_pass`, `cleanup_loop`, `observe_population`, `sample_population`, `CleanupError`, `cleanup_failed`.
- Basis: `rust.change.localize-existing-variation`.
- Observation: `infra-idempotency-store/src/maintenance.rs` repeats the pass loop, cancel checks, statement-timeout batch, run counting, observer loop, the three `SET LOCAL` values (`2000ms`/`100ms`/`5000ms`), and the error enum, `From<TxError>` and logger. `infra-jobs/src/maintenance.rs` repeats the pass loop and `SET LOCAL` values. Only table SQL, labels, event names and jobs' permit vary. Changing an observation timeout means three edits; four commits (e.g. 27d59b8b, 37b63b9f) touched both webhook and idempotency files. `duplication-baseline.json` records these clones as baseline, not as a rationale.
- Remedy: `infra-postgres` already owns `CleanupPass`/`MaintenanceObserver`. Add there a tx helper for the three bounds and a pass/observer driver taking the batch or sample closure. Tradeoff: closure-heavy generics, and jobs' permit and paired observers may keep their own loop.
- Preserve: metric and log names; public `CleanupError` paths (re-export), used by `test/tests`; receipts' pool-default batch isolation versus idempotency's explicit `READ_COMMITTED`; cancellation points. Unverified: `.sqlx` metadata impact of moving `query!`.
- Affected files: `inbound.rs`, both maintenance files, `observe.rs`.

## C-T2-2: One delivery failure's labels are spread across log, metric and summary

- Change anchor: `outbound.rs` `Dispatcher::dispatch`, `classify_response`, `DeliveryOutcome`'s `Display`, `count_failure`.
- Basis: `rust.change.localize-existing-variation`.
- Observation: `"endpoint_gone"` and `"invalid_payload"` each appear in `tracing`, `count_failure` and `Display`. `"missing_endpoint"` appears in `tracing`, an inline counter and `Display`. Outcome strings are hand-paired. Adding a failure class edits four sites.
- Remedy: give `DeliveryOutcome` `reason()` and `disposition()`, with one `report` function. Tradeoff: `tracing` levels need a match.
- Preserve: `response_status` label versus `response_status_503` summary; `missing_endpoint` without endpoint label; `clock_unavailable` emits no log today; info/warn levels.
- Affected files: `outbound.rs`.

## C-T2-3: Destination admission conditions are written twice

- Change anchor: `outbound.rs` `parse_destination`, `Endpoint::with_client` (`test-support`).
- Basis: `rust.change.localize-existing-variation`.
- Observation: host, username, password and fragment checks repeat; only the scheme differs.
- Remedy: a private `has_no_credentials_or_fragment(&Url)` style predicate, with each caller keeping its scheme check. Small clarity gain.
- Preserve: `http` admitted only under `test-support`; the feature gate must not leave the helper unused.
- Affected files: `outbound.rs`; caller `test/src/bin/reading_counter_fixture.rs`.

## C-T2-4: `preflight` restates `Delivery`'s JSON shape

- Change anchor: `outbound.rs` `Outbound::preflight`, literal `{"version":,"endpoint_id":"","content_type":"","body":""}`.
- Basis: `rust.change.localize-existing-variation`.
- Observation: a `Delivery` field change also edits this literal and `fields`. `preflight_matches_delivery_json_at_the_jobs_limit` catches drift, so the cost is coordination, not silent error.
- Remedy: `unresolved`. Serializing through serde cannot keep the 4 KiB cooperative yields; a content-type length bound would change admission behaviour, which is a contract decision. Keeping the current form is supportable.
- Preserve: validation priority, exact byte count, no owned delivery before success.
- Affected files: `outbound.rs`.
