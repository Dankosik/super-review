# API clarity

## ts.api.express-the-call

**Contracts at the call.** Read the signature and representative calls together.
Can callers understand options, units, absence, results, callbacks, and ownership
without reconstructing the implementation? Prefer a small clarification over a
builder or options hierarchy. A local boolean or ordinary tuple can be clear;
named options or result fields help when positional meaning is repeatedly hidden.

Use annotations where they communicate a deliberate boundary; retain inference
for obvious locals and useful generic results. Optional callback parameters express
that an argument may be omitted by the caller of that callback, not merely that a
callback implementation may ignore it. Preserve accepted calls and return correlation
when replacing overloads with unions. Handwritten declarations and module augmentations
are public contracts, not implementation-free formatting opportunities.

`satisfies` (TypeScript 4.9+) can check a value against a shape while retaining a
more specific inferred type; it is not a universal substitute for a widening
annotation, assertion, or runtime check. Inspect contextual typing and later writes.
For TSX, judge actual props and uses under the established framework, not a blanket
`React.FC`, children, or component-style rule. Show a call before/after and what
knowledge callers no longer need; withhold incompatible exported changes when
consumer evidence is unavailable.
