# The review family

This repository holds four reviews. Each asks one question, and each is a
skill, not a runtime. All four read the code and run nothing.

| Review | Question | Object |
| --- | --- | --- |
| Super Review | Is the code easy to read and change? | How the code is expressed |
| Defect Review | Where does the code do the wrong thing? | Bugs in production code |
| Test Review | Would the tests notice a plausible mistake? | Promised behavior no test pins |
| Performance Review | Where does the code do work it does not need, on a path that runs often? | Unneeded work on hot paths |

## Why separate reviews

Each question needs a different kind of judgment, and mixing them in one
reader degrades all of them. That was observed before this family existed:
when bug reports entered Super Review's results, its readability advice got
worse. The separation that matters is at the level of one reader's task. One
reader gets one question.

Speed is its own question for the same reason. Slow code is not a bug, and
fast code that reads badly is not a performance finding. A reader hunting
bugs who also weighs cost starts calling slow code wrong; a reader tuning a
loop starts trading clarity for work that never mattered.

The standard of evidence differs too. A readability recommendation is
accepted on net benefit. A bug, a test gap or a performance finding is
accepted on a proof that someone else can check line by line.

## How the newer reviews work

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
  check that would tell the mistake from the original. For a performance
  finding, why the path runs often, the work it does per unit as quoted
  lines with what multiplies it, and a cheaper form that keeps behavior.
- **Independent challenge.** In Defect Review and Performance Review a
  second agent, which has not seen the reader's reasoning, follows the claim
  through the source itself and tries to show it is wrong. Neither review
  runs anything, so this is what holds false positives down: bugs that are
  not bugs, and savings on cold code or on work a library already avoids.
- **The orchestrator checks.** It opens every quoted line, walks each trace,
  and treats the challenger's verdict as an argument to verify.

## How Performance Review shows a cost

