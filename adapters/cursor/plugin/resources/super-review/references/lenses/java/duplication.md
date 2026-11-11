# Java duplication

## java.duplication.share-knowledge

**Shared knowledge.** Do the changed copies encode one rule that must evolve
together, or merely look similar? Identify the common decision and its actual
variation. A small domain helper or existing JDK/project operation can remove
repeated mechanics; a generic base class with hooks and flags may couple unrelated
operations more than the repeated code did.

Search from decisions, not only from text. Start with the decisions the assigned
code makes or the change edits: limits and constants, classifications, mappings
between key sets, validation rules and formats. Prefer those carrying an
external identifier or a distinctive value; a common value such as `0`, `1` or
`100` is a key only together with its unit or identifier. Search the whole
snapshot beyond the assigned area with keys a rewrite would keep: the value in
other spellings and units, such as `Duration.ofSeconds(30)` and `30_000`;
external identifiers such as header, metric, environment, table, route and
error-code names; and sibling functions with the same input and result types.
Names and call shapes alone find only literal copies. Read each match. A
partition limits where a candidate is anchored, not where its partners may be.

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

A `switch` expression over a sealed type or a required constructor parameter
connects its copies through a compile error, so such a copy costs an extra edit
rather than silent divergence; judge it by that cost. A reverse table, such as a
parser or lookup ending in a `default` branch, is not connected even when its
forward `switch` is exhaustive; read both directions for a key set the assigned
code declares or edits.

Treat DTO mapping, construction, and boundary translation in context. Similar
field assignments between distinct external contracts are not necessarily one
abstraction. Reflection, Lombok, a mapping library, or a builder earns its place
by sharing knowledge, which a lower line count alone does not show. Keep an
established generator/framework convention unless handwritten code shows a
demonstrated burden. Generated output
itself remains excluded.

When proposing reuse, name the exact supported helper/API and preserve
evaluation order, mutability, null/absence policy, exceptions, and
boundary-specific adaptation. Equal constants may represent different units or
policies. Extract the common knowledge, not accidental syntax; retain
duplication when that knowledge is independent. Show what change to the already
implemented rule becomes local, without inventing future features as a reason to
generalize.