# I/O

**Does each unit cost more round trips, system calls or connections than it
needs?**

## Expect

- Data for N items is fetched in a number of round trips that does not grow
  with N: one query over a set of keys, a join, a multi-get, a batch call.
- Writes that can share a round trip or a transaction do: a batch insert, a
  pipeline, one transaction for the batch.
- Small reads and writes go through a buffer, so the number of system calls
  follows the size of the data, not the number of pieces.
- Connections, clients, sessions and prepared statements are made once and
  reused across units.

## Look for

For each call that leaves the process (database, HTTP, RPC, cache, file,
socket, any system call), find how many times one unit of work makes it and
what sets that number.

- N+1: a query per item of a list an earlier query loaded; a cache or RPC
  lookup per element where the other side offers a multi-get.
- Round trip per element: an insert, update, publish or `set` per row in a
  loop; a remote call per item of a stream.
- Unbuffered I/O: small `write`, `write_all`, `write!` or `read` calls on a
  `File`, `TcpStream` or child pipe without `BufWriter` or `BufReader`;
  `println!` per item in a loop.
- No batching: a flush or `fsync` per record where the durability promise is
  per batch.
- Reconnection: a client, connection pool, TLS session or prepared statement
  created per request instead of shared.
- A whole file or response read into memory to use a prefix or one field,
  where a streaming read would stop early.
- A query per request that filters, joins or sorts on columns no index in
  the repository's migrations covers. The plan is the database's: without
  the plan or the table sizes, the candidate is unproven.

## Not a finding

- A call per item where the other side has no batch interface, or where a
  batch would change what callers rely on: errors per item, partial success,
  ordering, transaction boundaries. A batch that changes those is a
  tradeoff.
- A batch or buffer that holds an item until it fills, offered as a plain
  gain. It raises throughput and that item's latency: a tradeoff, unless a
  flush bound keeps the latency callers expect.
- A flush or `fsync` per write that a durability promise requires; output a
  reader needs at once, such as an interactive protocol or a log that must
  reach the pipe before a crash.
- A client the dependency documents or implements as cheap to create, or
  whose clones share one pool. Read its source at the locked version before
  claiming either way.
- A file read per request whose content does not change between requests
  belongs to [repeated-work](repeated-work.md).
