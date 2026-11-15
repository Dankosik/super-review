# Super Review

Super Review is a skill, not an agent runtime. Reviewing a user's source is
read-only; developing this repository permits the requested edits and tests.
Do not confuse those scopes or install the review restrictions as a ban on
maintaining this repository.

## Instruction ownership

Keep review policy in `skills/super-review`: shared judgment and authority in
`references/review-contract.md`, domain decisions in lenses/language contexts,
coordination in `references/workflow.md`, and result fields in `assets/`.
Adapters own native tools, model selection and result collection, not a second
review policy. Version 3 has no custom source-reader or result-store runtime.

`skills/defect-review`, `skills/test-review`, and `skills/perf-review` are
separate read-only skills, each with its own contract, lenses or questions,
roles, and version, and zero runtime cross-dependency. Read
[the family design](docs/review-family.md) before changing boundaries, proof
bars, or roles across the four skills. Keep each skill's criterion strictly
isolated: a defect is not a readability finding, a weak test is not a defect,
slow code is not a defect, and fast code that reads badly is not a performance
finding.

Settle the design before writing instructions, and do not treat a model run as
a step in writing them; a review of a real repository is the maintainer's
choice. Keep instructions short: state the bar and where burdens, bugs, waste,
or test gaps live, and leave out procedure for recording the reviewer's own
work.

In every skill, state what an agent must achieve, not how to do what it can
work out itself (reading a long file in full, searching the code). Spell out a
step only when the agent cannot learn it by looking: a harness limit, the
user's choice, a non-obvious tool gotcha, or a fact about the reviewed project.
Front-load positive targets and pretrained leading words; reserve prohibitions
for hard guardrails paired with what to do instead. Co-locate each concept in
one authoritative place per recipient path, and disclose branch-only reference
behind a context pointer so primary steps stay unburied.

Give a lens a concrete question and a decision that can favor changing or
retaining code. Keep technical preservation constraints, the eight base
questions, stable rule IDs, independent recipients, and configured model
profiles. Repeat guidance only for an independent recipient or a distinct local
implication. Generated install copies are delivery artifacts, not additional
live context.

Use the files relevant to the requested change; do not load the entire reference
library or historical studies for every edit. Tool/role descriptions are
model-visible instructions too. Team references illustrate explicit rules, not
additional authority. Keep evaluator expectations and holdouts out of reviewer
packets and installed skill resources.

## Development and evidence

Edit canonical skills and adapter templates; keep generated copies byte-identical.
Select checks by changed inputs using [CONTRIBUTING.md](CONTRIBUTING.md).
For a changed agent decision, use [the evaluation protocol](evals/README.md) and
only its relevant cases. These are development resources, not review packets.
Reuse successful checks for the same revision/environment rather than repeat
an equivalent suite at each instruction layer. Fix failures caused by this change.

For instruction changes, use [the evaluation entry point](evals/README.md) to
select comparisons and run a bounded improvement cycle, not a generic rewrite.

Add contrasting evaluation inputs for a changed decision, separate from grading
expectations. Mechanical checks establish fixture/package integrity, not model
quality. Record actual model/effort and raw failures as well as successes before
claiming gains. Do not promote an experimental coverage/routing default without
its behavioral comparison; context savings alone are insufficient. Publication, tags, marketplace updates, and review comments need their own
accepted scope. Published `v<version>` tags are immutable; read
[the release rules](CONTRIBUTING.md#release) before tagging, releasing, or
updating marketplace pins.
