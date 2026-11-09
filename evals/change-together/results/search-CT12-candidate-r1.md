<!-- model: claude-sonnet-5-5; native Claude Code subagent, fresh context; 2026-11-09 -->
## Task result: CT12

- Snapshot: local fixture snapshot (no base revision, no diff); files: `Cargo.toml`, `api/src/limits.rs`, `metrics/src/batch.rs`. Whole-project scope anchored in this snapshot.
- Instructions: super-review, `content identity unverified`.
- Assignment: lens `rust.duplication.share-knowledge`, no profiles; scope `api/src/limits.rs`; no team overrides.
- Status: completed
- Inspected evidence: `api/src/limits.rs` (`MAX_UPLOAD_BYTES`), `metrics/src/batch.rs` (`Batch::new`), `Cargo.toml` (edition 2024, rust-version 1.90).
- Coverage: the only decision the assigned code makes is the upload size limit of 8 MiB.
  - Keys searched across the whole snapshot: `8 * 1024 * 1024`, `8_388_608`, `8388608`, `0x800000`, `1 << 23`, `MAX_UPLOAD_BYTES`, and "8 MiB", "8 MB" and "upload".
  - Matches read: one other site, `Batch::new` in `metrics/src/batch.rs`. It uses `Vec::with_capacity(8_388_608)`, which is the same number in a different spelling.
  - Result: `Batch::new` is not a partner of the upload limit. Per the context fact, the exporter buffer size was chosen from throughput measurements and is unrelated to uploads. Changing one value would not require changing the other, and a shared constant would couple the two concepts. The numeric match is coincidental and is not a candidate.
  - No other repeated constants, mappings, validation rules, or handwritten general mechanisms exist in the snapshot.
  - No gaps.
- New applicability signals: none

No candidates.
