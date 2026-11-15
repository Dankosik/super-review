# Effects separation

Owner: function-cohesion
Rule: go.functions.coherent-purpose

**Computation and effects.** Read the changed operation and its helpers. Is a
meaningful computation obscured because the reader must simultaneously reconstruct
how the operation reads or changes its environment? Compare the whole operation
before and after separating that computation, not just its new function length.

A small function with explicit inputs can clarify a substantial existing decision.
A short read-act-write sequence may already tell the story better in one place.
Do not manufacture a functional architecture, extract every external call, or
introduce interfaces merely to make code testable.

Preserve transaction/resource boundaries, lazy reads, the moment of observing
time/configuration, failure behavior, and effect order. Do not move reads outside
a transaction or reorder actions for a tidier signature. Evaluate expression,
not whether the business calculation is right, and do not inspect or request tests.

Show the understanding gained relative to extra parameters, results, and navigation.
Apply the owner's effective team rules, including extraction rules when relevant;
a selected profile neither replaces cohesion nor defeats a team override.
