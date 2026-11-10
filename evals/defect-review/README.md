# Evaluating Defect Review

Maintainer material, not installed review context. Nothing here is packaged
with the skill or given to a reader.

Fixture checks in `tests/defect-review.test.ts` verify delivery copies, role
tools and instruction integrity. They cannot show that a reader finds a bug
or that a trace holds. That needs a review of a real repository, with someone
who opens each trace's lines.

Record every such review under `results/`, including the ones that went
wrong: target and revision, how readers and challengers were launched, actual
model and effort, every candidate with its disposition, the challenger's
verdicts, failures of the instructions themselves, and what was not
exercised.

A repository whose known defects the instruction author had already seen is
not a held-out test. Say so in the record.

The record dated 2026-11-10 and the patches under `reproductions/` are from
the 0.1.0 design, which built the project and ran tests. The current design
only reads; see `docs/review-family.md`. A review of a real repository is the
maintainer's choice after a design change, not a step in writing
instructions.
