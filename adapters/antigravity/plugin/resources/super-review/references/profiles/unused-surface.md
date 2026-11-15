# Unused surface

Owner: abstractions
Rule: go.abstractions.earn-the-boundary

**Present use.** Read the changed declarations with every use inside their
visibility. What do they offer that no current caller uses? A parameter every
call passes the same value, an option or configuration field nothing sets, a
result every caller discards, an error result that is always nil, an interface
method no consumer calls, a branch for a value nothing produces, a compatibility
path whose migration has finished. Each makes readers learn a variation that
never happens. Read what the change removes as well: a deleted call can leave
the last use of an item behind. An identifier used, but exported wider than its
users, is visibility, which belongs to dependency-boundaries.

The compiler already rejects unused imports and most unused locals, so spend the
search on what it accepts: parameters, fields, results, package-level
declarations, exported names, and locals that are only written.

Visibility bounds the search. Unexported identifiers, `main` packages and
`internal/` packages under the snapshot's tree have every user in the snapshot;
search across build tags and platform files. An unexported or `internal` type
that escapes through an exported function, field or alias is still reachable
from outside. An exported identifier in an importable package may have
consumers outside the snapshot: apply the shared compatibility judgment. A value
can come from outside the code, through configuration, flags, requests, the
environment or stored data; a branch for it is not dead because the snapshot
never constructs it.

Some uses do not appear as calls: a method that satisfies an interface, a
function whose parameter list a handler signature fixes, fields read through
encoding packages, templates or reflection, and code reached by `go:linkname` or
cgo export. A parameter fixed by a signature can become `_`, not disappear. An
item that only tests use is unused surface unless it is a deliberate seam; say
which, and do not recommend adding back doors for tests.

Recommend the deletion with the uses that disappear and the call sites that
change. Removing an unused option changes no behavior; removing a fixed
parameter changes none if side effects in its argument expressions are kept.
Removing a branch is readability advice only when no producer inside the
visibility reaches it; otherwise it is a decision and stays. Retain an extension
point with a present consumer or a documented public contract.

Abstractions owns layers, wrappers and interfaces that forward knowledge; this
profile owns surface that nothing uses. Show what a reader no longer has to
consider and which edits the deletion requires.
