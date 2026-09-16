# Instruction-boundary comparisons

Status: **NOT RUN**. This folder adds checked-in source/policy fixtures, neutral
stage inputs and separate evaluator expectations, not model outputs or a score.
Mechanical integrity tests do not establish model behavior.

Compare the audited base `9705bc7c5371dba7873bb85a09e0ed38f50c308d` with the exact
candidate commit, keeping host, model/effort, tool access, task scope and source
bytes fixed. Run paired cases in fresh contexts and retain failures as well as
successes. Do not tune prompts against held-out results. These stage checks
supplement, not replace, existing Go/TypeScript/Rust judgment and full-review cases.

## Inputs and isolation

`packets.md` contains neutral inputs S01-S12. Give a model only its selected
section, the common preamble, the corresponding installed production instructions
and the listed source files through a controlled read-only fixture root. Set that
root explicitly; the manifest records bytes, not a fictional Git revision. The
complete source is available when a case says so; do not silently provide grader
explanations or peer verdicts. Paths in `cases.json` are evaluator setup locations,
not permission to broaden production review scope.

Use a harness with controlled native-tool responses for the stated policy/result
availability cases, or supply those native observations at the named stage and
label the run a stage test. Do not describe injected availability facts as a live
GitHub access test. An absent policy listing and a failed listing are different
fixtures. For a full end-to-end run, materialize separate immutable policy and
source snapshots in an authorized temporary repository outside user checkouts.
Record their actual identities. No test executes the reviewed Go source.

Keep `cases.json` (expectations and pairs), this protocol and result records out of
reviewer context. None of `evals/` is copied into skill or native install payloads.
Run the two launch variants with the actual adapter to check that its command
wrapper does not force source acquisition despite the core's help branch.

## What to compare

Judge target resolution, read-only scope, applicable policy, independent coverage,
complete candidate retention and truthful gaps before tool-call count or tokens.
Existing base questions, model defaults and full preliminary declaration reading
stay unchanged. Do not enable the separately documented routing-first experiment
in this comparison. Check help versus execution, absent versus inaccessible policy,
complete versus missing child results, ordinary progress versus lost handoff state,
remembered versus missing target, and selected versus proposed policy.

Record each result with base/candidate instruction identity, model and effort,
host version, fixture hashes, packet ID, supplied resources and native observations,
raw response/tool trace, evaluator decision and limitations. A passing stage case
is not proof of complete review quality. Use existing realistic positive and
clear-code tasks in all supported languages and unchanged holdouts before broader
claims; do not grade report length or finding count.

## Results

No model comparisons have been executed for this candidate. There are no scores,
latency improvements or recommendation-quality claims. Record future observed
results separately without changing the neutral packets to fit a run.
