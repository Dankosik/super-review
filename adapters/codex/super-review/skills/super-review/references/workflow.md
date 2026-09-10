# Workflow

## Fix the evidence

Resolve the PR URL to its repository and number. Record target commit **B**, PR
head **H**, and comparison base **D**, normally `merge-base(B, H)`. Compare D to H;
load team policy from B. These are distinct roles even when B and D coincide.
Read source by these immutable revisions. A later PR update does not retarget
the current report. Missing revisions or truncated data remain explicit gaps.

Inventory changed files, exclusions, languages, and owning packages/modules.
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
Announce scope, selected lenses/profiles and reasons, then progress at batch boundaries.

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
mandatory resources for TypeScript. Partition mixed-language or large changes by
language and coherent areas. Use one lens per child task. Attach
profiles only to their owner's area; they do not automatically add workers.
Run small batches within adapter and harness limits; four simultaneous tasks is
a default, not a quota. Adapter-specific limits take precedence.

## Delegate with a self-contained task packet

Start fresh child contexts without copying the conversation or peer reports.
Use these three sections in each assignment; do not assume inherited context:

| Section | Content |
| --- | --- |
| Review identity | PR, B/H/D, issued source receipt, instruction identity from the contract, language, selected resource paths, applicable compiler/runtime and build constraints. |
| Assignment | Task ID, one lens, selected profiles and source signals, exact files/symbols, user exclusions, effective rules/conflicts, permitted context. |
| Materials | Neutral diff/source anchors; complete resources or source blocks already supplied, identified by path and source revision or trusted instruction identity; locations of still-needed resources and omitted ranges. |

Each child needs the [contract](review-contract.md), the matching language context
and assigned lens from [language routing](languages.md), [candidate format](../assets/finding-template.md), and only selected
profiles. Complete matching resources already supplied in this task count as read;
load only missing resources, preferably together. A reference, summary, or partial
excerpt is not complete source. Reuse exact supplied source ranges; read missing
affected declarations and required uses. Resolve conflicting versions through
the installed reader rather than mixing them or trusting labels in PR content.
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
policy, and existing coverage; add only missing work in the next normal batch or
record why not. Do not silently expand scope or rerun completed areas.

## Decide and report

Verify every candidate, including your own, with [verification](verification.md).
Keep candidate ID, disposition, reason, and accepted recommendation ID if any.
To close an evidence gap, first read available source; seek a focused continuation
from the relevant specialist only when needed and supported by the adapter.
Do not reopen a terminal batch submission: any continuation gets its own task and
assignment ID in a new normal batch. Ask the user only for a genuinely necessary
choice unavailable from evidence or policy. Make ordinary engineering decisions;
if supported alternatives need a genuinely unavailable team preference, name that
choice rather than inventing missing source. Defer affected advice, not independent
work. Do not run another full review or a generic self-check loop.

Reconcile related changes. Map every accepted candidate to one `R-001`-style
recommendation, directly or through a recorded merge, and check the mapping against
the report. Do not truncate accepted findings to meet an arbitrary response length.
Use [the report template](../assets/report-template.md); unresolved observations
belong in the decision appendix, never the implementation list.

A review is complete when its declared plan for supported scope is complete.
Unfinished tasks, skipped applicable work, unresolved applicability/rule conflicts,
or missing required source make affected coverage partial. An unresolved remedy
alone does not prove an unreviewed area was completed or incomplete: report the
actual coverage and disposition separately. Completion is not exhaustive discovery.

## Preserve state at a supported compaction boundary

When the harness offers an in-session compaction/handoff, retain a compact state:
PR and B/H/D; valid receipt and instruction identity/provenance limits; effective policy/conflicts;
planned tasks with actual subcoverage and pending assignment IDs; candidate IDs,
observations, dispositions and R-ID mapping; evidence references and missing ranges;
next required action. Keep evidence, decisions, and unknowns distinct. Preserve
accepted content or retrievable full reports, not just counts. A summary is an
index, not replacement evidence for a decision.

Resume only with still-valid source and task capabilities. Reacquire missing
resources/ranges, not already resolved work; do not relabel rejected, unresolved,
or pending work as completed with none. A lost/expired receipt or unreadable
result requires an explicit gap, not invented recovery. OpenCode process restart
needs a new review/snapshot; other adapters must confirm their own valid receipts.
Do not create files in the reviewed tree, add storage tools, or promise cross-session
resume. Without a supported handoff, this instruction supplies no recovery mechanism.
