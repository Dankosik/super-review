# Data flow

## ts.data.make-transformations-visible

**Visible provenance and ownership.** Trace where each value originates, how it
changes shape, and who can mutate it. Name intermediate stages when dense
spreads, nested reducers, casts, or distant mutations hide the transition.
Collapse cross-seam repackaging where code materializes intermediate arrays,
maps, or DTO objects only to cross an internal helper call or feed an API that
accepts iterables or entries directly, and drop round-trip serialization or
re-parsing of already-parsed values used only to check a property.

When `any`, `as` assertions, or `!` force multiple consumers to repeat an
unstated shape assumption, move narrowing or decoding to the owning boundary
(`unknown` alone validates nothing).

**Keep when:** a direct pipeline, local mutable accumulator, staging step that
preserves error order or atomic updates, or contained interop assertion already
states the work clearly. Inspect aliasing before proposing immutable-looking
rewrites: object/array spread and `Readonly<T>` are shallow, leaving nested
objects shared. Preserve property precedence, object identity, omitted versus
`undefined` properties, key order, and deliberate mutation, and recommend
`readonly` views only when they match actual ownership without breaking callers.
