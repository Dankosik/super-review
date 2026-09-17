# Duplication

## ts.duplication.share-knowledge

**One fact, one owner.** Are separate fragments encoding the same decision and
requiring coordinated edits? Compare their purpose, callers, and reasons to change.
Share a domain transformation or constant when one owner removes that coordination;
retain coincidentally similar shapes in independently evolving boundaries.

A type derived from an existing schema or value can remove duplicate declarations
when the relationship is intentional and that facility already exists. Do not
introduce a schema dependency or derive every transport/domain/UI type from one
large object. `Pick`, `Omit`, indexed access, and `ReturnType` can couple consumers
to implementation details; an explicit public shape may be clearer and more stable.

Establish the direction of derivation. A schema's accepted input can differ from
its parsed/transformed output; choose the library's existing input/output facility
for the phase consumers actually use. Keep independent public shapes even when
currently equal. Deriving a type does not authorize adding parsing, defaults or
coercion to a runtime path. Likewise, `keyof typeof` can follow a complete registry
that owns the key set, but a partial label/handler table must not define the domain.
A known domain type may instead constrain its table while keeping value inference.

For repeated types and handlers, show which exact knowledge is shared and which
adaptation stays local. A configurable helper with flags for unrelated cases can
be worse than small repetition. Do not deduplicate solely because text matches,
or replace clear project helpers with a newly invented utility framework.
