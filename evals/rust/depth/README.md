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

## Template-derived decisions (RD37-RD52)

Baseline: Super Review 3.7.0 at `fc2c605`. The source is the Rust skill set and
repository contract of `Dankosik/rust-service-template-rest` at `230dacac`
(`.agents/skills/rust-*` and the comment and engineering rules in `AGENTS.md`).
A read of those skills against the 3.7.0 Rust lenses found decisions the skills
make that the lenses left unstated or stated in the opposite direction. Only
readability and maintainability decisions were transferred; the skills'
correctness, security, reliability and testing methods stay outside this
product's scope. Template-specific conventions, such as omitting
`#[non_exhaustive]` on workspace types or naming that service's canonical owners,
are team policy for a `SUPER_REVIEW.md`, not defaults.

| Decision | Instruction action | Contrasts |
| --- | --- | --- |
| Comments restating code or stale against it; reasons and product-output docs stay | Rust rationale: removal direction and intra-doc links; replaces "keep accurate existing explanations" | RD37-38 |
| Handwritten general mechanism versus declared dependency, `std` or a new-crate decision | Rust duplication | RD39-40 |
| Local copy of an owner's rule; superseded path, shim or fallback kept alive | Rust change-locality | RD41-42 |
| `From` not `Into`; a plain zero-argument `new` delegating to or from `Default` | Rust api-clarity | RD43-44 |
| Trait existing only for a choreography test double; one-action objects | Rust abstractions | RD45-46 |
| Display-text matching; variants every inspected consumer treats alike | Rust error-expression | RD47-48 |
| Sleep-and-recheck loop over internal state versus an available notification; routing for waiting | Tokio note, control-flow; Rust context routing | RD49-50 |
| Type alias versus newtype; private invariant fields versus getter layers | Rust representation | RD51-52 |

No rule ID, lens, profile, worker or routing default is added. The diff to each
lens is the evidence of the instruction change; behavioral evidence is recorded
under Evidence status.

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

### RD37-RD52 behavioral comparison (2026-11-09)

Fresh-context specialist runs in native Claude Code subagents, model
`claude-sonnet-5-5`, one lens and one packet per run. Baseline resources were
extracted from `fc2c605`; the candidate is this change. Each reviewer received
only its own arm's contract, Rust context, assigned lens/profiles and finding
template plus one packet; never `cases.json`, this README or peer outputs. The
maintainer graded final outputs against `cases.json` without blinding. Raw
outputs are in [results/2026-11-09-template-skills](results/2026-11-09-template-skills/).

Round 1 ran every positive input in both arms and every retain contrast in the
candidate. A fresh independent maintainer audit of the diff then found rules that
leaned toward bug prevention (`#[must_use]`, help-as-error), wording that
contradicted existing retain conditions, and three inputs whose expectations
rewarded reporting a defect (RD39 offsets, RD43 differing limits, RD51 swapped
arguments). Those rules were removed or narrowed, the inputs rewritten as
behavior-preserving burdens, and every affected run repeated in round 2. Round 2
supersedes round 1 for RD37, RD39, RD43, RD44, RD47, RD48, RD51 and RD52.

| Input | Baseline 3.7.0 | Candidate (final) |
| --- | --- | --- |
| RD37 restating and stale comments | Found both (r2) | Found both (r2) |
| RD39 handwritten RFC 3339 parser | Found (r2) | Found (r2) |
| RD41 copied retry rule, unused legacy parser | Found both (r1) | Found both (r1) |
| RD43 `Into` impl, duplicated `new`/`Default` | Found both (r2) | Found both (r2) |
| RD45 mock-only trait, one-action manager | Manager only; trait kept as a test seam (r1) | Both (r1) |
| RD47 Display-text matching, undistinguished variants | Display matching only (r1) | Both; merge offered as optional (r2) |
| RD49 sleep-and-recheck readiness loop | No candidate (r1) | Found, after the routing fix below (r1) |
| RD51 identifier aliases, getter layer | Aliases only (r2) | Both (r2) |
| RD38, 40, 42, 46, 50 retain contrasts | Not run | Retained (r1) |
| RD44, 48, 52 retain contrasts | Not run | Retained (r2) |

Result: four positive inputs improved, four tied, none regressed, and no retain
contrast produced a candidate. The 3.7.0 lenses already produced the comment,
parser, copied-rule and conversion findings, so those additions mainly make
existing behavior explicit and keep it stable. The first RD49 candidate run
found nothing because the Rust context routed only task groups, shutdown and
selection to the Tokio note that held the new guidance; the routing row now
includes waiting for a condition.

Limits: one run per arm and input, one model, nonblind grading by the author of
the change, baseline retain contrasts not run, and authored fixtures rather than
real changes. This shows the new decisions are reachable without false positives
on their contrasts; it is not a measured general quality gain.
