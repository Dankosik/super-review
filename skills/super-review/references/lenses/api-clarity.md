# API clarity

## go.api.express-the-call

Evaluate the declaration and representative calls together. The API should make
the operation, units, significant options, ownership, and results understandable
without repeatedly reading its implementation.

Useful: a domain-specific parameter name or small existing value type resolves
two ambiguous arguments with the same primitive type.
Insufficient: create an options struct or builder for every function with several
arguments, or add a type for every primitive value.

A boolean can be clear with a well-named operation and local call; several
unrelated mode flags may hide separate operations. Examine existing uses rather
than designing hypothetical ones. Keep meaningful Go zero values and error
contracts visible.

For exported changes, inspect callers and compatibility constraints. If callers
are unavailable, qualify or withhold the signature change. Do not introduce new
product capabilities or assess whether business requirements are correct.
