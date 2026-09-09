# Representation

## go.representation.express-concepts

**Representation.** Read changed data declarations and their actual construction,
transformation, and use. Which existing concepts and relationships must a reader
reconstruct from positions, flags, primitive values, or repeated agreements?
Compare the current form with the smallest representation that makes that
knowledge visible, including any conversion and vocabulary it adds.

Related values may belong together; genuinely exclusive modes may deserve one
explicit representation. Preserve independent flags and genuinely dynamic data.
A map, parallel arrays, or a primitive can be the right representation; do not
wrap every value or introduce a state machine merely to prevent hypothetical
mistakes. Judge the implementation's existing concepts, not the product rules.

Trace affected consumers before proposing a type change. Preserve external
formats, serialization, nil/empty distinctions, identity, ownership, and ordering.
A storage or public API migration is not a free local cleanup. Narrow or withhold
advice when compatibility context is unavailable.

Show the relationship readers no longer need to remember and why this outweighs
new types, conversions, or indirection. Data flow owns how values move; API clarity
owns the call; this lens owns the shape expressing the values. Leave a deliberate
representation alone when its actual use explains the tradeoff.
