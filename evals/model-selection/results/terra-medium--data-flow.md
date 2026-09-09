## C-data-flow-1: Name the address representations in `Export`

- Lens and task: data-flow; `data-flow`.
- Snapshot: PR #1, H `bbbbbbbb`, comparison D `cccccccc`.
- Location: `internal/exporter/address.go`, `Export`, lines 6–10.
- Rules: `go.data.make-transformations-visible`; Go 1.22.
- Observation and cost: `data` is reused for the raw address, trimmed address, uppercased address, and query-escaped output. These are distinct representations, so a reader cannot identify a value’s stage from its name.
- Transformation and benefit: use stage-specific values such as `trimmedAddress`, `upperAddress`, and `escapedAddress` before writing. This makes the transformation pipeline and final output representation visible.
- Counterargument: the current short linear sequence is compact and its transformations are individually apparent.
- Preserve: transformation order, exact `strings`/`url` semantics, error propagation, and the writer call’s single effect.
- Affected files: local change in `internal/exporter/address.go`.
- Missing context: none.

completed — inspected all supplied Go source for the data-flow lens. `SortInPlace` and `FirstSortedKey` need no recommendation: their shared backing-array mutation is explicit and documented as API behavior. Excluded: tests, generated files, vendor trees, binaries, and unsupported languages; none were supplied.
