# Java existing helpers

Owner: duplication
Rule: java.duplication.share-knowledge

**Who already does this?** For each small method the change adds for a
general operation, such as on strings, collections, numbers, dates, paths,
retries, parsing or comparison, often private or static at the bottom of a
class, ask who already does it. Search in this order and take the first
that fits:

1. The JDK at the project's release level: `Objects`, `Optional`,
   `Collections`, `Collectors`, `List.of` and `Map.of`, `String.isBlank`,
   `strip` and `repeat` from Java 11, `Math.clamp` from Java 21, `java.time`,
   `java.nio.file.Files` and `Path`.
2. A helper already in the repository, in this module or another one, under
   any name. Search by what it does: its parameter and result types, its loop
   shape, the JDK calls inside it.
3. A library already in the Maven or Gradle build, such as Guava, Apache
   Commons or Spring's utilities, that offers the operation.
4. A widely used library not yet in the build, only when the helper carries
   logic with edge cases the library already handles. Adding it is the team's
   decision: name the dependency as the cost.

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

A replacement must behave the same on the edges callers reach: `null`
inputs and results, empty strings and collections, whitespace as `trim`
(up to U+0020) or as `strip` (`Character.isWhitespace`) defines it,
mutability of the returned collection (`List.of` rejects `null` and changes), rounding,
ordering and stability, locale and time zone, and the exception thrown. A
JDK method that differs on one of those is not a plain replacement; name the
difference, or the effect callers would see. Keep a helper that carries
domain meaning in its name, and a two-line helper whose replacement would
add a dependency.
