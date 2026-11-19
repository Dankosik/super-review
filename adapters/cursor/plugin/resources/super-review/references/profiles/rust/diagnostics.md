# Rust diagnostics

Owner: rationale
Rule: rust.rationale.explain-constraints

**What the output tells its reader.** Log events, error messages and panic
messages are what a maintainer reads when the code misbehaves, often without the
source at hand. Read the changed events and messages with the code that produces
them. Can a reader of the output tell which operation failed, on which subject
and why, without opening the code?

- A message or event omits the identifier the code holds at that point: the
  key, path, ID or operation.
- A context message repeats the inner error, or the same phrase recurs at
  several layers, so a chained report reads one failure several times. Each
  layer names its own operation and subject.
- An error is logged in a form that drops its causes, such as an
  `anyhow::Error` through `{}` or `%err` (anyhow's formatting rules).
- An error event is logged locally while the same error is returned to a caller
  that reports it again, duplicating the output operators read.
- One field is spelled differently across the changed events, so a search for
  it misses events. This is house consistency, not a tracing convention.

Apply the `rationale with diagnostics` sections of
[error crates](../../rust/errors.md) and [tracing](../../rust/tracing.md) where
those crates are implicated (`expect`/`assert!`/`unreachable!` invariant wording
already sits in this profile's owner, `rationale`).

Error text can be a contract. Callers may match `Display` output, and alerts and
log queries may match event messages or fields. Inspect available consumers
before rewording, and say when they lie outside the snapshot. The level of an
event classifies an outcome and can drive alerts; a mismatched level is an
observation whose remedy changes a decision, so leave that remedy unresolved.

Adding events, spans or metrics that do not exist is a new capability, not this
profile's remedy. What a message discloses, and its volume or cardinality, belong
to other reviews. Error types, conversions and source chains stay with
error-expression; this profile owns the text and the events. Show what a reader
of the output learns that they could not before.
