# Specialist result

Return compact Markdown: one task header, then candidate blocks. Common fields
apply to every candidate; do not repeat them per block. Keep this header attached
when forwarding a candidate, or include its identity when the block travels alone.

## Task result: <task ID>

- Snapshot: PR, B/H/D, issued receipt reference.
- Instructions: version and trusted package revision/resource digest when exposed,
  or `content identity unverified`, under the contract's instruction-identity rules.
- Assignment: lens, selected profiles, exact scope and effective policy references.
- Status: `completed`, `not applicable`, or `unfinished`; adapter enums keep their
  native spelling. For non-applicability give a structural reason.
- Inspected evidence: verified paths/revisions, complete symbols and relevant uses.
- Coverage: base/profile results, actual completed subcoverage, and missing required
  evidence/capability. A profile-only task is not a full owner pass.
- New applicability signals: aspect, path/symbol, observed fact and missing question,
  or `none`. Signals are not findings or completed checks.

With no candidates, state that explicitly after the header. Missing required
coverage remains `unfinished`, never an empty clean result.

## C-<task>-<number>: <concrete observation>

- Change anchor: path, symbol, verified H lines; how D..H introduces, worsens, or
  makes the burden relevant. Distinguish supporting unchanged context.
- Basis: effective rule IDs and contributing profiles; identify convention-only advice.
- Observation: source evidence and concrete reading/maintenance cost. State what is
  established; an unsupported suspicion does not qualify.
- Remedy: supported improvement, or `unresolved` with the exact missing evidence
  or decision. Distinguish unavailable facts from a remaining tradeoff between
  supported alternatives; do not invent a source gap or a remedy. For a proposal,
  show how an actual declaration/use becomes clearer, the remaining tradeoff,
  and the strongest source-supported keep alternative. Scale explanation to the change.
- Preserve: relevant contracts/effects and constraints implicated by the proposal;
  identify what is known versus still unverified. Do not invent a remedy to fill fields.
- Affected files: verified paths and real dependencies; distinguish inspected from
  still-needed consumer context. Use `none` for remaining gaps only when warranted.

Prefer verified paths/symbols to guessed lines. A small before/after example can
clarify a supported change; a full patch is unnecessary. Explain evidence and
tradeoffs, not a reasoning transcript or checklist score. Only the orchestrator
accepts implementation recommendations; unresolved observations remain visible
without becoming instructions to implement.
