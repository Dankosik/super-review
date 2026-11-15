# Rust representation

## rust.representation.express-concepts

**Explicit concepts.** Can readers understand implemented states and their data
from the representation, or reconstruct a protocol across flags, sentinels or
parallel collections? Primitive Obsession and Data Clumps are the usual shapes
of this burden. Explain it assuming the implementation works as intended. Bug
prevention alone is outside scope.

An enum with associated data, an existing domain type or a small newtype can give
an implicit concept one home. Keep tuples, options or primitives when the local
operation already explains them. Typestate machinery or a wrapper earns its
place by expressing a concept the code already maintains, not because Rust can
encode it.

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

Look for facts the type could carry and the code re-derives: a `String` or
integer compared against literals to select behavior, where an enum names the
closed set; a duration, path, address or count held as a bare integer or string
and converted at each use, where `Duration`, `PathBuf`, `IpAddr` or a `NonZero`
type keeps the unit; an `Option` field that is `None` only between construction
and a later `init`, which every reader then unwraps; `Option<Vec<T>>` or
`Option<String>` whose `None` and empty mean the same; a tuple stored in a field
or crossing a function boundary whose members are told apart by position; a
`Vec` kept sorted or duplicate-free by hand, where a set or map states it; a
value pieced together by assigning fields of a `Default` one at a time, where a
literal shows the whole; a comment saying when a field is valid or meaningful,
which an enum variant holding that field would state. Each is a candidate only
with the readers who pay for it: a wire type keeps its published shape, and a
`None` that callers act on is a state.

A checked value should not look unchecked. When validated input travels on as
the raw `String` or number, later code checks it again or asserts on trust.
Prefer a shape that cannot hold the invalid state, such as an enum or a
non-empty collection type. Where that is impractical, a newtype with a private
field and a validating constructor lets each consumer state what it requires in
its signature. Trace the other ways to build it, such as `Deserialize`,
`Default`, a public field or a `From` impl, before calling the property
carried; a single unreachable branch is too little to carry a new type.

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
