# Super Review

Super Review is a skill family, not an agent runtime. Reviewing a user's source
is strictly read-only; maintaining this repository permits the requested edits,
builds, and tests. Never confuse those scopes.

## Instruction ownership

- **Super Review (`skills/super-review`):** shared judgment and authority live
  in `references/review-contract.md`, domain decisions in `references/lenses/`
  and `references/languages/`, orchestration in `references/workflow.md`,
  synthesis in `references/verification.md`, and output fields in `assets/`.
- **Sibling skills (`skills/defect-review`, `skills/test-review`, `skills/perf-review`):**
  separate read-only skills, each with its own contract, lenses or questions,
  roles, and version, and zero runtime cross-dependency. Read
  [the family design](docs/review-family.md) before changing boundaries, proof
  bars, or roles across the four skills. Keep criteria strictly isolated: a
  defect is not readability, a weak test is not a defect, slow code is not a
  defect, and fast code that reads badly is not a performance finding.
- **Adapters (`adapters/`):** own native tool allowlists, model selection, and
  result collection, never a second review policy. Version 3 ships no custom
  source-reader or result-store runtime. Generated trees under `adapters/*/plugin`
  and `adapters/codex/super-review` are delivery copies, not live authoring
  targets.
- **Protected invariants:** preserve technical equivalence constraints, the
  eight base Super Review lenses, all 56 stable rule IDs, fresh-context
  subagent isolation, and configured worker model profiles unless the user
  explicitly scopes a migration. Tool and role `description` fields are
  model-visible instructions. Team code references illustrate explicit rules,
  not extra authority. Keep evaluator expectations and holdouts out of reviewer
  packets and installed skill resources.

## Writing instructions for agents

Every file an agent reads (`SKILL.md`, contracts, lenses, workflows, adapter
roles, `AGENTS.md`) is governed by the same levers so the agent runs a
predictable process without wasting attention:

- **Two loads and invocation:** always-loaded text (`AGENTS.md`, model-invoked
  descriptions, base contracts) spends *context load* on every turn; explicit
  slash skills spend *cognitive load* so the human chooses when they fire. All
  four review skills are user-invoked (`disable-model-invocation: true`,
  `allow_implicit_invocation: false` in `agents/openai.yaml`): keep trigger
  descriptions single-sentence and human-facing (adding an explicit-request
  gate only where a host lacks `disable-model-invocation`). Because user-invoked
  skills cannot invoke one another, shared maintainer rationale belongs in
  `docs/`, never as cross-skill runtime links.
- **Context pointers:** a link's *wording*, not its target file, decides when
  an agent loads it. Front-load the leading term, state what the target holds,
  give one trigger per genuine branch (collapse synonyms), and cut identity the
  target already states. When an agent misses a required resource, sharpen the
  pointer before inlining the file.
- **Information hierarchy and progressive disclosure:** rank content as
  (1) *in-file steps* (ordered actions), (2) *in-file reference* (flat rules
  used on every run of that role), and (3) *disclosed reference* behind a
  pointer. Inline what every run of that recipient needs; push branch-only
  material (`harnesses/*.md`, `#compact-pairs`, conditional profiles,
  `continuation.md`) behind pointers so primary steps stay unburied.
- **Co-location against sprawl:** keep each concept's positive target, decision
  rule, and `Keep when` preservation caveats under one heading in one
  authoritative place per recipient path. Scattering fragments one rule across
  files; duplication repeats it and inflates its weight. Repeat a rule only for
  an independent fresh-context recipient that never loads the other file, or
  for a distinct language-specific edge.
- **Checkable, exhaustive completion criteria:** visible later steps pull
  agents toward *premature completion*. Resist that pull with binary *clarity*
  (pinned SHAs, quoted lines, a survived challenge, mutant + witness, before
  and after counts) and high *demand* ("every included declaration read in
  full", "every hot path checked against Expect", "every reaching test
  accounted for"). High demand drives *legwork* without spelling out micro-steps.
  Split phases across real context boundaries (fresh subagent windows, never
  conversation forks; keep orchestrator verification and report templates out
  of worker packets).
- **Pretrained leading words and positive targets:** anchor behavior with
  compact terms already strong in pretraining (*Design It Twice*, *Shotgun
  Surgery*, *load-bearing*, *seam*, *mutant*, *witness*, *hot path*, *Amdahl's
  law*), repeated as exact tokens rather than re-explained in paraphrases.
  Front-load the positive target; steering by negation activates the forbidden
  behavior. Write flat rules as `**Leading term**: burden -> target`, and use
  no em-dashes in prose (rewrite with a colon, comma, period, parentheses, or
  conjunction). Reserve `Never` for hard read-only, safety, or isolation
  guardrails, paired immediately with what to do instead.
- **Environment over cache, and ruthless no-op pruning:** never restate what one
  lookup in the environment reveals (manifests, directory layout, tool schemas)
  or how to do what a strong model already does (reading a long file in full,
  searching callers, recording its own work). Spell out only what looking cannot
  reveal: a harness limit, user choice, non-obvious tool gotcha, or project
  boundary. Test every sentence against the model's default: if deleting it
  changes no behavior, delete the whole sentence rather than trimming words;
  never cut load-bearing constraints to chase length. When a real run exposes a
  miss, generalize to the class of failure instead of accreting repo-specific
  sediment.

## Development, evaluation, and release

Settle the design before writing prose, and do not treat a model run as a
drafting step; running a review on a real repository is the maintainer's choice.
Load only the files relevant to the requested edit rather than the full
reference library or historical studies.

Edit canonical skills and adapter templates, rebuild generated packages, and
select checks by changed inputs in [CONTRIBUTING.md](CONTRIBUTING.md). When
changing an agent decision, follow [the evaluation protocol](evals/README.md):
run a bounded improvement cycle, pair each changed decision with contrasting
report/retain inputs isolated from grading expectations, and record actual
model/effort and raw failures alongside successes. Mechanical tests prove
package and fixture integrity, never model judgment; do not promote experimental
routing or pairing defaults on token savings alone.

Publication, tags, marketplace pins, local tool installs, and PR comments each
require explicit user scope. Published `v<version>` tags are immutable; follow
[the release rules](CONTRIBUTING.md#release) before tagging, releasing, or
updating marketplace pins.
