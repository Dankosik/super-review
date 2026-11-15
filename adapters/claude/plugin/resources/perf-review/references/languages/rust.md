# Rust context

Go, TypeScript, Rust and Java have language contexts in this review. Source in
another language is listed as excluded, not reviewed by analogy.

## Where Rust code states its cost

Doc comments stating complexity or amortized bounds, `# Performance` sections,
benchmarks under `benches/` (`criterion`, `divan`) and their input sizes,
committed flamegraphs or allocator profiles (`dhat`), `with_capacity` and
`reserve` upstream, `Cow` and borrowed return types, `#[cold]`, and
`Cargo.toml` (`edition`, `rust-version`, `[dependencies]`, enabled features,
and `[profile.*]`).

## Semantics to settle before claiming

A candidate that rests on one of these must show it from the source, the
documentation, or the resolved dependency version rather than memory.

- **Ownership, clones, and buffer capacity reuse**: what `clone` costs depends
  on the concrete type resolved through generics and aliases (`Arc`, `Rc`, and
  `Bytes` increment a reference count without copying payload bytes; `String`,
  `Vec`, maps, and `Box` allocate and copy). Reassigning `buf = incoming.clone()`,
  iterating `std::mem::take(&mut vec)` inside a loop, or reading
  `BufRead::lines()` drops and reallocates heap storage each pass -> reuse
  capacity via `buf.clone_from(&incoming)`, `vec.drain(..)`, `write!` into a
  cleared `String` (`format!` always allocates), or `BufRead::read_line(&mut line)`
  with `line.clear()` and `\r?\n` stripped (`N -> 1` allocation; **finding**
  within one unit, whereas retaining grown `thread_local!` buffers across
  requests holds peak memory per thread and is a **tradeoff**). `collect` and
  `extend` pre-size from `Iterator::size_hint`, which exact-size chains
  (`slice.iter().map(...)`) preserve and `filter` or `flat_map` lose. Calling
  `.to_vec()` or `Bytes::copy_from_slice` on data already in `Bytes` copies
  bytes where `bytes.slice(a..b)` or `Bytes::from(vec)` shares or transfers the
  backing allocation (`O(1)`; **finding** within one unit, **tradeoff** when
  retaining a small slice pins a large backing buffer in a cache).
- **Map lookups, `HashMap::entry`, and eager fallbacks**:
  `std::collections::HashMap::entry(key)` takes `K` by value, so
  `map.entry(key.to_owned()).or_insert_with(...)` on `HashMap<String, V>`
  allocates and drops a `String` on every hit -> check `map.get(key)` through
  `Borrow<str>` first and allocate only on misses (`1 -> 0` allocations per hit;
  **finding**), or use `hashbrown` or `indexmap` `entry_ref` when already in
  `Cargo.toml` (`1` hash and `0` allocations per hit). Do not replace
  `contains_key` + `insert` with `std` `entry(key.to_owned())` when `K` is owned
  and hits are routine. By-value fallbacks `Option::unwrap_or`, `ok_or`, `or`,
  `Result::or`, and `Entry::or_insert` evaluate their argument on every call, so
  `format!`, `to_owned()`, or `Vec::with_capacity(n)` inside them allocates on
  the `Some`/`Ok`/`Occupied` fast path -> defer with `unwrap_or_else`,
  `ok_or_else`, `or_else`, or `or_insert_with` (**finding**); by contrast,
  `Vec::new()`, `String::new()`, and `BTreeMap::new()` allocate nothing until
  grown. `HashMap`'s default SipHash hasher resists hash flooding; switching a
  hot internal-key or verified-key table to `rustc_hash`, `ahash`, or `foldhash`
  is a **finding** when that crate is already in `Cargo.toml` and a **tradeoff**
  when it adds a dependency (keep the default hasher wherever unverified
  request, peer, or file input chooses inserted keys).
