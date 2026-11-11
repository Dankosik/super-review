# Abstractions

## ts.abstractions.earn-the-boundary

**Abstraction cost.** Does the boundary let callers understand less, or make them
learn another mechanism? Inspect its real implementations and uses and apply the
deletion test. Prefer a plain function or structural type when a shallow interface
twin, factory, inheritance layer, or generic wrapper adds no independent contract
and only passes knowledge through as a Middle Man. Keep a deep class or adapter
that owns meaningful behavior, lifecycle, or substitution.

Type parameters should express useful relationships, including inferred return
types and callbacks, not merely repeat constraints. Compare a conditional/mapped
type with a simpler named shape or standard utility by the knowledge a maintainer
must reconstruct. Judge whether a parameter is needed by the relationship it
expresses, whatever its textual occurrences. Retain generics and overloads that
preserve input/output correlations or useful inference; reducing them to a broad
union can erase the API contract.

A parameter can also preserve accepted input forms without appearing in the result:
inspect fresh object-literal calls, contextual typing and explicit type arguments
before replacing a generic with its constraint. Structural assignability alone does
not establish identical excess-property checking at those calls. Retain useful
openness; remove a parameter only when its actual role is unnecessary.

For type-level transformations, identify the source of the relationship and the
resulting shape, including optional/readonly modifiers and distribution over unions.
Keep a keyed mapping that couples each key to its own payload; prefer an explicit
shape when deriving it makes an independent contract depend on unrelated internals.
A standard inference mechanism can remove a hand-maintained bridge when supported;
extra precision is a gain while it keeps deliberate widening and caller obligations.

Choose `type` or `interface` by the needed union/composition/augmentation semantics
and effective team rules, not a universal preference. Preserve public structural
compatibility, inference, and declaration merging before recommending a replacement.
Name the indirection removed and explain why the surviving boundary is sufficient.
