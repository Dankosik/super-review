# Rust representation

## rust.representation.express-concepts

**Explicit concepts.** Can readers understand implemented states and their data
from the representation, or reconstruct a protocol across flags, sentinels or
parallel collections? Explain the burden assuming the implementation works as
intended. Bug prevention alone is outside scope.

An enum with associated data, an existing domain type or a small newtype can give
an implicit concept one home. Keep tuples, options or primitives when the local
operation already explains them. Do not introduce typestate machinery or wrap
every value merely because Rust can encode it.

Compare the current representation with its strongest simpler alternative through
one complete read or transition. Name the relationships each leaves the maintainer
to preserve: positional correspondence, mutually dependent fields, duplicated
state or updates in several places. Fewer fields are not necessarily fewer
relationships. A remaining budget may replace a limit and consumed count when
neither original value is needed; keep stored history, reservations, snapshots or
derived values that carry an existing invariant or justified cost bound.

A type alias names a type but does not give the concept a home: two aliases of
one primitive leave readers to track which value is which by position. A newtype
gives identifiers or units that share a primitive their own concept. Keep an
invariant-bearing field private behind the operations that maintain it. Getters
over private fields of passive internal data restate the field list; a public
type may keep fields private for layout or evolution freedom under the shared
compatibility judgment.

Distinguish a useful semantic name from a stronger type guarantee. An explicit
wildcard variant can remove the need to connect parsing with empty-iterator
behavior, but a variant containing a Vec does not prove that Vec nonempty.
An empty aggregate can already express the intended identity without a wrapper;
independently varying facts need not become mutually exclusive enum variants.

Compare construction, matching and actual consumers. Representation changes may
affect serialization, FFI layout, visibility, trait/auto-trait implementations
and destruction. A wire DTO is not a private domain model. Do not add new states
or silently change an encoding. Prefer a compatible internal view or explanation
when an external contract cannot change.
