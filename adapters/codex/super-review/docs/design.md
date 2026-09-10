# Design

Super Review is a skill, not an agent runtime. The canonical policy lives in
`skills/super-review`; adapters define native role configuration and tool routing.
Version 3 removes the bundled MCP reader, immutable-receipt cache and completion
store. No replacement custom transport or background service is introduced.

The host provides source access and independent tasks. Shared source-access
instructions identify PR revisions or local file snapshots, preserve the user's
checkout, and distinguish reviewed source from trusted skill resources. Specialists
receive complete neutral task packets and return full reports through native
agent results. The orchestrator verifies and reconciles evidence.

Quality criteria, language routing, eight base questions, contextual aspects and
33 stable rule IDs remain. A missing native facility is disclosed as a coverage
gap; there is no fabricated independent review or silent fallback to live bytes.

The tradeoff is explicit: there is no fixed reader allowlist, plugin-enforced
source filter, fixed batch deadline or report receipt. Source exclusion and
read-only scope are instructions, backed by whichever host sandbox is selected.
Mechanical package checks and native configuration probes verify installation
and tool availability; model exercises provide separate behavioral evidence.

`scripts/build.ts` generates Codex and Claude packages by copying canonical files.
`scripts/package.py` produces deterministic ZIPs and a commit/hash manifest.
No runtime dependencies are installed by consumers. Development uses Bun only
for package validation/tests and TypeScript diagnostics.
