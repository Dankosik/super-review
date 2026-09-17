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

The addition was mechanically checked in GitHub Actions with `bun run build`,
`bun test`, `bun run typecheck`, `bun run validate`, and `bun run package`. The
existing PR validation workflow records native integration checks for the final
head. Canonical policy and generated Claude/Codex resources are checked byte for
byte; evaluation inputs and rubrics are not served as installed review resources.
The temporary authoring workflow and helper were removed from the final tree.

Rule identity: `ts.*` is a new namespace. All existing `go.*` IDs remain unchanged;
there is no automatic cross-language rule migration. Function cohesion retains
two independent rule IDs; profiles inherit their stated TS owner rule.

## Contract-depth extension (2026-09-17)

`packets/depth.md` adds TD01-TD27; `depth-cases.json` is evaluator-only. The packet
header establishes the default TS 5.4 and ES2022 baseline. Pass that header with
one selected section and its explicit overrides, including source/artifact roles.
TD08-TD09 and the Zod cases explicitly require TS 5.5+; do not substitute this
repository's development compiler for a fixture's compiler or consumer baseline.
For TD21-TD24 attach dependency-boundaries to the abstractions owner. Other cases
use the rule's owner; do not turn the corpus into additional production agents.

T07 now accepts an explicit or truthiness guard when the supplied input domain
makes their results equivalent. T10 now actually ships a value in source TypeScript
to 4.8 consumers; TD03 contrasts JS/declaration-only distribution. Original stable
case IDs and all rule IDs remain. Retain the original inference, assertions,
independent flags, readonly, Preact and compatibility examples as regression cases.

See [depth audit](depth-audit.md) for instruction ownership, contrasts, primary
sources and the version gates for satisfies, const parameters, NoInfer and inferred
predicates. This authoring material is not installed reviewer context. Run only
the contrasts implicated by a proposed decision and untouched holdouts, following
[the evaluation protocol](../README.md). Supply neither this guide, the audit,
rubrics nor peer outputs to the reviewer. Grade the demonstrated burden and remedy
separately, and accept well-supported alternatives rather than a required spelling.

The existing `tests/resources.test.ts` checks the new packet/case mapping; it does
not execute fixture code or models. The earlier CI paragraph records the original
TS addition, not a pass for this extension. Behavioral baseline/candidate comparison
for this extension is **NOT RUN**. Record actual execution evidence in the PR;
auxiliary checks with another compiler are not fixture-baseline or quality proofs.
