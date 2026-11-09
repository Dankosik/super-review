<!-- model: claude-sonnet-5-5; arm: candidate; input: RD43; round 2 after review fixes; tool: native Claude Code subagent, fresh context -->
## Task result: RD43

- Snapshot: supplied packet RD43 (no PR or B/H/D). Whole-snapshot scope covers `src/lib.rs` and `Cargo.toml`.
- Instructions: `content identity unverified`.
- Assignment: lens `api-clarity` (rule `rust.api.express-the-call`), no profiles. Scope is all supplied production declarations and uses in a private, unreleased module, with no team override.
- Status: completed
- Inspected evidence: `Cargo.toml` (edition 2021, rust-version 1.85) and all of `src/lib.rs`: `Endpoint`, `impl Into<Endpoint> for String`, `Registry`, `Registry::new`, `impl Default for Registry`, and `load`. Context: callers use both `Registry::new()` and `Registry::default()`.
- Coverage: base lens pass complete over every supplied declaration. Nothing required is missing. The orphan-rule and downstream-consumer question is covered under C-RD43-1 Preserve.
- New applicability signals: none

## C-RD43-1: Conversion is a direct `Into` impl, not `From`

- Change anchor: `src/lib.rs`, `impl Into<Endpoint> for String { fn into(self) -> Endpoint { Endpoint(self) } }`. The use is in `load`: `raw.into_iter().map(Into::into).collect()`. This is whole-snapshot scope, so the anchor is the current source.
- Basis: `rust.api.express-the-call`. Standard conversion traits.
- Observation: The conversion is declared as a direct `Into` impl. The guidance says to implement `From` and let the blanket impl supply `Into`. A direct `Into` hides the conversion from `Endpoint::from(s)` and from `?` error conversion. A reader or caller looking for `Endpoint::from` finds nothing. The conversion is infallible and meaning-preserving (the context says the address text is unchanged), so it meets the `From` bar. `Endpoint(String)` is the type's only field, so `From<String>` is the natural direct construction.
- Remedy: `impl From<String> for Endpoint { fn from(raw: String) -> Self { Self(raw) } }`. `load` keeps working unchanged: `.map(Into::into)` resolves through the blanket impl. It could also be written `.map(Endpoint::from)`, which names the target type at the call site. This is optional.
- Preserve: The `String` to `Endpoint` conversion stays infallible and owned. The call `String::into()` still compiles through the blanket impl. The source shows no inference or function-value uses beyond `Into::into` in `load`. No other consumers were supplied. The scope states a private, unreleased module, so no public API commitment is known.
- Affected files: `src/lib.rs` (inspected).

## C-RD43-2: `Registry::new` and `Default::default` duplicate one construction

- Change anchor: `src/lib.rs`, `Registry::new` (`Self { endpoints: Vec::new(), limit: 64 }`) and `impl Default for Registry` (same literal). Context: callers use both entry points.
- Basis: `rust.api.express-the-call`. Zero-argument `new` versus `Default`.
- Observation: `new()` takes no arguments and has no effects. It builds the same value as `default()`. The two bodies repeat the struct literal, including the magic default `limit: 64`. A maintainer changing the default limit or adding a field must edit both. A reader can't tell whether `new()` and `default()` are meant to differ without comparing them. Because callers use both, a divergence would be visible only at some call sites.
- Remedy: Keep one body and delegate. Either `impl Default` holds the literal and `new()` becomes `Self::default()`, or the reverse. A named constant for 64 would also say what the number means, for example `const DEFAULT_LIMIT: usize = 64;`. The constant is optional and separate from the duplication fix. Delegating this way keeps both entry points.
- Preserve: Both `Registry::new()` and `Registry::default()` keep returning an empty registry with limit 64. The visibility of `new` is unchanged. Whether to drop one entry point depends on the callers, whose code was not supplied.
- Affected files: `src/lib.rs` (inspected). Caller files that use `new()` and `default()` are not supplied.
