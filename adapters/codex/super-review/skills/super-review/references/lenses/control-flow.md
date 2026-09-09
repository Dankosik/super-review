# Control flow

## go.flow.show-main-path

Make branches and the main path easy to follow. Prefer a direct early return
when it removes nesting without obscuring cleanup, ordering, or a meaningful
alternative. Name a repeated compound predicate only if the name conveys a real
condition better than its expression.

Useful:
```go
if err != nil {
    return err
}
return save(value)
```
instead of a redundant `else` around that final operation.

Insufficient: invert every condition, combine ordered steps into one expression,
or replace a small clear switch with dispatch machinery.

Read enough context to preserve the ordering of effects, deferred cleanup, and
error returns in the proposed transformation. Do not audit the truth of every
condition or report logical bugs. Long but linear code may already be clear.
