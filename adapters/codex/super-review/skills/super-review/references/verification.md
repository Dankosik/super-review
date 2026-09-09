# Verify recommendations

Read the cited declaration and the context supporting the proposed change.
Check five things together: the observed code, the effective rule, the concrete
reading or maintenance cost, the smallest useful transformation, and the
strongest reason to keep the current design. Agreement between agents and their
self-reported confidence are not evidence.

Understand what the transformation could disturb: effects and their order,
public API, ownership and mutation, error identity, absence, resource lifetime,
and language compatibility. Do not recommend a transformation already shown to
violate these constraints. When equivalence is uncertain, narrow the advice or
leave it unresolved; source inspection does not establish tested equivalence.

Choose one disposition for each candidate:

| Disposition | Record |
| --- | --- |
| accepted | Source evidence, proportional benefit, and recommendation ID. |
| rejected | Concrete counterevidence or insufficient benefit. |
| merged | Destination recommendation and retained candidate ID. |
| unresolved | The context needed; not an implementation instruction. |

Check recommendations as a set. Extraction and inlining, abstraction and
locality, or renaming and API stability can conflict. Choose a supported coherent
change, or label real alternatives with their tradeoffs. Do not give a coding
agent contradictory mandatory edits.

Preserve every accepted candidate in the final recommendation mapping. Keep
rejected and unresolved candidates in a compact decision appendix, separate
from the change list. A useful outcome may contain no recommendations.
