# Control flow

## go.flow.show-main-path

**Visible main path.** Trace the normal path, alternatives, and exits through
the complete function. Target places where a reader must hold a pending branch,
mutable loop flag, repeated check, or distant named-result update in mind to
understand a later step.

Flatten non-load-bearing ceremony: use guard clauses or early returns to expose
the main path; collapse redundant branches and boolean flags set in a loop only
to branch afterward; name a compound predicate when the name states a domain
condition clearer than the operators; lift a nil or mode check up to the single
caller when that caller just constructed the case; replace distant named-result
mutations with explicit `return` expressions; and pull side effects out of dense
boolean expressions or callbacks into visible order.

**Keep when:** a `switch`, balanced `if`/`else`, or linear sequence of idiomatic
`if err != nil` checks already reads directly (matching error-check syntax is
not duplication, and linear code beats dispatch machinery); named results clarify
an exported signature or coordinate with `defer`; or a bare `return` sits in a
tiny clear function. Preserve effect order, short-circuit evaluation, `defer`
cleanup, and error returns; judge reading burden rather than auditing condition
truth for logic bugs. Show which state the reader stops holding.
