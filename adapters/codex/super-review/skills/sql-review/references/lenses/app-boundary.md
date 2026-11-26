# Application boundary

**Do application callers bind parameters, manage connections/pools, batch I/O,
and handle DB errors safely?**

## Expect

- External values pass through bound query parameters, and dynamic SQL
  identifiers (table/column names, sort directions) pass closed allowlists.
- Queries, writes, and ORM relation loads bound result size and avoid N+1
  per-item round trips where a batch or join preserves semantics.
- Connections, pools, rows, cursors, and statements are shared, bounded by
  timeouts and cancellation, and closed on every path with post-iteration
  errors checked.
- Database constraint, deadlock, and serialization errors propagate or map
  accurately without corrupting pooled connection state.

## Look for

Inspect embedded SQL, query builders, ORM hooks, repository methods, pool
configuration, and locked driver source in Go, TypeScript, Rust, and Java.

- **Broken parameterization and identifier injection**: interpolating or
  concatenating untrusted values into SQL literals, `IN (...)` lists, or
  dynamic `ORDER BY`/column/table fragments without bound parameters or a
  closed allowlist.
- **N+1 round trips and unbounded reads**: running a query, write, or lazy ORM
  relation load per item inside a loop where a batch query, join, or bulk
  upsert preserves behavior; or fetching an unbounded table/user-grown dataset
  into memory without `LIMIT` or streaming.
- **Resource leaks and unchecked iterators**: failing to close row iterators,
  cursors, or prepared statements on early returns or errors; omitting
  post-loop iterator error checks so a mid-stream failure looks like a clean
  short result; or constructing a fresh pool/client per request.
- **Pooler, session-state, and timeout gaps**: missing statement/query/lock
  timeouts on request paths; ignoring context cancellation; leaving dirty
  session settings or open transactions on returned pool connections; or using
  session features incompatible with the project's transaction-mode pooler.
- **Misclassified or swallowed DB errors**: mapping constraint, serialization,
  or connection failures to "not found" or silent success, or relying on
  implicit ORM auto-flush behavior that hides partial failures.

## Not a finding

- General host-language readability, repository wrapper style, or naming taste
  unrelated to SQL safety, correctness, or DB resource lifecycle.
- Per-item DB calls where batching changes caller-visible per-item errors,
  partial success, ordering, or transaction boundaries (classify as `tradeoff`).
- Flagging an ORM or driver helper whose locked dependency source confirms it
  already parameterizes inputs, shares a pool, or closes cursors cleanly.
