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
  on the concrete type (`Arc`, `Rc`, and `Bytes` share backing bytes in `O(1)`;
  `String`, `Vec`, maps, and `Box` allocate and copy). Dropping and reallocating
  scratch storage inside a loop (`buf = incoming.clone()`, `mem::take`,
  `BufRead::lines()`, or `format!` into a reusable string) allocates every pass
  where reusing capacity (`clone_from`, `drain`, `write!`, `read_line`)
  amortizes allocation (**finding** within one unit; retaining grown
  `thread_local!` buffers across requests holds peak memory per thread and is a
  **tradeoff**). `collect` and `extend` pre-size only while `Iterator::size_hint`
  stays exact (`filter` and variable `flat_map` lose exact bounds on borrowed
  chains, whereas `owned_vec.into_iter().filter(...)` compacts in place).
  Copying `Bytes` via `to_vec` or `copy_from_slice` allocates where slicing or
  `Bytes::from` shares/transfers backing memory (**finding**, or **tradeoff**
  when a small slice pins a large buffer in a cache).
- **Map lookups, `HashMap::entry`, and eager fallbacks**:
  `std::collections::HashMap::entry` takes `K` by value, allocating and dropping
  an owned key on every hit when callers convert a borrowed `&str` -> look up
  through `Borrow` (`get`/`get_mut`) first and allocate only on misses, or use
  borrowed-key entry/lookup APIs on map crates already in `Cargo.toml`
  (**finding**). By-value fallbacks (`unwrap_or`, `ok_or`, `or`, `or_insert`)
  evaluate arguments eagerly on the fast path -> defer allocations with
  `*_else` / `or_insert_with` (**finding**); zero-capacity `Vec::new()`,
  `String::new()`, and `BTreeMap::new()` allocate nothing until grown.
  `HashMap`'s default SipHash resists hash flooding: switching an internal-key
  or verified-key hot map to a faster hasher already in `Cargo.toml` is a
  **finding** (**tradeoff** when adding a crate; keep default hashing wherever
  unverified external input chooses inserted keys).
- **Sorting, UTF-8 strings, and `regex` engines**: `slice::sort_by_key(f)`
  evaluates `f` on every comparison (`O(N log N)`), multiplying allocations
  inside `f` -> use a non-allocating `sort_by` comparator or
  `sort_by_cached_key`, and partial selection (`select_nth_unstable` guarded by
  `slice.len() > k`) for top-`k` or medians (**finding** when equal-element
  stability is unused). Collecting `Vec<char>` to scan or index UTF-8 allocates
  `4 * chars` bytes where byte or `char_indices` scans allocate nothing. ASCII
  case helpers (`eq_ignore_ascii_case`, `make_ascii_lowercase`) avoid
  `to_ascii_lowercase()` allocations (**finding** on ASCII inputs; keep Unicode
  case conversion on general text because non-ASCII characters can fold into
  ASCII). `str::replace` copies non-empty strings even on zero matches, and
  `String::from_utf8_lossy(b).into_owned()` copies nonempty valid UTF-8.
  Borrow the valid text or reuse an owned input buffer while preserving
  replacement of malformed sequences. Check owned conversion APIs such as
  `from_utf8_lossy_owned` against the project's MSRV and verify buffer reuse
  on the claimed path. Hoist `Regex::new`; prefer `is_match` or `find` over
  `captures` (which allocates capture slots on hits and misses alike) when
  capture groups go unread, and `RegexSet` over `M`-regex loops when byte spans
  and captures go unread (**finding**).
- **`serde` streams, borrowing, and directory walks**: passing unbuffered `File`
  or `TcpStream` handles to `serde_json::from_reader`/`to_writer` issues tiny
  syscalls and prevents slice borrowing -> wrap streams in
  `BufReader`/`BufWriter` (with explicit `.flush()?`), stream bytes directly via
  `to_writer` into `Vec<u8>` or `io::Write` (`String` implements `fmt::Write`,
  not `io::Write`) instead of intermediate `to_string`/`to_vec`, and borrow
  in-memory inputs with `#[serde(borrow)]` (`Cow<'de, str>`, or bare `&'de str`
  only when escapes cannot occur; verify `serde` actually wires borrowing through
  wrapper types such as `Option`). Forwarding or inspecting JSON envelopes
  through `RawValue` (`&RawValue` on slice/str inputs, `Box<RawValue>` on
  readers) avoids `serde_json::Value` heap trees (**finding** when `"raw_value"`
  is already enabled and `Value` normalization/deduplication is unused;
  **tradeoff** when enabling Cargo features); `#[serde(flatten)]` and
  internal/untagged enum tags buffer into an intermediate heap tree and break
  single-pass streaming and `RawValue` (reworking internal-only representations
  is a **finding**; external wire formats stay fixed). Batch `stdout` loops flush
  per newline unless written through a locked `BufWriter` with explicit `.flush()`
  (**finding** when per-line interactive flush and broken-pipe panics are unused,
  otherwise **tradeoff**). `DirEntry::file_type()` avoids extra `stat` syscalls
  and `PathBuf` allocations from `entry.path().is_dir()`, falling back to `stat`
  only on symlinks when following links (**finding**).
