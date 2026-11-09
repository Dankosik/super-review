<!-- model: claude-sonnet-5-5; native Claude Code subagent, fresh context; 2026-11-09 -->
## Task result: CT14

- Snapshot: local fixture snapshot from the packet (no base revision, no diff). Whole-file scope, anchored directly in the snapshot at `notify/src/channel.rs`. Edition 2024, rust-version 1.90.
- Instructions: super-review specialist, duplication lens (`rust.duplication.share-knowledge`). Content identity unverified.
- Assignment: duplication lens, no profiles, scope `notify/src/channel.rs`. No team overrides.
- Status: completed
- Inspected evidence: the whole of `notify/src/channel.rs` (`Channel`, `Channel::ALL`, `Channel::as_str`, `UnknownChannel`, `impl FromStr for Channel`) and `Cargo.toml`. The packet's `files` hold no other source, so no other file could be searched. The context states that a unit test asserts `ALL` lists every variant. That test is excluded as test source.
- Coverage:
  - Decision 1: the variant-to-wire-name mapping (`"email"`, `"sms"`, `"push"`). Keys searched: those three literals, `as_str`, `from_str`, `Channel::`. Matches read: the forward `match` in `as_str`, and the reverse `FromStr`. The reverse is derived from `as_str` by a search over `ALL`, so it holds no literals of its own. The reverse table ends in no `_` arm, so there is no unconnected reverse table. No other spelling of the names exists in the snapshot.
  - Decision 2: the variant set. Keys searched: `Email`, `Sms`, `Push`, `ALL`. Matches read: the enum, `ALL`, and the `as_str` match arms. The enum and `ALL` are not connected by the compiler. The context states a unit test guards `ALL`. The `as_str` match is exhaustive, so a new variant fails to compile there.
  - Decision 3: the parse and render inverse relationship. `FromStr` reuses `as_str` through `ALL`, so no second literal table exists and no coordinated edit remains.
  - Handwritten mechanics: the `find` over `ALL` is a small linear lookup over three values. It is not a general mechanism that a `std` or declared-dependency helper owns.
  - Missing evidence: none for this file. Partners elsewhere in the repository, such as DB schema, client contracts and other `Channel` users, are not in the snapshot. Nothing in the packet points to one.
- New applicability signals: none.

No candidates. The wire names live once, in `as_str`, and `FromStr` derives from it. The remaining `ALL` and enum pairing costs one extra edit when a variant is added, and a test already covers it. Retaining it is valid.
