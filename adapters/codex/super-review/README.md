# Super Review

Independent readability and maintainability review for Go, TypeScript and Rust.
Specialists examine distinct questions; the orchestrator verifies their evidence
and keeps every accepted recommendation. Works with GitHub PRs, local changes,
or an explicitly requested whole project.

Super Review 3 uses native file/search, Git/GitHub and agent tools. It ships no
MCP server, custom source reader, result daemon or consumer dependencies. The
review instructions remain read-only; the host's permissions govern its tools.

## Install

Codex:

```sh
codex plugin marketplace add Dankosik/agent-skills-marketplace
codex plugin add super-review@dankosik-skills
```

Claude Code:

```sh
claude plugin marketplace add Dankosik/agent-skills-marketplace
claude plugin install super-review@dankosik-skills
```

Start a new task/session after installing or updating. No additional waiting-tool
configuration is needed. See [native integrations](docs/native-integrations.md)
for updates and removal of old configuration, and [OpenCode](docs/opencode.md)
for its standalone native adapter. A standalone skill archive is also available
from [releases](https://github.com/Dankosik/super-review/releases).

## Request a review

In Codex, select the plugin or invoke `$super-review` with a PR URL or local scope.
In Claude, use `/super-review:review` followed by that target. For example:

- Review this PR for readability and maintainability.
- Review all production Rust in the current project, excluding tests.
- Review my staged and unstaged changes, focusing on API clarity and naming.

Without a target, the skill asks what source to review. PRs use fixed base/head
commits; working files use an identified snapshot. Local requests do not need an
invented PR. GitHub access is needed only for remote source; existing source can
be read locally. The plugin does not supply credentials or model subscriptions.

The default eight questions cover naming, control flow, function cohesion, data
flow, abstractions, duplication, API clarity and change locality. Representation
and rationale are selected when relevant; owner profiles deepen their questions.
Tests, generated/vendor code and unsupported languages are excluded. A targeted
request narrows coverage explicitly; missing work is never called clean.

## Models and results

The orchestrator retains the user's model and effort. Codex specialists use
Terra/medium by default, or Luna/medium for an explicitly requested economy profile.
Claude specialists use Sonnet/medium; OpenCode uses the user's explicit provider/model.
See [model profiles](docs/model-profiles.md). Delegation and result collection use
native host facilities, with no plugin-owned timer or result store.

Each recommendation identifies the source, demonstrated improvement, proposed
change and relevant preservation constraints. The report includes file coverage,
all candidate decisions and useful unresolved observations. A useful review may
recommend a local clarification or a structural improvement, or retain clear code.
Hand accepted recommendations to a coding task for implementation and testing.

Super Review does not run project code/checks or post comments. It does not assess
bugs, security, product requirements or test coverage, and does not claim tested
refactoring equivalence. Completed coverage is not exhaustive discovery.

## Team conventions

Use root `SUPER_REVIEW.md` with explicit language, paths, lens and action. Rules
may add, refine, override or disable a stable rule within their declared scope.
PR policy comes from the target commit; local policy uses the recorded revision.
See [the contract](skills/super-review/references/team-rules.md) and
[examples](examples/team-rules/SUPER_REVIEW.md). All 33 `go.*`, `ts.*` and `rust.*`
rule IDs remain unchanged in version 3.

[Validation](docs/validation.md) separates package checks from model evidence.
[Design](docs/design.md) · [Contributing](CONTRIBUTING.md) · [Privacy](PRIVACY.md) ·
[Changelog](CHANGELOG.md) · [MIT License](LICENSE)
