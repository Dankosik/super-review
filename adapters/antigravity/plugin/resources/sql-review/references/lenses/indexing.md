# Indexing

**Do indexes match actual predicates, joins, and sort orders without unneeded
write or scan blowup?**

## Expect

- Queries on indexed columns keep predicates sargable so the engine can seek
  existing indexes rather than scanning full tables.
- Composite index column order aligns with equality predicates, range filters,
  and sort order; foreign keys used in joins or parent deletes have supporting
  indexes.
- Indexes are neither duplicated nor left invalid, and pagination avoids deep
  linear offset skips on hot paths.

## Look for

Cross-reference cumulative index definitions against query predicates, joins,
sorts, foreign keys, and any committed or supplied `EXPLAIN` outputs.

- **Non-sargable predicates on indexed columns**: wrapping an indexed column in
  a function, arithmetic, cast, implicit type or collation conversion, or
  leading-wildcard pattern when a sargable range or expression index keeps
  semantics.
- **Missing indexes on high-fanout paths**: unindexed foreign-key columns hit
  by parent deletes, cascades, or hot joins, or hot equality/range/sort
  predicates with no matching index when table scale or hotness is established
  in source, docs, or `EXPLAIN`.
- **Composite column-order and sort mismatches**: range predicate placed before
  equality on high-cardinality columns; omitted high-cardinality leading column
  where the dialect cannot skip-scan; or mixed `ASC`/`DESC` or `NULLS` ordering
  defeating an index-ordered `LIMIT` scan.
- **Redundant, duplicate, or invalid indexes**: exact duplicate indexes,
  strict prefix indexes `(a)` beside `(a, b)` when none of the `Keep when`
  guards below apply, or leftover invalid indexes from failed concurrent builds.
- **Deep `OFFSET` and over-wide scans**: unbounded `OFFSET` skipping linear
  rows on paginated hot queries, or `SELECT *` defeating index-only scans on
  wide tables when only indexed columns are needed.

## Not a finding

- **Redundant prefix `Keep when` guards**: keep `(a)` beside `(a, b)` when
  (1) `(a)` enforces `UNIQUE` while `(a, b)` does not, (2) `(a, b)` is a
  partial/filtered index, (3) they use different index access methods, or
  (4) `(a)` is materially narrower for high-frequency index-only scans.
- **Uniform-direction reverse scans and skip scans**: B-trees scan backwards
  cleanly for single-column or uniformly reversed multi-column sorts (`a DESC,
  b DESC` on `(a, b)` with matching `NULLS` order), and modern dialects support
  B-tree skip scans on omitted low-cardinality leading columns (check dialect
  context). Without `EXPLAIN`, route uncertain cases to `needs confirmation`.
- **Unestablished scale or selectivity**: adding an index on a small or
  unmeasured table trades write overhead and storage for unconfirmed read gain
  (route to `needs confirmation` or `tradeoff`).
- **Reflexive foreign-key indexes**: demanding a child index on every foreign
  key when no parent `DELETE`/`UPDATE` of the referenced key or child join or
  lookup on that FK is traced (in MySQL/InnoDB, verify whether InnoDB already
  auto-creates a supporting child index).
- **Heap-only tuple (HOT) or planner speculation**: claiming HOT-update loss or
  index-versus-sequential choice without `EXPLAIN` is never a static finding.
