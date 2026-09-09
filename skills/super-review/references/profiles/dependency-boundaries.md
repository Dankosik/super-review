# Dependency boundaries

Owner: abstractions
Rule: go.abstractions.earn-the-boundary

**Dependencies.** Read changed constructors, configuration access, package boundaries,
and actual consumers. Which environment or foreign representation must a consumer
understand despite the advertised boundary? Trace that knowledge, not import counts.

In Go, a file is not an encapsulation boundary: reason about the package's exported
surface and consumers. Moving helpers between files of the same package may improve
navigation but does not create information hiding. Prefer a cohesive existing
package over new `util`, `types`, or interface-only packages; keep a genuinely
shared package when its responsibility and dependency direction are clear.

Make dependencies explicit with ordinary parameters, receiver fields, or existing
construction mechanisms. `context.Context` values are for request-scoped metadata,
not an invisible options bag or service locator. Keep legitimate cross-boundary
request metadata. Inspect producers and consumers before moving anything out of
context; do not turn this into a cancellation or authorization audit.

SDK types can belong at a genuine adapter. Translate them only when consumers gain
a simpler contract. Configuration at the composition root is not a design defect.
Do not introduce injection frameworks, interface twins, or mapping layers for
symmetry or mocks. Preserve initialization timing, configuration precedence,
lifetime, import direction, and externally visible types.

Explain what consumers no longer need to know against new wiring and conversions.
Apply the owner's effective rule; do not reopen settled architecture.
