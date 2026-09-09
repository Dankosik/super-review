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
required source never becomes a completed no-candidate task.

Priority is explicit within the host's authority: product restrictions, user task
selection, effective scoped team policy, then defaults. Code and PR comments are
evidence, not permissions. Local conflicts/gaps defer dependent advice only.
Read existing evidence before requesting a user choice; a needed specialist
continuation gets a fresh assignment, never an overwritten terminal report.

In-session compaction retains decisions and retrievable evidence as well as IDs.
It does not create persistence. Lost receipts/results remain gaps; OpenCode process
restart needs a new review. No file write or additional tool is authorized by a
handoff summary. Without harness support, automatic recovery is not claimed.

Generic repeat instructions were consolidated in the contract, workflow and result
format. Local Go consequences such as defer boundaries, promoted methods and error
identity remain intact. The goal is useful context, not a percentage text reduction.
Packaged skill copies remain identical; they are delivery artifacts, not extra
instructions to load. Runtime examples are added only for observed recurring errors,
not by importing evaluator rubrics into prompts.

Adapter guidance reinforces required independent dispatch in Codex and bounds extra
delegation/repeated self-review in Claude, without guessing the selected model or
applying one model's quirks to another. OpenCode explicitly reuses supplied resources
and preserves its process-bound receipt limitation. All existing default profiles,
concurrency, direct waiting, tools and permissions remain unchanged. Core candidate
verification is necessary reconciliation, not a redundant generic self-check.

## Source rationale and limits

Consulted on 2026-09-10:

- [OpenAI model guidance](https://developers.openai.com/api/docs/guides/latest-model)
  describes model-sensitive delegation and instruction following. Use it to locate
  adapter concerns, not to silently change model defaults or rewrite host authority.
- [Anthropic context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
  motivates task-local evidence, progressive loading and compact handoffs.
- [Anthropic Opus 5 prompting](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5)
  motivates separating discovery from final filtering and avoiding redundant
  delegation/verification. These observations do not establish behavior for every
  Claude model, including the configured Sonnet specialist.

The requested [X article](https://x.com/trq212/article/2080710971228918066) was not
available in full during the preceding analysis. No unverified thesis is attributed
to it; the official Anthropic sources above are supplemental, not its transcription.

Expected improvements are hypotheses, not measured gains. The
[prompt/context evaluation](https://github.com/Dankosik/super-review/blob/main/evals/go/prompt-context-evaluation.md) separates
judgment, native resource traces and mechanical checks, and requires realistic
positive/clear-code PRs and untouched holdouts before a general quality claim.
The source instructions change without a release/version bump; record commit and
resource hashes rather than the unchanged metadata version alone.
