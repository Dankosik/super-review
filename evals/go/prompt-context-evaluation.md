# Prompt/context evaluation

Status: **proposed; model-backed evaluation not executed**. Fixture integrity,
compilation and packaging are mechanical evidence, not quality/latency gains.
Baseline: `0592ee207d34b32c4ef451ad09f6aeeabacce20f`, including its unreleased
Go/aspect refinements. Do not confuse that baseline with the v2.1.0 release tag.

## Inputs and isolation

`prompt-context-cases.json` is evaluator-only. Supply one P-section from
`packets/prompt-context.md`, its initial source, neutral snapshot setup and required
role resources. Never supply expectations, pair membership, earlier responses or
the whole packet. `available_source` is evidence the reviewer must acquire through
authorized existing read tools, not source preloaded for convenience. Keep each
file's path and H identity when supplying it. Treat these fixtures as new declarations
at synthetic H against empty synthetic D, except where a stage input says otherwise.
Do not use synthetic IDs as live GitHub receipts.

P07 needs the actual complete installed role resources and their hashes, materialized
by the evaluator rather than a claim that they were loaded. P08 deliberately starts
with incomplete resources/source. Record real read calls and delivered text to test
the distinction. A text-only stage response cannot prove native resource reuse.
Use existing fixture-capable evaluation access, or run the corresponding scenario
on an authorized pinned real PR. If that access is unavailable, mark acquisition
checks unexecuted; do not grant the production review new shell/file tools.

## Comparison

Use fresh contexts with identical model, effort, source availability, scope and
permissions for baseline/candidate; record all instruction hashes and randomize
order. Repeat variable outcomes where practical. Compare changes individually
(resource reuse, result format, observation/remedy split) as well as together.
Blind version labels for graders where practical. Preserve failed/partial outputs.

Grade supported observations, useful accepted changes, missed labeled opportunities,
unnecessary churn, scope leakage, coherent handoff and truthful coverage separately.
Allow different useful remedies, compatible narrowing and justified retention.
Returning nothing everywhere must fail positive cases; generating more candidates
must not automatically score better. An unresolved observation is neither an
accepted recommendation nor automatically missing source coverage.

Record repeated reads, actual spawned tasks, tool calls and specialist output size
separately from recommendation quality. For context/cost, distinguish peak request
size, cumulative input, cached input and output; record tool serialization/delivery
where possible. Cumulative tokens are not unique prompt length. Model claims require
real native traces, not inferred task counts or strings saying a model was selected.

P01-P06 exercise judgment/verification; P07-P08 resource delivery; P09-P12 coverage,
authority and reconciliation; P13-P14 compaction boundaries; P15-P18 orchestration,
reporting and focused clarification. These are stage checks, not 18 end-to-end PRs.
Run existing instruction-quality, Go-idiom and contextual-routing suites for regression.

Before claiming improved end-to-end behavior, include an authorized clear-code PR
and one with realistic cross-file refactoring opportunities. Keep additional held-out
PRs/scenarios outside prompt development and this published development fixture set.
A reviewed development fixture is not a holdout. Compare complete coding-agent
handoffs and report both misses and noisy candidates; do not invent a composite score.

No model API client, paid credential, persistent CI evaluator or review-time checks
are added. Runtime examples remain absent unless controlled evaluation reveals a
recurring specific error; then test a small diverse contrast against untouched holdouts.
Record real future runs with inputs, identities, raw outputs and limits in
`docs/validation.md`, separately from mechanical CI receipts.

## Preparation evidence

On 2026-09-10, local Go 1.23.2 compiled the four fixture packages with
`GOTOOLCHAIN=local GOPROXY=off GOSUMDB=off go test ./...` from
`evals/go/fixtures/prompt-context`; all reported `[no test files]`.
Local static checks matched the 18 raw section IDs, source paths and four contrast
pairs and checked edited runtime links. This is not a model run, native integration
validation, or a local `bun test` result. The existing PR workflow records Bun and
native package checks separately.
