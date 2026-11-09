<!-- model: claude-sonnet-5-5; native Claude Code subagent, fresh context; 2026-11-09 -->
## Task result: CT11

- Snapshot: local fixture snapshot from the packet (CT11.json), whole-project scope; no B/H/D.
- Instructions: super-review references (review-contract, rust language note, rust duplication lens, finding template); content identity unverified.
- Assignment: lens duplication, rule rust.duplication.share-knowledge, no profiles. Scope is api/src/limits.rs, with partners searched across the whole snapshot. No team override.
- Status: completed
- Inspected evidence: Cargo.toml (edition 2024, rust-version 1.90), api/src/limits.rs (full), worker/src/ingest.rs (full). Searched the snapshot for the limit's value and name in decimal and `8 * 1024 * 1024` forms. The only matches are the two sites below.
- Coverage: the single declaration `MAX_UPLOAD_BYTES` and its one partner `admit` were read completely. There are no other declarations in scope. Nothing is missing. The crates have no manifests of their own in the snapshot (only the root `Cargo.toml`), so the dependency direction between `worker` and `api` is not established.
- New applicability signals: none

## C-CT11-1: The single product upload limit is written twice, once as a named constant and once as a bare literal

- Change anchor: whole-project snapshot.
  - `api/src/limits.rs`, `MAX_UPLOAD_BYTES`: `pub const MAX_UPLOAD_BYTES: usize = 8 * 1024 * 1024;`, which is 8,388,608.
  - `worker/src/ingest.rs`, `admit`: `if body.len() > 8_388_608 {`.
  - The same number appears in two forms, with no reference between them.
- Basis: rust.duplication.share-knowledge. This is repeated domain knowledge, not coincidental similarity.
- Observation:
  - The context states that the worker ingests the same uploads the API has accepted, and that the product documents one upload limit.
  - Both sites therefore encode that one decision: the largest body size. The worker's literal is the API constant spelled out in a different notation, and the doc comment ("Largest upload the public API accepts") names the concept at only one of the two sites.
  - The copies are not tied together by the compiler. Nothing makes the worker fail to build if the API constant changes. The literal also does not look like the constant, so a search for `MAX_UPLOAD_BYTES` will not find it.
  - A coordinated edit is therefore needed when the limit changes: update the constant and also locate and update the worker literal. If one is missed, the API would accept uploads that the worker rejects as `TooLarge`, or the reverse.
  - The worker's literal also carries no name, so a reader of `admit` cannot tell that 8,388,608 is the product upload limit.
- Remedy: make the worker check use the one constant.
  - Sketch: `if body.len() > api::limits::MAX_UPLOAD_BYTES { return Err(IngestError::TooLarge); }`.
  - If the worker should not depend on the `api` crate, put the constant in a small module that both crates already can depend on, and have `api/src/limits.rs` re-export or reference it.
  - The comparison and the `IngestError::TooLarge` mapping stay in the worker as they are. Only the number's source changes.
  - Remaining tradeoff: a shared owner adds a dependency edge or a shared module. A worker-to-api edge may be unwanted, and the snapshot does not show the crate layout.
  - Keep alternative: the worker could keep its own value if it is meant to have an independent, possibly different threshold. The context says there is one documented limit, which argues against that. If the worker's value is intentionally independent, it should at least be named and documented as such.
- Preserve:
  - `admit` keeps the same comparison (`>`, so a body exactly at the limit is admitted), the same `TooLarge` error and the same signature.
  - The value stays 8,388,608, because `8 * 1024 * 1024` equals 8,388,608.
  - Verified: the arithmetic and the existing comparison semantics.
  - Unverified: crate or workspace layout and whether the worker may depend on `api`.
- Affected files: `api/src/limits.rs` and `worker/src/ingest.rs`, both inspected. Per-crate manifests for the dependency direction are not in the snapshot and are still needed.
