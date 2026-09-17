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

Conditional platform or feature implementations may deliberately have parallel
shapes without coexisting. Preserve that distinction and public paths/re-exports.
Narrowing visibility or moving a type can affect downstream users despite unchanged
local calls. Prefer a compatible internal boundary when consumer evidence is
incomplete, or retain the current organization.
