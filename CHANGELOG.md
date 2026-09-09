# Changelog

The skill, rules, templates, and adapters share one SemVer version. Changes to
review decisions are product behavior, even when they only edit Markdown.

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
required for 1.1.0.
