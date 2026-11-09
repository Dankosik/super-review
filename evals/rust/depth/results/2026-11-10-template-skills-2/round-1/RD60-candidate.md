<!-- model: claude-sonnet-5-5 (requested native alias `sonnet`); arm: candidate (working tree); input: RD60; tool: native Claude Code subagent, fresh context; the scratchpad prefix is shortened to `.../scratchpad` -->
## Task result: RD60

- Snapshot: whole supplied source, no diff or base revision. Location is the packet directory `.../scratchpad/packets/RD60`. Endpoint hashes and commit identity were not provided.
- Instructions: `content identity unverified`. I read the installed resources at `.../scratchpad/candidate/skills/super-review`.
- Assignment: lens `representation` (`rust.representation.express-concepts`), selected profiles none, no team policy. Scope is all supplied production source (`Cargo.toml`, `src/lib.rs`) in a private service crate. The published configuration format (`timeout_ms`, `interval_secs`) stays supported.
- Status: completed
- Inspected evidence:
  - `Cargo.toml`: edition 2021, rust-version 1.85, serde 1.0 with `derive`.
  - `src/lib.rs`, read in full: `ProbeSettings`, `ProbePlan`, `impl From<ProbeSettings> for ProbePlan`, `probe_order`.
  - The packet context facts. There are no tests, generated files or `cfg` branches to exclude.
- Coverage: the base representation question was completed over all declarations and the one transition, settings to plan. No profiles were selected. I did not read the Serde note. The only wire-shape signal is the derived `ProbeSettings`, and I do not propose changing it.
- New applicability signals: none.

No candidates.

- **Wire versus domain representation:** `ProbeSettings` is a DTO that keeps the documented unit-suffixed keys. `ProbePlan` holds typed `Duration` values, and the rest of the crate uses it. `From` is the only place that knows the unit conversions, so readers do not have to track "this u64 is ms, that one is secs" by position. A newtype or a rename would only duplicate that knowledge, or put the published format at risk.
- **`regions: Vec<String>`:** the context facts say duplicates are meaningful (probe a region twice per cycle) and order is meaningful. A `Vec` already states both. A set or an ordered-unique type would change behavior.
- **`probe_order`:** it only returns the slice and gives the ordering contract a name. It is a pass-through over a public field, which is an API-surface question and not a representation burden, so I did not raise it under this lens.
