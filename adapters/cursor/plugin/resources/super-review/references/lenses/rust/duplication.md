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

Compare implicated handwritten mechanics and inline boundary glue with existing
helpers, supported standard-library operations within `rust-version`, and the
owning crate's declared dependencies. Check whether an already-imported type or
crate owns the rule, constant or conversion written inline: re-parsing an
already-parsed value, formatting only to test an input property, matching raw
error or SQL codes a crate classifies, manual URL/header/form/unit math beside
the crate that defines it, or working around an indirect library path when a
direct method exists. When code mixes generic framing, encoding or coordination
with a domain or protocol rule, delegate the generic mechanism to the library
and keep the domain rule local. A familiar loop can be clearer than a reusable
callback or macro. Do not add a crate or raise MSRV merely to save lines.

A handwritten general mechanism — such as a date, URL or CLI grammar parser, an
encoding, or a backoff policy with jitter and caps — repeats knowledge a
maintained implementation already owns: its edge cases, parsing and failure
handling. Weigh that owned surface, not the line count. Do not propose a new
external crate for a trivial one-line formula, but do use an operation or
constant that `std`, the workspace or an already-declared crate already owns
rather than maintaining a second copy of that rule. When `std` or a declared
dependency supplies the matching contract, recommend it (naming any Cargo
feature or workspace-dependency edit if needed); when only a net-new crate
would, report the owned surface and leave adopting the crate as a named
dependency decision. A tiny fixed grammar, an explicit std-only or `no_std`
constraint, or a boundary difference can justify custom code; fewer dependencies
alone do not.

Preserve relevant accepted inputs, first-error precedence, ordering, ownership,
cancellation/drop timing, time precision, evaluation behavior, and wire or
stored bytes. When custom code must stay because the apparent `std` or crate
operation differs on one of those boundaries, retain it and let rationale check
whether that constraint is recorded at the site. A repeated match can remain
clear when its cases change independently. Retaining understandable duplication
is valid; an abstraction answers shared knowledge, which textual similarity
alone does not show.
