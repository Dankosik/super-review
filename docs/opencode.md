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

The command uses a primary agent with `subtask: false`. No model is hardcoded.
Use your own OpenCode model settings. There are no model HTTP clients or
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
