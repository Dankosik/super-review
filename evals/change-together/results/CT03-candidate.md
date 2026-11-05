## Task result: CT03

- Snapshot: static packet `packet-CT03.json`, whole-project view; no commits.
- Instructions: content identity unverified.
- Assignment: duplication; profiles none; scope `worker/src/boot.rs`; no team override.
- Status: completed.
- Inspected evidence: all packet files; both `histograms`, both `wait_for_signal`, `telemetry::install`, `docs/lifecycle.md`.
- Coverage: base rule complete. `http`/`db` declarations and `install` callers are absent, which limits only the remedy.
- New applicability signals: none.

## C-CT03-1: Shared histogram pairs are hand-copied, and drift fails silently

- Change anchor: `worker/src/boot.rs` `histograms`, lines 1-6; partner `api/src/boot.rs` `histograms`.
- Basis: `rust.duplication.share-knowledge`.
- Observation: both binaries repeat the `http` and `db` metric/bucket pairings. Adding a histogram to a shared owner means editing both lists. Per `install`, an unlisted name renders `DEFAULT_BUCKETS`, so nothing flags a missed copy. `docs/lifecycle.md` covers signal handling and teardown, not this registry.
- Remedy: each owner exports its pairs, for example `http::HISTOGRAMS`, and each binary writes `[http::HISTOGRAMS, db::HISTOGRAMS].concat()`, with api adding `grpc::HISTOGRAMS`. A new metric in an existing owner then takes one edit. Tradeoff: a new owner still edits both binaries. Keep alternative: two short lists whose constants are already shared.
- Preserve: return type and the worker/api difference. Whether order matters to `install` is unverified, so keep current order.
- Affected files: both `boot.rs` files; `http`/`db`/`grpc` owners still needed.

`wait_for_signal` is also copied, but the lifecycle decision deliberately keeps it separate; not a candidate.
