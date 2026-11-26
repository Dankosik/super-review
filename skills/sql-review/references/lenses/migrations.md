# Migrations

**Can every migration run safely against live data and rolling deploys without
outage or corruption?**

## Expect

- DDL on live tables avoids blocking concurrent reads and writes by using
  non-blocking build/validation options and explicit lock timeouts supported by
  the pinned dialect.
- Schema evolution preserves rolling-deploy (`D -> H`) compatibility so base
  and head application versions can coexist during deployment.
- Data backfills run in bounded, idempotent batches outside long-held DDL
  locks and leave existing rows consistent before tightening constraints.
- Migration history is append-only, atomic where the dialect supports it, and
  explicit about partial-failure recovery.

## Look for

Read ordered migration files together with the base and head application code
and migration runner configuration.

- **Blocking DDL without lock bounds or matching runner mode**: altering column
  types, setting `NOT NULL`, adding `FOREIGN KEY` or `CHECK` constraints, or
  creating indexes on live tables without lock timeouts or non-blocking dialect
  mechanisms (check both child and parent FK locks). Verify migration runner tx
  mode and opt-out syntax before proposing `CONCURRENTLY` (use `SET`/`RESET
  lock_timeout` outside tx, not `SET LOCAL`) or separate-tx `NOT VALID`/`VALIDATE`.
- **Rolling-deploy (`D -> H`) contract breaks**: dropping or renaming columns,
  tables, or enum values still read or written by the base commit's code;
  adding a `NOT NULL` column with no safe default while old writers remain
  active; or tightening a constraint before old writers stop producing old
  values.
- **Unbounded data backfills inside migrations**: single-statement full-table
  `UPDATE` or `DELETE` backfills inside a migration transaction that lock live
  rows, cause replication lag, or corrupt state if retried mid-way.
- **Constraint failures on live data and partial commits**: adding `NOT NULL`,
  `UNIQUE`, or `CHECK` without cleaning or backfilling existing rows; implicit
  DDL commits leaving half-applied migrations on error; failed concurrent index
  builds leaving invalid indexes behind; or editing already-applied migrations.

## Not a finding

- Blocking DDL on a brand-new empty table created in the same migration or an
  explicitly greenfield/offline database (route to `needs confirmation` when
  live-traffic status, maintenance window, or runner tx mode is unstated and
  decides the claim).
- Missing down-migrations when the project documents forward-only migrations.
- Multi-step expand-and-contract migrations proposed against a team's
  documented maintenance window (classify as `tradeoff` or `disputed`).
