# Allocation

**Does each unit allocate, copy or initialize more than it keeps or reads?**

## Expect

- Per-element and per-request code borrows what it only reads and takes
  ownership only of what it keeps.
- A buffer filled on each pass is cleared and reused, not dropped and
  allocated again.
- A collection whose final size is known before it is filled is sized once.
- Each unit writes only the storage it reads: a table or buffer of fixed
  capacity grows with what is written instead of starting with every slot
  filled.
- A comparison, lookup or log argument does not build an owned value only to
  compare or discard it.

## Look for

For each owned value the hot path creates, by `clone`, `to_string`,
`to_owned`, `to_vec`, `collect`, `format!`, `String::from`, `Box::new` or
pushes into a new `Vec` or `String`, find where it goes. A value that is
only read, compared or lent and then dropped was not needed. For each table
or buffer it initializes, find how much of it is read.

- Needless clone: a `String`, `Vec`, map or large struct cloned to pass to
  something that takes a reference, cloned to satisfy the borrow checker
  where a narrower borrow or `std::mem::take` would do, cloned inside a
  `map` that borrowing would serve, or cloned across `M` channel sends where
  a shared `Arc` or `Bytes` payload is only read.
- An owned value built to compare, look up or discard on a fast path:
  `to_string()`, `to_ascii_lowercase()` or `format!` before `==`, a `String`
  key built for a map lookup where the map's `Borrow` implementation accepts a
  `&str` or passed by value to `HashMap::entry` on routine hits, an eager
  fallback allocated inside `unwrap_or`, `ok_or` or `or_insert`, or
  `chars().collect::<Vec<char>>()` built only to scan or index text.
- Allocation per iteration or frame: a scratch `Vec`, `String`, map, line
  buffer (`BufRead::lines()`), vector, matrix or typed array created or
  dropped-and-reallocated (`buf = other.clone()`) inside the loop or
  animation-frame body where preallocated storage cleared, drained,
  `clone_from`-updated or overwritten each pass would serve, or backing storage
  reallocated when dimensions have not changed.
- Growth without capacity: pushes or appends into a `Vec`, `String`, Go
  slice/map, `StringBuilder` or `ArrayList` whose final length is known before
  the loop, paying repeated reallocation and copying.
- Storage filled to its capacity and read to a length: `[EMPTY; N]` beside
  a count, `Box::new([0; N])` or `vec![0; n]` of which only `..len` is
  read. Every unit pays for all N slots, here and in each struct that
  holds such storage and is built per unit.
- A collected sequence used once: `collect`, `.toList()`, `Array.from` or
  chained `.map().filter()` arrays materialized only to iterate, take a length
  or test emptiness; Java primitive boxing (`Integer`, `Long`) or Go
  `string([]byte)` conversions per element on a hot loop.
- Cross-seam repackaging: an intermediate `Vec`, slice, array, `List`, map or
  wrapper DTO materialized only to cross an internal layer or module seam
  within one unit and consumed once on the other side, where borrowing, a view
  or streaming keeps the external contract; or fresh broadcast or selector
  values allocated per state tick that force `M` subscribers to re-run.
- A value built only to measure it: serialized or formatted into a buffer
  to take its length, where the length follows from the parts.
- A copy of a large buffer or subtree that is then only read or dropped: `to_vec`
  of a slice, a `String` made from bytes that could be parsed in place, a
  full-tree deep clone where only one spine changes, or a transferable byte
  buffer structured-cloned across a worker boundary after its sender drops it.
- Deserializing through `serde_json::Value` and then into a type or forwarding
  envelope bytes that `RawValue` would slice, serializing into an intermediate
  `String` or `Vec<u8>` only to write bytes into a `Vec<u8>` or `io::Write`
  stream (`to_writer`), allocating regex `captures` where `is_match` or `find`
  suffices, or parsing into owned `String` fields where a typed parse or
  borrowed `&str` or `Cow` fields would do.
- A boxed future per call: `#[async_trait]` methods or `Box::pin` on a hot
  path, where an unboxed `async` or `impl Future` method (preserving any
  required `Send` bound) or a generic on an internal non-`dyn` trait would do.
- A routine failure built as a heavyweight error: an `anyhow::Error` per
  element on a path where failure is normal.

## Not a finding

- A `clone` of `Arc`, `Rc` or `Bytes`: it shares the data instead of copying
  it. Many threads cloning one `Arc` belong to [contention](contention.md).
- An owned value the receiver keeps: moved into a map, a channel, a struct
  or a spawned task.
- `collect` into a `Vec` from an iterator whose length is known, such as `map`
  or fixed-array `flat_map` over a slice (or `owned_vec.into_iter().filter(...)`
  compacting in place): it allocates at most once. Check borrowed chains, since
  `filter` and variable-length `flat_map` lose the exact length.
