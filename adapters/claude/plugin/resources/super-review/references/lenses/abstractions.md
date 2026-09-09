# Abstractions

## go.abstractions.earn-the-boundary

**Information hiding.** Inspect a boundary and its actual consumers. What policy,
variation, representation, or dependency knowledge does it remove from callers?
Compare that benefit with the concepts and navigation it adds. A wrapper that
passes the same knowledge through another layer may add no useful boundary.

Retain narrow consumer interfaces that isolate a real dependency, even with one
implementation. Keep wrappers that own units, adaptation, error translation,
retries, or lifetime; they are not mere forwarding. A short implementation can
still hide meaningful knowledge.

For a boundary already implicated by the PR, compare the existing form with an
ordinary function, concrete type, or an existing project/library operation.
Reuse helps when semantics match and a familiar operation replaces custom
mechanics. Do not introduce a dependency just to remove a few lines. Generics
should express a real algorithm or type relationship, not naming symmetry.

Show what consumers no longer need to understand and preserve the boundary's
observable contract. Neither deleting all abstractions nor introducing a new
architecture is this lens's goal. Keep the boundary when its current benefit
outweighs its indirection.
