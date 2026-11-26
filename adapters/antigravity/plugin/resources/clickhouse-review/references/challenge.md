# The challenge

A reader who has found a ClickHouse failure believes in it. The challenger does
not: it tries, honestly and with the repository in hand, to show the claim is
wrong, invalid on the project's ClickHouse version or deployment baseline,
unestablished without runtime evidence, a tradeoff, or a deliberate documented
choice. Nothing is executed against a ClickHouse cluster, so this is what keeps
false positives and folklore out of the report.

The challenger receives each claim's location, ClickHouse version and
deployment baseline, mechanism trace or quotation, basis, impact, safer form,
and the lens it came from. It does not get the reader's reasoning or anyone's
verdict, and it is not told which outcome anyone hopes for. It reads the
cumulative schema, migrations, configs, queries, and client code itself.

## Lines of attack

Take each claim through all four.

1. **The mechanism does not hold on this ClickHouse version and deployment.**
   Walk the cumulative schema, migrations, cluster configs, SQL, client code,
   and locked driver source yourself. Confirm every quoted line, check later
   `ALTER`s, and verify version-specific behavior (join auto-swap, monotonic
   primary-key pruning, parallel `FINAL`, filtered projections, lightweight
   update patch parts, or `SharedMergeTree` conversion).
2. **The trigger or data-dependent condition is prevented or unestablished.**
   Check upstream batching, `users.xml`/`config.xml`, `async_insert`, settings,
   and allowlists. Never dismiss statically provable correctness, replication,
   boundary, or `D -> H` bugs for lacking `EXPLAIN` or `system.parts`; only
   when volume, cardinality, QPS, or pruning decides it, return `falls` naming
   the missing check.
3. **The safer form is invalid or changes semantics or tradeoffs.** Check the
   sketch against the deployment, pinned version, migration runner, and client
   (`ON CLUSTER` invalid in `DatabaseReplicated`/Cloud, `SharedMergeTree`
   invalid on OSS, immutable `ORDER BY`/`PARTITION BY`). Walk `NULL`/defaults,
   retries, re-inserted tombstones, and `D -> H` cases. Invalid or
   behavior-breaking forms return `falls`; operational costs return `tradeoff`.
4. **The behavior is a deliberate, reasoned choice or out of scope.** Check for
   a prior ADR, runbook, or schema comment that gives a true reason on this
   codebase and explicitly accepts the shown cost (`disputed`). A
   self-ratifying comment added in the same change does not settle the claim.
   Also check whether the lens's `Not a finding` guards or cosmetic-style
   exclusions cover it (`falls`).

## Verdicts

| Verdict | Means | Requires |
| --- | --- | --- |
| `stands` | Nothing on the four lines defeats the claim. | What you checked on each line, including your own walk of schema, config, and SQL. |
| `falls` | The claim is wrong, invalid on the baseline, unestablished, or out of scope. | The counter-evidence, quoted with its location. |
| `tradeoff` | The failure is real and the safer form introduces a cost or behavior change the team must weigh. | What changes, quoted, and who would notice it. |
| `disputed` | The impact is real and a prior documented choice gives a valid reason accepting that cost. | The prior decision quoted with its reason and accepted cost, verified true. |

Doubt is not a verdict. If you could not read a migration, schema file, cluster
config, or client library source you needed, say which one and give no verdict
for that claim.

Do not edit files, connect to ClickHouse, run ClickHouse CLIs, propose another
form, or raise claims of your own.
