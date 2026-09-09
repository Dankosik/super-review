# Go-specific judgment evaluation

Status: proposed; no fresh model-backed evaluation executed.
Baseline: `34acd519d93e79c2b1a1324ed974bbb58861c3bc`.

`go-idioms-cases.json` contains evaluator-only expectations. Give the reviewer only
one raw section of `packets/go-idioms.md`, the same neutral request, common contract,
Go context, owning lens, selected profile, and candidate format. Do not give it
the paired case, rubric, audit conclusions, or previous reviewer output. Verification
cases assess an already supplied proposal, not autonomous detection. Synthetic
snapshot labels are not GitHub receipts and cannot prove source-tool integration.

## Comparison

Compare baseline and candidate instructions with the same harness, model, effort,
input, and tools in fresh independent contexts. Record the instruction commit and
all supplied resource hashes. Randomize which revision is shown first and keep
outputs for grading against the semantic expectations; allow different useful
transformations and empty outcomes where warranted. Repeat ambiguous outcomes
rather than claiming one favorable result establishes a general improvement.

The ten contrast pairs exercise generics, exact library semantics, results versus
mutation, named results, error boundaries, contexts, docs, naming, representations,
and explicit control flow. Four verification tasks challenge module compatibility,
defer extraction, method promotion, and broader error matching. A no-finding-only
reviewer fails the useful-change side even when it avoids false positives.

Grade useful supported advice, omissions, unnecessary churn, compatibility changes,
scope leakage, concrete handoff, and relevant limitations. Do not grade exact prose,
line counts, matching a preferred patch, or a quota of recommendations. Report
judgment and verification results separately. Run the existing contextual-routing
suite too: a good optional profile is ineffective if it is never selected. Include
an authorized real Go PR with meaningful refactoring opportunities and a clear-code
PR before claiming end-to-end improvement. Compare review time/context cost without
silently dropping declared coverage.

## Actual preparation evidence

On 2026-09-09, all 24 complete Go source blocks were extracted to separate packages
under a temporary module with `go 1.23`. With local Go **1.23.2**, running
`GOTOOLCHAIN=local GOPROXY=off GOSUMDB=off go test ./...` compiled all 24 packages;
each reported `[no test files]`. No fixture functions were called by authored tests.
This confirms fixture type/syntax consistency under that compiler, not all narrated
baseline compatibility, equivalence of proposals, or correct model decisions.

The development session already knew the expectations, so its manual reasoning
is not recorded as a blind model run. Local Bun/native harness checks were not
available. Mechanical project CI and any later model runs must be reported with
their own receipts; do not relabel fixture compilation as behavioral evaluation.
