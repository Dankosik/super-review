# Super Review

Focused review of **readability, idiomatic Go, and maintainability** in a GitHub
pull request. One skill coordinates independent specialist passes, verifies the
candidates, and produces a complete Markdown report. It does not edit the code.

Super Review reviews how the implemented solution is expressed. Bug hunting,
security review, product validation, and test coverage are separate work.
A clear change can produce no recommendations.

## Install in OpenCode

Use an existing [OpenCode](https://opencode.ai) setup with a configured model and
[GitHub CLI](https://cli.github.com) access. Super Review has no model client,
account, API key, or server of its own.

Download a fixed release into a new directory:

```sh
mkdir -p "$HOME/.local/share/super-review/1.0.0"
gh release download v1.0.0 --repo Dankosik/super-review \
  --pattern super-review-1.0.0-opencode.zip \
  --dir "$HOME/.local/share/super-review/1.0.0"
unzip "$HOME/.local/share/super-review/1.0.0/super-review-1.0.0-opencode.zip" \
  -d "$HOME/.local/share/super-review/1.0.0"
```

Launch OpenCode from a **trusted directory outside the PR checkout**, with the
release's config directory:

```sh
mkdir -p "$HOME/.local/share/super-review/reviews"
cd "$HOME/.local/share/super-review/reviews"
OPENCODE_CONFIG_DIR="$HOME/.local/share/super-review/1.0.0/opencode" opencode --pure
```

Then run:

```text
/super-review https://github.com/OWNER/REPO/pull/123
```

The command selects the primary review agent; one reusable specialist role runs
each assigned lens in a fresh child context. Your existing model remains the
default. Model overrides belong in your OpenCode configuration, not in the skill.

The archive contains all skill resources and the OpenCode adapter. OpenCode
loads its small tool dependency through its normal config-directory dependency
mechanism. See [adapter details](docs/opencode.md) and [validation](docs/validation.md)
for the tested version and actual limits.

## What you get

A report tied to target commit B, head H, and comparison base D, with:

- Applied Go and team rules, coverage, and any unfinished areas.
- Every accepted recommendation, its evidence, counterargument, and properties
  to preserve.
- A file map, real implementation dependencies, and a compact decision record.

Eight lenses cover naming, control flow, function cohesion, data flow,
abstractions, duplication, API clarity, and change locality. They have distinct
questions; they are not eight agents repeating a general code review.

## Team conventions

Add `SUPER_REVIEW.md` to the reviewed repository. For example:

```markdown
## team.go.linear-flow
Language: Go
Paths: internal/importer/
Lens: function-cohesion
Action: refine go.functions.extract-for-clarity

Keep linear conversion steps together unless a helper names an independent
concept. We value local reading; a function's length alone does not justify
extraction.
```

Rules can add, refine, override, or disable named style rules. Paths are exact
files or directory prefixes; overlapping conflicts are reported rather than
silently ordered. Policy is read from **B**, so a PR cannot quietly weaken its
own review. See [the rule contract](skills/super-review/references/team-rules.md)
and [examples](examples/team-rules/SUPER_REVIEW.md).

## Updating

Install the next version in another directory and change `OPENCODE_CONFIG_DIR`
for a new review session. Keep the old directory to roll back. Do not update a
running review. This does not overwrite your team's `SUPER_REVIEW.md` or model
configuration.

The skill-only ZIP is portable instruction content. Installing it in another
harness does **not** install OpenCode's tool restrictions or prove equivalent
delegation. OpenCode is the v1 adapter; other harness integrations are unverified.

## Boundaries

The review roles deny unlisted tools, including shell, edits, arbitrary local
reads, MCP tools, and other agent roles. A small source reader makes fixed
GitHub GET requests through your configured `gh`; it never checks out or executes
the target project. This is a tool boundary, not an operating-system sandbox.
Only run trusted OpenCode configurations and adapter code.

GitHub's 300-file comparison cap, missing source, failed specialists, or policy
conflicts can make coverage partial. The report says so. Recommendations are
not tested behavioral equivalence or proof of overall code quality.

[Design decisions](docs/design.md) · [Contributing](CONTRIBUTING.md) ·
[Changelog](CHANGELOG.md) · [License](LICENSE)
