# Rationale

## ts.rationale.explain-constraints

**Reasons, not narration.** Is a non-obvious choice or caller obligation discoverable
from the declaration and nearby context? Document the specific constraint when a
clearer name or shape cannot express it: an interop assertion, public widening,
module side effect, ownership transfer, or supported consumer limitation.

Read surrounding source and available uses before declaring a comment missing.
A reason already expressed by a discriminant, useful name, or self-contained type
needs no restatement. Avoid comments that narrate syntax or require a ceremonial
JSDoc block on every export. Do not assert business rationale the source does not
establish; record that uncertainty rather than invent an explanation.

A suppression or assertion may deserve a bounded explanation, not automatic removal.
Keep comments with the decision they explain and preserve public documentation
contracts. Recommend the smallest explanation that saves the next reader from
reconstructing the same constraint, or leave already explicit code alone.
