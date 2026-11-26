# SQLx mechanisms inside existing Rust questions

Use only for an implicated `sqlx` persistence boundary under
[Rust context](../languages/rust.md), verifying resolved `sqlx` version,
database driver (`postgres`, `sqlite`, `mysql`), and enabled features (`derive`
vs `macros`) without executing procedural macros or prescribing compile-time
query macros (`query!`/`query_as!`) where the crate does not already maintain a
database/offline `.sqlx` check.

## representation

- **Typed row decoding and domain boundary**: with `derive` or `macros`
  enabled, replace manual column indexing (`row.get(0)`) with `#[derive(FromRow)]`
  and `query_as`. Decode flat nullable storage rows once at the repository
  boundary into valid domain types or state enums instead of leaking nullable
  columns into business rules.
- **Keep when**: custom `FromRow` decodes joined/nested shapes or backend-specific
  conversions; or a direct `FromRow` struct serves a read-only projection or
  report DTO with no domain invariants (avoid 1:1 mapping ceremony).

## api-clarity

- **Pool, connection, and transaction boundaries**: accept
  `impl Executor<'_, Database = DB>` for a single-query helper called with both
  `&Pool` and `&mut *tx` (`Executor` consumes `self` on one query), or accept
  `&mut PgConnection` / `&mut SqliteConnection` for a multi-query helper shared
  between a connection and a caller's transaction (callers pass `&mut *tx` or
  `&mut **tx`, and the helper reborrows `&mut *conn` per query without `Acquire`
  HRTB lifetime friction). Reserve `Acquire` for helpers that must both acquire
  from `&Pool` and participate in an existing transaction.

## duplication with existing-helpers

- **Eliminate pool/transaction twins**: collapse duplicated `foo(&Pool, ...)`
  and `foo_tx(&mut Transaction, ...)` queries via `Executor` (single query) or
  `&mut Conn` (multi-query) when both execute the same SQL.
- **Standard constraint predicates**: replace repeated inline SQLSTATE string
  matching (`"23505"`, `"23503"`, `"23514"`) with `DatabaseError::kind()` or
  `is_unique_violation()` / `is_foreign_key_violation()` /
  `is_check_violation()` in one boundary mapper.
- **Keep when**: matching backend-specific codes that `sqlx::error::ErrorKind`
  leaves as `ErrorKind::Other` (such as serialization failure `40001`, deadlock
  `40P01`, or custom trigger codes), or when distinguishing specific constraints
  or primary-key vs unique codes (`constraint()` on Postgres, or distinct
  SQLite/MySQL error codes where `constraint()` is unpopulated).

## control-flow with error-expression

- **Persistence boundary translation**: map `sqlx::Error` (such as `RowNotFound`
  and constraint violations) to operation/domain errors at the repository
  boundary rather than exposing raw `sqlx::Error` to callers that branch on
  domain failure modes, preserving underlying causes where diagnostics require
  them.

Sources: [Executor](https://docs.rs/sqlx/latest/sqlx/trait.Executor.html),
[Acquire](https://docs.rs/sqlx/latest/sqlx/trait.Acquire.html),
[FromRow](https://docs.rs/sqlx/latest/sqlx/trait.FromRow.html),
and [DatabaseError](https://docs.rs/sqlx/latest/sqlx/error/trait.DatabaseError.html).
