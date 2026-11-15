# Agent-pattern blind spots across the review family

Maintainer and evaluator material only. Do not pass this file, `cases.json`, or
peer packets to any review agent.

## Purpose

Coding agents systematically introduce plausible-looking patterns that pass
shallow local checks: single-implementation ceremony, asymmetric updates across
unlinked twin functions (`encode`/`decode`, `cache_key`, `reset`), rolling
`D -> H` state-in-flight incompatibilities, silent fallback masking (`orElse`,
`||`), `H -> H` round-trip tests that never exercise persisted `D` payloads,
quadratic cross-seam copies on hot paths, and frontend TypeScript blind spots
(mirroring server query caches into local/Zustand state, render-nested child
components and flag-driven Effect chains, `"use client"` container and barrel
pollution, dead `typeof window` guards inside browser-only callbacks, implicit
form-submit `<button>` defaults and `"" -> 0` input coercion, uncancelled async
UI races and SSR module-global leaks, per-row RSC over-serialization and scroll
layout thrashing, and one-shot `isVisible()` false-green UI tests).

This contrasting corpus exercises those decisions across all four skills
(`super-review`, `defect-review`, `test-review`, `perf-review`) and all four
supported languages (`Go`, `TypeScript`, `Rust`, `Java`).

## Isolation protocol

- `inputs.json` contains twenty-eight neutral single-case packets (`AP01`–`AP28`),
  each with pinned file contents (and an explicit `diff` when the case is a
  change review). Supply at most one input object per fresh agent run together
  with the canonical skill contract, matching language context, assigned lens or
  question, and finding template.
- `cases.json` is evaluator-only: it maps `AP01`–`AP28` into fourteen symmetric
  contrast pairs (positive finding vs clean retention/rejection control) and
  records the checkable grading criteria.
- Status: `NOT RUN`. Mechanical checks in `tests/agent-patterns.test.ts` verify
  input/grader isolation, contrast symmetry, language/skill coverage, and
  absence from packaged plugins; they do not measure model quality. Real-repo
  runs remain required under `evals/README.md` before claiming behavioral gains.
