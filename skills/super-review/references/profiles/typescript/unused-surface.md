# Unused surface

Owner: abstractions
Rule: ts.abstractions.earn-the-boundary

**Present use.** Read the changed declarations with every use inside their
visibility. What do they offer that no current caller uses? An optional
parameter or property no call passes, an option every call sets the same, a
union member nothing constructs, an overload no call selects, a returned field
every caller ignores, an export no module imports, a generic every call infers
to one type, a compatibility path whose migration has finished. Each makes
readers learn a variation that never happens. Read what the change removes as
well: a deleted call can leave the last use of an item behind. An export that is
used, but wider than its users, is visibility, which belongs to
dependency-boundaries.

Visibility bounds the search. A non-exported declaration has every user in its
module. An export of an application module has every importer in the package,
including re-exports, `import type`, dynamic `import()` and path aliases. An
export reachable through the package's published entry points may have
consumers outside the snapshot: apply the shared compatibility judgment. A value
can come from outside the code, through JSON, requests, storage or the
environment; a union member or branch for it is not dead because the snapshot
never constructs it.

Some uses do not appear as imports. A framework calls exports by name or file
location, such as a Next.js route handler, page, metadata or segment-config
export (Next.js 16 removes `revalidate` and similar segment options when Cache
Components is enabled). A decorator, dependency container or serializer can
reach members by reflection; a declaration file can describe a global another
script provides. A callback keeps each parameter before the last one it uses,
because position carries the meaning. An item that only tests use is unused
surface unless it is a deliberate seam; say which, and do not recommend adding
back doors for tests.

Recommend the deletion with the uses that disappear and the call sites that
change. Dropping an optional property or parameter nobody passes usually
changes no behavior, though it can be observed through a function's `length`, a
class's own fields or type-level users such as `Parameters<>` or `keyof`.
Removing a branch or a union member is readability advice only when no producer
inside the visibility reaches it; otherwise it is a decision and stays. Retain an
extension point with a present consumer or a documented public contract.

Abstractions owns layers, wrappers and type-level machinery that forward
knowledge; this profile owns surface that nothing uses. Show what a reader no
longer has to consider and which edits the deletion requires.
