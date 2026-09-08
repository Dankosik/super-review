# Abstractions

## go.abstractions.earn-the-boundary

An interface, wrapper, generic helper, or layer should express a useful concept,
hide relevant knowledge, adapt a dependency, or localize existing variation.
Assess that benefit against the extra indirection at actual callers.

Useful: remove a wrapper that only forwards identical arguments and results,
adds no policy or lifecycle, and hides nothing useful from its callers.
Counterexample: retain a single-implementation interface at a consumer that
isolates an external storage dependency. One implementation is not disproof.

A wrapper that owns retries, units, error translation, or lifetime has behavior
to preserve; do not treat it as mere forwarding. Prefer ordinary concrete Go
unless a present boundary benefits from an interface. Do not replace removed
indirection with another abstraction solely for naming symmetry.

This lens evaluates boundaries already implicated by the PR, not a new overall architecture.
