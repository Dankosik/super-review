## C-naming-1: Rename `Resolve`’s `data` parameter to `lookupKey`

- Lens and task: `go.naming.intent`, naming.
- Snapshot: PR `https://github.com/example/model-fixture/pull/1`, H `bbbb…bbbb`, comparison D `cccc…cccc`.
- Location: `internal/customer/lookup.go`, `Resolve`, line 5; use at line 6.
- Rules: Default naming guidance; team vocabulary distinguishes customer entities from outbound clients.
- Observation and cost: `data` obscures that the value is a customer lookup key, especially alongside the returned `record`.
- Transformation and benefit: Rename `data` to `lookupKey` so the function’s input role is explicit at its declaration and store call.
- Counterargument: The function is short, and `data` is locally understandable.
- Preserve: Function behavior, lookup key value, error identity, and effect order.
- Affected files: Local change to `internal/customer/lookup.go`.
- Missing context: `none`.

Exclusions: no tests, generated files, vendor trees, binaries, or unsupported-language files were supplied.

completed — inspected all supplied Go files for the naming lens.
