# Rust unused surface

Owner: abstractions
Rule: rust.abstractions.earn-the-boundary

**Present use.** Read the changed items with every use inside their visibility.
What do they offer that no current caller uses? A parameter every call passes the
same value, a builder method or field nothing sets, a trait method no consumer
calls, a generic every call fixes to one type, a result every caller discards, a
private function that always returns `Ok` or `Some`, an `async fn` that never
awaits, a compatibility path whose migration has finished. Each makes readers
learn a variation that never happens. Read what the change removes as well: a
deleted call can leave the last use of an item behind.

The compiler's `dead_code` lint already reports most unreachable private items,
so spend the search where it is silent: items a library exports, `pub` items
reachable from a binary's root (not reported by default), items behind a `cfg`
or feature the build leaves out, items under `allow` or `expect`, and every
value-level case above. A `pub` that is wider than its users is visibility,
which belongs to dependency-boundaries.

Visibility bounds the search. A private or `pub(crate)` item has every user in
its crate, including cfg-gated and test code. A `pub` item of a library may have
consumers outside the snapshot: apply the shared compatibility judgment. A value
can come from outside the code, through deserialization, arguments, the
environment or FFI; a variant or branch for it is not dead because the snapshot
never constructs it.

Some uses do not appear as calls: a trait implementation required by a bound, a
derive or a `?` conversion; a macro-generated call; a symbol exported for FFI or
linking; a function whose signature must fit a use as a value, such as
`and_then(f)` or a handler. A field nobody reads can still matter through its
`Drop` or the auto traits it gives the struct, so deleting it changes behavior;
guard fields such as `_guard` exist for exactly this. An item that only tests
use is unused surface unless it is a deliberate seam; say which, and do not
recommend adding back doors for tests. Only a seam that the crate's own unit
tests alone use can move under `#[cfg(test)]`.

Recommend the deletion with the uses that disappear and the call sites that
change. Removing an unused setter or option changes no behavior; removing a
fixed parameter changes none if side effects in its argument expressions are
kept. On a library's public item, either breaks callers (the Cargo SemVer
rules). Removing a variant or branch is readability advice only when no producer
inside the visibility reaches it; otherwise it is a decision and stays. Removing
a public enum variant is breaking even on a `#[non_exhaustive]` enum. Retain an
extension point with a present consumer or a documented public contract.

Abstractions owns layers, wrappers and traits that forward knowledge; this
profile owns surface that nothing uses. Show what a reader no longer has to
consider and which edits the deletion requires.
