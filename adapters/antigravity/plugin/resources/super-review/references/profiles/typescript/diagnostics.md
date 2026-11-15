# Diagnostics

Owner: rationale
Rule: ts.rationale.explain-constraints

**What the output tells its reader.** Log records and error messages are what a
maintainer reads when the code misbehaves, often without the source at hand.
Read the changed log calls, thrown errors and error responses with the code that
produces them. Can a reader of the output tell which operation failed, on which
subject and why, without opening the code?

- A message omits the identifier the code holds at that point: the key, path,
  ID, URL or operation.
- A rethrown error loses its origin: it does not keep the original as `cause`
  where the project's `lib` and runtime allow, or its message is built from
  `String(err)`, which loses the stack and the object's fields. A thrown string
  or other non-`Error` value leaves no stack and no type.
- Wrapping repeats the inner message, or adds filler such as "failed to", so the
  output reads one failure several times.
- One failure appears several times in the output because it is logged and also
  rethrown or rejected. Report the duplicated output; which layer reports it is
  error-expression's decision. Separate obligations, such as an audit record,
  can justify a second record. A log line that records a decision callers
  cannot see, such as a retry or a fallback, is not a duplicate.
- Data is formatted into the message where the project's logger takes a context
  object, or one field is spelled differently across the changed calls, so a
  search for it misses events.

Error text can be a contract. Callers may compare `message`, clients may display
or parse an error response, and alerts and log queries may match it. Inspect
available consumers before rewording, and say when they lie outside the
snapshot. The level of an event classifies an outcome and can drive alerts; a
mismatched level is an observation whose remedy changes a decision, so leave
that remedy unresolved. Browser `console` output and a server logger reach
different readers; judge each by its own reader.

Adding events, metrics or traces that do not exist is a new capability, not this
profile's remedy. What a message discloses, and its volume or cardinality, belong
to other reviews. Error classes, translation, catch structure and which layer
reports stay with error-expression; this profile owns what the output shows.
Show what a reader of the output learns that they could not before.
