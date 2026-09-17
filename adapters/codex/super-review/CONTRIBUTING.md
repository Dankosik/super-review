# Contributing

Keep policy in the skill and mechanics in native adapter configuration. Explain
which user decision an instruction changes. Preserve stable rule IDs or document
migration; keep evaluation expectations and raw model outputs outside runtime
instructions. Read-only reviews and development of this repository are distinct.

## Select verification by changed inputs

Install with `bun install --frozen-lockfile` when dependencies are missing or the
lockfile changes. During development, run the checks whose inputs changed:

| Changed inputs | Verification |
| --- | --- |
| Canonical skills, adapter templates or packaged documents | `bun run build`, then `bun run validate`; inspect generated diffs. |
| Fixtures or tests | The affected `bun test <path>` suite; include changed-input dependents. |
| TypeScript scripts, tests or configuration | `bun run typecheck` and affected tests. |
| Source-view, location or acquisition instructions | `bun test tests/source-evidence.test.ts` plus contrasting source-evidence evaluation inputs. Disposable Git tests verify semantics, not agent compliance. |
| Archive inputs or packaging logic | `bun run package` after a current build; inspect archive contents. |
| Native roles, commands or permissions | Corresponding native configuration checks in CI. |
| Development-only prose | Links and affected instruction decisions; no unchanged package rebuild. |

Reuse a successful check only while its relevant inputs, tool versions and
environment are unchanged. A new failure needs its causal fix and affected check,
not an automatic restart of every suite. Record unavailable tools and their gaps.
Before requesting merge of distributable changes, the full CI gate must pass:

```sh
bun run build
bun test
bun run typecheck
bun run validate
bun run package
```

Policy changes need contrasting evaluation cases and honest behavioral evidence.
Tests verify resource identities, native configuration and packaging; they do not
prove recommendation quality. Changes to roles need native configuration checks.
CI validates the Claude plugin and OpenCode tool exposure without executing models.
Use the [evaluation protocol](https://github.com/Dankosik/super-review/tree/main/evals)
for changed agent decisions and the [instruction-boundary cases](https://github.com/Dankosik/super-review/tree/main/evals/instruction-boundaries) for
changed launch, policy, coverage and handoff decisions, the
[evidence-boundary cases](https://github.com/Dankosik/super-review/tree/main/evals/evidence-boundaries)
for task/result matching and renamed/deleted anchors, and the
[source-evidence cases](https://github.com/Dankosik/super-review/tree/main/evals/source-evidence)
for snapshot and anchor decisions. Start with a specific failure and its opposite
case before changing prose. Compare identical source/host/model conditions, retain
raw traces and failed attempts, and keep grader material out of review packets.
Do not claim a behavioral pass from fixture integrity; record unavailable model
runs explicitly. Keep the
routing-first experiment separate until its comparison justifies promotion.

Codex and Claude install trees are generated. Edit canonical skill files and
adapter templates, then rebuild; do not edit delivery copies. Version 3 ships no
custom source-reader runtime. Use native host tools in review instructions.

An instruction-maintenance PR is not permission to publish a release or change
another repository. For an explicitly authorized release, verify the exact commit,
publish its tag and packages, and
update Super Review's version/SHA in the author marketplace's catalog.json.
Run that repository's catalog generator and remote identity checks, then publish
its updated pin. A GitHub release alone does not update marketplace consumers.

Do not publish credentials or private source in evaluation logs. Review code
only when authorized, and do not post reviews to other people's PRs.
