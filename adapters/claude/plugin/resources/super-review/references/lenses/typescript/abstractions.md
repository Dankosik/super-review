# Abstractions

## ts.abstractions.earn-the-boundary

**Abstraction cost.** Does the boundary let callers understand less, or make them
learn another mechanism? Inspect its real implementations and uses. Prefer a plain
function or structural type when an interface twin, factory, inheritance layer,
or generic wrapper adds no independent contract. Keep a class or adapter that owns
meaningful behavior, lifecycle, or substitution.

Type parameters should express useful relationships, including inferred return
types and callbacks, not merely repeat constraints. Compare a conditional/mapped
type with a simpler named shape or standard utility by the knowledge a maintainer
must reconstruct. Do not count textual occurrences of a parameter to decide whether
it is needed. Retain generics and overloads that preserve input/output correlations
or useful inference; reducing them to a broad union can erase the API contract.

Choose `type` or `interface` by the needed union/composition/augmentation semantics
and effective team rules, not a universal preference. Preserve public structural
compatibility, inference, and declaration merging before recommending a replacement.
Name the indirection removed and explain why the surviving boundary is sufficient.
