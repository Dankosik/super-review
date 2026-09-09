# Data flow

## go.data.make-transformations-visible

**Ownership.** Follow a value from its origin through transformations, storage,
and use. Identify where a reader must remember a previous meaning or inspect
another declaration to tell which value is current and who can mutate it.

Separate meaningful stages when reusing one variable hides a change of meaning.
Keep intermediate values that explain an operation; remove ones that merely
relay it. Narrow a value's scope or keep a mutation near its use when this reduces
the state a reader must track. Read helper bodies and callers before claiming a
pipeline becomes clearer.

Visible local mutation is not inherently worse than a copy. Account for shared
slice/map storage, pointer receivers, shallow copies, nil/empty distinctions,
and order when assessing a proposed shape. These constrain the advice; do not
scan for races, missing synchronization, or runtime defects.

Show the specific origin, transition, or mutation whose ownership becomes easier
to follow. Do not replace a simple update with an immutable-object framework,
inline a clear sequence into one expression, or introduce extra copies merely
to make the code look functional.
