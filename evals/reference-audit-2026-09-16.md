# Reference audit: evidence boundaries and evaluation discipline

Target baseline: `51b34f3a8b4ce0e828f344bf90a08f2e7044dfb3` (Super Review 3.0.1).
This is development evidence, not a runtime resource or a behavioral result.

## Sources and decisions

| Source inspected | Decision for this repository |
| --- | --- |
| [Matt Pocock: writing-for-agents](https://github.com/mattpocock/skills/blob/959a8e9f1edc3adbe2f7e3054bb6fbefa6696260/skills/productivity/writing-for-agents/SKILL.md) | Keep one policy owner and branch-specific pointers. Replace the repeated development check itinerary in AGENTS.md with conditional pointers to contribution and evaluation guidance. |
| [Matt Pocock: code-review](https://github.com/mattpocock/skills/blob/959a8e9f1edc3adbe2f7e3054bb6fbefa6696260/skills/engineering/code-review/SKILL.md) | Retain isolated, self-contained specialist assignments. Make collection compare returned work with the original assignment, including no-candidate results. Do not import the separate specification/bug-review axis or fixed report word cap. |
| [Alibaba: file_read](https://github.com/alibaba/open-code-review/blob/f1101fd7f51304c82e4a4f292bbee88aea0823cf/internal/tool/file_read.go) and [review architecture](https://github.com/alibaba/open-code-review/blob/f1101fd7f51304c82e4a4f292bbee88aea0823cf/README.md) | Retain separate discovery, evidence verification and related-file grouping. Explicit source coordinates motivate side-aware rename/deletion anchors. Keep native source tools; do not import a custom tool loop, worker pool, or a fixed line cap. |
| [OpenAI: Testing Agent Skills Systematically with Evals](https://developers.openai.com/blog/eval-skills) | Make the comparison observable: neutral counterexamples, raw traces, outcome and process criteria, separate integrity checks and model behavior. Add eight focused stage inputs without claiming they have run on a model. |
| [OpenAI: Rethinking Skills and Prompts for GPT-6 Astra](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra) | Keep the narrow activation and existing progressive disclosure. Select development checks from changed inputs instead of restating a full mandatory loop in every instruction layer; retain the full distributable CI gate. |
| [Thariq Shihipar: official context-engineering article](https://claude.com/blog/the-new-rules-of-context-engineering-for-claude-5-generation-models) | Prefer a clear evidence interface and bounded engineering judgment over another universal checklist. Preserve hard authorization boundaries and language constraints; model capability claims do not establish these defaults can be deleted. |

The supplied Alibaba URL had a trailing Cyrillic character; the repository above
was verified. The requested [X article](https://x.com/trq212/article/2080710971228918066)
did not expose its body to the reader. The related official article by the same
author was inspected instead; exact equivalence of the two texts was not verified.
No third-party implementation or long prompt text was copied.

## Concrete changes and regression boundaries

The candidate template previously required H lines even for removed declarations.
The replacement identifies D/H sides and old/new paths while still requiring a
current change-related burden. The workflow now checks each returned task against
its original assignment before treating it as completed coverage. Native source
access distinguishes permitted regular targets from escaping links and special
files; these are access boundaries, not a security review of the target program.

`evidence-boundaries/` contrasts matching/mismatched results, rename/deletion
locations, contained/escaping links, and regular/special files. The new protocol
keeps evaluator expectations, fixture manifests and results outside install trees.
Existing language rules, eight base questions, model profiles, and native adapter
mechanics are unchanged. The routing-first experiment remains an experiment.

## Evidence limits

No independent subagent or model comparison was run in this maintenance session.
Local repository cloning was blocked by DNS and Bun was unavailable. Fixture
integrity can be checked locally with equivalent standard-library checks; the
existing PR CI is the authority for Bun, typecheck, native packages and archives.
Only actually observed check results may be reported as passing. These edits are
an unproven behavioral candidate, not a claim of perfection or measured quality gain.
