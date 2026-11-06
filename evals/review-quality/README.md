# Review precision, completion and application

Super Review now makes four existing review responsibilities more explicit:
check the factual premise, finish the assigned question after the first finding,
show a useful resulting shape, and reconcile recommendations against one resulting
design. A separate maintainer evaluation also applies accepted advice and performs
one ordinary follow-up edit. The installed reviewer remains read-only.

This is one bounded iteration, not evidence of ideal code, exhaustive discovery,
general superiority or reduced maintenance time. No Cargo, Rust compilation,
program execution, test authoring or benchmark was part of the evaluation.

## Changed decisions

| Requested improvement | Defining owner | Concrete decision and retention case |
| --- | --- | --- |
| Factual accuracy | [verification](../../skills/super-review/references/verification.md) | Trace the asserted relationship and a source countercase; repair an explanation while retaining a supported burden. Do not turn the check into a general correctness audit. |
| Independent opportunities after the first candidate | [review contract](../../skills/super-review/references/review-contract.md) | Finish the remaining assigned source and profiles. No finding quota, new lens, second full pass or double-counting a subsumed rewrite. |
| Concrete structural remedy | [specialist result](../../skills/super-review/assets/finding-template.md) and [report](../../skills/super-review/assets/report-template.md) | Preserve a minimal type/signature/owner/transition sketch when needed to judge the proposal. A self-explanatory rename needs none; a sketch is not a full patch or equivalence proof. |
| Compatibility of the advice set | Verification and report | Compare resulting owners and interfaces. Incompatible remedies become a coherent revision or alternatives; a shared file does not make compatible edits conflicting. |
| Result of applying review | This evaluation only | Apply a fixed accepted report to an isolated source copy, then give a preselected change to cold editors of both versions. Do not grant the installed skill editing authority. |

The eight base questions, rule IDs, specialist routing, model profiles, review
category and authority limits are unchanged. No new actor or review round is
added to normal execution.

## Frozen baseline and inputs

The baseline is the worktree state before this iteration, based on upstream
`e23c1b91186d60d323014750b02960fd4d4b93dd`, **including** the preceding Rust
maintenance refinements. It is not the untouched 3.6.0 release. Exact texts and
hashes for both arms are in [instructions.json](results/instructions.json).

[inputs.json](inputs.json) contains neutral source and controlled candidate
proposals. [cases.json](cases.json) is evaluator-only. Reuse the complete
resource set selected in the receipt, one input, and the bounded stage request;
do not send the grader, peer outputs or arm mapping to reviewers.

The decoder and CSV source are disclosed diagnostic inputs from
[Rust maintenance](../rust/maintenance/README.md). The composition input combines
a small immutable worker-capture example with the disclosed broker. This is not
a fresh-task confirmation study. Controlled candidate explanations are hypotheses
to verify, not proof that a real specialist or host supplied them.

## Static stage comparison

Eight fresh stages used the native request `gpt-6-sol` / `medium`, one per arm
for each of four inputs, with at most four probes active. Two pairs used
baseline-first dispatch and two candidate-first. This tests selected judgment
and verification stages with the same requested model/settings; it does not
establish the configured root orchestrator's behavior or a full native review.
The stage actors had read-only source scope and could write only their own report.
Their full authored reports are the primary outputs; final messages only identify
the saved artifact. No failed attempt was replaced.

| Input | Baseline | Candidate | Independently assessed result |
| --- | --- | --- | --- |
| QF: inaccurate decoder/CSV premises | [q01](results/q01.md) | [q02](results/q02.md) | Both retain supported recommendations while repairing the premise. Candidate precisely identifies three CSV conversions; baseline says two. |
| QC: conflicting captures and compatible broker edits | [q04](results/q04.md) | [q03](results/q03.md) | Substantive tie. Both choose coherent captures and keep the compatible rename/extraction. |
| QD: full CSV data-flow question | [q05](results/q05.md) | [q06](results/q06.md) | Candidate addresses both EOF bookkeeping and UTF-8 reconstruction; baseline gives no disposition for the EOF state. This is demonstrated report coverage, not proof of what either actor read. |
| QS: actionable decoder structure | [q08](results/q08.md) | [q07](results/q07.md) | Mixed. Candidate supplies a clearer transition sketch and a supported budget simplification, but repeats a false terminal-field exclusion claim. Baseline explains the effective-state precedence more accurately. |