- **Sorting, UTF-8 strings, and `regex` engines**: `slice::sort_by_key(f)` calls
  `f` on every comparison (`~2 N log N` evaluations), multiplying any
  `to_lowercase()`, `format!`, or parse inside `f` -> use a non-allocating
  `sort_by` comparator (`0` allocations) or `sort_by_cached_key` (`N`
  evaluations plus `1` cache `Vec`), and use `select_nth_unstable` (`O(N)`)
  instead of a full sort for top-`k` or medians (**finding** when equal-element
  order is unused). `s.chars().collect::<Vec<char>>()` allocates `4 * chars`
  bytes per call to index characters -> scan `s.as_bytes()` for ASCII syntax or
  `s.char_indices()` for UTF-8 spans (`1 -> 0` allocations; **finding**).
  `s.to_ascii_lowercase() == lit` allocates a `String` per check -> use
  `s.eq_ignore_ascii_case(lit)` or in-place `make_ascii_lowercase()` (`1 -> 0`
  allocations; **finding**; keep Unicode `to_lowercase()` unless inputs are
  ASCII, because non-ASCII characters such as `'\u{212A}'` and `'\u{017F}'` case-fold
  to ASCII `'k'` and `'s'`). `str::replace` allocates and copies the whole
  string even on zero matches, and `String::from_utf8_lossy(bytes).into_owned()`
  copies valid UTF-8 -> borrow the `Cow::Borrowed(&str)` on valid input or pass
  an owned `Vec<u8>` to `String::from_utf8` (**finding**). `Regex::new` compiles
  the automaton on every call -> hoist once (`LazyLock` or `OnceLock`). On a
  compiled `Regex`, `captures` allocates capture-group slots on every match and
  runs slower engines where `is_match` or `find` allocates nothing, and testing
  `M` regexes in a loop scans the haystack `M` times where `regex::RegexSet`
  scans once (`M -> 1` pass; **finding**).
- **`serde` buffering, console streams, and directory walks**: passing an
  unbuffered `File` or `TcpStream` to `serde_json::from_reader` or `to_writer`
  issues tiny per-byte or per-token `read`/`write` system calls, and
  `from_reader` prevents borrowing `&'de str` -> wrap streams in
  `BufReader`/`BufWriter`, or parse an in-memory buffer with
  `from_slice`/`from_str` when borrowing `&str` or `Cow<'de, str>` fields
  (**finding**). Calling `serde_json::to_string` or `to_vec` only to write into
  an existing buffer or stream allocates an intermediate buffer -> write
  directly with `serde_json::to_writer(&mut buf, &val)` (**finding**).
  Deserializing transit JSON through `serde_json::Value` builds a heap tree of
  maps, vectors, and strings -> use `&serde_json::value::RawValue` or
  `Box<RawValue>` when forwarding or inspecting an envelope (**finding** when
  `Value` key-sorting or whitespace normalization is unused).
  `#[serde(flatten)]`, `#[serde(tag = "...")]`, and `#[serde(untagged)]` buffer
  fields into an internal heap `Content` value and disable `&'de str` borrowing
  (changing external wire format is not a candidate; reworking internal-only
  representations or custom `Deserialize` with identical wire behavior is a
  **finding**). `println!` locks stdout and flushes on every newline -> lock
  `io::stdout().lock()` behind `BufWriter` in non-interactive batch loops
  (**finding** when callers do not rely on per-line interactive flush, otherwise
  **tradeoff**). Calling `entry.path().is_dir()` or `fs::metadata(entry.path())`
  inside `fs::read_dir` or `walkdir` allocates a `PathBuf` and runs an extra
  `stat` system call per entry -> inspect `entry.file_type()` directly (`N -> 0`
  `PathBuf` allocations and `stat` calls on filesystems that populate directory
  entry types; **finding** when symlink-following semantics match).
- **Pooled clients and SQL round trips (`reqwest`, `tonic`, `sqlx`, `rusqlite`)**:
  `reqwest::Client`, `sqlx::Pool`, `tonic::transport::Channel`,
  `redis::aio::ConnectionManager`, and `aws_sdk_*::Client` already wrap internal
  `Arc` pools or multiplexed channels (`Clone` is `O(1)` and methods take
  `&self`): calling `Client::new()` per request rebuilds connection pools and
  TLS state, while wrapping them in `Mutex` or `RwLock` serializes concurrent
  callers -> clone and share the handle directly (**finding**). Executing `N`
  row-by-row `.execute(&pool).await` or ORM inserts in a loop pays `N` pool
  borrows and `N` round trips -> batch via `sqlx::QueryBuilder::push_values`,
  `insert_many`, or Postgres `UNNEST` / `ANY($1)` (`N -> 1` round trip;
  **finding** when per-row partial commit is unused, otherwise **tradeoff**),
  and avoid `format!` `IN (...)` lists of varying arity that miss
  prepared-statement caches. In `rusqlite`, `conn.prepare(...)` inside a loop
  recompiles SQLite bytecode each pass -> hoist `prepare` or call
  `prepare_cached` (**finding**); running `N` writes outside an explicit
  transaction pays `N` autocommit `fsync`s instead of `1` (`N -> 1` syncs;
  **finding** when batch atomicity matches callers, otherwise **tradeoff**).
