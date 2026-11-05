## Task result: CT03

- Snapshot: static packet-CT03.json, whole-file view; no commit identity.
- Instructions: content identity unverified.
- Assignment: duplication; profiles none; scope `worker/src/boot.rs`; no team override.
- Status: completed.
- Inspected evidence: both `boot.rs` files, `telemetry::install`, `DEFAULT_BUCKETS`, `docs/lifecycle.md`, `Cargo.toml`.
- Coverage: base lens complete. `wait_for_signal` is identical but kept: `docs/lifecycle.md` keeps signal handling per binary, and no shared behavior change is shown.
- New applicability signals: error handling, `wait_for_signal`: `unwrap_or_else(|_| exit(1))` discards the cause; intent unexamined.

## C-CT03-1: Shared metric/bucket pairs are hand-copied per binary

- Change anchor: `worker/src/boot.rs`, `histograms`, lines 1-6; whole-project scope.
- Basis: rust.duplication.share-knowledge.
- Observation: The HTTP and DB pairs repeat verbatim in `api/src/boot.rs`, which only adds gRPC. They encode one decision: which shared metrics get custom buckets. Adding one means editing both lists, and `install` renders an omitted name with `DEFAULT_BUCKETS`, with no visible cue.
- Remedy: Define the two pairs once as a slice. Worker passes it directly; api appends its gRPC pair. Tradeoff: one more shared item. Keep alternative: two short, readable lists. Placement unresolved: `http`/`db` declarations and crate dependency direction are absent, so `telemetry` may not be able to name them.
- Preserve: pair order, `'static` slices, api's gRPC entry staying api-only. Effect of order inside `install` is unverified (body elided).
- Affected files: `worker/src/boot.rs`, `api/src/boot.rs`; still needed: `http`, `db` manifests.
