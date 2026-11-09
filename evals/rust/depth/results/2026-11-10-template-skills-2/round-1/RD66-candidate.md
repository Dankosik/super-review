<!-- model: claude-sonnet-5-5 (requested native alias `sonnet`); arm: candidate (working tree); input: RD66; tool: native Claude Code subagent, fresh context; the scratchpad prefix is shortened to `.../scratchpad` -->
## Task result: RD66

- Snapshot: local packet, whole supplied source (no diff/base); location .../scratchpad/packets/RD66 (Cargo.toml, src/lib.rs); no commit/hash exposed.
- Instructions: content identity unverified (installed skill resources read from supplied root).
- Assignment: lens rationale (Rust; rust.rationale.explain-constraints); selected profiles: none; scope: all production declarations in src/lib.rs (HEADER_LEN, frame, bucket, checksum); private unreleased module; no team policy.
- Status: completed
- Inspected evidence: Cargo.toml (edition 2021, rust-version 1.75, clippy pedantic warn); src/lib.rs in full (35 lines), all declarations and comments; context fact that frame/bucket/checksum have unseen sibling callers. No test items, generated source or unsafe present.
- Coverage: base rationale pass complete for every declaration; no profiles selected. Missing evidence: sibling callers (not material to these observations).
- New applicability signals: none

## C-RD66-1: The comment on `frame` miscounts the header fields it uses to justify `too_many_arguments`

- Change anchor: src/lib.rs, `frame`, whole-project snapshot; span `// The parameters are the eight fields of the wire frame header, in wire order.` above `#[allow(clippy::too_many_arguments)]`.
- Basis: rust.rationale.explain-constraints (the comment records a reason and is worth keeping; the issue is its accuracy, not its removal).
- Observation: The comment explains why the argument-count suppression is deliberate. The body shows seven header fields (version, kind, flags, stream, sequence, window, checksum; 1+1+1+4+4+2+4 = 17 bytes, matching HEADER_LEN). The eighth parameter is `payload`, which is not a header field. A reader verifying the stated reason against the signature finds a mismatch, which undermines trust in the constraint, and a future header-field change starts from the wrong count.
- Remedy: reword to say seven parameters are the header fields in wire order and `payload` follows; the reason for the suppression stays.
- Preserve: signature, wire order and the allow attribute are unchanged; only comment text changes.
- Affected files: src/lib.rs only (callers not needed).

## C-RD66-2: `HEADER_LEN = 17` repeats the header layout with no link to the fields it counts

- Change anchor: src/lib.rs, `HEADER_LEN` (`const HEADER_LEN: usize = 17;`) and its use in `frame` (`Vec::with_capacity(HEADER_LEN + payload.len())`).
- Basis: rust.rationale.explain-constraints (the reason is recoverable from the body only by summing the pushed field widths).
- Observation: 17 is the sum of the field widths written in `frame`, but nothing states that. Adding or resizing a header field means editing both the push/extend lines and this constant, an unrecorded coordination obligation (here only a capacity hint). Small clarity cost. If a sibling module also reads the header at offset 17, caller context is not visible.
- Remedy: add a one-line note or derive the value from the field widths (for example `1 + 1 + 1 + 4 + 4 + 2 + 4` with named terms, or size_of sums) so the layout knowledge sits next to the constant and shows what 17 means.
- Preserve: capacity behavior and output bytes unchanged; whether HEADER_LEN is used elsewhere in the module is unverified, since only src/lib.rs is supplied.
- Affected files: src/lib.rs.

Kept as is: the `bucket` comment ("remainder is below `buckets`, so it always fits in u32") records a real invariant justifying `cast_possible_truncation`; `checksum` has no non-obvious constraint to explain, so no candidate.
