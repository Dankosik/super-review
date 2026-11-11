# Changelog

## 3.17.0 — 2026-11-11

Next round of fixes from the same 22 runs. Most problems surfaced only when the report was implemented.

- **A remedy must not duplicate an existing owner.** One recommendation added a `CleanupDisposition` type that infra-webhooks already had; the repository's duplication gate caught it during implementation. A remedy that introduces a type, helper or constant now needs a search of the snapshot for an existing owner. The orchestrator either reuses the owner or says why a new one is needed.
- **Remedy checks cover more project checks.** The viability check from 3.16 covered lints only. It now also reads the other checks the project's CI or build files run, without running them:
  - duplication baselines;
  - generated or template-region markers;
  - documentation checks.

  The reviewed repository has no `SUPER_REVIEW.md`, and runs met these only when implementing.
- **Recent names and shapes stay put without a reason.** Re-reviews renamed names that had just been introduced (`timer` → `watcher`, `Admission`) and revived proposals rejected days before. When `git log` of the target files shows a name or shape is recent, changing it now needs a burden it causes, not a preference. Only the orchestrator uses this history; specialists still get none.
- **The report closes with three instructions for whoever implements it.** In every run the user answered "внеси все рекомендации". The implementing agent then:
  - settled unresolved items itself, including a JWKS `key_ops` relaxation;
  - departed from recommendations without saying so;
  - changed code beyond the report.

  The three instructions are: implement only accepted recommendations, keep the stated observable effects, and name any departure and its reason.
- **Defect Review 0.8.0 and Test Review 0.7.0 get the external-harness launch rules from 3.16:**
  - OpenCode effort is passed as `provider/model#variant`, with no metadata probing or trial tasks;
  - the user's own OpenCode configuration is never loaded;
  - a model or effort that cannot be honored stops dispatch with a question, never a substitution disclosed afterwards.

  Their source rules are unchanged: they read the branch with its uncommitted work by design.

Checked by reading against the runs; not yet tried in a model run.

## 3.16.0 — 2026-11-11

Fixes from 22 Super Review runs on `rust-service-template-rest` (skill 3.5–3.10; specialists on Sonnet, Opus and DeepSeek Flash in OpenCode). Across them, about 400 recommendations reached `main` in about 25 PRs, and none turned out to be wrong in substance. What failed was process.

- **Observable changes are labelled.** A readability change may change what callers, operators or logs see, and that is allowed when the clarity is the gain. Each recommendation now states its observable effect (`none` or what changes). The summary may claim behavior is unchanged only when no recommendation has an effect. Three reports had said "ни одна рекомендация не меняет поведение" while they:
  - added a public error variant;
  - changed `Display` text;
  - removed a runtime check.
- **A change to a decision the code makes stays unresolved**: what it accepts, rejects, retries or permits, or how it classifies an outcome. Examples: `COMMIT` with `25P02` reclassified as `CommitUnknown`, and JWKS keys with `["sign","verify"]` admitted.
- **A specialist's precondition travels into the recommendation**, or the remedy stays unresolved. One run dropped "needs owner confirmation" and recommended deleting a defensive line in authn.
- **Workspace-internal APIs are the orchestrator's call.** Runs had left 13–22 unresolved "public API decisions" each, even where every consumer was inside the workspace. The orchestrator now decides when all inspected consumers are internal and nothing marks the item as published.
- **A model or effort the user chose is not silently replaced.** Runs on 3.9.x replaced the requested OpenCode specialists with native ones, and one replaced "terra 6.1" with Opus; each disclosed the swap only in the report. The contract now says to ask before dispatch. The Claude adapter now says to look for a model that native Agent cannot select in an installed external harness, and to ask.
- **OpenCode effort is passed as `provider/model#variant`.** Missing variants in cached metadata do not mean none exist. Runs had spent 3–10 calls probing, and one dropped the requested `#high`. Never load the user's own OpenCode configuration.
- **Branch is recorded.** Source access records the branch, and the report names which target files differ when HEAD is not the default branch or is behind its upstream. One run reviewed a HEAD that a merged PR had already rewritten; others reviewed another session's unmerged branch.
- **Specialists read the pinned copy, never the live checkout, even when it is clean.** Three runs pointed specialists at a checkout that other sessions were editing.
- **Report hygiene:**
  - stated counts match the R headings and the decision table, with no placeholder R-IDs;
  - the report is in the language of the user's request even when packets are English;
  - a finding's affected files include excluded tests and other uses the change must update. One recommendation broke compilation of an excluded test module.

