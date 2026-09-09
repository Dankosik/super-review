# OpenCode adapter

The release's `opencode/` folder is a native config directory. Set
`OPENCODE_CONFIG_DIR` to its absolute path; OpenCode discovers the skill, two
agent definitions, command, and custom tools there. No existing config file needs
to be replaced. The package uses `@opencode-ai/plugin` 1.18.29.

Use a trusted empty launch directory outside the reviewed checkout. That keeps
PR-authored OpenCode configuration, tools, plugins, and instructions out of the
startup path. `--pure` disables external plugins; managed configuration and the
harness itself still retain authority. A global plugin or administrator can
change the effective environment, so the adapter is not an OS sandbox.

## Install and launch

Select the specialist model once using [model profiles](model-profiles.md).
Version 2 requires this choice instead of silently inheriting the primary model.
Then download the versioned OpenCode ZIP and extract it once:

```sh
mkdir -p "$HOME/.local/share/super-review/2.0.0"
gh release download v2.0.0 --repo Dankosik/super-review \
  --pattern super-review-2.0.0-opencode.zip \
  --dir "$HOME/.local/share/super-review/2.0.0"
unzip "$HOME/.local/share/super-review/2.0.0/super-review-2.0.0-opencode.zip" \
  -d "$HOME/.local/share/super-review/2.0.0"
"$HOME/.local/share/super-review/2.0.0/opencode/super-review" https://github.com/OWNER/REPO/pull/123
```

The launcher selects the review agent, config directory, and a trusted launch
directory automatically. Run it without arguments to open the agent, then use
`/super-review <PR URL>`. Install a newer release in its own directory
and start a new review session to update; keep the old directory for rollback.
No existing team rules or model settings are overwritten.

## Tools

| Tool | Responsibility |
| --- | --- |
| `super_review_snapshot` | Pin PR identity and B/H/D; first changed-file page. |
| `super_review_files` | Continue the changed-file inventory. |
| `super_review_diff` | Read a window of one immutable patch. |
| `super_review_source` | Read numbered source or policy at B/H/D. |
| `super_review_search` | Find literal uses at H in pages of 20 Go files. |
| `super_review_resource` | Load a named resource from the installed skill. |

The source reader invokes `gh api --hostname github.com --method GET` with
validated, enumerated endpoint shapes through an argument array, never a shell.
It reads existing GitHub access through `gh`; it does not read token files.
GitHub Enterprise host selection is not supported in v1.

Source is limited to regular Go files, `go.mod`, and Markdown policy context.
Follow `nextLine` and `nextOffset`; missing data does not mean no findings.
Source text is cached within the process under a 16 MiB byte budget. Search
reads up to four uncached blobs concurrently and retains deterministic file order.
Files above 1 MiB, binary content, symlinks, generated source, and unsupported
paths are explicit exclusions. A line too large for safe output is a context
gap. Search returns line locations; additional matches require source inspection.

GitHub comparisons include at most 300 changed files. At that boundary the
inventory is conservatively partial, even if the actual PR happens to contain
exactly 300 files. Recursive Git trees can also be truncated. No general complete
large-repository coverage is claimed.

## Permissions and execution

The primary role has the source tools, its skill, question, and Task limited to
`super-review-specialist`. Specialists have only source/diff/search/resource tools.
Unlisted tools are denied, including shell, edit/write, arbitrary file reading,
MCP tools, web access, and recursive delegation.

The command uses a primary agent with `subtask: false`. The orchestrator keeps
the user's primary model. The specialist model is explicitly supplied through
`SUPER_REVIEW_SPECIALIST_MODEL`, from the saved selection or launch environment. There are no model HTTP clients or
subscription adapters in Super Review.

Native harness/session caches and dependency setup may write in the trusted
launch/config directories. The reviewed repository is never checked out,
executed, or modified by the source reader.

## Troubleshooting

A GitHub read failure needs existing `gh` access, repository visibility, or rate
limit repair by the owner. Do not acquire credentials from another application.
An unknown receipt means the original OpenCode process is unavailable; start a
new review with a new snapshot rather than claiming transparent resume.

See [validation](validation.md) for exact tested capabilities.
