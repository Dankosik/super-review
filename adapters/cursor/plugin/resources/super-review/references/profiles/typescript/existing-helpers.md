# TypeScript existing helpers

Owner: duplication
Rule: ts.duplication.share-knowledge

**Who already does this?** For code the change writes by hand to do a general
job rather than this project's own domain, ask who already does it. It may be
a small function (often unexported at the bottom of a file), a single-purpose
wrapper or disposable helper, inline boundary glue around a runtime or imported
package API (re-parsing a parsed value, serializing only to check a property,
manual URL/query/header/form/unit/error-code plumbing, or working around an
indirect library call where a direct API exists), or a whole mechanism or check
that the language, runtime or a package already provides. Size does not matter;
a maintained owner of the same knowledge does. When custom code mixes generic
mechanics with a domain or protocol rule, delegate the generic part and keep the
domain rule local. Search in this order and take the first that fits:

1. The language and runtime at the project's `target` and `lib` settings and
   supported runtimes: `Array.prototype.at`, `flatMap`, `toSorted`,
   `Object.fromEntries`, `Object.groupBy` and `Map.groupBy` where `lib`
   includes ES2024, `Promise.withResolvers`, `AbortSignal.timeout`/`any`,
   `structuredClone`, `Intl`, `URL` and `URLSearchParams`.
2. A helper already in the repository or workspace, in this package or
   another one, under any name. Search by what it does: its parameter and
   result types, its loop shape, the built-in calls inside it.
3. A package already in this package's `package.json` (or already in the
   workspace/lockfile or recommended by project docs, naming any package
   manifest edit), such as lodash, es-toolkit, date-fns or zod, including
   operations on types the module already imports.
4. A widely used package not yet in the workspace, only when the custom code
   carries non-trivial edge cases the package already handles. Adding it is
   the team's decision: name the dependency and its bundle cost.

A dependency already in `package.json`, or one the project's documentation
recommends for this job, is a choice the team has made: code beside it that
does the job by hand is the clearest candidate, even when nothing uses that API
yet. A workaround comment explaining a quirk of calling a library indirectly is
a signal to check for a direct API. A recorded decision against a library for
this job keeps the hand-written code; cite where it is recorded.

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

A replacement must behave the same on the edges callers reach: accepted inputs,
`undefined` versus `null`, empty arrays and strings, `NaN`, sparse arrays,
Unicode code points versus UTF-16 units, mutation versus a new value, sort
stability and comparison, time zones and precision, which error is thrown first,
cancellation/abort timing, and exact wire or stored output; for a mechanism,
every behavior its users rely on. Inspect locally available declarations or
locked package source when needed rather than guessing from names. A replacement
that differs on one of those is not a plain replacement: name the difference, or
keep the custom code and report missing rationale when nothing at the site
records why the obvious API was avoided. Keep a helper that carries domain
meaning in its name, and a two-line helper whose replacement would add a
net-new external dependency.
