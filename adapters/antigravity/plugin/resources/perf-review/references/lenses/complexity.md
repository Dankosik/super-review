# Complexity

**Does the work grow with the input faster than the result needs?**

## Expect

- Work for one unit grows with its input no faster than the result requires.
  Matching, joining, or deduplicating `N` items against `M` takes `O(N + M)`
  with a map or set, not `O(N * M)` with scans.
- A collection fits how the hot path uses it: lookup by key, ordered iteration,
  removal from the front.
- A question about part of the data does not process all of it: top-`k` or
  median without a full sort, first match without collecting every match, one
  field without cloning the whole value.
- Hashing on a hot path pays only for the protection its table needs:
  resistance to hash flooding where outside input decides which keys go in.

## Look for

For each loop or iterator chain on a hot path, find what bounds its length,
then what each iteration does with other collections or prefixes.

- **Nested linear scans and front shifts**: linear membership/find checks
  inside another loop, deduplication by scanning kept elements, removing from
  or inserting at the front of a contiguous sequence per item in a loop, or
  re-sorting after every insertion.
- **Repeated linear lookup**: searching the same sequence by key on every call
  where an index or map built once would answer in `O(1)` or `O(log N)`.
- **Full work for a partial question**: sorting everything to take the first or
  `k`-th item, recomputing an allocating key inside every sort comparison
  (`O(N log N)` instead of `O(N)`), materializing a collection only to count or
  check emptiness, or scanning an input `M` times against `M` separate patterns
  when one multi-pattern pass suffices.
- **Quadratic prefix growth, UTF-8 indexing, or re-parsing**: appending or
  spreading a growing string, slice, or object per step; indexing characters
  from the start of a UTF-8 string in a loop; re-parsing a full growing buffer
  from offset 0 on each chunk; or deep-cloning an `N`-node tree per edit.
- **Unneeded hashing or ordered maps**: a lookup table whose value is cheaper
  to derive directly; an ordered tree map where nothing relies on key order; or
  the default hash-flood-resistant hasher on a hot path where only the program
  decides which keys go in (program-assigned IDs, startup-filled tables, or
  entries added only after verification). A lookup with a key from a request
  cannot flood a table it cannot add to.
- **Repeated subproblems or over-parallelization**: unmemoized overlapping
  recursion, or parallel splitting over tiny inputs where fork/join overhead
  exceeds the work.

## Not a finding

- Quadratic work over an input that something keeps small: a fixed-size array,
  or a list a protocol or configuration bounds to a handful of entries. Name
  the bound.
- A faster hasher for a table whose keys requests, peers or files decide. The
  default hasher's resistance to hash flooding protects it, and replacing it is
  a security decision.
- One collection over another of the same complexity for this use, or a
  hand-written loop over a standard operation already in the better class.
- Sequential CPU work that could run in parallel: splitting it spends more CPU
  for less latency, a tradeoff at most.
