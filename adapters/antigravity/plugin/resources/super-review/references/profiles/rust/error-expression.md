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

Read an error type as an API of its own. One enum listing every failure of a
crate, returned by functions that can each produce two of them, makes callers
handle variants that cannot occur here; an error scoped to the operation or
layer says what can fail. Keep a shared type where callers treat its failures
alike or the type deliberately hides its cases. A `String` error or
`map_err(|e| e.to_string())` erases the type and the source at that point.
`Box<dyn Error>` keeps both but leaves a caller only `downcast` to branch on.
Keep these where the boundary only reports, and name the loss where a caller
upstream branches or a report needs the chain. `Result<T, ()>` gives a failure
nothing to say: `Option` or a named error type states which is meant.

An error that wraps another either returns it from `source` or renders it in
`Display`, not both, or every chained report repeats the cause. Context such as
a path or a line number serves callers and reports better as a field than
formatted into the message. Messages compose when they are concise lowercase
text without trailing punctuation. Code that logs an error and also returns it
has the layers above report the same failure again; one owner reports it.

An existing canonical `From` can make propagation direct. A local `map_err` that
captures a path, operation or identifier expresses context that `From` alone does
not know. Retain owned diagnostic data and the underlying source when required;
`Display` text is not a substitute for the error's source/downcasting contract.
