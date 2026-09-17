# Frontend technology-depth evaluation

This is a maintainer corpus, not installed review context. Use the
[shared evaluation protocol](../../README.md) and [research decisions](research.md).
Baseline: Super Review 3.2.0, `aa61e8699d27795dad965a14ef153eef26195171`.
The original F01-F20 corpus is unchanged and remains a regression/holdout set.

`packets.md` has 30 independent neutral sections. `cases.json` is evaluator-only:
12 opportunity/retention pairs and six version, missing-source, scope and policy
guards. These are controlled excerpts, not working applications or real host
receipts. Unprovided external implementations remain unavailable. Baseline facts
inside each section are controlled context; no example is an actual Git snapshot.

For a stage probe, pass the packet header and exactly one named section with the
installed contract, matching TypeScript/frontend context, assigned lens and only
its selected profiles. Do not supply the entire packet file, peer outputs, this
README, research or cases.json. Supply team rules only when the case explicitly
selects its controlled policy. The separate grader uses the corresponding case.

Most requests deliberately narrow to one profile. A representation-only or
Tailwind-only result cannot establish all eight base questions. Run broad
multi-owner reviews separately in a real native host before claiming routing,
source acquisition or independent-worker coverage. Include original activation,
policy, evidence and language holdouts when changing their decisions.

An `opportunity` is a source-supported question, not a required recommendation.
Some examples intentionally leave remedy evidence unavailable (for instance the
legacy recovery implementation in D13). Grade the observation and remedy
separately: a scoped gap and a withheld implementation recommendation can be the
right result. Do not reward fabricated compatibility, forced upgrades, changed
fallback/timing contracts or a finding quota. Retention cases still permit a
different, genuinely source-backed clarification.

Compare baseline and candidate in fresh runs with identical source, selected
policy, request, actual model/effort and tool access. Save all outputs, traces and
failed attempts with instruction identity. Inspect allowed scope, candidate
accounting, preservation and actual source/coverage evidence; do not grade by
keyword hits or an agent's self-reported completion. Repetitions and untouched
holdouts are needed before claiming a general quality improvement.

## Authoring evidence

The author verified official primary references on 2026-09-17 and performed a
sequential source/instruction audit. Independent research subagents,
baseline/candidate model comparisons and native-host frontend reviews are
**NOT RUN**: no model-delegation execution tool was available. Model/effort,
latency and token measurements are not measured, not zero.

Local checks on the prepared new files passed: the two Python packet/contrast
integrity tests and Python syntax compilation. The container could not resolve
GitHub for cloning and had no Bun installation; it was not a full checkout.
Whole-repository build/test/typecheck/validate/package results must come from the
PR's GitHub Actions run, not from those local checks. CI results are recorded on
the PR rather than assumed here.

`bun test tests/frontend-depth.test.ts` runs the full standard-library Python
suite in a checkout: packet/grader mapping, contrast coverage, four new profiles'
existing rule ownership and native delivery/isolation. Existing frontend/resource
tests retain full canonical-copy and old-corpus checks. These are mechanical
checks, not evidence that a model found the intended improvements. Fixture code
is never executed; no new dependency, evaluation service or model key is added.
