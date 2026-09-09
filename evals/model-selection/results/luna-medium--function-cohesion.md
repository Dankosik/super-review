## C-function-cohesion-1: Extract row interpretation from `Load`

- Lens and task: Function cohesion; `function-cohesion`.
- Snapshot: PR `https://github.com/example/model-fixture/pull/1`, H `bbbb…bbbb`, comparison D `cccc…cccc`.
- Location: `internal/importer/load.go`, `Load`; parsing at lines 7–14.
- Rules: `go.functions.extract-for-clarity`, `go.functions.coherent-purpose`; no team overrides.
- Observation and cost: `Load` both interprets the CSV row format and controls iteration/persistence. The format-boundary logic obscures the loop’s main responsibility and duplicates region normalization despite the existing `NormalizeRegion` helper.
- Transformation and benefit: Extract a helper such as `parseCustomer(row []string) (Customer, error)` and use `NormalizeRegion` within it. `Load` then validates/parses each row, saves customers in order, and fails fast while the format contract is localized.
- Counterargument: The parsing is short, and keeping it inline makes the complete import flow visible.
- Preserve: Four-field validation, parsing error identity/wrapping, `Store.Save` order, fail-fast behavior, context propagation, and normalization semantics.
- Affected files: Local change in `internal/importer/load.go`.
- Missing context: none.

Exclusions: no tests, generated files, vendor trees, binaries, or unsupported-language files were supplied.
