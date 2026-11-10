# 2026-11-10: first run, `infra-cache` in rust-service-template-rest

> This run used the 0.1.0 design, in which a finding required a quoted written
> promise, documented behavior was not a defect, and each finding was proven
> by a test run in a disposable copy. The current design hunts bugs with a
> stated basis and an independent challenge, and only reads. It has not been
> used on a real repository. Paths under `skills/defect-review` named below
> (`questions/`, `promises.md`, `workspace.md`, the decisions question) no
> longer exist.

## Setup

- Target: `Dankosik/rust-service-template-rest`, local clone, commit
  `a9fc5e9f3434065ce8f2714f7c9523ae3eb2bca3` (main). Whole-source review of
  the production source of `crates/infra-cache` (`lib.rs`, `connection.rs`,
  `credentials.rs`, `observe.rs`, about 1,740 lines).
- Instructions: `skills/defect-review` 0.1.0 from the working tree, before the
  corrections listed under "What the run changed".
- Orchestration: the maintainer session followed the workflow by hand. The
  packaged `/super-review:defects` command and its roles were **not** run.
- Specialists: eight general-purpose Claude Code subagents, one question each,
  model alias `opus`, effort not exposed by the host. Each received the role
  text of `adapters/claude/defect-specialist.md` and the workflow's packet.
  At most four ran at a time.
- Execution: Rust 1.99.0, `--locked --offline`, no services. Baseline:
  `cargo test -p infra-cache --lib` built in 21 s with warm dependencies and
  passed 49 tests in 28 s. All work happened in copies under the session's
  temporary directory; the user's checkout was not built or written.
- Cost: 149k to 197k subagent tokens and 2 to 6 minutes per question, about
  1.37M tokens in total, plus the orchestrator.

Not held out: the instructions were written after reading a list of seven
defects another reviewer had reported in this crate, and some question files
name those patterns.

## Outcome

| Candidate | Proof | Orchestrator's rerun | Disposition |
| --- | --- | --- | --- |
| errors-1: a root CA file whose PEM block is not a certificate returns `CacheError::Client`, not `InvalidCa` | reproduced | failed 2 of 2 in a clean copy | proven |
| errors-2: a corrupt client certificate with a valid key returns `InvalidClientKey`, not `InvalidClientCertificate` | reproduced | failed 2 of 2 | proven |
| team-rules-1: `Shared::state` recovers a poisoned mutex with `PoisonError::into_inner` against the skills' "adopted no-recovery policy" | quoted | both quotations read at the pinned commit | proven; the same construct is in eight other crates, with no written permission |
| stated-facts-1: guide and decision record name redis-rs 1.7.1 as pinned; `Cargo.lock` resolves 1.8.1 | quoted | read | proven |
| stated-facts-2: documents name Valkey 9.1.2 as the tested image; the compose service they cite as the proof runs 9.1.3 | quoted | read | proven |
| shared-state-1: with `command_timeout` above 5 s, the 5 s maintenance PING ceiling retires the connection and fails a reply that would have arrived inside the caller's budget | reproduced, with a passing control | failed 2 of 2, control passed 2 of 2 | conflict between promises: the guide states both "a slow reply is waited for" up to 10 s and the PING budget `min(command_timeout, 5 s)` |
| errors-3: `WRONGTYPE` and `OOM` replies are labelled `error_type="other"` | none | not applicable | unproven: no document says which replies are `response` |

Lifecycle, time, results and boundaries completed with no candidates.

Reproduction tests: `../reproductions/errors.patch` and
`../reproductions/shared-state.patch`, each against the pinned commit, test
code only.

## Against the seven previously reported defects

| Reported | What this run did with it |
| --- | --- |
| Any server error reply tears down the shared connection | Not a finding. The guide states it: command errors "retire their connection generation immediately" and "Peers on that generation can fail as `Unavailable`". |
| Caller cancellation is recorded as a timeout | Not a finding. `ErrorType::Timeout` is documented as covering "caller cancellation". |
| A password file read failure is reported as an authentication error | Not a finding. The guide states that "a password file that cannot be read when a connection opens" surfaces as `auth`. |
| The probe gets a fresh time budget, not the remaining one | Not found. The time specialist traced the probe and recorded its unbounded acquisition and 5 s ceiling as documented. |
| Nobody observes the supervisor's result | Not a finding. `SupervisorExit::drop` closes the link on any exit, and the decision record says the final owner aborts the supervisor. |
| Documentation says 1 s, code says 5 s | Not present at this commit: the documents say 5 s throughout. |
| Tests wait with sleep-poll | Outside scope: test code is not a target. |

