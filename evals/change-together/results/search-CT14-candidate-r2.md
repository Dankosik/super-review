<!-- model: claude-sonnet-5-5; native Claude Code subagent, fresh context; 2026-11-09 -->
## Task result: CT14

- Snapshot: local snapshot from packet CT14 (files `Cargo.toml`, `notify/src/channel.rs`). No base revision or diff, so this is a whole-area review. Edition 2024, rust-version 1.90.
- Instructions: super-review `references/review-contract.md`, `languages/rust.md`, `lenses/rust/duplication.md`, `assets/finding-template.md`. Content identity unverified.
- Assignment: duplication lens (`rust.duplication.share-knowledge`), no profiles, scope `notify/src/channel.rs`. No team override.
- Status: completed
- Inspected evidence: all of `notify/src/channel.rs` (`Channel`, `Channel::ALL`, `Channel::as_str`, `UnknownChannel`, `FromStr for Channel`) and `Cargo.toml`. No test code or generated code is in the snapshot.
- Coverage: I searched for these decisions and keys.
  - The channel name key set, `"email"`, `"sms"` and `"push"`, appears once as the forward `match` in `as_str`.
  - The reverse direction, `from_str`, does not hold a second table. It searches `Channel::ALL` and compares against `as_str()`, so parsing and rendering stay inverse by construction and share one source of names.
  - The variant list `ALL` is a second place that lists the variants. It is a plain array, so adding a variant to the enum leaves it stale without a compile error. The `as_str` match is exhaustive, so a new variant still forces an edit there. Without this edit the array's length stays 3 and the new variant is silently unparsable. This is a one-line extra edit next to the enum, not a divergent copy of a decision. It is a minor cost, and any alternative (a macro or a dependency such as strum) would add more machinery than it removes.
  - The snapshot has no other file that spells the same names or limits, so no partners exist outside this file. The packet's context says names are stored in the database and sent by clients, and the snapshot has no schema, migration or protocol file to compare against.
  - No handwritten general mechanism (parser, encoding, backoff) is present.
- New applicability signals: none.

No candidates. The single naming table in `as_str`, with parsing derived from it through `ALL`, already avoids repeated knowledge. The only residual duplication is the variant list in `ALL`, and removing it would cost more than it saves.
