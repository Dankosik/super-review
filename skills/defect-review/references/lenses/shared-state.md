# Shared state

**Does one caller's failure or timing stay its own?**

## Expect

- One caller's failure, slowness or disappearance costs other callers
  nothing the failure does not force.
- A shared resource is retired only for a failure that leaves it unusable
  for others: a broken transport, a protocol out of step. A well-formed
  refusal of one request is not that.
- A shared value is never seen half-updated.
- A decision is applied to the state it was made on.
- A stale owner cannot overwrite a newer one.
- Capacity taken is returned on every exit.

## Look for

Find what is shared: connections and pools, caches, registries, counters,
generations, reloadable configuration, anything behind a lock or an atomic.
Ask what another caller sees when one fails, is slow or leaves halfway
through an update, and what two callers see when their steps interleave at
each suspension point.

When the code gives up a shared resource because of one caller's failure,
find out from the protocol and the resolved driver whether that failure
really makes the resource unusable. A document that describes the
retirement does not answer this; what the other callers lose does.

- One request's failure treated as the resource's: a reply that rejects a
  single command retires the connection everyone uses, a single timeout
  empties the pool.
- The opposite: a broken resource kept in circulation.
- A decision made on a value read before a wait and applied after it.
- An update in several steps with a wait or a fallible call between them.
- A late completion from a retired generation publishing its result.
- A limit counted on entry and not returned on every exit.
- A background action with its own shorter limit that fails every caller's
  work in flight.
- A notification lost because the waiter subscribed after it was sent.

Write the trace as a numbered order of events for two actors, with what
permits that order.

## Not a bug

Contention or throughput concerns. A race with nothing a caller can observe
at stake. A shared resource given up after a failure that really did make it
unusable for everyone.
