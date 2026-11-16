# Rust duplication

## rust.duplication.share-knowledge

**Repeated knowledge.** Do these blocks encode one domain decision or just look
alike while serving different concepts? Identify a concrete coordinated edit
that sharing would remove and the actual callers of the shared form. Keep
independent concepts separate when combining them adds flags or trait bounds.

Search from decisions, not only from text. Start with the decisions the assigned
code makes or the change edits: limits and constants, classifications, mappings
between key sets, validation rules and formats. Prefer those carrying an
external identifier or a distinctive value; a common value such as `0`, `1` or
`100` is a key only together with its unit or identifier. Search the whole
snapshot beyond the assigned area with keys a rewrite would keep: the value in
other spellings and units, such as `Duration::from_secs(30)` and `30_000`;
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

An exhaustive `match` or a required struct field connects its copies through a
compile error, so such a copy costs an extra edit rather than silent divergence;
judge it by that cost. A reverse table, such as a `FromStr` or label lookup
ending in a `_` arm, is not connected even when its forward `match` is
exhaustive; read both directions for a key set the assigned code declares or
edits.

**Maintained owners.** Compare handwritten mechanics and inline boundary glue
with workspace helpers, `std` operations within `rust-version`, and declared
dependencies (re-parsing parsed values, formatting only to test an input
property, matching raw error or SQL codes a crate classifies, manual
URL/header/form/unit plumbing beside the crate that owns it, or indirect library
workarounds when a direct API exists). Delegate generic framing, encoding,
parsing, backoff, or coordination to `std` or the declared crate (naming any
Cargo feature or workspace-dependency edit; when only a net-new crate handles
non-trivial edge cases, name adopting it as a dependency decision) and keep
domain or protocol rules local. Never propose a new crate or higher MSRV for a
trivial formula.

**Keep when:** cases evolve independently; a plain loop reads more clearly than
a callback or macro; an explicit `no_std`, std-only, or tiny fixed-grammar
constraint justifies local code; or the candidate `std`/crate operation differs
on accepted inputs, first-error precedence, ordering, ownership,
cancellation/drop timing, time precision, evaluation behavior, or wire/stored
bytes (retain custom code and let `rationale` check whether that boundary is
recorded at the site).
