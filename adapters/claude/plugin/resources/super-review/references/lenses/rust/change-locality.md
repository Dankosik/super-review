# Rust change locality

## rust.change.localize-existing-variation

**Coordinated change.** Does one existing responsibility require editing scattered
modules, parallel tables or unrelated branches? Trace a concrete supported change
and identify coordination a new boundary would remove. Do not design for
hypothetical future plugins or products.

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

Conditional platform or feature implementations may deliberately have parallel
shapes without coexisting. Preserve that distinction and public paths/re-exports.
Narrowing visibility or moving a type can affect downstream users despite unchanged
local calls. Prefer a compatible internal boundary when consumer evidence is
incomplete, or retain the current organization.
