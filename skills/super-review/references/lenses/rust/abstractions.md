# Rust abstractions

## rust.abstractions.earn-the-boundary

**Useful boundaries.** Which existing responsibility or variation does this
trait, generic parameter, wrapper or macro hide, and what must callers learn
in exchange? Prefer removing knowledge to forwarding calls through interface
twins. A single implementation may serve a real capability boundary; its count
alone does not establish a finding.

Concrete types and functions are often enough. Generics can express capabilities;
`dyn Trait` can express heterogeneous values or an established runtime boundary.
Neither dispatch choice is inherently better. Inspect uses before changing bounds,
associated types or public implementability. Dyn compatibility and supported
async-trait usage may rule out an apparently simpler signature.

Macros can legitimately capture syntax or share structure. Replace one with a
function only when the same job remains clear without changing evaluation or
ownership. Preserve relevant trait and macro contracts. Avoid new frameworks
or dependencies without an existing in-scope burden.

For a demonstrated generic-API burden, distinguish an associated result fixed by
an implementation from a parameter callers genuinely choose. Localize a bound to
the operation needing it when that removes unrelated obligations; inspect other
impls and downstream compatibility first. Native async trait syntax does not by
itself preserve a dyn boundary or the returned future's `Send` contract. Do not
replace existing erasure/boxing merely because newer syntax is available.

Compare a derive's documented/generated impl contract, not its line count. A
straightforward derive can replace field-by-field plumbing; a manual impl can
avoid an unnecessary generic bound (for example cloning a function pointer need
not clone its result type). A macro can usefully express domain syntax, while one
that hides significant public methods or bounds may add a second language to
learn. Use supplied expansion, accessible source or documented contracts only;
do not execute procedural macros to settle the comparison.

Background: [associated types](https://doc.rust-lang.org/book/ch20-02-advanced-traits.html),
[Clone derivation](https://doc.rust-lang.org/std/clone/trait.Clone.html),
and [dyn compatibility](https://doc.rust-lang.org/reference/items/traits.html#dyn-compatibility).
