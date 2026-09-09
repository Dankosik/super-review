# API clarity

## go.api.express-the-call

**Contracts.** Read the declaration and representative calls together. Can a
caller understand the operation, units, significant options, ownership, results,
and required sequencing without reconstructing the implementation? Identify the
specific knowledge that the call leaves implicit.

Prefer the smallest clarification: a meaningful name, an existing value type,
or a narrower operation before a new options structure or builder. Distinguish
real alternatives without wrapping every primitive. A boolean may be clear in
a well-named local call; several independent mode flags can conceal different
operations. Judge actual uses, not hypothetical future callers.

Keep meaningful zero values, error contracts, and mutation ownership visible.
Do not add product capabilities or validate business requirements. For exported
changes, inspect compatibility and available consumers; an unobserved external
caller is not evidence that a migration is harmless. When necessary context is
unavailable, narrow the advice to an independently useful compatible change or
withhold the signature change.

Show a representative call before and after, or describe the equivalent concrete
change, and explain which implementation detail callers no longer need to know.
