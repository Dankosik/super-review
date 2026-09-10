# Java control flow

## java.flow.show-main-path

**Structured flow.** Can the reader follow the normal path, alternatives, and
termination without retaining unrelated conditions? Compare guard clauses,
ordinary branches, a switch, or a named predicate with the existing flow. Keep
coherent alternatives together when early returns or extraction scatter them.
Nesting or method length alone is not a finding.

Use a supported switch expression or pattern only when it directly expresses the
existing decision. A small switch does not need a polymorphic hierarchy; a chain
of ternaries or `Optional` callbacks is not clearer just because it is shorter.
Keep a direct loop when it makes state changes, order, early exit, or checked
exceptions easier to understand than stream operations.

For a proposed rewrite, inspect short-circuit and evaluation order, null handling,
fall-through, catch/finally scope, and the timing of side effects. In particular,
`Optional.orElse` evaluates its argument eagerly while `orElseGet` invokes a
supplier on absence; moving work between them is not a cosmetic substitution.
An ordinary null guard or catch is not a problem by itself. Error-translation
structure belongs here when the error-expression profile is selected.

Explain which conditions the reader no longer needs to hold in mind, preserving
the existing alternatives rather than introducing validation or behavior.
