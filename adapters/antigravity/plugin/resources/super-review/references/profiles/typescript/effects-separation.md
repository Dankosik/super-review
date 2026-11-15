# Effects separation

Owner: function-cohesion
Rule: ts.functions.coherent-purpose

**Calculation and environment.** Can a reader understand a meaningful transformation
without reconstructing unrelated I/O or UI interactions interleaved through it?
When a coherent calculation already exists, an explicit input/result boundary can
clarify it. Keep an ordinary sequential handler when separation merely adds forwarding
functions, argument plumbing, or a custom hook with no independent responsibility.

Preserve the placement and number of external reads/writes, exception boundaries,
closure captures, and async ordering implicated by extraction. Do not batch effects,
cache reads, or parallelize operations as a readability rewrite. Explain which part
becomes understandable independently; testability alone or a functional-programming
label is not the required reading benefit.
