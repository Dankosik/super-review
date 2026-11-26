# Rust representation

## rust.representation.express-concepts

**Explicit concepts.** Can readers understand implemented domain states,
invariants, and transitions from the representation, or must they reconstruct a
protocol across flags, status strings, sentinels, or parallel collections?
Primitive Obsession and Data Clumps are the usual shapes of this burden. Judge
assuming the code behaves as intended; bug prevention alone is outside scope,
while making already-implemented business rules and valid states explicit in
types is core scope.

Compare the representation with its strongest simpler alternative across
construction, matching, and consumers:
- **Owned state transitions and phase shapes**: collapse mutually dependent
  fields, scattered field mutations across handlers, phase-only `Option` fields
  unwrapped by readers, or derived projections held apart from their source
  into an enum with phase data (for persisted records), consuming step structs
  (for linear in-memory pipelines), or private fields with transition methods.
- **Temporal coupling**: flag `step_b(&entity)` silently assuming
  `step_a(&mut entity)` already ran when a distinct phase type or validated
  output makes that ordering visible in signatures.
- **Domain units and closed sets**: replace status/role string or integer tags,
  bare business or system quantities (money without currency, calendar dates
  confused with instants, durations, paths, counts, or swappable entity IDs),
  manually deduplicated `Vec`s, or positional tuples with an enum, domain value
  type, set/map, or newtype (`type` aliases do not separate primitives).
- **Carried validity**: parse and validate once at the boundary into a shape
  that cannot hold the invalid state or a newtype with private fields and a
  validating constructor, tracing every construction path (`Deserialize`,
  `Default`, `From`, public fields) before calling a property carried (a single
  unreachable branch does not justify a wrapper).

**Keep when:** local context already explains a tuple, `Option`, or primitive;
plain text fields carry neither a domain invariant nor argument-swap ambiguity
(do not over-newtype every field); persisted entities or heterogeneous
collections would suffer generic typestate (`Entity<State>`) ceremony where a
runtime enum with phase data is direct; `None` is a distinct caller state;
independent facts vary orthogonally; stored snapshots or cached projections
preserve point-in-time invariants; private fields preserve evolution freedom
(passive internal structs need no getter layers); or wire/Serde, FFI layout,
visibility, auto-trait, or drop contracts fix the shape (keep wire DTOs
distinct from domain models).
