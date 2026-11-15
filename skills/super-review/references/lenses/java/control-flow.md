# Java control flow

## java.flow.show-main-path

**Visible main path.** Trace the normal path, alternatives, and exits through
the method. Target places where readers must hold unrelated conditions, mutable
loop flags, stacked ternaries, `Optional` callback chains wrapping local
control flow, or decisions pushed one call too low (passing a nullable or
`Optional` argument into a private helper only to return immediately on absence).

Use guard clauses, named predicates, or supported `switch` expressions and
pattern matching when they flatten non-load-bearing ceremony and leave fewer
conditions in mind, and omit redundant `default` branches on exhaustive
enum/sealed switches so the compiler checks future variants.

**Keep when:** coherent `if`/`else` branches, a small `switch` (without a
polymorphic hierarchy), an ordinary null guard or `catch`, or a direct loop
handling state updates, early exit, or checked exceptions already reads clearer
than streams or early returns. Preserve short-circuit and evaluation order, null
handling, fall-through, `catch`/`finally` scope, and side-effect timing
(`Optional.orElse` evaluates eagerly while `orElseGet` runs only on absence).
Error-translation structure belongs here when `error-expression` is selected.
Show which conditions the reader stops holding.
