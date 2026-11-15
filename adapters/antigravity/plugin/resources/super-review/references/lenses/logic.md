# Logic

## go.logic.fewer-moving-parts

**Moving parts.** For each computation the change adds or reshapes, ask
whether its result needs every case, pass and intermediate value the code
spells out. Is there a form with fewer of them that gives the same result for
every input and that a reader can check at a glance? Read the whole
computation, where its inputs come from and how its result is used.

Look for:

- **A special case the general path covers**: a branch for an empty or
  single-element input, zero, the first or last item, or a boundary index,
  whose result the general path already produces.
- **A case a formulation removes**: cases that one rule unifies once the
  input is normalized where it enters, an accumulation starts from its
  identity element, a sentinel or a half-open range removes an edge, or a
  lookup table replaces a branch per value. Ousterhout calls this defining
  the case out of existence.
- **A case product**: branches over combinations of conditions when the
  result depends on each condition separately, so independent decisions or
  a table state it with fewer paths.
- **A detour**: several passes, an intermediate collection, a sort, a
  conversion and its inverse, or a map built to be read once, where a direct
  computation gives the same result.

A finding shows the simpler form and why it is equivalent: for each case or
step removed, quoted lines showing which path that input now takes and that
it yields the same values, errors, effects and order. The edges decide it:
empty, one, boundary values, negative numbers, overflow, absence. When
equivalence rests on a fact outside the visible source, there is no finding.
A form that changes what the code returns, accepts or does for some input is
not a simplification; keep the observation and leave the remedy unresolved,
as the review contract requires.

Retain the cases when they are the clearer statement: when the unified rule
needs a trick the reader must prove, such as index arithmetic, bit
manipulation or a clever sentinel; when a special case states a requirement
the reader needs to see; or when an early exit for the common case is the
shortest explanation. Fewer branches bought with a formula nobody can check
at a glance is not simpler. Retain a detour the code documents as taken for
its cost; performance is not this lens's question in either direction.

In Go, ranging over a nil or empty slice or map does nothing, `len` and
`append` accept nil, and a missing map key reads as the zero value, so many
empty branches return what the general path would. A nil slice and an empty
one still differ for `encoding/json` (`null` versus `[]`), for
`reflect.DeepEqual` and for callers that compare with nil; an empty branch
may be the only place that distinction is made. Integer arithmetic wraps
silently and `/` and `%` truncate toward zero, so a formula that unifies
signed or near-limit cases needs those edges traced.

A guard for a case the code has already ruled out belongs to the
defensive-checks profile; this lens owns cases that do occur but need no
code of their own. How the remaining decisions are laid out belongs to
control-flow, a type that carries a case to representation, a library
operation that replaces a mechanism to duplication, and a value kept in sync
with another to data-flow. This lens owns how many cases and steps a
computation has. Show which ones disappear and what the reader no longer
has to check.
