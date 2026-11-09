# Duplication

## ts.duplication.share-knowledge

**One fact, one owner.** Are separate fragments encoding the same decision and
requiring coordinated edits? Compare their purpose, callers, and reasons to
change. Share a domain transformation or constant when one owner removes that
coordination; retain coincidentally similar shapes in independently evolving
boundaries.

Search from decisions, not only from text. Start with the decisions the assigned
code makes or the change edits: limits and constants, classifications, mappings
between key sets, validation rules and formats. Prefer those carrying an
external identifier or a distinctive value; a common value such as `0`, `1` or
`100` is a key only together with its unit or identifier. Search the whole
snapshot beyond the assigned area with keys a rewrite would keep: the value in
other spellings and units, such as `30_000` and `"30s"`; external identifiers
such as header, metric, environment, table, route and error-code names; and
sibling functions with the same input and result types. Names and call shapes
alone find only literal copies. Read each match. A partition limits where a
candidate is anchored, not where its partners may be.

When the change edits a decision and a base revision exists, also search for the
old value and old names. A copy still holding the old value may be divergence
the change introduced; report it when the copies encode one decision, by the
same evidence as any other partner.

A partner may sit outside reviewed source: a configuration file, chart,
migration, schema or protocol definition that states the same value or key set.
Read it as evidence and anchor the candidate in reviewed source. A default that
applies only when the external value is absent, such as a local-run fallback, is
not a second owner of that value.

Name the searched decisions and their keys in the coverage you already report,
so a clean result shows what was looked for.

An exhaustive `never` check or a required property connects its copies through a
compile error, so such a copy costs an extra edit rather than silent divergence;
judge it by that cost. A reverse table, such as a parser or lookup ending in a
`default` branch, is not connected even when its forward table is exhaustive;
read both directions for a key set the assigned code declares or edits.

A type derived from an existing schema or value can remove duplicate
declarations when the relationship is intentional and that facility already
exists. Do not introduce a schema dependency or derive every transport/domain/UI
type from one large object. `Pick`, `Omit`, indexed access, and `ReturnType` can
couple consumers to implementation details; an explicit public shape may be
clearer and more stable.

Establish the direction of derivation. A schema's accepted input can differ from
its parsed/transformed output; choose the library's existing input/output
facility for the phase consumers actually use. Keep independent public shapes
even when currently equal. Deriving a type does not authorize adding parsing,
defaults or coercion to a runtime path. Likewise, `keyof typeof` can follow a
complete registry that owns the key set, but a partial label/handler table must
not define the domain. A known domain type may instead constrain its table while
keeping value inference.

For repeated types and handlers, show which exact knowledge is shared and which
adaptation stays local. A configurable helper with flags for unrelated cases can
be worse than small repetition. Do not deduplicate solely because text matches,
or replace clear project helpers with a newly invented utility framework.
