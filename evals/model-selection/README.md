# Model-selection evidence

See [the study](../../docs/model-study.md) for conditions, judgments, and limits.
`cases.json` contains raw input; `rubric.json` is evaluator-only. The prompts
freeze the 1.1.0 policy used by the screen. `results/` contains original replies
and reported usage, not full session logs. `blind-mapping.json` records the
randomized labels used by the independent evaluator.

To reproduce the Codex screen with existing Codex authentication, copy this
directory to a scratch location, clear that scratch copy's results, create
`isolated/` there, and run `python3 run-screen.py`. It performs 24 real model
calls using the local Codex CLI; it does not execute the reviewed project.
Auth still follows Codex's `auto` credential store. Do not supply API credentials
or a model client in this script. Timing and token usage can change on rerun.

The live PR trials used native Codex with the installed reader and explicitly
selected worker models. Their final reports, parent/child usage, native model
records, and the final candidate's spawn arguments are retained separately.
The Claude receipt is a synthetic transport/routing test, not model inference.
