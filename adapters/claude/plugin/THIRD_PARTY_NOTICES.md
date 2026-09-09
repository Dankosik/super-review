# Third-party notices

Super Review's instructions and examples are original work, informed by:

- [Dankosik/golang-backend-skills](https://github.com/Dankosik/golang-backend-skills),
  MIT: concise, outcome-oriented guidance on contracts, clarity, and justified reuse.
- [Go Code Review Comments](https://go.dev/wiki/CodeReviewComments) and
  [Effective Go](https://go.dev/doc/effective_go): language background. No extended
  passages are copied.
- [OpenCode documentation](https://opencode.ai/docs/) and
  [OpenCode source](https://github.com/anomalyco/opencode), MIT: native command,
  agent, permission, skill, and custom-tool interfaces.
- [Agent Skills](https://agentskills.io): portable skill layout.

The OpenCode adapter imports `@opencode-ai/plugin`, distributed under its own
license. Dependency versions and transitive licenses remain in the package
metadata and lockfile. Super Review does not bundle third-party model weights,
tokens, or a copy of an agent runtime.

The native reader bundles `@modelcontextprotocol/sdk` (MIT), Zod (MIT), and
their bundled transitive code. Claude/Codex distributions include `runtime/THIRD_PARTY_LICENSES.txt`.
The UX reference study links the inspected tools; their prompts are not copied.
