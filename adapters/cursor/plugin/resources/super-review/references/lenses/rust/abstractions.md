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

A trait whose only other implementation is a test double for internal
choreography forwards calls without hiding variation; the production code pays
for an interface the program does not need. A struct constructed only to invoke
one action usually hides a function. Names such as manager, service or helpers
invite this ownership check; they do not establish a finding by themselves.

A parameter, options field, enum or type parameter for which every inspected
caller supplies the same value offers a choice nobody makes: callers construct
it and readers follow a branch with one outcome. Recommend the fixed form; the
choice can return with the caller that needs it. A possible later variant is an
imagined requirement, not a reason to keep the surface or to leave the remedy
unresolved. Keep a choice a current caller varies, and apply the shared
compatibility judgment where consumers lie outside the inspected source.

Before a new trait, look for the standard one. A crate trait whose
implementations forward to `Read`, `Write`, `Iterator`, `Display`, `FromStr` or
`Extend` repeats a contract every Rust reader and library already knows, and a
trait with one method and stateless implementations is a function or closure
parameter. Alternatives the crate itself closes, told apart by a kind tag or by
downcasting, read as an enum; keep `dyn` or generics where outside code adds
implementations or the contract leaves the set open. A type parameter
instantiated with one type needs, like a trait with one implementation, the
variation or dependency direction it serves. A layer whose methods each forward
to the next with the same arguments and result adds a place to edit without a
decision.

A bound on a generic type's declaration that only some of its methods need,
such as `T: Clone` or `T: Debug`, makes every user of the type satisfy it; the
`impl` block that needs the bound can carry it. A method body that every
implementor of a crate trait repeats can be a provided method, leaving
implementors the methods that differ.

Macros can legitimately capture syntax or share structure. Replace one with a
function only when the same job remains clear without changing evaluation or
ownership. A macro that hides a `return` or `?` takes an exit out of the
reader's sight. Preserve relevant trait and macro contracts. Avoid new frameworks
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