- **The orchestrator owns its decisions.**
  - The runs checked facts well: they caught a "nonexistent parameter" that was a SQL column and a misread comment, and verified dependency claims in `~/.cargo/registry`.
  - Decisions were the weak part. Two runs rejected nothing (34 of 34 and 55 of 55 accepted); some decision rows had no reason; risky changes were "accepted with disclosure".
  - Remedies broke at implementation: clippy rejections, `dead_code`, an E0618 name clash, a broken test module.
  - Choices between supported alternatives were handed to the user, who answered "возьми ответственность сам".
- **What verification now requires:**
  - The orchestrator answers for each accepted recommendation as if it wrote it, and a decision needs its own reason.
  - It chooses between supported alternatives itself.
  - `unresolved` is kept for a fact the source cannot supply, which must be named, or for a changed decision.
  - Before accepting, it checks the resulting code by reading against lint policy, every use (including excluded tests), name collisions and dead code.
  - A remedy's main point is never optional.

Checked by reading against the runs; not yet tried in a model run.

## 3.15.0 — 2026-11-11

- Fix external-harness waits under the Claude Code commands. `/super-review:review`, `/super-review:defects` and `/super-review:tests` run the orchestrator as a forked turn that ends at its first reply without a tool call, and background processes ended with it. In 6 of 17 Defect Review runs with OpenCode readers in `rust-service-template-rest` the orchestrator wrote "the readers are still running" and returned; every reader then died with ECONNRESET within seconds, which the main session reported as a provider failure. Each skill's `external.md` and Claude adapter now say to wait in foreground shell calls until the review's own exit files appear and never to end the turn while its processes run.
- Keep concurrent reviews apart. Runs matched processes by command line: one `pkill -f 'agent defect-reader'` killed another session's readers, and another session reported a third session's processes and outputs as its own. Each review now records its own PIDs and exit codes in its own directory, waits on, retries and stops only those, never uses `pgrep -f` or `pkill -f`, and does not read other runs' files or the harness's shared logs.
- Defect Review 0.7.0 and Test Review 0.6.0: the orchestrator descriptions say a review is started by its command, not by another agent. Asked in a plain message, main agents had started `defect-orchestrator` directly on Sonnet and added rules of their own: "keep the fan-out modest", lists of deliberate choices not to report, severity, suggested fixes and CONFIRMED/PLAUSIBLE verdicts. Three such runs paired lenses on a large crate, grouped challengers by claim, wrote English reports for a Russian request, and one ran no challenge. The orchestrators now take only the target, its narrowing and the user's harness, model and effort from a request, pass nothing else to readers, name what they set aside, and write in the language of the user's request.
- Defect Review merges candidates with the same cause before the challenge (one bug found by three readers had gone to three challengers), keeps a reader's incomplete trace unproven unless the orchestrator finishes the step from the source instead of handing it to a challenger, and treats a step about standard-library or database behavior nobody read as unproven. The report template repeats that it carries no severity labels or fix advice. Readers no longer get what was settled before the review (earlier findings or fixes, decisions to respect, severity), on every adapter.
- Defect Review looks for what the first runs missed. Second runs on grpc, cache and http found significant bugs the first had not, among them a sibling of a confirmed one: a CA that is not X.509 was caught in grpc and missed in cache. After deciding, the orchestrator now searches for siblings of each bug that stood (the same call elsewhere, the client and server sides of one check, the startup and running paths of one wait) and gives them to one fresh reader as the one task that gets a known bug. Scope a reader reports it could not read goes once to a fresh reader with the same lens, and a lens is split by area when its files are more than one reader reads in full. A package of about a thousand lines reviewed whole gets lens pairs, as a small change does.
- Wrong behavior whose harm is a security one, such as a credential sent to a host nobody configured, stays a bug; only hunting vulnerabilities as such is out of scope. Each finding states its trigger concretely enough for a test to set up and its reach: this repository's own code, or only the public interface. The report puts reachable bugs first and names files that changed while agents read, after checking HEAD and the scope's status again.
- The `/super-review:review` orchestrator gets the same guard against rules a calling agent adds. Of 21 bugs from four of these runs that a separate agent checked, none was shown false; the changes address process failures, not precision. Not yet tried in a model run.

