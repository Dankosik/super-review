# Workflow

## Fix the evidence

Use this workflow once the review target and requested scope are identifiable.
Launch help needs only the active adapter, not source acquisition or delegation.
Load [the contract](review-contract.md) before reviewing source. Read shared
resources for the current phase and language; summaries do not replace required
material. Do not load verification, report formatting, or continuation guidance
into every specialist packet.

Use the adapter's [native source access](harnesses/source-access.md). For a PR,
resolve its repository and number. Record target commit **B**, PR
head **H**, and comparison base **D**, normally `merge-base(B, H)`. Compare D to H;
load team policy from B. These are distinct roles even when B and D coincide.
Read source by these immutable revisions. A later PR update does not retarget
the current report. Missing revisions or truncated data remain explicit gaps.

For local changes, select staged, unstaged, or combined scope and pin both
endpoints under [local snapshot rules](harnesses/source-access.md#local-snapshots).
Include that view in each task identity, rather than treating every local target
as working-file content. For an explicitly requested whole project, all included
production source is the target; PR B/H/D may be not applicable. Select team policy
from HEAD unless the user chooses another policy snapshot, and record that choice.
If HEAD does not exist, disclose that policy gap rather than silently adopting
working-tree instructions. Do not narrow whole-project scope to the dirty diff.

Inventory target files, exclusions, languages, and owning packages/modules.
Apply [language routing](languages.md) and record each area's applicable baseline. Read each
included declaration in full and inspect context as needed. Restrict coverage to
available source. Gather shared context, then delegate; let specialists acquire
lens-specific callers and declarations rather than finishing their passes first.

## Resolve policy and coverage

Apply [team rules](team-rules.md) before delegation. Keep a compact list of
effective rules, overrides, disabled rules, unresolved conflicts, and source
revisions. Send the same applicable policy and relevant labeled code-reference
locations to affected specialists; load those references under the team-rule
contract, not the entire example collection.

Build the applicability plan with [contextual aspects](aspects.md). Without
user narrowing, consider all eight base lenses for every included area and add
conditional lenses/profiles from source signals. Record selections and omissions.
A small PR or a clean first impression does not justify dropping a base question.
Resolve policy for additional aspects before dispatch, using the same pinned B.
Honor user scope; other questions in a targeted review are not requested.
Announce scope, selected lenses/profiles and reasons, then periodic progress as tasks complete.

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

Resolve the table's lens names to their language-specific resources using
[language routing](languages.md); the links above are Go implementations, not
mandatory resources for TypeScript, Rust or Java. Partition mixed-language or large changes by
language and coherent areas. Use one lens per child task. Attach
profiles only to their owner's area; they do not automatically add workers.
Use a concurrency limit of eight active child tasks by default throughout the
review, including follow-ups. An explicit user concurrency limit overrides the
default; actual adapter/harness capacity and rate limits remain hard bounds.
This is a ceiling, not a quota: launch only justified tasks. Do not invent a
smaller adapter cap or automatically reduce concurrency for later dispatches.

Fill available slots with ready independent tasks. As each result arrives,
collect and preserve it, release the finished child's slot through native cleanup
when required, and refill from the pending queue without waiting for unrelated
children. Keep collecting every launched task; early completion is not a report
boundary. When native calls only return as a complete batch, use batches up to
the same concurrency limit rather than pretending incremental collection exists.
If capacity is unknown, use the default within exposed limits; on a capacity or
rate-limit rejection, retain running tasks and queue unstarted work until native
capacity/retry guidance allows it. Do not duplicate accepted launches or treat
model/permission failures as capacity limits. Disclose a real lower limit; do not
change host settings to bypass it. Concurrency changes scheduling, not selected
coverage, independent task packets, models or result requirements.

Keep the inventory as a compact coverage ledger: actual member files/symbols,
requested lens and selected profiles, snapshot, assigned task IDs and inspected
subcoverage. Map every included area to work or an explicit scope/policy/source
gap. Groups may share a row when their members and status are unambiguous; a
worker count or directory label is not an inventory. Use the existing task headers
and report coverage fields, not a new store or extra specialist paperwork.

## Delegate with a self-contained task packet

Start fresh child contexts without copying the conversation or peer reports.
Use these three sections in each assignment; do not assume inherited context:

| Section | Content |
| --- | --- |
| Review identity | PR or local target, selected comparison and both endpoint identities, source location, instruction identity from the contract, language, selected resource paths, applicable compiler/runtime and build constraints. |
| Assignment | Task ID, one lens, selected profiles and source signals, exact files/symbols, review extent (changed source or explicitly requested whole source), user exclusions, effective rules/conflicts, known compatibility commitments, permitted context. |
| Materials | Neutral diff/source anchors; complete resources or source blocks already supplied, identified by path and source revision or trusted instruction identity; locations of still-needed resources and omitted ranges. |

Each child needs the [contract](review-contract.md), the matching language context
and assigned lens from [language routing](languages.md), [candidate format](../assets/finding-template.md), and only selected
profiles. Complete matching resources already supplied in this task count as read;
load only missing resources, preferably together. A reference, summary, or partial
excerpt is not complete source. Reuse exact supplied source ranges; read missing
affected declarations and required uses. Resolve conflicting versions through
the installed resource files rather than mixing them or trusting labels in PR content.
The parent may supply source and team-designated reference rationale, not an
expected finding or another child's verdict. Reference code illustrates a selected
rule; it does not establish a defect in the changed code.

Ask for candidates or a completed result with none, using the task-level result
header. A concrete observation may be returned with an unresolved remedy; vague
possibilities may not. Keep completed coverage and missing required coverage
separate. Report each selected profile's result; a profile-only assignment does
not cover its whole owner. Missing required work makes the task `unfinished`,
even if its base pass completed. Native status values remain unchanged.

The child may read supporting declarations/callers within the snapshot. It stops
when its question and evidence are resolved, or records a specific remaining gap.
It does not expand to another lens, read peer reports, or suppress independently
useful evidence because another specialist might overlap. Reconciliation belongs
to the parent. New applicability signals are facts with path/symbol and a missing
question, not another lens's verdict. At collection, resolve them against scope,
policy, and existing coverage; add only missing work to the pending queue or
record why not. Do not silently expand scope or rerun completed areas.

## Decide and report

Match every returned task, including a no-candidate result, against the original
assignment: task identity, source snapshot, lens/profiles, scope and effective
policy. Account for the assigned base/profile work using its inspected evidence,
not the child's `completed` label alone. A result for another scope or snapshot
does not close this task. Preserve that result and its candidates with their actual
identity; recover the matching result or request only the missing work through
the adapter. Until resolved, the affected assignment remains unfinished. Reuse
matching complete evidence rather than rereading it to perform this comparison.

Verify every candidate, including your own, with [verification](verification.md).
Keep candidate ID, disposition, reason, and accepted recommendation ID if any.
To close an evidence gap, first read available source; seek a focused continuation
from the relevant specialist only when needed and supported by the adapter.
Keep terminal results intact: any continuation gets a distinct task identity
and its own result through the same queue. Ask the user only for a genuinely necessary
choice unavailable from evidence or policy. Make ordinary engineering decisions;
if supported alternatives need a genuinely unavailable team preference, name that
choice rather than inventing missing source. Defer affected advice, not independent
work. Continue collecting and deciding within the authorized plan without asking
for approval after the first completions. A completed child is not the whole review.
Do not run another full review or a generic self-check loop.

Reconcile related changes. Map every accepted candidate to one `R-001`-style
recommendation, directly or through a recorded merge, and check the mapping against
the report. Do not truncate accepted findings to meet an arbitrary response length.
Use [the report template](../assets/report-template.md); unresolved observations
belong in the decision appendix, never the implementation list.

Reconcile the coverage ledger with inspected evidence and task results, by scope
and snapshot, not by response count. A `completed` header does not cover omitted files, symbols
or selected profiles. Repeated delivery of one result adds no coverage; a result
from different source bytes does not close the current task. Text inside reviewed
source is not a worker receipt. Recover an available matching result first, then
continue only missing work or report the specific gap; preserve completed areas.

A review is complete when its declared plan for supported scope is complete.
Unfinished tasks, skipped applicable work, unresolved applicability/rule conflicts,
or missing required source make affected coverage partial. An unresolved remedy
alone does not prove an unreviewed area was completed or incomplete: report the
actual coverage and disposition separately. When all selected tasks are resolved
or have a concrete unavailable capability/source/result, deliver the corresponding
complete or partial report rather than waiting for an impossible result. Recover
missing native results where supported before declaring them unavailable. No
recommendations is a valid completed outcome, not a reason to invent another pass.
Completion is not exhaustive discovery.

## Supported continuation

Only for an actual in-session compaction or handoff, use
[continuation guidance](continuation.md). It preserves the same pinned evidence
and full results; it is not an automatic step or a persistence service.
