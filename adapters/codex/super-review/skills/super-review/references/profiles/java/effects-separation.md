# Java effects separation

Owner: function-cohesion
Rule: java.functions.coherent-purpose

**Computation and effects.** Does a meaningful calculation become difficult to
understand because its inputs and decisions are interleaved with I/O, persistence,
clock access, or environmental work? Identify the computation and its data before
proposing a boundary. A method accepting values and returning a result can expose
that decision; a simple linear read-transform-write may be clearer left together.

Do not split every repository call or getter into a helper. Do not create command
objects, immutable graphs, or an architecture merely to claim purity. Keep the
effect sequence visible; avoid a helper that secretly reads mutable instance state.
When moving code, preserve transaction scope, lazy ORM loading, clock sampling,
exception timing, and proxy interception implicated by extraction. Fetching all
values first can change behavior rather than merely clarify it.

Show the independently understandable decision and coordination the boundary
adds. Testing convenience or hypothetical bugs alone are not the benefit; this
review does not request tests or execute the application.
