<!-- model: claude-sonnet-5-5 (requested native alias `sonnet`); arm: baseline fffcf9d; input: RD55; tool: native Claude Code subagent, fresh context; the scratchpad prefix is shortened to `.../scratchpad` -->
## Task result: RD55

- Snapshot: whole supplied source, no diff or base revision. Location is `.../scratchpad/packets/RD55`. Files are Cargo.toml and src/lib.rs. No commit or file hashes were supplied.
- Instructions: `content identity unverified`. Installed resources came from the supplied skill root.
- Assignment: lens abstractions (Rust), no profiles, scope is all production declarations and uses in src/lib.rs. Team policy: none. Baseline is edition 2021, rust-version 1.85, private unreleased module.
- Status: completed
- Inspected evidence: Cargo.toml and all of src/lib.rs (`Row`, `LineSink` and its two impls, `RowFilter`, `ActiveOnly`, `Everything`, `export`). Caller facts come from PACKET.md: the CLI passes `File` and `ActiveOnly`, and the preview handler passes `Vec<u8>` and `Everything`. The callers themselves were not supplied.
- Coverage: base abstractions question completed over every declaration. No profile was selected. The caller bodies were not inspected, so the remedy for C-RD55-2 rests on the packet's stated facts.
- New applicability signals: dependency-boundaries (abstractions owner). Source anchors are `trait LineSink` and `trait RowFilter`, both used as `dyn` parameters of `export` and each with only crate-internal implementations. The open question is whether either trait marks a real external boundary. The packet says neither is used outside the crate, so none is confirmed.

## C-RD55-1: `LineSink` is a one-method twin of `io::Write` with identical bodies

- Change anchor: `src/lib.rs`, `trait LineSink` and its two impls. Both impls have the body `writeln!(self, "{line}")`. `export` takes `sink: &mut dyn LineSink`. Whole-source scope, anchored directly in this snapshot.
- Basis: rust.abstractions.earn-the-boundary. This is not convention-only advice.
- Observation: `LineSink` hides no variation. Both impls forward to `writeln!`, which is `io::Write`'s own capability. `File` and `Vec<u8>` already implement `io::Write`, and `use std::io::Write` is already imported. Readers must learn a crate-local trait, and each new destination needs a hand-written impl. The trait also has no other implementors, and it is not used outside the crate.
- Remedy: have `export` take `sink: &mut dyn Write`, or `&mut impl Write`, and call `writeln!(sink, "{}", row.name)?` directly. This removes the trait and both impls. Callers pass the same `File` and `Vec<u8>` values.
  Sketch: `pub fn export(rows: &[Row], filter: &dyn RowFilter, sink: &mut dyn Write) -> io::Result<()>`.
  Keep alternative: retain `LineSink` only if line framing, such as a non-newline terminator or per-line flush, is meant to vary per sink. No source evidence shows that.
- Preserve: `io::Result` and `?` short-circuiting are unchanged. Output bytes are the same: the name followed by a newline. `&mut` borrowing of the sink is unchanged. Dyn compatibility holds, since `dyn Write` is allowed. Callers are not supplied, so any that rely on `LineSink` by name are unverified. The packet says there are none outside the crate.
- Affected files: `src/lib.rs` (inspected). The CLI caller and the preview handler call `export` and need no change if they pass `File` or `Vec<u8>`. Those two callers were not inspected.

## C-RD55-2: `RowFilter` with two unit-struct implementations hides a one-line predicate

- Change anchor: `src/lib.rs`, `trait RowFilter`, `struct ActiveOnly`, `struct Everything`, and `export(..., filter: &dyn RowFilter, ...)`. Each impl is a single expression: `row.active` and `true`. Whole-source scope.
- Basis: rust.abstractions.earn-the-boundary. This is not convention-only advice.
- Observation: the trait, two types and two impls (about 20 lines) express two predicates over `Row`. The packet shows no other implementations and no use outside the crate. Both callers pick one fixed value. The reader has to follow a trait, a marker type and a `dyn` hop to learn what `export` skips, and the trait carries no state or configuration.
- Remedy: pass the predicate directly, for example `filter: impl Fn(&Row) -> bool`. Callers would pass `|r| r.active` and `|_| true`. If the named policies should stay discoverable, use `enum Filter { ActiveOnly, Everything }` with `fn keep(&self, row: &Row) -> bool`. Either option removes the trait and one impl per variant.
  Sketch: `pub fn export(rows: &[Row], keep: impl Fn(&Row) -> bool, sink: &mut dyn Write) -> io::Result<()>`.
  Keep alternative: the named unit types document intent and give a place to add stateful filters. If the crate expects more policies or external implementors, keeping the trait is defensible. The packet shows neither, and the module is private and unreleased.
- Preserve: `keep` is called per row in order with the same short-circuiting, and the filter is borrowed only. A closure or enum changes the signature of `export` and drops the `pub` types `ActiveOnly` and `Everything`. The CLI and preview callers must be updated; they were not inspected. The remedy for the type form is `unresolved` as to closure versus enum. That is a tradeoff between two supported alternatives, not missing facts.
- Affected files: `src/lib.rs` (inspected). The CLI and preview-handler call sites are needed to apply it and were not inspected.
