# Rust context

Only Rust has a language context in this version. Source in another language
is listed as excluded, not reviewed by analogy.

## Where Rust code says what it does

Doc comments, especially `# Errors` and `# Panics`. Types: an error enum's
variants and their `Display` text, state enums, newtypes that state
validity, `Option` against `Result`, `#[must_use]`. Names of variants,
constants and fields, including their units. Descriptions passed to metrics
and tracing macros.

## Semantics to settle before claiming

A candidate that rests on one of these must show it from the source or the
resolved dependency version, not from memory.

- **Cancellation is a drop.** A future that is dropped stops at the `.await`
  where it was suspended. Nothing after that point runs; only destructors do.
  A branch of `select!` that loses is dropped when its future was created in
  the `select!`; a future polled through `&mut` survives.
- **`select!` order.** Tokio's `select!` polls ready branches in random order
  unless `biased;` is present, which polls top to bottom.
- **Timeouts.** `tokio::time::timeout` returns `Err(Elapsed)` only for the
  limit; the inner future's own error arrives as `Ok(Err(..))`. A timeout
  around a future does not stop work that future spawned elsewhere.
- **Spawned tasks.** `tokio::spawn` starts the task at once. Dropping a
  `JoinHandle` detaches the task; it does not cancel it. A panic inside a task
  reaches whoever awaits the handle as a `JoinError`; with no one awaiting, the
  panic is printed and the process continues. Dropping a `JoinSet` aborts its
  tasks. `abort` takes effect at the task's next suspension point.
- **Laziness.** An `async fn` call does nothing until awaited or spawned.
- **Drop timing.** `let _ = value;` drops immediately; `let _guard = value;`
  holds to the end of the scope. Locals drop in reverse declaration order.
- **Conversions.** `?` converts the error through `From`; look at that
  implementation before deciding how a cause is reported. `unwrap_or(x)` and
  `ok_or(x)` evaluate `x` eagerly.
- **Channels and signals.** A bounded `mpsc` send waits when full; `watch`
  keeps only the latest value; `broadcast` receivers can lag;
  `Notify::notify_waiters` wakes only tasks already waiting.
- **Locks.** A `std::sync::Mutex` is poisoned by a panic while held; Tokio's is
  not. Holding either across an `.await` has different consequences.
- **Arithmetic.** Integer overflow panics in the test profile and wraps in a
  default release build; `Instant + Duration` and `Duration - Duration` panic
  when the result is out of range. A trace that depends on this must say
  which profile.
- **Intervals.** `tokio::time::interval`'s first tick completes immediately,
  and missed ticks burst by default.

## Dependencies

The version in use is the one `Cargo.lock` resolves, not the one a document
or `Cargo.toml` names. Read a dependency's source where it already is on
disk: a vendor directory, or Cargo's registry cache under
`~/.cargo/registry/src`. Do not download it. When it is not on disk, a step
that depends on it is an assumption: name the crate, the version and the
question its source would answer.

## Not a bug in Rust

A lint or style observation, unless a located team rule states it as a
requirement on behavior and someone is affected. `unwrap` or `expect` whose condition the surrounding
code establishes. A panic the documentation declares. Unsoundness speculation
about safe code. A property the compiler already enforces.
