# Existing helpers

Owner: duplication
Rule: go.duplication.share-knowledge

**Maintained owners over hand-rolled plumbing.** When changed code writes a
general mechanism, single-purpose wrapper/guard, or inline boundary glue by hand
(re-parsing parsed values, formatting only to test a property, manual
URL/header/form/query/SQL/unit/error-code plumbing, or an indirect workaround
where an imported package exposes a direct API), delegate the generic mechanics
to the first existing owner that fits and keep only domain rules local:

1. **Go standard library** within the module's `go` directive and build
   constraints.
2. **Repository helpers** in this package or another one, searched by parameter
   and result types, loop shape, and standard calls rather than name alone.
3. **Declared modules** in `go.mod` (or `go.work`, naming any module-boundary
   edit), including methods and constants on types the package already imports.
4. **Net-new widely used modules**: propose only when custom code carries
   non-trivial edge cases, naming the added dependency as a team decision.
5. **Twin local helpers**: the same helper written under different names across
   two or more real call sites today -> extract to the concept's package (never
   a new grab-bag `util` package; single-caller extraction is Speculative
   Generality).

**Keep when:** a recorded project decision rejects the package (cite where), a
two-line domain-named helper avoids a net-new external dependency, or the
candidate API differs on an edge callers reach: accepted inputs, `nil` vs empty
slices and maps, empty strings, Unicode vs bytes, rounding, ordering/stability,
tie-breaking, first error returned, cancellation and cleanup timing, time
precision, or wire/stored bytes (inspect local stdlib or `go.sum`-resolved
source rather than guessing, and report missing `rationale` when custom code
stays silently for a boundary difference).
