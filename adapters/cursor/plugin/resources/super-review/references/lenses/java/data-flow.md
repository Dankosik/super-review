# Java data flow

## java.data.make-transformations-visible

**Value history.** Can readers see where a value comes from, how it changes, and
who can mutate or retain it? Trace the changed value through relevant uses.
Prefer local variables and direct transformations over hidden fields or captured
mutable holders when that removes state tracking. Keep a clear local accumulator;
mutation alone does not justify an immutable redesign.

Choose a loop, stream pipeline, or named intermediate by the transformation it
exposes. Side-effecting lambdas, mutable captures, and nested collectors may hide
what a straightforward loop states directly; a simple filter/map pipeline may
remove distracting mechanics. Do not infer performance benefits or parallelize
work as a readability recommendation.

When replacing collection operations, distinguish mutable copies, fixed-size
lists, unmodifiable live views, and snapshots. `List.copyOf` rejects null elements;
`Stream.toList` returns an unmodifiable list, while `Collectors.toList` does not
promise a particular mutability or implementation. Check actual caller needs,
null policy, aliases, ordering, and element mutability. A `final` reference does
not make its object immutable. Lazy stream operations also change when work runs;
resource-backed streams carry a lifetime beyond a collection transformation.

Name the hidden transformation or ownership fact that becomes visible, including
the strongest reason to retain the current expression of the value history.
