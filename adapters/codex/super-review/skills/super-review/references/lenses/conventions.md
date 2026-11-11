# Conventions

## go.conventions.follow-established-approach

**One way per concern.** Name the recurring concerns the changed code handles,
such as creating and wrapping errors, logging, configuration, dependency
construction, HTTP or storage clients, validation, time, identifiers, encoding,
background work and shared state, and the project's own mechanisms. How does
this codebase already handle each one? Where the change adds a second way, the
next reader has to learn both, and the next change to that concern has to be
made in both styles.

Search before judging: the owning package and module first, then the repository
for precedent; another module's choice is not this module's. Look at competing
libraries in `go.mod`, imports in sibling files, the project's own helpers for
the concern, and sibling code doing the same kind of work. Read several uses. An
approach is established when the area uses it consistently. One precedent or a
deprecated form establishes nothing. A split between two forms establishes
nothing unless it has a direction: a deprecation, a design note, or newer code
consistently using one form make that form the established one. The standard
library is always available, but like a project wrapper over it, it is
established for a concern only where the area uses it.

Recommend aligning when the established approach states the same contract, and
name the concrete cost: the two mechanisms a reader must reconcile, or the
places a change to the concern would now need to cover. A new dependency that
duplicates one the module already uses for the same role is strong evidence of
a second way; a bridge between two libraries is compatibility. Spelling,
formatting and local preference are not findings unless they impose a concrete
burden; team rules and committed linter configuration decide those. When the
established mechanism also does something the new code does not, adopting it
changes behavior. Where that difference is a decision, such as retrying or
mapping errors to statuses, report the divergence and leave the remedy
unresolved; where it only changes what callers or logs observe, recommend
aligning and state the effect.

Retain the new form when the established one does not fit this contract, or when
it is clearly better and the change starts an intended migration; say so and
name the old uses it leaves, without turning unchanged code into a cleanup
backlog.

Reimplementing an existing helper's operation belongs to abstractions or
duplication; one decision spread across files belongs to change-locality. This
lens owns the choice between approaches to a concern. Name the concerns searched
and the uses compared in coverage, so a clean result shows what was looked for.
