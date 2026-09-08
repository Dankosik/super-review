# Change locality

## go.change.localize-existing-variation

Find responsibilities or axes of variation already visible in the change.
Recommend a boundary when one existing decision is scattered across files that
must repeatedly change together. Show those files and that shared decision.

Useful: the same existing output-format mapping is copied across command paths,
so adding an already supported format requires editing unrelated dispatch sites.
Counterexample: two unrelated handlers perform similar persistence steps but
serve independent rules.

Locality is semantic, not the smallest possible file count. Keeping a dependency
at a clear boundary may justify another file. Do not create registries, plugin
systems, generic pipelines, or layers for an imagined next feature.

Keep context reads and proposed edits tied to this PR. A cross-file change needs
verified participating paths and a concrete owner for the responsibility.
Coordinate with abstractions and duplication when they concern the same change.
