## C-control-flow-1: Flatten Publish with an early return

- Lens and task: control-flow; `control-flow`.
- Snapshot: PR https://github.com/example/model-fixture/pull/1; H `bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb`; comparison D `cccccccccccccccccccccccccccccccccccccccc`.
- Location: `internal/delivery/publish.go`, `Publish`, lines 3–14.
- Rules: `go.flow.show-main-path`; no team overrides.
- Observation and cost: Nested branches and two identical `return nil` alternatives obscure the simple path from auditing to optional emission.
- Transformation and benefit: Keep `s.Audit(body)` first, then use `if !enabled || body == "" { return nil }`, followed by `return s.Emit(body)`. This makes the emission path direct.
- Counterargument: The existing branches explicitly separate disabled delivery from an empty body, though neither alternative performs distinct work.
- Preserve: Audit every attempt exactly once, before any emission; emit exactly once only when enabled with a nonempty body; return its error unchanged.
- Affected files: Local change to `internal/delivery/publish.go`.
- Missing context: none.

Completed: inspected all supplied declarations, including `Sink` and `IsAllowed`, under Go 1.22. No additional candidates. Scope was limited to the supplied offline snapshot. Exclusions: tests (`*_test.go`), generated files, vendor trees, binaries, and unsupported languages; none supplied.
