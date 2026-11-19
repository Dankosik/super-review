# tracing inside existing Rust questions

Use only for implicated `tracing` instrumentation under
[Rust context](../languages/rust.md), verifying the `tracing` version and
`attributes` feature before proposing `#[instrument]`. Operator signal selection,
cardinality, and redaction policy are outside scope.

## function-cohesion with effects-separation

- **Declarative spans**: lift manual function-wide span creation into
  `#[instrument]` with explicit `skip`/`skip_all`/`fields` (`#[instrument]`
  otherwise records every argument via `Debug`, breaking non-`Debug` parameters
  or emitting large/sensitive payloads).
- **Keep when**: a span's lifetime differs from the function's or fields are
  populated later via `Span::record`. In `async` code, attach spans with
  `.instrument(span)` or `#[instrument]` rather than holding a `Span::enter`
  guard across `.await` (judge as a preservation constraint on a rewrite, never
  a standalone defect hunt).

## control-flow with error-expression

- **Boundary failure reporting**: when a failure path logs an error event and
  returns the same error to a caller that reports it again, keep reporting at the
  handling boundary (or on the owning span via `#[instrument(err)]`), retaining
  local events only for decisions hidden from the caller (retries, fallbacks).

## rationale with diagnostics

- **Structured fields and non-duplicate output**: record dynamic identifiers
  (keys, IDs, paths) as structured event fields rather than interpolating them
  into message strings, keep field names consistent across related events, and
  flag error events logged alongside returning the same error when downstream
  reporting duplicates the failure output.

Sources: [instrument](https://docs.rs/tracing/latest/tracing/attr.instrument.html),
[spans in asynchronous code](https://docs.rs/tracing/latest/tracing/span/struct.Span.html#in-asynchronous-code),
[recording fields](https://docs.rs/tracing/latest/tracing/index.html#recording-fields),
and [Instrument](https://docs.rs/tracing/latest/tracing/trait.Instrument.html).
