# Existing helpers

Owner: duplication
Rule: go.duplication.share-knowledge

**Who already does this?** For code the change writes by hand to do a general
job rather than this project's own domain, ask who already does it. It may be
a small function (often private at the bottom of a file), a single-purpose
wrapper or guard type, inline boundary glue around an imported type or package
(re-parsing a parsed value, formatting only to test a property, manual URL/
header/form/query/SQL/unit/error-code plumbing, or working around an indirect
call where a direct API exists), or a whole mechanism that the standard library,
a module or code generation already provides. Size does not matter; a
maintained owner of the same knowledge does. When custom code mixes generic
framing or mechanics with a domain or protocol rule, delegate the generic part
and keep the domain rule local. Search in this order and take the first that
fits:

1. The standard library at the module's `go` directive: `slices`, `maps`,
   `strings`, `bytes`, `cmp`, `sort`, `errors.Join`, `sync.OnceValue`/`OnceFunc`,
   `context.AfterFunc`, `net/url`, `net/http`, `time`, `path/filepath`, and the
   `min` and `max` built-ins from Go 1.21.
2. A helper already in the repository, in this package or another one, under
   any name. Search by what it does: its parameter and result types, its loop
   shape, the standard calls inside it.
3. A module already in `go.mod` (or workspace modules in `go.work`, naming any
   module boundary edit) that offers the operation, including methods and
   constants on types the package already imports.
4. A widely used module not yet in `go.mod`, only when the custom code carries
   non-trivial edge cases the module already handles. Adding it is the team's
   decision: name the dependency as the cost.

A dependency already in `go.mod`, or one the project's documentation
recommends for this job, is a choice the team has made: code beside it that
does the job by hand is the clearest candidate, even when nothing uses that API
yet. A comment explaining a workaround for calling a library indirectly is a
lead to check for a direct library API. A recorded decision against a library
for this job keeps the hand-written code; cite where it is recorded.

Reinventing the wheel is the burden: every reader has to check that the copy
does what the standard version does. Recommend the replacement with the
call sites that change.

The reverse case belongs here too. The same helper written in several files
under different names is one piece of knowledge held in several places.
Extract it once it has a second user today, in the change or elsewhere in the
snapshot; a use that might come later is Speculative Generality. Put it where
the project already keeps such helpers, or with the concept it serves, not in
a new grab-bag package; where it lives is placement's question.

A replacement must behave the same on the edges callers reach: accepted inputs,
nil and empty slices and maps, an empty string, Unicode versus bytes, rounding,
ordering and stability, which value wins on ties, which error surfaces first,
cancellation and cleanup timing, time precision, and exact wire or stored bytes;
for a mechanism or generated code, every behavior its users rely on. Inspect
locally available stdlib or `go.sum`-resolved module source when needed rather
than guessing from names. A replacement that differs on one of those is not a
plain replacement: name the difference, or keep the custom code and report
missing rationale when nothing at the site records why the obvious API was not
used. Keep a helper that carries domain meaning in its name, and a two-line
helper whose replacement would add a net-new external dependency.
