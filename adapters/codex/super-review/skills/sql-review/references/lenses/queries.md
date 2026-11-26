# Queries

**Do queries return right results across NULLs, joins, aggregation, and schema
evolution?**

## Expect

- Predicates, joins, and aggregates handle three-valued `NULL` logic and join
  multiplicity accurately.
- Pagination, sorting, and bounded mutations are deterministic across ties and
  concurrent writes.
- Destructive writes (`UPDATE`, `DELETE`) carry explicit, non-trivial target
  predicates.
- Production queries and views resist column-addition and column-reordering
  schema evolution.

## Look for

Inspect SQL queries, views, CTEs, subqueries, routines, triggers, and ORM query
builders against the cumulative schema.

- **Three-valued `NULL` logic bugs**: `NOT IN (subquery)` returning zero rows
  whenever the subquery can emit `NULL`; `<>` or `!=` silently dropping `NULL`
  rows where null-safe inequality is needed (verify dialect syntax); or
  `COUNT(col)` versus `COUNT(*)` and aggregate `NULL` propagation skewing
  totals.
- **Join multiplicity and filter placement**: filtering the nullable side of an
  `OUTER JOIN` in `WHERE`, turning it into an `INNER JOIN`; joining two
  one-to-many child tables before aggregating, inflating `SUM` and `COUNT`; or
  missing join conditions creating accidental cartesian products.
- **Non-deterministic ordering and pagination**: `LIMIT` or `OFFSET` without a
  total-order `ORDER BY` ending in a unique tie-breaker; `UPDATE`/`DELETE` with
  `LIMIT` lacking deterministic `ORDER BY`; `OFFSET` pagination skipping or
  duplicating rows under concurrent inserts when stable cursor pagination is
  needed; or non-aggregated `GROUP BY` columns lacking functional dependency.
- **Unbounded or silent-coercion writes**: `UPDATE` or `DELETE` missing a
  `WHERE` clause or guarded by a tautology; bulk mutations that silently
  truncate values, discard constraint errors, or fire unintended delete
  cascades.
- **Provable schema-evolution fragility** (reported compactly): `SELECT *` in
  production queries or views where positional mapping or new columns break
  callers, columnless `INSERT`, positional `ORDER BY 1` or `GROUP BY 1`,
  unqualified multi-table columns, or implicit comma joins.

## Not a finding

- Cosmetic SQL formatting, keyword casing, indentation, alias naming, or CTE
  versus subquery style without a semantic or fragility trace.
- Correlated `EXISTS`, `IN`, or `NOT EXISTS` subqueries claimed as `O(N*M)`
  without an `EXPLAIN` plan (optimizers decorrelate standard semi-joins and
  antijoins; flag only non-decorrelatable scalar subqueries, correlated
  aggregates, or inner `LIMIT`, or route to `needs confirmation`).
- `SELECT *` inside `EXISTS (...)` or inside an audited name-mapped dynamic
  passthrough helper whose contract intentionally forwards all columns.
- `UNION` versus `UNION ALL` unless duplicates are provably impossible or
  provably harmful.
