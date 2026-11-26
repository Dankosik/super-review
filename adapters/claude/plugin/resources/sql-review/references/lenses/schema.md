# Schema

**Does the schema enforce data integrity, sound types, and clean relational
boundaries?**

## Expect

- Domain invariants live in database constraints (`PRIMARY KEY`, `NOT NULL`,
  `UNIQUE`, `FOREIGN KEY`, `CHECK`), not only in application validation.
- Column types match domain precision, timezone semantics, and character range
  without silent truncation or rounding.
- Referential actions (`CASCADE`, `RESTRICT`, `SET NULL`) match entity
  ownership and audit retention rules.
- Declared multi-tenant or row-level security policies and privileged routines
  enforce isolation on both reads and writes.

## Look for

Inspect cumulative table, view, routine, trigger, and ORM/declarative schema
definitions at the pinned revision.

- **Missing or weak integrity constraints**: tables without a `PRIMARY KEY`,
  nullable columns that callers or docs assume non-null, missing `UNIQUE` on
  traced natural or idempotency keys, missing `CHECK` on documented bounded
  ranges or states, or soft-delete uniqueness that either blocks re-creation or
  allows duplicate active rows.
- **Inexact or lossy column types**: binary floating-point types storing exact
  monetary or decimal quantities, timezone-ambiguous timestamps for instants,
  narrow integer keys risking overflow on high-churn tables, or string-encoded
  dates, booleans, and identifiers that defeat typed comparison.
- **Referential and cascade hazards**: polymorphic references lacking foreign
  key enforcement, accidental `ON DELETE CASCADE` wiping financial or audit
  records, missing referential actions leaving orphan rows, or entity-attribute
  value tables bypassing column types and constraints.
- **Broken declared isolation boundaries**: row-level security policies missing
  write checks or omitting tenant predicates on joined views/tables, or
  definer-privileged routines missing a pinned search path.
- **Schema-to-model drift**: ORM or declarative model nullability, types, or
  defaults contradicting the cumulative SQL schema.

## Not a finding

- Intentional denormalization, read-model projections, or JSON document columns
  for genuinely variable attributes when core invariants remain enforced.
- Surrogate versus natural key preferences or table/column naming taste with no
  integrity or correctness consequence.
- Omitted foreign keys across separate databases, services, or sharded
  partitions where cross-node referential enforcement is impossible.
- Inventing `NOT NULL`, `UNIQUE`, or `CHECK` constraints solely from a column
  name when neither callers, docs, nor domain rules establish that invariant.
- Academic normal-form refactoring when no update anomaly, duplication hazard,
  or invariant violation is traced.
