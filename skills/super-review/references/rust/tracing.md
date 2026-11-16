# tracing inside existing Rust questions

Use only for implicated `tracing` instrumentation under
[Rust context](../languages/rust.md), verifying the `tracing` version and
`attributes` feature before proposing `#[instrument]`. Operator signal selection,
cardinality, and redaction policy are outside scope.

## function-cohesion with effects-separation

- **Declarative spans and structured fields**: lift manual function-wide span
  creation into `#[instrument]` with explicit `skip`/`skip_all`/`fields`
  (`#[instrument]` otherwise records every argument via `Debug`, breaking
  non-`Debug` parameters or emitting large/sensitive payloads), and record
  dynamic values as structured event fields rather than interpolating them into
  message strings.
- **Keep when**: a span's lifetime differs from the function's or fields are
  populated later via `Span::record`. In `async` code, attach spans with
  `.instrument(span)` or `#[instrument]` rather than holding a `Span::enter`
  guard across `.await` (judge as a preservation constraint on a rewrite, never
  a standalone defect hunt).

## control-flow with error-expression

- **Single error reporter**: avoid logging an error event and returning the same
  error to callers that report it again; keep reporting at the boundary that
  handles the failure or on the owning span (`#[instrument(err)]`), retaining
  local events only for decisions hidden from the caller (retries, fallbacks).

Sources: [instrument](https://docs.rs/tracing/latest/tracing/attr.instrument.html),
[spans in asynchronous code](https://docs.rs/tracing/latest/tracing/span/struct.Span.html#in-asynchronous-code),
[recording fields](https://docs.rs/tracing/latest/tracing/index.html#recording-fields),
and [Instrument](https://docs.rs/tracing/latest/tracing/trait.Instrument.html).
