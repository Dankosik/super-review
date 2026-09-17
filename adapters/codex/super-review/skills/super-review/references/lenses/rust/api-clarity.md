# Rust API clarity

## rust.api.express-the-call

**Call contracts.** Read declarations and representative calls together. Can
callers understand units, alternatives, absence, failure, ownership and sequencing
without reconstructing the body? Identify implicit knowledge and show a concrete
before/after call or compatible clarification.

`Option`, `Result`, a domain enum or an existing value type may clarify a hidden
protocol. A boolean is clear when the actual call communicates its alternatives;
otherwise a named operation or mode can remove a lookup even for two alternatives.
Borrowed views such as `&str` or `&[T]` fit access-only work; owned inputs can
express storing, consuming or transferring data. Do not generalize every argument
to `AsRef` or `IntoIterator` without an actual gain.

Standard conversion traits can make a conversion recognizable: `From` requires
infallible work, but also a meaning-preserving, semantically lossless and reasonably
unambiguous conversion. Keep a named operation for a meaningful choice such as
normalization, summarization or an encoding policy; fallible conversion can use
`TryFrom`. Implementations are public
commitments, not cosmetic wrappers. Inspect consumers, inference, function values
and relevant impls before changing signatures. Missing downstream context limits
the remedy; it does not establish that a breaking change is harmless.

`AsRef` supplies a view; `Borrow` additionally requires compatible equality,
ordering and hashing where implemented. A domain newtype with different comparison
semantics need not expose `Borrow<str>`. `Deref` opens an implicit target API and
coercions, not just field access: retain it for a genuine pointer-like boundary,
not as an automatic convenience for every newtype.

For construction, compare actual calls with a named constructor, a configuration
value and a builder. A builder can explain several existing independent choices;
a simple constructor or struct literal may already do so. Keep required inputs
visible. Reusable configuration can justify borrowed setters/building, while
`build(self)` can express transfer of owned resources without artificial clones.
Do not introduce a typestate builder merely to encode ordinary optional settings.

Lifetime relationships are part of the call: a search key used only during lookup
need not share the result's lifetime from `&self`. Prefer elision when it already
expresses the relationship. Owned results can deliberately decouple callers from
input buffers, guards or storage; a borrowed rewrite is not an automatic gain.
For implicated return-position `impl Trait`, supported precise captures may replace
a workaround, but check the exact position, MSRV and edition's capture rules.

Background: [conversion semantics](https://doc.rust-lang.org/std/convert/trait.From.html#when-to-implement-from),
[Borrow](https://doc.rust-lang.org/std/borrow/trait.Borrow.html),
[Deref](https://doc.rust-lang.org/std/ops/trait.Deref.html),
[builders](https://rust-lang.github.io/api-guidelines/type-safety.html#builders-enable-construction-of-complex-values-c-builder),
[lifetime elision](https://doc.rust-lang.org/reference/lifetime-elision.html),
and [RPIT captures](https://doc.rust-lang.org/edition-guide/rust-2024/rpit-lifetime-capture.html).
