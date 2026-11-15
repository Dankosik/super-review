# Rust context

Only Rust has a language context in this version. Tests in another language
are listed as excluded.

## Where tests live

- Unit tests: `#[cfg(test)]` modules inside the crate, with access to private
  items. Integration tests: each file under `tests/` is its own crate and
  sees only the public API. Doc tests: examples in doc comments, unless
  marked `ignore` or `no_run`.
- Tests the project's own command does not run: `#[ignore]`, tests behind a
  feature that is off by default, targets excluded in the workspace or in CI
  configuration.
- Retries configured in the test runner hide unstable tests; note them.

## Choosing a mutant

A workspace that denies warnings turns an unused binding, import or `mut`
left by a careless mutant into a compile error, which shows nothing about
the tests. An exhaustive match, a `#[must_use]` result or a type that makes
the mistake unrepresentable is pinned by the compiler and needs no test.

Forms a plausible Rust mistake takes:

- `<` for `<=`, `..` for `..=`, `min` for `max`, `saturating_sub` dropped.
- `map_err` to a neighboring variant; a specific arm removed so the wildcard
  takes it; `?` replaced by `.ok()` or `let _ =`.
- `unwrap_or(default)` with another default; `Some`/`None` or `Ok`/`Err`
  swapped on one branch.
- `Instant::now() + timeout` where a deadline computed above was passed down;
  a `timeout` wrapper removed from one await.
- `biased;` removed from a `select!`; a cancellation arm dropped.
- A guard bound with `let _ =` so it drops at once; cleanup moved after a `?`.
- A counter or label recorded with the wrong value, on the wrong branch, or
  not at all on an early return.
- A spawned task's handle dropped where it was awaited.

## Writing a witness

Write it for the place beside the crate's own tests for that code, with its
helpers and fakes. Use the paused clock when the crate's tests do
(`#[tokio::test(start_paused = true)]`); code under it must measure with
`tokio::time`. Synchronize on a handle, a notification or observable state,
never on a sleep. Assert through what a caller or operator observes.

## Reading a test for stability

A test under a paused clock on a current-thread runtime does not depend on
real time. A multi-thread runtime, `tokio::spawn` without a join, a
real-time sleep before an assertion, iteration over a `HashMap`, a
process-wide static or environment variable, and a fixed port are where two
orders of events come from.

## Dependencies

The version in use is the one `Cargo.lock` resolves. Read a dependency's
source where it already is on disk: a vendor directory, or Cargo's registry
cache under `~/.cargo/registry/src`. When it is not on disk, a step that
depends on it is an assumption: name it.

## Not a finding in Rust

Missing tests for `Debug`, `Clone` or other derived behavior nobody
documented. `unwrap` and `expect` in tests. Tests of private helpers when no
rule says otherwise.
