# Rust control flow

## rust.flow.show-main-path

**Main path.** Can readers see the operation, alternatives and exits without
mentally evaluating nested plumbing? Compare the current structure with the
simplest expression of the same decisions, not the fewest lines.

A supported `?`, `if let`, `let else` or `match` can expose intent. Keep a match
whose arms express recovery or distinct work. Keep an ordinary loop when a
combinator chain hides state, effects or stopping conditions. Do not translate
all code into iterator pipelines or infer a finding from nesting alone.

Rust can let the check produce the value. An `unwrap`, `expect` or index that
follows an `is_some`, `is_ok`, `is_empty` or `contains_key` test makes the
reader pair the two; `if let`, `let else`, a `match` binding or
`first()`/`get()` asks once. Keep an `unwrap` or `expect` that asserts an
invariant no nearby pattern can bind, when the rewrite would be more roundabout
than the assertion: the panic then marks a bug, and its stated reason belongs
to rationale. A mutable flag set inside a loop and read after it carries a
decision that `find`, `any`, `position`, an early return, or a `loop` or
labeled block that breaks with a value states where it is made; `for` and
`while` cannot break with a value. An `if`/`else if` chain testing one value,
or a pair of values, is a `match` whose arms the compiler can check; `matches!`
states a pure variant test. A main path nested under successive `if let
Some`/`Ok` layers reads flatter with `?` or `let else` when each failure only
leaves. A condition tested twice in one function makes the reader hold a case
already settled.

A function that matches on an enum or `Option` its only caller has just built,
or that takes `Option<T>` only to return at once on `None`, makes the decision
one call too low: the caller that knows the case can call the specific path,
and the callee can state what it needs. Move a condition up only when the
caller owns the context and the callee's requirement stays visible in its
signature.

A `_` arm over an enum this crate owns is a legitimate default. It costs the
reader when they cannot tell which variants reach it, or when a variant added
later would silently take a path written for others; listing the variants then
keeps each decision visible. Keep the wildcard for a foreign or
`#[non_exhaustive]` type and for a remainder that is uniform by intent.

Preserve the relevant error conversion, return boundary, evaluation order,
eager/lazy defaults and drop scopes. A closure changes the return boundary;
short-circuiting can skip effects an eager collection performed. Establish the
supported edition/MSRV before introducing syntax. Show which decisions become
easier to follow, or retain the clear form.

A supported `Option::transpose` can directly express optional fallible work;
`collect::<Result<_, _>>()` or `try_fold` can express an existing fail-fast
transformation. Compare the resulting story, not a method checklist. Retain a
match for contextual recovery and a loop that accumulates all errors or makes
several related state changes. These are not equivalent to first-error exit.

Background: [Option](https://doc.rust-lang.org/std/option/enum.Option.html)
and [Iterator](https://doc.rust-lang.org/std/iter/trait.Iterator.html).
