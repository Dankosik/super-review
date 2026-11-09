<!-- model: claude-sonnet-5-5; arm: candidate; input: RD43; tool: native Claude Code subagent, fresh context -->
## Task result: RD43

- Snapshot: local packet RD43, whole-project snapshot, no diff; source `src/lib.rs` and `Cargo.toml` from the packet.
- Instructions: content identity unverified.
- Assignment: api-clarity (`rust.api.express-the-call`), no profiles. Scope is all supplied production declarations and uses in a private, unreleased module. There is no team override. Edition 2021, rust-version 1.85.
- Status: completed
- Inspected evidence: `Endpoint`, `impl Into<Endpoint> for String`, `Registry`, `Registry::new`, `impl Default for Registry`, `load`, and the context fact about callers.
- Coverage: base lens completed over all declarations in `src/lib.rs`. No library note was needed. No tests are present.
- New applicability signals: none

## C-RD43-1: `Registry::new()` and `Registry::default()` build different registries (limit 64 vs 32)

- Change anchor: `src/lib.rs`, `Registry::new` (`Self { endpoints: Vec::new(), limit: 64 }`) and `impl Default for Registry` (`limit: 32`). This is whole-project scope, so the anchor is the snapshot itself.
- Basis: rust.api.express-the-call. The rule says an infallible zero-argument `new` and `Default` describe the same construction and should agree, with one delegating to the other.
- Observation: Both construct an empty registry, but the hidden `limit` differs. Callers use both spellings, and the team believes they are the same. A reader cannot see which limit a call gets without reading both bodies. The 64 and 32 magic numbers are unnamed, so neither is identifiable as the intended value. Changing the limit later means finding and editing two literals.
- Remedy: Pick one limit and have one constructor delegate to the other. Name the value, for example `const DEFAULT_LIMIT: usize = ...`. Example: `impl Default for Registry { fn default() -> Self { Self { endpoints: Vec::new(), limit: DEFAULT_LIMIT } } }` and `pub fn new() -> Self { Self::default() }`. Which value is correct (32 or 64) is a behavior decision the source cannot settle. Callers now using the other spelling would change behavior. If a different capacity is meant, give it a named constructor such as `with_limit(limit)`.
- Preserve: The behavior of existing callers of whichever spelling is not chosen is unverified. The consumer list is not in the packet, so the audit has to cover every caller. `limit` units and meaning (a maximum endpoint count) are inferred, not shown.
- Affected files: `src/lib.rs`. Callers of `Registry::new` and `Registry::default` are not supplied and are still needed.

## C-RD43-2: `impl Into<Endpoint> for String` hides the conversion from `Endpoint::from` and `?`

- Change anchor: `src/lib.rs`, `impl Into<Endpoint> for String { fn into(self) -> Endpoint { Endpoint(self) } }`, used by `load` via `.map(Into::into)`.
- Basis: rust.api.express-the-call. The rule says to implement `From`, not `Into`.
- Observation: The direct `Into` impl means `Endpoint::from(string)` does not exist, and `?` cannot use the conversion. The conversion is infallible and keeps the text unchanged, per the context, so it meets the criteria for `From`. In `load`, `.map(Into::into)` relies on the return type for inference. `.map(Endpoint::from)` would name the target at the call.
- Remedy: Replace the impl with `impl From<String> for Endpoint { fn from(s: String) -> Self { Endpoint(s) } }`. `Into` then comes from the blanket impl. In `load`, use `.map(Endpoint::from)`. The text is not normalized, so a named operation is not needed.
- Preserve: `Endpoint`'s field is private, so the public conversion is the only construction path. Existing `String::into()` calls keep working through the blanket impl. The orphan rule is satisfied because `Endpoint` is local. A downstream crate may not have a conflicting impl, since the module is private and unreleased. Other consumers of the direct impl are unverified.
- Affected files: `src/lib.rs`. No other consumers were supplied.
