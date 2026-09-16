# Super Review instruction audit

Audited base: `9705bc7c5371dba7873bb85a09e0ed38f50c308d` (version 3.0.0).
Candidate: 3.0.1, **unreleased**. This is a static instruction/workflow audit;
model comparisons for this candidate are **NOT RUN**.

## Basis and scope

[OpenAI's September 11 article](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra)
recommends precise skill activation, contextual resource loading and explicit
completion boundaries, while considering the different models consuming shared
instructions. For this project, these ideas support correcting scope ambiguity,
not removing the independent review that the product promises.

Inspected the core skill, shared contract/workflow, aspect and language routing,
Go/TypeScript/Rust contexts, native source/host instructions, role and launch
prompts, result templates, maintenance guidance, native generation/validation,
current evaluation structure and relevant historical design decisions. This is
not a fresh validation of every language guideline, a review of target application
correctness, or a model-quality evaluation. Domain lenses/profiles and all 33
rule IDs are preserved rather than rewritten without a specific finding.

## Main conclusion

Version 3 already has a compact explicit entry point, selective domain resources,
independent one-lens specialists, source-backed acceptance, neutral task packets
and native completion tools. It removed the custom MCP runtime. These are useful
product boundaries, not redundant scaffolding to delete. Generated Claude/Codex
copies are separate deliveries, not instructions simultaneously loaded into one
context. Do not optimize their aggregate byte count as though it were prompt cost.

Keep the eight base questions, contextual applicability, full preliminary
reading of included declarations, distinct candidate/coverage states, complete
accepted recommendations and configured model profiles. No new language, runtime,
permission, role or mandatory stage is introduced.

## Findings and implemented corrections

### 1. Launch does not always mean review

The original core and Claude entry combine help with missing-target handling,
asking for a target even when the user only wants usage. Adapter instructions
also lead directly into source acquisition. Separate help from an actual review:
explain help without reading source or spawning specialists; reuse an identifiable
target from the active request/context; ask only for a genuinely missing target.
The adapters follow that branch before their acquisition/delegation mechanics.
Explicit invocation remains required and available models/tools are unchanged.

### 2. Stage-local instructions, not a reduced review

Make SKILL.md the launch/phase router. The contract and workflow still govern an
actual review, including team-policy resolution before delegation. Verification
belongs to candidate decisions; report formatting belongs to delivery. Each child
still receives its independent complete contract, language context, lens and
selected profiles. Paths, partial excerpts and summaries are not full evidence.

Move supported compaction/handoff guidance into `references/continuation.md`,
linked only for that event. Preserve source/instruction identity, policy, task
results, dispositions, evidence availability and the prohibition on invented
persistence or recovery writes in reviewed source. No recovery daemon is added.

### 3. Optional policy absence is not failed access

The original team-rule entry immediately says to load root SUPER_REVIEW.md, but
does not state what confirmed absence means. Explicitly use defaults when the
root is confirmed absent at an accessible pinned policy revision. Do not require
a policy file for every project. Failed reads, an inaccessible revision and an
incomplete inventory remain policy gaps, not implicit permission to use defaults.

Keep explicit source selection, linked-policy validation, action scopes, conflicts,
rule namespaces and optional code-reference semantics unchanged. A proposed PR or
working-tree policy cannot silently govern its own review. No fallback to another
instruction filename or arbitrary repository habit is introduced.

### 4. Complete the plan; do not manufacture a clean result

Clarify the ambiguous sentence about a missing response: it is unfinished, never
a clean result. Continue the authorized plan after a first batch without another
approval round. A completed child is not completion of the whole declared plan.
Recover full results through native facilities before declaring them unavailable;
then report a concrete partial outcome rather than wait for a known impossible
result or simulate independent coverage. Pending recoverable work still needs
collection. Zero accepted findings is not a reason for another complete pass.

### 5. Report information rather than empty scaffolding

The report template is an information contract. Identity, policy, coverage,
limitations and every candidate disposition remain required. All accepted and
merged contributions remain present; there is no top-N cap. Empty file maps,
recommendation lists and implementation-order tables add nothing when there are
no accepted changes. Omit or combine empty sections without dropping their
substantive information. Unresolved observations are not implementation tasks.
The acceptance bar and source-supported preservation constraints are unchanged.

### 6. Maintain the native-only product through canonical sources

AGENTS.md still refers to source-reader changes after version 3 removed that
runtime. Align maintenance guidance with canonical skill/adapter edits, existing
Bun tests, type checks, validation and packaging. Distinguish this authorized
repository development from execution of code under a Super Review assignment.
Keep experimental changes separately evaluated and no release implied by a PR.

Make plugin metadata describe the already supported PR, local-change and explicit
whole-project scope instead of implying a PR containing all three languages.
Version 3.0.1 records these as behavior corrections within existing contracts.
The lockfile, dependencies, native models, shell permissions and CI are unchanged.

## Deliberately not changed

The [historical design record](prompt-context-design.md) explicitly separates
routing-first preparation from the production pre-read of full declarations.
It requires behavioral comparison before promotion. This audit does not promote
that experiment on the strength of an article or projected token savings.

Nor does it replace specialists with one generic pass, drop base questions for a
small diff, weaken compatibility preservation, turn bugs into maintainability
findings, add review execution/tests, merge the unrelated Java support PR, change
model defaults, or restore a plugin-owned source/result store. Parent verification
and cross-lens reconciliation are product work, not a generic self-check loop.

## File dispositions

| Area | Disposition |
| --- | --- |
| AGENTS.md / CONTRIBUTING.md | Align maintenance checks, canonical ownership and explicit publication scope. |
| Core SKILL.md | Precise explicit trigger, help/target branch, phase-local navigation and completion. |
| review-contract.md | Disambiguate missing-response status; preserve scope and judgment. |
| workflow.md / continuation.md | Keep coverage/pre-reading; clarify completion and move conditional handoff material. |
| team-rules.md | Define absent versus unavailable root policy without changing overrides. |
| report-template.md | Permit empty-section omission while retaining all substantive records. |
| Codex/Claude host references and Claude/OpenCode launch roles | Honor launch branch; preserve model, effort, native tools and independence. |
| Specialist roles, finding template, language contexts, aspect routing, lenses/profiles | Retain existing contracts; no new language judgments or rule IDs. |
| Source access and verification references | Retain pinned-source acquisition and source-backed acceptance. |
| package/plugin metadata, README, changelog | Prepare unreleased identity and accurately describe existing scope. |
| Native delivery trees | Synchronize only from corresponding canonical bytes. |
| New evaluator files and integrity tests | Separate neutral inputs, byte identities and grader expectations. |

## Evidence and evaluation

[The new evaluator suite](https://github.com/Dankosik/super-review/tree/main/evals/instruction-boundaries)
contains twelve paired stage inputs and four small byte-pinned source/policy files,
with expectations kept outside packets and runtime resources. Tests check case
mapping, contrast membership, source identity and evaluator isolation. Controlled
availability facts are stage fixtures, not observed GitHub or host behavior.

Compare the pinned base and candidate with identical host/model/effort/source
conditions; keep existing language judgment cases and untouched holdouts. Do not
attribute a token reduction to better recommendations. No model run or latency
improvement is claimed here. Record observed CI separately: package/fixture tests
do not validate model decisions. The new audit is optional author documentation;
evaluation packets/expectations are not shipped as reviewer instructions.
