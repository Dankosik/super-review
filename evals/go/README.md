# Evaluation cases

`cases.json` defines twelve semantic cases for the skill and orchestration.
The expectations are an evaluator's rubric, not input to a reviewing model.
They do not prescribe exact prose or a minimum finding count.

Give an independent reviewer only the skill, a realistic request, and the raw
source packet or scenario input. For example:

> Use Super Review to review the synthetic PR in `packets/pr-1.md`.
> Return the full report. This is a read-only fixture run.

Do not give the reviewer the expected outcome. Evaluate its actual report for
useful findings, omissions, taste-based advice, scope, effective team policy,
verification, coverage honesty, and retention of accepted candidates.

The packet uses synthetic SHA labels and complete source fixtures; it proves
neither GitHub acquisition nor OpenCode execution. Those are separate adapter
checks. Workflow-only scenarios (missing specialists, no delegation, reconciliation,
and final report assembly) should be tested at their stated stage.

Record model/harness, exact skill revision, supplied inputs, observed results,
and limits in `docs/validation.md`. Do not call all twelve passed merely because
the case file parses or source-reader tests succeed.
