# Java unused surface

Owner: abstractions
Rule: java.abstractions.earn-the-boundary

**Present use.** Read the changed declarations with every use inside their
visibility. What do they offer that no current caller uses? A parameter every
call passes the same value, an overload no call selects, a setter or
configuration property nothing sets, an enum constant nothing produces, an
interface method no consumer calls, a `throws` clause for a checked exception
neither the body nor any override throws, a return value every caller discards,
a compatibility path whose migration has finished. Each makes readers learn a
variation that never happens. Read what the change removes as well: a deleted
call can leave the last use of an item behind. A member that is used, but
declared wider than its users, is visibility, which belongs to
dependency-boundaries.

Visibility bounds the search. A `private` member has every source use in its
top-level class, a package-private one in its package. A `public` or `protected`
member of a module that other builds consume, or of a package `module-info.java`
exports, may have users outside the snapshot: apply the shared compatibility
judgment. A value can come from outside the code, through requests,
configuration, messages or the database; a constant or branch for it is not dead
because the snapshot never constructs it.

Many uses do not appear as calls. Framework annotations (Spring beans, event
listeners, scheduled methods, configuration properties), reflection (Jackson,
JPA, binding), serialization methods, `ServiceLoader` providers and
Lombok-generated code use members without a source call, and an overriding
method exists for its supertype. Treat these as uses. An item that only tests use
is unused surface unless it is a deliberate seam; say which, and do not
recommend adding back doors for tests.

Recommend the deletion with the uses that disappear and the call sites that
change. Removing an unused setter or overload changes no behavior; removing a
fixed parameter changes none if side effects in its argument expressions are
kept and the method neither overrides nor is overridden. Removing an enum
constant or branch is readability advice only when no producer inside the
visibility reaches it and no ordinal-based storage, `values()` use or stored
name depends on the constant; otherwise it is a decision and stays. Retain an
extension point with a present consumer or a documented public contract.

Abstractions owns layers, interfaces and generic types that forward knowledge;
this profile owns surface that nothing uses. Show what a reader no longer has to
consider and which edits the deletion requires.
