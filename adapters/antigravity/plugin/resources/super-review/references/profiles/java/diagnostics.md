# Java diagnostics

Owner: rationale
Rule: java.rationale.explain-constraints

**What the output tells its reader.** Log records and exception messages are
what a maintainer reads when the code misbehaves, often without the source at
hand. Read the changed log calls and thrown exceptions with the code that
produces them. Can a reader of the output tell which operation failed, on which
subject and why, without opening the code?

- A message omits the identifier the code holds at that point: the key, path,
  ID or operation.
- A translated exception drops its cause, so the stack trace ends at the
  translation; or it repeats the cause's text instead of adding the operation
  and subject the cause lacks (`new X(cause)` usually already shows the cause's
  text).
- A logged exception is concatenated into the text, reduced to `getMessage()`,
  or not passed as the last argument, so the stack trace and its "Caused by"
  chain are lost (the SLF4J FAQ).
- One failure appears several times in the output because it is logged and
  also rethrown. Report the duplicated output; which layer reports it is
  error-expression's decision. Separate obligations, such as an audit record,
  can justify a second record. A log line that records a decision callers
  cannot see, such as a retry or a fallback, is not a duplicate.
- Messages are built by concatenation where the project's logger takes
  placeholders or key-value pairs, or one MDC or structured key is spelled
  differently across the changed calls, so a search for it misses events.

Exception text can be a contract. Callers may compare `getMessage()`, clients
may display or parse an error response, and alerts and log queries may match it.
Inspect available consumers before rewording, and say when they lie outside the
snapshot. The level of an event classifies an outcome and can drive alerts; a
mismatched level is an observation whose remedy changes a decision, so leave
that remedy unresolved.

Adding events, metrics or traces that do not exist is a new capability, not this
profile's remedy. What a message discloses, and its volume or cardinality, belong
to other reviews. Exception types, where translation happens, catch structure
and which layer reports stay with error-expression; this profile owns what the
output shows. Show what a reader of the output learns that they could not before.
