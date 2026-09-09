# Context follow-up comparison

Status: **proposed; model-backed evaluation not executed**. This suite supplements
the 18 [prompt/context stages](prompt-context-evaluation.md); it does not replace
them or count their fixture preparation as successful model runs.

## Controlled comparisons

| Comparison | Control | Candidate | Question |
| --- | --- | --- | --- |
| A | `0592ee207d34b32c4ef451ad09f6aeeabacce20f` | `e2d9e65c021c02fefd0f04e90c84f0acff3667d8` | Do PR #4's result/context changes improve the original workflow? |
| B | `e2d9e65c021c02fefd0f04e90c84f0acff3667d8` | Exact follow-up PR checkout | Do the provenance, reference and decision clarifications help? |
| C | Exact follow-up PR checkout | Same checkout with only the routing replacement below | Does less preliminary reading preserve routing and recommendation quality? |
| D | Fixed written team rule without illustration | Same rule with a relevant optional B illustration | Does the example communicate the intended convention without expanding it? |

Record the actual candidate commit with `git rev-parse HEAD` and hash the exact
resources delivered to each role; do not use a moving branch name or SemVer alone.
These are instruction-checkout identities, separate from reviewed PR B/H/D.
Freeze models, effort, source availability, permissions, scope and concurrency.
Randomize control/candidate order and blind labels for graders. Do not attribute
combined A/B changes to routing; compare C separately after inspecting A and B.

The [routing replacement](experiments/routing-first.json) is evaluator-only. In an
isolated **instruction** checkout, require `before` to occur exactly once in `target`,
replace it with `after`, and change nothing else. Regenerate native instruction
copies with the existing build when testing an installed adapter. Do not apply this
patch to the reviewed source or load the experiment JSON/expectations into reviewer
context. The production workflow remains unchanged until this experiment is assessed.

## Inputs and isolation

`context-followup-cases.json` is evaluator-only. Supply one C-section from
`packets/context-followup.md`, actual complete installed role resources and only
its `initial_source`. Resolve all source paths relative to the repository root.
Every source entry carries B or H; preserve that label when delivering the text.
`available_source` is retrievable through authorized fixture read tools, not preloaded.
C04 deliberately offers H but not B; supplying the H text as B invalidates the case.
C01 must receive two real differing instruction blocks from the control/candidate
checkouts, not just a claim that the texts differ. C02 must receive the actual full
resources from one trusted delivery, with revision/digest metadata withheld.
The evaluator may use the checkout identity to grade these scenarios but must not
invent production receipts or supply an answer through the task framing.

C05 is an isolated verification stage with its consumer-equivalence facts stipulated;
it tests choice handling, not acquisition or proof of equivalence. C01/C02 test
instruction identity, C03/C04 reference boundaries, C05/C06 choice versus source gaps,
and C07/C08 routing with available versus unavailable evidence. Four contrast pairs
are diagnostic comparisons, not interchangeable end-to-end PRs.

Use the existing authorized harness and fixture-capable read access. If real read,
spawn or result traces cannot be collected, mark those checks unexecuted rather than
claiming a written plan proves execution. Do not add a model client, credential,
hosted evaluation service, CI workflow or new production review permission.

## End-to-end evidence and promotion

Run the original instruction-quality, aspect, Go-idiom and prompt/context suites
for regression. Include one authorized clear-code PR and one with realistic cross-file
opportunities under the same pinned sources. Keep additional PRs outside prompt
editing as untouched holdouts; published C-cases are development inputs, not holdouts.
No real PR or permission is invented by this document; record the selected authorized
PRs and B/H/D when a run is actually made.

Judge useful accepted transformations, missed labeled opportunities, unnecessary
churn, coherent coding-agent handoff and truthful coverage separately. An empty
report must fail positive cases; candidate count and unresolved count are not quality
scores. Allow distinct defensible remedies and justified retention. Specifically
inspect missed contextual aspects before promoting the routing-only variant.

Record repeated reads, actual child tasks, tool calls, peak context, cumulative
input, cached input, output, wall time and resource-delivery overhead separately.
Retain raw outputs and partial/failed attempts. Use repeated matched runs for variable
outcomes; report sample size and disagreements, not a manufactured composite score
or a percentage gain from one trial. A lower-cost result with missed required work
is not a successful optimization. Ordinary CI remains mechanical evidence only.

## Preparation record — 2026-09-10

Eight new stage inputs, revision-aware source setup, four contrast pairs and an
exact routing-only replacement were prepared. They are not eight successful runs.
No Codex, Claude or OpenCode executable is present in this editing environment;
no connected general model-evaluation executor was found. Model-backed A/B tests,
native retrieval traces and real-PR holdouts therefore remain **unexecuted**.
No model-quality, recall, latency or token-saving gain is claimed.

Mechanical validation is recorded in the follow-up PR and its existing GitHub
Checks. It must not be substituted for the missing behavioral comparison.
