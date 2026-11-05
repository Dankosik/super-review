## Task result: CT05

- Snapshot: static packet `packet-CT05.json`, whole-assignment view; no commit identity. MSRV 1.90, edition 2024.
- Instructions: content identity unverified.
- Assignment: control-flow; profiles none; scope `api/src/drain.rs`; no team override.
- Status: `completed`
- Inspected evidence: `drained`, `RECONNECT_BACKOFF`, `reconnect`, `Cargo.toml`. The packet shows no callers or declarations of `Listener` or `Client`.
- Coverage: base lens complete; no missing required evidence.
- New applicability signals: none.

## C-CT05-1: One-value branch repeated in both outcome arms

- Change anchor: `api/src/drain.rs`, `drained`, both `if name == "grpc"` blocks.
- Basis: `rust.flow.show-main-path`.
- Observation: The real decision is drained or timed out. `name` only selects a log string, so the same test appears in each arm. Any new special listener means editing both arms. Other names are dropped from the logs.
- Remedy: Use one event per outcome and carry the name as a field:
  `Ok(()) => tracing::info!(listener = name, "drain_completed"),`
  `Err(_) => tracing::warn!(listener = name, "drain_timed_out"),`
  Tradeoff: grpc events lose their distinct names and all events gain a field. Keep the current form only if those names are a required contract; the packet shows none.
- Preserve: outcome log levels and the `drain` call. Known: no dashboard or test in the snapshot references the names. Unverified: log consumers outside the snapshot.
- Affected files: `api/src/drain.rs`; no others known.

`reconnect` was considered and not reported: its comment ties the sleep to the broker's leader election, an external condition, and the loop's exit is clear.
