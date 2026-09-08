# Contributing

Keep policy in the skill and mechanics in the adapter. Explain which user
decision a new instruction changes; avoid universal rules for one unusual case.

Install development tools with Bun, then run:

```sh
bun install --frozen-lockfile
bun test
bun run typecheck
bun run validate
bun run package
```

Source-reader changes need tests for the affected trust or snapshot contract.
Policy changes need a relevant case under `evals/go` and an honest behavioral
evaluation. Do not grade wording, length, or finding count. Preserve stable rule
IDs, or document the migration for team overrides.

Run reviews only against authorized source. Do not post example reviews to
other people's PRs. Never commit credentials, private source, or model logs
containing either. Report executed checks and unresolved limits in your PR.
