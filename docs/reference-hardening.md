# Reference-driven evidence hardening

Audited base: `51b34f3a8b4ce0e828f344bf90a08f2e7044dfb3` (3.0.1).
Date: 2026-09-16. This supplements [the earlier instruction audit](instruction-audit.md),
not a replacement for it. No release, model change, new language or runtime is
introduced. Independent subagent/model comparisons for this change are **NOT RUN**.

## Reference decisions

| Primary source inspected | Applied here | Not transferred |
| --- | --- | --- |
| [Matt Pocock: writing for agents](https://github.com/mattpocock/skills/blob/main/skills/productivity/writing-for-agents/SKILL.md) and [code review](https://github.com/mattpocock/skills/blob/main/skills/engineering/code-review/SKILL.md) | Keep the compact entry point, conditional resource pointers, one policy owner, explicit completion and uncontaminated specialist packets. Put snapshot distinctions next to acquisition, not in every lens. | Mandatory spec lookup/interview, a different two-axis product, arbitrary report caps, or a smell automatically implying a refactoring. |
| [Alibaba Open Code Review](https://github.com/alibaba/open-code-review) | Separate source selection, source positioning and evidence-based judgment. Make old/new locations and snapshot identity inspectable; add deterministic Git scenarios outside the skill. | Its CLI/runtime, defect/security rules, tool execution policy, or benchmark/token claims. Native host tools remain the integration boundary. |
| [OpenAI: Testing Agent Skills Systematically with Evals](https://developers.openai.com/blog/eval-skills) (2026-01-22) | Contrasting inputs, captured traces/artifacts, deterministic checks plus qualitative judgment, distinct outcome/process/style/efficiency evidence. | A fixture pass presented as model success, or a single aggregate score hiding wrong-source decisions. |
| [OpenAI: Rethinking skills and prompts for GPT-6 Astra](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra) (2026-09-11) | Change-specific maintenance checks; retain existing precise activation and phase-local loading. Keep safe disposable tests separate from executing reviewed source. | Removing independent lenses, weakening permissions, or promoting routing-first merely to reduce context. Different consumers still need the shared contract. |
| [Thariq Shihipar: context engineering](https://claude.com/blog/the-new-rules-of-context-engineering-for-claude-5-generation-models) (2026-07-24) | Prefer concrete source artifacts and usable tool boundaries over repeated generic exhortations. Preserve native tool ownership. | Automatic memory, new host settings, wholesale prompt deletion, or extrapolated performance gains. |

The requested Alibaba URL had a trailing Cyrillic character; the inspected project
is `alibaba/open-code-review`. The [requested X article](https://x.com/trq212/article/2080710971228918066)
did not expose readable body text. The official Thariq article above is an
explicit substitute; verbatim identity with the X article was not verified.
Repository references were inspected as these Git blobs, not assumed stable
because a `main` URL exists:

| Resource | Inspected blob SHA |
| --- | --- |
| Matt Pocock writing-for-agents/SKILL.md | `a37608daf6e835e767deecfb498facecaaba82ba` |
| Matt Pocock code-review/SKILL.md | `e28d7acbf7b3bb4d7817b7eb5d9c105af03f6ec4` |
| Alibaba README.md | `f1f38efe444205ba7d33c7889c6e4e047a0b957e` |

## Concrete gaps and owners

**Source views.** The baseline names staged/unstaged scope but describes local
content as working files. A staged review can therefore inspect bytes that will
not be committed. `references/harnesses/source-access.md` now owns endpoint
selection, captured index blobs, net-versus-separate comparisons and source entry
boundaries. The workflow passes the selected view rather than defining a second
acquisition policy. Missing HEAD, unresolved index stages and failed reads are
separate conditions; policy provenance is not silently repaired by adopting new
working-tree instructions.

**Locations.** Acquisition already includes deletions, while the candidate template
required H lines. The candidate/report fields now carry the source side and both
paths where needed. Parent verification checks coordinates against the declared
bytes and repairs a proven coordinate error without automatically rejecting a
supported observation. This does not create permission to publish comments.

**Check selection.** CONTRIBUTING maps changed contracts to relevant local checks
and retains the complete CI gate. A stage transition is not an excuse to rerun an
unchanged successful suite. The added regression tests use disposable Git only;
they do not restore a production source reader or execute reviewed applications.

## Preservation and validation boundaries

SKILL.md, AGENTS.md, the judgment contract, all eight base questions, language
contexts, stable rule IDs, specialist models/effort and native permissions are
unchanged. Generated Claude/Codex instruction copies must remain byte-identical
to canonical sources. Author documentation copied into Codex remains author
reference, not an unconditional instruction to every specialist.

The [source-evidence evaluation](https://github.com/Dankosik/super-review/tree/main/evals/source-evidence)
separates neutral stage inputs, byte identities and evaluator expectations. Its
README specifies controlled base/candidate runs and retained failures; it is not
shipped in review resources. Tests cover Git semantics and fixture/package
integrity, not whether a model honors the new distinctions. CI results and model
results must be recorded separately. No independent-agent consensus, behavioral
improvement, latency reduction or exhaustive discovery is claimed by this audit.