## 3.14.0 — 2026-11-10

- Ship Defect Review 0.6.0 and Test Review 0.5.0 in the OpenCode package. Run `/defect-review` or `/test-review` in a session the `super-review` launcher opened. Each review has its own primary role and subagents: `defect-review` starts only `defect-reader` and `defect-challenger`, and `test-review` starts only `test-reader`. Every role denies all tools but read, glob, grep and shell, and no subagent can delegate or load a skill. The subagents use the specialist model the launcher or `SUPER_REVIEW_SPECIALIST_MODEL` selects, and project configuration cannot replace them. Each skill gains `references/harnesses/opencode.md`.
- The native OpenCode check now covers all seven roles, their commands and skills, including a reviewed repository that defines roles with the same names. It passed locally on OpenCode 2.2.3; OpenCode 1.18.29 is checked in CI. No review has been run through these roles yet.

## 3.13.0 — 2026-11-10

- Let the user run Defect Review readers and challengers, and Test Review specialists, in another installed harness, such as OpenCode subagents under a Claude Code orchestrator, as Super Review already allows. Asked for "subagents through OpenCode Go", the Defect Review orchestrator had refused because its role allowed Bash only to find and read source, and fell back to Claude subagents. Each skill now has its own `references/harnesses/external.md`. OpenCode has no installed Defect or Test Review role, so each process defines a read-only one through `OPENCODE_CONFIG_CONTENT` (deny everything but read, glob, grep and shell), with project configuration disabled and a private server. Only the user's request selects the harness and model, and an unavailable CLI or model is reported instead of silently falling back. Defect Review is now 0.5.0 and Test Review 0.4.0. Not yet tried in a model run.

## 3.12.1 — 2026-11-10

- Fix the OpenCode launcher when it is started through a symbolic link, such as one in `~/.local/bin`: it took the link's directory for the package and found no review agents. It now follows links to the package.

## 3.12.0 — 2026-11-10

- Add Defect Review 0.4.0, a separate experimental skill in the same plugin that hunts bugs in Rust source by reading it. Independent readers each take one lens, or a related pair for a small change: results, boundaries, errors, time, lifecycle, shared state, stated facts and team rules. In a change review they also read removed lines and the callers of what changed. A bug needs a trace through the code (a trigger real use can produce, each step as a quoted line, what the affected party observes), a stated expectation with its basis (a written statement, what the code declares about itself, or a named engineering principle), a harm, and survival of an independent challenge. A written promise is not a precondition, and a document that describes harmful behavior does not settle the claim.
- The challenge is what holds false positives down. A second agent receives each claim with its trace and without the finder's reasoning, follows the trigger through the source itself, and tries to show the claim is wrong. Its verdict is an argument the orchestrator checks. A deliberate choice whose stated reason holds is reported as disputed, with the cost and the decision side by side.
- Add Test Review 0.3.0, a third separate experimental skill: would the tests of Rust source fail if a plausible bug appeared? A finding names a promised behavior no test pins down and shows it with a mutant (one small, plausible mistake in production code that breaks a quoted promise, written as a diff and never applied), why each test that reaches that code would still pass, and a witness: the check that holds for the original code and fails for the mutant. A test that breaks a written team rule for tests is proven by quoting both; an unstable test by two orders of events it permits. Five questions: behavior, failure paths, oracles, determinism and team rules.
- Neither review clones, copies, builds or runs the reviewed project, and none of their roles holds a tool for writing files. Claude Code gets `/super-review:defects` (`defect-orchestrator`, `defect-specialist`, `defect-challenger`) and `/super-review:tests` (`test-orchestrator`, `test-specialist`); Codex gets the `defect-review` and `test-review` skills. Cursor and OpenCode packages do not carry them yet. Standalone archives are `defect-review-0.4.0-skill.zip` and `test-review-0.3.0-skill.zip`. No skill depends on another at run time. Super Review's contract, lenses, 44 rule IDs and roles are unchanged. `docs/review-family.md` records the architecture and its decisions.
- Defect Review's lens principles say where a deliberate design ends and a bug begins: degrading on purpose with the failure still visible, causes merged under one name that nobody acts on, a shared resource retired for a failure that really breaks it, a request that takes effect after a timeout, a wait a caller's limit reaches, and detached work nothing depends on are not bugs. `docs/defect-review.md` lists the lines.
- Unreleased earlier designs of both reviews built the project in a disposable copy and proved findings by a failing test or a surviving mutant. They were run once each on `infra-cache` in `rust-service-template-rest` and then dropped: the run machinery was most of the instructions and about 2.5 million subagent tokens, and the first Defect Review design, which also required a quoted written promise, classified three of seven defects another reviewer had reported as documented behavior. Those records stay under `evals/defect-review/results/` and `evals/test-review/results/`. The instructions were then cut to what a reader needs: one contract per review holding the bar, the basis and the proof rules, a workflow for the orchestrator, and the lenses or questions. The current reading-only versions have not been used on a real repository.

