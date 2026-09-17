# Serde mechanisms inside existing Rust questions

Use only for an implicated Serde boundary and the assigned owner under
[Rust context](../languages/rust.md). This is not a separate profile. Resolve the
format crate, Serde/derive versions and features; core Serde's MSRV alone does not
establish the MSRV of the derive/transitive dependency combination.

## representation

Does handwritten serialization express a real format adaptation or merely repeat
the data shape? A derive with explicit `rename`, `transparent`, or `from`/`try_from`
can localize a mechanical representation or existing wire-to-domain conversion.
Compare both serialization and deserialization contracts, not just one JSON value.
`transparent` describes Serde's representation, not Rust layout or FFI ABI.

Keep a custom visitor or `with` adapter for a meaningful legacy format, input
alternatives or diagnostics. `alias`, `default`, renaming and directional skipping
have different contracts. An enum must not silently replace published fields.
`untagged` tries variants in declaration order: reordering is not merely cosmetic.
Internal/adjacent/untagged deserialization needs `alloc`; externally tagged enum
deserialization can work without it. This does not make every field or format
allocation-free. Check actual `no_std`/`alloc`, `derive` and `rc` capabilities.
Serde's `rc` support does not preserve shared-pointer identity across the wire.

## api-clarity

Does the result borrow a surviving input, or become independent of temporary
storage? `Deserialize<'de>` can express the former; `DeserializeOwned` expresses
independence for all input lifetimes. `Deserialize<'static>` is not a substitute
for the latter. An owned `String` may remove more caller obligations than a
borrowed field saves. `Cow` does not promise automatic borrowing for every format
or representation: inspect field attributes and the format's deserializer.

Retain a clear DTO/domain boundary and existing helpers. Do not require one type
to serve both wire and domain roles, a new serialization crate, or a derive whose
bounds/diagnostics change the supported contract. Unavailable macro output stays
a local evidence gap; never execute derive macros during review.

Sources: [container attributes](https://serde.rs/container-attrs.html),
[field attributes](https://serde.rs/field-attrs.html),
[enum representations](https://serde.rs/enum-representations.html),
[lifetimes](https://serde.rs/lifetimes.html),
and [features](https://serde.rs/feature-flags.html).
