# I/O

**Does each unit cost more round trips, system calls or connections than it
needs?**

## Expect

- Data for `N` items is fetched in a number of round trips that does not grow
  with `N`: one batch query, join, or multi-get.
- Writes that can share a round trip or transaction do: batch inserts, pipelines,
  one transaction per batch.
- Small reads and writes go through a buffer, so syscall count follows data
  size rather than piece count.
- Connections, clients, sessions, and prepared statements are built once and
  reused across units.

## Look for

For each call that leaves the process or crosses into the OS or browser layout
engine (database, network, RPC, cache, file, socket, syscall, storage, DOM
layout), count how many times one unit makes it and what sets that number.

- **N+1 reads and per-element writes**: a query, lazy relation load, RPC,
  cache lookup, insert, update, or storage transaction per item inside a loop
  where a batch or single transaction keeps semantics.
- **Unbuffered I/O and redundant metadata syscalls**: small reads, writes, or
  streaming encoders/decoders on an unbuffered handle; per-line flushes in a
  batch loop; or repeated `stat`/metadata syscalls per path or directory entry
  when one lookup or directory entry metadata suffices.
- **Unbatched durability or persistence**: flushing, `fsync`, or synchronous
  full-store persistence per item or per high-frequency tick when durability or
  persistence only covers a batch or durable slice.
- **Per-unit setup**: creating a client, connection pool, TLS session, or
  prepared statement per request or per row instead of sharing it.
- **Over-reading and over-serializing**: reading an entire file or response to
  inspect a prefix or one field, or serializing unused fields per row across a
  network or client/server boundary.
- **Forced layout or broad style invalidation**: interleaving DOM geometry
  reads with writes per item, animating layout properties instead of compositor
  properties, or invalidating styles at the document root per tick.
- **Unindexed hot queries**: filtering, joining, or sorting on columns no
  migration index covers. Without a query plan or table sizes, the candidate
  stays unproven.

## Not a finding

- A call per item where the other side has no batch interface, or where
  batching changes caller-visible per-item errors, partial success, ordering,
  or transaction boundaries (that is a tradeoff).
- A batch or buffer that holds items until full, offered as a plain gain: it
  trades per-item latency for throughput (tradeoff unless a flush bound keeps
  expected latency).
- A flush or `fsync` per write required by durability, interactive output, or
  crash-safe logging.
- A client whose locked dependency source shows creation or cloning is cheap and
  shares a pool. Read its source before claiming either way.
- Reading an unchanged file per request belongs to
  [repeated-work](repeated-work.md).
