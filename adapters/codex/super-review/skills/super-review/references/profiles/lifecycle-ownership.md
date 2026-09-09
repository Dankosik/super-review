# Lifecycle ownership

Owner: data-flow
Rule: go.data.make-transformations-visible

**Lifetime.** Deepen the owner's question when the change affects a resource or
background operation. Trace creation, use, ownership transfer, and completion
through the actual declarations. Can the reader identify who owns each phase
without assembling a hidden protocol across unrelated callbacks or objects?

Prefer the smallest clarification of the existing ownership: a visible boundary,
a meaningful operation, or bringing related lifecycle steps together. Keep a
simple acquisition and nearby deferred cleanup; do not add a lifecycle framework
or owner object merely because a resource exists.

Preserve the existing timing, cancellation, joining, transfer, and cleanup
contracts. Do not search for leaks, races, missing closes, or missing goroutine
joins. If the only benefit is preventing a failure, it is outside this profile.

Show which existing responsibility becomes local and explicit, and what additional
state or coupling the proposed shape would introduce. Apply the owner's effective
team rule; this profile cannot bypass its disable, replacement, or conflict.