- **Pooled clients and SQL round trips**: pooled or multiplexed client handles
  (`reqwest`, `sqlx`, `tonic`, `redis` connection managers, `aws_sdk_*`) wrap
  shared state with `O(1)` `Clone` (`&self` on `reqwest`/`sqlx`/`aws_sdk_*`,
  `&mut self` on cheap per-task clones for `tonic` and `ConnectionManager`):
  rebuilding per request or wrapping in an outer `Mutex`/`RwLock` discards
  pooling and serializes callers (**finding**). Row-by-row SQL queries or inserts
  in loops pay `N` round trips -> batch via array binds (`UNNEST` / `ANY`) or
  non-empty multi-row builders within backend bind limits and prepared-statement
  caches (**finding** when per-row commit boundaries are unused, otherwise
  **tradeoff**); in `rusqlite`, hoist `prepare` (or `prepare_cached` when
  `"cache"` is enabled) and wrap batch writes in one transaction to save `N -> 1`
  autocommit commit/journal cycles (**finding** when per-row autocommit is
  unused, otherwise **tradeoff**).
- **Async executors, lock lifetimes, and fan-out (`tokio`, `rayon`)**:
  unbuffered `tokio::fs` pays per-call blocking-pool hand-offs, and synchronous
  CPU/crypto/compression or `rayon::par_iter()` on a Tokio worker blocks queued
  tasks -> buffer async file streams, offload standalone blocking CPU via
  `spawn_blocking`, and bridge Rayon via `rayon::spawn` plus `oneshot` so no
  Tokio blocking thread parks waiting on Rayon (**finding**). Brief critical
  sections without `.await` prefer `std::sync::Mutex` over `tokio::sync::Mutex`.
  Unnamed lock guards in `match` or `if let` scrutinees stay held across matched
  arm bodies in every Rust edition (and across `else` before Edition 2024), and
  dropping or clearing heap-owning elements inside a guard frees allocations
  under the lock (clearing `Copy` buffers like `Vec<u8>` is `O(1)` with `0`
  frees) -> bind so the guard drops before branching and `mem::replace`/swap so
  old allocations drop after unlocking (**finding**). Recreating timers
  (`tokio::time::sleep`) or stateful futures every turn of a hot `select!` loop
  re-registers timer-wheel or future state where a pinned `Sleep` reset on
  activity and expiration (for inactivity timeouts) or `interval` (for fixed
  cadence ticks, firing first at `t = 0`) reuses it, and cloning owned payloads
  across `M` channel sends copies heap data where `Arc` or `Bytes` shares
  read-only payloads (**finding**).
- **Observability, errors, build profiles, and `Cargo.toml` baseline**:
  disabled `tracing::{debug,trace}!` callsites skip argument evaluation via
  callsite `Interest`, and `log::{debug,trace}!` skips arguments when
  compile-time `STATIC_MAX_LEVEL` or global `log::max_level()` disables that
  level (eager calls inside `log::debug!` still run when another module raises
  global `max_level()` unless guarded by `log::log_enabled!`); work evaluated
  before either macro, or enabled spans/events such as unskipped `#[instrument]`
  `Debug` formatting, runs per call. `anyhow::Error` allocates (and captures
  backtraces when `RUST_LIB_BACKTRACE=1`, or non-zero `RUST_BACKTRACE` without
  `RUST_LIB_BACKTRACE=0`; state whether production enables them or mark unknown)
  on routine per-element failure paths (**finding** internal to the crate).
  `debug_assert!` and `cfg(debug_assertions)` are absent from default release
  builds; read `[profile.*]` before counting them. Respect `edition`,
  `rust-version` (`OnceLock` 1.70, `async fn` / `impl Future + Send` in traits
  1.75 where bare `async fn` omits `#[async_trait]`'s default `+ Send`,
  `LazyLock` 1.80), enabled features, and `[dependencies]` in `Cargo.toml`
  (adding a crate or feature is a **tradeoff**).

## Dependencies

The version in use is the one `Cargo.lock` resolves, not the one a document
or `Cargo.toml` names. Read a dependency's source where it already is on
disk: a vendor directory, or Cargo's registry cache under
`~/.cargo/registry/src`. Do not download it. When it is not on disk, a step
that depends on it is an assumption: name the crate, the version and the
question its source would answer.

## Not a finding in Rust

A lint or style observation with no hot-path cost count. A move, which copies no
heap data. Evaluating arguments inside disabled `tracing::{debug,trace}!`
callsites (or `log::{debug,trace}!` when compile-time or global max level
disables that level, or arguments run no eager calls), or passing zero-capacity
`Vec::new()`, `String::new()`, or `BTreeMap::new()` to `unwrap_or` or
`or_insert`. `#[inline]`, `#[cold]`, `Box<dyn Trait>` dispatch against generics
(when no per-call heap allocation occurs), bounds checks, SIMD
autovectorization, struct field reordering for cache lines without cross-core
false sharing, or atomic memory orderings argued without a committed or
user-supplied profile or benchmark: these are claims about code generation or
hardware. A change that needs `unsafe` to save work is a **tradeoff**, not a
plain finding.
