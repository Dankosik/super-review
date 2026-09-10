# Java dependency boundaries

Owner: abstractions
Rule: java.abstractions.earn-the-boundary

**Explicit dependencies.** Can the reader tell what a changed object requires
and which layer owns construction, configuration, and adaptation? Inspect its
construction and uses. Constructor parameters can expose stable required
dependencies hidden by a locator or mutable field injection; direct construction
can already be clear. Retain optional/setter/provider injection when the actual
lifecycle, laziness, or framework contract needs it. Do not introduce a DI framework
or a matching interface for every class.

Separate an environment or framework concern only when it leaks decisions into
otherwise independent callers. A one-line facade is not automatically a boundary,
and a shared DTO does not automatically need another mapping layer. Inspect
existing ports, bean configuration, scope, qualifiers, and consumers before changing
construction. A long constructor alone is not a mandate for a new service.

Moving beans or methods can change component discovery, proxies, transactions,
and lifecycle callbacks. Preserve the version-specific contract implicated by
the proposal; missing framework evidence favors a narrower remedy. Name the
construction or dependency knowledge hidden from consumers after the change.
