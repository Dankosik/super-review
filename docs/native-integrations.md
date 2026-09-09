# Claude Code and Codex

The native plugin contains the skill, source reader, and host-specific metadata.
Use your existing harness authentication and model settings. The local Node
bridge performs fixed GitHub GET requests through `gh`; it contains no model
client or hosted endpoint. Consumer dependencies: Node.js 20+ and GitHub CLI.

Tested command surfaces: Claude Code 2.1.227 and Codex CLI 0.153.4. Live model
execution and any account limitation are recorded in [validation](validation.md).
Claude's command uses foreground skill isolation and nested specialist delegation;
older versions without those capabilities need an update.

## Claude Code

Install from the author catalog as shown in the README. The only user-facing
skill is `/super-review:review`. A dedicated orchestrator runs in a separate
context; each specialist gets a fresh context with one lens. Model/effort choices
remain the user's. The orchestrator exposes native delegation and the reader;
specialists expose only source, diff, search, and resource reads. No review role
exposes Bash, file editing, web tools, or unrelated MCP tools.

Update and remove with native commands:

```sh
claude plugin marketplace update dankosik-skills
claude plugin update super-review@dankosik-skills
claude plugin uninstall super-review@dankosik-skills
```

Start a new session after an update. The platform publishing account and Claude
Code model access are separate: an account can submit a plugin without having
an active Claude Code subscription or API credit.

## Codex

Select Super Review from installed plugins in a new task, or use
`$super-review` with a PR URL. The current task coordinates native child agents.
The plugin does not add an alternative agent runtime or create new sidebar tasks
through the app's task-creation API.

The source reader is read-only with respect to GitHub. Codex retains its normal
host tool permissions; installing this skill does not restrict every other tool
in an existing coding task. The review instructions require using the reader and
native delegation only. For an additional host boundary in the CLI, start a
review session with `codex --sandbox read-only`.

```sh
codex plugin marketplace upgrade dankosik-skills
codex plugin add super-review@dankosik-skills
codex plugin remove super-review@dankosik-skills
```

Start a new task after installation or an update so skills and MCP tools reload.
The IDE extension's standalone-skill discovery does not install this native plugin.

## Snapshot sharing

Codex child agents can start separate reader processes. Native readers therefore
share issued snapshot receipts in a private temporary directory owned by the OS
user. Files use mode 0600 under a mode 0700 directory on Unix. Receipts contain
PR identity, immutable B/H/D, changed filenames, and patches; they never contain
credentials. A child reads that issued snapshot rather than repinning a moving PR.

Receipts expire for new readers after 24 hours. On new snapshots, the cache
prunes old valid receipts toward 128 records and a 64 MiB budget; concurrent
processes can temporarily exceed those cleanup targets. Missing, malformed,
expired, or inaccessible receipts are explicit errors. This shares source
identity, not the agent's conversation or a guarantee of review resume.

OpenCode keeps its in-process receipt handling. All adapters preserve the same
source limits and policy-at-B semantics.

## Direct project catalog and local development

The project also carries native catalogs named `super-review`. They are useful
when testing a fixed checkout. Avoid installing the same plugin from both the
author catalog and the project catalog in normal use.

```sh
codex plugin marketplace add /absolute/path/to/super-review
codex plugin add super-review@super-review
claude plugin marketplace add /absolute/path/to/super-review
claude plugin install super-review@super-review
```

The author catalog pins released commits; a local project catalog tracks your
prepared local package. Do not update a package while a review is running.
