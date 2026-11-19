# Rust context

Go, TypeScript, Rust and Java have language contexts in this review. Source in
another language is listed as excluded, not reviewed by analogy.

## Where Rust code states its cost

Doc comments stating complexity or amortized bounds, `# Performance` sections,
benchmarks under `benches/` and `[[bench]]` targets with their input sizes,
committed flamegraphs or allocator profiles (`dhat`), upstream capacity
reservations or borrowed return types (`Cow`), `#[cold]`, `#![no_std]` or
`[target.'cfg(...)']` constraints, and crate plus workspace root `Cargo.toml`
(`edition`, `rust-version`, `[dependencies]`, `[workspace.dependencies]`,
enabled features, and `[profile.*]` for `debug_assertions`).

## Verify in source

The version in use is what `Cargo.lock` resolves, never `Cargo.toml` ranges or
memory. Inspect dependency source already on disk (`vendor/` or
`~/.cargo/registry/src`) and installed standard library source (`rust-src` under
`~/.rustup/toolchains/*/lib/rustlib/src/rust/library`, or `rust-docs` under
`~/.rustup/toolchains/*/share/doc/rust/html/src`).

Verify both sides of a claim in source: what the current code actually allocates,
locks, scans, or issues syscalls for, and what the proposed cheaper form does on
boundary inputs. Check API availability and edition semantics against the
project's `rust-version` and `edition`, because a local toolchain may be newer
than MSRV. Do not download crates or install toolchains. When needed source is
absent on disk, mark the step as an assumption: name the crate or std item, the
version, and the question its source would answer.

## Questions to settle before claiming

- **Ownership, clones, and copy-on-write**: inspect field definitions behind
  `#[derive(Clone)]`, `#[derive(Hash)]`, and `From`/`Into` conversions. Does the
  call copy heap data or bump a reference count? Does an extra strong `Arc`/`Rc`
  handle survive into `make_mut` or `unwrap_or_clone` and force a copy when no
  reader needs that handle?
- **Guard lifetimes and `Drop` side effects**: when does every lock or sharded
  map guard drop, including unnamed guards in `match` or `if let` scrutinees?
  Does a whole-map query lock every shard? Before moving a `Drop` outside a lock,
  check whether `Drop` only frees memory or performs observable synchronization,
  permit/FD release, or invariant updates.
- **Buffer and state reuse**: does loop or per-request scratch storage
  reallocate or shift remaining elements on every step where reusing capacity or
  a cursor avoids it? When proposing reuse (`clear()`, `thread_local!`, cached
  paths, pinned timers), check peak-memory retention, `O(capacity)` scans on
  cleared spike-grown maps, absolute/empty/multi-segment path resets, and timer
  cadence.
- **Async executors and task lifetimes**: does the path run blocking I/O,
  synchronous CPU work, or a data-parallel pool on an async executor thread?
  Check whether a proposed offload assumes a `multi_thread` runtime (never
  propose `tokio::task::block_in_place` where a `current_thread` runtime can run
  it). Check whether dropping a `JoinHandle` detaches work with no remaining
  consumer, or whether another consumer relies on its completion or side effects.
- **I/O framing, borrowing, and untrusted sizing**: does pre-sizing
  (`with_capacity(n)`) trust an uncapped external length that turns malformed
  input into OOM or panic? Does streaming or formatting (`write!` on unbuffered
  `io::Write`) split syscalls or framing, or need an explicit `.flush()?`? Does
  zero-copy parsing, ASCII folding, or collapsed metadata lookup keep escapes,
  malformed UTF-8, non-ASCII text, symlinks, and non-`NotFound` error mapping?

## Rust boundaries

- **Finding**: builds within the crate and workspace `Cargo.toml` (`edition`,
  `rust-version`, existing dependencies and enabled features, `#![no_std]` and
  targets), uses safe Rust, and keeps observable behavior.
- **Tradeoff**: requires `unsafe` (never propose UB such as `Vec::set_len` into
  uninitialized `&mut [u8]`), adds a crate or enables a Cargo feature, retains
  peak memory across requests (`thread_local!` buffers or small slices pinning
  large cached buffers), relaxes interactive flush or per-item commit
  durability, or makes early cancellation or receiver drop observable to
  producers.

## Not a finding in Rust

A lint or style observation with no hot-path cost count. A move, which copies no
heap data. Zero-capacity constructors (`Vec::new()`, `String::new()`,
`HashMap::new()`, `VecDeque::new()`, `BTreeMap::new()`) passed to eager
fallbacks such as `unwrap_or` or `or_insert`, and disabled `tracing` or `log`
callsites once source confirms level gating skips argument evaluation.
`#[inline]`, `#[cold]`, `Box<dyn Trait>` dispatch against generics (when no
per-call heap allocation occurs), bounds checks, SIMD autovectorization, struct
field layout without cross-core false sharing, or atomic memory orderings argued
without a committed or user-supplied profile or benchmark: these are claims
about code generation or hardware.
