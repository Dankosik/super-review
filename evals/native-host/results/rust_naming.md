## Task result: R

- Snapshot: local whole-project target at `e0b9bce1a9605715398ac56cc90592e8a28ac91a`; `/var/folders/9r/ft1t72w13r765bpf61v9mly00000gn/T/super-review-native-fixture-8ofll9bk/engine.rs` SHA-256 `df44452424f1d0d2cdbf4c2259b7ef6c27e127066ee78041ee6491a96a65ba48` verified before and after inspection. Working tree has the supplied local comment-only change.
- Instructions: Super Review 3.0.0; content identity unverified.
- Assignment: Rust naming only; all production declarations and uses in `engine.rs`; no profiles. Effective policy: `rust.naming.intent`, `review-contract.md`, `languages/rust.md`.
- Status: completed.
- Inspected evidence: `Cargo.toml` declares edition 2021, MSRV 1.85, and `engine.rs` as the library target. Read complete production `Policy`, `Policy::duration`, and `deadline` declarations and their only in-tree uses. No test-only items or additional Rust production files; excluded test/generated/vendor/binary scopes.
- Coverage: completed for all in-scope production naming. No missing evidence or capability.
- New applicability signals: none.

## C-R-1: `duration` conceals that its result is in seconds

- Change anchor: `/var/folders/9r/ft1t72w13r765bpf61v9mly00000gn/T/super-review-native-fixture-8ofll9bk/engine.rs:3`, `Policy::duration`; whole-project scope directly anchors this existing burden. The local D change is only the comment at line 8.
- Basis: `rust.naming.intent`.
- Observation: `Policy` stores `days`, while `duration()` converts that value to seconds and `deadline` adds it to `epoch_seconds` at line 6. At the representative call `epoch_seconds.checked_add(policy.duration())`, a reader must inspect `duration` to establish that both operands share seconds. The method name is otherwise unitless.
- Remedy: rename the method to `duration_seconds` and update its sole in-tree call. This makes the unit explicit at the addition. The strongest keep alternative is that the tiny private API makes inspection cheap, but the call remains a boundary between day-based policy configuration and epoch-second arithmetic.
- Preserve: retain the `i64` seconds result, day-to-second conversion, checked addition, and `Option<i64>` result. The declarations are private and the assignment states this is an unreleased internal application with no external library consumers.
- Affected files: `engine.rs` only; no remaining consumer-context gap.
