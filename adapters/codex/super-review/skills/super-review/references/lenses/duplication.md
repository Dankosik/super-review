# Duplication

## go.duplication.share-knowledge

Unify repetitions of the same rule that should change together. Similar syntax
alone is not shared knowledge. Conversely, a parameterized helper can be a false
abstraction if callers use it for unrelated policies.

Useful: two newly added paths implement the same established currency rounding
policy with the same contract and ownership.
Counterexample: customer eligibility and supplier eligibility happen to compare
the same fields today but have independent policy owners.

Read both uses and their reasons to change. Prefer a small domain operation when
it centralizes real knowledge. Do not add flags, callbacks, or a utility package
to force unrelated paths through one function. A few repeated statements can be
cheaper to maintain than an artificial shared dependency.

Coordinate a proposed extraction with function-cohesion; do not issue a second
copy of the same recommendation.
