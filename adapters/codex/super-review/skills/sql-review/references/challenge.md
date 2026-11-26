# The challenge

A reader who has found a SQL or schema failure believes in it. The challenger
does not: it tries, honestly and with the repository in hand, to show the claim
is wrong, invalid on the project's dialect baseline, unestablished without a
query plan, a tradeoff, or a deliberate documented choice. Nothing is executed
against a database, so this is what keeps false positives and folklore out of
the report.

The challenger receives each claim's location, dialect/version baseline,
mechanism trace or quotation, basis, impact, safer form, and the lens it came
from. It does not get the reader's reasoning or anyone's verdict, and it is not
told which outcome anyone hopes for. It reads the schema, migrations, queries,
configs, and driver source itself.

## Lines of attack

Take each claim through all four.

1. **The mechanism does not hold on this dialect and version.** Walk the
   cumulative schema (including renames and later migrations up to `HEAD`), SQL,
   callers, and locked driver source yourself. Confirm every quoted line and
   verify against the dialect context whether the pinned engine already avoids
   the issue (skip scans, semi-join/antijoin decorrelation, InnoDB auto-FK
   indexes, or pooler/driver behavior).
2. **The trigger or runtime condition is prevented or unestablished.** Check
   upstream guards, constraints, triggers, tx wrappers, pooler mode, and
   `SET`/`PRAGMA` hooks. Never dismiss statically provable correctness,
   concurrency, boundary, or `D -> H` bugs for lacking `EXPLAIN` or table size;
   only when a claim relies on unconfirmed version, runner tx mode, live
   traffic, scale, cardinality, or planner choice, return `falls` naming the missing runtime check.
3. **The safer form is invalid or changes semantics or tradeoffs.** Check the
   sketch against the dialect context, pinned version, migration runner tx mode
   (`CONCURRENTLY` inside a tx, `SET LOCAL` outside a tx, or `NOT VALID` +
   `VALIDATE` in one tx), and driver baseline. Walk `NULL`, empty, duplicate,
   collation, error, and `D -> H` cases. An invalid or behavior-breaking form
   makes the claim `falls`; a real cost the team must weigh makes it `tradeoff`.
4. **The behavior is a deliberate, reasoned choice or out of scope.** Check for
   a prior ADR, migration note, or schema comment whose stated reason holds on
   this codebase and dialect version and explicitly accepts the shown cost
   (`disputed`). A self-ratifying comment added in the same change does not
   settle the claim. Also check whether the lens's `Not a finding` guards or
   cosmetic-style exclusions cover it (`falls`).

## Verdicts

| Verdict | Means | Requires |
| --- | --- | --- |
| `stands` | Nothing on the four lines defeats the claim. | What you checked on each line, including your own walk of schema and SQL. |
| `falls` | The claim is wrong, invalid on the baseline, unestablished, or out of scope. | The counter-evidence, quoted with its location. |
| `tradeoff` | The failure is real and the safer form introduces a cost or behavior change the team must weigh. | What changes, quoted, and who would notice it. |
| `disputed` | The impact is real and a prior documented choice gives a valid reason accepting that cost. | The prior decision quoted with its reason and accepted cost, verified true. |

A prior documented choice whose stated reason is false on this codebase or
dialect version, or that never acknowledges the shown cost, does not make a
claim `disputed`: it `stands`.

Doubt is not a verdict. If you could not read a migration, schema file, config,
or driver source you needed, say which one and give no verdict for that claim.

Do not edit files, connect to a database, run database CLIs, propose another
form, or raise claims of your own.
