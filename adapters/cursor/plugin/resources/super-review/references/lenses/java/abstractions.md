# Java abstractions

## java.abstractions.earn-the-boundary

**Load-bearing boundaries.** Test each class, interface, hierarchy, builder,
factory, and generic type against a direct concrete class, record, method,
constructor, or `try`-with-resources scope. Ask what decision the boundary hides
from callers versus the indirection it adds.

Check whether each seam is real. A `*Service`/`*ServiceImpl` interface twin
whose only other implementation is an internal test double is a hypothetical
seam; a layer forwarding calls unchanged is a Middle Man; inheritance used only
to share helper code couples implementations where composition states the
collaboration directly; and a single-use wrapper class, builder, factory,
registry, or fluent chain holding no invariant of its own adds ceremony without
hiding complexity. Deepen leaky boundaries that push raw maps, casts, boolean
modes, or framework plumbing into callers, and collapse speculative generic
parameters built for hypothetical future types rather than a real type
relationship at call sites.

**Keep when:** an interface, superclass, wrapper, or annotation participates in
real substitution, an extension boundary, framework proxies, reflection, service
loaders, serialization, or public/protected consumer contracts, or when missing
dynamic/external context leaves that contract open. Add no new dependency or
architectural layer unless the code in scope already shows the burden. Show what
implementation detail callers stop carrying.
