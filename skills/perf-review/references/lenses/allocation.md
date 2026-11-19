# Allocation

**Does each unit allocate, copy or initialize more than it keeps or reads?**

## Expect

- Per-element and per-request code borrows what it only reads and takes
  ownership only of what it keeps.
- A buffer filled on each pass is cleared and reused, not dropped and
  allocated again.
- A collection whose final size is known before it is filled is sized once
  (when the bound is trusted).
- Each unit writes only the storage it reads: a table or buffer of fixed
  capacity grows with what is written instead of starting with every slot
  filled.
- A comparison, lookup, fallback, or log argument does not build an owned value
  only to compare or discard it.

## Look for

For each owned value, copy, or initialized buffer the hot path creates, trace
where it goes. A value that is only read, compared, or lent and then dropped
was not needed.

- **Needless clones and copies**: cloning a heap-owning value to satisfy a
  borrowing consumer, cloning across `M` read-only recipients where a shared
  handle works, or copying a buffer or subtree when only a view or one changed
  spine is needed.
- **Throwaway values on fast paths**: allocating owned keys, formatted strings,
  decoded arrays, or eager fallback values only to compare, look up on routine
  hits, match without reading captures, or discard on the common path.
- **Per-iteration scratch and unsized growth**: allocating or replacing scratch
  buffers, line strings, or frame arrays inside a loop or tick where clearing
  and reusing storage avoids allocation; growing a collection without reserving
  a known trusted capacity.
- **Storage filled to its capacity and read to a length**: fixed-size arrays or
  zeroed buffers initialized in full per unit when only `..len` is read.
- **Single-use materialization and cross-seam repackaging**: collecting a lazy
  sequence only to iterate once, count, or test emptiness; boxing primitives;
  or building intermediate trees, strings, buffers, or wrapper collections only
  to hand data across an internal seam or serialization step when borrowing or
  streaming keeps the external contract.
- **Heavyweight per-element errors or boxed calls**: allocating dynamic futures
  or rich backtrace-capturing errors on paths that run or fail routinely per
  element.

## Not a finding

- A `clone` of a shared handle (`Arc`, `Rc`, `Bytes`): it shares backing data
  instead of copying it, unless keeping the extra strong reference alive forces
  a copy-on-write clone (`Arc::make_mut`, `Rc::make_mut`, `unwrap_or_clone`).
  Many threads cloning one `Arc` belong to [contention](contention.md).
- An owned value the receiver keeps: moved into a map, a channel, a struct or a
  spawned task.
- Collecting from an iterator whose exact length is known (or in-place owned
  compaction): it allocates at most once. Check borrowed filter/variable
  flat-map chains whose lower size bound drops to zero.
