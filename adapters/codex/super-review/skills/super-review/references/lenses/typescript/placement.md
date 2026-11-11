# TypeScript placement

## ts.placement.find-it-where-it-belongs

**Where it lives.** For each declaration, component or hook the change adds
or moves, ask where a reader who knows the concept but not this code would
look for it: which package of the workspace, which directory, which file.
Does it live there? Read the directory's files and what each holds, and the
project's layout: how sibling features are split, where components, hooks,
server code, domain logic, data access and types live.

Look for:

- **Feature Envy at module level**: a function that works mostly on another
  module's types and data, imported to do that module's job.
- **Divergent Change at file level**: a file the change grows with another,
  unrelated responsibility, such as a component file that gains data
  fetching and formatting for other screens, so its name describes only one
  of them.
- **A grab-bag**: code added to `utils`, `lib`, `common`, `helpers` or
  `shared` that belongs to one feature, where the feature's own directory
  exists or a cohesive module would name it.
- **Colocation**: a type, constant, hook or component declared far from its
  only user, such as a global `types` file holding one feature's props.
- **Layout drift**: the change places code against the layout the package
  already uses consistently, by feature or by kind. One precedent or a
  split without a direction is not a layout.

Recommend the move with its destination, the concept that makes that place
the one a reader would open, and what the reader no longer has to search.
Retain the current place when the move saves no search, or when the code
belongs to the place it is in and only resembles another concept.

In TypeScript the file is the module. A move changes every import path, may
create an import cycle or change when a module's top-level code runs, and
can change what a barrel or the package's `exports` publish; name each
consequence and the importers to update. Keep the file names and locations
a framework fixes, such as Next.js `app/` and `pages/` route files,
`layout`, `page`, `route` and `middleware`, and files a bundler, test runner
or code generator finds by convention. A `"use client"` or `"use server"`
boundary moves with its file, so a move must not drag server code into a
client module or the reverse.

In a change review the code the change adds or moves is the subject. A
misplaced older declaration is not a backlog, unless the change adds to it.
One decision spread across files belongs to change-locality, the direction
of dependencies to dependency-boundaries, the project's way of handling a
concern to conventions, and structure inside a function to
function-cohesion. This lens owns where a declaration lives.
