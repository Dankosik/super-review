# Workflow

## Fix the evidence

Resolve the PR URL to its repository and number. Record target commit **B**, PR
head **H**, and comparison base **D**, normally `merge-base(B, H)`. Compare D to H;
load team policy from B. These are distinct roles even when B and D coincide.
Read source by these immutable revisions. A later PR update does not retarget
the current report. Missing revisions or truncated data remain explicit gaps.

Inventory changed files, exclusions, Go modules, and `go` directives. Read each
included declaration in full and inspect context as needed. If source acquisition
is incomplete, restrict the claim of coverage to what was actually available.
Gather the shared context needed to assign the work, then delegate. Let each
specialist obtain its lens-specific callers and supporting declarations; do not
finish those passes yourself before dispatch.

## Resolve policy and coverage

Apply [team rules](team-rules.md) before delegation. Keep a compact list of
effective rules, overrides, disabled rules, unresolved conflicts, and source
revisions. Send that same policy to every affected specialist.

If the user explicitly selects lenses, declare a targeted plan with those lenses
and list the others as not requested. Otherwise use all applicable lenses.
Announce the pinned scope and plan, then report real progress at batch boundaries.

Consider the selected lenses for every included area; mark an inapplicable lens with a
specific structural reason rather than skipping it because the PR is small:

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

Partition large changes by coherent areas. Use one lens per child task, not one
agent asked to check everything. Run small batches within the harness's available
concurrency; four simultaneous tasks is a reasonable default, not a finding cap.

## Delegate

Start fresh child contexts. Include the following in each task rather than
assuming the child inherits them:

> Task ID and lens; PR identity and B/H/D; exact files/symbols and relevant diff;
> source-access receipt; Go versions; effective team rules and conflicts;
> [contract](review-contract.md), [Go context](languages/go.md), and assigned
> lens resource locations; permitted context and excluded checks;
> [candidate format](../assets/finding-template.md).

Require these four resources to be read in the child context. Send a neutral
question and source anchors, not an expected finding or another child's verdict.

Ask for candidates or an explicit completed result with none. The child may
read supporting declarations and callers within this snapshot. It cannot expand
into another lens or turn an unverified possibility into a required change.
Stop expanding context when the assigned question and candidate evidence are
resolved; missing required context still makes the affected work unfinished.
Report independently useful observations even when another lens may overlap.
Leave cross-lens coordination and deduplication to the parent; do not inspect
peer reports or suppress a candidate in anticipation of another specialist.

## Decide and report

Verify every candidate using [verification](verification.md), including your own.
Maintain a decision table: candidate ID, disposition, reason, and accepted
recommendation ID if any. Seek one focused clarification when it can resolve a
gap; if evidence remains missing, keep the candidate out of implementation advice.

Reconcile related recommendations before building the report. Map each accepted
candidate to one `R-001`-style recommendation, directly or by a recorded merge.
Check this mapping against the complete report; do not truncate accepted findings
to meet an arbitrary count or response length.

Use [the report template](../assets/report-template.md). A review is complete
only when its declared plan for the supported scope is complete. An unfinished
task, unresolved rule conflict affecting coverage, or missing required context
makes the affected coverage partial. Completion is not a guarantee of finding
every possible improvement.
