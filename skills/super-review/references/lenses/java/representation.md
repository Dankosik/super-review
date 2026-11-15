# Java representation

## java.representation.express-concepts

**Data modeling.** Does the changed representation directly name existing
concepts and alternatives, or make readers remember positions, parallel indexes,
magic strings, combinations of flags, or the implicit link between a cached or
derived projection and a separately passed source? Primitive Obsession and Data
Clumps are the usual shapes of this burden. Inspect construction and consumption
together. A small value class, enum, supported record, or projection holding a
reference to its source can give correlated data one home; an existing
collection or single parsed representation may already express the fact without
keeping duplicate forms or inert mode-specific fields. A stronger type expresses
invariants and requirements the code already maintains; the product's invariants
themselves stay as they are.

A record is a transparent value carrier, not a universal class replacement.
Before recommending one, inspect identity versus component equality, constructor
and accessor names, mutability/aliasing, serialization, inheritance, and framework
requirements. Final component references do not provide deep immutability, and
arrays have their own equality semantics. Keep an entity, proxyable bean, mutable
aggregate, or identity-bearing object when its contract requires that form.

Choose a sealed family only for real closed alternatives that benefit from
separate shapes, not because a switch exists. Preserve order, duplicates, nulls,
units, and external representations when changing collection or value types.
A tiny local pair or obvious flag does not automatically require another class.

Show which decoding convention readers no longer need and which conversions or
new concepts the proposal introduces.
