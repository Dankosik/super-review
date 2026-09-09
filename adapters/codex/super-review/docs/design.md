# Design decisions

## One skill, native adapters

The product is review policy and a workflow inside an existing harness. Models,
delegation, sessions, and authentication remain the selected harness's responsibility.
There is one specialist role; each invocation gets one lens and a fresh context.

The entrypoint states purpose, boundaries, and resource routing. Lens-specific
rules stay in their own files. Stable rule IDs make team overrides explainable.

## Changes from the initial proposal

- Team scopes use exact files and directory prefixes rather than glob precedence.
  This avoids a configuration language and ambiguous overlapping patterns.
- Reports keep the required evidence together in compact cards. A field-rich
  protocol does not require a heading for every sentence.
- Read-only acquisition uses a small native custom tool. A broad shell allowlist
  is too weak for the stated source-protection boundary. The tool implements only
  fixed GitHub GET routes through `gh`; it contains no model or agent execution.
- Source, diff, inventory, and search responses are paginated so a large response
  cannot silently stand in for full coverage. GitHub-imposed limits are explicit.
- Output stays in the harness conversation. The default role has no write tool;
  exporting a report is a user/harness action outside the target repository.

## Snapshot semantics

B is the target commit reported by the PR API; H is the PR head. A comparison
between those immutable commits supplies D, their merge base. Team policy uses
B, while code uses H and changes use D-to-H. Fork source is read from the head
repository. Deleted or inaccessible fork objects can limit the review.

Source readers walk immutable Git trees and fetch regular blobs. They exclude
symlinks, submodules, tests, generated Go, binaries, and oversized files.
OpenCode receipts belong to its process. Native MCP readers share a private
temporary receipt cache because Codex children can start separate reader
processes. This preserves immutable source identity; it does not resume an agent
conversation.

## Evidence and acceptance

A model's confidence, agreement between reviewers, and output length do not
establish a recommendation. The orchestrator checks the actual code and a
counterargument, then reconciles all accepted changes. Only accepted changes
appear as implementation tasks; unresolved coverage stays visible.

Source analysis constrains advice but does not prove equivalence. This project
does not expand into bug, security, requirements, or test-coverage review.

## Native distribution

The Codex plugin uses the root skill and bundled Node reader. The Claude install
tree is generated from the same policy with a short native command and two
agent definitions. Generated files are checked for drift before release. The
shared policy does not contain duplicated harness configuration.

## Sources checked

OpenCode 1.18.29 and its [agents](https://opencode.ai/docs/agents/),
[commands](https://opencode.ai/docs/commands/),
[permissions](https://opencode.ai/docs/permissions/),
[custom tools](https://opencode.ai/docs/custom-tools/),
[skills](https://opencode.ai/docs/skills/), and
[config directory](https://opencode.ai/docs/config/#custom-directory) documentation
were inspected during implementation. See the validation record for execution
evidence; documentation alone is not integration proof.
