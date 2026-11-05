## Task result: CT02

- Snapshot: static packet `packet-CT02.json`; no commits or hashes supplied.
- Instructions: content identity unverified.
- Assignment: duplication lens; no profiles; scope `worker/src/boot.rs`; no team override.
- Status: completed.
- Inspected evidence: `sampler` in `worker/src/boot.rs` and `api/src/boot.rs`; `Cargo.toml` (edition 2024, MSRV 1.90); packet context.
- Coverage: base lens complete. Crate manifests, `sampler` callers and the `config`/`telemetry` declarations are not in the snapshot.
- New applicability signals: representation, `sampler`: `ratio` is passed separately and ignored for `On`/`Off`; the `config` declaration is unavailable, so it is unknown whether the shape is forced.

## C-CT02-1: Config-to-sampler mapping is duplicated across binaries

- Change anchor: whole-project snapshot, `worker/src/boot.rs:1-7`, `sampler`; identical copy at `api/src/boot.rs:1-7`.
- Basis: `rust.duplication.share-knowledge`.
- Observation: Both copies encode one decision: how configuration selects a sampler. Exhaustive matching makes the compiler flag a new `Kind` variant in both, but a changed meaning, such as adjusting `ratio`, needs a coordinated edit the compiler won't prompt.
- Remedy: `unresolved`. Neither leaf can host it, since they must not import each other. The only shared home is a crate above both. Missing fact: whether `api` and `worker` already share one. If so, move `sampler` there. If not, it is a tradeoff: a new crate and dependency edges for seven lines, versus keeping a short, compiler-checked match.
- Preserve: leaf independence; by-value parameters and return type.
- Affected files: both `boot.rs`; manifests and callers still needed.
