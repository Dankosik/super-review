# Frontend contrast evaluations

Maintainer-only resources. Read the [shared evaluation protocol](../README.md).
[Research](research.md) explains the source-backed integration decisions.

`inputs.json` contains 20 independent neutral input objects. `cases.json` contains
separate evaluator-only expectations: seven improvement/retention pairs and six
scope, detection, consumer-version, configuration, missing-source and policy guards.
Source snippets are text fixtures, not executed applications, Git commits or native
worker outputs. Each file has a real SHA-256 of its UTF-8 contents; fixture snapshot
labels are deliberately not Git SHAs. F19 explicitly selects its supplied target
policy; do not generalize that exception to untrusted proposed PR policy.

For a stage probe, supply only one input object and its requested installed
contract, TypeScript/frontend context, lens and selected owner profiles. Do not
supply other cases, `cases.json`, this guide or research. The task is to review the
supplied declarations or make a scope/routing decision, not fabricate delegation
receipts. Most inputs intentionally narrow to a profile: they cannot establish a
full eight-lens review. A broad review remains subject to all existing base lenses.

Compare the pinned baseline with the candidate in fresh runs using identical input,
team policy, host, actual model/effort and tool access. Save every raw response,
trace, instruction revision and failure; unavailable metrics are null, not zero.
Grade observation and remedy separately. Improvement cases invite the indicated
source-grounded opportunity, not a finding quota; a supported alternative or a
well-evidenced retention decision needs adjudication, not automatic rejection.
Retention cases catch unsupported framework churn, not every possible clarification.

Then run realistic end-to-end frontend reviews in the supported native adapters
with source acquisition and independent task identities. Keep original activation,
evidence and untouched language holdouts. Stage fixtures cannot prove actual
parallelism, source coverage, latency, model compliance or quality improvement.

| Evidence | Status for this authoring pass |
| --- | --- |
| Independent research subagents | NOT RUN: execution capability unavailable; sequential author analysis only. |
| Baseline/candidate model comparisons | NOT RUN: no authorized model-execution tool available. |
| Native-host frontend review | NOT RUN: no native agent host available. |
| Fixture/resource integrity | Run `python3 tests/frontend_integrity_test.py` or `bun test tests/frontend.test.ts`; these checks do not execute source or a model. |

The Python suite uses only the standard library already required for packaging.
The Bun wrapper integrates it into existing CI without a new service or dependency.
The suite checks profile ownership, routing, relative links in the added resources,
source hashes, contrasting coverage and byte-identical native delivery. It also
checks that evaluation data is not installed. Full package/TypeScript/CI validation
remains governed by CONTRIBUTING; do not infer those results from this suite.
