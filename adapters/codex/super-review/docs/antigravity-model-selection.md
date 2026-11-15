# Antigravity worker profile: Hydrogen High

Selected on 2026-11-15 for all six specialist/reader/challenger roles:
**Gemini 4 Hydrogen / High**, CLI slug `gemini-4-hydrogen-high`.
The orchestrator keeps the user's selected model and effort.

## Basis and limits of the comparison

Our existing worker profiles are native Claude `sonnet` at `medium` effort and
Codex `gpt-6.1-terra` at `high`. They identify a role in this product, not a
cross-provider intelligence score. Google describes Hydrogen as a fast model
for everyday coding and agentic execution, and Carbon as its larger model for
harder planning and reasoning. Hydrogen is therefore our candidate counterpart
for focused review workers; Carbon need not replace the user's orchestrator.
This mapping is an engineering choice, not a demonstrated equivalence to either
Sonnet or Terra. No comparative review-quality, latency or cost result exists.

High is Hydrogen's documented default reasoning level and the selected profile
for this task. Medium, Low and XHigh are other profiles, not automatic fallbacks.
Google's Orchestrator mode combines a Carbon/Argon planner with Hydrogen work;
selecting it does not establish that a review child runs Hydrogen High.

Official sources checked on 2026-11-15:

- [Hydrogen launch and intended role](https://antigravity.google/blog/gemini-4-hydrogen-in-google-antigravity/).
- [Models, reasoning levels and Orchestrator](https://antigravity.google/docs/models).
- [CLI slugs and model selection](https://antigravity.google/docs/cli/headless/).
- [Custom agent frontmatter](https://antigravity.google/docs/subagents).

## Native probe on CLI 1.5.9

`agy models` completed successfully but returned only Gemini 3.8 Flash effort
variants, Claude Sonnet/Opus 4.6 and GPT-OSS 120B in this local environment.
Hydrogen was absent. This is local availability evidence, not a claim that
Hydrogen is unavailable to every user or plan.

A disposable copy of the plugin was changed only at the specialist's `model`
field from `inherit` to `gemini-4-hydrogen-high`. Strict native validation
rejected it as an invalid model tier, skipped that agent and counted five
remaining agents. No installed plugin or reviewed repository was changed.
This failed attempt rules out pinning the slug in CLI 1.5.9 role frontmatter.

The native role field therefore stays `inherit`. It requests Hydrogen High only
from a parent already selected as Hydrogen High. A different parent needs an
explicit native child model/effort selector; neither documented generic tier
establishes a Hydrogen mapping. Missing selection/availability stops affected
dispatch for an explicit user choice. The adapter does not invent unsupported
fields, switch the parent, or treat model names in prompts as routing.

Raw command outputs are retained under
`evals/antigravity/model-selection/`: `models.output.txt` (combined terminal output) and
`rejected-slug.stdout.json`. These are configuration probes, not model runs.
Actual inference model/effort, task identities and comparative raw reviews are
unavailable: **NOT RUN**. Contrasting stage inputs cover the selection decision;
they do not establish native execution or review quality.