In the first pass none of the seven became a finding. Three are behavior the project's own
documents state on purpose, so a review that checks code against written
promises cannot call them defects. In this repository the documents are
detailed and were written beside the code, which narrows what such a review
can find to places where the two drifted apart. Whether a documented decision
still holds is a different question; the second pass below adds it.

## What went wrong

- **Shared build output corrupted runs.** The first instructions told working
  copies to share one `CARGO_TARGET_DIR`. Cargo reported `infra-cache` as
  `Fresh` in one copy and ran a test binary built from another specialist's
  copy: zero of the specialist's own tests, one of someone else's. The errors
  specialist noticed through `-- --list` and switched to a private directory.
  Results produced before that were rerun by the orchestrator in a clean copy
  with its own build output.
- **Wrong dependency version read.** The lifecycle specialist read redis
  1.7.1 from the local registry because the documents name it; the lockfile
  resolves 1.8.1. Its conclusion holds in 1.8.1 (checked by the orchestrator),
  but the evidence it cited was for the wrong version.
- **Documented behavior reported unevenly.** One specialist listed a
  documented behavior as an unproven candidate, two mentioned such behavior
  only in coverage notes.
- **Aborted first batch.** Four specialists on the session's default model
  were stopped twice (a usage limit, then the maintainer's choice of model)
  and relaunched; their partial work was discarded.

## What the run changed

- Each working copy gets its own build output directory, seeded from the
  baseline's; a run counts only when the binary lists the reproduction.
- The dependency version comes from `Cargo.lock`, not from a document.
- A set of cause-naming variants promises the partition: a cause with its own
  variant is reported through it. This is the reading errors-1 and errors-2
  rest on.
- Specialists report behavior that is documented on purpose in one header
  field, and the report lists it in its own section without advice.
- Specialists report signals for other questions; the orchestrator resolves
  them against existing coverage.

These corrections were made after the run and have not been rerun.

## Second pass: the decisions question

Added after the first pass, because none of the seven reported defects had
become a finding and three were documented behavior. One more specialist
(`opus`, 217k tokens, about 6 minutes, plus one focused continuation) took
the decisions question over the same crate and commit, with the corrected
build-output rule. It listed 15 decisions and checked each for a false
premise, a higher rule, an unaccepted consequence and a met reopen condition.

| Candidate | Ground | Orchestrator's check | Disposition |
| --- | --- | --- | --- |
| decisions-1: the `timeout` outcome also records a caller's own cancellation, while the guide says "Alert on the `error` and `timeout` outcomes" as the sign of an outage | unstated consequence, reproduced | failed 2 of 2 in a clean copy: a cancelled `get_with_context` on a healthy cache recorded `outcome="timeout"` | revisit. The mapping is deliberate in the `ErrorType::Timeout` doc comment; the guide that recommends the alert does not state it |
| decisions-2: "`socket2` 0.6.5 remains a direct edge because redis does not re-export `TcpKeepalive`" | false premise, quoted | read: redis 1.8.1 `src/io/tcp.rs` has `pub use socket2;` and enables the `all` feature; a confirming test that builds the keepalive through the re-export compiled and passed 2 of 2 | revisit |
| decisions-3: the record calls redis 1.7.1 "Pinned"; the lock resolves 1.8.1 | false premise, quoted | same quotations as stated-facts-1 | merged into stated-facts-1 |

The specialist examined "a server error reply retires the shared connection"
and left it as documented: the guide accepts the cost in so many words. The
orchestrator sent two documented behaviors the first result had not listed
(an unreadable password file reported as `auth`; the probe's time budget) as
a focused continuation; both came back with no candidate. The continuation
raised one signal outside the assigned scope, not pursued: the startup check
in `crates/service` may leave no time for the PING when the first setup uses
most of its 5 s.

So one of the seven reported defects (caller cancellation recorded as a
timeout) is now reported with a proof, as a decision to revisit.
Reproduction: `../reproductions/decisions.patch`.

After this pass the `unstated consequence` rule was narrowed: the effect must
be unstated for the reader who is told to rely on the undermined use, and a
code comment that states the behavior is reported as intent. Not rerun.

## Not exercised

The packaged Claude command and roles; Codex; a PR or local-change review;
read-only mode; a fork PR; a repository whose build fails; any language other
than Rust.
