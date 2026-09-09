# Candidate format

Return compact Markdown. For no candidates, state `completed`, the task, files
and symbols actually inspected, and any limitations. Missing required evidence
means `unfinished`, not a clean result. Otherwise use one block per candidate:

## C-<task>-<number>: <concrete improvement>

- Lens, selected profiles, and task:
- Snapshot: PR, H, comparison D.
- Change anchor: path, symbol, verified lines at H; how D..H introduces, worsens,
  or makes the burden relevant. Distinguish supporting unchanged context.
- Basis: effective default/team IDs; say when consistency alone is the reason.
- Evidence and cost: inspected declarations/uses and the specific knowledge,
  state tracking, or coordinated editing that burdens the reader or maintainer.
- Transformation and net benefit: the smallest useful change; what becomes
  unnecessary to understand, and any new indirection, concepts, or obligations.
- Keep alternative: the strongest reason to leave the code as it is, and why
  the proposed benefit outweighs it; state an unresolved tradeoff honestly.
- Preserve: relevant contracts, ownership, lifetime, and effect order.
- Affected files: verified paths; local or cross-file, with real dependencies.
- Missing context: required source not yet read, or `none`.

Prefer a verified path and symbol to guessed line numbers. A small before/after
example can clarify the change; a full patch is unnecessary. Suggestions do not
prove equivalence. Explain source evidence, not a checklist score or a narrative
of the review process.

Outside candidate blocks, report selected profile coverage and any newly observed
applicability signal (aspect, path/symbol, fact, missing question). Signals are
not recommendations or evidence that another check was completed. Include these
even when returning no candidates; the parent alone changes the plan.
