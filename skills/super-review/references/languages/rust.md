# Rust context

**Compatibility.** Read the owning crate's `Cargo.toml` at H and resolve explicitly
inherited `edition` and `rust-version` through its workspace, including
`package.workspace` when present. The supported minimum Rust version (MSRV), not
a newer local toolchain or a sibling crate, bounds syntax and library advice.
An edition is not an MSRV. Read relevant features, target declarations, `cfg`
conditions and `no_std`/`alloc` boundaries; mutually exclusive implementations
need not coexist. Read dependency declarations, `Cargo.lock` or committed Cargo
configuration only when a proposed operation depends on them. Missing baseline
or feature context limits that recommendation; it does not authorize an upgrade.

**Judgment.** Apply Rust knowledge inside the assigned lens, not as another broad
idiom pass. Prefer an understandable ownership and call contract over cleverness.
Local mutation, ordinary loops, explicit matches, owned values and concrete types
can already be the clearest expression. Compare implicated handwritten mechanics
with existing helpers and supported standard-library operations. Establish the
exact contract and availability before recommending a replacement. Clippy's
pedantic and restriction lints are not automatically team policy. Do not produce
formatting chores or dependency migrations without an in-scope benefit.
Never run Cargo, rustc, Clippy, rustfmt, build scripts or procedural macros during
review. Missing expansion or generated source remains an evidence gap.

**Preservation.** Check only properties implicated by a proposed transformation:
borrowing versus consuming, aliasing and mutation, error types and sources,
short-circuiting and eager/lazy evaluation, and drop/guard lifetime. `Clone` need
not create independent data; cloning an `Arc` preserves shared ownership. A
collection can deliberately snapshot data or end a borrow. Public signatures,
trait implementations, auto traits, lifetime captures, serialization and FFI
layouts can constrain a local simplification. Inspect available consumers;
absence from literal search does not prove no downstream use. Narrow or withhold
incompatible advice, without claiming compilation, equivalence or soundness.

**Production scope.** Path and generated-header filtering is not a Rust parser or
Cargo target resolver. Use manifests and declarations to exclude custom test or
benchmark targets and test-only modules/items (`cfg(test)`, `#[test]`, and
framework test attributes). Mixed files remain reviewable for production items;
incidental test text in a window or search match is not reviewed coverage. Do not
exclude a production file merely because it contains a test module. Explain any
ambiguous target, macro or conditional boundary that limits coverage.

Use [language routing](../languages.md) to select the Rust implementation of the
assigned lens and owner profiles. The shared workflow owns coverage; these are
not extra workers or a mandatory all-module packet.

Background: [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/),
[Cargo MSRV](https://doc.rust-lang.org/cargo/reference/rust-version.html),
[workspaces](https://doc.rust-lang.org/cargo/reference/workspaces.html),
[targets](https://doc.rust-lang.org/cargo/reference/cargo-targets.html),
[drop scopes](https://doc.rust-lang.org/reference/destructors.html),
and [Clippy usage](https://doc.rust-lang.org/clippy/usage.html).
These are engineering context, not extra mandatory policy or a required web
lookup during each review. Version-sensitive advice uses the crate's baseline.
