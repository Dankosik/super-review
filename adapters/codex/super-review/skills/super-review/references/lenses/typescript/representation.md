# Representation

## ts.representation.express-concepts

**State expressed directly.** Does the data shape expose the concepts already
present, or make every reader reconstruct relationships among flags, optional
fields, parallel arrays, or string keys? Read producers and consumers before
recommending a representation. A discriminated union can make existing correlated
alternatives explicit; it must not invent forbidden states or new domain rules.

Compare a named object, tuple, union, `Map`, or record by the relationship it makes
visible. A short-lived tuple or simple object can already be clear. Preserve
serialization shape, property presence, iteration/key semantics, identity, and
consumer compatibility when the representation crosses a boundary. An enum has
runtime behavior; replacing it with a union is not necessarily type-only.

Use `as const` or a literal union only when the intended narrowness helps express
the existing contract. Do not freeze a deliberately widening or mutable shape by
habit. Show which repeated interpretation disappears, and retain the existing
representation when a wrapper or type-level encoding would add more explanation.
