# Contention

**Do concurrent callers wait on each other more than the shared state
requires?**

## Expect

- A lock on a hot path is held only for the work that needs it: the
  critical section reads, copies or swaps what it must and releases before
  computing, allocating, logging, sending or doing I/O.
- State that many read and few write is read without excluding other
  readers: an `RwLock`, a swapped `Arc` snapshot, a copy per thread or
  shard.
- One lock or counter that every request takes is split when callers touch
  different keys: shards, a lock per key, a concurrent map.
- Atomics that every request writes on every core are kept apart or summed
  per thread.

## Look for

Find what every concurrent request touches: a `Mutex`, an `RwLock`, an
atomic, a channel, a shared `Arc`, a pool. For each, note what is done while
it is held, how often callers reach it, and whether they need each other's
writes.

- Wide critical section: a guard alive across a computation, an allocation,
  a log call, a channel send or I/O; a guard bound with `let` that lives to
  the end of a long function.
- A global lock on the hot path: a `Mutex<HashMap>` cache read by every
  request; a `Mutex` around a value that is only read after startup.
- A write lock taken for reads; an `RwLock` whose writers come so often that
  readers gain nothing from it.
- Atomics under load: one counter every request increments on every core,
  so its cache line moves between cores; hot values that different threads
  write placed side by side in one struct (false sharing).
- One `Arc` cloned and dropped per item from many threads, all updating the
  same count.
- One channel consumer, one connection or a pool of one that every request
  passes through.

## Not a finding

- A lock nobody takes concurrently: a single-threaded runtime, a value one
  task owns, a lock taken once per batch rather than per item. Contention
  needs callers that overlap, shown from the source or a profile.
- A critical section that must include the work to keep an invariant, such
  as a check and an update that have to happen together. Narrowing it
  changes behavior.
- Replacing a lock with lock-free code or `unsafe`: a tradeoff, never a
  plain finding.
- A claim that one memory ordering is cheaper than another, without a
  profile or benchmark: it is a claim about code generation.
