# Java representation

## java.representation.express-concepts

**Data modeling.** Does the changed representation directly name existing
concepts and alternatives, or make readers remember positions, parallel indexes,
magic strings, and combinations of flags? Inspect construction and consumption
together. A small value class, enum, or supported record can give stable data a
name; an existing collection may already express the relationship without a new
domain type. Do not manufacture invariants or future business requirements.

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
