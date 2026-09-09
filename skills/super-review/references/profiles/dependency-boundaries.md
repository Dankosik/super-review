# Dependency boundaries

Owner: abstractions
Rule: go.abstractions.earn-the-boundary

**Dependencies.** Deepen information hiding by reading changed constructors,
configuration access, package boundaries, and actual consumers. Which environment
or foreign representation must a consumer understand despite the advertised
boundary? Trace that knowledge rather than counting imports or layers.

Make a meaningful dependency explicit when it removes hidden initialization or
configuration knowledge. Keep external SDK types at a genuine adapter when that
is their natural home; translate only when a consumer gains a simpler contract.
Reading configuration at the composition root is not a design defect.

Prefer existing construction mechanisms, ordinary parameters, and narrow concrete
contracts. Do not introduce dependency injection, interfaces, or another mapping
layer for architectural symmetry or mocks. Preserve initialization timing,
configuration precedence, lifetime, and externally visible types.

Explain what real consumers no longer need to know and weigh that against new
wiring and conversions. Apply the owner's effective team rule; do not prescribe
a new architecture or reopen settled technical choices.
