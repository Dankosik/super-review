# Source-evidence evaluation

Status: **NOT RUN**. These cases define a comparison; neither the author audit nor
the unit tests establish that a model obeys the instructions.

## Evidence layers

`tests/source_evidence_test.py` exercises real Git in disposable local repositories
and verifies these fixture identities. The Bun wrapper includes it in normal CI.
It does not run a reviewer, grade model output, or introduce a source-reader runtime.
The scenarios in `packets.md` are controlled stage inputs, not live GitHub traces.
`cases.json` is evaluator-only: never supply it, this README, or the expectations
to a reviewer. `source-manifest.json` pins fixture bytes independently of prose.
Existing language-judgment and instruction-boundary cases remain separate.

## Controlled comparison

Install the base revision from `cases.json` and the exact candidate revision in
separate disposable harness contexts. Record their trusted instruction digests or
package revisions, host version, actual model and effort, permissions and tool
availability. Use the same user prompt, source bytes and availability conditions.
Only the named packet section, its declared source files and required installed
phase resources belong in a run. Do not disclose a case's counterpart, grader
expectations, peer results or previous answers. The runner assigns neutral run
identifiers and omits evaluator section IDs from the prompt.

These are acquisition/verification stage checks. A stage pass is not evidence of
end-to-end independent review coverage. For end-to-end confirmation, reproduce the
corresponding state in a disposable repository and preserve actual host/tool traces;
then also run unchanged language judgment and instruction-boundary regressions.

Before running, record repetitions, time/tool budgets, timeout handling and the
acceptance rule. Three fresh runs per case and revision are a useful starting
point, not statistical proof; retain individual results and increase sampling
when decisions disagree. Treat unavailable capability, timeout and missing trace
as distinct outcomes rather than silently dropping the attempt. A deliberately
unavailable source in a packet is a task condition, not a failed runner.

Capture the prompt, complete tool trace, full output and permitted artifacts in
an evaluator-only results directory, with revisions and source manifest. Redact
credentials/private source; do not add results to installed resources. Grade
explicit expected decisions and location identities first, then use a documented
human/rubric review for evidence quality, justified uncertainty and scope handling.
Record every failed expectation with its output/trace anchor; no self-reported
model confidence or majority vote replaces source evidence.

## Report outcomes without collapsing dimensions

Record outcome accuracy, process/scope violations, report usability and efficiency
separately. Log actual calls, repeated reads, tokens and latency only when exposed
by the host; missing telemetry is `unavailable`, not zero. Hard failures include
unauthorized source access, invented coverage/coordinates, or wrong source views.
For whole reviews also track unsupported accepted recommendations and omitted
eligible scope; this stage suite alone cannot estimate review precision/recall.

Compare per-case base/candidate results under the predefined acceptance rule.
Freeze held-out inputs before tuning and exclude them from the editing context.
This public suite is a development set, not a secret holdout. Do not change grader
expectations to make a failed candidate pass. Repair one demonstrated problem,
rerun affected contrasts and retained regressions, and stop when the declared
acceptance conditions are met or a concrete unresolved limitation is recorded.
Never replace missing model evidence with token savings, a green fixture test, or
an assertion that the instructions are perfect. Keep this suite's initial status
unchanged; store actual run status and raw failures in the separate result record.
