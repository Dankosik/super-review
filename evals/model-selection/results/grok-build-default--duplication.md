## C-duplication-1: Extract repeated free-shipping threshold to a constant

- Lens and task: duplication (go.duplication.share-knowledge)
- Snapshot: PR https://github.com/example/model-fixture/pull/1, H: bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb, comparison D: cccccccccccccccccccccccccccccccccccccccc
- Location: internal/shipping/fees.go, Fee (lines 2-5), CartMessage (lines 6-9) at H
- Rules: go.duplication.share-knowledge (default; no team overrides)
- Observation and cost: Fee and CartMessage both hard-code the literal 15000 for the free-shipping threshold. Per the supplied ownership note, pricing owns this single shared threshold and the two paths (checkout fee, cart message) must change together. A future threshold update therefore requires two coordinated edits inside the same file, with risk of inconsistency.
- Transformation and benefit: Add an unexported package constant `const freeShippingThreshold int64 = 15000` and replace both comparisons with `subtotal >= freeShippingThreshold`. The rule is defined once; all future adjustments to the threshold are made in a single location and automatically apply to both uses.
- Counterargument: The functions are small, adjacent, and newly added; the literal is short, local, and arguably self-documenting, so the duplication may be cheaper than introducing even a minimal named declaration.
- Preserve: Exact signatures, return values, and effect ordering of Fee and CartMessage; no new exported symbols; pricing ownership and lifetime of the threshold remain in the shipping package.
- Affected files: internal/shipping/fees.go (local change)
- Missing context: none

completed (duplication lens on supplied snapshot; only the shipping free-shipping rule qualified for unification; eligibility functions excluded per explicit independent-ownership note)
