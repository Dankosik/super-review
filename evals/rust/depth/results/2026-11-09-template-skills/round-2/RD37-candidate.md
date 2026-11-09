<!-- model: claude-sonnet-5-5; arm: candidate; input: RD37; round 2 after review fixes; tool: native Claude Code subagent, fresh context -->
## Task result: RD37

- Snapshot: local packet RD37, whole-project snapshot (src/lib.rs, Cargo.toml); no VCS endpoints.
- Instructions: content identity unverified.
- Assignment: lens rationale (rust.rationale.explain-constraints), no profiles; scope is all supplied production declarations in a private, unreleased module. No team override.
- Status: completed
- Inspected evidence: Cargo.toml (edition 2021, rust-version 1.85) and src/lib.rs in full (`retry_limit`, `Config`, `backoff`). The packet context says `timeout_ms` has always held milliseconds. `retry_limit` and `backoff` have no callers in the supplied source.
- Coverage: the rationale base pass covered every declaration and comment. No required evidence is missing. Whether `backoff`'s 250 is deliberate is unverified, and that is recorded in C-RD37-2 rather than treated as a gap in coverage.
- New applicability signals: none

## C-RD37-1: The `timeout_ms` doc comment says seconds, but the field holds milliseconds

- Change anchor: src/lib.rs, `Config::timeout_ms`. The doc comment reads `/// Timeout in seconds.` and sits on `pub timeout_ms: u64`. The field name and the doc comment disagree on the unit. This is a whole-project snapshot, so the anchor is the current source.
- Basis: rust.rationale.explain-constraints. The finding is about a stale comment, and the evidence is the packet context.
- Observation: The context says the field has always held milliseconds and that the documentation predates a rename. The comment is therefore stale. A reader trusting it would read the value as seconds, which is a 1000x misreading. The name already says the unit, so the comment adds only a contradiction.
- Remedy: Either correct the comment to "Timeout in milliseconds.", or delete it, since the name `timeout_ms` carries the fact. If a doc comment stays, it should record something the name does not show, such as what the timeout bounds. That fact is not in the supplied source, so the comment could also just be dropped.
- Preserve: The field name, type and public shape stay unchanged. Only comment text changes.
- Affected files: src/lib.rs (inspected). Other consumers of `Config` are not supplied.

## C-RD37-2: `backoff` has a comment that contradicts its constant and states no reason for the value

- Change anchor: src/lib.rs, `backoff`. The comment `// Multiply the attempt by 100.` sits above `u64::from(attempt) * 250`.
- Basis: rust.rationale.explain-constraints.
- Observation: The comment says 100 and the code multiplies by 250, so one of them is wrong, and the code does not show which was intended. Whether 250 is deliberate or a drifted edit cannot be told from the source. The comment only restates the arithmetic, and incorrectly. The unit of the result (ms or otherwise) is also unstated. It likely pairs with `timeout_ms`, but nothing in the source says so. A maintainer cannot tell whether the constant is a tuned or externally required step or an accident.
- Remedy: Delete the restating comment. Move the fact into a name, for example a constant such as `BACKOFF_STEP_MS: u64 = 250` and a return type or name that shows the unit. Add a short comment only if there is a real reason for the value, such as an upstream rate limit or a tuned figure. If 100 was the intended value, the code should change instead, which is a behaviour decision outside this lens. The reason for the value is unresolved: the source does not say why 250 was chosen.
- Preserve: The current return value (attempt × 250) must not change unless the owner decides it was a mistake. The signature is private and unreleased, with no supplied callers. Callers are unverified.
- Affected files: src/lib.rs (inspected). Callers are not supplied.

## C-RD37-3: Comments on `retry_limit` and `Config::retry_limit` restate the code

- Change anchor: src/lib.rs, `retry_limit`. The doc comment `/// Returns the retry limit.` and the line comment `// Read the limit from the config.` sit around the body `config.retry_limit`. `Config::retry_limit` carries `/// The retry limit.`
- Basis: rust.rationale.explain-constraints, which says to recommend deleting a comment that restates the name, signature or statement.
- Observation: All three comments repeat what the adjacent name or expression already shows. Each costs an edit if the code changes, and none records a reason, constraint or invariant. They also make the comments that do matter harder to find.
- Remedy: Delete the three comments. If a comment is wanted on the field, record what the number counts, for example attempts versus retries, whether it includes the first try, or the effect of zero. Those facts are not in the supplied source, so that part of the remedy is unresolved. Deletion alone resolves the observation.
- Preserve: The behaviour is unchanged by comment edits. If any of these comments feeds generated docs, that is a public-doc choice. The module is private and unreleased, and `Config` is `pub` but its reachability is not shown in the supplied source.
- Affected files: src/lib.rs (inspected).
