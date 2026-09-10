> Historical design/evaluation record. For version 3 source access and installation, see [native integrations](native-integrations.md).

# Prompt and context boundaries

This unreleased instruction change keeps Super Review's eight base questions,
conditional aspects, Go rules, read-only scope and model defaults. It changes
how evidence moves between roles, not the source reader or completion barrier.
No new runtime, storage permission, dependency, model client or release is added.

## Decisions

The contract owns the common evidence/acceptance bar. A specialist reports a
source-backed observation and distinguishes an uncertain remedy; the orchestrator
alone accepts an implementation change. This avoids requiring every specialist
to settle cross-lens design before the observation can be considered, without
admitting speculative smells or promoting unresolved remedies to coding tasks.

The workflow defines a neutral packet: identity, assignment and materials. Full
matching resources already supplied to a receiving context count as read. A path,
summary or partial snippet does not. Each child still receives its own contract;
sharing context across roles is not a reason to omit it. Loading all profiles,
replaying the parent conversation or passing peer verdicts remains inappropriate.

The result template puts snapshot, policy, scope and coverage once in a task
header. Candidates keep their own source anchors, burden, remedy and constraints.
A block forwarded alone carries its header/identity. Coverage and dispositions
are separate: completed inspection may yield an unresolved remedy, while missing
required source never becomes a completed no-candidate task. An unresolved remedy
can lack evidence or a genuinely necessary team choice between supported options;
do not invent a source gap to express the latter. Ordinary engineering decisions
remain the reviewer's responsibility.

Priority is explicit within the host's authority: product restrictions, user task
selection, effective scoped team policy, then defaults. Code and PR comments are
evidence, not permissions. Local conflicts/gaps defer dependent advice only.
Read existing evidence before requesting a user choice; a needed specialist
continuation gets a fresh assignment, never an overwritten terminal report.

In-session compaction retains decisions and retrievable evidence as well as IDs.
It does not create persistence. Lost receipts/results remain gaps; OpenCode process
restart needs a new review. No file write or additional tool is authorized by a
handoff summary. Without harness support, automatic recovery is not claimed.

## Instruction ownership and provenance

| Home | Responsibility |
| --- | --- |
| `review-contract.md` | Product scope, authority, acceptance, status meaning and instruction identity. |
| `lenses/*.md` | The specific engineering question and its decision criteria. |
| `languages/go.md` | Shared Go context and transformation-sensitive preservation. |
| `workflow.md` | Assignment, evidence movement, decisions and supported continuation. |
| `assets/*template.md` | Required result fields, compact internally and complete at handoff. |
| Harness adapters | Actual tools, model routing, concurrency, waiting and host limits. |
| `evals/` | Behavioral comparisons and evaluator-only expectations. |

Repeat a norm for an independent recipient or a useful local implication, not to
reinforce it everywhere. Go details such as defer boundaries, promoted methods and
error identity remain intact. Packaged copies are delivery artifacts, not additional
instructions loaded into one context. No percentage text-reduction target is used.

Instruction identity is separate from source B/H/D. Record a trusted installed
package revision or resource digest when exposed, plus the semantic version.
The existing release manifest includes a commit and archive hashes, but this change
does not pretend every reader exposes them or add a provenance API. With only a
version, record `content identity unverified`. Complete material from the same
trusted delivery remains reusable; a missing digest alone neither invalidates
source coverage nor justifies repeated tool calls. Resolve actual material conflicts
through the installed reader, never invented hashes or PR-supplied metadata.

## Examples and delegation

Prefer expressive tool interfaces to repetitive usage examples. Team-designated
code references serve a different purpose: they convey a particular convention.
The optional `Code reference` prose in a written team rule points to repository-local
Go source at the pinned policy revision, names a symbol and explains the illustrated
choice. Load it selectively for that rule. The example cannot add rules, override
scope, revive disabled advice or command tools. A missing optional illustration
limits only advice depending on it; a self-contained rule remains usable.
See [the sample policy](../examples/team-rules/SUPER_REVIEW.md).

All adapters execute the selected independent plan, including required base questions,
and add only source-justified continuations. Neither more nor less delegation is a
universal rule for a harness. Model-specific adjustments need evidence from the actual
model/effort configuration; defaults, concurrency and permissions remain unchanged.
The orchestrator's evidence verification and cross-lens reconciliation are product
work, not a redundant generic self-check round.

## Routing experiment: not a new default

The production workflow still reads each included declaration before delegation.
A [separate evaluator-only variant](https://github.com/Dankosik/super-review/blob/d8e76eb19f42b6ea4bc1928dfcccc5672f8d1cf7/evals/go/experiments/routing-first.json)
replaces exactly that paragraph with routing-sufficient preparation. It keeps full
specialist inspection and candidate verification, requires expanding uncertain
applicability reads, and cannot infer non-applicability from absent source.
It is not packaged as a skill or an automatic mode.

First compare `main` at `0592ee207d34b32c4ef451ad09f6aeeabacce20f` with PR #4 at
`e2d9e65c021c02fefd0f04e90c84f0acff3667d8`; then compare PR #4 with this follow-up;
then compare this follow-up with the routing-only variant. Holding other inputs
fixed avoids attributing combined changes to routing. Promote that variant only
after inspecting missed aspects, useful recommendations, noise and native traces,
not merely a lower token count. Team-reference adoption is similarly compared with
and without a relevant optional illustration, keeping the written rule fixed.

## Sources and evidence limits

Consulted on 2026-09-10:

- [Thariq Shihipar, The new rules of context engineering for Claude 5 generation models](https://claude.com/blog/the-new-rules-of-context-engineering-for-claude-5-generation-models),
  Anthropic, July 24, 2026: contextual judgment, progressive loading, interface design,
  deduplication and richer references. The reported prompt reduction is their result,
  not an 80% reduction target for this project; the tool-example discussion is not
  a general ban on code examples. This official publication is now the consulted
  source; the [requested X page](https://x.com/trq212/article/2080710971228918066)
  remains directly inaccessible and is not claimed to have been retrieved.
- [OpenAI model guidance](https://developers.openai.com/api/docs/guides/latest-model),
  currently the GPT-6 Astra section: clear priorities, authorized follow-through,
  explicit delegation and proportionate verification. These model-specific observations
  do not establish identical behavior in the configured Terra, Luna or Sonnet workers.
- [Anthropic context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
  is supplemental background on task-local evidence, progressive loading and handoffs.
- [Anthropic Opus 5 prompting](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5)
  is supplemental model-specific guidance, not proof about Sonnet or every Claude host.

The earlier source limitation is superseded only for the official Anthropic article,
not for direct access to X. No model-backed A/B run was performed for this follow-up.
Expected gains remain hypotheses. [The existing protocol](https://github.com/Dankosik/super-review/blob/e2d9e65c021c02fefd0f04e90c84f0acff3667d8/evals/go/prompt-context-evaluation.md)
and [follow-up comparisons](https://github.com/Dankosik/super-review/blob/d8e76eb19f42b6ea4bc1928dfcccc5672f8d1cf7/evals/go/context-followup-evaluation.md) separate
judgment, native traces and mechanical checks, and require realistic positive and
clear-code PRs plus untouched holdouts before general quality claims.