## 3.11.0 — 2026-11-10

- Have Rust reviews recommend the fixed form when every caller sets an option, parameter, enum or type parameter to the same value, instead of leaving the remedy open for a variant nobody uses yet.
- Recommend removing an item kept alive only by `#[allow(dead_code)]` when nothing inside its visibility uses it, and record the reason for other lint suppressions with `#[expect(.., reason = "..")]` where the crate's Rust version supports it.
- Treat a private or `pub(crate)` item's uses as settled by its own crate, so a missing outside consumer no longer blocks advice about it.
- Sixteen contrasting inputs RD53-RD68 probe eight more decisions from the `rust-service-template-rest` skills. The 3.10.0 lenses already found six on these inputs; the two above improved, none regressed, and no retain contrast produced a finding. One run per arm on one model.
- Give Rust reviews a stated standard of well-written Rust to compare source against: types that carry facts, ownership that tells the story, values bound once, the compiler as co-maintainer, standard vocabulary and the least machinery. Assign each kind of idiom to the lens that owns it, replacing the instruction not to run an idiom pass.
- Name what each Rust lens looks for, with the case for keeping the code beside it: checks that could produce the value, flag variables, wildcard arms over the crate's own enums, placeholder `let mut` bindings, copies standing in for moves, index loops, inherent methods shadowing standard traits, signatures that promise what cannot happen, stringly-typed state, fields that are `None` only until `init`, validated values carried as raw strings, broad error enums, erased error sources and name forms used against their convention.
- Treat committed lint configuration as the project's adopted choice: advice does not contradict it, and listing its violations stays with the project's checks.
- Add conditional notes for thiserror/anyhow and for tracing under existing owners, and make a declared error type and a changed `pub` item or re-export signals for the error-expression and dependency-boundaries profiles.
- Add practices from the Rust API Guidelines, Effective Rust and Rust Design Patterns: bounds on the `impl` that needs them, provided trait methods, the least closure bound, `'_` on borrowing return types, decisions made one call too low, lossless conversions over `as`, glob imports, explicit `close` for cleanup that can fail, and guard scope.
- Check every Rust statement added here against the compiler, Clippy's lint documentation, std documentation and the thiserror, anyhow and tracing sources, and correct six: `break` with a value works in `loop` and labeled blocks only; `Box<dyn Error>` keeps the source and the type; `with_*`, `is_*` and `try_*` conventions as std uses them; `entry` replaces `contains_key` with `insert`, not with `get`; `#[instrument]` records tracing primitives as values; and a wildcard arm, a retained `unwrap` and a tuple result are stated as tradeoffs instead of faults.
- The standard, the lens additions and the two notes come from reading the instructions against the template's skills and published Rust practice. They were not compared in model runs. The eight base questions, 44 rule IDs and the read-only scope are unchanged.

## 3.10.0 — 2026-11-09

