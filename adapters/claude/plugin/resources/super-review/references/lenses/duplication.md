# Duplication

## go.duplication.share-knowledge

**Shared knowledge.** Compare the repeated implementations and their actual
consumers. Establish which existing decision they encode, who owns it, and why
they should change together. Similar text, fields, or types do not establish a
shared rule; do not infer policy ownership from appearance alone.

Search from decisions, not only from text. Start with the decisions the assigned
code makes or the change edits: limits and constants, classifications, mappings
between key sets, validation rules and formats. Prefer those carrying an
external identifier or a distinctive value; a common value such as `0`, `1` or
`100` is a key only together with its unit or identifier. Search the whole
snapshot beyond the assigned area with keys a rewrite would keep: the value in
other spellings and units, such as `30*time.Second` and `30000`; external
identifiers such as header, metric, environment, table, route and error-code
names; and sibling functions with the same input and result types. Names and
call shapes alone find only literal copies. Read each match. A partition limits
where a candidate is anchored, not where its partners may be.

When the change edits a decision and a base revision exists, also search for the
old value and old names. A copy still holding the old value may be divergence
the change introduced; report it when the copies encode one decision, by the
same evidence as any other partner.

A partner may sit outside reviewed source: a configuration file, chart,
migration, schema or protocol definition that states the same value or key set.
Read it as evidence and anchor the candidate in reviewed source. A default that
applies only when the external value is absent, such as a local-run fallback, is
not a second owner of that value.

Go has no exhaustive switch, so a table over a key set is not connected to its
counterpart by the compiler. For a key set the assigned code declares or edits,
read both directions: encode and decode, format and parse, label and lookup.

Name the searched decisions and their keys in the coverage you already report,
so a clean result shows what was looked for.

Centralize demonstrated shared knowledge in the smallest meaningful operation.
Conversely, separate a shared helper when flags, callbacks, or divergent caller
contracts show that unrelated decisions have been forced together. Account for
the coupling created or removed, not the number of repeated statements.

Keep coincidentally similar customer and supplier predicates separate when their
policies have independent owners. Keep ordinary local repetition when sharing
would require callers to understand more machinery than it hides. Do not decide
whether the underlying business rules are correct.

Identify every inspected participating use and the evidence for shared or
independent reasons to change. Return your duplication rationale even when the
remedy involves extraction; the parent reconciles overlapping lens candidates.
