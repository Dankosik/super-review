<!-- model: claude-sonnet-5-5; arm: candidate; input: RD37; tool: native Claude Code subagent, fresh context -->
## Task result: RD37

- Snapshot: supplied packet RD37, whole-source scope (`Cargo.toml`, `src/lib.rs`); no B/H/D.
- Instructions: super-review rationale lens; content identity unverified.
- Assignment: lens `rationale` (`rust.rationale.explain-constraints`), no profiles; scope is all supplied production declarations in a private, unreleased module with no team override.
- Status: completed
- Inspected evidence: `Cargo.toml` (edition 2021, rust-version 1.85); `src/lib.rs` in full: `retry_limit`, `Config`, `backoff`. The packet context says `timeout_ms` has always held milliseconds and that no comment records a reason, protocol or caller obligation.
- Coverage: the rationale lens was applied to every comment and doc comment in the supplied source. No library notes were routed. No evidence is missing.
- New applicability signals: `backoff` multiplies by 250 while its comment says 100 (a change-locality or naming signal, not checked here). `retry_limit` has no callers in the supplied source.

## C-RD37-1: Stale unit in the `timeout_ms` doc comment

- Change anchor: `src/lib.rs`, `Config::timeout_ms`, whole-project snapshot. The doc comment reads `/// Timeout in seconds.` on `pub timeout_ms: u64`.
- Basis: `rust.rationale.explain-constraints`. This is a stale comment with evidence, not a convention-only point.
- Observation: The field name says milliseconds. The packet context states the field has always held milliseconds and that the doc predates a rename. The doc therefore contradicts the name and the actual contract. A reader cannot tell which one is authoritative, and a caller could pass seconds and get a 1000x shorter timeout. The doc comment states a fact the name already carries, and it has gone wrong.
- Remedy: Delete the unit claim. For example, drop the comment, or reduce it to a fact the name cannot show, such as what the timeout bounds, if that is known. Do not invent that fact. The name `timeout_ms` already carries the unit. If a typed duration were wanted, that is a separate API decision.
- Preserve: The field's name, type and value semantics (milliseconds) stay unchanged. The module is private and unreleased. Consumers were not inspected, but no behavior changes.
- Affected files: `src/lib.rs`.

## C-RD37-2: Comments that restate adjacent code, one of them wrong

- Change anchor: `src/lib.rs`, in three places:
  - `/// Returns the retry limit.` and `// Read the limit from the config.` on `retry_limit`.
  - `/// The retry limit.` on `Config::retry_limit`.
  - `// Multiply the attempt by 100.` over `u64::from(attempt) * 250` in `backoff`.
- Basis: `rust.rationale.explain-constraints`: comments that restate the name, signature or statement.
- Observation: Each of these comments repeats what the adjacent name or statement already shows. None records a reason, a rejected alternative, an external constraint or an invariant. Each costs an edit whenever the code changes.
  - The `backoff` comment is already wrong, since it says 100 and the code multiplies by 250. A reader must decide whether the comment or the constant is the intent. That is the same cost as in C-RD37-1, and it is evidence of staleness.
  - The 250 itself is an unexplained magic number. No source or context says why it is 250, whether it is a base delay in milliseconds, or whether it matches a protocol or caller obligation. That reason is unverified, so it is an evidence gap, not something to invent.
- Remedy:
  - Delete the restating comments: the doc and line comment on `retry_limit`, the field doc on `Config::retry_limit`, and the `backoff` comment.
  - Move the `backoff` fact into a name or type if its meaning is known, for example a named constant such as `BASE_BACKOFF_MS`. Add a comment only if the owner can supply the reason for 250. The reason is unresolved here, because the source and context do not state it.
- Preserve: `retry_limit` and `backoff` return values are unchanged. The field is `pub` in a private, unreleased module, so no external contract is established. Callers were not supplied, so the effect on consumers is unverified.
- Affected files: `src/lib.rs`.
