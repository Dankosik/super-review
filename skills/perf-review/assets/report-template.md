# Performance Review

Write in the user's language. Attach no severity labels and no estimated
timings. Omit a section that would be empty and say so in the outcome.

## Outcome

The findings that stood, in the workflow's ranking by the work they remove
per unit. Then the counts: findings, tradeoffs, questions for the user,
unproven, rejected. With nothing found, say that no unneeded work was shown
on the hot paths that were read. When the scope does no per-unit work, say
so with its entries, how often each runs and where the per-unit work runs.

What was reviewed: the PR or local root and revision, the program's unit of
work, the hot paths considered and the basis for each, for a whole project
the entries used and the code they did not reach, the lenses used and left
out, the evidence of load used, what could not be read, where siblings of
each finding were looked for, and files that changed during the review.
Nothing was built, run or measured; findings rest on reading and count
work, not time.

## Findings

### P-001 — <the work removed, where>

**Hot path.** The entry, the unit and the multiplier, and the basis.

**Cost.** The trace as you confirmed it: numbered steps from one unit to the
work, each with its file, lines and quoted code, ending at the work per unit
times the multiplier. For a change review, the link to the change, or
`pre-existing`.

**Cheaper form.** The sketch and what it keeps. When another finding touches
the same path, whether they apply together.

**Saves.** The resource with its counts per unit before and after, and the
largest cost on the same path for it.

**Challenge.** What the challenger tried and why the claim stood.

### Constant work per request

Findings that remove constant work, after all the others, one row each: the
location, the work with its quoted line, the cheaper form, the resource
with its counts before and after, and that the challenge stood.

## Tradeoffs

### T-001 — <the saving and what it costs>

As for a finding, then what the cheaper form changes and who would notice.
Report both sides and do not say which the team should prefer.

## Needs your confirmation

Candidates whose trace held but whose path has no basis yet for being hot.
One line each: the work per unit, the path, and what would settle it: the
user's word that it runs per request or per element, a load figure, or a
profile. With that evidence, a new review can decide them.

## Outside the scope

Costs and siblings in code the user's narrowing left out, one line each: the
location, the work, and the finding it repeats. They were not traced or
challenged; a review of that code decides them.

## Unproven and rejected

One line each: the claim, and the missing step or the counter-evidence.
These carry no advice.

## Before applying

For whoever applies these findings. Each finding predicts counts per unit
before and after. Check them first: a count does not depend on how loaded
the machine is. A count that differs from the prediction means the trace
missed work: find it before going on.

Then measure time where the saving is time rather than a count, with a
release build on an otherwise idle machine and the same workload before and
after; on a loaded machine timings vary more than most savings:

- CPU: time per unit on the hot path at a realistic size.
- Contention and async waits: throughput and p50 and p99 latency at the
  concurrency production runs. A single-threaded benchmark shows nothing
  here.
- I/O: latency under load.

Keep the existing tests passing, and add one where the finding names
behavior that is easy to break: order, errors, what has happened on a
failure halfway. Apply a change only when the counts or the measurement
show the gain. When they do not, say so in that finding and leave the code
as it was. Do not adjust the measurement until it shows one.
