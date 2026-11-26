# Transactions

**Do transactions, locking, and concurrency control prevent races, deadlocks,
and long locks?**

## Expect

- Read-modify-write workflows preserve atomicity via conditional updates,
  row-level locks, unique constraints/upserts, optimistic version checks, or
  appropriate isolation levels.
- Concurrent paths lock shared tables and rows in a consistent deterministic
  order.
- Transactions stay short, group logical units atomically, and exclude outbound
  network or slow external I/O.
- Callers handle serialization failures, deadlocks, and mid-transaction errors
  cleanly without leaking partial state or aborted transactions.

## Look for

Trace multi-statement flows across SQL routines, migration scripts, and
application service/repository boundaries.

- **Check-then-act and lost-update races**: reading a balance, quota, status,
  or counter in one statement, computing the next state in application code,
  and writing back without an atomic conditional `UPDATE`, row lock, upsert, or
  optimistic version guard.
- **Deadlocks and lock-order inversions**: two concurrent paths updating or
  locking the same tables or rows in conflicting or unsorted order (such as
  batch updates over unsorted caller IDs), or upgrading a shared read lock to a
  write lock under concurrency.
- **Long transactions holding locks across external I/O**: keeping a database
  transaction open across HTTP/RPC calls, queue publishes, file I/O, or user
  waits, holding row locks, exhausting connection pools, and blocking MVCC
  cleanup.
- **Broken transaction and session boundaries**: multi-step invariants running
  in autocommit; issuing a query on the top-level `pool`/`db` handle inside an
  active transaction instead of the `tx` handle (escaping atomicity or
  self-deadlocking on locks/pool slots); transaction-scoped settings run outside
  a tx; swallowed errors without rollback/savepoint; or implicit DDL commits.
  Verify ORM/driver tx defaults in locked dependency source on disk.
- **Unhandled concurrency conflicts and queue contention**: higher isolation
  levels lacking retry handling for serialization or deadlock errors, or worker
  queues polling rows without row-skipping locks so workers contend or double
  process.

## Not a finding

- Raising isolation level globally without a traced anomaly, or recommending
  `SERIALIZABLE` without classifying retry and throughput overhead as a
  `tradeoff`.
- Single atomic SQL statements (conditional `UPDATE`, atomic upsert) that
  enforce the invariant without an explicit multi-statement transaction block.
- Independent read-only queries outside a transaction when no cross-query
  snapshot consistency is required.