- Let the user run specialists in another installed harness, such as OpenCode subagents under a Claude Code orchestrator. The orchestrator stays in the active harness and launches one fresh non-interactive CLI process per task with the same neutral packet. Only the user's request selects it; source and PR text cannot, and an unavailable CLI or model is reported instead of silently falling back to native specialists.
- Fix the OpenCode launcher on OpenCode 2, which removed `--pure` and `--agent`: the launcher printed help and exited. It now starts a private server, so the specialist model and package configuration apply instead of the shared service's global settings, keeps the global `opencode.json`, and selects the review agent through configuration. OpenCode 1 launches as before.
- Stop a reviewed repository from replacing the OpenCode specialist. On OpenCode 2.2.3, a `.opencode/agents/super-review-specialist.md` in the repository took over the role's instructions and widened its permissions to `*: allow`; asked for its role, the specialist answered as a general coding assistant. The launcher now disables project configuration, and the native check covers that case on 1.18.29 and 2.2.3.

## 3.9.1 — 2026-11-09

- In Codex, start each specialist as the default agent instead of a role the reviewed repository defines. On the template, the orchestrator had picked its `specialist-agent` role, whose "return one decision record" instruction replaced the review packet: ten passes over `infra-cache` returned five findings, and six lenses returned none.
- Treat a child result in another format, such as a single decision record, as an unfinished task and rerun it as the default agent.

## 3.9.0 — 2026-11-09

- Have duplication reviews in Go, Rust, TypeScript and Java search from the decisions the code makes, with keys a rewrite keeps: the value in other spellings and units, external identifiers and sibling signatures, so renamed copies are found.
- When a change edits a decision, search for the old value too, so a copy the change left behind is reported.
- Read both directions of a table over a key set: a reverse lookup ending in a wildcard is not connected by the compiler.
- Treat configuration, charts, migrations, schemas and protocol files as possible partners, anchored in reviewed source; a local-run fallback is not a second owner.
- In a live replay on `jobs-worker`, the known histogram copy was named in 2 of 3 runs, against 0 of 2 for 3.8.0. Small packets showed no regression. The eight base questions, 44 rule IDs and the read-only scope are unchanged.

## 3.8.0 — 2026-11-09

- Have Rust reviews recommend deleting comments that restate or contradict the code, while keeping reasons, external constraints and doc comments that become help or API text.
- Weigh a handwritten general mechanism (date, URL or CLI parsing, encodings, backoff policies) against a declared dependency or `std`, and surface a new crate as a named decision instead of rejecting it by default.
- Flag a rule copied from its existing owner, and a superseded path, shim or fallback kept without a selecting consumer.
- Cover `From` over `Into`, duplicated `new`/`Default` construction, mock-only traits, one-action objects, Display-text error matching, error variants every consumer treats alike, sleep-polling loops over internal state, type aliases for identifiers and getter layers on passive internal data.
- Decisions transferred from the `rust-service-template-rest` Rust skills, with sixteen contrasting inputs RD37-RD52 and a recorded baseline/candidate comparison: four of eight useful-change inputs improved, four tied, none regressed, and no retain contrast produced a finding. Keep the eight base questions, 44 rule IDs and read-only scope unchanged.

## 3.7.0 — 2026-11-06

- Guide Rust reviews toward representations with fewer manually maintained relationships and clearer data transformations, while retaining required staging and lifecycle guarantees.
- Verify factual premises, complete the assigned scope after the first finding, and include a minimal resulting-shape sketch when structural advice needs one.
- Reconcile recommendations against a coherent resulting design, preserving compatible edits and distinguishing genuine alternatives.
- Preserve sixteen bounded static review outputs, independent assessments, and a code-only application with matching follow-up edits. Results are mixed; general quality gains, runtime correctness and maintenance-time savings are not established.
- Keep the eight base questions, 44 rule IDs, read-only review scope, native adapters and model profiles unchanged.

## 3.6.0 — 2026-11-06

