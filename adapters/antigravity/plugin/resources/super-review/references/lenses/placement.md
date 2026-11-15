# Placement

## go.placement.find-it-where-it-belongs

**Where it lives.** For each declaration the change adds or moves, ask where
a reader who knows the concept but not this code would look for it: which
package, which file. Does it live there? Read the package's files, their
names and what each holds, and the module's layout: how sibling features are
split into packages, where handlers, domain logic, storage and wiring live.

Look for:

- **Feature Envy at package level**: a function or method that works mostly
  on another package's types and data, imported to do that package's job.
- **Divergent Change at file level**: a file the change grows with another,
  unrelated responsibility, so it now changes for several reasons and its
  name describes only one of them.
- **A grab-bag**: code added to `util`, `common`, `helpers`, `misc` or
  `shared` that belongs to one concept, where the concept's own package
  exists or a cohesive new one would name it.
- **Colocation**: a type, constant or helper declared far from its only
  user, or a file whose name promises one concept while the change puts
  another one in it.
- **Layout drift**: the change places code against the layout the module
  already uses consistently, by feature or by layer. One precedent or a
  split without a direction is not a layout.

Recommend the move with its destination, the concept that makes that place
the one a reader would open, and what the reader no longer has to search.
Retain the current place when the move saves no search, or when the code
belongs to the place it is in and only resembles another concept.

In Go the package is the unit. Moving between files of one package changes
navigation and nothing else, so it needs a reader who would look elsewhere.
Moving between packages changes the exported surface, may turn an
unexported name into an exported one or move it under `internal/`, and can
create an import cycle; name each consequence and the callers to update.
Keep `main` packages, build-tagged and platform files, generated files and
`_test.go` placement as the toolchain fixes them.

In a change review the code the change adds or moves is the subject. A
misplaced older declaration is not a backlog, unless the change adds to it.
One decision spread across files belongs to change-locality, the direction
of dependencies to dependency-boundaries, the project's way of handling a
concern to conventions, and structure inside a function to
function-cohesion. This lens owns where a declaration lives.
