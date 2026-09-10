# Super Review

A focused review of **readability, idiomatic Go and Java, and maintainability** in a GitHub
pull request. Give it a PR URL; independent specialists inspect the selected
aspects, and the main agent verifies their recommendations before returning a report.
Clear code can produce no recommendations. Source is never refactored by the skill.

## Install once

Use a configured model in your preferred harness and GitHub access through
[`gh`](https://cli.github.com). Claude Code and Codex also need Node.js 20+ to run
the bundled source reader. No publisher account, model client, or hosted service
is involved. The reader is bundled; there is no `npm install` step for consumers.

### Claude Code

```sh
claude plugin marketplace add Dankosik/agent-skills-marketplace
claude plugin install super-review@dankosik-skills
```

Start a new session, then:

```text
/super-review:review https://github.com/OWNER/REPO/pull/123
```

### Codex

```sh
codex plugin marketplace add Dankosik/agent-skills-marketplace
codex plugin add super-review@dankosik-skills
```

Start a new task and select **Super Review** from installed plugins, or invoke its
skill explicitly:

```text
$super-review Review https://github.com/OWNER/REPO/pull/123
```

For completion waiting without wrapper polling, enable the one-time
[Codex host setting](docs/completion-waiting.md#one-time-host-setting). It keeps
only Super Review's wait tool outside code mode. The package includes a setup
helper that preserves existing settings.

If you already added Dankosik Skills, refresh that catalog instead of adding it
again. Claude uses `claude plugin marketplace update dankosik-skills`; Codex uses
`codex plugin marketplace upgrade dankosik-skills`.

OpenCode keeps its native primary-agent adapter and `/super-review <PR URL>`
command. Use the [OpenCode installation guide](docs/opencode.md). The standalone
skill ZIP contains portable instructions; it does not install a harness adapter.

## Choose what to review

The default considers eight base lenses for every changed Go or Java area, then selects
contextual aspects from inspected source. Two conditional lenses cover
**representation** (data/state shapes) and **rationale** (supported explanations
of non-obvious choices). Four profiles deepen an existing lens: lifecycle
ownership, dependency boundaries, effects separation, and error expression.

Profiles are on-demand guidance, not four extra mandatory agents or model
profiles. See the compact [aspect catalog](skills/super-review/references/aspects.md).
A resource or a struct makes a question relevant, not the code defective.
Narrow or extend the scope in ordinary language:

```text
Review only internal/payments/ and the supporting context it needs.
Focus on naming and control flow. Write the report in Russian.
Also check representation, but exclude rationale.
Review only lifecycle ownership in internal/worker/.
```

A targeted review lists other aspects as not requested. It does not quietly call
them checked. A profile-only request covers that narrower question, not all of
its owning lens. Missing context or an applicable check that could not run makes
coverage partial, never silently clean. No special flags or model configuration
are needed. Additional aspects remain within the same read-only Go and Java review scope.

Invoke Super Review without a PR URL to get launch guidance and a reader check.
Missing GitHub access or unavailable delegation is reported directly. Installation
does not supply a paid Claude subscription or change your model/provider settings.

## Models and cost

The orchestrator keeps your current model and effort. Codex specialists use
**Terra/medium** by default; request the **economy** profile for **Luna/medium**.
Claude specialists use **Sonnet/medium**. OpenCode asks you to select a specialist
model from your configured provider once. No global model setting is changed.
See [profiles](docs/model-profiles.md) and the [measured study](docs/model-study.md)
for exact behavior and the limits of the available quality evidence.

With the required host settings, the orchestrator waits inside a tool. Codex collects a
whole group's reports in one blocking call; Claude and OpenCode use foreground
native delegation. The workflow excludes routine status polls and reminder turns. See
[completion waiting](docs/completion-waiting.md) for the tested behavior and limits.

## Read and use the report

The outcome comes first. Each accepted recommendation then explains:

- The exact source location and the concrete reading or maintenance cost.
- The proposed change, its benefit, and the strongest reason to keep the code.
- The behavior, API, ordering, or resource properties to preserve.

The report retains every accepted recommendation, a file map, actual specialist
coverage, effective team rules, and unresolved gaps. Give accepted items to your
coding agent for implementation and testing. Super Review neither edits source
nor posts GitHub comments.

The eight base lenses cover naming, control flow, function cohesion, data flow,
abstractions, duplication, API clarity, and change locality. Conditional lenses
add distinct questions; selected profiles deepen their owners. Specialists have
separate contexts and distinct questions. The main agent checks their candidates;
agreement or confidence alone is not evidence.

## Team conventions

Add `SUPER_REVIEW.md` to the reviewed repository. For example:

```markdown
## team.go.linear-flow
Language: Go
Paths: internal/importer/
Lens: function-cohesion
Action: refine go.functions.extract-for-clarity

Keep linear conversion steps together unless a helper names an independent
concept. We value local reading; function length alone does not justify extraction.
```

Rules can add, refine, override, or disable named style rules within exact files
or directory prefixes. Policy comes from the pinned target commit, so a PR's
proposed rule change does not automatically govern its own review. Conflicting
rules are disclosed. See [the rule contract](skills/super-review/references/team-rules.md)
and [examples](examples/team-rules/SUPER_REVIEW.md).

## Support and updates

[Native integration details](docs/native-integrations.md) describe tested versions,
permissions, and update/removal commands. [Validation](docs/validation.md) separates
mechanical checks from model execution. Languages other than Go and Java, and GitHub Enterprise,
are not supported. Missing source, API caps, or unfinished specialists make the
affected coverage partial.

Bug hunting, security assessment, product validation, and test coverage are
outside this review. Proposed refactoring equivalence is not tested. A complete
plan is not a guarantee of finding every possible improvement.

[UX references](docs/ux-reference-study.md) · [Design](docs/design.md) ·
[Contributing](CONTRIBUTING.md) · [Privacy](PRIVACY.md) · [Changelog](CHANGELOG.md) ·
[MIT License](LICENSE)

## Java support

Java uses the same eight base lenses, two conditional lenses and four owner
profiles as Go, with separate `java.*` rules and language-specific task packets.
Maven/Gradle module and source-set baselines constrain advice; records, streams,
Optional, builders and interfaces are not mandatory upgrades. Mixed Go/Java PRs
keep each language's rules and coverage distinct.

The reader accepts production `.java` and supporting build metadata, excluding
known test/generated roots without executing project code. Custom source sets
and unavailable framework/build contracts remain explicit context gaps. See
[Java design and sources](docs/java-review.md) and the
[Java team-rule example](examples/team-rules/java.md).
