# Rust existing helpers

Owner: duplication
Rule: rust.duplication.share-knowledge

**Maintained owners over hand-rolled plumbing.** When changed code writes a
general mechanism, single-purpose wrapper/guard, manual standard trait impl, or
inline boundary glue by hand (re-parsing parsed values, round-trip formatting to
test a property, manual row/error-code/header/URL/form/unit plumbing, or an
indirect workaround where a crate exposes a direct API), delegate the generic
part to the first existing owner that fits and keep domain rules local:

1. **Standard library** stabilized within the crate's `rust-version` and
   `no_std`/`alloc` target constraints, including when changed code introduces
   new uses of legacy crates whose role `std` already covers (such as lazy/once
   statics, terminal checks, or parallelism counts) without turning untouched
   legacy uses into a migration backlog.
2. **Workspace helpers** across crates and modules (including trait methods and
   extension traits), searched by parameter/return types and call shape.
3. **Crate dependencies** already enabled in this crate's `Cargo.toml`,
   including methods, derives, and constants on already-imported types.
4. **Workspace or optional-feature crates** already in `Cargo.toml` features,
   `[workspace.dependencies]`, `Cargo.lock`, or project docs: recommend and name
   the feature or manifest edit as a smaller step than adding a net-new crate.
5. **Net-new widely used crates**: propose only when custom code carries
   non-trivial edge cases, naming the dependency as a team decision.
6. **Twin local helpers**: the same helper or `serde`/conversion adapter written
   across two or more real call sites today -> extract to the concept's module
   (never a grab-bag `utils`; single-caller extraction is Speculative Generality).

**Keep when:** a recorded decision rejects the crate or API (cite where), a
two-line domain-named helper avoids a net-new external crate, or the candidate
replacement differs on an edge callers reach: accepted inputs, empty input,
`char` vs byte indexing, overflow mode, rounding, ordering/stability, ties,
laziness, ownership/borrowing, panics vs `None`/`Err`, first-error precedence,
cancellation/drop timing, time precision, or wire/stored bytes (inspect local
sysroot or `Cargo.lock`-resolved crate source rather than guessing, and report
missing `rationale` when custom code stays silently for a boundary constraint).
