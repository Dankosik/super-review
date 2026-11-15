# Workflow

For the orchestrator. Readers and challengers work from
[the contract](contract.md).

## Source

Read the source where it is. For local scope, read the working tree and note
HEAD. Local changes are what the user names: uncommitted work against HEAD,
or a branch against its merge-base with the main branch. When the request
does not say, take the branch together with its uncommitted work.

For a PR, read files at the head commit and take the change from the
merge-base, without checking anything out. When the PR's commits are not in
the local repository, fetch them: that adds objects and moves no branch or
working file. If you cannot, read through GitHub and say in the
report that code outside the changed files could not be searched.

When the user names a branch or commit that is not checked out, such as the
main branch, resolve it once to a commit and give readers that commit, not
the name: a branch can move during the review.

Other sessions may change a local tree while agents read it. Before the
report, check HEAD and the status of the scope's files again. If either
changed, name the changed files in the report: findings in them may rest on
two versions.

Locate once where evidence of load lives for the reviewed area: benchmarks
in the repository, documents that state load, latency or throughput
targets, and any profile, flamegraph or benchmark output the user supplied.
Every reader gets the same list. It says where evidence of what runs often
lives; it is not a list of hot paths or suspected waste. Read-only semantic
navigation (LSP references and implementations, `ast-grep`, or existing symbol
indexes) may locate callers and dynamic dispatch targets; read every step of a
trace in the source files in full before citing it.

For whole-project source, also locate where work enters the program: request
handlers, route/page renders and interactive UI event paths, message consumers,
the main loop or command dispatch of a command-line tool, scheduled jobs, the
public interface of a library, the functions the repository's benchmarks call
and the frames of a supplied profile. Readers get the packages and modules those
entries reach. List the entries in the report, and the code they do not reach as
not reviewed, so a missing entry shows. An entry says where work starts, not
which path is hot. For a PR or local changes, the scope stays the change.

When no entry in the scope runs per unit of work, because the scope only
starts, wires and stops a long-lived program, start no readers. Report the
entries, how often each runs and where the per-unit work runs instead. Code
the scope registers to run per unit, such as a handler or a job, is per-unit
work.

## Lenses

| Lens | Asks | Selected when the area has |
| --- | --- | --- |
| [complexity](lenses/complexity.md) | Does the work grow with the input faster than the result needs? | Loops, searches, sorts, collections, per-row renders or parallel iterators over input whose size callers set. |
| [allocation](lenses/allocation.md) | Does each unit allocate, copy or initialize more than it keeps or reads? | Owned values, fresh subscriber collections or fixed-capacity storage built per element, tick or request. |
| [async](lenses/async.md) | Does async code keep the executor free and run independent waits together? | `async` code, route loaders/Server Components, spawned tasks, async locks. |
| [io](lenses/io.md) | Does each unit cost more round trips, system calls or connections than it needs? | Database, network, file, inter-process, server-to-client serialization or DOM layout calls. |
| [contention](lenses/contention.md) | Do concurrent callers wait on each other more than the shared state requires? | Locks, atomics, channels or pools shared across requests, tabs or threads. |
| [repeated-work](lenses/repeated-work.md) | Is work that gives the same answer every time done again on each pass? | Compilation, parsing, configuration reads, barrel initialization or invariant derivations on a hot path. |

Select every lens whose signal is present, and say which were left out and
why. A small change is not a reason to drop one.

One lens per reader. For a small change, about three hundred changed lines
or fewer in one package, or a package of about a thousand lines reviewed
whole, give one reader a related pair instead: complexity with allocation,
async with contention, io with repeated-work. A paired reader runs each lens's
full pass and reports each lens's coverage separately; finishing one never
closes its partner. Partition mixed-language scopes by language, and split a
large scope or lens along vertical call spines (`entry -> domain -> store`)
rather than horizontal directory slices when its files are more than one reader
can read in full: a reader that skims loses the lines it skipped, and a reader
follows calls across partition boundaries when tracing a hot path. Readers
overlap on purpose, and merging is yours.

## Readers

Start each reader in a fresh context with nothing from this conversation or
from other readers. Give it the target and revision, its lens or pair, the
exact files, for a change review the change itself with its removed lines
(supplied directly in the packet when readers lack Git or shell access),
the located evidence of load, for a whole project the entries, and the
paths of the contract, its lens, the matching language context
([Go](languages/go.md), [TypeScript](languages/typescript.md),
[Rust](languages/rust.md) or [Java](languages/java.md)) and the
[result format](../assets/finding-template.md). Never give it an expected
inefficiency, a suspected line or another reader's result, nor what was
settled before this review: earlier findings or fixes, decisions to respect,
severity. A reader that inherits conclusions repeats them.

Run up to eight agents at once unless the user sets another limit, honoring any
explicit user reader/challenger model or effort override through supported
native configuration.

