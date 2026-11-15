# Async

**Does async code keep executor threads free and run independent waits
together?**

## Expect

- Code on an executor thread reaches its next `.await` soon. Blocking I/O,
  sleeping, waiting on a contended blocking lock and long CPU work run
  elsewhere: `spawn_blocking`, a dedicated thread, a compute pool.
- Awaits whose inputs do not depend on each other run concurrently, with a
  bound when their number comes from input.
- A lock guard held across an `.await` on a hot path guards something that
  needs the wait inside the critical section.
- A spawned task carries enough work to be worth the spawn.

## Look for

On each async hot path, list the calls that can take long without yielding
and the awaits that do not use each other's results.

- Blocking call on an async executor, event loop or non-blocking scheduler:
  `std::fs`, `std::net`, Node `*Sync` I/O or synchronous crypto/compression,
  blocking JDBC/HTTP on a reactive thread, virtual-thread carrier pinning on
  older runtimes, `std::thread::sleep`, `block_on` inside async code, or
  parsing/serializing large payloads inline on a shared event loop.
- Sequential awaits for independent operations: two lookups awaited one after
  the other, an `await` placed before a branch or streaming boundary that does
  not read its result, or a loop that awaits each item's request before sending
  the next, where `join!`, `try_join!`, `JoinSet`, `FuturesUnordered`,
  `buffer_unordered`, bounded `Promise.all`, `errgroup` or structured
  concurrency would overlap them.
- Lock held across `.await` or async suspension: an async `Mutex`, `RwLock` or
  semaphore permit alive across a network call, so every caller queues behind
  one request's latency.
- Task or goroutine per tiny item: a spawned task, goroutine or virtual thread
  per element for work smaller than scheduling it, or spawned and joined at
  once.
- `spawn_blocking` per element in a tight loop, where one blocking task for
  the batch would do.

## Not a finding

- A blocking call that already runs off the executor: inside
  `spawn_blocking`, on a dedicated thread, before the runtime serves
  requests, or under `block_in_place`. Check which thread runs it.
- A `std::sync::Mutex` held briefly with no `.await` inside. The Tokio
  documentation prefers it to the async mutex there; switching to the async
  one adds cost.
- Sequential awaits where one needs the other's result, or where the order
  is required: a transaction, a protocol, a rate limit.
- Overlapping awaits against something that serializes them anyway, such as
  one connection or a pool of one: the wait does not shrink.
- Overlapping operations that have effects, offered as a plain gain. Run
  sequentially, the second never starts when the first fails; overlapped
  with `try_join!` or a `JoinSet`, it has started and may have taken
  effect. That is a tradeoff.
