# Verify recommendations

The orchestrator owns final acceptance; specialists supply evidence-backed
observations. A candidate is a claim to test, not a draft to forward. Answer for
each accepted recommendation as if you wrote it: you understand why it holds and
would make that edit yourself. Agreement with an agent is not a reason, and a
decision row without its own reason is not a decision. Apply the [contract's judgment bar](review-contract.md#judgment-and-acceptance)
to every candidate, including your own, across base lenses, conditional lenses,
and profiles. A routing signal or agreement between agents is not evidence.
A profile cannot revive a disabled or conflicting owner rule.

Use the task header to resolve snapshot, scope, policy and instruction identity
under the contract before judging a block. Resolve conflicting material rather
than assuming matching version labels mean matching text. Read its changed declaration, comparison at D when needed, and cited uses. Reuse
complete matching source already in your context; fetch missing evidence instead
of rereading everything. Verify the link to the assigned scope, the effective rule, and the
concrete burden, not merely that the code exists. A disguised bug report or an
imagined future requirement is outside scope; explicit team consistency is a
valid, separately stated basis.

Check location independently of quality. Validate each anchor against its declared
endpoint under [source-access rules](harnesses/source-access.md#file-boundaries-and-source-anchors):
path, old/new side, symbol and any supplied line range must match that snapshot.
Match the cited expression to the pinned file and containing symbol before using
its line range. Diff positions and hunk offsets are not source line numbers.
Repeated snippets need enclosing context, not the first textual match. Use H/new
paths for surviving code and D/old paths for deleted comparison evidence; never
relocate a claim to a moving branch. For deletions inspect old-side evidence; for
renames preserve the path mapping. Local evidence must match the selected
index/worktree view, not just HEAD. A removed declaration may explain a change,
but is not code still present at H.

Repair a wrong line or stale path when the same observation is supported at a
verified location. If only line numbering is unavailable, a verified path, symbol
and distinguishing source span are sufficient; omit the line rather than guess.
If the cited expression or its association remains unverified, retain that exact
gap outside implementation advice. Do not turn a positioning failure into either
acceptance of an unsupported claim or rejection of a separately supported burden.
This uses already supplied matching bytes, not another full scan.

Check the factual relationship in the explanation, not just its source location.
Trace the relevant construction or branch and a source-supported countercase:
can the named fields coexist, does this operation add or remove data, and is a
guarantee enforced by the type or only by the current control flow? Distinguish
raw stored values from the effective state callers can observe. Correct an
overstated explanation when the narrower maintenance burden survives; an accurate
remedy does not make an inaccurate premise acceptable. This is bounded evidence
for the recommendation, not a new correctness audit of the program.

Separate two decisions: is the observation supported, and is the remedy ready
for implementation? A sound observation with an unsupported remedy survives as
`unresolved`, with its specific gap, unless a revised supported remedy resolves
it. An inaccurate proposed name or overbuilt remedy is a reason to repair that
proposal, not discard its supported observation. Choosing between supported
alternatives is your engineering decision: choose and say why. Leave a remedy
unresolved only for a fact the source cannot supply, such as an external consumer,
product intent or a team preference no rule records, and name that fact, or for a
changed decision under the contract. Accepting with a stated risk is not a
decision, and the observation's main point is never an optional part of its
remedy. An unsupported observation is
rejected or left unresolved pending identified source, never accepted because it
sounds plausible. Self-reported confidence,
pattern names, and peer agreement do not replace evidence.

Apply the contract's quality and compatibility criteria to caller and
implementation together. Make the decision at the candidate's actual scope:
several local improvements do not become a speculative redesign when collected.
A rejection for insufficient benefit needs a source-specific tradeoff, not just
the presence of a new name, type, helper, or changed signature. Accept a sufficient
improvement, revise the remedy, or retain the exact missing fact.

Inspect only the preservation constraints implicated by that transformation,
using the matching context from [language routing](languages.md): exact supported
operation/signature, effects, API/type contracts, ownership/mutation, error identity,
absence, and resource lifetime. Keep Go, TypeScript, Rust, and Java preservation rules scoped
to their own language; account for TypeScript inference and emitted module behavior.
For Rust, inspect implicated trait/auto-trait contracts, ownership, eager/lazy
evaluation and guard/drop lifetimes under the selected language context.
For Java, inspect implicated null/absence, overload/override and generic
signatures, mutability, evaluation timing, exception causes and resource or
framework/proxy ownership under the selected language context.
Do not infer equivalence from a happy-path example or empty literal search.
Before accepting, read whether the resulting code would pass the project's lint
policy (such as `clippy.toml`, `[lints]` or crate-level `deny`) and the other
checks its CI or build files run, such as a duplication baseline, generated or
template-region markers and documentation checks; read them, never run them.
Also read every use of a changed type or name including excluded tests, name
collisions, and code left dead once optional regions are removed. A remedy that
introduces a type, helper or constant needs a search of the snapshot for an
existing owner: reuse it or say why a new one is needed. Repair or reject a
remedy that fails.

The target's own history is evidence too. When `git log` of the target files
shows that a name or shape was introduced recently, changing it again needs a
burden that name or shape causes, not a preference; leave specialists unaware
of that history.
Narrow incompatible/uncertain advice or keep it unresolved; no tests, builds,
newer APIs, or claims of tested equivalence are authorized by verification.

A clarity change may change what callers, operators or logs observe: error text,
a public variant, a runtime check a type now makes redundant. Accept it when that
clarity is the benefit, and state the effect in the recommendation. Merging copies
that diverged selects one behavior; name the choice. A changed decision stays
unresolved under the contract. A precondition the specialist set for its remedy
travels into the recommendation, or the remedy stays unresolved.

| Disposition | Record |
| --- | --- |
| accepted | Supported observation and remedy, net benefit or explicit convention, preservation constraints, R-ID. |
| rejected | Concrete counterevidence, outside scope, or insufficient benefit. |
| merged | Destination R-ID and retained candidate ID, locations and independent rationale. |
| unresolved | Supported observation or exact unverified claim, the missing fact, no implementation instruction. |

Check recommendations as a set. Extraction and inlining, abstraction and locality,
or renaming and API stability can conflict. Choose a coherent supported change or
label real alternatives with tradeoffs. Merge by underlying change and affected
scope, not merely the rule or similar wording. Preserve all participating locations
and useful rationale; do not give a coding agent contradictory mandatory edits.

Compare the proposed resulting interfaces, owners and data flow at shared sites.
Two individually valid remedies can depend on incompatible intermediate choices:
one may borrow from an owner another removes. Compose a compatible result, state a
real prerequisite, or present alternatives; do not accept both unchanged because
each passed against the original source. Edits sharing a file are not inherently
in conflict. Independent improvements remain independent, and a renamed symbol
can simply be carried through a compatible extraction. Reassess only the advice
whose premise a selected recommendation changes.

Map every accepted candidate to the final report, including merges. Keep rejected
and unresolved candidates in a compact decision appendix; coverage status remains
separate from candidate disposition. Follow the workflow's focused-gap handling,
not a second full review. A useful outcome may contain no recommendations.
