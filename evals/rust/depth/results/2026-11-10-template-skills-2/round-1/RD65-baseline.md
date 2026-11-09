<!-- model: claude-sonnet-5-5 (requested native alias `sonnet`); arm: baseline fffcf9d; input: RD65; tool: native Claude Code subagent, fresh context; the scratchpad prefix is shortened to `.../scratchpad` -->
## Task result: RD65

- Snapshot: local packet, whole supplied source (no diff, no base revision). Location: `.../scratchpad/packets/RD65` (`Cargo.toml`, `src/lib.rs`). No commit or hash identity was supplied.
- Instructions: content identity unverified.
- Assignment: lens `rationale` (rule `rust.rationale.explain-constraints`). Selected profiles: none. Scope: all production declarations in `src/lib.rs`, a private, unreleased module. No team policy. Baseline: edition 2021, `rust-version = "1.85"`, clippy pedantic at warn.
- Status: completed
- Inspected evidence: `Cargo.toml` and all of `src/lib.rs`: `HEADER_LEN`, `frame`, `bucket`, `checksum`, `legacy_checksum`. Context facts from PACKET.md: sibling modules call `frame`, `bucket` and `checksum`, and no call to `legacy_checksum` exists in the snapshot. No excluded items (no tests or generated code).
- Coverage: base rationale pass complete over every declaration. No profiles selected. Missing evidence: the reason `legacy_checksum` is retained, which is unrecoverable from the packet and is stated in C-RD65-3. Nothing else is missing.
- New applicability signals: none

## C-RD65-1: `bucket`'s truncating cast is allowed, but the invariant that makes it safe is stated nowhere

- Change anchor: `src/lib.rs`, `bucket`, lines 26-29: `#[allow(clippy::cast_possible_truncation)]` above `(hash % u64::from(buckets)) as u32`.
- Basis: `rust.rationale.explain-constraints`.
- Observation: the allow silences a pedantic lint. Nothing in the code or its surroundings says why the cast is acceptable. The reason is that the remainder is always below `buckets`, which is a `u32`. The packet context confirms this, but a maintainer would have to rederive it. Without the reason, they cannot tell whether the allow is deliberate or leftover noise. They also cannot safely change `buckets` to a wider type or reuse the cast pattern. The invariant crosses a type boundary (`u64` remainder, `u32` result) that the code does not enforce.
- Remedy: record the reason on the lint suppression itself. Rust 1.85 supports `#[expect(clippy::cast_possible_truncation, reason = "hash % buckets < buckets, which fits in u32")]`, and `expect` also flags the suppression once it becomes unnecessary. A short comment is the keep alternative. Alternatively, remove the suppression by using `u32::try_from(...)` with an explicit failure path. That adds an error or panic path, so it is a tradeoff and not clearly better.
- Preserve: the return value, signature and `buckets > 0` behavior are unchanged by a reason-only edit. Whether `buckets == 0` is possible is not established in the packet and is not part of this lens.
- Affected files: `src/lib.rs` only. Sibling callers were not inspected and are not needed for this remedy.

## C-RD65-2: `frame`'s `too_many_arguments` allow does not record that the eight parameters mirror the wire header

- Change anchor: `src/lib.rs`, `frame`, lines 3-13: `#[allow(clippy::too_many_arguments)]` and the parameters `version, kind, flags, stream, sequence, window, checksum, payload`.
- Basis: `rust.rationale.explain-constraints`.
- Observation: the suppression hides a lint that usually signals accidental complexity. The deliberate reason is that the parameters are the eight fields of the wire header in order, and the body writes them in that same order. A reader cannot tell this is a constraint rather than an unrefactored signature. They also cannot tell that a reordering or insertion must match the wire format. The same-typed adjacent parameters (`stream` and `sequence` are both `u32`, `checksum` is also `u32`) make that ordering obligation more important to state. `HEADER_LEN` (17) also depends on the field widths written in the body: 3 + 4 + 4 + 2 + 4. That coupling is likewise implicit, but it is a minor addition to this same observation.
- Remedy: add a reason to the suppression, for example `#[expect(clippy::too_many_arguments, reason = "parameters are the wire frame header fields, in wire order")]`, or an equivalent doc line. Introducing a header struct is a separate, unresolved structural decision: it would be a different lens question (representation or api-clarity), and the sibling call sites were not inspected.
- Preserve: the public contract is the private `pub(crate)` signature. Sibling callers exist but are not shown, so any signature change is unverified.
- Affected files: `src/lib.rs`. Sibling callers are needed only for the structural alternative, not for the annotation.

## C-RD65-3: `legacy_checksum` is retained behind `#[allow(dead_code)]` with no recorded reason

- Change anchor: `src/lib.rs`, `legacy_checksum`, lines 35-38: `#[allow(dead_code)]` above `pub(crate) fn legacy_checksum`.
- Basis: `rust.rationale.explain-constraints`.
- Observation: a search of the snapshot finds no call in any target or feature. The suppression hides the compiler's signal that the function is unused. Nothing says why it stays. Possible reasons include a compatibility path for old peers, a planned migration, and abandoned code. The packet does not say which applies. Beside `checksum`, which uses a different algorithm (multiply by 31 and add), a reader cannot tell which function is authoritative, or whether the two are meant to coexist for different wire versions. This is a real reading and maintenance cost. A reader must decide whether to maintain, port or delete the function without the information that the author held.
- Remedy: unresolved. The missing fact is why the function is kept and who may depend on it, such as an out-of-snapshot consumer or a planned use. If it is intentionally retained, state that reason and the condition for removal beside the allow, and use `#[expect(dead_code, reason = ...)]`. If no such reason exists, deleting it removes the suppression and the ambiguity. The packet supports neither choice, and absence from the search does not prove there are no downstream consumers.
- Preserve: the wire and checksum behavior of `checksum` must stay unchanged. Whether anything outside the snapshot consumes `legacy_checksum` is unverified.
- Affected files: `src/lib.rs`. The owner's intent and any external consumer remain still needed.
