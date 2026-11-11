# Rust existing helpers

Owner: duplication
Rule: rust.duplication.share-knowledge

**Who already does this?** For each small function the change adds for a
general operation, such as on strings, slices, collections, numbers, time,
paths, retries, parsing or comparison, often private and at the bottom of a
module, ask who already does it. Search in this order and take the first
that fits:

1. The standard library at the crate's `rust-version`: iterator adapters,
   `Option` and `Result` combinators, `str` and slice methods such as
   `split_once`, `chunks` and `windows`, `clamp`, `abs_diff`,
   `checked_*` and `saturating_*` arithmetic, `Iterator::max_by_key`,
   `std::mem` and `Path`. Check each method's stabilization version against the MSRV.
2. A helper already in the workspace, in this crate or another one, under
   any name, including a trait method or an extension trait. Search by what
   it does: its parameter and result types, its loop shape, the standard
   calls inside it.
3. A crate already in `Cargo.toml` with the needed features, such as
   `itertools`, that offers the operation.
4. A widely used crate not yet in `Cargo.toml`, only when the helper carries
   logic with edge cases the crate already handles. Adding it is the team's
   decision: name the dependency as the cost.

Reinventing the wheel is the burden: every reader has to check that the copy
does what the standard version does. Recommend the replacement with the
call sites that change.

The reverse case belongs here too. The same helper written in several
modules under different names is one piece of knowledge held in several
places. Extract it once it has a second user today, in the change or
elsewhere in the snapshot; a use that might come later is Speculative
Generality. Put it where the project already keeps such helpers, or with the
concept it serves, not in a new grab-bag `utils` module; where it lives is
placement's question.

A replacement must behave the same on the edges callers reach: empty input,
`char` versus byte indexing, overflow and its mode, rounding, ordering and
stability, which element wins on ties, laziness, ownership and borrowing of
the result, and panics versus `None` or `Err`. A standard method that
differs on one of those is not a plain replacement; name the difference, or
the effect callers would see. Keep a helper that carries domain meaning in
its name, and a two-line helper whose replacement would add a dependency.
