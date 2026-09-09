# Verify recommendations

A routing signal establishes applicability, not a finding. Apply the same evidence
and acceptance bar to base lenses, conditional lenses, and profiles. Check the
owning effective rule; a profile cannot revive disabled or conflicting advice.

Read the changed declaration, its comparison at D when needed, and the cited
uses. Verify the candidate's link to this PR, not just that the named code exists.
Check the effective rule and the concrete reading or maintenance task that is
made harder. Apply the contract's scope test; a disguised bug report or an
imagined future requirement is not maintainability evidence. Explicit team
consistency remains a valid, separately stated basis.

Compare the proposed transformation with leaving the code alone. What knowledge,
state tracking, or coordinated editing disappears? What call jumps, parameters,
concepts, or dependencies are introduced? Judge the caller and implementation
together. Prefer the smallest change with a net benefit, not the shortest diff.
Address the strongest reason to retain the design. Agreement between agents,
self-reported confidence, and references to patterns are not source evidence.

Understand what the transformation could disturb: effects and their order,
public API, ownership and mutation, error identity, absence, resource lifetime,
and language compatibility. Do not recommend a transformation already shown to
violate these constraints. When equivalence is uncertain, narrow the advice or
leave it unresolved; source inspection does not establish tested equivalence.
A sound observation with an unsupported remedy needs a narrower remedy or an
unresolved disposition, not an instruction to implement the speculative change.

For a Go-specific replacement, require the exact supported operation or signature
and a concrete account of the contract it preserves. In particular, do not treat
nil/empty normalization, broader error matching, promoted methods, or moved defers
as equivalent because the happy-path example is unchanged. Inspect only the
relevant constraints, including indirect/interface uses when affected. Unknown
compatibility is a limit, not a request to run tests or import newer APIs.

Choose one disposition for each candidate:

| Disposition | Record |
| --- | --- |
| accepted | Source evidence, net benefit or explicit convention, and recommendation ID. |
| rejected | Concrete counterevidence, out-of-scope basis, or insufficient benefit. |
| merged | Destination recommendation and retained candidate ID. |
| unresolved | The context needed; not an implementation instruction. |

Check recommendations as a set. Extraction and inlining, abstraction and
locality, or renaming and API stability can conflict. Choose a supported coherent
change, or label real alternatives with their tradeoffs. Merge by the underlying
change and affected scope, not merely the same rule or similar wording. Retain
every participating location and independently useful rationale. Do not give a
coding agent contradictory mandatory edits.

Preserve every accepted candidate in the final recommendation mapping. Keep
rejected and unresolved candidates in a compact decision appendix, separate
from the change list. A useful outcome may contain no recommendations.
