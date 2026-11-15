# Rust existing helpers

Owner: duplication
Rule: rust.duplication.share-knowledge

**Who already does this?** For code the change writes by hand to do a general
job rather than this project's own domain, ask who already does it. It may be
a small function (often private at the bottom of a module), a single-purpose
wrapper or guard type, a manual trait impl a derive or `std` adapter already
provides, inline glue around an imported type or crate (re-parsing a parsed
value, round-trip formatting to check a property, manual row/error-code/header/
URL/form/unit plumbing, or an indirect workaround where the crate offers a
direct API), or a whole coordination or parsing mechanism. Size does not
matter; a maintained owner of the same knowledge does. When custom code mixes a
generic mechanism with a domain or protocol rule, hand the generic part to that
owner and keep the domain rule in application code. Search in this order and
take the first that fits:

1. The standard library at the crate's `rust-version`: iterator and slice
   operations (`split_once`, `chunks`, `windows`, `chunk_by`), `Option` and
   `Result` combinators, `clamp`, `abs_diff`, `checked_*` and `saturating_*`
   arithmetic, `std::mem` (including `DropGuard` when within MSRV), `std::fmt`
   adapters and buffers (`from_fn`, `NumBuffer`), and `Path`. Actively check
   what the declared MSRV stabilizes, and verify stabilization versions against
   it.
2. A helper already in the workspace, in this crate or another one, under
   any name, including a trait method or an extension trait. Search by what
   it does: its parameter and result types, its loop shape, the standard
   calls inside it.
3. A crate already in this crate's `Cargo.toml` with the needed features
   enabled, including methods and constants on types the module already imports.
4. Enabling an optional feature on a crate already in `Cargo.toml`, or using a
   crate already declared in `[workspace.dependencies]`, `Cargo.lock` or
   project documentation for this job: recommend it and name the manifest or
   feature edit as a smaller project decision than adding a net-new external
   crate.
5. A widely used crate not yet in the workspace, only when the custom code
   carries non-trivial edge cases the crate already handles. Adding it is the
   team's decision: name the dependency as the cost.

A dependency already in `Cargo.toml`, or one the project's documentation
recommends for this job, is a choice the team has made: code beside it that
does the job by hand is the clearest candidate, even when nothing uses that API
yet. A workaround comment explaining how to feed or appease a library through an
indirect path is a signal to check whether the library exposes a direct entry
point. A recorded decision against a library or API for this job keeps the
hand-written code; cite where it is recorded.

Reinventing the wheel is the burden: every reader has to check that the copy
does what the standard version does. Recommend the replacement with the
call sites that change.

The reverse case belongs here too. The same helper or `serde`/conversion adapter
written in several modules under different names is one piece of knowledge held
in several places. Extract it once it has a second user today, in the change or
elsewhere in the snapshot; a use that might come later is Speculative
Generality. Put it where the project already keeps such helpers, or with the
concept it serves, not in a new grab-bag `utils` module; where it lives is
placement's question.

A replacement must behave the same on the edges callers reach: accepted inputs,
empty input, `char` versus byte indexing, overflow and its mode, rounding,
ordering and stability, which element wins on ties, laziness, ownership and
borrowing of the result, panics versus `None` or `Err`, which error surfaces
first, cancellation and drop timing, time precision, and exact wire or stored
bytes; for a mechanism or a derived impl, every behavior its users rely on.
Inspect locally available `std` or `Cargo.lock`-resolved crate source when
needed rather than assuming two similarly named APIs match. A replacement that
differs on one of those is not a plain replacement: name the difference, or keep
the custom code and report missing rationale when nothing at the site records
the boundary constraint that rules out the obvious API. Keep a helper that
carries domain meaning in its name, and a two-line helper whose replacement
would add a net-new external crate.