- Have duplication reviews in Go, Rust, TypeScript and Java search the whole snapshot beyond their assigned area, so a large review can find copies across its partitions.
- Judge a copy the Rust, TypeScript or Java compiler connects by the extra edit it costs, not as silent divergence. Go has no equivalent connection.
- In a whole-project review, read lens, profile and aspect wording about changed source or a diff as the included source.
- Keep the eight base lenses, read-only review policy, rule IDs, native adapters and result contracts unchanged.
- Evidence is limited and recorded in `evals/change-together`: a small Rust replay on real code, and one static run per arm for the other languages, where only Java changed.

## 3.5.0 — 2026-09-23

- Route Codex specialist tasks to GPT-6 Luna/medium only for bounded local questions with complete context; use GPT-6 Sol/medium for cross-file, preservation-sensitive, uncertain, or incomplete questions. An explicit user model/effort selection still wins.
- Select the native Opus alias for the Claude Code review command, orchestrator, and specialists. Inherit session effort so a review can use medium, high, or xhigh according to its difficulty; provider alias mappings remain native configuration.
- Keep the existing eight-lens coverage, read-only review policy, rule IDs, native adapters, and source/result contracts. A bounded model-choice comparison passed; GPT-6/Opus specialist quality and effective routing remain unmeasured on this host.

## 3.4.0 — 2026-09-19

- Default to eight concurrent specialist tasks and refill a free slot as each result arrives, instead of three-task Codex/Cursor caps or waiting for unrelated children.
- Honor an explicit user concurrency ceiling; keep host capacity and rate limits binding. Use same-size batches only when the host returns whole batches. Do not invent later reductions to six or three.
- Point Cursor's repository marketplace manifest at the native Cursor adapter so this revision can be submitted or imported. Manual install remains supported; an official public listing still needs Cursor review.
- Preserve all 44 `go.*`, `ts.*`, `rust.*` and `java.*` rule IDs, native 3.x packaging, and existing Claude, Codex, Cursor and OpenCode adapters. Scheduling latency comparison remains unrun.

## 3.3.0 — 2026-09-17

- Add six Spring/Spring Boot owner profiles for bean wiring, application operations, HTTP contracts/errors, managed lifecycle and value shapes, plus per-module compatibility context. They deepen existing Java lenses; they do not add a language, rule IDs or extra agent types.
- Deepen TypeScript contract review for generic inputs, overload consumers, schema ownership and public module artifacts, with contrast cases and T07/T10 corrections.
- Deepen Rust API and conditional library quality review: conversion/builders, lifetime and generic contracts, plus Tokio/Serde/clap/Axum notes under existing owners.
- Deepen Go quality contrasts and correct language-scope evaluation; calibrate Java representation evals to accept equivalent remedies without changing runtime instructions.
- Preserve all 44 `go.*`, `ts.*`, `rust.*` and `java.*` rule IDs, native 3.x packaging, and existing Claude, Codex, Cursor and OpenCode adapters. Model-backed quality comparisons remain unrun.

## 3.2.0 — 2026-09-17

- Add a native Cursor IDE adapter: `/super-review` skill, a read-only specialist role, and inherit-by-default specialist models with an explicit per-review subagent override. Package a Cursor archive. This does not publish a Cursor marketplace listing.
- Add seven TypeScript owner profiles for React, Next.js, Tailwind CSS and shadcn/ui. They deepen existing lenses from inspected source; they do not add a language, rule IDs or extra agent types.
- Record frontend compatibility context, twenty contrasting fixtures and mechanical integrity checks, plus Cursor adapter configuration tests. Independent-agent and behavioral model evaluations remain unrun.
- Preserve all 44 `go.*`, `ts.*`, `rust.*` and `java.*` rule IDs, native 3.x packaging, and existing Claude, Codex and OpenCode model profiles.

## 3.1.0 — 2026-09-17

