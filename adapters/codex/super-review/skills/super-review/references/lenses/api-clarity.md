# API clarity

## go.api.express-the-call

**Contracts.** Read the declaration and representative calls together. Can a
caller understand the operation, units, options, ownership, results, and required
sequencing without reconstructing the implementation? Identify the knowledge
that the call leaves implicit.

Use Go's ordinary returns to express values, absence, and failure. An additional
`ok` or `error` can clarify an existing sentinel protocol; a valid zero result
does not need a new failure channel. Name same-typed results when that explains
the signature, without requiring naked returns. Keep a result struct when its
fields form a meaningful value, not merely because multiple returns look untidy.
Output pointers may have a real mutation or reuse contract; inspect callers
before replacing them with returned values.

Prefer the smallest clarification: a name, existing value type, or narrower
operation before an options structure or builder. Several independent flags can
hide distinct operations, but a clear local boolean need not become a new type.
Judge actual uses rather than hypothetical callers. Keep supported zero values,
absence, error contracts, and mutation ownership visible; document non-obvious
caller obligations rather than manufacturing constructors or validation.

Do not add product capabilities or validate business requirements. For exported
changes, inspect compatibility and available consumers. Function values, interface
satisfaction, and external users can matter beyond direct calls; an empty literal
search does not prove absence. When context is unavailable, narrow the advice to
a compatible clarification or withhold the signature change.

Show a representative call before and after, or an equivalent concrete change,
and explain which implementation detail callers no longer need to know.
