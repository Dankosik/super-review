# Java lifecycle ownership

Owner: data-flow
Rule: java.data.make-transformations-visible

**Resource ownership.** Can readers locate who acquires, borrows, transfers, and
releases the changed resource or background operation? Trace its actual lifetime,
not a checklist for leaks. Prefer lexical try-with-resources for an owned
`AutoCloseable` when it makes that scope explicit and preserves the contract.
Keep an explicit lifecycle when ownership crosses methods or a container owns it.

Do not close a caller-owned stream, connection, or shared executor merely because
it can be closed. Resource-backed streams can outlive the method creating them.
For a scope rewrite, preserve close order, primary/suppressed exceptions, and the
point when results or callbacks cease using the resource. Replacing finally with
try-with-resources is not automatically equivalent.

For futures, tasks, and executors, clarify existing ownership and completion or
cancellation responsibilities only when the changed structure obscures them.
Preserve executor choice, interruption/exception propagation, synchronization,
and completion timing implicated by a proposal. Do not migrate to virtual threads,
structured concurrency, or a new reactive stack as a style upgrade.

Show the lifetime fact that becomes local and the strongest reason to retain the
boundary. Leak detection, race hunting, and performance claims are outside this
review; they cannot supply a missing readability benefit.
