## Task result: CT02

- Snapshot: static packet `packet-CT02.json`, whole-project view; no commit identity supplied.
- Instructions: content identity unverified.
- Assignment: duplication; no profiles; scope `worker/src/boot.rs`; no team override.
- Status: completed.
- Inspected evidence: all three packet files; both complete `sampler` functions; supplied context.
- Coverage: base duplication complete. Packet contains no `sampler` callers or crate manifests, and no shared crate.
- New applicability signals: none.

## C-CT02-1: The `Kind`-to-`Sampler` mapping is copied in both binaries

- Change anchor: `worker/src/boot.rs:1-7`, `sampler`; partner `api/src/boot.rs:1-7`.
- Basis: `rust.duplication.share-knowledge`; not convention-based.
- Observation: The copies are textually identical and translate the same config value. The cost is small: adding a `Kind` variant fails compilation in both exhaustive matches, so it costs one extra guided edit. Changing an existing arm, such as `Ratio`, gets no such compiler link. No present need for the binaries to differ is shown.
- Remedy: unresolved tradeoff. Neither leaf can own this function, because they must not import each other. Sharing needs a new composition crate depending on both, adding a package for one seven-line function. The strongest alternative is keeping both copies: the composition roots own this wiring, and the compiler flags variant additions. I favor keeping unless more shared composition appears.
- Preserve: by-value `Kind`; `ratio` used only for `Ratio`; dependency separation of the leaves.
- Affected files: `worker/src/boot.rs`, `api/src/boot.rs`; manifests needed for any shared crate.
