> Historical design/evaluation record. For version 3 source access and installation, see [native integrations](native-integrations.md).

# Specialist model study — 2026-09-09

## Decision

Keep the orchestrator's user-selected model and effort. Set Codex specialists
to Terra/medium by default, with an explicit Luna/medium economy profile. Use
Sonnet/medium in Claude; treat that as a documented model choice with native
routing proof, not as a tested quality result. OpenCode requires a provider/model
selection once, rather than silently inheriting an expensive model or changing
provider. This change is versioned **2.0.0** because model defaults change and
OpenCode now requires that selection.

## Official guidance and rates

OpenAI describes Terra as a balanced option for reading/scanning code and parallel
workers; Luna targets narrow, repeatable tasks. That supports testing both; it
does not prove their performance on this review workflow.
[Model guidance](https://learn.chatgpt.com/docs/agent-configuration/subagents#choosing-models-and-reasoning)

Standard API rates below were read on 2026-09-09, in USD per million tokens for
short context. They are comparison inputs, not promises about subscription usage.

| Model | Uncached input | Cached input | Output |
| --- | ---: | ---: | ---: |
| GPT-6 Astra | 10.00 | 1.00 | 50.00 |
| GPT-5.6 Terra | 2.00 | 0.20 | 12.00 |
| GPT-5.6 Luna | 0.20 | 0.02 | 1.20 |
| Claude Sonnet 5 | 2.00 | 0.20 | 10.00 |
| Grok Build 0.1 | 1.00 | 0.20 | 2.00 |

[OpenAI pricing](https://developers.openai.com/api/docs/pricing),
[Anthropic pricing](https://platform.claude.com/docs/en/about-claude/pricing),
[Grok Build pricing](https://docs.x.ai/developers/models/grok-build-0.1).
At equal uncached token counts, Terra costs about one fifth of Astra on input
and 24% on output; Luna costs about one tenth of Terra. Total review cost also
includes the unchanged orchestrator, retrieval, repeated turns, and caching.

## Offline screen

Eight synthetic cases, one per lens, pair a supported opportunity with code that
should remain unchanged. Every model receives the same case prompt, complete
source, current lens/contract, and candidate format, without the evaluation rubric.
Codex 0.153.4 ran Astra, Terra, and Luna at medium effort, once per case, in fresh
sessions with no tools or delegation. Jobs were interleaved with concurrency 3.

An independent evaluator graded randomized A/B/C replies without model identities,
prices, or prior results. It found **24 substantive passes, zero unsafe suggestions,
and eight defensible three-way ties**. Four replies omitted an explicit completion
status, recorded separately from recommendation quality. The evaluator also found
the source context strongly leading: ownership and preservation facts were supplied
rather than discovered. This saturated screen cannot rank the models or certify
production parity. There were no wholly negative cases.

| Profile | Cases | Median wall seconds | Input tokens | Cached input | Output tokens | API-equivalent USD |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Astra/medium | 8 | 19.76 | 149,065 | 31,488 | 2,812 | 1.3479 |
| Terra/medium | 8 | 15.48 | 141,921 | 91,136 | 3,331 | 0.1598 |
| Luna/medium | 8 | 16.55 | 129,401 | 77,824 | 3,620 | 0.0162 |

API-equivalent calculations use uncached input, cached input, and reported output
at the standard rates above; output includes the harness-reported reasoning tokens.
They are not invoices or measured consumption of a ChatGPT subscription allowance.
Cache warmth and native model-specific harness prompts differ. With all input
priced uncached, the same reported token counts would be $1.6313, $0.3238, and
$0.0302 respectively. Latencies are observations, not a controlled speed benchmark.

An extra OpenCode screen ran Grok Build 0.1 against the same source packets.
The evaluator found seven passes and one contract-sensitive concern: a no-change
answer focused on file count without weighing three coordinated policy switches.
Three cases also made unnecessary read-tool calls despite complete supplied context.
This was a different harness and provider-default effort, so it is not a matched
comparison. Setup attempts that used the wrong agent/configuration were excluded.
It does not justify a universal OpenCode specialist default.

## Native review trials

Astra/medium orchestrated both trials against the same immutable PR 300 snapshot,
restricted to `internal/infra/httpclient/propagation.go` plus required context.
This is a known clear change, so the trial tests acquisition, delegation, restraint,
and completion; it does not measure recall of difficult real findings.

All sixteen child session records confirmed the requested model and medium effort.
Each received a fresh context. Both trials completed eight lenses without accepted
recommendations, edits, project execution, or GitHub comments.

| Worker profile | Wall seconds | Parent API-equivalent USD | All workers USD | Combined USD |
| --- | ---: | ---: | ---: | ---: |
| Terra/medium | 399.20 | 1.9442 | 1.0518 | 2.9960 |
| Luna/medium | 367.71 | 1.8766 | 0.1044 | 1.9811 |

These are one-off diagnostic cost estimates under observed cache hits. The
orchestrator represented about 65% and 95% of the totals. Cheap specialists
therefore do not make the whole review ten times cheaper. High reported input
counts include repeated cached context, not that many unique source tokens.

The traces also exposed unnecessary short waits and a shared-resource call above
the six-resource limit. The candidate requests 60-second waits that wake on
completion and accepts the full shared packet in one call. Its full Terra trial
completed in **338.23 seconds**, using six 60-second waits and eight explicit
Terra/medium spawns; all child records confirmed that routing. Its estimate was
$1.6866 for the parent plus $0.8366 for workers. With one run per condition, the
change and the observed reduction are not a causal performance guarantee.

## Claude routing proof and limitations

Claude Code 2.1.227 ran the real plugin against a local synthetic Messages endpoint
with dummy credentials. The endpoint requested one native specialist invocation.
Captured requests were Opus/high for the user-selected orchestrator, Sonnet/medium
for its child, then Opus/high again. This validates model/effort routing without
changing real authentication or billing; it does not evaluate Sonnet's reasoning.
A direct `--agent specialist` process used main-session effort and was not used as
proof of nested specialist effort. The nested test is the relevant contract.

No Sonnet or Haiku quality benchmark was possible with the available model access.
No claim is made that Terra and Sonnet have equal quality, or that a narrow task
is automatically easy for a small model. More difficult, less signposted PR cases
with independent human judgments are needed before making Luna the universal default.

## Reproducible evidence

The cases, exact prompts, original replies, anonymization map, blind judgments,
usage records, native reports, and routing receipt are retained under
[`evals/model-selection`](https://github.com/Dankosik/super-review/tree/v2.0.0/evals/model-selection).
Only sanitized task-relevant outputs are published; full local session logs and
credential material are not distribution assets. No fixed finding-count rule was
added to the product. All nine Go rule IDs and the full review plan remain intact.
