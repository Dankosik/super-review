# Evaluating and improving Super Review

This directory is for maintainers and evaluators, not installed review context.
Use the existing host and authorized models; no new evaluation service or model
credential is required by this repository. Missing execution capability means
`NOT RUN`, not a passing evaluation or permission to invent an agent response.

## Choose evidence for the decision being changed

| Change | Relevant corpus |
| --- | --- |
| Activation, help, policy availability and completion | [instruction-boundaries](instruction-boundaries/README.md) |
| Coverage membership, duplicate/stale results and source anchors | [review-integrity](review-integrity/cases.json), with the isolation procedure below |
| Task/result matching, renamed/deleted anchors, file boundaries | [evidence-boundaries](evidence-boundaries/README.md) |
| Staged/unstaged/combined views and old/new source anchors | [source-evidence](source-evidence/README.md) |
| Expression/structure judgment | `quality-judgment/`, plus applicable `go/`, `typescript/`, `rust/`, `java/` and `spring/` cases |
| Native delegation, local snapshots and delivery | [native-host](native-host/README.md) and the current adapter configuration tests |
| Historical routing, model selection or waiting experiments | Their own revision-specific protocols; do not apply a 2.x runtime experiment to 3.x by text substitution. |

Do not run every historical experiment for an unrelated edit. New input should
expose a changed decision or a distinct failure, not merely increase fixture count.
[Reference rationale](../docs/reference-audit.md) explains what this audit adopts
and deliberately leaves unchanged.

## Bounded instruction-improvement cycle

Start from the exact baseline, one concrete failure or ambiguous decision, and
the intended outcome. State what existing behavior must survive. A source-backed
contradiction can justify a correction without pretending a model reproduced it;
a routing or quality optimization still needs its relevant behavioral comparison.

When native independent agents are available, select only useful audit lanes:
contract/context, review judgment/routing, or adapter/evaluation integrity. Give
each a fresh context, pinned files, relevant reference material, a bounded question
and the preserved product scope. Do not share peer verdicts or an expected list
of improvements. Each returns the affected instruction, a concrete counterexample,
a sufficient remedy and evidence against changing it, or no supported change.
These are maintainer audit roles, not additions to the eight production lenses.
Record actual native task/model identities and outputs. A sequential author pass
is useful but must be labeled as such.

The maintainer resolves recommendations by source evidence rather than votes.
Edit the defining instruction, regenerate its delivery copies and add the smallest
contrasting input that exercises the decision. Run the relevant existing checks
once on the resulting revision; do not weaken them to accept the proposed text.
A follow-up agent checks a specific unresolved conflict or changed decision, not
the whole repository with a request to find more faults.

Close the iteration when accepted corrections are implemented, relevant checks
are complete, and remaining evidence gaps are explicit. Another iteration needs
a new concrete failure, contradiction or material counterexample. Agreement,
zero findings, prettier prose and repeated self-review do not establish perfection.
Unavailable behavioral evidence limits the claim, not the ability to deliver an
honestly described instruction patch.

## Comparison and reporting

For behavioral claims, compare baseline and candidate in fresh runs with identical
source, policy, user scope, actual model/effort and tool availability. Change only
the instruction dimension under test. Include useful-change and clear-code
examples, narrow/whole-source requests, relevant languages and untouched holdouts.
Preserve every run, including failures and unavailable results; do not choose only
the best rerun. Record repetitions and per-case variation rather than treating a
single success as a general improvement.

Grade observations and remedies separately: supported burden, useful change,
unsupported churn, missed annotated improvements, compatibility and unresolved
choices. Also check source/scope coverage, result identity, anchor accuracy,
candidate-to-recommendation accounting and forbidden actions. Inspect actual tool
traces and final reports; self-reported compliance is not trace evidence. Mechanical
checks can validate identities and packaging, not these judgments. Keep grading
instructions away from the reviewer and preserve counterevidence when adjudicating.

Use native trace/artifact export when the installed host supports it. Record the
instruction revision, source/policy identities, request, host/model/effort, raw
output/trace locations, observed failures and missing measurements. Distinguish
stage probes, end-to-end model runs and package/configuration checks. Measure
latency, tokens and repeated reads only when the host exposes them; unavailable
metrics are null/not measured, never zero. An efficiency gain cannot justify
silently dropping applicable coverage or useful recommendations.

## Review-integrity stage probes

`review-integrity/inputs.json` contains neutral collection/positioning inputs.
`sources.json` contains controlled UTF-8 snapshots with independent SHA-256 file
identities. These labels are fixtures, not Git SHAs. `cases.json` is evaluator-only:
contrasts, checks and source-anchor expectations. None are actual worker outputs.

For one probe, provide only its input object and the named source snapshots,
together with the applicable installed workflow/verification and contract. Do not
provide the entire input collection, grader checks, expected anchors, peer runs
or this evaluator guide. Treat the supplied collection facts as controlled stage
state, not proof that a real host executed those workers. Ask for the next decision
or anchor resolution, not a fabricated end-to-end review. The positioning probes
isolate location; they do not establish a remedy's maintenance benefit.

A grader separately compares the answer and any real trace with that case's checks.
Then repeat the affected behavior in an actual host with a realistic repository
before claiming live delegation, acquisition or end-to-end quality. Passing a
stage probe cannot establish those capabilities. Existing activation negatives
remain necessary when changing entry points; these explicitly supplied stage
resources do not test skill discovery.

Mechanical fixture checks are in `tests/review-integrity.test.ts` and run with
`bun test`. They check source identities, safe fixture paths, input/grader mapping,
anchor expectations and delivery isolation. No model inference or fixture-source
execution occurs in those tests.
