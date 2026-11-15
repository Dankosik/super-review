# Conventions

## ts.conventions.follow-established-approach

**One way per concern.** Name the recurring concerns the changed code handles,
such as fetching data, validating and parsing input, representing failure
(throwing, rejected promises or result unions), logging, environment and
configuration, time, identifiers, shared state, dependency construction, and the
project's own mechanisms. How does this package already handle each one? Where
the change adds a second way, the next reader has to learn both, and the next
change to that concern has to be made in both styles.

Search before judging: the owning package first, then the workspace for
precedent; a sibling package's choice is not this package's. Look at competing
dependencies in its `package.json`, the project's own helpers for the concern,
and sibling modules doing the same kind of work. Read several uses. An approach
is established when the package uses it consistently. One precedent or a
deprecated form establishes nothing. A split between two forms establishes
nothing unless it has a direction: a deprecation, a design note, or newer
modules consistently using one form make that form the established one.

Recommend aligning when the established approach states the same contract, and
name the concrete cost: the two mechanisms a reader must reconcile, or the
places a change to the concern would now need to cover. A new dependency that
duplicates one the package already uses for the same role is strong evidence of
a second way; a bridge between two libraries is compatibility. Spelling, import
style and formatting become findings only when they impose a concrete burden; team
rules and the project's lint configuration decide those. When the established
mechanism also does something the new code does not, adopting it changes
behavior. Where that difference is a decision, such as retrying, attaching
credentials or classifying errors, report the divergence and leave the remedy
unresolved; where it only changes what callers or logs observe, recommend
aligning and state the effect.

Retain the new form when the established one does not fit this contract, or when
it is clearly better and the change starts an intended migration; say so and
name the old uses it leaves, without turning unchanged code into a cleanup
backlog. Framework conventions for React, Next.js, Tailwind or shadcn/ui stay
with the selected frontend profiles; this lens compares the project's own
choices.

Reimplementing an existing helper's operation belongs to duplication; one
decision spread across files belongs to change-locality. This lens owns the
choice between approaches to a concern. Name the concerns searched and the uses
compared in coverage, so a clean result shows what was looked for.
