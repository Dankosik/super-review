# Java error expression

Owner: control-flow
Rule: java.flow.show-main-path

**Failure vocabulary.** Does the changed catch/translation structure expose the
operation's failure contract, or bury it under repeated wrappers, logging,
rethrowing, and generic exception names? Read relevant throws and catch sites.
Prefer translation at a meaningful abstraction boundary when it names the
operation for callers; retain a direct checked exception or established domain
exception when it already communicates the contract.

A normal catch is not an issue by itself. Multi-catch can remove truly identical
handling; merging distinct recovery or contracts hides knowledge. Do not change
checked exceptions into unchecked ones, swallow failures, add retries, or turn
absence into an exception as a stylistic simplification.

Inspect exception type, cause chain, message obligations, suppression, and catch
scope implicated by the proposal. Preserve interruption and completion semantics
when changing async wrappers or extraction. Log-and-rethrow may reflect separate
observability obligations; establish the duplicated burden before advising removal.
A speculative failure scenario is not a readability finding.

Name which failure meaning becomes visible and what caller adaptation disappears,
without claiming exception correctness or recovery behavior was tested.
