# Workflow

For the orchestrator. Readers and challengers work from
[the contract](contract.md).

## Source

Read the source where it is. For local scope, read the working tree and note
HEAD. Local changes are what the user names: uncommitted work against HEAD,
or a branch against its merge-base with the main branch. When the request
does not say, take the branch together with its uncommitted work.

For a PR, read files at the head commit and take the change from the
merge-base, from the local object database, without checking anything out.
When the PR's commits are not there, fetch them: that adds objects and moves
no branch or working file. If you cannot, read through GitHub and say in the
report that code outside the changed files could not be searched.

Locate the documents and team rule sources for the reviewed area once. Every
reader gets the same list. It says where statements about the code live; it
is not a list of suspected bugs.

## Lenses

| Lens | Asks | Selected when the area has |
| --- | --- | --- |
| [results](lenses/results.md) | Does each operation return and do what it stands for, at the edges too? | Any operation with callers. |
| [boundaries](lenses/boundaries.md) | Does data crossing a boundary keep its shape, limits and defaults? | Configuration, parsing, serialization, wire or storage formats, validation. |
| [errors](lenses/errors.md) | Is each failure reported as what it is? | Fallible operations, error types, status mapping, failure metrics or logs. |
| [time](lenses/time.md) | Does every wait end when it should, and for the reported reason? | Timeouts, deadlines, retries, intervals, cancellation. |
| [lifecycle](lenses/lifecycle.md) | Is everything that is started also observed and ended? | Spawned tasks, background loops, connections, startup or shutdown paths, guards. |
| [shared-state](lenses/shared-state.md) | Does one caller's failure or timing stay its own? | State or resources shared across callers or tasks. |
| [stated-facts](lenses/stated-facts.md) | Do the written numbers, names and descriptions match the code? | Documents, decision records, described metrics, configuration references. |
| [team-rules](lenses/team-rules.md) | Does the code follow the checkable rules the team wrote for it? | Located team rules that apply to the area. |

Select every lens whose signal is present, and say which were left out and
why. A small change is not a reason to drop one.

One lens per reader. For a small change, about three hundred changed lines
or fewer in one package, give one reader a related pair instead: results
with boundaries, errors with time, lifecycle with shared-state, stated-facts
with team-rules. Split a large scope by package. Readers overlap on purpose,
and merging is yours.

## Readers

Start each reader in a fresh context with nothing from this conversation or
from other readers. Give it the target and revision, its lens or pair, the
exact files, for a change review the change itself with its removed lines,
the located documents, and the paths of the contract, its lens, the
[language context](languages/rust.md) and the
[result format](../assets/finding-template.md). Never give it an expected
bug, a suspected line or another reader's result.

Run up to eight agents at once unless the user sets another limit.

## Challenge

Every candidate with a trace goes to a fresh challenger, one per reader
task. Give it the same materials, lens included, plus
[the challenge](challenge.md), and for
each candidate only the expectation and basis, location, trigger, harm and
proof. Strip the reader's reasoning, its notes on intent and its confidence.
Candidates proven only by quotation need no challenger; check them yourself.

## Decide

You own the decision on every candidate. A reader's confidence, a
challenger's tone or agreement between agents is not evidence.

- **Walk each trace yourself.** Every quoted line is there, each step
  follows, nothing rests on unread code, and it ends at something the
  affected party observes. Read missing code yourself when it is at hand;
  do not rewrite the trace into a different claim.
- **Check the basis.** A `written` basis is verbatim and read plainly. A
  `declared` basis says no more than the declaration. A `principle` names
  someone at this place who relies on it. Taste is rejected.
- **Weigh the challenge as an argument, not a ruling.** A `falls` needs
  specific quoted counter-evidence; check it. "This seems intended" defeats
  nothing. A `stands` with no account of what was tried is no challenge. A
  `disputed` needs the decision quoted with a reason that is true and a cost
  that was accepted.
- **Settle disagreements.** On a fact, from the source. On whether the
  behavior is acceptable when both have the facts right, the candidate is
  disputed.
- **Merge** candidates with the same cause at the same place.

| Outcome | When |
| --- | --- |
| bug | Trace confirmed, basis holds, challenge stood or its `falls` was refuted. |
| disputed | Trace confirmed; a deliberate choice with a true reason and an accepted cost. |
| drift | A document and the code disagree, by quotation. |
| rule violation | The code breaks a checkable team rule, by quotation. A rule about behavior needs a trace and is a bug. |
| unproven | A step is missing, or no challenge was carried out. |
| rejected | A step does not follow, the trigger cannot occur, the expectation is wrong, nobody is affected, or out of scope. |

## Report

Use [the report template](../assets/report-template.md). Report every bug
that stood; do not cut the list to fit a length. A reader that returned
nothing is unread coverage, not a clean result. No findings is a valid
outcome; say what was read, and do not claim the code is correct.
