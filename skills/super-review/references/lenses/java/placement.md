# Java placement

## java.placement.find-it-where-it-belongs

**Where it lives.** For each type or member the change adds or moves, ask
where a reader who knows the concept but not this code would look for it:
which module of the build, which package, which class. Does it live there?
Read the package's classes and what each holds, and the module's layout: how
sibling features are split into packages, where controllers, services,
domain types, persistence and configuration live.

Look for:

- **Feature Envy**: a method that works mostly on another class's or
  package's data, reaching through its getters to do its job.
- **Divergent Change at class level**: a class the change grows with
  another, unrelated responsibility, so it now changes for several reasons
  and its name describes only one of them.
- **A grab-bag**: code added to a `Utils`, `Helper`, `Common` or `Constants`
  class or a `util` package that belongs to one concept, where the concept's
  own class or package exists or a cohesive new one would name it.
- **Colocation**: a type, constant or helper declared far from its only
  user, or a class whose name promises one concept while the change puts
  another one in it.
- **Layout drift**: the change places code against the layout the module
  already uses consistently, by feature or by layer. One precedent or a
  split without a direction is not a layout.

Recommend the move with its destination, the concept that makes that place
the one a reader would open, and what the reader no longer has to search.
Retain the current place when the move saves no search, or when the code
belongs to the place it is in and only resembles another concept.

In Java the package is a visibility boundary. Moving a class or member out
of its package can force package-private access to become `public`, which
widens the API; name that cost. A move changes fully qualified names used
by reflection, serialization, configuration files, `module-info`
`exports`/`opens`, and Spring component scanning, entity scanning and
`@Import` lists; check each before recommending it. Moving between Maven or
Gradle modules changes their dependencies and can create a cycle. Keep one
public top-level type per file, and keep what the build places by
convention, such as `src/main/resources` and generated sources.

In a change review the code the change adds or moves is the subject. A
misplaced older declaration is not a backlog, unless the change adds to it.
One decision spread across files belongs to change-locality, the direction
of dependencies to dependency-boundaries, the project's way of handling a
concern to conventions, and structure inside a method to
function-cohesion. This lens owns where a declaration lives.
