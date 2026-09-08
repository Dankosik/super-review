# Super Review

Super Review is a skill, not an agent runtime. Keep review policy in
`skills/super-review`; adapters own only harness configuration and mechanical
source access. Keep instructions concise without removing decision criteria.

Reviewing a user's PR is read-only. Developing this repository permits ordinary
edits and tests. Do not confuse those two scopes.

Use `bun test` for source-reader changes and `bun run typecheck` for TypeScript
changes. Run `bun run validate` and `bun run package` before a release. Preserve
rule IDs, or document their migration. Mechanical checks do not prove model
behavior; record behavioral evaluations separately.
