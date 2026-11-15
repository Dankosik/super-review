# Rust control flow

## rust.flow.show-main-path

**Visible main path.** Compare the function's structure with the most direct
Rust expression of the same decisions so readers see the main path,
alternatives, and exits without tracking nested plumbing.

Let checks produce values and decisions sit where they are made:
- Replace check-then-extract pairs (`is_some`/`is_ok`/`is_empty`/`contains_key`
  followed by `unwrap`, `expect`, or indexing) with `if let`, `let else`, a
  `match` binding, or `first()`/`get()`.
- Flatten a main path buried under stacked `if let Some`/`Ok` blocks with `?` or
  `let else` when failure only exits, and collapse conditions tested twice in
  one function.
- Replace a mutable flag set in a loop and read afterward with `find`, `any`,
  `position`, an early `return`, or a `loop`/labeled block that breaks with a
  value (`for` and `while` cannot break with a value).
- Rewrite an `if`/`else if` chain testing one value or tuple as a `match` the
  compiler checks, or `matches!` for a pure variant test.
- Lift decisions placed one call too low: when a callee matches on an enum or
  `Option` its only caller just constructed, or takes `Option<T>` only to return
  immediately on `None`, let the caller call the specific path directly so the
  callee's signature states what it actually needs.
- Spell out variants in a `_` wildcard arm over a crate-owned enum when readers
  cannot tell which variants reach it or a new variant would silently take a
  branch written for others.
- Use `Option::transpose`, `collect::<Result<_, _>>()`, or `try_fold` (within
  edition/MSRV) when they express optional or fail-fast work more directly than
  manual plumbing.

**Keep when:** a `match` performs contextual recovery or distinct per-arm work;
an ordinary loop makes state updates, early exits, or error accumulation clearer
than combinators (accumulating all errors is not fail-fast); an `unwrap` or
`expect` marks an invariant no nearby pattern can bind without roundabout code;
a `_` arm covers a foreign or `#[non_exhaustive]` type or a genuinely uniform
remainder; or a rewrite would change error conversion, closure return
boundaries, evaluation order, eager versus lazy effects, drop scopes, or exceed
the crate's edition/MSRV. Show which decisions become easier to follow.

Background: [Option](https://doc.rust-lang.org/std/option/enum.Option.html)
and [Iterator](https://doc.rust-lang.org/std/iter/trait.Iterator.html).
