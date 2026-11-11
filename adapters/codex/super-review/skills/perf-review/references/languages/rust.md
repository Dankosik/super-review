# Rust context

Only Rust has a language context in this version. Source in another language
is listed as excluded, not reviewed by analogy.

## Where Rust code states its cost

Doc comments that give a complexity or say "amortized", `# Performance`
sections, benchmarks under `benches/` and the inputs they use,
`with_capacity` and `reserve` upstream, `Cow` and borrowed return types,
`#[cold]`, and the `[profile.*]` sections of `Cargo.toml` that say how the
shipped binary is built.

## Semantics to settle before claiming

A candidate that rests on one of these must show it from the source, the
documentation or the resolved dependency version, not from memory.

- **What `clone` costs depends on the type.** `Arc`, `Rc` and `Bytes` share
  their data; `String`, `Vec`, maps and `Box` allocate and copy. Resolve the
  type through generics and aliases first.
- **What the release build contains.** `debug_assert!` and code under
  `cfg(debug_assertions)` are absent from a default release build; read the
  profile before counting them.
- **Sizing.** `collect` and `extend` reserve from the iterator's
  `size_hint`, and `clear` keeps a buffer's capacity. `format!` always
  allocates; `write!` into an existing `String` reuses it.
- **Hashing.** `HashMap`'s default hasher is randomly keyed to resist hash
  flooding; faster hashers give up some or all of that.
- **Mutexes in async code.** A `std::sync::Mutex` held with no `.await`
  inside is what the Tokio documentation recommends; an async mutex is for
  guards held across an `.await` and costs more per lock.
- **Files in Tokio.** `tokio::fs` sends each operation to the blocking pool,
  so many small reads or writes are many hand-offs; a buffer in front of the
  file batches them. `block_in_place` needs the multi-thread runtime.
- **Standard output.** `println!` locks stdout on every call, and stdout is
  line-buffered, so each line is a write.
- **Compiled patterns.** `Regex::new` compiles on every call; the `regex`
  documentation says to compile once and reuse.

## Dependencies

The version in use is the one `Cargo.lock` resolves, not the one a document
or `Cargo.toml` names. Read a dependency's source where it already is on
disk: a vendor directory, or Cargo's registry cache under
`~/.cargo/registry/src`. Do not download it. When it is not on disk, a step
that depends on it is an assumption: name the crate, the version and the
question its source would answer.

## Not a finding in Rust

A lint or style observation. A move, which copies no heap data. `#[inline]`,
`Box<dyn Trait>` against generics, or bounds checks argued without a
profile: these are claims about code generation. A change that needs
`unsafe` to save work is a tradeoff, never a plain finding.
