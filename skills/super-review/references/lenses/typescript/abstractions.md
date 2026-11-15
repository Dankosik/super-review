# Abstractions

## ts.abstractions.earn-the-boundary

**Load-bearing boundaries.** Test each class, interface, factory, wrapper,
inheritance layer, and type-level construct against a plain function, structural
type, or local cleanup scope. Ask whether the boundary lets callers understand
less or forces them to learn another mechanism.

Check whether each seam is real. An interface twin mirroring one class, a
port/adapter layer whose only second implementation is an internal test double,
or a wrapper class, factory, builder, or inheritance layer that forwards calls
without owning an invariant is a shallow Middle Man over a hypothetical seam.
Flag type parameters that merely repeat a constraint without correlating inputs,
outputs, or callbacks; options or configuration branches every caller fixes one
way; and conditional, mapped, or derived types that force maintainers to
reconstruct an independent contract from unrelated internals when an explicit
named shape or standard utility states it directly. When supported, use standard
inference to retire hand-maintained type bridges.

**Keep when:** a deep class or adapter owns state, invariants, cross-caller
lifecycle, or real substitution; generics or overloads preserve input-output
correlations, inference, contextual typing, or excess-property checks on fresh
object literals (structural assignability alone does not preserve excess-property
checking); keyed mapped types couple each key to its own payload; or `type`
versus `interface` choice, declaration merging, readonly/optional modifiers,
union distribution, or public structural compatibility requires the current
surface. Name the indirection removed and show why the surviving boundary holds
the contract.
