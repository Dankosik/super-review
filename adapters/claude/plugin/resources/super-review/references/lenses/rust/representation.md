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

Compare construction, matching and actual consumers. Representation changes may
affect serialization, FFI layout, visibility, trait/auto-trait implementations
and destruction. A wire DTO is not a private domain model. Do not add new states
or silently change an encoding. Prefer a compatible internal view or explanation
when an external contract cannot change.
