# Rust error expression

Owner: control-flow
Rule: rust.flow.show-main-path

**Failure narrative.** When changed code translates, recovers from or abstracts
failures, can readers distinguish propagation from a meaningful local decision?
An ordinary `?` alone does not require an error-expression inquiry.

Direct `Result` propagation can replace plumbing. Keep matches that explain
recovery, add needed context or perform effects. Typed errors can expose library
contracts; an established opaque application error can avoid irrelevant plumbing.
Do not prescribe an error crate, stringify every error or ban all `unwrap` and
`expect` calls merely to claim improved safety.

Compare callers and preserve relevant error types, source chains, conversion,
downcasting and panic/recovery contracts. Unavailable evidence limits a rewrite,
not an otherwise demonstrated clarity observation. Missing error handling and
runtime failures are not this profile's subject.

Shape an error for the consumers that act on it. A caller matching on `Display`
text couples recovery to wording; a kind or variant states the decision, and
the rewrite must preserve which inputs take each arm. A variant that inspected
callers, diagnostics, `Display` and downcasting all treat like another adds
matching without a decision behind it; an empty consumer search alone does not
establish that.

An existing canonical `From` can make propagation direct. A local `map_err` that
captures a path, operation or identifier expresses context that `From` alone does
not know. Retain owned diagnostic data and the underlying source when required;
`Display` text is not a substitute for the error's source/downcasting contract.
