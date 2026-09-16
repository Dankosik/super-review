# Supported continuation

Use only at a supported in-session compaction or handoff, not at review startup.
The [workflow](workflow.md) and [review contract](review-contract.md) still apply.

When the harness offers an in-session compaction/handoff, retain a compact state:
review target and commit/snapshot identity; source/resource locations and instruction
identity/provenance limits; effective policy/conflicts;
planned tasks with actual subcoverage and pending native task IDs; candidate IDs,
observations, dispositions and R-ID mapping; evidence references and missing ranges;
next required action. Keep evidence, decisions, and unknowns distinct. Preserve
accepted content or retrievable full reports, not just counts. A summary is an
index, not replacement evidence for a decision.

Resume only when the pinned source and full task results remain accessible.
Reacquire missing resources/ranges, not already resolved work; never relabel
rejected, unresolved or pending work as completed with none. A lost working-file
snapshot or unavailable result is an explicit gap. Use the host's supported
history/result facilities; there is no plugin-owned persistence or expiry protocol.
Do not create recovery files
in the reviewed tree or promise cross-session recovery the host cannot provide.
