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
  where a narrower borrow or `std::mem::take` would do, or cloned inside a
  `map` that borrowing would serve.
- An owned value built to compare or look up: `to_string()` or `format!`
  before `==`, a `String` key built for a map lookup where the map's
  `Borrow` implementation accepts a `&str`.
- Allocation per iteration: a scratch `Vec`, `String` or map created inside
  the loop body where one outside the loop, cleared each pass, would serve.
- Growth without capacity: pushes into a `Vec`, `String` or map whose final
  length is known before the loop, paying repeated reallocation and copying.
- Storage filled to its capacity and read to a length: `[EMPTY; N]` beside
  a count, `Box::new([0; N])` or `vec![0; n]` of which only `..len` is
  read. Every unit pays for all N slots, here and in each struct that
  holds such storage and is built per unit.
- A collected `Vec` used once: `collect` only to iterate, take a length or
  test emptiness.
- A value built only to measure it: serialized or formatted into a buffer
  to take its length, where the length follows from the parts.
- A copy of a large buffer that is then only read: `to_vec` of a slice, a
  `String` made from bytes that could be parsed in place.
- Deserializing through `serde_json::Value` and then into a type, or into
  owned `String` fields, where a typed parse or borrowed `&str` or `Cow`
  fields would do.
- A boxed future per call: `#[async_trait]` methods or `Box::pin` on a hot
  path, where a native `async fn` in a trait or a generic would do and the
  trait is not used through `dyn`.
- A routine failure built as a heavyweight error: an `anyhow::Error` per
  element on a path where failure is normal.

## Not a finding

- A `clone` of `Arc`, `Rc` or `Bytes`: it shares the data instead of copying
  it. Many threads cloning one `Arc` belong to [contention](contention.md).
- An owned value the receiver keeps: moved into a map, a channel, a struct
  or a spawned task.
- `collect` into a `Vec` from an iterator whose length is known, such as a
  `map` over a slice: it already allocates once. Check the chain, since an
  adapter such as `filter` loses the exact length.
