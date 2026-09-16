# Evaluating instruction changes

Development protocol, not an installed review instruction. Load the relevant
suite only when changing its decision; keep this protocol, grading expectations
and results out of reviewer context.

## Define the comparison

Before editing, name the observable failure, the intended decision and its
counterexample: when should the agent instead retain code, stop, or report a gap?
Select existing cases first. Add a neutral contrast only for a missing boundary.
Record the baseline and candidate instruction commits or content digests, source
bytes, task scope, installed adapter, host/tool versions, actual model and effort.
A matching version label alone does not fix instruction identity.

Choose acceptance criteria before seeing candidate outputs. Assess both the final
recommendation and its trace: correct activation, authorized reads, independent
coverage, supported advice, preservation constraints and complete disposition
mapping. Hard authority/coverage failures are not offset by shorter reports or
more findings. Measure tokens, latency and redundant reads separately, only when
those measurements are available and comparable.

## Select evidence, not an unnecessary full rerun

| Changed decision | Starting cases |
| --- | --- |
| Activation, target, policy, handoff, completion | `instruction-boundaries/` |
| Task/result matching, renamed/deleted anchors, file boundaries | `evidence-boundaries/` |
| Model selection or native execution | `model-selection/`, `native-host/`, `completion-waiting/` |
| Recommendation quality or contextual routing | Relevant `go/`, `typescript/`, `rust/`, `quality-judgment/` cases |

Fixture/package tests check the test inputs and delivery contract, not model
behavior. Stage tests isolate one decision using controlled native observations;
end-to-end tests exercise the actual installed adapter. Neither substitutes for
the other. A hand-authored child response is stage input, not a subagent run.

For a behavioral comparison, use fresh contexts and identical source/tool access
for each baseline/candidate pair. Run the counterexample as well as the positive
case. Fix a repeat budget in advance for variable model outputs, alternate pair
order, and preserve every attempt, including tool failures and incomplete runs.
Do not retry until a favorable answer appears. Hold model/effort and permissions
fixed; changing both instructions and models is not an instruction-only experiment.
An independent verifier receives evidence and a rubric, not the author's verdict.

## Record and decide

For each attempt retain the case ID, instruction/source identities, environment,
raw response and tool trace, evaluator decisions with evidence, and limitations.
Store only authorized, redacted material outside install payloads. Distinguish
`NOT RUN`, attempted-but-blocked, observed pass and observed failure; unavailable
measurements stay unavailable. Self-review and fixture integrity are not evidence
of independent model quality. Do not invent scores, hashes or agent activity.

Use development cases to repair a concrete failure, then rerun affected contrasts.
Use untouched realistic cases in the supported languages as holdouts before a
broader quality claim. Keep holdout expectations outside reviewer context and out
of the instruction-tuning loop. If a holdout informs an edit, it is no longer a
holdout; reserve a new one. A small passing set does not establish universal quality.

Stop the maintenance iteration when its concrete findings have dispositions, the
changed-input checks pass, and the declared behavioral gate passes or is explicitly
blocked. A blocked gate leaves the candidate unproven, not improved by assertion.
Do not add another generic instruction merely because a reviewer could imagine
one. Promotion of routing, coverage or model defaults needs its separate behavioral
comparison; an instruction-maintenance change does not authorize a release.
