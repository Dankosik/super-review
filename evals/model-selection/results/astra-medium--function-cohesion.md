## C-function-cohesion-1: Extract the CSV row interpretation

- Lens and task: function-cohesion; `function-cohesion`. Completed review of all supplied declarations and callers.
- Snapshot: PR https://github.com/example/model-fixture/pull/1; H `bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb`; comparison D `cccccccccccccccccccccccccccccccccccccccc`.
- Location: `internal/importer/load.go`, `Load`, lines 7–14.
- Rules: `go.functions.extract-for-clarity`, `go.functions.coherent-purpose`.
- Observation and cost: `Load` embeds field positions, normalization, defaults, and conversion errors between iteration and persistence. This distinct format boundary obscures the loop’s parse-then-save sequence and duplicates region normalization already expressed by `NormalizeRegion`.
- Transformation and benefit: Extract an unexported `parseCustomer(row []string) (Customer, error)` and reuse `NormalizeRegion` within it. Keep iteration, immediate error returns, and `Store.Save` in `Load`. The helper gives the CSV interpretation one coherent contract.
- Counterargument: The function is short and its sequential flow is readable; extraction adds a navigation step. The explicit format boundary and existing normalization helper make that step useful here.
- Preserve: Four-field validation before indexing; exact normalization and defaults; age-error wrapping; row order; save each successfully parsed customer before interpreting the next row; stop on the first parsing or saving error.
- Affected files: Local change to `internal/importer/load.go` only.
- Missing context: None for this recommendation. Go 1.22 is supplied; no `go.mod` was included.
- Exclusions: Tests (`*_test.go`), generated files, vendor trees, binaries, and unsupported languages; none supplied.
