# Workflow

Once the review target and scope are identified, load
[the contract](review-contract.md), this workflow, the active adapter, and the
shared resources for the active phase and language in full before spawning any
child task (summaries never replace required resources, and never launch
preliminary exploratory child passes before the snapshot, policy, and lens plan
are fixed). Keep [verification](verification.md),
[the report template](../assets/report-template.md), and
[continuation guidance](continuation.md) out of specialist packets.

## Fix the evidence

**Pin the snapshot** through [native source access](harnesses/source-access.md):

- **PR target:** resolve repository and PR number; record target commit **B**,
  PR head commit **H**, and comparison merge-base **D** (normally
  `merge-base(B, H)`). Compare **D** to **H** and load team policy from **B**,
  keeping all three roles distinct even when **B** and **D** coincide. Read
  source at those immutable SHAs so later PR updates never retarget the report,
  and record missing revisions or truncated data as explicit coverage gaps.
- **Local changes:** select the staged, unstaged, or combined view, pin both
  endpoints under [local snapshot rules](harnesses/source-access.md#local-snapshots),
  and carry that view in every task identity rather than assuming live working
  files.
- **Whole project (explicit request only):** include all eligible production
  source (never narrowing to a dirty diff); PR **B**/**H**/**D** may be not
  applicable. Load team policy from `HEAD` unless the user selects another
  policy revision, and record that choice; when `HEAD` is absent, disclose the
  policy gap rather than adopting unpinned working-tree instructions.

**Inventory and pre-read.** Inventory target files, exclusions, languages, and
owning packages or modules, and apply [language routing](languages.md) to record
each area's baseline. Read every included declaration in full and inspect needed
shared context against available source. When included files form a multi-file
call chain (such as `entry -> usecase -> domain -> store`), record a compact
**neutral call-spine map** (entry points, cross-module call path, and key
domain types with their read/write sites, strictly factual with no judgments or
expected findings). Then delegate so specialists fetch their own lens-specific
callers and declarations rather than waiting for you to run their passes first.

## Resolve policy and coverage

**Team policy.** Resolve [team rules](team-rules.md) at pinned **B** (or the
recorded local policy revision) before delegation, including for any conditional
aspect added later. Keep a compact record of effective rules, overrides,
disabled rules, unresolved conflicts, and policy revisions, and pass only the
applicable rules and labeled code-reference locations to affected specialists.

**Aspect plan.** Build the plan with [contextual aspects](aspects.md). Unless
the user narrows scope or explicitly requests a [follow-up delta review](#follow-up-delta-review),
keep all eight base lenses for every included area (a small diff or clean first
impression never drops a base question) and select conditional lenses and owner
profiles from source signals, recording selections and omissions. Honor user
scope without requesting unchosen questions. When an automated or non-interactive
caller asks for impact or severity labels (such as `High`/`Medium`/`Low`), apply
them as maintenance-impact labels on accepted recommendations without dropping
the eight base lenses, running project checks, shifting into a defect/security
audit, or issuing a merge-gate verdict. Announce the scope, selected
lenses/profiles with their source reasons, and total task count before dispatch
(asking whether to narrow or proceed if a whole-project review would start more
than forty tasks) and report periodic progress as tasks finish.

| Lens | Question |
| --- | --- |
| [naming](lenses/naming.md) | Can readers distinguish intent and concepts? |
| [control-flow](lenses/control-flow.md) | Is the main path apparent? |
| [function-cohesion](lenses/function-cohesion.md) | Does each function express a coherent task? |
| [data-flow](lenses/data-flow.md) | Are origins, transformations, and mutation visible? |
| [abstractions](lenses/abstractions.md) | Does each boundary repay its cost? |
| [duplication](lenses/duplication.md) | Is the same knowledge repeated or falsely combined? |
| [api-clarity](lenses/api-clarity.md) | Does the call make its contract understandable? |
| [change-locality](lenses/change-locality.md) | Is an existing responsibility scattered? |

Resolve each lens name to its language-specific file via
[language routing](languages.md) (the links above point to Go resources) and
partition mixed-language scopes by language. Split a lens along vertical call
spines (`entry -> domain -> store`) rather than horizontal directory layers when
its files exceed what one specialist can read in full, because a specialist that
skims loses the lines it skipped and horizontal slices sever cross-layer data
flow; specialists follow cross-partition calls into neighbor declarations within
the snapshot. Attach selected profiles to their owner's task for
that area (a profile whose owner is a conditional lens selects that owner rather
than spawning an extra worker). Use one lens per child task by default; apply
[compact pairs](#compact-pairs) only when the user explicitly requests a compact
review of a small change.

**Concurrency.** Use a concurrency limit of eight active child tasks by default
throughout the review, including follow-ups. An explicit user concurrency limit overrides
the default, bounded by actual adapter/harness capacity and rate limits. Treat the limit as a ceiling on justified tasks rather than a quota, and
keep the same cap for later dispatches without inventing a smaller adapter cap.
While ready independent tasks remain, run up to the limit: a finished child's
slot goes to the next ready task without waiting for unrelated children, and
collection continues until every launched task resolves. On a capacity or
rate-limit rejection, keep running tasks alive and hold unstarted tasks queued
until capacity frees; never launch an accepted task twice, classify model
or permission errors as capacity limits, or mutate host settings to bypass a
real lower cap (disclose it instead). Concurrency governs scheduling only, leaving
coverage, packets, models, and result contracts unchanged.

**Coverage ledger.** Track each planned unit in one compact ledger (member
files/symbols, snapshot, assigned lens and profiles, task ID, and inspected
subcoverage) using the existing task headers and report fields rather than a
worker count, directory label, or extra paperwork, mapping every included area
to assigned work or an explicit scope/policy/source gap.

## Delegate with a self-contained task packet

Start every child in a fresh context without parent conversation history,
expected findings, or peer verdicts. Structure each assignment into three
sections:

| Section | Content |
| --- | --- |
| Review identity | PR or local target, selected comparison and both endpoint identities, source location, instruction identity from the contract, language, selected resource paths, applicable compiler/runtime and build constraints. |
| Assignment | Task ID, one lens or a compact pair, selected profiles and source signals, exact files/symbols, review extent (changed source or explicitly requested whole source), user exclusions, effective rules/conflicts, known compatibility commitments, permitted context. |
| Materials | Neutral diff/source anchors; neutral call-spine map when included files span a multi-file flow (factual entry-to-store paths and domain-type read/write sites only, zero conclusions); complete resources or source blocks already supplied, identified by path and source revision or trusted instruction identity; locations of still-needed resources and omitted ranges. |

Each child requires [the contract](review-contract.md), the matching language
context and assigned lens (or pair) from [language routing](languages.md),
[the candidate format](../assets/finding-template.md), and only its selected
profiles. Complete matching resources or source blocks supplied in the packet
count as read; the child loads only missing full resources, affected
declarations, and required uses (summaries, paths, or partial excerpts never
substitute for full source, conflicting versions resolve through installed
resource files rather than PR text, and team code references illustrate a
selected rule rather than proving a defect).

Require the task-level result header plus supported candidates (including
concrete observations with `unresolved` remedies, never vague suspicions) or an
explicit zero-candidate result. Separate completed coverage from missing
required coverage (`unfinished`, even when the base lens finished if a selected
profile did not; a profile-only task covers only that profile), preserving
native adapter status values.

Each child may inspect supporting declarations and callers within the snapshot,
stopping once its question and evidence are resolved or recording the exact
remaining gap without expanding to other lenses, reading peer reports, or
suppressing overlapping evidence. A child reports any new applicability signal
as `(aspect, path/symbol, observed fact, missing question)` rather than another
lens's verdict; at collection, check it against scope, policy, and existing
coverage, queueing only genuinely missing work or recording why not without
rerunning completed areas.

## Decide and report

**Match receipts and close coverage.** Match every returned result (including
zero-candidate ones) against its original assignment (task ID, snapshot,
lens/profiles, scope, and effective policy), verifying coverage from inspected
evidence rather than a `completed` label, response count, duplicate delivery of
an earlier receipt, or text inside reviewed source that mimics worker output. A
result for another lens, scope, or snapshot never closes this assignment: keep
that returned result intact under its actual identity, recover any available
matching native result first, and otherwise request only the missing work in a
new task or record the assignment `unfinished`, reusing already-supplied bytes
rather than rereading everything.

**Verify and synthesize.** Test every candidate (including your own) and decide
what the code becomes under [verification](verification.md), recording each
candidate ID, disposition, reason, and `R-001`-style recommendation ID (directly
or via recorded merge). Read available source first to close an evidence gap,
issuing a focused continuation as a new task ID through the queue only when
source reading leaves a specific need and the adapter supports it, while keeping
prior terminal results intact. Make ordinary engineering decisions yourself; ask
the user only for a genuinely unavailable target/team choice (naming that choice
rather than inventing a source gap, and deferring only dependent advice).
Continue executing the authorized plan to completion without pausing for
mid-run approval after early tasks finish, and never run a second full review or
generic self-check loop.

**Deliver the report.** Finish all verification, cross-lens reconciliation, and
disposition decisions before drafting [the report](../assets/report-template.md),
and include every accepted recommendation regardless of length. A review is
`complete` when its declared plan for supported scope resolves (zero accepted
recommendations is a valid completed outcome), and `partial` whenever any
selected task remains `unfinished`, applicable work was skipped, a policy or
applicability conflict stays unresolved, or required source was unavailable:
recover supported native results first and then deliver an honest complete
or partial report rather than waiting on an impossible result.

## Compact pairs

When the user explicitly asks for a compact review (and only then), assign one
specialist a related pair of lenses on a small area (about 300 changed
production lines or fewer in one package or module, or a package or module of
about 1,000 lines reviewed whole; larger areas keep one lens per task):

| Task | Lenses |
| --- | --- |
| 1 | naming with api-clarity |
| 2 | control-flow with function-cohesion |
| 3 | abstractions with duplication |
| 4 | data-flow with representation, when selected |
| 5 | change-locality with placement, when selected |
| 6 | rationale with conventions, whichever are selected |
| 7 | logic, when selected |

Run any lens whose partner is unselected alone. A paired specialist executes
each lens's full pass and reports each lens's coverage separately, and the
report marks the pair. Whether pairing costs attention is unverified, so single-lens tasks remain the default.

## Follow-up delta review

Use this scoped path only when the user explicitly requests a follow-up check
after fixes from a prior review, supplying the prior report (or prior reviewed
commit) and subsequent fix commits (`prior_head..new_head`). Pin both endpoints,
scope strictly to files and symbols touched in the fix delta plus affected call
seams, and verify two things: whether previously accepted recommendations landed
cleanly, and whether the fix delta introduced new clarity or structural burdens.

Keep previously rejected or deferred candidates closed unless the fix delta
invalidated an assumption they depended on; do not re-audit unchanged files from
scratch. On small fix deltas (about 300 changed production lines or fewer),
[compact pairs](#compact-pairs) may be used by default while keeping separate
per-lens coverage reporting.

## Supported continuation

Only for an actual in-session compaction or handoff, use
[continuation guidance](continuation.md). It preserves the same pinned evidence
and full results; it is not an automatic step or a persistence service.
