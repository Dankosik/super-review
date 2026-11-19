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
pollution, dead `typeof window` guards inside browser-only callbacks, implicit form-submit `<button>` defaults and `"" -> 0` input coercion, uncancelled async
UI races and SSR module-global leaks, per-row RSC over-serialization and scroll
layout thrashing, per-frame React state / root CSS variable invalidation / layout
animations, unpartialized synchronous `localStorage` persistence with coarse
per-row store subscriptions on streaming UIs, one-shot `isVisible()`
false-green UI tests, and Rust hot-path blind spots such as `HashMap::entry`
owned-key allocations on cache hits, `sort_by_key` per-comparison allocations,
unbuffered `serde_json::from_reader`, `Mutex`-wrapped connection pools,
`match`/`if let` scrutinee lock guards held across Rayon/SQL batch work,
quadratic front `Vec::drain(..frame_len)` shifts, `serde_json::json!({...})`
and owned composite lookup keys, `#[derive(Clone)]` `Arc` refcount contention
with `DashMap::len()` / held `Ref` guards in `rayon::par_iter()`, and
unbuffered `writeln!` / chained `stat` / loop-invariant `env::var` calls).

This contrasting corpus exercises those decisions across all four skills
(`super-review`, `defect-review`, `test-review`, `perf-review`) and all four
supported languages (`Go`, `TypeScript`, `Rust`, `Java`).

## Isolation protocol

- `inputs.json` contains neutral single-case packets (`AP01`–`AP50`),
  each with pinned file contents (and an explicit `diff` when the case is a
  change review). Supply at most one input object per fresh agent run together
  with the canonical skill contract, matching language context, assigned lens or
  question, and finding template.
- `cases.json` is evaluator-only: it maps the packets into symmetric
  contrast pairs (positive finding vs clean retention/rejection control) and
  records the checkable grading criteria.
- Status is `PARTIAL`. The [Rust performance reader probes](results/2026-11-19-rust-perf/README.md)
  cover first-assignment routing, derived values, copy-on-write and task lifetime,
  and the [Rust performance depth and challenger probes](results/2026-11-19-rust-perf-depth/README.md)
  cover `AP35`–`AP36`, `AP43`–`AP50`, and six broken-cheaper-form challenger traps.
  They exercise isolated readers and challengers on synthetic modules. The full
  corpus and end-to-end production repository workflows remain unevaluated here.
  Mechanical checks in `tests/agent-patterns.test.ts` cover packet isolation,
  pair identities and packaging.
