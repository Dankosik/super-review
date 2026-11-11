# Rust data flow

## rust.data.make-transformations-visible

**Ownership narrative.** Can readers follow a value's origin, transformations,
mutation and eventual owner? Inspect actual uses, not isolated `.clone()` or
`&mut` tokens. Name the obscured transition and the smallest clarification.

Borrowing can clarify access that need not retain an argument. An owned input
can state a real transfer more directly than borrowing and cloning internally.
A snapshot, shared handle or value moved into a task may require ownership.
Keep those choices when borrowing would spread lifetime constraints or alter
the contract. Local mutation is ordinary Rust; an `Arc` clone is not a deep
copy.

Compare intermediate bindings, loops and pipelines by the story they tell.
A `collect` may deliberately finish work, release a borrow or freeze a result.
Preserve implicated aliasing, mutation and evaluation boundaries. Name the
reading benefit itself; a speedup or allocation reduction is a separate claim.

Rust lets a value be bound once, by the expression that decides it. A `let mut`
given a placeholder and assigned in the branches below, a variable reused for a
second meaning, or `mut` kept for one later assignment makes the reader track
state that `let x = if ..`, a `match`, a block expression or shadowing settles
on one line. Shadowing a value through its refinements (`let line =
line.trim();`) is the idiom; numbered or type-suffixed twins of one value are
not. Keep a mutable accumulator where several steps really update it. A value
mutated only while it is set up can be rebound without `mut` (`let config =
config;`, or a block that returns it), so the compiler holds later code to the
finished value.

Ownership has plainer spellings than a copy. A `clone` made only so a borrow
can end, a `to_owned` passed to a function that only reads, or a field cloned
out of a value consumed on the next line states a second owner that does not
exist. A reference, a move, destructuring the owner, or `mem::take` and
`Option::take` on a field that really changes hands says what happens; check
that the state left behind is valid on every exit. A clone or `RefCell` that
exists because a `&mut self` method blocks a borrow of another field often
points at the receiver: a function taking just the fields it needs, or a
smaller struct that groups them, lets the two borrows coexist. `Rc`, `Arc`,
`RefCell` and `Mutex` state several owners or a shared mutation: when one owner
already has `&mut` access, a plain field tells the truer story. Keep a copy of
small immutable data where the borrow that avoids it would complicate the code
more than the copy does.

In iteration, look for an index used only to fetch `v[i]` and its neighbour,
where items, `windows`, `zip`, `chunks` or `enumerate` name the unit; a
`collect` whose only reader iterates once more or asks `len`; a `contains_key`
followed by `insert`, where `entry` states one decision, or followed by `get`,
where `if let Some(..) = map.get(..)` asks once; and a hand-rolled fold that is
`sum`, `any`, `all`, `find`, `min_by_key` or `max_by_key`. `insert` replaces
and `entry` need not, so compare what happens to an existing value. Prefer the
loop again once the chain needs effects, early exits or more state than a
reader can hold; a conversion pays only when the result reads naturally.

In conversions, `u64::from(x)` states a lossless widening and stops compiling
if the types stop allowing it, and `try_from` states a checked one. `as`
converts silently, so keep it where its exact truncating or wrapping semantics
are meant. A string assembled by `+`, `push_str` and `to_string` across several
statements usually reads as one `format!`.

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
all-or-nothing output or a snapshot; deleting a container helps by removing its
coordination obligation, which moving it into the caller does not.
