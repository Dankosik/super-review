# Super Review

Super Review is a skill, not an agent runtime. Keep review policy in
`skills/super-review`; adapters own only harness configuration and mechanical
source access. Keep instructions concise without removing decision criteria.

Give each lens a familiar engineering concept, a concrete inspection question,
and a decision that can favor changing or retaining code. Specify what understanding
improves, not a smell catalog, metric threshold, or model's reasoning procedure.
Keep shared judgment in the contract, domain judgment in lenses, and coordination
in the workflow. Repeat a norm only for a useful local implication; independent
children still need their own complete contract. Adapt model tendencies locally
without changing shared scope, defaults, or coverage by inference.

Exercise changed judgments with contrasting evaluation cases, separate from runtime
instructions. Start without examples; add a small diverse contrast only for a
measured recurring failure. Keep holdouts and evaluator expectations out of reviewer
packets. Context, token savings and latency are not recommendation-quality scores.

Reviewing a user's PR is read-only. Developing this repository permits ordinary
edits and tests. Do not confuse those scopes.

Use `bun test` for source-reader changes and `bun run typecheck` for TypeScript
changes. Run `bun run validate` and `bun run package` before a release. Keep native
policy copies byte-identical and preserve rule IDs or document migration. Mechanical
checks do not prove model behavior; record behavioral evaluations separately.
