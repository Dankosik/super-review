# Java conventions

## java.conventions.follow-established-approach

**One way per concern.** Name the recurring concerns the changed code handles,
such as exception types and translation, logging, configuration, dependency
injection, mapping between layers, value classes, absence (`null`, `Optional` or
empty collections), HTTP and persistence access, validation, time, identifiers,
shared state, and the project's own mechanisms. How does this module already
handle each one? Where the change adds a second way, the next reader has to
learn both, and the next change to that concern has to be made in both styles.

Search before judging: the owning package and module first, then the repository
for precedent; another module's choice is not this module's. Look at competing
dependencies in the Maven or Gradle configuration, the project's base classes,
exception hierarchy and helpers for the concern, and sibling classes doing the
same kind of work. Read several uses. An approach is established when the module
uses it consistently. One precedent or a deprecated form establishes nothing. A
split between two forms establishes nothing unless it has a direction: a
deprecation, a design note, or newer classes consistently using one form make
that form the established one.

Recommend aligning when the established approach states the same contract, and
name the concrete cost: the two mechanisms a reader must reconcile, or the
places a change to the concern would now need to cover. A new dependency that
duplicates one the module already uses for the same role is strong evidence of
a second way; a bridge between two libraries is compatibility. Modifier order,
formatting and local preference are not findings unless they impose a concrete
burden; team rules and committed Checkstyle or similar configuration decide
those. When the established mechanism also does something the new code does not,
adopting it changes behavior. Where that difference is a decision, such as
mapping exceptions to statuses or opening a transaction, report the divergence
and leave the remedy unresolved; where it only changes what callers or logs
observe, recommend aligning and state the effect.

Retain the new form when the established one does not fit this contract, or when
it is clearly better and the change starts an intended migration; say so and
name the old uses it leaves, without turning unchanged code into a cleanup
backlog. The module's baseline bounds a newer form. Spring mechanisms keep their
selected Spring profiles. Do not align new code to field injection: required
dependencies go through the constructor even where older classes inject fields.

Reimplementing an existing helper's operation belongs to duplication; one
decision spread across files belongs to change-locality. This lens owns the
choice between approaches to a concern. Name the concerns searched and the uses
compared in coverage, so a clean result shows what was looked for.