Read each reader's list of what in its scope it could not read. Give that
part, once, to a fresh reader with the same lens and only those files. What
is still unread goes in the report.

## Challenge

First merge candidates with the same cause, from any readers, keeping each
trace. One cause often shows up through several lenses, such as a clone of a
large map inside a lock that both allocates per request and keeps every
other caller waiting for the copy: report it as one candidate with each
cost's trace. Before launching challengers, run your own cross-seam pass across
the boundaries between shards: cross-module repackaging, N+1 calls hidden
behind repository interfaces, and caches, batches or indexes removed in `D..H`
whose callers lived in another partition. Any candidate you find yourself while
reading, with a trace, joins the others here and goes to the challenger of the
lens it belongs to.
Every candidate with a trace goes to a fresh challenger, one per reader
task; a merged candidate goes to only one of them. Give it the same
materials, lens included, plus [the challenge](challenge.md), and for each
candidate only the location, hot path, cost trace, cheaper form and
resource. Strip the reader's reasoning, its notes and its confidence. A
trace the reader left incomplete is not one: finish the missing step from
the source yourself before the challenge, or the candidate is unproven. Do
not hand a challenger the job of completing it.

## Decide

You own the decision on every candidate. A reader's confidence, a
challenger's tone or agreement between agents is not evidence.

- **Walk each trace yourself.** Every quoted line is there, each step does
  the work it claims for one unit, nothing rests on unread code, the
  multiplier really reaches this code, the counts before and after follow
  from the steps, and the cost of an operation the form makes cheaper rests
  on the basis the claim names. A step about behavior that neither you nor the
  challenger read in source or documentation, the standard
  library's and the runtime's included, rests on memory, and the candidate
  is unproven. Read missing code yourself when it is at hand; do not
  rewrite the trace into a different claim.
- **Check the hot path.** Its basis is a caller, a loop, a document, a
  measurement or the user's words. Code that looks central is not a basis.
- **Check the cheaper form.** Walk it through the inputs the entry admits:
  empty, one, duplicates, a failure halfway, a dropped future or cancelled
  context. Check that it builds within the project's `rust-version`, features
  and targets (or its Go, TypeScript or Java language and dependency baseline).
  Name everything it changes. When you see a form that removes more of the work,
  such as a borrow where the reader reserved capacity, use it instead; check
  the new form the same way, yourself or through the challenger.
- **Check findings on one path together.** Cheaper forms that each keep
  behavior can lose it together, when one relies on a check, an order or a
  value another removes. Walk the forms that touch one function or path
  applied together. When they conflict, say which to apply, or give a
  combined form that keeps behavior.
- **Weigh the challenge as an argument, not a ruling.** A `falls` needs
  specific quoted counter-evidence; check it. "The compiler optimizes this"
  defeats nothing without a profile, a benchmark or a documented guarantee.
  A `stands` with no account of what was tried is no challenge. A
  `tradeoff` needs the change named and who would notice it.
- **Settle disagreements.** On a fact, from the source. On whether a change
  in behavior is acceptable when both have the facts right, the candidate
  is a tradeoff.

| Outcome | When |
| --- | --- |
| finding | Hot path shown, cost trace confirmed, the cheaper form keeps behavior, the saving is not hidden; the challenge stood or its `falls` was refuted. |
| tradeoff | As a finding, but the cheaper form changes something the team must weigh. |
| unproven | A step is missing, the hot path has no basis yet, or no challenge was carried out. |
| rejected | The path is not hot, the work is not done, the cheaper form changes what callers rely on, a larger cost hides the saving, or out of scope. |

Rank what stood by the work it removes per unit: a change of complexity
class first, then a round trip, system call or blocking wait per element,
then an allocation or copy per element, then constant work per request.
Within a class, the larger multiplier first. Constant work per request is
reported compactly. A candidate unproven only for want of evidence that its
path is hot becomes a question to the user in the report. Finish deciding,
ranking and checking siblings before drafting the report.

## Siblings

Look for siblings of each finding that stood. Waste written once is often
written again: the same compilation in another handler, the same query per
item in another repository method, the same copy in a neighboring loop, the
read and write paths of one cache. Search the repository for such places.
Give those in the scope to one fresh reader with that finding's lens, the
finding as the pattern to test and the places as its files. This is the one
task that gets a known finding. A sibling needs its own hot path, trace and
challenge; one outside the change is reported once as pre-existing. A
sibling in code the user's narrowing left out gets no reader or challenge:
name it in one line with its location and the finding it repeats. Decide
siblings as above.

## Report

Use [the report template](../assets/report-template.md). Report every
finding and tradeoff that stood; do not cut the list to fit a length. A
reader that returned nothing is unread coverage, not a clean result. No
findings is a valid outcome; say what was read, and do not claim the code
is fast.
