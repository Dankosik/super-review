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

Explain the reading benefit and preserve affected drop, transfer and cancellation
boundaries. Do not turn this profile into a search for leaks, deadlocks, races
or unsafe-code defects, or a reason to prescribe a new async runtime.
