# Workflow

For the orchestrator. Specialists work from [the contract](contract.md).

## Source

Read the source where it is. For local scope, read the working tree and note
HEAD. Local changes are what the user names: uncommitted work against HEAD,
or a branch against its merge-base with the main branch. When the request
does not say, take the branch together with its uncommitted work.

For a PR, read files at the head commit and take the change from the
merge-base, from the local object database, without checking anything out.
When the PR's commits are not there, fetch them: that adds objects and moves
no branch or working file. If you cannot, read through GitHub and say in the
report that tests outside the changed files could not be searched.

List the target packages, their tests (unit test modules, integration
targets, doc tests, helpers) and the production code those tests protect.
Note which tests the project's own test command does not run. Locate the
documents that describe the behavior and the team's rule documents for
tests. Every specialist gets the same list.

## Questions

| Question | Asks | Selected when the area has |
| --- | --- | --- |
| [behavior](questions/behavior.md) | Does a test fail when a promised result, boundary or effect breaks? | Documented operations with tests. |
| [failure-paths](questions/failure-paths.md) | Does a test fail when an error, timeout, cancellation or cleanup path goes wrong? | Fallible operations, time limits, shutdown, guards, retries. |
| [oracles](questions/oracles.md) | Does each test fail when the behavior it names breaks? | Any tests. |
| [determinism](questions/determinism.md) | Does each test's result depend only on the code? | Tests that wait, use time, share state, bind ports or depend on ordering. |
| [team-rules](questions/team-rules.md) | Do the tests follow the checkable rules the team wrote for them? | Located rules for test code. |

Select every question whose signal is present, and say which were left out
and why. One question per specialist; split a large scope by package. A
package with no tests at all is reported as such and needs no mutants.

## Specialists

Start each specialist in a fresh context with nothing from this conversation
or from other specialists. Give it the target and revision, one question,
the exact packages and files, the located sources, and the paths of the
contract, its question, the [language context](languages/rust.md) and the
[result format](../assets/finding-template.md). Never give it an expected
gap or a suggested mutant.

Run up to eight agents at once unless the user sets another limit.

## Decide

You own the decision on every candidate.

- **The promise** is verbatim, is a promise under the contract, and is read
  plainly.
- **The mutant** is one decision, a mistake an author could make there, and
  nothing the project enforces would reject it.
- **The tests that reach it.** Search for tests of the changed code
  yourself and look for one the specialist missed. A test that would fail
  rejects the candidate.
- **The witness** holds for the original code and fails for the mutant when
  you follow its input through both.
- **A quoted rule** applies to this kind of test, and no exception covers
  the quoted code.
- **An unstable test**: both orders can happen under the runtime the test
  uses.

Merge candidates whose mutants break the same promise at the same place and
keep the smaller mutant. Each candidate ends as proven, unproven with the
missing piece, or rejected with the counter-evidence.

## Report

Use [the report template](../assets/report-template.md). Report every proven
finding; do not cut the list to fit a length. A specialist that returned
nothing is unread coverage, not a clean result. No findings is a valid
outcome; say what was not probed, and do not call the tests sufficient.
