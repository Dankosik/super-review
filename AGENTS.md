# Super Review

Super Review is a skill, not an agent runtime. Keep review policy in
`skills/super-review`; adapters own only harness configuration and mechanical
source access. Keep instructions concise without removing decision criteria.

Give each lens a familiar engineering concept, a concrete inspection question,
and a decision that can favor changing or retaining the code. Specify what
understanding improves, not a catalog of smells or numeric style thresholds.
Keep shared judgment in the contract, domain judgment in lenses, and coordination
in the workflow. Exercise changed judgments with contrasting evaluation cases;
do not turn evaluation rubrics into runtime checklists.

Reviewing a user's PR is read-only. Developing this repository permits ordinary
edits and tests. Do not confuse those two scopes.

Use `bun test` for source-reader changes and `bun run typecheck` for TypeScript
changes. Run `bun run validate` and `bun run package` before a release. Preserve
rule IDs, or document their migration. Mechanical checks do not prove model
behavior; record behavioral evaluations separately.
