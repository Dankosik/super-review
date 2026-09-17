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
