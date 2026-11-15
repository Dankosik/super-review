# Rust placement

## rust.placement.find-it-where-it-belongs

**Where it lives.** For each item the change adds or moves, ask where a
reader who knows the concept but not this code would look for it: which
crate of the workspace, which module, which file. Does it live there? Read
the module tree from `lib.rs` or `main.rs`, what each module holds, and the
crate's layout: how sibling features are split into modules or crates, where
domain types, I/O, handlers and wiring live.

Look for:

- **Feature Envy at module level**: a function or `impl` block that works
  mostly on another module's types and data, reaching into it to do that
  module's job.
- **Divergent Change at file level**: a module file the change grows with
  another, unrelated responsibility, so it now changes for several reasons
  and its name describes only one of them.
- **A grab-bag**: code added to `utils`, `common`, `helpers`, `misc` or
  `shared` that belongs to one concept, where the concept's own module
  exists or a cohesive new one would name it.
- **Colocation**: a type, constant, trait or helper declared far from its
  only user, or a module whose name promises one concept while the change
  puts another one in it.
- **Layout drift**: the change places code against the layout the crate
  already uses consistently, by feature or by layer. One precedent or a
  split without a direction is not a layout.

Recommend the move with its destination, the concept that makes that place
the one a reader would open, and what the reader no longer has to search.
Retain the current place when the move saves no search, or when the code
belongs to the place it is in and only resembles another concept.

In Rust the module path is part of an item's name. Moving a public item
changes its path for every user; keep the old path with a `pub use`
re-export where the crate is published or other crates import it, and name
it. A move changes what `pub(crate)`, `pub(super)` and private items can
see, and an inherent `impl` must stay in the crate that defines its type.
Moving between crates of a workspace changes `Cargo.toml` dependencies and
can create a cycle. Keep `mod.rs` or `name.rs` as the crate already does,
and keep what the toolchain places by convention: `build.rs`, `src/bin/`,
`examples/`, `benches/` and `#[cfg(test)]` modules.

In a change review the code the change adds or moves is the subject. A
misplaced older item is not a backlog, unless the change adds to it. One
decision spread across files belongs to change-locality, the direction of
dependencies to dependency-boundaries, the project's way of handling a
concern to conventions, and structure inside a function to
function-cohesion. This lens owns where an item lives.
