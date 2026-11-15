# Rust lifecycle ownership

Owner: data-flow
Rule: rust.data.make-transformations-visible

**Resource narrative.** When changed code acquires, transfers or releases a
resource or background operation, can readers identify its owner and intended
lifetime without following scattered handles? Attach this to the owner's pass;
ordinary references alone do not require a lifecycle investigation.

RAII and a local guard can already tell the story. A named scope or transfer may
clarify ownership, but moving a guard to a helper can release it earlier. Owned
data or shared handles moved into tasks may legitimately outlive the caller.
Read the relevant task contract and actual uses before replacing them with borrows.

Distinguish the lifetime of shared storage from the authority to publish or start
work. A subscriber or a temporary upgraded Weak may retain storage without being
a publisher. Before removing a counter or separate owner, identify what will
still establish the last-publisher or completion boundary; an Arc count is not
automatically the same fact.

When simplifying notification or cleanup, follow callbacks through the proposed
mechanism, including cloning, replacing or dropping caller-supplied values and
waking a task. A synchronous dependency call can invoke user code even without
an await. Keep a staged wakeup or destruction when it separates callbacks from
guarded mutation. Moving delivery outside a lock can change publication order
or atomicity; fewer locks or a channel alone does not establish an equivalent,
clearer ownership protocol. Use this check to assess the proposed simplification,
not to start a separate concurrency-defect audit.

Cleanup that can fail, block or must be awaited has no way to report from
`Drop`. An explicit `close`, `flush` or `shutdown` that returns its outcome
shows the caller where completion happens, with `Drop` as the best-effort
fallback. A guard that lives to the end of a long function because nothing
scopes it leaves the reader to work out where the lock or borrow is needed; a
block, or a helper that returns the value, shows the critical section. Keep the
updates that must change together under one guard when narrowing it.

Explain the reading benefit and preserve affected drop, transfer and cancellation
boundaries. Do not turn this profile into a search for leaks, deadlocks, races
or unsafe-code defects, or a reason to prescribe a new async runtime.
