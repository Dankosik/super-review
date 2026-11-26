# Ingestion and client boundary

**Do client producers and query callers batch writes, pick safe formats and
async settings, bind parameters safely, and bound memory and timeouts?**

## Expect

- High-frequency producers batch writes client-side (tens of thousands of rows
  or multi-MB blocks) or enable `async_insert = 1` with durability settings
  matching the data contract.
- Durable pipelines keep `wait_for_async_insert = 1` and enable async
  deduplication (`async_insert_deduplicate = 1` or `deduplicate_insert`) with a
  deterministic `insert_deduplication_token` when retrying timed-out inserts.
- Untrusted values use ClickHouse query parameters (`{name:Type}`), dynamic
  identifiers use `{name:Identifier}` or closed allowlists, and client streams,
  batches, memory, and execution times are bounded and closed.

## Look for

Inspect ClickHouse client configs, ingestion workers, HTTP/Native insert loops,
query builders, and locked client library source in Go, TypeScript, Rust, Java,
and Python.

- **Single-row / tiny synchronous inserts**: calling `INSERT` per HTTP request
  or per message without client batching or `async_insert = 1`, driving
  `TOO_MANY_PARTS` (`parts_to_delay_insert` / `parts_to_throw_insert`) and
  Keeper/object-storage metadata storms.
- **Unsafe `async_insert` durability and retry duplicates**: setting
  `async_insert = 1` with `wait_for_async_insert = 0` on durable/financial/
  audit writes (silent loss on server crash, OOM, or parse error, plus zero
  backpressure); retrying inserts without async deduplication enabled and a
  stable `insert_deduplication_token`.
- **Format and precision hazards**: ingesting established high-volume streams
  via text `JSONEachRow`/`Values` instead of `Native` or `RowBinary` (server
  CPU parse amplification), or sending unquoted 64-bit integers through JS/JSON
  parsers losing precision past `2^53 - 1`.
- **Broken parameter and identifier boundaries**: interpolating or
  concatenating untrusted input into SQL strings instead of binding ClickHouse
  `{name:Type}` query parameters, or splicing dynamic table, column, or sort
  identifiers without `{name:Identifier}` or a closed allowlist.
- **Unbounded queries and leaked client resources**: user-facing queries
  missing `max_execution_time`, `max_memory_usage`, or context deadlines;
  buffering unbounded result sets into app RAM instead of streaming; or leaving
  row iterators, early-exited response streams, or prepared batches unclosed or
  unchecked on error paths (verify cleanup semantics in locked driver source).

## Not a finding

- `async_insert = 1` paired with `wait_for_async_insert = 1` for high-fanout
  microservice writers that cannot share a client batch buffer.
- `wait_for_async_insert = 0` when a prior ADR or ops doc explicitly accepts
  bounded loss on crash for best-effort telemetry (`disputed`).
- `JSONEachRow` on cold, low-volume, or unmeasured ingestion paths where
  throughput is not established (route uncertain volume to `needs confirmation`
  or `tradeoff`).
- Omitting `insert_quorum` when async single-replica acknowledgement is the
  documented availability choice.
