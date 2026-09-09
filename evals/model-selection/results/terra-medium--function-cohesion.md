## C-function-cohesion-1: Extract CSV row interpretation from `Load`

- Lens and task: function-cohesion; function-cohesion.
- Snapshot: PR `https://github.com/example/model-fixture/pull/1`, H `bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb`, comparison D `cccccccccccccccccccccccccccccccccccccccc`.
- Location: `internal/importer/load.go`, `Load`.
- Rules: `go.functions.extract-for-clarity`, `go.functions.coherent-purpose`.
- Observation and cost: `Load` both translates the four-field CSV representation into a `Customer` (arity validation, normalization, conversion, and defaults) and iterates/saves customers. The format-boundary details obscure the loop’s persistence and fail-fast responsibility.
- Transformation and benefit: extract row interpretation into a focused helper such as `parseCustomer(row []string) (Customer, error)`, then let `Load` iterate, call it, and save. The existing `NormalizeRegion` can be used by that helper if its semantics are intended as the shared region-normalization contract.
- Counterargument: the interpretation is currently short and used only once, so keeping it inline avoids an extra jump while reading.
- Preserve: exact validation and wrapped age-parse error behavior; trimming/case/default semantics; `Store.Save` ordering; and immediate return on parse or save error.
- Affected files: local change in `internal/importer/load.go`.
- Missing context: none.

Excluded from review: tests, generated files, vendor trees, binaries, and unsupported-language files; none were supplied.
