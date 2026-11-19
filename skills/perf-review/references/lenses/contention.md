# Contention

**Do concurrent callers wait on each other more than the shared state
requires?**

## Expect

- A lock on a hot path is held only for the work that needs it: the critical
  section reads, copies, or swaps what it must and releases before computing,
  allocating, logging, sending, or doing I/O.
- Read-mostly state is read without excluding other readers: a reader-writer
  lock, a swapped immutable snapshot, or per-thread/sharded state.
- One lock or counter touched by every request is split when callers touch
  independent keys.
- Atomics written on every core are kept apart or aggregated per thread.

## Look for

Find every shared synchronization point concurrent units touch: locks, sharded
maps, atomics, channels, shared refcounts, pools. For each, note what runs
while it is held, how often callers reach it, and whether they need each
other's writes.

- **Wide critical sections**: a guard alive across computation, allocation,
  dropping heap-owning collections, logging, channel sends, or I/O; guards kept
  alive to the end of a scope or across branch bodies (including temporary
  scrutinee guards); whole-structure queries that lock every shard of a sharded
  map.
- **Global or redundant locks**: an exclusive lock on a read-mostly cache, a
  lock around immutable post-startup state, or an outer lock wrapping a client
  or pool handle that already synchronizes internally.
- **Write locks on reads or writer-starved reader-writer locks**: taking an
  exclusive lock for read paths, or using a reader-writer lock when frequent
  writers prevent concurrency.
- **Hot atomics and false sharing**: a single counter or shared reference count
  updated per item from many cores, or hot fields written by different threads
  sharing a cache line.
- **Single-lane bottlenecks**: one channel consumer, one connection, or a
  pool of one serializing every request, or eager low-priority work saturating
  a bounded pool ahead of critical work.

## Not a finding

- A lock nobody takes concurrently: a single-threaded runtime, a value one task
  owns, a lock taken once per batch rather than per item. Contention needs
  callers that overlap, shown from the source or a profile.
- A critical section that must include the work (or a destructor with
  observable synchronization) to keep an invariant: narrowing it changes
  behavior.
- Replacing a lock with lock-free code or `unsafe`: a tradeoff, never a plain
  finding.
- A claim that one memory ordering is cheaper than another, without a profile
  or benchmark: it is a claim about code generation.
