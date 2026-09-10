# TypeScript review evaluation

These contrasts exercise language judgment separately from mechanical integration.
`packets/contrasts.md` contains reviewer inputs; `cases.json` contains evaluator-only
expectations. Give a reviewer only its selected raw section, the shared contract,
TypeScript context, the assigned TS lens, and selected profiles. Supply neutral
pinned-source labels through the same harness protocol used for Go evaluations.
Never put the rubric or a previous reviewer's answer into a specialist packet.

Grade whether the reviewer identifies the concrete maintenance burden, considers
the keep alternative, and preserves the implicated runtime/type contract. An
accepted change needs evidence, not just the expected label; wording is not fixed.
A retain case may still yield a different well-supported observation. Record raw
reports, model/effort, instruction revision, tool limits, coverage, false positives,
and dispositions. Do not infer recommendation quality from token count or latency.

Status: behavioral evaluation has not been run for these new instructions. The
Bun tests check source boundaries, stable IDs, routing, resource delivery, and case
integrity only; they do not prove that a model reaches the expected judgments.
No new model, dependency, benchmark service, or review-time execution is required.

Rule identity: `ts.*` is a new namespace. All existing `go.*` IDs remain unchanged;
there is no automatic cross-language rule migration. Function cohesion retains
two independent rule IDs; profiles inherit their stated TS owner rule.
