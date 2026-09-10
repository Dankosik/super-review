# Change locality

## ts.change.localize-existing-variation

**Cohesive change.** Would a maintainer need to edit several unrelated-looking
places to change one already implemented responsibility? Trace that responsibility
through its current declarations and uses. Bring related decisions together when
it reduces coordinated editing without obscuring ownership.

A local typed mapping can clarify an existing fixed correspondence; do not replace
every switch with a registry or create a plugin architecture for imagined variants.
Retain separate boundary adaptations when they have independent reasons to change.
Do not scatter a small feature into generic `types`, `utils`, and `constants` layers
solely to follow a directory convention.

When moving declarations or exports, inspect import cycles, runtime module evaluation,
package exports, and type-only consumers implicated by the move. A barrel can be a
useful public boundary or an extra indirection; it is not automatically wrong.
Explain the specific future edit already implied by existing code that becomes
more local, without inventing a product extension or claiming a performance gain.
