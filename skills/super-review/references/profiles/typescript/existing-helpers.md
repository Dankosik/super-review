# TypeScript existing helpers

Owner: duplication
Rule: ts.duplication.share-knowledge

**Who already does this?** For each small function the change adds for a
general operation, such as on strings, arrays, objects, numbers, dates,
paths, retries, parsing or comparison, often unexported and at the bottom of
a file, ask who already does it. Search in this order and take the first
that fits:

1. The language and runtime at the project's `target` and `lib` settings and
   supported runtimes: `Array.prototype.at`, `flatMap`, `toSorted`,
   `Object.fromEntries`, `Object.groupBy` and `Map.groupBy` where the `lib`
   includes ES2024, `structuredClone`, `Intl`, `URL` and `URLSearchParams`.
2. A helper already in the repository or workspace, in this package or
   another one, under any name. Search by what it does: its parameter and
   result types, its loop shape, the built-in calls inside it.
3. A package already in `package.json`, such as lodash, es-toolkit, date-fns
   or zod, that offers the operation.
4. A widely used package not yet in `package.json`, only when the helper
   carries logic with edge cases the package already handles. Adding it is
   the team's decision: name the dependency and its bundle cost.

Reinventing the wheel is the burden: every reader has to check that the copy
does what the standard version does. Recommend the replacement with the
call sites that change.

The reverse case belongs here too. The same helper written in several files
under different names is one piece of knowledge held in several places.
Extract it once it has a second user today, in the change or elsewhere in the
snapshot; a use that might come later is Speculative Generality. Put it where
the project already keeps such helpers, or with the concept it serves, not in
a new grab-bag `utils` file; where it lives is placement's question. A
helper shared between server and client code must be safe in both.

A replacement must behave the same on the edges callers reach: `undefined`
versus `null`, empty arrays and strings, `NaN`, sparse arrays, Unicode code
points versus UTF-16 units, mutation versus a new value, sort stability and
comparison, time zones, and what is thrown. A built-in that differs on one
of those is not a plain replacement; name the difference, or the effect
callers would see. Keep a helper that carries domain meaning in its name,
and a two-line helper whose replacement would add a dependency.
