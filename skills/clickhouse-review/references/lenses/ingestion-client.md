# Ingestion and client boundary

**Do client producers and query callers batch writes, pick safe formats and
async settings, bind parameters safely, and bound memory and timeouts?**

## Expect

- High-frequency producers batch writes client-side (tens of thousands of rows
  or multi-MB blocks) or enable `async_insert = 1` with durability settings
  matching the data contract.
- Durable pipelines keep `wait_for_async_insert = 1`, use version-valid async
  deduplication (`async_insert_deduplicate = 1` on `24-25.x`, or default
  `deduplicate_insert = 'enable'` on `26.2+`), and pass a unique deterministic
  per-batch `insert_deduplication_token` on retries.
- Untrusted values use `{name:Type}` query parameters, dynamic identifiers use
  `{name:Identifier}` or closed allowlists, and client streams, batches, memory,
  and deadlines are bounded and closed (checking defaults in on-disk driver source).

## Look for

Inspect ClickHouse client configs, ingestion workers, HTTP/Native insert loops,
`Kafka`/`Buffer` DDL when present, query builders, and locked client library
source in Go, TypeScript, Rust, Java, and Python.

- **Single-row / tiny synchronous inserts**: calling `INSERT` per HTTP request
  or per message without client batching or `async_insert = 1`, driving
  `TOO_MANY_PARTS` (`parts_to_delay_insert` / `parts_to_throw_insert`) and
  Keeper/object-storage metadata storms.
- **Unsafe `async_insert` durability and setting versions**: setting
  `async_insert = 1` with `wait_for_async_insert = 0` on durable writes risks
  silent drop on crash or parse error with zero backpressure; `deduplicate_insert`
  landed in `26.2` and fails with `UNKNOWN_SETTING` on `24-25.x` (where
  `async_insert_deduplicate` defaults to `0`).
- **Deduplication token and scope traps**: `insert_deduplication_token` is
  tracked per partition and overrides content hashing (reusing a token silently
  drops distinct data); non-replicated `MergeTree` defaults
  `non_replicated_deduplication_window = 0`; parallel or multi-block
  `INSERT ... SELECT` retries need deterministic ordering or explicit tokens.
- **Format and precision hazards**: ingesting established high-volume streams
  via text `JSONEachRow`/`Values` instead of `Native` or `RowBinary` (server
  CPU parse amplification), or sending unquoted 64-bit integers through JS/JSON
  parsers losing precision past `2^53 - 1`.
- **Kafka engine hazards (when present)**: direct `SELECT` fails under default
  `stream_like_engine_allow_direct_select = 0` (or when an MV is attached) and
  risks consuming or committing offsets when enabled; `kafka_handle_error_mode
  = 'default'` stalls on poison pills (use `'stream'` or `'dead_letter_queue'`;
  prefer ClickPipes on Cloud).
- **Buffer engine hazards (when present)**: `Buffer` tables lose RAM rows on
  crash/restart and silently drop unmatched columns or retry unflushable blocks
  in RAM after destination `ALTER`s; MVs attached to `Buffer` fire per unbatched
  insert (defeating buffering with small MV parts) and miss direct destination
  writes (attach MVs to the destination, or prefer `async_insert = 1` +
  `wait_for_async_insert = 1`).
- **Broken parameter and identifier boundaries**: interpolating or
  concatenating untrusted input into SQL strings instead of binding ClickHouse
  `{name:Type}` query parameters, or splicing dynamic table, column, or sort
  identifiers without `{name:Identifier}` or a closed allowlist.
- **Unbounded queries and leaked client resources**: user-facing queries
  missing `max_execution_time`, `max_memory_usage`, or deadlines; buffering
  unbounded results into app RAM; or leaking unclosed iterators, streams, or
  batches on error paths. Check driver defaults (batching, compression, format,
  retries, close) on disk without marking code-visible SQL bugs `unproven`.

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
