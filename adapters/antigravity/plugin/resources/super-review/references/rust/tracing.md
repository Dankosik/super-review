# tracing inside existing Rust questions

Use only for implicated tracing instrumentation and the assigned owner under
[Rust context](../languages/rust.md). This is not an observability review: which
signals an operator needs, their cardinality and what they disclose are outside
scope. Resolve the tracing version and its `attributes` feature before
proposing `#[instrument]`.

## function-cohesion with effects-separation

Does instrumentation interleave with the operation it describes? A span built
by hand, entered and carried through a function whose body is otherwise one
story can be an `#[instrument]` attribute that names the span and its fields
beside the signature. `#[instrument]` records every argument as a span field,
using `Debug` for any type that is not a tracing primitive, unless `skip`,
`skip_all` or `fields` says otherwise. A proposal therefore states them: such
an argument without `Debug` does not compile, and a large or sensitive one
changes what is emitted. Keep a manual span whose lifetime differs from the
function's, or whose fields are known only later and filled through
`Span::record`.

In async code, a guard from `Span::enter` held across an `.await` attributes
other tasks' work to the span. `.instrument(span)` or `#[instrument]` attaches
the span to the future instead. Treat this as a constraint on a proposed
simplification, not a search for tracing defects.

An event that formats its data into the message, such as
`info!("user {id} logged in")`, gives every occurrence a different text and no
field to select on. `info!(%id, "user logged in")` keeps one message and a
named field, with `%` for `Display` and `?` for `Debug`. One message text
copied to several call sites is one event name kept in several places.

## control-flow with error-expression

Can a reader see which layer reports a failure? Code that emits an error event
and then returns the same error leaves each caller to report it again. One
owner reports it: usually the boundary that stops propagation, or
`#[instrument(err)]` on the operation whose span should carry it. Keep a local
event that records a decision the caller cannot see, such as a retry or a
fallback taken.

Sources: [instrument](https://docs.rs/tracing/latest/tracing/attr.instrument.html),
[spans in asynchronous code](https://docs.rs/tracing/latest/tracing/span/struct.Span.html#in-asynchronous-code),
[recording fields](https://docs.rs/tracing/latest/tracing/index.html#recording-fields),
and [Instrument](https://docs.rs/tracing/latest/tracing/trait.Instrument.html).
