# Java existing helpers

Owner: duplication
Rule: java.duplication.share-knowledge

**Maintained owners over hand-rolled plumbing.** When changed code writes a
general mechanism, single-purpose wrapper/closeable holder, or inline boundary
glue by hand (re-parsing parsed values, formatting only to test a property,
manual URI/header/form/SQL/unit/error-code plumbing, or an indirect workaround
where a JDK or library type offers a direct API), delegate the generic mechanics
to the first existing owner that fits and keep domain rules local:

1. **JDK platform APIs** within the module's `--release` baseline.
2. **Repository helpers** in this module or another one, searched by parameter
   and result types, loop shape, and JDK calls rather than name alone.
3. **Declared build dependencies** in the module's Maven/Gradle build, parent
   BOM, or project docs (naming any module-dependency edit), including methods,
   records, annotations, and constants on already-imported types.
4. **Net-new widely used libraries**: propose only when custom code carries
   non-trivial edge cases, naming the added dependency as a team decision.
5. **Twin local helpers**: the same helper written under different names across
   two or more real call sites today -> extract to the concept's class/package
   (never a grab-bag `Utils` class; single-caller extraction is Speculative
   Generality).

**Keep when:** a recorded project decision rejects the library (cite where), a
two-line domain-named helper avoids a net-new external dependency, or the
candidate API differs on an edge callers reach: accepted inputs, `null` inputs
and results, empty strings and collections, `trim` (`<= U+0020`) vs `strip`
(`Character.isWhitespace`), collection mutability and `null` rejection
(`List.of`/`Map.of`), rounding, ordering/stability, locale and time
zone/precision, first exception thrown, interruption/close timing, or
wire/stored bytes (inspect local JDK or locked dependency source rather than
guessing, and report missing `rationale` when custom code stays silently).
