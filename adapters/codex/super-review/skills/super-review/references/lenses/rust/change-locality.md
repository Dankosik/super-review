# Rust change locality

## rust.change.localize-existing-variation

**Coordinated change.** Does one existing responsibility require editing scattered
modules, parallel tables or unrelated branches? Trace a concrete supported change
and identify the Shotgun Surgery a new boundary would remove. Design for
variation present today; a boundary for hypothetical future plugins or products
is Speculative Generality.

A module, impl block or domain type can place related knowledge together. Several
small files are not automatically better than one cohesive module; a new workspace
crate may impose more navigation and API obligations than it removes. Compare
actual dependency direction and uses.

A changed rule copied locally from the code that already owns it, such as an
error classification, a default value, a configuration source, a retry policy
or a shutdown sequence, makes the next change to that rule a coordinated edit.
Point to the existing owner and recommend extending it. Likewise, a replacement
that keeps its superseded path, compatibility shim or fallback leaves two paths
to maintain. For an internal path that inspected source shows nothing selects,
recommend removing it. A public or external path follows the shared
compatibility judgment; when a current consumer keeps either path alive, its
selection and removal condition belong where a maintainer will find them.

Rust can make the compiler list the places a change must visit. An exhaustive
`match` over an enum this crate owns, a struct literal without
`..Default::default()` and a pattern without `..` turn a new variant or field
into an error at every site that must decide. A `_` arm, a rest pattern or a
default fill takes those sites off the list, and the next change then depends
on a search. Recommend the exhaustive form where each site makes a decision per
variant or field. Keep the wildcard for a foreign or `#[non_exhaustive]` type
and for a remainder that is uniform by intent, and the default fill where new
fields should stay invisible to that caller. Likewise, a set of strings or
integers the crate defines and compares in several modules becomes one visible
set as an enum.

Conditional platform or feature implementations may deliberately have parallel
shapes without coexisting. Preserve that distinction and public paths/re-exports.
Narrowing visibility or moving a type can affect downstream users despite unchanged
local calls. Prefer a compatible internal boundary when consumer evidence is
incomplete, or retain the current organization.