- Add Java review context, ten lens modules and four owner profiles with eleven stable `java.*` IDs. Preserve all existing `go.*`, `ts.*` and `rust.*` identities (44 rules total).
- Route Java through the native 3.x language catalog and read-only Maven/Gradle compatibility context. Do not restore the removed MCP reader or custom source runtime.
- Add eighteen contrasting Java judgment fixtures and mechanical routing/identity tests. Model-backed Java evaluation has not been run.
- Pin staged, unstaged and combined local snapshots, including old/new finding anchors, renamed/deleted coordinates, symlink/gitlink handling and source-evidence checks.
- Match specialist results to the assigned task, snapshot, lens/profiles, scope and policy before treating `completed` as coverage.
- Clarify explicit launch versus help/missing-target handling in the core skill and native entry points; reuse an already selected target without repeated confirmation.
- Load orchestration, verification, reporting and supported continuation guidance at their applicable stages. Preserve full preliminary declaration reading, independent specialists, eight base questions and every accepted recommendation.
- Distinguish confirmed absence of optional team policy from unavailable policy evidence; keep explicit source selection, scoped overrides and proposed-policy isolation.
- Clarify unfinished missing results, completion of the declared plan and compact reports without empty tables or dropped coverage/candidate decisions.
- Update repository-maintenance guidance and add bounded evaluation suites for instruction boundaries, evidence boundaries and source views. Model comparisons for these changes have not been run; no quality or latency gain is claimed.

## 3.0.0 — 2026-09-10

- Breaking: remove all MCP servers, custom source tools, source/result caches, setup scripts and bundled runtime dependencies.
- Use native file/search, Git/GitHub and agent completion tools in Codex, Claude and OpenCode. Native shell access is governed by host permissions and review instructions, not the old reader allowlist.
- Support explicit local-change and whole-project review targets with pinned source identities, alongside PR review.
- Preserve model profiles, all 33 rule IDs, independent lens coverage and candidate reconciliation.
- Generate instruction-only packages and document removal of the legacy Codex waiting namespace.

## 2.3.0 — 2026-09-10

- Favor demonstrated improvements in readability and maintainability across Go, TypeScript, and Rust; distinguish patch-writing effort from lasting code complexity.
- Assess compatibility from supported boundaries and known consumers rather than treating public visibility as a frozen API. Retain established external contracts.
- Revise weak remedies without discarding supported observations; ground specialist findings in actual declarations and calls, and make review extent explicit in assignments.
- Clarify Rust boolean-mode judgment and align language-specific compatibility guidance with the shared contract.
- Record four independent baseline/candidate stage runs on Rust fixtures using Astra/medium. Results are bounded and do not establish a general quality gain or default Terra-profile improvement.
- Preserve all 33 rule IDs, model profiles, source-reader behavior, and read-only permissions; regenerate native Codex and Claude payloads.

## 2.2.0 — 2026-09-10

### TypeScript

- Add language routing, TypeScript context, ten TS lens resources and four owner profiles with eleven stable `ts.*` rules; preserve all Go IDs.
- Support TS/TSX/MTS/CTS and handwritten declarations in pinned source reads and caller search, with compatibility metadata and existing read-only boundaries.
- Add contrasting evaluation inputs and mechanical source/resource tests; behavioral model evaluation remains separate and has not been run.
- Regenerate native Claude/Codex payloads without changing models, permissions, or dependencies.

The skill, rules, templates, and adapters share one SemVer version. Changes to
review decisions are product behavior, even when they only edit Markdown.

### Rust and review instructions

- Add Rust-specific review lenses/profiles and 11 stable `rust.*` rules without changing Go or TypeScript IDs.
- Integrate Rust source/Cargo context into shared Go/TypeScript routing and classification; preserve test/generated-code scope limits.
- Add Rust evaluation packets and mixed-language regression tests; live model quality remains unevaluated.

