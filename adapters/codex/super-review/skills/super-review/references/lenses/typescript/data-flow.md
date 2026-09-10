# Data flow

## ts.data.make-transformations-visible

**Provenance and ownership.** Can readers see where a value originates, how it is
transformed, and who can change it? Prefer named intermediate values or a small
explicit transformation when dense spreads, reducers, casts, or distant mutation
hide those facts. Keep a direct pipeline or local accumulator when it already
expresses the work. Local mutation is not inherently less maintainable.

When `any`, assertions, or non-null assertions force multiple consumers to repeat
an unstated shape assumption, identify the owning boundary and the concrete contract
that would remove that knowledge. An existing narrowing/decoder can make the
assumption local; `unknown` alone does not define the shape or validate anything.
Do not ban every assertion or require a new validation library. A documented,
contained interop assertion can be the clearest available expression.

Inspect aliases before proposing immutable-looking rewrites: object/array spread
and `Readonly<T>` are shallow, and nested objects may remain shared. Preserve
property precedence, object identity, omitted properties, ordering, and deliberate
mutation. Recommend a readonly view only when it communicates the actual ownership
contract without pretending to freeze data or breaking consumers.
