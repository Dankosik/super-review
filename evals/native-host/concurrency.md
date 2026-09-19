# Concurrency scheduling probes

The change replaces the workflow's four-task default and Codex/Cursor three-task
caps with one eight-active-task default and slot refill where the host supports it.
It changes scheduling only, not coverage, lens selection, models or result quality.

Use the [evaluation protocol](../README.md). Baseline:
`5128e10f93d357fe3b316195359a14b915f57c1b`. Compare with the candidate commit in
fresh contexts using the same source, policy, host, model and reasoning effort.

For a stage probe, give the orchestrator only one object from
`concurrency-inputs.json`, the installed workflow/contract and that object's
adapter instructions. Ask for its next scheduling decision. The listed tasks
are already justified independent assignments with resolved models and neutral
packets; do not rerun applicability planning. These are controlled scheduling
states, not real worker receipts, source evidence or completed review coverage.
Do not provide `concurrency-cases.json`, this guide or another probe's output to
the reviewer. The evaluator separately applies the matching checks.

S01/S02 contrast default fan-out with real host capacity; S01/S03 contrast the
default with an explicit user ceiling; S01/S06 distinguish capacity from a quota.
S04/S05 contrast incremental refill with batch-only native tools. S07 preserves
accepted launches under capacity pressure; S08 covers unavailable delegation.
For S05, also observe the next dispatch after all first-batch results arrive.

Record all attempts and raw outputs, actual host/model/effort and tool traces.
Then compare baseline/candidate in a real native host before claiming faster
execution: record launch/completion times, peak active children, result identities,
complete coverage and wall-clock duration. Keep unavailable metrics null, not zero.
No speedup or model-behavior claim follows from the mechanical tests.

Behavioral comparison: NOT RUN. Native Codex/Cursor/Claude/OpenCode model execution
is unavailable in the editing environment. The fixtures are unexecuted probes,
not fabricated passing runs. Mechanical regression checks cover the defining
instructions, identical delivery copies and input/grader isolation only.
