# Serde mechanisms inside existing Rust questions

Use only for an implicated Serde boundary under [Rust context](../languages/rust.md),
verifying the format crate, Serde/`derive` versions, MSRV across transitive
derives, and `no_std`/`alloc`/`rc` features without executing procedural macros.

## representation

- **Direct wire adaptation**: replace boilerplate visitors with `rename`,
  `transparent` (Serde wire shape only, never Rust/FFI layout), or
  `from`/`try_from` when both serialize and deserialize contracts match; share
  repeated crate-local `with`/`serde_with` wire rules across modules. Eliminate
  two-pass deserialization through intermediate `String`/`Cow<str>`/`Value` when
  the target type or field adapter parses directly, and conversely use direct
  `Value` map access rather than a one-off `#[derive(Deserialize)]` struct to
  read or strip a single key from an already-parsed `Value`.
- **Keep when**: a custom visitor preserves legacy inputs, diagnostics, or
  directional `alias`/`default`/skip contracts; reordering `#[serde(untagged)]`
  variants would change first-match behavior; internal, adjacent, or untagged
  enum representations buffer via `alloc` in a `no_std` crate; `rc` serialization
  is mistaken for shared-pointer identity preservation; or merging wire DTO and
  domain model would couple external wire fields to internal invariants.

## api-clarity

- **Deserialization lifetimes**: use `DeserializeOwned` when results outlive
  temporary input buffers (`Deserialize<'static>` is not equivalent), and
  `Deserialize<'de>` only when callers benefit from borrowing surviving input
  (`Cow<'de, str>` borrows only when field attributes and format escapes allow;
  an owned `String` often removes more caller lifetime ceremony than borrowing
  saves).

Sources: [container attributes](https://serde.rs/container-attrs.html),
[field attributes](https://serde.rs/field-attrs.html),
[enum representations](https://serde.rs/enum-representations.html),
[lifetimes](https://serde.rs/lifetimes.html),
and [features](https://serde.rs/feature-flags.html).
