# Rust data flow

## rust.data.make-transformations-visible

**Ownership narrative.** Can readers follow a value's origin, transformations,
mutation and eventual owner? Inspect actual uses, not isolated `.clone()` or
`&mut` tokens. Name the obscured transition and the smallest clarification.

Borrowing can clarify access that need not retain an argument. An owned input
can state a real transfer more directly than borrowing and cloning internally.
A snapshot, shared handle or value moved into a task may require ownership.
Keep those choices when borrowing would spread lifetime constraints or alter
the contract. Local mutation is not an anti-pattern; an `Arc` clone is not a
deep copy.

Compare intermediate bindings, loops and pipelines by the story they tell.
A `collect` may deliberately finish work, release a borrow or freeze a result.
Preserve implicated aliasing, mutation and evaluation boundaries. Do not claim
a speedup or allocation reduction as the sole clarity benefit.

Trace conversions through the whole operation. Rebuilding and revalidating a
property already preserved by the intermediate steps can add an unnecessary
failure path or require the reader to re-establish the same fact. Compare a
direct transformation using the existing text, bytes or checked value; keep a
conversion that changes meaning, validates a new boundary or supplies a required
owned result. Byte-oriented processing can be appropriate for byte positions or
an established cost constraint; Unicode iteration is not a universal replacement.

When iteration maintains extra phase or carry state, compare the unit of work
with the decision: an item, adjacent pair, field, run or batch. Preserve bounded
streaming and suspension state. Keep staging that establishes error precedence,
all-or-nothing output or a snapshot; deleting a container is not an improvement
when its coordination obligation merely moves into the caller.
