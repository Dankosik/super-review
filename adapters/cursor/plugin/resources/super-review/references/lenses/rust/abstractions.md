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
