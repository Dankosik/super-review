<!-- model: claude-sonnet-5-5; arm: baseline; input: RD41; tool: native Claude Code subagent, fresh context -->
## Task result: RD41

- Snapshot: local packet RD41, whole-source snapshot (no diff); `Cargo.toml` and `src/lib.rs` from the packet.
- Instructions: content identity unverified.
- Assignment: lens `change-locality` (`rust.change.localize-existing-variation`), no profiles, all supplied production declarations. Edition 2021, MSRV 1.85. No team override.
- Status: completed
- Inspected evidence: `errors::Failure`, `errors::is_transient`, `delivery::should_retry`, `delivery::parse_target`, `delivery::parse_target_legacy`, and the packet context about callers.
- Coverage: base lens completed over every declaration. Missing: callers of `should_retry` and `parse_target`, and any crate consumers of `parse_target_legacy`, are outside the packet. The context only says nothing calls the legacy parser.
- New applicability signals: none

## C-RD41-1: Retry classification is duplicated in `delivery::should_retry` and `errors::is_transient`

- Change anchor: `src/lib.rs`, `delivery::should_retry` (`Failure::Timeout | Failure::Refused => true, Failure::Rejected(status) => *status == 503`) against `errors::is_transient` (`matches!(failure, Failure::Timeout | Failure::Refused | Failure::Rejected(503))`). The context says the change introduced `should_retry`, so the second copy is part of the change.
- Basis: rust.change.localize-existing-variation.
- Observation: Both functions encode the same rule: timeout, refused and HTTP 503 are retryable. The context says `is_transient` is the classification every other outbound client in the crate uses. Changing the policy, for example adding 502 or 504 or making `Rejected(429)` retryable, now means editing two places. The two copies are written in different styles (`matches!` against an exhaustive `match`). A reader cannot tell whether the delivery rule is meant to differ from the shared one or has just drifted. Nothing in the source says it is deliberate. Delivery would then retry differently from every other client.
- Remedy: Delete `delivery::should_retry` and have delivery callers use `errors::is_transient`. If delivery really needs a different policy, keep the function but name the difference, for example `should_retry_delivery`, and add a comment on why it diverges. One tradeoff: the exhaustive `match` forces a decision whenever a `Failure` variant is added, while `matches!` with an implicit false does not. If that is valued, move the exhaustive `match` into `is_transient`, so the single owner keeps it:
  ```rust
  pub fn is_transient(failure: &Failure) -> bool {
      match failure {
          Failure::Timeout | Failure::Refused => true,
          Failure::Rejected(status) => *status == 503,
      }
  }
  ```
- Preserve: The visible retry outcomes are the same for all three variants today, so behavior holds if callers switch. Both functions borrow `&Failure` and return `bool`. `should_retry` callers are not in the packet, so it is unknown whether they or any public path depend on it. Visibility is private and unreleased.
- Affected files: `src/lib.rs` inspected. Callers of `should_retry` still needed.

## C-RD41-2: Unused `parse_target_legacy` sits beside `parse_target`

- Change anchor: `src/lib.rs`, `delivery::parse_target_legacy`, next to `delivery::parse_target`. The context says the change introduced `parse_target` and nothing calls the legacy parser any longer. The change left the superseded path behind.
- Basis: rust.change.localize-existing-variation.
- Observation: Two parsers for the same `host:port` text coexist in one module with no stated reason. They differ visibly on input such as `a:b:80`. `parse_target` uses `rsplit_once`, so the host is `a:b`. The legacy one takes the first two `:` segments and returns `("a", parse("b"))`, which is `None`. A reader has to compare them to learn which is canonical and whether the difference matters. A future change to target syntax, such as IPv6 or a default port, would have to decide again whether to touch both. The module carries a dead path with no documented activation or removal condition.
- Remedy: Remove `parse_target_legacy`. Keep it only if a compatibility requirement named outside this packet needs the old splitting behavior. In that case give it an explicit owner and note why it differs.
- Preserve: The packet shows no caller, so removal changes no known behavior. It is a private, unreleased module with no external API commitment. Consumers outside the packet are unverified, and `pub` inside a private `mod` does not by itself make this an external API.
- Affected files: `src/lib.rs` inspected. A crate-wide search for `parse_target_legacy` is still needed to confirm no other users.
