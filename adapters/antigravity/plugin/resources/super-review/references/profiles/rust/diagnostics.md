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
- An `expect` message restates the failure instead of why the value should be
  there (std's guidance on `expect` messages). Whether that path should return
  an error is a decision outside this profile; the message is not.
- One field is spelled differently across the changed events, so a search for
  it misses events. This is house consistency, not a tracing convention.

The [error crates](../../rust/errors.md) and [tracing](../../rust/tracing.md)
notes cover `Display` versus `source`, message form, event fields and which layer
reports a failure; apply them where implicated. This profile adds the reader's
view: whether the text that comes out identifies the failure.

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
