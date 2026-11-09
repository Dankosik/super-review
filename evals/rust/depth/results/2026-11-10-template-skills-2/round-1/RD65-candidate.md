<!-- model: claude-sonnet-5-5 (requested native alias `sonnet`); arm: candidate (working tree); input: RD65; tool: native Claude Code subagent, fresh context; the scratchpad prefix is shortened to `.../scratchpad` -->
## Task result: RD65

- Snapshot: local packet, whole supplied source (no diff, no base revision). Source location is `.../scratchpad/packets/RD65`, files `Cargo.toml` and `src/lib.rs`. No commit or blob identity was supplied.
- Instructions: `content identity unverified`. I read the installed resources under `.../candidate/skills/super-review`: `references/review-contract.md`, `references/languages.md`, `references/languages/rust.md`, `references/lenses/rust/rationale.md` and `assets/finding-template.md`.
- Assignment: lens rationale, rule `rust.rationale.explain-constraints`. Selected profiles: none. Scope: all production declarations and uses in a private, unreleased module. Edition 2021, MSRV 1.85. Team policy: none.
- Status: completed
- Inspected evidence: all of `src/lib.rs` (`HEADER_LEN`, `frame`, `bucket`, `checksum`, `legacy_checksum`) and `Cargo.toml` (edition 2021, `rust-version` 1.85, `clippy::pedantic` at warn). From the packet context facts I used the call sites of `frame`, `bucket` and `checksum` in sibling modules (not shown), the absence of any `legacy_checksum` call in any target or feature, and the stated `bucket` remainder bound.
- Coverage: the base rationale question is complete for all five declarations. Not inspected: the sibling-module callers of `frame`, `bucket` and `checksum`, and any wire-format spec. `checksum`'s algorithm (multiply by 31, wrapping add) has no recoverable reason in the supplied source. I found no supported constraint to report there, so it stays an evidence gap and not a candidate.
- New applicability signals: none

## C-RD65-1: `legacy_checksum` carries `#[allow(dead_code)]` with no user and no recorded reason

- Change anchor: `src/lib.rs`, `legacy_checksum`, `#[allow(dead_code)] pub(crate) fn legacy_checksum(...)` (lines 35-38). Whole-project snapshot.
- Basis: `rust.rationale.explain-constraints`, the `dead_code` paragraph. This is not convention-only.
- Observation: The item is `pub(crate)`, so only this crate can use it. The packet's search of the snapshot, across all targets and features, finds no call. The suppression hides the compiler's unused report without saying why the function stays. A maintainer cannot tell whether it is a deliberate retention or leftover code. It also sits beside the live `checksum`, which invites a wrong guess about which algorithm is current.
- Remedy: Remove `legacy_checksum` together with its `#[allow(dead_code)]`. The rule's keep case, a user under another target, feature or `cfg` branch, has no support in the packet. If a user outside the snapshot exists, keep the item and state which one in a comment.
- Preserve: No live caller exists in the snapshot, so `frame`, `bucket` and `checksum` are unaffected. It is `pub(crate)`, so the crate snapshot settles consumers. Not verified: any non-source use, such as an external tool or documentation that mentions the legacy algorithm.
- Affected files: `src/lib.rs`. Sibling modules were not shown, but the packet states they do not call it.

## C-RD65-2: The `bucket` cast suppression hides the invariant that makes the truncation safe

- Change anchor: `src/lib.rs`, `bucket`, `#[allow(clippy::cast_possible_truncation)]` and `(hash % u64::from(buckets)) as u32` (lines 26-29).
- Basis: `rust.rationale.explain-constraints`, which covers a caller obligation or invariant the code cannot enforce.
- Observation: The `as u32` on a `u64` is silenced, and nothing in the source says why that is acceptable. The reason is that the remainder of `hash % u64::from(buckets)` is always below `buckets`, which is a `u32`, so no truncation occurs. The packet confirms the bound. A reader sees a lint suppression on a narrowing cast and has to re-derive the argument, or distrust it. The suppression also has no record of whether it is deliberate.
- Remedy: Add a one-line comment at the allow or the cast stating the invariant, for example that the remainder is less than `buckets: u32`. A zero `buckets` would divide by zero, which is a separate correctness question outside this lens. Both a comment and a `u32::try_from(...)` expression are supported. The comment keeps the cast as is. The `try_from` form would need its own failure handling, so I leave that choice to the parent.
- Preserve: Return type, modulo semantics and the value of the result. Verified from the source and the packet fact: the remainder is below `buckets`.
- Affected files: `src/lib.rs`.

## C-RD65-3: `frame` suppresses `too_many_arguments` without recording that parameter order is the wire layout

- Change anchor: `src/lib.rs`, `frame`, `#[allow(clippy::too_many_arguments)]` and the signature (lines 3-24), plus `HEADER_LEN` (line 1).
- Basis: `rust.rationale.explain-constraints`. Rustdoc contracts and invariants spanning items that the code cannot enforce are covered.
- Observation: The eight-parameter signature is the clippy case the allow silences. The source records neither why the arguments are not grouped nor what the order means. The packet says the parameters follow the wire frame header in order. The body confirms this: it writes each field's big-endian bytes in parameter order. Calls with several adjacent same-typed integers (`stream` and `sequence`, both `u32`) depend on that order. `HEADER_LEN = 17` is the sum 1+1+1+4+4+2+4 and ties to the same layout, but this is not stated. The packet describes eight header fields. The source shows seven header fields plus `payload`, so that wording should not be copied into any comment.
- Remedy: Add a doc comment on `frame` that names the layout (offsets and widths, big-endian, in parameter order) and gives it as the reason for the suppression. Tie `HEADER_LEN` to the same description. A header struct with named fields is another way to make the contract explicit. It changes the call sites in sibling modules, so it belongs to the abstractions or api-clarity lenses, and I leave it unresolved here.
- Preserve: Byte output and the call contract. The sibling-module callers were not inspected, and no wire specification was supplied.
- Affected files: `src/lib.rs`. The sibling callers in modules not shown would be needed to judge the struct alternative.
