<!-- model: claude-sonnet-5-5; native Claude Code subagent, fresh context; 2026-11-09 -->
## Task result: CT12

- Snapshot: local fixture snapshot (no base revision, no `change`); files `Cargo.toml`, `api/src/limits.rs`, `metrics/src/batch.rs` from the packet.
- Instructions: content identity unverified.
- Assignment: lens duplication (`rust.duplication.share-knowledge`), no profiles; scope `api/src/limits.rs`; no team override.
- Status: completed
- Inspected evidence: `api/src/limits.rs` (`MAX_UPLOAD_BYTES`), `metrics/src/batch.rs` (`Batch::new`), `Cargo.toml` (edition 2024, rust-version 1.90), and the packet context.
- Coverage: the assigned file declares one decision, the upload limit `MAX_UPLOAD_BYTES = 8 * 1024 * 1024` (8 MiB, 8_388_608 bytes). I searched the whole snapshot for the value in other spellings (`8 * 1024 * 1024`, `8_388_608`, `8388608`, `8 MiB`, `1 << 23`) and for the identifier `MAX_UPLOAD_BYTES` and upload-related names. The only other match is `Vec::with_capacity(8_388_608)` in `metrics/src/batch.rs`. The packet context states that this buffer size comes from exporter throughput measurements and is unrelated to uploads. The two values are equal by coincidence and serve different concepts, so sharing one constant would couple unrelated decisions. No sibling functions, mappings, or reverse tables exist in the snapshot. No handwritten general mechanism is present. Nothing is missing.
- New applicability signals: none.

No candidates. The matching 8_388_608 in `metrics/src/batch.rs` is not repeated knowledge and should stay separate.
