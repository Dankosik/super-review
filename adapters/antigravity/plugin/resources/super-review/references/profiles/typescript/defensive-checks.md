# Defensive checks

Owner: control-flow
Rule: ts.flow.show-main-path

**Settled facts.** Read each changed guard with the origin of the value it tests.
Does it check a case the types or the code have already ruled out? Such as
optional chaining or `??` on a value whose type excludes `null` and
`undefined`, a `typeof` check on a parameter already typed as that, a `try` or
`catch` around code that cannot throw or a `catch` that only rethrows, a
`default` for a union the `switch` already covered, or validation repeated after
a schema parsed the value. Each guard tells the reader the case can happen,
sends them looking for where, and adds a branch to the main path. A `default`
that is the `never` exhaustiveness check, throws for values from outside the
code, or is required by the project's style is not such a guard.

Types in TypeScript are claims, not runtime facts. A type is evidence only where
checked code produced the value: a literal, a typed function in the snapshot, a
parse step. A value from `JSON.parse`, `fetch`, storage, the DOM, `any`, an `as`
assertion or a loose declaration file carries a type nobody checked, and a guard
on it can be the only real check. The same holds with `strictNullChecks` off,
for index-signature reads without `noUncheckedIndexedAccess` (`array[i]` is
typed as present but can be `undefined`), and for a `catch` binding, where
`err instanceof Error` is a real check.

This profile traces whether a guard's case can occur, which control-flow
otherwise leaves alone. A candidate needs the guarantee traced through quoted
lines, from where the fact is established to the guard, along every path inside
the visibility. Without that trace there is no candidate: the guard is doing its
job. Keep guards at trust boundaries: request handlers, message and storage
readers, exported functions of a published package, and props a component
receives from code outside the snapshot. Keep a check that names a violated
invariant.

The opposite shape also belongs here: one check repeated in several functions
that receive the same value. Parse once where the value enters and pass on a type
that holds the fact, so downstream code drops its checks. A new type that
carries the fact is the representation lens's remedy ("parse, don't validate");
name it and leave its design there.

`x || fallback` also replaces falsy values such as `0` and `""`, and `??` does
not; changing one into the other changes behavior. Show the guard that
disappears, the trace that makes it unreachable, and what the main path looks
like without it.
