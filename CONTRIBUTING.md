# Contributing

Keep policy in the skill and mechanics in native adapter configuration. Explain
which user decision an instruction changes. Preserve stable rule IDs or document
migration; keep evaluation expectations and raw model outputs outside runtime
instructions. Read-only reviews and development of this repository are distinct.

Install development tools with Bun, then run:

```sh
bun install --frozen-lockfile
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

Codex and Claude install trees are generated. Edit canonical skill files and
adapter templates, then rebuild; do not edit delivery copies. Version 3 ships no
custom source-reader runtime. Use native host tools in review instructions.

Before releasing, verify the exact commit, publish its tag and packages, and
update Super Review's version/SHA in the author marketplace's catalog.json.
Run that repository's catalog generator and remote identity checks, then publish
its updated pin. A GitHub release alone does not update marketplace consumers.

Do not publish credentials or private source in evaluation logs. Review code
only when authorized, and do not post reviews to other people's PRs.
