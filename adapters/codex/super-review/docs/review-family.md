# The review family

This repository holds three reviews. Each asks one question, and each is a
skill, not a runtime. All three read the code and run nothing.

| Review | Question | Object |
| --- | --- | --- |
| Super Review | Is the code easy to read and change? | How the code is expressed |
| Defect Review | Where does the code do the wrong thing? | Bugs in production code |
| Test Review | Would the tests notice a plausible mistake? | Promised behavior no test pins |

## Why three and not one

Each question needs a different kind of judgment, and mixing them in one
reader degrades all of them. That was observed before this family existed:
when bug reports entered Super Review's results, its readability advice got
worse. The separation that matters is at the level of one reader's task. One
reader gets one question.

The standard of evidence differs too. A readability recommendation is
accepted on net benefit. A bug or a test gap is accepted on a proof that
someone else can check line by line.

## How the two newer reviews work

```
identify source -> independent readers -> proof by trace
                -> independent challenge -> orchestrator checks -> report
```

- **Identify the source.** The review reads the working tree, or the commits
  of a PR through Git and GitHub. It does not clone, copy or check out
  anything.
- **Independent readers.** Each reader gets one lens and reads the code
  itself. Readers overlap on purpose. An earlier design considered building
  one shared ledger of promises and checking each entry; it was rejected
  because whatever the ledger's author missed would be invisible to every
  check. Bugs live disproportionately in what nobody wrote down. Duplicates
  are merged at collection; that cost is accepted.
- **Proof by trace.** A claim is a path through the source that anyone can
  follow: for a bug, the trigger, each step as a quoted line, and what the
  affected party observes. For a test gap, a described mistake (a mutant,
  never applied), why each test that reaches that code still passes, and the
  check that would tell the mistake from the original.
- **Independent challenge.** In Defect Review a second agent, which has not
  seen the reader's reasoning, follows the trigger through the source itself
  and tries to show the claim is wrong. Defect Review requires no written
  promise and runs nothing, so this is what holds false positives down.
- **The orchestrator checks.** It opens every quoted line, walks each trace,
  and treats the challenger's verdict as an argument to verify.

## Why nothing is run

Earlier versions of both reviews built the project in a disposable copy and
proved each finding by a failing test or a surviving mutant. That was dropped.
The machinery was most of the instructions and most of the cost: pinning and
copying source, a baseline run, a private build directory per agent, a rerun
protocol, write permissions for every role, rules about forks and
credentials. The first run spent about 2.5 million subagent tokens and hit a
shared build directory that made one agent run another's tests. Meanwhile the
defects that motivated these reviews had been found by reading.

What this gives up: a trace can be wrong in a way only a run would expose,
most often a misread dependency or runtime behavior. Each contract answers
that by requiring every step to quote code that was read, including the
dependency at its locked version, and by making an unread step an unproven
candidate. A finding's reader can confirm it by opening the lines.

## What is shared and what is not

No skill depends on another at run time. A user can install one alone.
Everything that carries a review's judgment stays in that review: its
contract, lenses or questions, challenge, templates and roles.
The three share only the plugin they ship in.

## Decisions

| Decision | Chosen | Instead of | Reason |
| --- | --- | --- | --- |
| How a finding is proven | A trace through quoted lines, by reading | Building the project and running a test or a mutant | The run machinery cost more than it found; reading found the defects that started this work |
| Unit of work for readers | One lens over the whole scope, independent readers | A ledger of promises checked entry by entry | Recall on what nobody wrote down matters more than exact coverage counts |
| Small changes in Defect Review | Related lenses paired, four readers | Eight readers and up to eight challengers for fifty changed lines | Cost should follow the size of the change; whether pairing costs attention is unverified |
| Waiting in real time in tests | A finding when a rule forbids it, when the bound is as tight as the work, or when the test can pass with nothing done | Reporting every sleep or timed poll; or none without a team rule | A generous bound around observable state fails no one; a tight one, or a sleep that proves nothing, does |
| What makes a bug | A traced effect, a stated expectation with its basis, and survival of a challenge | A quoted written promise as a precondition | A documented bug is still a bug; requiring a quotation turned real defects into "documented behavior" |
| Holding false positives down | Checkable traces plus an independent challenger | The written-promise gate; or "obvious failures only" | The gate hides bugs; obvious-only misses wrong classification and failure isolation |
| Documented behavior that harms | Reported as `disputed` with both sides when the document gives a reason that holds | Dropped as intended; or reported as a plain bug | The team made a tradeoff and should see its cost, not be told it is a defect |
| Test Review's mutants | Must break a written promise | Any change a bug hunter would call a bug | The check that would catch the mistake needs an oracle nobody disputes; unwritten bugs are Defect Review's subject |
| Challenger in Test Review | None; the orchestrator searches for a test the specialist missed | A second agent per question | The one way a test-gap claim fails is an overlooked test, and that is a search, not a debate |
| Size of the instructions | One contract per review, a workflow for the orchestrator, lenses or questions | Separate files for proof, verification, expectations and coverage bookkeeping | A capable reader needs the bar and where bugs live, not a procedure for recording its own work |

## What a model run is for

Fixture tests in this repository check packaging and instruction integrity.
They cannot show that a review finds bugs. A review of a real repository can.
It is a check the maintainer chooses to spend on after a design change, not a
step in writing instructions.
