# Rust representation

## rust.representation.express-concepts

**Explicit concepts.** Can readers understand implemented states and their data
from the representation, or must they reconstruct a protocol across flags,
sentinels, or parallel collections? Primitive Obsession and Data Clumps are the
usual shapes of this burden. Judge assuming the code behaves as intended; bug
prevention alone is outside scope.

Compare the representation with its strongest simpler alternative across
construction, matching, and consumers:
- **Aligned state and relationships**: collapse mutually dependent fields,
  two-phase `Option` init fields unwrapped by every reader, `Option<Vec<T>>` or
  `Option<String>` where `None` and empty mean the same, boolean/wakeup pairs
  covered by one state-carrying primitive, mode-only fields inert in other
  modes, or derived projections passed alongside their source registry by hand
  into an enum with associated data, a cohesive struct, or a borrow-linked view
  (fewer implicit caller obligations beat fewer fields).
- **Domain units and closed sets**: replace string or integer tags, bare
  duration/path/address/count primitives converted at each use, manually
  deduplicated/sorted `Vec`s, field-by-field `Default` mutation where a struct
  literal shows the whole value, or positional boundary tuples with an enum,
  standard domain type (`Duration`, `PathBuf`, `IpAddr`, `NonZero*`), set/map,
  or newtype (`type` aliases do not separate shared primitives).
- **Carried validity**: when validated input travels further, prefer a shape
  that cannot hold the invalid state or a newtype with private fields and a
  validating constructor, tracing every construction path (`Deserialize`,
  `Default`, `From`, public fields) before calling a property carried (an enum
  variant holding `Vec<T>` does not prove non-emptiness, and a single
  unreachable branch does not justify a wrapper).

**Keep when:** local context already explains a tuple, `Option`, or primitive;
`None` is a distinct caller state; empty aggregates already express identity;
independent facts vary orthogonally rather than as mutually exclusive variants;
stored snapshots, reservations, or cached projections preserve a point-in-time
invariant or justified cost bound; private fields on a public type preserve
layout or evolution freedom (passive internal structs need no getters); or
wire/Serde, FFI layout, visibility, auto-trait, or drop contracts fix the shape
(a wire DTO is not a private domain model; prefer a compatible internal view
when an external contract cannot change).
