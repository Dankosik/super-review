# Rust API clarity

## rust.api.express-the-call

**Call contracts.** Read declarations and representative calls together so a
caller sees units, alternatives, absence, failure, ownership, and sequencing
without reconstructing the body. Show a concrete before/after call or compatible
clarification.

Express what the call actually accepts, returns, and promises:
- **Honest ownership and bounds**: borrowed slice, string, or path views for
  read-only access, owned parameters when storing or transferring data, the
  least-demanding closure trait the body needs, explicit `'_` on returned
  borrows (`Iter<'_>`) so borrows from inputs stay visible, and decoupled
  lifetimes on lookup-only keys. Reserve `AsRef`, `Into`, or `IntoIterator`
  conversion generics for varied callers; in internal application code whose
  callers are known, concrete types read directly.
- **Honest effects and results**: use a synchronous helper for work without
  suspension when callers need only its immediate result. Keep the future when
  callers rely on deferring or discarding the work before its first poll.
  Drop never-failing `Result` and always-`Some` `Option`; return values directly
  instead of writing into a `&mut` buffer every caller creates empty; pass the
  needed value rather than a whole configuration or state struct for one field;
  and replace positional multi-element tuples or ambiguous boolean arguments with
  named types, domain enums, or named operations when the call site leaves
  meaning to position.
- **Standard traits and conversions**: expose `From` (infallible, lossless,
  unambiguous) or `TryFrom` instead of bespoke conversion helpers, while keeping
  named operations when a conversion chooses a policy (normalization, lossy
  summary, encoding) or `new` performs effects (`Default` is pure construction,
  delegating with zero-arg `new` when both exist). Implement standard traits
  (`Display`, `FromStr`, `IntoIterator`, `Debug`, comparison and operator traits)
  when semantics match and consumers reach for them (inside an application, add
  traits only when used; never overload operators for side effects). Use `AsRef`
  for cheap views, `Borrow` only when `Eq`, `Ord`, and `Hash` match the borrowed
  representation, and `Deref` only for genuine smart-pointer boundaries rather
  than newtype field convenience.
- **Proportionate construction and handle semantics**: prefer a struct literal
  or named constructor before a builder; when several independent optional
  choices earn a builder, take mandatory inputs in `Builder::new(required)`
  rather than storing them as `Option` fields that fail or panic in `build()`
  (removing invalid states without typestate ceremony), and use a plain builder
  (`build(self)` when transferring owned resources, borrowed setters when
  reusing configuration). Distinguish value types from shared handles
  (`Arc<Mutex<Inner>>` or interior mutability behind `&self`): when `Clone`
  aliases mutable state and `&self` mutates, the type's name and API should make
  that shared-handle contract visible rather than reading like an immutable
  value.

**Keep when:** a trait or callback signature fixes an infallible, optional, or
`async` shape; refilling caller-owned `&mut` storage is the operation; a natural
two-part split tuple is already self-explanatory; owned return values
deliberately decouple callers from input buffers, guards, or storage; RPIT
precise captures or signature changes exceed the crate's MSRV/edition capture
rules; or downstream compatibility is unknown under shared compatibility
judgment.

Background: [conversion semantics](https://doc.rust-lang.org/std/convert/trait.From.html#when-to-implement-from),
[Borrow](https://doc.rust-lang.org/std/borrow/trait.Borrow.html),
[Deref](https://doc.rust-lang.org/std/ops/trait.Deref.html),
[builders](https://rust-lang.github.io/api-guidelines/type-safety.html#builders-enable-construction-of-complex-values-c-builder),
[lifetime elision](https://doc.rust-lang.org/reference/lifetime-elision.html),
and [RPIT captures](https://doc.rust-lang.org/edition-guide/rust-2024/rpit-lifetime-capture.html).
