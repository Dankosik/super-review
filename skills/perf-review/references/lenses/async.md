# Async

**Does async code keep executor threads free and run independent waits
together?**

## Expect

- Code on an executor or event-loop thread reaches its next yield point soon.
  Blocking I/O, sleeping, contended blocking locks, and long CPU work run off
  the executor on a blocking or compute pool.
- Independent waits run concurrently, with a concurrency bound when their count
  comes from input.
- A lock guard held across an `.await` on a hot path guards state that needs
  the wait inside the critical section.
- A spawned task carries enough work to justify scheduling it, and does not
  outlive its sole consumer needlessly.

## Look for

On each async or event-driven hot path, list calls that can block without
yielding, independent waits serialized in order, and tasks or timers outliving
their need.

- **Blocking work on an async executor or event loop**: synchronous file,
  network, storage, crypto, compression, large serialization, or data-parallel
  pool calls running inline on worker or UI threads, or carrier-thread pinning.
- **Sequential independent waits**: awaits that do not depend on each other's
  results, awaits placed before a branch that ignores them, mount-then-fetch
  waterfalls, or per-item loops awaiting each remote call before starting the
  next.
- **Uncoalesced events, stale work, and recreated timers**: running multiple
  passes per paint on raw sub-frame input, leaving superseded reads running on
  rapid input, keeping idle animation/timer loops running when settled or
  offscreen, recreating timers or stateful futures every turn of a hot `select`
  loop, or detached spawned tasks (dropped `JoinHandle`) continuing work after
  their sole consumer times out or cancels.
- **Lock held across an async suspension**: an async lock or permit kept alive
  across a network or disk wait, queueing concurrent callers behind one wait.
- **Task or offload per tiny item**: spawning a task, goroutine, or blocking
  pool hand-off per element where batching or inline work avoids scheduling
  overhead.

## Not a finding

- Blocking work that already runs off the executor (blocking pool, dedicated
  thread, startup before serving, or `block_in_place` on a multi-threaded
  runtime; never propose `block_in_place` where a `current_thread` runtime can
  run it). Verify which thread runs it.
- A brief synchronous lock with no `.await` inside: switching it to an async
  lock adds overhead.
- Sequential waits required by data dependency, ordering, transactions,
  protocols, or rate limits, or overlapping waits against a resource that
  serializes them anyway (one connection or pool of one).
- Overlapping operations with side effects offered as a plain gain: when the
  first fails, the second has already started. That is a tradeoff.
- Delaying user-visible updates (debounce, throttle, deferred transitions) or
  turning a synchronous call into an async message offered as a plain gain:
  each changes observable timing or the call contract, so it is a tradeoff.