A performance finding has four parts. The **hot path**: where the code is
reached from and why it runs often, measured against the program's unit of
work (a request, a message, one run of a command-line tool), on the evidence
of the source, a document or benchmark in the repository, a profile or the
user's words. The **cost trace**: the work done
for one unit as quoted lines, into callees and dependencies at their locked
versions, and what multiplies it, written as a count ("one `String`
allocation per row × rows in the request"), never as invented milliseconds.
The **cheaper form**: a sketch and what it keeps, results, order, errors,
drop timing, `Send` and `Sync`, the public API, and that it builds for the
project's Rust version, features and targets. The **resource**: what is
saved, set beside the path's dominant cost for that resource.

Lenses divide unneeded work by where it lives: complexity, allocation,
async, I/O, contention and repeated work. A cheaper form that changes
something the team must weigh is a tradeoff, shown with both sides,
including a batch or overlap that buys throughput with latency or changes
what has happened when something fails. For a whole project the review
starts from where work enters the program and reports the entries it used.
A candidate that waits only on whether its path is hot becomes a question to
the user. Because reading shows work removed, not time saved, the report
ends with what to do before applying anything: measure before and after in
the way the saved resource demands, and keep a change only if the gain
shows.

## Why nothing is run

Earlier versions of Defect Review and Test Review built the project in a
disposable copy and proved each finding by a failing test or a surviving
mutant. That was dropped. The machinery was most of the instructions and
most of the cost: pinning and copying source, a baseline run, a private
build directory per agent, a rerun protocol, write permissions for every
role, rules about forks and credentials. The first run spent about 2.5
million subagent tokens and hit a shared build directory that made one agent
run another's tests. Meanwhile the defects that motivated these reviews had
been found by reading.

What this gives up: a trace can be wrong in a way only a run would expose,
most often a misread dependency or runtime behavior. Each contract answers
that by requiring every step to quote code that was read, including the
dependency at its locked version, and by making an unread step an unproven
candidate. A finding's reader can confirm it by opening the lines.

Performance Review gives up the most, since a benchmark is the usual proof
of speed. It counts the work the code's semantics require instead, and it
does not argue about what the optimizer does: such a claim, from either
side, needs a profile, a benchmark or a documented guarantee. A profile or
benchmark output the user supplies is evidence, because using it runs
nothing. The one measurement the finding needs is left to whoever applies
it.

## What is shared and what is not

No skill depends on another at run time. A user can install one alone.
Everything that carries a review's judgment stays in that review: its
contract, lenses or questions, challenge, templates and roles.
The four share only the plugin they ship in.

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
| What makes a performance finding | A hot path with its basis, a cost trace, a cheaper form with the same behavior, the resource saved | Patterns known to be slow, reported wherever they appear | A clone that runs once costs nothing; advice without a hot path is churn |
| What makes a path hot | Running per unit of the program's work: a request, a message, one run of a command-line tool with its startup; an error path when real input takes it routinely | A fixed list of cold places: startup, connections, error paths | A tool that scripts call thousands of times spends its life starting up; a parse that fails on half the tokens is the main path |
| Whole-project scope in Performance Review | Start from where work enters the program and review what the entries reach; report the entries and what was not reached | Every reader reading every file and finding entries again | Hotness starts at an entry; the list in the report shows a missed entry, unlike a ledger nobody sees |
| A hot path nobody has established | A question to the user, in its own report section | Buried among unproven candidates | One sentence or a profile from the user settles it |
| How a cost is shown | Work per unit times its multiplier, read from the source and from dependencies at their locked versions | Running benchmarks or profilers; estimated milliseconds | A count can be checked by opening the lines; an invented timing cannot be checked at all |
| Profiles and benchmark output | Evidence when the user supplies them or the repository commits them | Ignored because the review runs nothing | They are the best evidence that a path is hot, and using them runs nothing |
| Claims about code generation | Count work the semantics require; an optimizer claim either way needs a profile, a benchmark or a documented guarantee | Readers and challengers arguing about what the compiler does | Neither side reads the compiler's output, so such a claim decides nothing alone |
| A cheaper form that changes something | A `tradeoff` with both sides: public API, `unsafe`, a new dependency, staleness, notably harder reading | Dropped; or recommended as a plain speedup | The saving is real and its cost is the team's to weigh, as with disputed bugs |
| Throughput against latency | A batch, buffer, overlap or parallel split that buys one with the other, or starts work an earlier failure would have stopped, is a tradeoff | Batching, concurrency and parallelism as plain gains | They change what a caller waits for and what has happened when something fails |
| Where a cheaper form must build | Within the project's `rust-version`, edition, enabled features and targets | Any current Rust | Advice that does not build for the project saves nothing |
| Neighboring costs | Memory footprint, build profiles, the global allocator and compile time are out of scope; a database's plan and cache behavior need a plan or a profile | Left to each reader | Each run would otherwise draw the line differently |
| Constant work per request | Reported compactly, one row each with its quoted line | A full section per finding | They are the most numerous and each saves the least; the reader should reach the larger findings first |
| A saving beside a larger cost | Reported with the dominant cost for the same resource; rejected only when that cost hides it from everyone | Rejected whenever something else on the path is slower | A network wait dominates a request's latency, not the CPU spent per request |
| Order of performance findings | By work removed per unit: complexity class, then I/O or a wait per element, then allocation per element, then constant work | Severity labels or estimated speedups | The order follows from the trace; a percentage would be invented |
| Challenger in Performance Review | An independent challenger on four lines: not hot, no cost, changed behavior, dominated | None, as in Test Review | A performance claim fails in several independent ways, and each takes reading, not one search |
| Who measures a performance finding | Whoever applies it, before and after, in the way the saved resource demands, keeping it only if the gain shows | The review, by benchmarks; or one microbenchmark for every kind of finding | Reading proves work removed, not time saved; a single-threaded benchmark shows nothing about contention or round trips |
| Small changes in Performance Review | Lenses paired, three readers: complexity with allocation, async with contention, I/O with repeated work | Six readers for a small change | As in Defect Review; whether pairing costs attention is unverified |

## What a model run is for

Fixture tests in this repository check packaging and instruction integrity.
They cannot show that a review finds bugs or waste. A review of a real
repository can. It is a check the maintainer chooses to spend on after a
design change, not a step in writing instructions.
