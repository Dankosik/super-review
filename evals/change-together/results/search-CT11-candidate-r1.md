<!-- model: claude-sonnet-5-5; native Claude Code subagent, fresh context; 2026-11-09 -->
## Task result: CT11

- Snapshot: Local snapshot from the packet, with no base revision and no diff. Whole-project view of the supplied files `Cargo.toml`, `api/src/limits.rs` and `worker/src/ingest.rs`.
- Instructions: content identity unverified. I read the contract, Rust context, duplication lens and finding template from the installed package root.
- Assignment: lens `duplication`, no profiles. Scope is `api/src/limits.rs`, with partner search across the whole snapshot. Rule is `rust.duplication.share-knowledge`. No team override applies.
- Status: completed
- Inspected evidence:
  - `Cargo.toml`: edition 2024, rust-version 1.90, so no MSRV constraint on a shared constant.
  - `api/src/limits.rs`: the full file, containing `MAX_UPLOAD_BYTES`.
  - `worker/src/ingest.rs`: the full file, containing `admit` and `IngestError`.
- Coverage:
  - Decision searched: the upload size limit. Keys were `8 * 1024 * 1024`, `8_388_608`, `8 MiB`, `MAX_UPLOAD_BYTES`, `body.len() >`, and the `TooLarge` error.
  - Matches read: the API constant, and the worker's literal `8_388_608` in `admit`.
  - No other decisions exist in the assigned file.
  - No configuration, schema or chart files are in the snapshot.
  - The snapshot has no manifests for the `api` and `worker` crates. I could not check the dependency direction between them, which limits the remedy below.
- New applicability signals: none

## C-CT11-1: Worker repeats the API upload limit as a bare literal

- Change anchor: `api/src/limits.rs`, `MAX_UPLOAD_BYTES = 8 * 1024 * 1024` (whole-project snapshot). The partner is `worker/src/ingest.rs`, `admit`, which contains `if body.len() > 8_388_608`.
- Basis: `rust.duplication.share-knowledge`. This is a literal copy of a constant in another spelling.
- Observation:
  - `8 * 1024 * 1024` and `8_388_608` are the same value, 8 MiB.
  - The context says the worker ingests the same uploads after the API accepts them, and the product documents one upload limit.
  - The worker's literal carries no name, so a search for `MAX_UPLOAD_BYTES` does not reach it.
  - If the limit changes in `limits.rs`, the worker keeps the old value with no compile error. Larger uploads would then pass the API and fail at ingest with `TooLarge`. A smaller limit would let oversized bodies through the worker.
  - Nothing in the code states that the two numbers must agree.
- Remedy: Have `admit` use the single constant instead of its own literal. Sketch: `if body.len() > MAX_UPLOAD_BYTES { return Err(IngestError::TooLarge); }`, with the constant imported from where the API crate exposes it. If the worker cannot depend on the API crate, move `MAX_UPLOAD_BYTES` to a small shared crate or module that both depend on. Where that module lives is unresolved, because the snapshot has no manifests for `api` or `worker`. The alternative is to keep both copies. That is defensible only if the worker's limit is a separate policy that happens to match today, and the context says otherwise.
- Preserve:
  - The comparison stays `>`, so a body of exactly the limit is still admitted.
  - The `IngestError::TooLarge` result is unchanged.
  - The constant stays a `usize`.
  - Unverified: whether `worker` may depend on `api`, and whether other consumers of `limits.rs` exist.
- Affected files: `api/src/limits.rs` and `worker/src/ingest.rs` (both inspected). The crate manifests and the API's own enforcement site are not in the snapshot and are still needed for the dependency decision.
