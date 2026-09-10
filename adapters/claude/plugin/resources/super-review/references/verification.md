# Verify recommendations

The orchestrator owns final acceptance; specialists supply evidence-backed
observations. Apply the [contract's judgment bar](review-contract.md#judgment-and-acceptance)
to every candidate, including your own, across base lenses, conditional lenses,
and profiles. A routing signal or agreement between agents is not evidence.
A profile cannot revive a disabled or conflicting owner rule.

Use the task header to resolve snapshot, scope, policy and instruction identity
under the contract before judging a block. Resolve conflicting material rather
than assuming matching version labels mean matching text. Read its changed declaration, comparison at D when needed, and cited uses. Reuse
complete matching source already in your context; fetch missing evidence instead
of rereading everything. Verify the link to this PR, the effective rule, and the
concrete burden, not merely that the code exists. A disguised bug report or an
imagined future requirement is outside scope; explicit team consistency is a
valid, separately stated basis.

Separate two decisions: is the observation supported, and is the remedy ready
for implementation? A sound observation with an unsupported remedy survives as
`unresolved`, with its specific gap, unless a narrower supported remedy resolves
it. An unsupported observation is rejected or left unresolved pending identified
source, never accepted because it sounds plausible. Self-reported confidence,
pattern names, and peer agreement do not replace evidence.

For a proposed change, compare what readers no longer track with the calls,
parameters, concepts, dependencies, and migration work introduced. Consider caller
and implementation together and the strongest reason to retain the design.
Prefer the smallest net improvement, not the shortest diff.

Inspect only the preservation constraints implicated by that transformation,
using [the applicable language context](languages/index.md): exact supported operation/signature, effects,
API and method contracts, ownership/mutation, error identity, absence, and cleanup/lifetime.
Do not infer equivalence from a happy-path example or empty literal search.
Narrow incompatible/uncertain advice or keep it unresolved; no tests, builds,
newer APIs, or claims of tested equivalence are authorized by verification.

| Disposition | Record |
| --- | --- |
| accepted | Supported observation and remedy, net benefit or explicit convention, preservation constraints, R-ID. |
| rejected | Concrete counterevidence, outside scope, or insufficient benefit. |
| merged | Destination R-ID and retained candidate ID, locations and independent rationale. |
| unresolved | Supported observation or exact unverified claim, missing evidence/choice, no implementation instruction. |

Check recommendations as a set. Extraction and inlining, abstraction and locality,
or renaming and API stability can conflict. Choose a coherent supported change or
label real alternatives with tradeoffs. Merge by underlying change and affected
scope, not merely the rule or similar wording. Preserve all participating locations
and useful rationale; do not give a coding agent contradictory mandatory edits.

Map every accepted candidate to the final report, including merges. Keep rejected
and unresolved candidates in a compact decision appendix; coverage status remains
separate from candidate disposition. Follow the workflow's focused-gap handling,
not a second full review. A useful outcome may contain no recommendations.
