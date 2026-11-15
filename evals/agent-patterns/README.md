# Agent-pattern blind spots across the review family

Maintainer and evaluator material only. Do not pass this file, `cases.json`, or
peer packets to any review agent.

## Purpose

Coding agents systematically introduce plausible-looking patterns that pass
shallow local checks: single-implementation ceremony, asymmetric updates across
unlinked twin functions (`encode`/`decode`, `cache_key`, `reset`), rolling
`D -> H` state-in-flight incompatibilities, silent fallback masking (`orElse`,
`||`), `H -> H` round-trip tests that never exercise persisted `D` payloads, and
quadratic cross-seam copies on hot paths.

This contrasting corpus exercises those decisions across all four skills
(`super-review`, `defect-review`, `test-review`, `perf-review`) and all four
supported languages (`Go`, `TypeScript`, `Rust`, `Java`).

## Isolation protocol

- `inputs.json` contains twelve neutral single-case packets (`AP01`–`AP12`),
  each with pinned file contents (and an explicit `diff` when the case is a
  change review). Supply at most one input object per fresh agent run together
  with the canonical skill contract, matching language context, assigned lens or
  question, and finding template.
- `cases.json` is evaluator-only: it maps `AP01`–`AP12` into six symmetric
  contrast pairs (positive finding vs clean retention/rejection control) and
  records the checkable grading criteria.
- Status: `NOT RUN`. Mechanical checks in `tests/agent-patterns.test.ts` verify
  input/grader isolation, contrast symmetry, language/skill coverage, and
  absence from packaged plugins; they do not measure model quality. Real-repo
  runs remain required under `evals/README.md` before claiming behavioral gains.
