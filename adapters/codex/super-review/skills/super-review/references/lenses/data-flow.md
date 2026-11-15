# Data flow

## go.data.make-transformations-visible

**Visible ownership and transitions.** Follow each value from origin through
transformations, storage, and use. Target places where readers must remember an
earlier meaning of a reused variable, jump across internal helpers to see who
mutates a value, or watch data get repackaged only to cross an internal seam.

Remove non-load-bearing staging: split a variable when reuse hides a change of
meaning; narrow a binding's scope to keep mutation next to its use; collapse
cross-seam repackaging where a function materializes an intermediate slice, map,
or adapter struct only to pass items to an internal helper, builder, or
formatter that can accept them directly; and drop round-trip formatting or
re-parsing of an already-parsed value just to test an input property. Read
helper bodies and callers before claiming a rewrite simplifies the flow.

**Keep when:** an intermediate binding names a real stage, or staging preserves
error precedence, all-or-nothing writes, or an intentional snapshot; or visible
local mutation, a clear statement sequence, or a single copy already makes
ownership plain. Account for shared slice/map backing storage, nil versus empty
slices, shallow struct copies, receiver method-set rules, and non-copyable
`sync` primitives as constraints on your rewrite rather than a hunt for race or
allocation bugs. Show which origin, transition, or mutation becomes clear.
