# Super Review

Super Review is a skill family, not an agent runtime. Reviewing a user's source
is strictly read-only; maintaining this repository permits requested edits,
builds, and tests. Never confuse those scopes.

## Instruction ownership

- **Super Review (`skills/super-review`):** shared judgment lives in
  `references/review-contract.md`, domain decisions in `references/lenses/` and
  `references/languages/`, orchestration in `references/workflow.md`, synthesis
  in `references/verification.md`, and output fields in `assets/`.
- **Sibling skills (`defect-review`, `test-review`, `perf-review`):** separate
  read-only skills with independent contracts, versions, and zero runtime
  cross-dependency. Read [the family design](docs/review-family.md) before
  changing boundaries or proof bars across skills. Keep criteria isolated: a
  defect is not readability, a weak test is not a defect, and slow code is not
  a defect.
- **Adapters (`adapters/`):** own native tool allowlists, model selection, and
  result collection, never a second review policy. Version 3 ships no custom
  runtime. Generated trees under `adapters/*/plugin` and
  `adapters/codex/super-review` are delivery copies, not authoring targets.
- **Protected invariants:** keep technical equivalence constraints, the eight
  base Super Review lenses, all 56 stable rule IDs, fresh-context subagent
  isolation, and configured worker model profiles unless the user scopes a
  migration. Role/tool `description` fields are model-visible instructions;
  keep evaluator expectations and holdouts out of installed skill resources.

## Writing instructions for agents

Keep every agent-facing file (`AGENTS.md`, `SKILL.md`, contracts, lenses,
language contexts, workflows, adapter roles) short, direct, and checkable.
Never turn instructions into an API encyclopedia.

- **Default and environment gate:** before adding any line, ask: (1) *Does a
  strong model already know this once pointed at the problem class?* (2) *Can
  one lookup in the workspace, lockfile, or on-disk stdlib/dependency source
  answer it?* If yes to either, leave it out. Write only what the workspace
  cannot reveal: taxonomy (`finding` vs `tradeoff` vs `not a finding`),
  non-obvious blind-spot questions, anti-folklore guards, and hard boundaries.
- **Point to source, never recite source:** tell reviewers *where* to verify
  (`Cargo.lock`, `vendor/`, `~/.cargo/registry/src`, `rust-src`/`rust-docs`,
  `node_modules/`, `go.sum`/`GOMODCACHE`/`GOROOT`, Maven/Gradle caches) and
  *what question* to check on both current code and proposed changes. Do not
  cache stdlib internals, API overload recipes, rewrite micro-templates,
  MSRV/version matrices, protocol limits, or third-party crate internals:
  cached answers go stale and tempt reviewers to quote the prompt from memory.
- **Questions over catalogs:** cross-language lenses (`lenses/*.md`) state
  language-agnostic mechanisms, `## Expect`, and `## Not a finding`, never
  multi-language API laundry lists. Language contexts (`languages/*.md`) stay
  around 50 to 90 lines: baseline locations, on-disk verification roots, 4 to 6
  diagnostic equivalence questions, `finding`/`tradeoff` boundaries, and
  anti-folklore `Not a finding` guards.
- **Single source of truth:** co-locate positive target, decision rule, and
  `Keep when` caveats under one heading in one authoritative file per recipient
  path. Repeat a rule only for an independent fresh-context role that never
  loads the other file.
- **Hierarchy and pointers:** order content as (1) numbered in-file steps,
  (2) flat `**Leading term**: burden -> target` rules used every run, and
  (3) branch-only files (`harnesses/*.md`, conditional profiles/library notes,
  `#compact-pairs`) behind sharp pointers (front-loaded leading term, one
  trigger per branch, no repeated identity).
- **User-invoked skills:** all four review skills set
  `disable-model-invocation: true` (`allow_implicit_invocation: false` in
  `agents/openai.yaml`). Keep descriptions single-sentence and human-facing
  (adding an explicit-request gate only where a host lacks
  `disable-model-invocation`); put shared rationale in `docs/`, not cross-skill
  runtime links.
- **Positive targets and binary completion:** anchor with pretrained terms
  (*Design It Twice*, *Shotgun Surgery*, *load-bearing*, *seam*, *mutant*,
  *witness*, *hot path*, *Amdahl's law*) and positive targets; reserve `Never`
  for hard read-only, safety, or isolation rules paired with what to do
  instead. Drive thoroughness with checkable clarity (pinned SHAs, quoted
  lines, before/after counts, survived challenge, mutant + witness) and
  exhaustive demand across fresh subagent windows. Use no em-dashes in
  agent-facing Markdown (`AGENTS.md`, `SKILL.md`, `references/**/*.md`).
- **Source-verified semantics and pruning:** verify every kept language or
  library claim against primary source, specs, or the local compiler, and
  express conditional equivalence across boundary inputs (empty, non-ASCII,
  escapes, symlinks, cancellation, flush/drop/error paths, public API) as a
  compact condition or `tradeoff` boundary. When a real run exposes a miss,
  generalize to the failure class, delete superseded lines, and delete any
  sentence whose removal changes no model behavior.
- **Red flags (stop and rewrite before finishing):** a bullet longer than 6
  lines; 4 or more library/stdlib API names packed into one rule; a hardcoded
  language/stdlib version matrix; prose explaining what a stdlib or crate
  function does internally instead of directing the agent to read it; or a test
  asserting literal API syntax examples instead of stable headings and decision
  boundaries.

## Development, evaluation, and release

Settle the design before writing prose, and do not treat a model run as a
drafting step; running a review on a real repository is the maintainer's choice.
Load only the files relevant to the requested edit.

Edit canonical skills and adapter templates, rebuild generated packages, and
select checks by changed inputs in [CONTRIBUTING.md](CONTRIBUTING.md). When
changing an agent decision, follow [the evaluation protocol](evals/README.md):
pair contrasting report/retain inputs isolated from grading expectations,
compile/typecheck fixtures with strict warnings, keep pairs symmetric on public
API and error/transaction contracts, audit `retain` controls through every
requested lens, and record actual model/effort alongside raw failures. Anchor
mechanical tests on stable headings and decision boundaries, not syntax
examples; do not promote experimental routing or pairing defaults on token
savings alone.

Publication, tags, marketplace pins, local tool installs, and PR comments each
require explicit user scope. Published `v<version>` tags are immutable; follow
[the release rules](CONTRIBUTING.md#release) before tagging, releasing, or
updating marketplace pins.
