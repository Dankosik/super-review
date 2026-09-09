# UX reference study

Inspected 2026-09-09. This compares documented/source-visible interaction patterns,
not measured reviewer quality, speed, or commercial pricing.

| Reference | Useful interaction | Super Review decision |
| --- | --- | --- |
| [Anthropic PR Review Toolkit](https://github.com/anthropics/claude-plugins-official/blob/main/plugins/pr-review-toolkit/commands/review-pr.md) | One namespaced command, optional aspects, specialist results combined into an action list. | Support natural-language file/lens scope; keep full review as the default and identify narrower coverage. |
| [Anthropic Code Review](https://github.com/anthropics/claude-plugins-official/blob/main/plugins/code-review/commands/code-review.md) | PR URL input, independent review, source links, filtering before delivery. | Keep verification and immutable links. Its numerical confidence cutoff, automatic GitHub comment, and draft/closed-PR skip do not fit our contract. |
| [Superpowers](https://github.com/obra/superpowers#installation) | Install through each harness's native plugin manager and keep one shared skill library. | Native Claude/Codex packages, one maintained review policy, normal plugin updates. No mandatory global startup workflow. |
| [Native Codex plugins](https://developers.openai.com/plugins/build/plugins) | Skill/MCP package with a plugin card and marketplace distribution. | Provide an installable plugin and native reader, preserve the user's existing model/auth settings. |
| [Native Claude plugins](https://code.claude.com/docs/en/plugins) | Namespaced skill commands, bundled agents/MCP, explicit invocation and isolated contexts. | A short review command, a constrained orchestrator, constrained specialists, and a report returned to the current conversation. |

The intended user path is install once, start a new session, and give a PR URL.
Initial connection checks should explain a missing dependency directly. During
review, show the chosen scope and real batch progress. Put the outcome before
revision metadata, while retaining every accepted recommendation and coverage gap.

The tool layer remains a mechanical GitHub reader. The local stdio MCP bridge
makes those same operations available to native plugin hosts; it is not a new
agent runtime, hosted service, account, or model client.
