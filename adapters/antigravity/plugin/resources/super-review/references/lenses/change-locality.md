# Change locality

## go.change.localize-existing-variation

**Change coupling.** Trace one responsibility through the files implicated by
the PR. Identify Shotgun Surgery, where expressing its current change requires
coordinated edits because the same implementation decision is distributed, and
Divergent Change, where one place changes for unrelated reasons. Anchor the
claim in actual changed sites and inspected context, not an imagined next feature.

Localize that decision at an existing or proportionate boundary with a concrete
owner. Show which coordinated edits disappear and which dependencies remain.
The benefit is not the smallest file count: transport mapping, domain policy,
and persistence may legitimately change together while owning different
representations or contracts.

Keep separate responsibilities separate even when their shapes resemble each
other, and leave each layer that mentions a concept its own part of it. A
registry, plugin system, generic pipeline or extension point answers variation
present today; for variation that is only imagined it is Speculative Generality.
A new boundary is useful when it reduces the knowledge required to make the
demonstrated change.

Name all verified participating paths and the decision they share. Report this
locality rationale independently; the parent reconciles it with abstraction or
duplication advice about the same transformation.
