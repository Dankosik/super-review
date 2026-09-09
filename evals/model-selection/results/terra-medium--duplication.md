## C-duplication-1: Centralize the free-shipping threshold

- Lens and task: duplication; `duplication`.
- Snapshot: PR `https://github.com/example/model-fixture/pull/1`, H `bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb`, comparison D `cccccccccccccccccccccccccccccccccccccccc`.
- Location: `internal/shipping/fees.go`, `Fee` lines 2–5 and `CartMessage` lines 6–9.
- Rules: `go.duplication.share-knowledge`.
- Observation and cost: both functions embed `15000`, which represents the one pricing-owned free-shipping threshold. A pricing change requires coordinated edits; missing one makes checkout pricing and the cart message disagree.
- Transformation and benefit: name the threshold once within `shipping` (for example, a package constant) and use it in both comparisons. This makes the shared policy explicit and gives it one maintenance point.
- Counterargument: keeping the literal beside each decision makes each short function self-contained; this is reasonable only if the values do not represent one shared policy.
- Preserve: boundary behavior (`subtotal >= threshold`), fee/message outputs, and the existing public function contracts.
- Affected files: local change in `internal/shipping/fees.go`.
- Missing context: none.

Excluded: tests, generated files, vendor trees, binaries, and unsupported languages; none were supplied. The two eligibility functions were inspected and intentionally have no duplication candidate: their credit policies have independent ownership.
