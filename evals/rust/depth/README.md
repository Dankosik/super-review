# Rust depth: decision contrasts

Maintainer/evaluator material only. Baseline: Super Review 3.2.0 at
`f5a67021bbc54995648fe032d07bccdb88a32fa6` (2026-09-17). This change deepens existing
Rust owners; it does not add rule IDs, mandatory crates, specialized library
profiles, workers or a new routing default. The eight base questions remain.

## What changes, and what already existed

| Decision | Instruction action | Contrasts / retained cases |
| --- | --- | --- |
| Conversion semantics, Borrow versus view, implicit Deref API | Extend Rust api-clarity | RD01-02 |
| Constructor/config/builder and consuming completion | Extend Rust api-clarity | RD03-04 |
| Lifetime relationships, ownership independence, precise captures | Extend Rust api-clarity; retain data-flow safeguards | RD05-06, RD27-28; R01-02, R05-06 |
| Associated output versus chosen parameter, dyn boundary | Concrete abstraction guidance; retain neutral dispatch judgment | RD09-10; R07 |
| Derive bounds and macro-generated public API | Extend Rust abstractions | RD07-08, RD15-16, RD36 |
| Direct enum, useful typestate, ordinary primitives | Existing representation decision needs contrasts, not a rewritten rule | RD11-12; R08 |
| Optional fallible work, effects, error sources | Positive control-flow examples and contextual map_err guidance | RD13-14, RD33-34; R03-04 |
| Module/re-export and conditional organization | Existing change-locality decision retained | RD29-30 |
| Task groups, detachment, cooperative completion, select | Conditional Tokio note for existing owners | RD17-20; R02 |
| Wire representation, derive, alloc and borrowing | Conditional Serde note for existing owners | RD21-22, RD31-32; R08, R10 |
| Static/dynamic CLI grammar and consumer contracts | Conditional clap note for existing owners | RD23-24 |
| Standard/custom HTTP extraction and response mapping | Conditional Axum note for existing owners | RD25-26, RD35 |
| Guard/drop, snapshot, MSRV, generated-context limits | Preserve existing constraints, not a new bug/soundness pass | RD06, RD28, RD36; R05-06, R09-12 |

No absence of a named crate/API was treated as proof that the general lens was
missing. In particular, clone, Box, owned values, explicit match and local mutation
retain their existing neutral treatment. Library notes stay outside the global
aspect catalog and are selected only from the owning crate's source and question.
They do not grant another lens's coverage or revive disabled owner rules.

## Replay and grading

`inputs.json` contains independent neutral packets. Give a reviewer exactly one
`inputs` object, its normal contract, Rust context, assigned lens/profiles and
candidate template from the revision being evaluated. Resolve conditional notes
through that revision's context; do not inject candidate-only notes into baseline.
Never send this README, the input collection, `cases.json`, contrasts or peer
answers to the reviewer. Each packet carries its own manifest and consumer facts.
These are static source snapshots, not repositories to build or macro-expand.
Some supporting contracts are stated fixture facts; they are not measured evidence
from real applications. The unavailable workspace/macro context in RD36 is deliberate.

`cases.json` is evaluator-only. Its contrasts need not form disjoint pairs: RD26
also contrasts with response consolidation in RD35, and RD15 with missing macro
context in RD36. Grade source-supported reading burden separately from the remedy,
compatibility and uncertainty. A different clear supported remedy is valid; method
names or keyword counts do not score an answer. Count unsupported churn, missed
useful improvements, preservation failures, forbidden actions and evidence gaps.
Do not demand a finding from every nominally useful-change input.

Use fresh baseline/candidate contexts with identical actual model, effort, source,
policy, tools and scope; vary order and retain failures as well as successes.
Record real identities, outputs and traces under the parent evaluation protocol.
Keep R01-R12 and the existing quality-judgment packets as unchanged regression
inputs. Do not claim a quality gain from structural fixture tests or a single run.

## Evidence status

Behavioral baseline/candidate comparison: **NOT RUN**. Independent agents were not
available during this authoring session; no model outputs, scores or native task
receipts have been invented. This is a source-backed instruction change with
contrasting inputs, not a measured recommendation-quality improvement.

Local Bun build/test/typecheck/validate/package: **NOT RUN**; Bun is unavailable,
and a public Git clone attempt failed because the shell could not resolve GitHub.
The existing CI gate remains authoritative for full repository/package validation.
The added Python integrity test passed locally: 5 tests, 0 failures, using
`python3 -m unittest discover -s tests -p rust_depth_test.py`. Unchanged rule/lens
context was reconstructed from pinned connector reads and checked by Git blob
identity; this was a partial workspace, not a full repository build. A small Bun
wrapper invokes this test in CI. It checks fixtures and selected delivery identities only;
it does not compile Rust, execute reviewed snippets, build scripts or macros.

Canonical edits are applied once. The three generated skill payloads use the same
Git subtree as the canonical skill, matching the copy operation in scripts/build.ts;
unchanged package content remains on the baseline tree. No release/version or
marketplace change is included. Sources and version limits are in [sources.md](sources.md).
