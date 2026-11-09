<!-- model: claude-sonnet-5-5; arm: baseline; input: RD43; tool: native Claude Code subagent, fresh context -->
## Task result: RD43

- Snapshot: local packet RD43, whole-project snapshot (no B/H/D); source `src/lib.rs`, `Cargo.toml` from the packet JSON.
- Instructions: super-review baseline skill (references/review-contract.md, languages/rust.md, lenses/rust/api-clarity.md, assets/finding-template.md); content identity unverified.
- Assignment: lens api-clarity, no profiles; scope is all supplied production declarations and uses in a private, unreleased module with no external API commitment or team override.
- Status: completed
- Inspected evidence: `Cargo.toml` (edition 2021, rust-version 1.85); `src/lib.rs` in full: `Endpoint`, `impl Into<Endpoint> for String`, `Registry` (struct, `new`, `Default::default`), `load`.
- Coverage: base api-clarity pass over every declaration and use in the packet. Callers of `Registry::new()` and `Registry::default()` are known only from the context statement, not as source. No library note was needed.
- New applicability signals: none.

## C-RD43-1: `Registry::new()` and `Registry::default()` build different registries

- Change anchor: `src/lib.rs`, `impl Registry { pub fn new() }` with `limit: 64`, and `impl Default for Registry { fn default() }` with `limit: 32`. Whole-project snapshot.
- Basis: rust.api.express-the-call (call contracts; absence of a stated alternative). Not convention-only.
- Observation: The two constructors take no arguments and both start with an empty `endpoints`, but they set `limit` to 64 and 32. Callers use both. The context says the team believes they produce the same empty registry. A reader of a call site cannot see that the choice sets the capacity. The `limit` field has no named meaning (maximum endpoints, unit, or behavior on reaching it). The 64 and 32 literals are unrelated, so the difference looks accidental. Callers can silently get different capacities.
- Remedy: Give the limit a single owner. Either make `Default::default()` delegate to `new()` (or the reverse) so both give the same value, or, if two capacities are intended, expose that choice in the call, for example `Registry::with_limit(n)` plus a named constant for the default. Name the constant to show what the limit bounds.
  ```rust
  const DEFAULT_ENDPOINT_LIMIT: usize = 64;
  impl Registry { pub fn new() -> Self { Self::with_limit(DEFAULT_ENDPOINT_LIMIT) } pub fn with_limit(limit: usize) -> Self { Self { endpoints: Vec::new(), limit } } }
  impl Default for Registry { fn default() -> Self { Self::new() } }
  ```
  Which value is correct (64 or 32) is a decision for the code owner; the source does not say. Strongest keep alternative: the two values may be deliberate, with `new()` as a production default and `default()` as a smaller one. The source gives no sign of this, and the team's own belief says it was not intended.
- Preserve: Callers of `Default::default()` would change capacity if it moves to 64; that is the behavior decision above. The remaining facts are unchanged: the registry is empty, the `limit` field is private, and `Default` stays implemented for `#[derive]`-style and generic use.
- Affected files: `src/lib.rs`. The call sites of `new()` and `default()` are known only from the context and were not inspected.

## C-RD43-2: `impl Into<Endpoint> for String` instead of `From<String>`

- Change anchor: `src/lib.rs`, `impl Into<Endpoint> for String { fn into(self) -> Endpoint }`, used in `load` as `.map(Into::into)`.
- Basis: rust.api.express-the-call (standard conversion traits; `From` for infallible, meaning-preserving conversion). Not convention-only.
- Observation: The conversion is an infallible, lossless wrapper (context: `Endpoint` keeps the text unchanged), which is the case `From` is for. Implementing `Into` directly is the reverse of the standard direction. It gives `String: Into<Endpoint>` but not `Endpoint: From<String>`, so `Endpoint::from(s)`, `?`-style conversions, and `T: From<String>` bounds do not work. The `.map(Into::into)` in `load` also hides the target type, which is inferred only from the return type. Readers have to look up the impl to see where the conversion lives.
- Remedy: Replace it with `impl From<String> for Endpoint { fn from(value: String) -> Self { Self(value) } }`. `Into` is then provided by the blanket impl, `load` compiles unchanged, and it can optionally be written as `.map(Endpoint::from)` to name the target. This is clear for a private, unreleased module. A validating constructor and `TryFrom` would apply only if the address were later checked, which the source does not show.
- Preserve: Ownership (consumes the `String`) and the unchanged text are preserved. The `Into` impl on `String` is dropped; with no known external consumers, `String::into::<Endpoint>()` calls keep working through the blanket impl. Coherence rules allow `From<String> for Endpoint` since `Endpoint` is local.
- Affected files: `src/lib.rs` (`Endpoint`, `load`).
