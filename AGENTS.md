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

`skills/defect-review` and `skills/test-review` are separate skills, each
with its own contract, lenses or questions, roles and version.
Defect Review hunts bugs with independent readers and an independent
challenge; Test Review asks whether the tests would fail if a plausible bug
appeared. Like Super Review, both only read: no role clones, copies, builds
or runs the reviewed project or holds a tool for writing files, and a
finding is proven by a trace through quoted lines.
[The family design](docs/review-family.md) records why. No skill depends on
another at run time. Do not let one skill's criterion into another: a defect
is not a readability finding, and a weak test is not a defect.

`skills/perf-review` is a third such skill. Performance Review finds work a
Rust hot path does not need: a finding shows why the path runs often, traces
the work for one unit through quoted lines, gives a cheaper form with the
same behavior and names the resource it saves, and survives an independent
challenge. It reads only, like the others; a profile or benchmark output the
user supplies is evidence, and measuring a change is left to whoever applies
it. Slow code is not a defect, and fast code that reads badly is not a
performance finding.

For these three skills, settle the design before writing instructions, and do
not treat a model run as a step in writing them. Keep them short: state the
bar and where bugs or gaps live, and leave out procedure for recording the
reviewer's own work. A review of a real
repository is the maintainer's choice.

Give a lens a concrete question and a decision that can favor changing or
retaining code. Keep technical preservation constraints, the eight base
questions, stable rule IDs, independent recipients and configured model profiles.
Repeat guidance only for an independent recipient or a distinct local implication.
Generated install copies are delivery artifacts, not additional live context.

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
its behavioral comparison; context savings alone are insufficient. Publication,
tags, marketplace updates and review comments need their own accepted scope.

An accepted release ends at pushing the `v<version>` tag on the merged main
commit: the `release` job in `.github/workflows/validate.yml` packages that tag
and creates the GitHub release itself, and fails if one already exists. Releases
are immutable: a tag whose release was published once can never carry another,
even after that release is deleted, so a broken release needs a new version. Wait for
that job, then pin the tag and its commit in the marketplace's `catalog.json`
as [CONTRIBUTING.md](CONTRIBUTING.md) describes.
