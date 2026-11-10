# 2026-11-10: first run, tests of `infra-cache` in rust-service-template-rest

> This run used the 0.1.0 design, which applied each mutant in a disposable
> copy and ran the tests. The current design only reads: a mutant is never
> applied and a witness is not run. Paths under `skills/test-review` named
> below that concern execution no longer exist.

## Setup

- Target: `Dankosik/rust-service-template-rest`, local clone, commit
  `a9fc5e9f3434065ce8f2714f7c9523ae3eb2bca3` (main). Whole-source review of
  the tests of `crates/infra-cache`: `src/tests.rs` (49 unit tests, 2,190
  lines), one `no_run` doc test, and the integration target `tests/valkey.rs`
  with `tests/support/valkey_auth.rs`, read but not run.
- Instructions: `skills/test-review` 0.1.0 from the working tree, before the
  corrections listed under "What the run changed".
- Orchestration: the maintainer session followed the workflow by hand. The
  packaged `/super-review:tests` command and its roles were **not** run.
- Specialists: five general-purpose Claude Code subagents, one question each,
  model alias `opus`, effort not exposed by the host, each with the role text
  of `adapters/claude/test-specialist.md` and the workflow's packet. At most
  four ran at a time. Mutant limit: 10 runs (6 for team-rules); determinism
  had about 12 repeated-run batches.
- Execution: Rust 1.99.0, `cargo test -p infra-cache --no-fail-fast --locked
  --offline`, no services. Baseline: 49 unit tests and the doc test pass; 89 s
  cold, 31 s warm. The integration target needs the `integration` feature and
  a real Valkey and did not run. All work happened in copies under the
  session's temporary directory, each with its own build output.
- Cost: 160k to 202k subagent tokens and 8 to 21 minutes per question, about
  924k tokens in total, plus the orchestrator.

## Outcome

19 mutants tried, 1 killed, 18 survived. After merging duplicates: 11
distinct unpinned behaviors proven by a surviving mutant and a witness, 1
finding by quotation, 1 unproven candidate. The orchestrator reapplied 12
distinct mutants, each alone in a clean copy, twice: every witness passed on
the pinned source; with each mutant every existing test passed and only that
mutant's witness failed; the copy was restored after each.

| # | Promised behavior no test pins | Mutant | Found by |
| --- | --- | --- | --- |
| 1 | A 65-character namespace name panics | `rest <= 63` to `<= 64` | oracles, behavior, team-rules |
| 2 | An uppercase byte after the first is refused | `is_ascii_lowercase` to `is_ascii_alphabetic` | oracles |
| 3 | A hit is recorded as `outcome="hit"` | `Outcome::Hit` to `Outcome::Ok`; also the label string | oracles, behavior |
| 4 | Exactly one trailing line break is dropped from a password file | `if` to `while` | behavior, team-rules |
| 5 | A `HELLO` refused with `NOAUTH` is reported as `auth` | `"WRONGPASS" \| "NOAUTH"` to `"WRONGPASS"` | behavior (oracles left it unproven for want of the guide's sentence) |
| 6 | A password file unreadable when a connection opens is `auth` | `ErrorType::Auth` to `Io` | behavior, failure-paths |
| 7 | The client span is exported as `GET`/`SET`/`DEL` | `operation.command()` to `operation.label()` | behavior |
| 8 | A failed maintenance PING retires a silent connection with no traffic | `return;` removed after the failed PING | failure-paths |
| 9 | A context that stops after dispatch records `timeout` | `Timeout` to `Io` in the stop arm | failure-paths |
| 10 | An elapsed setup bound is reported as `timeout` | `Timeout` to `Io` on `Err(_elapsed)` | failure-paths |
| 11 | Each password-file outage logs its own warning | the flag reset removed | failure-paths |
| 12 | "join every spawned task" (`CONTRIBUTING.md`) against tests that spawn accept loops and never await or abort them | quoted | team-rules |

Unproven: removing the empty-username filter in `PasswordFile::admit`
survived one run, but no witness could be written; likely an equivalent
mutant.

Determinism: no candidate. 10 batches, 225 runs of the unit test binary
(whole target, single-threaded, four concurrent copies, six tests alone, all
under CPU load), 0 failures. The team's rule forbids "assuming a sleep
establishes order"; the tests' sleep-polling loops recheck an observable
state until a deadline, which the specialist and the orchestrator read as
compliant. They are listed as timing assumptions not shown to fail, with the
notification helper (`FakeServer::wait_for`) the code already offers. The
sleep-poll pattern another reviewer had reported is therefore not a finding
under the rule as written.

Mutants: `../reproductions/mutants/`. Witness tests:
`../reproductions/witnesses/`, one patch per question, each against the
pinned commit.

## What went wrong

- **Three questions spent runs on the same gap.** The namespace length bound
  was probed with the identical mutant by oracles, behavior and team-rules;
  the password line break by behavior and team-rules. The team-rules
  specialist took a rule about boundaries ("preserve contract distinctions
  such as a length exactly at a limit") as licence to run mutants.
- **Almost nothing was killed.** Specialists decide by reading where a
  behavior looks unpinned and spend runs only there, so 18 of 19 mutants
  survived. The killed count says nothing about how strong the suite is, and
  the report must not present it as a score.
- **Witnesses that wait in real time.** Two witnesses wait out real bounds
  (about 5 s and about 15 s), in the style of the crate's own tests, because
  the code has no controllable clock at those points. They are valid and
  slow.
- **One promise found by one task and missed by another.** Oracles judged the
  NOAUTH promise ambiguous from a code comment; behavior found the guide's
  explicit sentence. Reconciliation at the orchestrator resolved it.

## What the run changed

- Team-rules no longer takes rules about what a test must cover or catch
  when the mutant questions are selected.
- A witness that waits in real time states its duration and the bound.
- Determinism states that a bounded poll of observable state does not break
  a rule against assuming a sleep establishes order.

These corrections were made after the run and have not been rerun.

## Not exercised

The packaged Claude command and roles; Codex; a PR or local-change review;
read-only mode; a fork PR; the integration tests against a real server; a
repository with intermittent tests; any language other than Rust. Mutant
plausibility was judged by the orchestrator alone.
