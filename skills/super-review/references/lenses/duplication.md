# Duplication

## go.duplication.share-knowledge

**Shared knowledge.** Compare the repeated implementations and their actual
consumers. Establish which existing decision they encode, who owns it, and why
they should change together. Similar text, fields, or types do not establish a
shared rule; do not infer policy ownership from appearance alone.

Centralize demonstrated shared knowledge in the smallest meaningful operation.
Conversely, separate a shared helper when flags, callbacks, or divergent caller
contracts show that unrelated decisions have been forced together. Account for
the coupling created or removed, not the number of repeated statements.

Keep coincidentally similar customer and supplier predicates separate when their
policies have independent owners. Keep ordinary local repetition when sharing
would require callers to understand more machinery than it hides. Do not decide
whether the underlying business rules are correct.

Identify every inspected participating use and the evidence for shared or
independent reasons to change. Return your duplication rationale even when the
remedy involves extraction; the parent reconciles overlapping lens candidates.
