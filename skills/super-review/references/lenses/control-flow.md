# Control flow

## go.flow.show-main-path

**Reading order.** Trace the main path and its alternatives through the complete
function. Identify where a reader must retain a condition, flag, or pending
branch to understand a later step. Recommend a change that removes that burden,
not merely nesting or lines.

Use a guard clause when it exposes the main path; simplify redundant branches
when the expression remains direct. Name a compound predicate when its name
expresses a real condition better than the expression. Keep effects visible and
ordered rather than hiding them in dense boolean expressions or callbacks.

Retain a clear switch, meaningful alternatives, and idiomatic error handling.
Repeated error checks are not duplication merely because their syntax matches;
a long linear operation may already be easier to read than dispatch machinery.
Check the proposed shape against effect ordering, short-circuit evaluation,
deferred cleanup, and error returns. Understand those constraints without
auditing condition truth or reporting logical bugs.

Show which decisions become easier to follow at the affected branch and main
path. A visually flatter function that requires more state tracking is not an
improvement.
