# Change locality

## ts.change.localize-existing-variation

**Cohesive change.** Would a maintainer need to edit several unrelated-looking
places to change one already implemented responsibility? That is Shotgun
Surgery. Trace that responsibility
through its current declarations and uses. Bring related decisions together when
it reduces coordinated editing without obscuring ownership.

A local typed mapping can clarify an existing fixed correspondence. A registry or
plugin architecture answers variants present today; for imagined variants it is
Speculative Generality. Retain separate boundary adaptations when they have
independent reasons to change. Keep a small feature together even where a directory
convention offers generic `types`, `utils`, and `constants` layers.

When moving declarations or exports, inspect import cycles, runtime module evaluation,
package exports, and type-only consumers implicated by the move. A barrel can be a
useful public boundary or an extra indirection; it is not automatically wrong.
Explain the specific future edit already implied by existing code that becomes
more local. The evidence is existing code, and the claim is locality rather than
performance.
