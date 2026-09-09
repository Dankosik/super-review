## C-control-flow-1: Flatten redundant conditional nesting

- Lens and task: control-flow / `go.flow.show-main-path`
- Snapshot: PR `https://github.com/example/model-fixture/pull/1`, H `bbbb…bbbb`, comparison D `cccc…cccc`.
- Location: `internal/delivery/publish.go`, `Publish`, lines 5–13.
- Rules: `go.flow.show-main-path`; Go 1.22.
- Observation and cost: The `enabled` branch nests a second condition and uses redundant `else` blocks, obscuring the linear behavior after the mandatory audit.
- Transformation and benefit: After `s.Audit(body)`, return `nil` when disabled or when `body == ""`; otherwise return `s.Emit(body)`. This exposes the main path while preserving audit execution and effect ordering.
- Counterargument: The explicit branches may make the two disabled cases visually distinct.
- Preserve: Always call `Audit` exactly once, call `Emit` only when enabled with a non-empty body, and return its error unchanged.
- Affected files: Local change to `internal/delivery/publish.go`.
- Missing context: `none`.

Exclusions: no tests, generated files, vendor trees, binaries, or unsupported-language files were supplied.

Status: `completed`.