The [independent assessment](results/assessment.md) was given only anonymized
paired outputs, input sources and grader cases, not live instructions, prior
results, parent history or arm mapping. It judged observation and remedy
separately and accepted valid answers outside the named expectations.
It noted that q06's two parser suggestions should be composed, not counted as
two separate efforts when one chosen rewrite subsumes both.

The parent retained q07's raw error and corrected its premise in the
[accepted application input](application/accepted.md): failed/ended flags can
coexist with inaccessible residual data; the enum expresses the effective phase.
The structural recommendation survives that correction. More explicit sketch
instructions did not prevent a factual error, and factual verification in the
parent remains necessary.

No aggregate win rate is inferred from these dependent, disclosed inputs.
There is one output per arm per case, no replication or cost-controlled
comparison, and no end-to-end review coverage claim. Requested model settings,
resource hashes and native actor identities do not independently establish the
actual full inherited context or attention. Token and isolated editing-time
measurements are unavailable.

## Applying the report and performing a later change

The application input was fixed to the preselected q07 report after bounded
parent verification; it was not selected as the best of several reports.
A fresh editor applied the two accepted private Decoder changes to a copy:
one phase enum and remaining capacity. The Error, Encoder and Decoded prefix
remained byte-identical. No other production repository was changed.

- [Original source](application/original/src/lib.rs)
- [Revised source](application/revised/src/lib.rs)
- [Application report](application/application-report.md)

Before that edit, a separate actor received only the existing API/behavior
document, no implementation or review, and wrote [one follow-up request](followup.md):
add `Decoder::reset()` with the original constructor limit restored in every
state. Its bytes were frozen before application. The precise follow-up contract
was withheld from the application editor; the accepted scope did explicitly
exclude extra capabilities, naming reset among them. This was not a fully
information-free application treatment, and it is not used for a causal
instruction-effect claim.

Two fresh editors then received the same follow-up, the existing behavior
contract, their own source copy and the same read-only-context/code-only limits.
They did not receive reviews, instruction-arm labels, peer sources or reports.
Both inherited the same parent model/effort request; independent effective-model
attestation, token totals and isolated edit time were not exposed.

| Source before follow-up | Result | Concrete edit |
| --- | --- | --- |
| Original flags and max/reserved | [maintenance/y](application/maintenance/y/src/lib.rs) | Add reset through `Self::new(self.max)`. |
| Revised phase and remaining capacity | [maintenance/x](application/maintenance/x/src/lib.rs) | Retain the constructor limit, initialize it, and add reset through the constructor. |

This is an actual source modification, not a reader's predicted maintenance cost.
It is still **not runtime validation**. The original representation needs the
narrower edit for this follow-up. The revised representation now has a concrete
reason to retain the original limit; that new requirement reopens the earlier
choice rather than proving it was wrong under the old contract. The phase enum
and the budget representation must be judged separately.

The final source comparison uses [blind-input.json](application/blind-input.json)
with neutral labels, complete sources, hashes and the before/after correspondence.
The reader receives neither the review nor the editors' reports or provenance.
Its [assessment](application/assessment.md) compares source-supported clarity,
remaining relationships, actual edit responsibilities and preservation uncertainty.
The arm-to-label map is recorded separately in the receipt. Code structure can
still suggest provenance; no claim of perfect blinding is made.

## Scope, validation and replay limits

The receipt records input/resource/output hashes, selected resources, native task
names, requested settings, inherited-setting gaps and the application mapping.
Complete stage packets can be reconstructed from the neutral inputs, frozen
instruction texts and the saved assembly description. Stage report files are
primary actor-authored outputs; they are not full native tool traces.
Author-reported compliance is not independent proof of every read or action.

Local package build, validation, skill validation and the four affected existing
Bun suites passed; the suites contain 22 tests. Their purpose is package,
resource, handoff and fixture integrity. They do not execute the supplied Rust
or establish recommendation quality. No new executable test was added.

The reviewer stays read-only. Application and maintenance happen only inside
this expressly authorized maintainer evaluation. Future application studies need
their own accepted source/edit/execution scope; this document grants none.

A general process claim still needs fresh tasks, repeated runs, compatible
correctness evidence and independent blinded assessment. Compare review with
ordinary extra effort at comparable total budgets, including repairs, and give
competing instruction packages the same opportunities. Record retention cases,
failed applications, corrective edits and unknown measurements. Do not select
only successful recommendations or turn unchanged/readable code into a failure.

No release, remote write, installed-plugin update or generation-skill edit is
included. The completed iteration is the concrete instruction patch, paired
static evidence and source-only application/follow-up artifacts with their limits.
