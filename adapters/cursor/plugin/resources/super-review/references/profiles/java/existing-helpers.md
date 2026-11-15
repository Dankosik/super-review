# Java existing helpers

Owner: duplication
Rule: java.duplication.share-knowledge

**Who already does this?** For code the change writes by hand to do a general
job rather than this project's own domain, ask who already does it. It may be
a small method (often private or static at the bottom of a class), a
single-purpose wrapper or closeable holder, inline boundary glue around a JDK or
imported library type (re-parsing a parsed value, formatting only to test a
property, manual URI/header/form/SQL/unit/error-code plumbing, or working around
an indirect call where a direct API exists), or a whole mechanism that the JDK,
a library, a record or an annotation already provides. Size does not matter; a
maintained owner of the same knowledge does. When custom code mixes generic
mechanics with a domain or protocol rule, delegate the generic part and keep the
domain rule local. Search in this order and take the first that fits:

1. The JDK at the project's `--release` baseline: `Objects`, `Optional`,
   `Collections`, `Collectors`, `List.of`/`Map.of`/`List.copyOf`,
   `String.isBlank`, `strip` and `repeat` from Java 11, `Math.clamp` from Java
   21, `URI`, `Duration` and `java.time`, `java.nio.file.Files` and `Path`.
2. A helper already in the repository, in this module or another one, under
   any name. Search by what it does: its parameter and result types, its loop
   shape, the JDK calls inside it.
3. A library already declared in this module's Maven or Gradle build (or in the
   parent/platform BOM or project docs, naming any module dependency edit),
   such as Guava, Apache Commons or Spring's utilities, including methods and
   constants on types the class already imports.
4. A widely used library not yet in the build, only when the custom code
   carries non-trivial edge cases the library already handles. Adding it is the
   team's decision: name the dependency as the cost.

A dependency already in the build, or one the project's documentation
recommends for this job, is a choice the team has made: code beside it that
does the job by hand is the clearest candidate, even when nothing uses that API
yet. A workaround comment explaining a quirk of calling a library indirectly is
a signal to check for a direct API. A recorded decision against a library for
this job keeps the hand-written code; cite where it is recorded.

Reinventing the wheel is the burden: every reader has to check that the copy
does what the standard version does. Recommend the replacement with the
call sites that change.

The reverse case belongs here too. The same helper written in several
classes under different names is one piece of knowledge held in several
places. Extract it once it has a second user today, in the change or
elsewhere in the snapshot; a use that might come later is Speculative
Generality. Put it where the project already keeps such helpers, or with the
concept it serves, not in a new grab-bag `Utils` class; where it lives is
placement's question.

A replacement must behave the same on the edges callers reach: accepted inputs,
`null` inputs and results, empty strings and collections, whitespace as `trim`
(up to U+0020) or as `strip` (`Character.isWhitespace`) defines it, mutability
of the returned collection (`List.of` rejects `null` and changes), rounding,
ordering and stability, locale and time zone/precision, which exception surfaces
first, cancellation/interruption and close timing, and exact wire or stored
bytes; for a mechanism or generated code, every behavior its users rely on.
Inspect locally available JDK or locked dependency source when needed rather
than guessing from names. A replacement that differs on one of those is not a
plain replacement: name the difference, or keep the custom code and report
missing rationale when nothing at the site records why the obvious API was
avoided. Keep a helper that carries domain meaning in its name, and a two-line
helper whose replacement would add a net-new external dependency.
