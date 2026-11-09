<!-- model: claude-sonnet-5-5 (requested native alias `sonnet`); arm: candidate (working tree); input: RD65; tool: native Claude Code subagent, fresh context; the scratchpad prefix is shortened to `.../scratchpad` -->
## Task result: RD65

- Snapshot: local packet, whole supplied source (no diff, no base revision). Location is `.../scratchpad/packets/RD65`. Files are `Cargo.toml` and `src/lib.rs`. No commit or blob identities were supplied.
- Instructions: `content identity unverified`. Resources were read from the installed root `.../scratchpad/candidate/skills/super-review`.
- Assignment: lens `rationale` (Rust), selected profiles none, scope all production declarations in `src/lib.rs`, team policy none. Rule in play: `rust.rationale.explain-constraints`.
- Status: completed
- Inspected evidence:
  - `Cargo.toml`: edition 2021, `rust-version = "1.85"`, `clippy::pedantic` at warn.
  - `src/lib.rs` in full: `frame`, `bucket`, `checksum`, `legacy_checksum`.
  - Packet context facts: `frame`, `bucket` and `checksum` are called from sibling modules not shown. No call to `legacy_checksum` exists in the snapshot, in any target or feature. `frame`'s parameters are the seven wire header fields in wire order, then the payload. `bucket`'s remainder is always below `buckets`.
  - No test-only items or generated files were present.
- Coverage: the base rationale question is completed for all four declarations. No profiles were selected. No source evidence is missing. `#[expect(.., reason = ..)]` is available at MSRV 1.85.
- New applicability signals: none

## C-RD65-1: `legacy_checksum` is dead code kept alive by `#[allow(dead_code)]`

- Change anchor: `src/lib.rs`, `legacy_checksum`, lines 33-36 (`#[allow(dead_code)] pub(crate) fn legacy_checksum`). This is whole-project scope, anchored directly in the snapshot.
- Basis: `rust.rationale.explain-constraints` (the dead-code suppression clause). Not convention-only.
- Observation: the function is `pub(crate)`, so only this crate can call it. The packet states that no call exists anywhere in the snapshot, in any target or feature. The suppression names no reason and no other target or `cfg` branch uses the function. A reader cannot tell a deliberate retention, such as a format still read elsewhere, from a forgotten leftover. The function also sits beside the live `checksum` with a different algorithm, so it looks like an alternative a reader must rule out.
- Remedy: remove `legacy_checksum` together with its `#[allow(dead_code)]`. Since the crate's complete uses settle this, no external consumer needs checking. If the algorithm must be kept for a future or out-of-tree reason, state that reason, and then `legacy_checksum` is no longer a deletion candidate.
- Preserve: no call sites exist, so no behavior changes. `checksum` is untouched. The packet has no external Rust API commitment.
- Affected files: `src/lib.rs`. Sibling modules were not shown, but the context states the snapshot search found no call.

## C-RD65-2: `#[allow(clippy::cast_possible_truncation)]` on `bucket` hides the invariant that makes the cast safe

- Change anchor: `src/lib.rs`, `bucket`, lines 24-27 (`(hash % u64::from(buckets)) as u32`).
- Basis: `rust.rationale.explain-constraints` (lint suppression states an exception, not its reason).
- Observation: the bare allow does not say why the `as u32` cannot lose bits. The reason is the remainder invariant: `hash % u64::from(buckets)` is always below `buckets`, which is a `u32`. A reader sees only a silenced warning and must derive this. The invariant is also not visible to the type system.
- Remedy: with `rust-version = "1.85"`, replace the attribute with `#[expect(clippy::cast_possible_truncation, reason = "the remainder is below `buckets`, a u32")]`. The expectation is fulfilled while pedantic is enabled. It will report if the suppression stops applying, for example if the lint is no longer enabled or the cast is removed.
- Preserve: behavior is unchanged. This is an attribute change only.
- Affected files: `src/lib.rs`

## C-RD65-3: `#[allow(clippy::too_many_arguments)]` on `frame` states no reason

- Change anchor: `src/lib.rs`, `frame`, lines 1-11, the allow plus the eight-parameter signature.
- Basis: `rust.rationale.explain-constraints` (lint suppression).
- Observation: the allow marks `frame` as an exception but does not say whether the long parameter list is deliberate. The reason is recoverable from context: the first seven parameters are the wire frame's header fields in wire order, followed by the payload. The body writes them in that same order. Without that, the signature reads as accidental complexity. It also invites reordering, and several adjacent same-typed parameters (`version`, `kind`, `flags`; `stream`, `sequence`, `checksum`) are interchangeable to the compiler.
- Remedy: use `#[expect(clippy::too_many_arguments, reason = "parameters mirror the wire header fields in wire order, then the payload")]`, supported at MSRV 1.85. Whether to group the fields into a header type is a representation or api-clarity decision outside this lens and is not recommended here.
- Preserve: `frame` is `pub(crate)` and called from sibling modules. A signature change would affect those callers, which were not shown. The attribute change does not.
- Affected files: `src/lib.rs`. Sibling callers are not inspected, and the attribute change does not need them.
