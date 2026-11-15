# Rust conventions

## rust.conventions.follow-established-approach

**One way per concern.** Name the recurring concerns the changed code handles,
such as errors, logging and instrumentation, configuration, async runtime and
shared state, construction of services and clients, newtypes, encoding, time,
and the crate's own mechanisms (a `Result` alias, a prelude, an extension trait,
a builder). How does this crate already handle each one? Where the change adds a
second way, the next reader has to learn both, and the next change to that
concern has to be made in both styles.

Search before judging: the owning crate first, then the workspace for precedent.
A sibling crate's dependency is not this crate's approach, and a library and an
application in one workspace can deliberately differ, as with typed errors in
the library and an opaque error in the binary. Read several uses. An approach is
established when the crate uses it consistently. One precedent or a deprecated
form establishes nothing. A split between two forms establishes nothing unless
it has a direction: a deprecation, a design note, or newer modules consistently
using one form make that form the established one.

Recommend aligning when the established approach states the same contract, and
name the concrete cost: the two mechanisms a reader must reconcile, or the
places a change to the concern would now need to cover. A new dependency that
duplicates one the crate already uses for the same role is strong evidence of a
second way; a bridge between two libraries is compatibility, not a second way.
Spelling and formatting are not findings; team rules and committed lint
configuration decide those. When the established mechanism also does something
the new code does not, adopting it changes behavior. Where that difference is a
decision, such as retrying or classifying errors differently, report the
divergence and leave the remedy unresolved; where it only changes what callers
or logs observe, recommend aligning and state the effect.

Retain the new form when the established one does not fit this contract, or when
it is clearly better and the change starts an intended migration; say so and
name the old uses it leaves, without turning unchanged code into a cleanup
backlog. MSRV and features bound the remedy.

Reimplementing an existing helper's operation belongs to duplication; one
decision spread across files belongs to change-locality. This lens owns the
choice between approaches to a concern. Name the concerns searched and the uses
compared in coverage, so a clean result shows what was looked for.
