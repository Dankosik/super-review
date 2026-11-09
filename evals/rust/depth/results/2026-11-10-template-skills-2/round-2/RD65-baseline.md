<!-- model: claude-sonnet-5-5 (requested native alias `sonnet`); arm: baseline fffcf9d; input: RD65; tool: native Claude Code subagent, fresh context; the scratchpad prefix is shortened to `.../scratchpad` -->
## Task result: RD65

- Snapshot: local packet snapshot, whole supplied source (no diff, no base revision); .../scratchpad/packets/RD65 (Cargo.toml, src/lib.rs). Endpoint hashes were not exposed.
- Instructions: content identity unverified. Installed resource root is .../scratchpad/baseline/skills/super-review.
- Assignment: lens rationale (rust.rationale.explain-constraints). Selected profiles: none. Scope: all production declarations in src/lib.rs (frame, bucket, checksum, legacy_checksum) of a private, unreleased crate. Team policy: none. Baseline: edition 2021, rust-version 1.85, clippy pedantic = warn.
- Status: completed
- Inspected evidence: Cargo.toml and all of src/lib.rs. Context facts from PACKET.md: frame, bucket and checksum have sibling-module callers that were not shown; no call to legacy_checksum exists in any target or feature; frame's parameters are the seven wire header fields in wire order, then the payload; bucket's remainder is always below buckets. The sibling callers were not inspected.
- Coverage: the base rationale question was completed for every declaration. No profile was selected. Missing evidence is limited to the sibling callers and the reason legacy_checksum is kept. Neither gap blocks the candidates below.
- New applicability signals: none.

## C-RD65-1: bucket's truncation allow does not record the invariant that makes the cast safe

- Change anchor: src/lib.rs, `bucket`. The span is `#[allow(clippy::cast_possible_truncation)]` above `(hash % u64::from(buckets)) as u32`. This is a whole-source anchor.
- Basis: rust.rationale.explain-constraints.
- Observation: the cast is only lossless because the remainder is always below `buckets`, which is a u32. Per the context facts, this holds for every caller. Neither the code nor the attribute states it. A reader of the bare lint suppression cannot tell a justified narrowing from a silenced warning. The reason depends on callers that are not visible here, so it is an invariant spanning items that the code cannot enforce.
- Remedy: record the reason where the suppression lives. `#[expect(clippy::cast_possible_truncation, reason = "...")]` is available at the 1.85 MSRV (`expect` is stable since 1.81). The reason would say that `hash % buckets` is below `buckets: u32`. A plain comment is an equivalent alternative. Keeping the bare `allow` is the alternative, since the cast is short.
- Preserve: the u64 modulo and the u32 result are unchanged. Behaviour for `buckets == 0` is outside this lens.
- Affected files: src/lib.rs. Sibling callers are not inspected and are not needed for the remedy.

## C-RD65-2: legacy_checksum is unused and carries only a dead_code suppression

- Change anchor: src/lib.rs, `legacy_checksum`. The span is `#[allow(dead_code)]` above `pub(crate) fn legacy_checksum`.
- Basis: rust.rationale.explain-constraints.
- Observation: the snapshot has no caller in any target or feature, and the crate is private and unreleased. The `allow` hides the compiler's signal and gives no reason. The code cannot show whether this is a deliberate retention (for example reading old data, or a planned migration) or a leftover. A maintainer editing `checksum` cannot tell whether the two functions must stay related. Both are checksum variants and sit adjacent with no stated relationship.
- Remedy: unresolved. The missing fact is why the function is kept, which is an owner decision. If it is deliberate, a short comment or `reason` would name the consumer or the condition for removal. If not, the unused function and its suppression can be deleted. The intent cannot be recovered from the source.
- Preserve: nothing in the snapshot uses the function. Whether external or out-of-snapshot code relies on it is unverified, and the crate is unreleased.
- Affected files: src/lib.rs.

## C-RD65-3: frame's too_many_arguments allow does not say that the parameter order is the wire order

- Change anchor: src/lib.rs, `frame`. The span is `#[allow(clippy::too_many_arguments)]` above `pub(crate) fn frame(version, kind, flags, stream, sequence, window, checksum, payload)`.
- Basis: rust.rationale.explain-constraints.
- Observation: the parameters are the seven header fields in wire order, then the payload, and the body writes them in the same order. That correspondence is the reason for the long list, but it appears nowhere in the source. A reader cannot tell why the signature is long or that reordering a parameter would change the wire layout. The adjacent `checksum` parameter also does not say what it covers, which the code cannot show and which stays unverified. Only the wire-order fact is established.
- Remedy: add a short doc comment or a `reason` on the allow. It would say that parameters follow the wire header layout, with the payload last. That lets the long signature be read as deliberate. Whether to introduce a header struct instead is a separate design tradeoff for other lenses.
- Preserve: the byte layout and the big-endian encoding of each field stay unchanged.
- Affected files: src/lib.rs. Sibling callers are not inspected.
