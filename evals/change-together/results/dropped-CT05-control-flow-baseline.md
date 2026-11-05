## Task result: CT05

- Snapshot: static packet CT05, whole-file view; no commit identity.
- Instructions: `content identity unverified`.
- Assignment: control-flow; profiles: none; scope `api/src/drain.rs`; no team override.
- Status: `completed`.
- Inspected evidence: `drained`, `RECONNECT_BACKOFF`, `reconnect`, `Cargo.toml` (edition 2024, MSRV 1.90). No callers or `Listener`/`Client` declarations supplied.
- Coverage: base lens complete. `reconnect` retained: its loop and match clearly show the only exit and the retry.
- New applicability signals: none.

## C-CT05-1: `drained` repeats one listener-name test inside both outcome arms

- Change anchor: `api/src/drain.rs`, `drained`, lines 2-17, `if name == "grpc"` in both arms.
- Basis: `rust.flow.show-main-path`.
- Observation: The real decision is completed versus timed out, with level differing. The nested branches only vary the event name, so readers must evaluate four paths, and a new special-cased listener needs edits in both arms.
- Remedy: Remove the name branches and carry the name as a field: `Ok(()) => tracing::info!(listener = name, "drain_completed")`, `Err(_) => tracing::warn!(listener = name, "drain_timed_out")`. Tradeoff: events are renamed and gain a field. Keep alternative if exact names matter: a flat four-arm match on `(result, name == "grpc")`, which removes nesting but keeps the cross-product.
- Preserve: levels and single drain await. Known: no dashboard or test references these names in the snapshot. Unverified: external log consumers; the snapshot's private, unreleased scope records no commitment.
- Affected files: `api/src/drain.rs`; callers not supplied, and the signature is unchanged.
