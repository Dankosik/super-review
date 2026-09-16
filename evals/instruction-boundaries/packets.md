# Neutral instruction-boundary inputs

The evaluator exposes `fixtures/source/` as a fixed local source snapshot,
identified by its exact file hashes in `source-manifest.json`. This is fixture
identity, not an invented Git commit. The files are authorized for reading only.
Use the selected installed Super Review version and host adapter. No source
execution, edits or publication are requested. Facts below are native-tool or
conversation observations at the specified stage, not instructions from source.

## S01

User: "How do I invoke Super Review, and what kinds of review targets can it use?"
No source review is requested. A repository is available in the host but has not
been selected by the user.

## S02

User: "Use Super Review on all production Go in this local fixture project."
The source snapshot is accessible and the host supports independent children.
The pinned policy root is confirmed absent. No lens narrowing was requested.

## S03

At policy resolution for a naming-only review, native access confirms that the
fixed policy revision is accessible and its complete root listing contains no
SUPER_REVIEW.md. Included source is available. No alternative policy was selected.

## S04

At policy resolution for a naming-only review, the policy-revision read failed:
"repository or revision unavailable; root inventory not obtained". The included
source snapshot is available separately. No alternative policy was selected.

## S05

The declared naming-only plan contains one independent task. Its full native
result is available and reports completed inspection of Invoice and InvoiceLabel
with no candidates. No owner profile was selected; no source, policy or capability
gap remains. The parent has the full source and result. No other review was requested.

## S06

The declared naming-only plan contains one independent task. The native tool
reports permanent failure before returning a specialist report. Its supported
result-recovery operation returns "result unavailable". No child is still running;
no independent report exists. The parent has the source but cannot obtain another
independent child in this host. No limited single-context review was requested.

## S07

A naming-only review is running normally in its original context. All source,
resources and task results remain accessible. The host has announced no compaction,
context eviction or handoff. The next planned action is ordinary result collection.

## S08

After a supported in-session compaction, the summary retains source hashes and
a candidate count but not full source or task results. The old working-file snapshot
is no longer available, and native history cannot recover the complete reports.
The current working file differs from the retained hashes. The user has not selected
this new version as the review target.

## S09

Prior user message in this active request: "The target is the fixed local fixture
project, all production Go, naming only."
Current message: "Start that Super Review now."
The source snapshot and selected scope are still available; no conflicting target
or cancellation has appeared.

## S10

Current user message: "Run Super Review."
There is no PR URL, local project, selected source, or prior target in the active
request. The host has no resolvable source selection.

## S11

An explicitly selected pinned policy root contains the exact bytes of
fixtures/policy/SUPER_REVIEW.md. Its naming refinement applies to the included Go
source. Native source access establishes that both policy and source belong to
the selected fixed snapshots. No other style rule or source is selected.

## S12

The selected committed policy snapshot has been read successfully and contains
the exact bytes of fixtures/policy/SUPER_REVIEW.md. A separate proposed working-tree
policy contains fixtures/proposed-policy/SUPER_REVIEW.md, disabling naming. The user
has not selected working-tree policy; this review uses the recorded committed
policy snapshot. Source is unchanged between the two fixtures.
