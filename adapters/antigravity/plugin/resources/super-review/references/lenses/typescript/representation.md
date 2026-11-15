# Representation

## ts.representation.express-concepts

**State expressed directly.** Does the data shape expose the concepts already
present, or make every reader reconstruct relationships among flags, optional
fields, parallel arrays, string keys, or a cached/derived projection kept apart
from its source so callers must keep two arguments or fields aligned? Primitive
Obsession and Data Clumps are the usual shapes of this burden. Read producers
and consumers before recommending a representation. A discriminated union,
linked reference, or single parsed representation can make correlated states and
invariants explicit instead of leaving inert fields, paired boolean flags, or
duplicate representations to drift.

Compare a named object, tuple, union, `Map`, or record by the relationship it makes
visible. A short-lived tuple or simple object can already be clear. Preserve
serialization shape, property presence, iteration/key semantics, identity, and
consumer compatibility when the representation crosses a boundary. An enum has
runtime behavior; replacing it with a union is not necessarily type-only.

Use `as const` or a literal union only when the intended narrowness helps express
the existing contract, and leave a deliberately widening or mutable shape open.
Show which repeated interpretation disappears, and retain the existing
representation when a wrapper or type-level encoding would add more explanation.
