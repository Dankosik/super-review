# Rust effects separation

Owner: function-cohesion
Rule: rust.functions.coherent-purpose

**Computation and environment.** Does changed code interleave a meaningful
transformation with environment access so neither is understandable locally?
A named computation with explicit input and result can clarify that relationship
when the intermediate value is meaningful to the caller.

Keep orchestration that already tells one story. Passing borrowed fields, generic
callbacks or trait objects through a new helper may increase the reading burden.
Do not extract merely to create a testing seam; test design is outside scope.

Preserve implicated effect order, eager/lazy work, async execution and guard/drop
lifetimes. Explain which environmental knowledge the computation no longer needs
and what the caller must now know instead.