- **Async executors, lock lifetimes, and fan-out (`tokio`, `rayon`)**:
  `tokio::fs` dispatches each operation to the blocking pool, so many small
  reads or writes pay repeated pool hand-offs -> buffer the stream; running
  synchronous compression, crypto, large CPU parses, or `rayon::par_iter()`
  directly on a Tokio worker thread blocks that worker and stalls queued tasks
  -> offload heavy CPU batches via `spawn_blocking` or `rayon::spawn` plus
  `oneshot` (**finding**). A `std::sync::Mutex` held briefly with no `.await`
  inside is what Tokio recommends; `tokio::sync::Mutex` is for guards held
  across `.await` and costs more per lock. An unnamed lock guard in a `match` or
  `if let` scrutinee (`if let Some(v) = state.lock().unwrap().get(&k).cloned() { ... }`)
  stays locked across the matched arm body in every Rust edition (and across
  `else` before Edition 2024), and `*guard = next` or `guard.clear()` on a large
  collection frees `O(N)` allocations under the lock -> bind `let v = ...;`
  before branching so the guard drops at `;`, and `std::mem::take` or `replace`
  inside the lock so the old value drops after `drop(guard)` (**finding**).
  Recreating `tokio::time::sleep` or stateful secondary futures on every turn of
  a hot `loop { tokio::select! { ... } }` registers and drops timer or future
  state per message -> `tokio::pin!` and `Sleep::as_mut().reset(...)` or
  `tokio::time::interval` outside the loop (**finding**). Cloning owned payloads
  across `M` channel sends (`tx.send(msg.clone())`) copies heap data `M` times
  -> send `Arc<T>` or `Bytes` (`M -> 1` allocation; **finding** when receivers
  only read).
- **Observability, errors, build profiles, and `Cargo.toml` baseline**:
  arguments inside `tracing::{debug,trace}!` and `log::{debug,trace}!` are gated
  by callsite interest and level checks, so disabled levels do not evaluate
  them; only work computed before the macro, or enabled hot-path spans and
  events (`#[instrument]` formatting non-`skip` arguments through `Debug`,
  enabled `info!`, dynamic `String` metric labels), runs per call.
  `anyhow::Error` allocates on creation and captures a backtrace when
  `RUST_BACKTRACE` is set (state whether production enables it or mark unknown)
  -> use a typed enum on routine per-element failure paths (**finding** internal
  to the crate). `debug_assert!` and `cfg(debug_assertions)` are absent from
  default release builds; read `[profile.*]` before counting them. Cheaper forms
  must build within `Cargo.toml`'s `edition`, `rust-version` (`OnceLock` 1.70,
  `async fn` in traits 1.75 without `dyn`, `LazyLock` 1.80), enabled features
  (`block_in_place` needs Tokio's `rt-multi-thread`), and declared
  `[dependencies]`: adding a new crate (`smallvec`, `dashmap`, `arc-swap`,
  `parking_lot`, `memchr`, `itoa`) is a **tradeoff**, whereas using one already
  in `Cargo.toml` is a **finding**.

## Dependencies

The version in use is the one `Cargo.lock` resolves, not the one a document
or `Cargo.toml` names. Read a dependency's source where it already is on
disk: a vendor directory, or Cargo's registry cache under
`~/.cargo/registry/src`. Do not download it. When it is not on disk, a step
that depends on it is an assumption: name the crate, the version and the
question its source would answer.

## Not a finding in Rust

A lint or style observation with no hot-path cost count. A move, which copies no
heap data. Evaluating arguments inside disabled `tracing::{debug,trace}!` or
`log::{debug,trace}!` macros, or passing zero-capacity `Vec::new()`,
`String::new()`, or `BTreeMap::new()` to `unwrap_or` or `or_insert`. `#[inline]`,
`#[cold]`, `Box<dyn Trait>` dispatch against generics (when no per-call heap
allocation occurs), bounds checks, SIMD autovectorization, struct field
reordering for cache lines without cross-core false sharing, or atomic memory
orderings argued without a committed or user-supplied profile or benchmark:
these are claims about code generation or hardware. A change that needs `unsafe`
to save work is a **tradeoff**, not a plain finding.
