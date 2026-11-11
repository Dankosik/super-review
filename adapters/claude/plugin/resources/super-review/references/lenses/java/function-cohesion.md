# Java function cohesion

## java.functions.coherent-purpose

**Cohesion.** Does a changed method express one understandable task at a useful
level of detail, or force the reader to reconstruct unrelated responsibilities?
Read the whole method, collaborators, and representative calls. Keep a linear
operation together when its sequence tells the story better than scattered
one-line helpers. A line limit, helper count, or single-responsibility slogan is
not evidence of a problem.

## java.functions.extract-for-clarity

**Named operations.** Would extraction name a real concept, isolate independently
understandable computation, or remove repeated knowledge? Prefer the smallest
method boundary with explicit inputs and results. Keep the original when a helper
would add an opaque name, many parameters, boolean modes, or hidden instance state.
Keep temporary locals local and pass them to an extracted method explicitly.

Preserve exception propagation, synchronization scope, resource lifetime, and
annotation-driven behavior implicated by moving code. Moving a transactional or
asynchronous method into a private/self-invoked helper may bypass a proxy; moving
it to another bean may introduce a different boundary. Inspect the actual framework
and calls instead of treating annotations as movable decoration. A local
computation stays local; a dependency container, service layer, or interface is
a question for abstractions.

Show the named operation and what becomes independently understandable.
