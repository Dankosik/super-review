# Changelog

The skill, rules, templates, and adapters share one SemVer version. Changes to
review decisions are product behavior, even when they only edit Markdown.

## Unreleased

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
- No release tag, model selection, dependency, or source-reader behavior change.

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
required for 2.1.0.
