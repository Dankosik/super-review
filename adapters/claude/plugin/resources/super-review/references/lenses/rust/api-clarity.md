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
express storing, consuming or transferring data. Generalize an argument to
`AsRef` or `IntoIterator` where a caller actually gains from it.

Standard conversion traits can make a conversion recognizable: `From` requires
infallible work, but also a meaning-preserving, semantically lossless and reasonably
unambiguous conversion. Keep a named operation for a meaningful choice such as
normalization, summarization or an encoding policy; fallible conversion can use
`TryFrom`. Implementations are public
commitments, not cosmetic wrappers. Inspect consumers, inference, function values
and relevant impls before changing signatures. Missing downstream context limits
the remedy; it does not establish that a breaking change is harmless.

Implement `From`, not `Into`: the blanket impl supplies `Into`, while a direct
`Into` impl hides the conversion from `T::from` calls and `?`. A zero-argument
`new` that only builds a value describes the same construction as `Default`;
when both exist, one can delegate to the other so the reader learns it once.
A `new` with effects such as spawning or registration is not a `Default`.

An inherent method that does what a standard trait names keeps that capability
out of the code that would use it: `to_string` without `Display` is absent from
formatting, a `from_str` or `parse` function without `FromStr` from `str::parse`,
an `iter` without `IntoIterator` from `for`, a plain `add` or `eq` from
operators and generic bounds. It also misleads where its contract differs from
the trait's. Recommend the trait when its semantics fit and a consumer would
use it; keep a domain verb for an operation that is not that conversion. An
operator impl should mean what the operator means: `+` that appends to a log or
`<<` that sends surprises the reader in the same way. A public library type
without `Debug`, or without the comparison traits its users would reach for,
leaves a gap downstream crates cannot fill; inside an application, add a trait
when a use appears.

A signature also speaks through what it accepts, returns and promises.
`&Vec<T>`, `&String`, `&PathBuf` or `&Box<T>`, as a parameter or a result,
names the container where `&[T]`, `&str`, `&Path` or `&T` names the contents,
and a `&Option<T>` parameter makes every caller own an `Option` where
`Option<&T>` accepts both. Conversion generics such as `impl Into<String>` or
`AsRef<Path>` serve a library's varied callers; in application code whose
callers are known they add a type parameter to read and a conversion to find.
A closure parameter asks for the least it needs: `FnOnce` if it is called once,
`FnMut` if called repeatedly, `Fn` only if it must be callable through a shared
reference. A returned type that borrows from an argument shows it with `'_`, as
in `Iter<'_>`, where a bare `Iter` hides the borrow.

A `Result` whose error no path produces, an `Option` that is always `Some`, or
an `async fn` that never awaits makes each caller handle or await something
that cannot happen; a trait or callback signature that fixes the shape is the
reason to keep it. A result
written into a `&mut` parameter that every caller creates empty is a return
value; keep the parameter where refilling caller-owned storage is the
operation. A parameter that hands over a whole configuration or state for one
field hides which fact the call depends on. A tuple result whose members a
reader cannot tell apart without the documentation, such as
`(bool, usize, usize)`, leaves their meaning to position at every call; a pair
with a natural order, such as the two halves of a split, is fine.

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
Ordinary optional settings fit a plain builder, without typestate.

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
