# Java abstractions

## java.abstractions.earn-the-boundary

**Information hiding.** Does this class, interface, generic type, or layer hide a
meaningful decision and simplify its users as a deep boundary, or merely forward
them elsewhere as a shallow Middle Man? Inspect actual callers and implementations
and apply the deletion test. Prefer composition when it expresses
the real collaboration more directly than inherited implementation coupling;
retain inheritance or an interface when substitution, a framework contract, or
an existing extension boundary earns it. One implementation is not proof that an
interface is useless, and a concrete class does not need an interface twin.

Look for boundaries that conceal a stable responsibility rather than leak maps,
casts, boolean modes, or framework mechanics into every caller. Generics should
name a real relationship between types and remove reconstruction at uses, not
create a platform for hypothetical future types. A direct method or constructor
can be clearer than a factory, builder, registry, or fluent wrapper.

Before changing a boundary, inspect public/protected consumers, service-loader or
reflection contracts, proxy requirements, and participating annotations. Missing
dynamic or external context limits the remedy. Add a dependency or reorganize
architecture only for a burden shown in this code.

Show the implementation detail users no longer need to know, balanced against
new indirection, configuration, and migration obligations.
