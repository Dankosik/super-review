# Complexity

**Does the work grow with the input faster than the result needs?**

## Expect

- Work for one request grows with its input no faster than the result
  requires. Matching, joining or deduplicating N items against M takes
  O(N + M) with a map or a set, not O(N·M) with scans.
- A collection fits how the hot path uses it: lookup by key, ordered
  iteration, removal from the front.
- A question about part of the data does not process all of it: the
  minimum without a full sort, the first match without collecting every
  match, one field without cloning the whole value.
- Hashing on a hot path pays only for the protection its table needs:
  resistance to hash flooding where outside input decides which keys go in.

## Look for

For each loop or iterator chain on a hot path, find what bounds its length,
then what each iteration does with other collections.

- Nested passes: `contains`, `iter().position`, `iter().find` or
  `iter().any` on a `Vec` or slice inside a loop over another input;
  deduplication by scanning what was kept; `Vec::remove` or `insert` at an
  index inside a loop.
- Linear search per lookup: the same `Vec` searched by key on every call
  where a map or a sorted index built once would answer.
- A `Vec` used as a queue through `remove(0)`; a sorted `Vec` sorted again
  after each insertion.
- A full sort, `collect` or `clone` of a collection to answer one question:
  sorting to take the first or the k-th element, collecting to count or to
  test emptiness.
- A string indexed by character in a loop, `chars().nth(i)` or
  `chars().count()` per iteration, each walking it from the start.
- A string accumulated by `format!("{acc}{x}")` per iteration, copying what
  was already built.
- The default `HashMap` or `HashSet` hasher on a hot path where only the
  program decides which keys go in: integers or identifiers it assigns, a
  table filled at startup and only looked up afterwards, entries added only
  after their key is verified. A lookup with a key from a request cannot
  flood a table it cannot add to. The hash runs over the whole key, so a
  long key hashed per request, such as a token or a path, costs the most.
- A `BTreeMap` on a hot path where nothing needs the order.
- The same subproblem computed again in recursion where its result could be
  kept (memoization).
- Over-parallelization: `par_iter`, a thread or a task per item over inputs
  small enough that splitting and joining cost more than the work.

## Not a finding

- Quadratic work over an input that something keeps small: a fixed-size
  array, a list a protocol or configuration bounds to a handful of entries.
  Name the bound.
- A faster hasher for a table whose keys requests, peers or files decide.
  The default hasher's resistance to hash flooding protects it, and
  replacing it is a security decision.
- One collection over another of the same complexity for this use, or a
  hand-written loop over a standard operation already in the better class,
  such as `retain` or `sort`.
- Sequential CPU work that could run in parallel: splitting it spends more
  CPU for less latency, a tradeoff at most.
