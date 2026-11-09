<!-- model: claude-sonnet-5-5; native Claude Code subagent, fresh context; 2026-11-09 -->
## Task result: CT13

- Snapshot: private unreleased snapshot, packet CT13 (no diff, no B/H/D); whole-project scope anchored in `notify/src/channel.rs`; the only other file is `Cargo.toml`.
- Instructions: `content identity unverified`. Read review-contract.md, languages/rust.md, lenses/rust/duplication.md and assets/finding-template.md from the installed baseline.
- Assignment: lens duplication, profile `rust.duplication.share-knowledge`, scope `notify/src/channel.rs`. No team override. Packet context says channel names are stored in the database and sent by clients, so parsing and rendering must stay inverse. Variants are added a few times a year.
- Status: completed
- Inspected evidence: `notify/src/channel.rs` in full (`Channel`, `Channel::as_str`, `impl FromStr for Channel`, `UnknownChannel`). `Cargo.toml` gives edition 2024 and rust-version 1.90. The snapshot has no other file, so no callers or partners exist elsewhere.
- Coverage: share-knowledge pass completed over the whole file. Nothing is missing. The sibling-crate and macro-expansion questions are moot because the snapshot has no other source.
- New applicability signals: none

## C-CT13-1: The wire name of each `Channel` variant is written twice, in `as_str` and in `from_str`

- Change anchor: `notify/src/channel.rs`, whole-project snapshot. `Channel::as_str` has `Channel::Email => "email"`, `Channel::Sms => "sms"`, `Channel::Push => "push"`. `<Channel as FromStr>::from_str` has `"email" => Ok(Channel::Email)`, `"sms" => Ok(Channel::Sms)`, `"push" => Ok(Channel::Push)`.
- Basis: `rust.duplication.share-knowledge`. No profiles were selected.
- Observation:
  - The variant-to-name mapping is stored in two independent `match` expressions. The packet says the two directions must stay inverse, because the names are persisted and sent by clients.
  - Adding a variant means editing both. The compiler forces the `as_str` arm, because that `match` is exhaustive.
  - The `from_str` match ends in `_ =>`, so a missing arm for a new variant compiles. The new variant then renders as a name that cannot be parsed back.
  - The same applies to a typo in one string literal, such as `"sms"` against `"smss"`.
  - This is the "extra edit versus silent divergence" distinction in the lens. The `as_str` copy costs only an edit, but the `from_str` copy can diverge silently.
  - With variants added a few times a year, this is a recurring coordinated edit.
  - The file has no round-trip check, so nothing ties the two lists together.
- Remedy: Make the table the single owner of each name and derive both directions from it.
  - Option A, std-only: define `const ALL: [Channel; 3] = [Email, Sms, Push]`. Implement `from_str` as `Self::ALL.into_iter().find(|c| c.as_str() == text).ok_or(UnknownChannel)`.
  - Then the only per-variant string is the one in `as_str`. A new variant needs its `as_str` arm, which is compiler-enforced, plus one entry in `ALL`. Forgetting `ALL` still fails silently, so it is a smaller remaining gap.
  - Option B, a declarative macro in the file, such as `channels! { Email => "email", Sms => "sms", Push => "push" }`. It expands to the enum, `as_str`, `ALL` and the `from_str` lookup, so one line per variant is the only edit.
  - Option B removes the remaining gap, at the cost of a macro the reader must expand mentally.
  - Option C: if `strum` is already a dependency of the owning crate, `#[derive(EnumString, IntoStaticStr)]` with `#[strum(serialize_all = "lowercase")]` and `EnumIter` is the maintained form of the same mapping. The snapshot's `Cargo.toml` declares no dependencies, so adopting it is a named dependency decision, not a recommendation. The names are simple lowercase, so the hand-written mapping is no general parser, and Options A or B suffice.
  - Strongest keep alternative: three variants, three short arms each, the current code is easy to read, and a round-trip would catch drift. This does not remove the silent-divergence path the file leaves open today.
- Preserve:
  - Wire strings stay exactly `"email"`, `"sms"`, `"push"`, with case-sensitive exact matching and no trimming.
  - `as_str(self) -> &'static str` and the `FromStr` impl keep their signatures. `Channel` keeps `Copy`, `Eq` and `Debug`.
  - Unknown input still returns `UnknownChannel`, with no new error detail.
  - Established but unverified: callers and any public export are outside the snapshot, so source compatibility of `ALL` as a new associated item is unchecked. It is additive.
- Affected files: `notify/src/channel.rs` (inspected). No consumers are in the snapshot, so none could be inspected. Pending consumer context is needed only to confirm that no external code relies on a variant-to-name mapping beyond `as_str` and `FromStr`.
