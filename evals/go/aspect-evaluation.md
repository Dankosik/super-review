# Contextual aspect evaluation

Status: **proposed; not executed**. No model-backed result, quality score,
routing recall, cost saving, or completed native review is claimed here.

`aspect-cases.json` holds evaluator-only expectations; `packets/aspects.md` holds
raw inputs. J01-J12 are six change/retain pairs for representation, rationale,
lifecycle ownership, dependency boundaries, effects separation, and error
expression. J13 checks unknown rationale. R01-R11 exercise selection, explicit
scope, missing evidence, late signals, policy, reporting, keyword false positives,
and a correctness-only candidate. Keep these alongside existing cases.

## Separate three questions

**Judgment:** give a fresh reviewer the requested owner lens, selected profile,
contract, Go context, candidate format, and only the chosen raw source section.
Do not give expected outcomes or the contrasting case unless referenced facts
are needed. Evaluate whether the proposed change reduces a concrete maintenance
burden, whether clear code is retained, and whether preserved contracts and
counterarguments are grounded. Reward neither finding count nor always saying
nothing. Expected transformations are examples; equivalent well-supported
choices are acceptable.

**Routing:** give a fresh orchestrator the workflow, catalog, trusted policy,
user request, and the raw scenario. Judge the complete plan, not just module
names: source-anchored applicability, retained base questions, correct profile
owners, lazy resource loading, scope, and honest omissions. Distinguish missed
applicable questions from reasonable non-applicability. A trigger is not a
required finding. Test failed continuations and later signals separately from
successful first-pass selection. Expected answers do not belong in task prompts.

**End-to-end:** compare the baseline at
`a72e3e8fe678e06cf728114895b6f397c46ab736` with the candidate's actual commit/hash
on the same authorized pinned Go PRs, model, effort, source access, and budget.
Include a meaningful refactoring opportunity and a clear-code PR. Repeat runs
where feasible and report disagreements; blind the evaluator to version labels
where possible. Keep unabridged results and input identities, subject to privacy.

Record additional useful accepted changes, unjustified churn, missed applicable
aspects, contradictory/duplicate handoffs, scope violations, actual tool calls,
tokens, and wall time. Compare net benefit against added review cost; do not infer
universal gains from these synthetic examples. Older skill versions do not own
the new names: compare their default review for end-to-end baselines rather than
pretend they implement a missing profile.

Mechanical tests check catalog/resource wiring, rule ownership, exact installed
payloads, and fixture integrity. They do not score model judgment or exercise
semantic routing. Record any actual future behavioral run with model/harness,
exact skill revision and inputs, raw output, evaluation decisions, and limitations
in `docs/validation.md`. Preserve failed and partial runs instead of relabeling
them clean. No new hosted evaluator, model credential, or persistent CI service
is required by this change.
