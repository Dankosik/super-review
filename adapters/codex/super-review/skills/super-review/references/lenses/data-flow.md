# Data flow

## go.data.make-transformations-visible

Readers should see where values come from, how they change, and who owns
mutation. Prefer meaningful intermediate values when they reveal distinct
stages. Remove a temporary only when doing so preserves that clarity.

Useful: distinguish an incoming amount from a normalized amount instead of
reusing `value` across unrelated meanings.
Insufficient: inline each intermediate into a dense expression or introduce an
immutable-object framework for a simple local update.

Consider Go's shared slice/map storage and pointer receivers when explaining a
proposed simplification. Preserve observable nil/empty distinctions and order.
Do not scan for races, missing synchronization, or runtime defects. A mutation
that is explicit and local is not a style problem merely because it is mutation.

A helper may clarify a transformation or hide a simple pipeline; read its body
and callers before deciding. Name only affected files you have inspected.
