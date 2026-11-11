# Diagnostics

Owner: rationale
Rule: go.rationale.explain-constraints

**What the output tells its reader.** Log records and error messages are what a
maintainer reads when the code misbehaves, often without the source at hand.
Read the changed log calls and error texts with the code that produces them. Can
a reader of the output tell which operation failed, on which subject and why,
without opening the code?

- A message omits the identifier the code holds at that point: the key, path,
  ID or operation.
- Wrapping repeats what the inner error already says, or adds filler such as
  "failed to". Each layer names only the operation and subject the inner error
  lacks; errors from `os` file operations, for example, already name the path. A
  layer with nothing to add returns the error unchanged. Error strings follow
  the Code Review Comments rules.
- One failure appears several times in the output because it is logged and
  also returned. Report the duplicated output; which layer reports it is
  error-expression's decision. Separate obligations, such as an audit record,
  can justify a second record. A log line that records a decision callers
  cannot see, such as a retry or a fallback, is not a duplicate.
- Data is formatted into the message where the project's logger takes
  attributes, so every occurrence has a different text and no field to select
  on; or one attribute is spelled differently across the changed calls, so a
  search for it misses events.

Error text can be a contract. Callers may compare it, clients may display or
parse it, and alerts and log queries may match it. Inspect available consumers
before rewording, and say when they lie outside the snapshot. The level of an
event classifies an outcome and can drive alerts; a mismatched level is an
observation whose remedy changes a decision, so leave that remedy unresolved.

Adding events, metrics or traces that do not exist is a new capability, not this
profile's remedy. What a message discloses, and its volume or cardinality, belong
to other reviews. Error types, `%w` versus `%v`, matching, translation and which
layer reports stay with error-expression; this profile owns what the output
shows. Show what a reader of the output learns that they could not before.