- Clarify the MCP resource description: reuse complete supplied materials and load missing shared role resources, the assigned lens, and selected profiles rather than the full catalog.
- Audit model-visible tool metadata alongside role instructions; add selective resource-delivery checks for canonical, Claude, and Codex skill roots. Record blocked model comparisons separately from mechanical validation.
- Distinguish trusted instruction revision/digest from SemVer and reviewed source identity; do not treat a missing digest alone as a source-coverage gap or a reason for redundant reads.
- Support selectively loaded, explicitly labeled code illustrations in team rules at the pinned policy revision, without new authority, rule fields or permissions.
- Align unresolved remedy fields around the exact missing evidence or necessary team decision; preserve ordinary reviewer judgment.
- Clarify instruction ownership and neutral delegation across actual model configurations; retain all base lenses and Go-specific preservation guidance.
- Correct the source record using the retrieved official Anthropic article; distinguish tool demonstrations from team-specific references.
- Add eight evaluator-only follow-up stages and an isolated routing-first replacement; preserve default preliminary reading until behavioral comparisons justify a change. Model-backed comparisons remain unexecuted.
- Separate evidence-backed observations from accepted implementation remedies; keep unresolved observations visible without lowering the acceptance bar.
- Define neutral task packets, reuse complete matching supplied resources, and move shared candidate metadata into one task result header.
- Clarify instruction authority, local conflict handling, source-first clarification, and fresh assignments for focused continuations.
- Preserve review decisions and retrievable evidence at supported in-session compaction boundaries without promising persistence or expanding permissions.
- Align Claude, Codex, and OpenCode instructions while retaining model defaults, independent base coverage, native waiting, and source-reader behavior.
- Add 18 prompt/context stage inputs, separate evaluator expectations, compilable Go fixtures, and mechanical integrity checks; model-backed gains remain unmeasured.
- Refine existing Go judgments for standard-library reuse, interfaces/generics, results, zero values, package boundaries, and caller documentation; add no agents or rule IDs.
- Constrain suggested Go cleanups by the actual module baseline, error matching, method sets, and defer/ownership contracts rather than happy-path resemblance.
- Add 24 Go-specific evaluation inputs with separate expectations; record fixture compilation separately from unexecuted model evaluation.
- Preserve the eight-base-lens plan; select representation and rationale lenses from changed-source signals.
- Load lifecycle-ownership, dependency-boundaries, effects-separation, and error-expression profiles only for their owning tasks.
- Track selection separately from completed coverage, honor explicit scope, and resolve newly discovered signals without recursive review waves.
- Add `go.representation.express-concepts` and `go.rationale.explain-constraints`; all nine existing IDs and overrides remain valid. Profiles use their owner's rules, not a new namespace.
- Add contrastive judgment and routing evaluation packets plus mechanical resource/packaging checks. Model-backed evaluation remains unexecuted; no quality or cost improvement is measured.
- Extend the OpenCode resource allowlist to the seven new Markdown resources; source access and tool permissions stay unchanged.
- Preserve model selection, dependencies, and read-only permissions.

## 2.1.0

- Add a Codex completion barrier: one pending MCP call collects all reports in a group without model polling.
- Use foreground native specialist calls in Claude Code and OpenCode.
- Package Codex's native MCP configuration with a 660-second tool timeout and a fixed ten-minute group deadline.
- Preserve unfinished coverage on failure or timeout; retain full reports with explicit continuation offsets.
- Keep orchestration models, specialist profiles, all nine Go rule IDs, and the eight-lens plan unchanged.

## 2.0.0

- Breaking: specialists no longer silently inherit the orchestrator model.
- Codex balanced workers use Terra/medium; explicit economy uses Luna/medium.
- Claude workers use Sonnet/medium while the orchestrator inherits the session.
- OpenCode requires one explicit provider/model selection, preserved outside release folders.
- Reduce repeated orchestration turns through longer completion-aware waits and larger resource batches.
- Record blinded model screens, live routing/usage, and quality-evidence limitations.
- Preserve all nine Go rule IDs and the default eight-lens plan.

## 1.1.0

- Native Claude Code and Codex plugins with standard installation and update flows.
- Claude's isolated review command and constrained specialist roles.
- A bundled Node MCP bridge over the existing GitHub reader; no consumer package install.
- Shared immutable snapshot receipts for Codex's separate child reader processes.
- Setup guidance, reader checks, natural-language lens scope, actual progress, and outcome-first reports.
- An OpenCode launcher selects the review agent and trusted directory automatically.
- Preserved all nine Go rule IDs and the full default review plan.

## 1.0.0

- First Go readability and maintainability review skill.
- Eight independent lenses with orchestrator verification and complete reports.
- Team policy from a pinned base, with explicit overrides and conflict handling.
- OpenCode primary agent, specialist, command, and bounded GitHub source reader.
- Versioned complete-adapter and standalone-skill archives.

Default rule IDs are listed in `evals/go/rule-ids.json`. No rule-ID migration is
required for 3.0.1.
