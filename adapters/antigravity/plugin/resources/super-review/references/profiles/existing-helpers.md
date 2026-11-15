# Existing helpers

Owner: duplication
Rule: go.duplication.share-knowledge

**Who already does this?** For code the change writes by hand to do a general
job rather than this project's own domain, ask who already does it. It may be
a small function, often private at the bottom of a file, or a whole mechanism
or implementation that the standard library, a module or code generation
already provides. Size does not matter; a maintained owner of the same
knowledge does. Search in this order and take the first that fits:

1. The standard library at the module's `go` directive: `slices`, `maps`,
   `strings`, `bytes`, `cmp`, `sort`, `errors.Join`, `time`, `path/filepath`,
   and the `min` and `max` built-ins from Go 1.21.
2. A helper already in the repository, in this package or another one, under
   any name. Search by what it does: its parameter and result types, its loop
   shape, the standard calls inside it.
3. A module already in `go.mod` that offers the operation.
4. A widely used module not yet in `go.mod`, only when the helper carries
   logic with edge cases the module already handles. Adding it is the team's
   decision: name the dependency as the cost.

A dependency already in `go.mod`, or one the project's documentation
recommends for this job, is a choice the team has made: code beside it that
does the job by hand is the clearest candidate, even when nothing uses the
dependency yet. A recorded decision against a library for this job keeps the
hand-written code; cite where it is recorded.

Reinventing the wheel is the burden: every reader has to check that the copy
does what the standard version does. Recommend the replacement with the
call sites that change.

The reverse case belongs here too. The same helper written in several files
under different names is one piece of knowledge held in several places.
Extract it once it has a second user today, in the change or elsewhere in the
snapshot; a use that might come later is Speculative Generality. Put it where
the project already keeps such helpers, or with the concept it serves, not in
a new grab-bag package; where it lives is placement's question.

A replacement must behave the same on the edges callers reach: nil and empty
slices and maps, an empty string, Unicode versus bytes, rounding, ordering and
stability, which value wins on ties, and the errors returned; for a mechanism
or generated code, every behavior its users rely on. A replacement that
differs on one of those is not a plain replacement; name the difference, or
the effect callers would see. Keep a helper that carries domain meaning in its
name, and a two-line helper whose replacement would add a dependency.
