# Representation

## go.representation.express-concepts

**Representation.** Read changed data declarations and their actual construction,
transformation, and use. Which existing concepts and relationships must a reader
reconstruct from positions, flags, primitive values, or repeated agreements?
Compare the current form with the smallest representation making that knowledge
visible, including its conversions and vocabulary.

Ordinary Go structs and defined value types can express real concepts. Distinguish
a defined type from an alias when identity or methods matter; do not add wrappers,
getters, or constructors for every primitive. Useful zero values may already avoid
an initialization protocol. Pointers can express meaningful absence or sharing;
replacing them with values can erase a distinction. Enumerated constants need not
become an interface hierarchy, and externally supplied values may not be closed.

Related values may belong together; genuinely exclusive modes may deserve one
explicit representation. Preserve independent flags and dynamic data. Maps or
parallel arrays can be deliberate. Do not impose a state machine or redesign the
product's invariants to prevent hypothetical mistakes.

Trace consumers before a type change. Preserve struct tags, marshaling methods,
external formats, nil/empty distinctions, comparability, identity, ownership, and
ordering. A storage or public API migration is not local cleanup; narrow or withhold
advice when compatibility evidence is missing.

Show which relationship readers no longer need to remember. Data flow owns how
values move; API clarity owns the call; this lens owns the shape expressing values.
Keep a deliberate representation whose actual use explains its cost.
