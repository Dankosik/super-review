<!-- model: claude-sonnet-5-5; arm: baseline; input: RD43; round 2 after review fixes; tool: native Claude Code subagent, fresh context -->
## Task result: RD43

- Snapshot: local packet RD43, whole-project scope; source is the supplied `Cargo.toml` and `src/lib.rs` (no commit identities; none exposed).
- Instructions: content identity unverified.
- Assignment: lens api-clarity (`rust.api.express-the-call`), no profiles; scope is all supplied production declarations and uses in a private, unreleased module. No team override.
- Status: completed
- Inspected evidence: `Cargo.toml` (edition 2021, rust-version 1.85). In `src/lib.rs` I read `Endpoint`, `impl Into<Endpoint> for String`, `Registry`, `Registry::new`, `impl Default for Registry`, and `load`. Packet context: callers use both `Registry::new()` and `Registry::default()`, and `Endpoint` keeps the address text unchanged.
- Coverage: base lens complete for the supplied source. No library notes were routed. Nothing was missing.
- New applicability signals: none.

## C-RD43-1: Conversion from `String` to `Endpoint` is written as `Into` instead of `From`

- Change anchor: `src/lib.rs`, `impl Into<Endpoint> for String { fn into(self) -> Endpoint { Endpoint(self) } }`, used in `load` as `raw.into_iter().map(Into::into).collect()`. Whole-project snapshot.
- Basis: rust.api.express-the-call (standard conversion traits).
- Observation: The conversion is infallible, lossless and unambiguous, because the context says the address text is unchanged. That is the case `From` exists for. Implementing `Into` directly is the reverse of the usual direction. Readers have to check why the impl is unusual, and the impl leaves out `From<String> for Endpoint`. It also gives no `Endpoint::from(s)` call form and no `?` or generic `T: From<String>` use. `Into::into` in `load` hides the target type, which is only recovered from the return type.
- Remedy: Replace the impl with `impl From<String> for Endpoint { fn from(s: String) -> Self { Endpoint(s) } }`. `String: Into<Endpoint>` still holds through the blanket impl, so `load` compiles unchanged. It could also read `.map(Endpoint::from)`, which names the target at the call site.
- Preserve: The owned `String` is consumed and no text is changed. `Into::into` call sites keep working through the blanket impl. The module is private and unreleased, so no external consumers are known. This was not compiled.
- Affected files: `src/lib.rs` (inspected). No other consumers were supplied.

## C-RD43-2: `Registry::new()` and `Registry::default()` duplicate the default state

- Change anchor: `src/lib.rs`, `Registry::new` (`Self { endpoints: Vec::new(), limit: 64 }`) and `impl Default for Registry` (the same literal). Whole-project snapshot.
- Basis: rust.api.express-the-call (construction).
- Observation: Callers use both entry points, so the two must be read as one contract. Each spells out the initial state, including the unnamed literal `64`. A reader cannot tell whether the two are meant to be identical, or whether a change to one should be mirrored in the other. The limit has no name and no unit. A caller of either entry point cannot tell what 64 counts, or whether it is a cap on endpoints.
- Remedy: Keep one definition and have the other delegate to it. For example, `impl Default for Registry { fn default() -> Self { Self::new() } }`, or the reverse. Name the limit, for example `const DEFAULT_LIMIT: usize = 64;`, so the call contract states what the number means. Both public entry points can stay, since callers use both.
- Preserve: Both entry points keep returning an empty registry with limit 64. Neither takes arguments, so existing calls are unaffected. The meaning of `limit` is not shown in the supplied source, so the constant's name needs the real semantics (for example whether it caps `endpoints.len()`). That is unverified here.
- Affected files: `src/lib.rs` (inspected); the callers named in the context were not supplied.
