# Evaluating Test Review

Maintainer material, not installed review context. Nothing here is packaged
with the skill or given to a specialist.

Fixture checks in `tests/test-review.test.ts` verify delivery copies, role
tools and instruction integrity. They cannot show that a specialist chooses
mutants worth considering, finds every test that reaches the code, or states
a fair witness. That needs a review of a real repository, with someone who
checks each mutant and witness against the tests.

Record every such review under `results/`, including the ones that went
wrong: target and revision, how specialists were launched, actual model and
effort, mutants considered, caught and not caught per question, every
candidate with its disposition, failures of the instructions themselves, and
what was not exercised.

The record dated 2026-11-10 and the patches under `reproductions/` are from
the 0.1.0 design, which applied mutants and ran the tests. They are the one
place where this review's reading can be compared with observed runs. The
current design only reads; see `docs/review-family.md`.
