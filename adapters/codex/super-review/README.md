# Super Review

Independent readability and maintainability review for Go, TypeScript, Rust and Java.
Specialists examine distinct questions; the orchestrator verifies their evidence
and keeps every accepted recommendation. Works with GitHub PRs, local changes,
or an explicitly requested whole project.

The same plugin carries two experimental reviews for Rust that ask other
questions: [Defect Review](#defect-review-experimental-rust) hunts bugs, and
[Test Review](#test-review-experimental-rust) asks whether the tests would
notice a mistake. All three only read the code.

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

Cursor IDE: install the [native Cursor adapter](docs/cursor.md) from
`adapters/cursor/plugin`, then invoke `/super-review` in Agent chat. The guide
covers project-local and user-wide installation. The repository marketplace
manifest can be imported or submitted to Cursor; a public Marketplace listing
is a separate Cursor review.

Start a new task/session after installing or updating. No additional waiting-tool
configuration is needed. See [native integrations](docs/native-integrations.md)
for updates and removal of old configuration, and [OpenCode](docs/opencode.md)
for its standalone native adapter. A standalone skill archive is also available
from [releases](https://github.com/Dankosik/super-review/releases).

## Request a review

In Codex, select the plugin or invoke `$super-review` with a PR URL or local scope.
In Claude, use `/super-review:review`; in Cursor, use `/super-review` in the current
Agent chat, followed by that target. For example:

- Review this PR for readability and maintainability.
- Review all production Rust in the current project, excluding tests.
- Review my staged and unstaged changes, focusing on API clarity and naming.

Help explains usage without reading a target or starting specialist tasks. An
actual review uses the target already supplied in the request or context and asks
only when that target is missing. PRs use fixed base/head commits; working files use an identified snapshot. Local requests do not need an
invented PR. GitHub access is needed only for remote source; existing source can
be read locally. The plugin does not supply credentials or model subscriptions.

The default eight questions cover naming, control flow, function cohesion, data
flow, abstractions, duplication, API clarity and change locality. Representation
and rationale are selected when relevant; owner profiles deepen their questions.
Tests, generated/vendor code and unsupported languages are excluded. A targeted
request narrows coverage explicitly; missing work is never called clean.

## Frontend quality review

TypeScript/TSX reviews include source-selected profiles for **React 19, Next.js 16,
Tailwind CSS and shadcn/ui**. They focus on state ownership, cohesive interactions,
component contracts, server/client boundaries, explicit data paths, shared design
knowledge and primitive composition. The eight base questions still apply;
profiles deepen their existing owners instead of spawning four broad framework
reviewers. Native model selection is unchanged.

```text
$super-review Review my local TypeScript/TSX changes for readability and
maintainability in React 19, Next.js 16, Tailwind and shadcn/ui.
```

The stack is established per package from pinned source and configuration. No
automatic upgrades, memoization campaigns, forced Server Actions, design-system
rewrites or bug/accessibility/performance audits are added. Locally maintained
shadcn components are not excluded merely because a CLI originally copied them.
JavaScript/JSX, CSS and MDX remain outside standalone target coverage; theme CSS
and configuration can support recommendations about included TypeScript/TSX.
Missing local implementations or configuration are reported, not guessed.

See [routing and profile ownership](skills/super-review/references/frontend.md)
and the maintainer-only [research and evaluation cases](https://github.com/Dankosik/super-review/tree/main/evals/frontend).

## Spring and Spring Boot quality review

Java reviews select applicable Spring profiles for bean wiring/configuration,
application operations, HTTP contracts/errors, managed lifecycle and value shapes.
Each profile deepens one existing Java owner; there is no broad Spring agent,
new rule namespace or mandatory framework-wide pass. The eight base questions,
scoped team rules and native model selection remain unchanged.

```text
$super-review Review this Java/Spring PR for readability and maintainability.
Use only the Spring modules actually established in each owning module.
```

Compatibility includes Framework/Boot, the actual web and Spring Data modules,
Persistence API/provider, validation and serialization dependencies, not just JDK.
MVC, WebFlux and client-only WebClient use are distinguished. Clear interfaces,
transactional operations, constructors, annotations, entities and separate DTOs
are retained when their contracts justify them. No reactive migration, ORM change,
Spring Modulith adoption, universal mapper or interface-per-service is required.

See [Spring routing and owners](skills/super-review/references/spring.md) and the
maintainer-only [sources and contrasting cases](https://github.com/Dankosik/super-review/tree/main/evals/spring).
These additions do not claim measured model-quality gains from fixture checks.

## Defect Review (experimental, Rust)

A separate skill in the same plugin hunts bugs. Super Review stays about
readability and never reports defects; Defect Review never comments on
readability. They share no policy. [The family design](docs/review-family.md)
explains the split.

```text
/super-review:defects Review crates/infra-cache in the current project.
$defect-review Hunt for bugs in this PR.
```

Independent readers each take one lens, or a related pair for a small
change: results, boundaries, errors, time, lifecycle, shared state, stated
facts, team rules. A bug needs a trace
through the code (a trigger real use can produce, each step as a quoted line,
and what the affected party observes), a stated expectation with its basis, a
harm to someone, and survival of an independent challenge. Nothing has to be
written down in advance for something to be a bug, and a document that
describes harmful behavior does not make it right.

The challenge is what holds false positives down. A second agent gets each
claim with its trace and without the finder's reasoning, follows the trigger
through the source itself, and tries to show it is not a bug. When the
behavior is a deliberate choice whose stated reason holds, the finding is
reported as disputed, with the cost and the decision side by side.

Like Super Review, this skill only reads: it does not clone, copy, build or
run your project. Rust only, in Claude Code and Codex. See
[the design](docs/defect-review.md) and
[the contract](skills/defect-review/references/contract.md).

## Test Review (experimental, Rust)

A third skill asks whether the tests would fail if a plausible bug appeared.
It shares no policy with the other two.

```text
/super-review:tests Review the tests of crates/infra-cache in the current project.
$test-review Would the tests in this PR notice a mistake in what it changes?
```

A finding names a promised behavior that no test pins down and shows it with
a mutant (one small, plausible mistake in production code, as a diff that is
never applied), why each test that reaches that code would still pass, and a
witness: the check that holds for the original code and fails for the mutant.
The witness shows the mutant is a real behavior change, and it is the test to
add. A test that breaks a written team rule for tests, such as a fixed sleep
where the rule asks for synchronization, is proven by quoting both. Mutants
your tests catch are counted, not reported, and the review says what it did
not probe.

It only reads: it does not build or run your tests, so it is not a
mutation-score tool. Rust only, in Claude Code and Codex. See
[the design](docs/test-review.md) and
[the contract](skills/test-review/references/contract.md).

## Models and results

Codex keeps the user's orchestrator model and effort. Each specialist uses
GPT-6 Luna/medium for a bounded local question with complete context, or
GPT-6 Sol/medium for cross-file, uncertain, or preservation-sensitive work.
Claude Code uses Opus for the review command, orchestrator, and specialists;
effort follows the session setting. OpenCode uses the user's explicit provider/model.
Cursor specialists default to `inherit`, using the parent chat's model. Request a
specialist override in the prompt, such as "Для subagent используй <Cursor model ID>";
the adapter applies it through supported native per-call selection, or discloses
the capability gap without silently substituting. The chat model is not changed.
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
The file is optional: confirmed absence uses defaults. Failed access is a policy
gap, not permission to assume defaults or use a PR's proposed replacement.
See [the contract](skills/super-review/references/team-rules.md) and
[examples](examples/team-rules/SUPER_REVIEW.md). All 44 `go.*`, `ts.*`, `rust.*`
and `java.*`
rule IDs remain unchanged in version 3.

[Validation](docs/validation.md) separates package checks from model evidence.
The [instruction audit](docs/instruction-audit.md) explains the unreleased 3.0.1
scope corrections, retained coverage defaults and unexecuted evaluation cases.
[Design](docs/design.md) · [Contributing](CONTRIBUTING.md) · [Privacy](PRIVACY.md) ·
[Changelog](CHANGELOG.md) · [MIT License](LICENSE)
