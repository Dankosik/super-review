# Lifecycle ownership

Owner: data-flow
Rule: ts.data.make-transformations-visible

**Lifetime as a contract.** Can readers identify who creates, borrows, transfers,
and finishes the changed resource or background operation? Inspect acquisition,
uses, and release together. A subscription, timer, stream, listener, or abort signal
can justify this question; its presence is not a leak finding.

Clarify the actual owner with a local scope, named operation, or explicit cleanup
handle when responsibility is scattered. Keep ordinary `try`/`finally`, a returned
unsubscribe function, or an existing framework lifecycle when already clear. Do not
introduce a disposable abstraction or `using` merely because newer syntax exists.
Preserve cleanup timing, cancellation ownership, callback identity, and sync/async
completion under the supported runtime. Do not conduct a missing-cleanup bug audit.
