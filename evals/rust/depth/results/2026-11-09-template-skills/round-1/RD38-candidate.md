<!-- model: claude-sonnet-5-5; arm: candidate; input: RD38; tool: native Claude Code subagent, fresh context -->
## Task result: RD38

- Snapshot: supplied packet RD38 (Cargo.toml, src/lib.rs); no PR or B/H/D, whole-snapshot scope.
- Instructions: content identity unverified (installed super-review candidate resources).
- Assignment: lens rationale (rust.rationale.explain-constraints), no profiles; scope is all supplied production declarations in a private, unreleased module, with no team override.
- Status: completed
- Inspected evidence: Cargo.toml (edition 2021, rust-version 1.85, clap 4.5 with derive and help); src/lib.rs `Args` and `backoff` in full; the context entry about the --help rendering and the provider contract.
- Coverage: the rationale base pass covers every declaration and comment. `Args` doc comments are clap help output, so they are interface text. The comment in `backoff` records an external provider constraint and a rejected alternative (a cap), which is the kind of comment the lens says to keep. No library note applied. No evidence is missing.
- New applicability signals: none.

No candidates. Nothing in the supplied source needs a rationale change.

- The `Args` doc comments become the `--help` text and are not commentary.
- The `backoff` comment explains why the schedule is uncapped, citing the 250 ms floor after a 429 and the missing upper bound in the provider documentation. The integration contract that the context names backs this up. The code cannot show this reason, so the comment should stay.
- `backoff` has no callers in the supplied source. That is not a rationale problem and is outside this lens.
